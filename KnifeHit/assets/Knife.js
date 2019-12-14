var gameEvent = require('GameEvent');

cc.Class({
    extends: cc.Component,

    properties: {
        collisionAngle: 9,
        sprites: [cc.SpriteFrame],
        glows: [cc.SpriteFrame],
        trees: [cc.SpriteFrame],
        earth: cc.SpriteFrame,
        earthglow: cc.SpriteFrame,
        dot: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        let knife = this.knife = cc.find('knife');
        let y = this.y = knife.y;
        let node = this.node;
        node.children[0].opacity = 0;
        this.knifeList = node.children[2];
        this.obstacle = node.children[3];
        this.star = node.children[4];
        this.cover = node.children[6];
        this.revive = -1;

        gameEvent.TAP.push(this.onclick.bind(this));
        gameEvent.KNIFE.push(this.onKnife.bind(this));
        gameEvent.STAGE.push(this.onStage.bind(this));
        gameEvent.START.push(this.onGameStart.bind(this));
        gameEvent.RESET.push(this.reset.bind(this));
        gameEvent.REVIVE.push(this.onRevive.bind(this));
        gameEvent.SHOW_REVIVE.push(this.onShowRevive.bind(this));

        this.seq1 = cc.sequence(cc.moveTo(0.1, 0, node.y - 430), cc.callFunc(this.onHit.bind(this)));
        this.seq2 = cc.sequence(cc.moveBy(0.1, 0, 30), cc.moveBy(0.1, 0, -30));
        this.seq3 = cc.sequence(cc.fadeTo(0.1, 200), cc.fadeOut(0.1));
        this.seq4 = cc.sequence(cc.moveTo(0.1, 0, y), cc.callFunc(this.onResume.bind(this)));
        this.seq5 = cc.sequence(cc.fadeIn(0.3), cc.delayTime(1), cc.fadeOut(0.2));

        this.reset();
    },

    reset() {
        let node = this.node;
        node.active = true;
        node.opacity = 0;
        this.knife.active = false;
        this.pause = true;
    },

    onGameStart(count) {
        let node = this.node;
        node.opacity = 255;

        let sprite = node.children[5];
        let id = Math.floor(Math.random() * this.sprites.length);
        sprite.getComponent(cc.Sprite).spriteFrame = this.sprites[id];

        let glow = node.children[1];
        glow.getComponent(cc.Sprite).spriteFrame = this.glows[id];

        this.cover.setContentSize(sprite);

        sprite.scale = 0;
        node.scale = 1;
        sprite.runAction(cc.sequence(cc.scaleTo(0.2, 1.15)
            , cc.callFunc(this.spawnObstacle.bind(this, count))
            , cc.callFunc(this.spawnStar.bind(this))
            , cc.scaleTo(0.1, 1)));
    },

    spawnObstacle(count) {
        count = 11 - count;
        let c = this.collisionAngle;
        let m = Math.floor(360 / c);
        let a = 0;
        let r = this.node.width * 0.52;
        let parent = this.obstacle;
        let node = parent.children[0];
        node.active = true;
        let list = this.rotList = [];
        while (--count > 0) {
            a += 5 + Math.floor(Math.random() * m);
            a > m && (a -= m);

            let rot = a * c;
            let obj = cc.instantiate(node);
            obj.parent = parent;
            obj.rotation = -rot - 135;

            list.push((rot + 90) % 360);
            //cc.log(rot);

            rot *= Math.PI / 180;
            obj.setPosition(r * Math.cos(rot), r * Math.sin(rot));
        }

        node.active = false;
        gameEvent.invoke('PLAY_SOUND', 'targetappear');
    },

    spawnStar() {
        let count = Math.floor((Math.random() - 0.5) * 7);
        let c = this.collisionAngle;
        let m = Math.floor(360 / c);
        let a = -4;
        let r = this.node.width * 0.6;
        let parent = this.star;
        let node = parent.children[0];
        node.active = true;
        let list = this.rotList;
        let list2 = this.starList = [];
        let angle = this.collisionAngle * 2;
        while (count > 0) {
            a += 4;
            a > m && (a -= m);
            let rot = a * c;

            let t = (rot + 90) % 360;
            for (let i of list) if (Math.abs(t - i) < angle) t = -1;
            if (t < 0) continue;
            for (let i of list2) if (Math.abs(t - i) < angle) t = -1;

            --count;
            let obj = cc.instantiate(node);
            obj.parent = parent;
            obj.rotation = -rot + 90;
            //cc.log(rot);
            list2.push(obj);

            rot *= Math.PI / 180;
            obj.setPosition(r * Math.cos(rot), r * Math.sin(rot));
        }

        node.active = false;

        let knife = this.knife;
        knife.active = true;
        knife.rotation = 0;
        knife.setPosition(0, this.y - 200);
        knife.runAction(this.seq4);
    },

    onFailed() {
        this.clear();
        this.reset();
        this.revive = -1;
        gameEvent.invoke('GAME_OVER');
    },

    onRevive() {
        this.node.active = true;
        this.revive = 0;
        this.knife.stopAllActions();
        this.onKnife();
    },

    onShowRevive(isOn) {
        this.node.active = !isOn;
        this.knife.runAction(cc.sequence(cc.spawn(
            cc.rotateBy(1, 1300), cc.jumpTo(1, 0, this.y - 2000, 0, 1))
            , cc.delayTime(isOn ? 2 : 0.1)
            , cc.callFunc(this.onFailed.bind(this))));
    },

    onHit() {
        let list = this.rotList;
        let node = this.node;
        let rotation = node.rotation;
        let knife = this.knife;

        while (rotation < 0) rotation += 360;
        rotation = Math.floor(rotation) % 360;
        let angle = this.collisionAngle;
        for (let r of list) {
            if (Math.abs(r - rotation) < angle) {
                let dot = this.dot;
                dot.opacity = 150;
                dot.scale = 0;
                dot.setPosition(knife);
                dot.runAction(cc.spawn(cc.scaleTo(0.2, 0.7), cc.fadeOut(0.3)));
                gameEvent.invoke('FAILED', this.revive);
                gameEvent.invoke('PLAY_SOUND', 'gameover');
                return;
            }
        }

        list.push(rotation);
        gameEvent.invoke('PLAY_SOUND', 'hit');

        list = this.starList;
        for (let i of list) {
            if (i.opacity < 255) continue;
            let r = (90 - i.rotation + 90) % 360;
            if (Math.abs(r - rotation) < angle) {
                gameEvent.invoke('COIN');
                i.runAction(cc.sequence(cc.spawn(
                    cc.scaleTo(0.3, 2), cc.fadeOut(0.3)),
                    cc.callFunc(gameEvent.invoke.bind(gameEvent, 'PLAY_SOUND', 'coin'))));
                break;
            }
        }

        knife = cc.instantiate(knife);
        //cc.director.getScene().addChild(knife);
        gameEvent.invoke('HIT');

        knife.parent = this.knifeList;
        knife.rotation = -rotation;
        knife.setPosition(node.convertToNodeSpaceAR(knife));

        this.cover.stopAllActions();
        node.runAction(this.seq2);
        this.cover.runAction(this.seq3);
    },

    onStage() {
        this.knife.active = false;
        this.node.runAction(cc.sequence(cc.scaleTo(0.15, 1.2),
            cc.callFunc(this.onEarth.bind(this)), cc.scaleTo(0.1, 1),
            cc.delayTime(1),
            cc.scaleTo(0.15, 1.2), cc.scaleTo(0.1, 0),
            cc.callFunc(this.clear.bind(this))));
    },

    clear() {
        let list = this.obstacle.children;
        let count = list.length;
        for (let i = 1; i < count; ++i) {
            list[i].destroy();
        }

        list = this.star.children;
        count = list.length;
        for (let i = 1; i < count; ++i) {
            list[i].destroy();
        }

        list = this.knifeList.children;
        count = list.length;
        for (let i = 0; i < count; ++i) {
            list[i].destroy();
        }
    },

    onEarth() {
        let list = this.node.children;
        let sprite = list[5].getComponent(cc.Sprite);
        let glow = list[1].getComponent(cc.Sprite);
        sprite.spriteFrame = this.earth;
        glow.spriteFrame = this.earthglow;
        list[0].runAction(this.seq5);
        gameEvent.invoke('PLAY_SOUND', 'unlock');
    },

    onKnife() {
        let knife = this.knife;
        //knife.stopAllActions();
        knife.rotation = 0;
        knife.setPosition(0, this.y - 200);
        knife.setSiblingIndex(1);

        knife.runAction(this.seq4);

        let list = this.trees;
        let id = Math.floor(Math.random() * list.length);
        knife.getComponent(cc.Sprite).spriteFrame = list[id];
    },

    onResume() {
        this.pause = false;
    },

    onclick() {
        if (!this.pause) {
            this.pause = true;
            let knife = this.knife;
            knife.stopAllActions();
            knife.runAction(this.seq1);
        }
    },
});

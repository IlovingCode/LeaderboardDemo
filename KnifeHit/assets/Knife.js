var gameEvent = require('GameEvent');

cc.Class({
    extends: cc.Component,

    properties: {
        collisionAngle: 9,
        sprites: [cc.SpriteFrame],
        earth: cc.SpriteFrame,
        obstacle: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        let knife = this.knife = cc.find('knife');
        let y = this.y = knife.y;

        gameEvent.TAP.push(this.onclick.bind(this));
        gameEvent.KNIFE.push(this.onKnife.bind(this));
        gameEvent.STAGE.push(this.onStage.bind(this));
        gameEvent.START.push(this.onGameStart.bind(this));
        gameEvent.RESET.push(this.reset.bind(this));

        this.seq1 = cc.sequence(cc.moveTo(0.1, 0, this.node.y - 430), cc.callFunc(this.onHit.bind(this)));
        this.seq2 = cc.sequence(cc.moveBy(0.1, 0, 30), cc.moveBy(0.1, 0, -30));
        this.seq3 = cc.sequence(cc.fadeTo(0.1, 200), cc.fadeOut(0.1));
        this.seq4 = cc.sequence(cc.moveTo(0.1, 0, y), cc.callFunc(this.onResume.bind(this)));
        this.seq5 = cc.sequence(cc.spawn(cc.rotateBy(1, 1300), cc.jumpTo(1, 0, y - 2000, 0, 1))
            , cc.callFunc(this.onFailed.bind(this)));
    },

    reset() {
        this.enabled = false;
        this.knife.active = false;
        this.pause = true;
    },

    onGameStart(count) {
        let node = this.node;
        let knife = this.knife;
        knife.active = true;
        this.enabled = true;

        let sprite = node.children[0];
        let id = Math.floor(Math.random() * this.sprites.length);
        sprite.getComponent(cc.Sprite).spriteFrame = this.sprites[id];

        this.cover = node.children[1];
        this.cover.setContentSize(sprite);

        knife.setPosition(0, this.y - 200);
        knife.runAction(this.seq4);

        sprite.scale = 0;
        node.scale = 1;
        sprite.runAction(cc.sequence(cc.scaleTo(0.2, 1.15)
            , cc.callFunc(this.spawnObstacle.bind(this, count))
            , cc.scaleTo(0.1, 1)));
    },

    spawnObstacle(count) {
        count = 11 - count;
        let c = this.collisionAngle;
        let m = Math.floor(360 / c);
        let a = Math.floor(Math.random() * m);
        let r = this.node.width * 0.5;
        let node = this.obstacle;
        node.active = true;
        let list = this.rotList = [];
        while (--count > 0) {
            a += 3 + Math.floor(Math.random() * m);
            a > m && (a -= m);

            let rot = a * c;
            let obj = cc.instantiate(node);
            obj.parent = this.node;
            obj.setSiblingIndex(0);
            obj.rotation = -rot;

            list.push((rot + 87) % 360);
            //cc.log(rot);

            rot *= Math.PI / 180;
            obj.setPosition(r * Math.cos(rot), r * Math.sin(rot));
        }

        node.active = false;
        gameEvent.invoke('PLAY_SOUND', 'targetappear');
    },

    onFailed() {
        gameEvent.invoke('GAME_OVER');
    },

    onHit() {
        this.pause = true;
        let list = this.rotList;
        let node = this.node;
        let rotation = node.rotation;
        let knife = this.knife;

        while (rotation < 0) rotation += 360;
        rotation = Math.floor(rotation) % 360;
        let angle = this.collisionAngle;
        for (let r of list) {
            if (Math.abs(r - rotation) < angle) {
                knife.runAction(this.seq5);
                gameEvent.invoke('PLAY_SOUND', 'gameover');
                return;
            }
        }

        knife = cc.instantiate(knife);
        cc.director.getScene().addChild(knife);

        list.push(rotation);
        gameEvent.invoke('HIT');
        gameEvent.invoke('PLAY_SOUND', 'hit');

        knife.parent = node;
        knife.setSiblingIndex(0);
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
        let list = this.node.children;
        let count = list.length - 3;
        for (let i = 0; i < count; ++i) {
            list[i].destroy();
        }
    },

    onEarth() {
        let list = this.node.children;
        let sprite = list[list.length - 3].getComponent(cc.Sprite);
        sprite.spriteFrame = this.earth;
        gameEvent.invoke('PLAY_SOUND', 'unlock');
    },

    onKnife() {
        let knife = this.knife;
        //knife.stopAllActions();
        knife.setPosition(0, this.y - 200);
        knife.setSiblingIndex(1);

        knife.runAction(this.seq4);
    },

    onResume() {
        this.pause = false;
    },

    onclick() {
        if (!this.pause) {
            let knife = this.knife;
            knife.stopAllActions();
            knife.runAction(this.seq1);
        }
    },
});

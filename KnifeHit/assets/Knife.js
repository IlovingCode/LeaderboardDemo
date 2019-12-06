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
        this.enabled = false;
        let knife = this.knife = cc.find('knife');
        knife.active = false;

        gameEvent.START.push(this.onGameStart.bind(this));
    },

    onGameStart(count) {
        let node = this.node;
        let knife = this.knife;
        knife.active = true;
        this.enabled = true;
        let y = this.y = knife.y;
        this.seq1 = cc.sequence(cc.moveTo(0.1, 0, node.y - 430), cc.callFunc(this.onHit.bind(this)));
        this.seq2 = cc.sequence(cc.moveBy(0.1, 0, 30), cc.moveBy(0.1, 0, -30));
        this.seq3 = cc.sequence(cc.fadeTo(0.1, 200), cc.fadeOut(0.1));
        this.seq4 = cc.sequence(cc.moveTo(0.1, 0, this.y), cc.callFunc(this.onResume.bind(this)));
        this.seq5 = cc.sequence(cc.spawn(cc.rotateBy(1, 1300), cc.jumpTo(1, 0, y - 2000, 0, 1))
            , cc.callFunc(this.onFailed.bind(this)));

        gameEvent.TAP.push(this.onclick.bind(this));
        gameEvent.KNIFE.push(this.onKnife.bind(this));
        gameEvent.STAGE.push(this.onStage.bind(this));

        let sprite = node.children[0];
        let id = Math.floor(Math.random() * this.sprites.length);
        sprite.getComponent(cc.Sprite).spriteFrame = this.sprites[id];

        this.cover = node.children[1];
        this.cover.setContentSize(sprite);

        knife.setPosition(0, y - 200);
        knife.runAction(this.seq4);

        this.pause = true;
        sprite.scale = 0;
        sprite.runAction(cc.sequence(cc.scaleTo(0.2, 1.15)
            , cc.callFunc(this.spawnObstacle.bind(this, count))
            , cc.scaleTo(0.1, 1)));
        node.getComponent('Target').enabled = true;
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
            cc.log(rot);

            rot *= Math.PI / 180;
            obj.setPosition(r * Math.cos(rot), r * Math.sin(rot));
        }

        node.active = false;
    },

    onFailed() {
        gameEvent.invoke('GAME_OVER');
    },

    onHit() {
        this.pause = true;
        let list = this.rotList;
        let node = this.node;
        let knife = this.knife;
        let rotation = node.rotation;

        while (rotation < 0) rotation += 360;
        rotation = Math.floor(rotation) % 360;
        let angle = this.collisionAngle;
        for (let r of list) {
            if (Math.abs(r - rotation) < angle) {
                knife.runAction(this.seq5);
                return;
            }
        }
        list.push(rotation);

        gameEvent.invoke('HIT');

        knife.parent = node;
        knife.setSiblingIndex(0);
        knife.rotation = -rotation;
        knife.setPosition(node.convertToNodeSpaceAR(knife));

        this.cover.stopAllActions();
        node.runAction(this.seq2);
        this.cover.runAction(this.seq3);
    },

    onStage() {
        this.node.runAction(cc.sequence(cc.scaleTo(0.15, 1.2),
            cc.callFunc(this.onEarth.bind(this)), cc.scaleTo(0.1, 1),
            cc.delayTime(1),
            cc.scaleTo(0.15, 1.2), cc.scaleTo(0.1, 0)));
    },

    onEarth() {
        let list = this.node.children;
        let sprite = list[list.length - 3].getComponent(cc.Sprite);
        sprite.spriteFrame = this.earth;
    },

    onKnife() {
        let knife = this.knife = cc.instantiate(this.knife);
        knife.setPosition(0, this.y - 200);
        knife.rotation = 0;
        cc.director.getScene().addChild(knife);
        knife.setSiblingIndex(1);

        knife.runAction(this.seq4);
    },

    onResume() {
        this.pause = false;
    },

    onclick() {
        !this.pause && this.knife.runAction(this.seq1);
    },
});

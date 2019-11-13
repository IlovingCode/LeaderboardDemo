var gameEvent = require('GameEvent');

cc.Class({
    extends: cc.Component,

    properties: {
        rot: 10,
        sprites: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        let knife = this.knife = cc.find('knife');
        this.y = knife.y;
        this.seq1 = cc.sequence(cc.moveTo(0.1, 0, -300), cc.callFunc(this.onHit.bind(this))
            , cc.delayTime(0.2), cc.callFunc(this.onResume.bind(this)));
        this.seq2 = cc.sequence(cc.moveBy(0.1, 0, 30), cc.moveBy(0.1, 0, -30));
        this.seq3 = cc.sequence(cc.fadeTo(0.1, 200), cc.fadeOut(0.1));
        this.seq4 = cc.moveTo(0.1, 0, this.y);

        gameEvent.TAP.push(this.onclick.bind(this));

        let node = this.node;
        let sprite = node.children[0];
        let id = Math.floor(Math.random() * this.sprites.length);
        sprite.getComponent(cc.Sprite).spriteFrame = this.sprites[id];

        this.cover = node.children[1];
        this.cover.setContentSize(sprite);

        this.rotList = [];
    },

    onHit() {
        let list = this.rotList;
        let node = this.node;
        let rotation = Math.floor(node.rotation) % 360;
        for (let r of list) {
            if (Math.abs(r - rotation) < 13) {
                cc.director.loadScene('game');
                break;
            }
        }
        this.pause = true;
        list.push(rotation);

        let knife = this.knife;

        knife.parent = node;
        knife.setSiblingIndex(0);
        knife.rotation = -rotation;
        knife.setPosition(node.convertToNodeSpaceAR(knife));

        this.knife = knife = cc.instantiate(knife);
        knife.setPosition(0, this.y - 200);
        knife.rotation = 0;
        cc.director.getScene().addChild(knife);
        knife.setSiblingIndex(2);

        node.runAction(this.seq2);
        this.cover.runAction(this.seq3);
        knife.runAction(this.seq4);
    },

    onResume() {
        this.pause = false;
    },

    onclick() {
        !this.pause && this.knife.runAction(this.seq1);
    },

    update(dt) {
        this.node.rotation += this.rot * dt;
    },
});

var gameEvent = require('GameEvent');

cc.Class({
    extends: cc.Component,

    properties: {
        frame: cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.sprite = this.node.getComponent(cc.Sprite);
        gameEvent.HIT.push(this.onHit.bind(this));
    },

    onHit() {
        this.sprite.spriteFrame = this.frame;
    },

    // update (dt) {},
});

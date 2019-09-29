

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.player = cc.find('player');
        this.delta = this.node.y - this.player.y;
    },

    update(dt) {
        let y = this.player.y + this.delta;
        let node = this.node;
        if (node.y < y) {
            node.y = (node.y + y) * 0.5;
        }
    },
});

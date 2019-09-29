cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.stair = this.node.children[1];
        this.wall = this.node.children[0];
    },

    set(color, scale, pos) {
        let node = this.node;
        this.wall.color = color;
        this.stair.color = color;

        // random position
        let c = this.c = 2 + Math.floor(Math.random() * 4);
        let x = 5 - Math.floor(Math.random() * (7 - c));
        let y = c * 50;
        let p = cc.v2(x * 50, y - this.stair.height);
        this.stair.setPosition(p);
        this.wall.setPosition(p);

        node.setPosition(540, pos.y);
        node.color = color;
        node.setScale(scale, 1);
        node.setSiblingIndex(0);

        pos.y += y;

        return c;
    },

    getEnemyPos() {
        let stair = this.stair;
        let node = this.node;
        return cc.v2(stair.x * node.scaleX + node.x, stair.y + stair.height + node.y);
    },

    getFootPos() {
        let stair = this.stair;
        let node = this.node;
        let c = this.c + 1;
        return cc.v2((stair.x - c * 50) * node.scaleX + node.x, node.y);
    }

    // update (dt) {},
});

var gameEvent = require('GameEvent');

cc.Class({
    extends: cc.Component,

    properties: {
        delay: 2,
    },

    // LIFE-CYCLE CALLBACKS:
    start() {
        gameEvent.GAME_OVER.push(this.onGameOver.bind(this));
    },

    onGameOver() {
        this.node.active = false;
    },


    set(p1) {
        let node = this.node;
        node.setPosition(p1.node);
        node.opacity = 255;
        node.color = p1.node.color;

        node.active = true;
        let p = p1.stair.getCoinPos();
        let s = p1.node.scaleX;
        p.x += Math.random() * 500 * s;
        node.runAction(cc.sequence(
            cc.jumpTo(this.delay * 0.3, p, 150 + Math.random() * 500, 1),
            cc.moveBy(this.delay * (Math.random() + 0.3), (Math.random() + 0.1) * 300 * s, 0)));
        this.time = Math.random() + 0.3;
    },

    update(dt) {
        let time = this.time;
        time += dt;
        if (time > this.delay) {
            let node = this.node;
            node.opacity--;
            if (node.opacity <= 0) node.active = false;
        }

        this.time = time;
    },
});

var gameEvent = require('GameEvent');

cc.Class({
    extends: cc.Component,

    properties: {
        delay: 2,
        speed: 1,
    },

    // LIFE-CYCLE CALLBACKS:

    start() {
        gameEvent.GAME_OVER.push(this.onGameOver.bind(this));
    },

    onGameOver() {
        this.node.active = false;
        gameEvent.invoke('COIN_CHANGED', 1);
    },

    set(p1, p2) {
        let node = this.node;
        node.setPosition(p1.node);
        this.target = p2;

        node.active = true;
        node.runAction(cc.sequence(
            cc.jumpTo(this.delay * 0.3, p1.stair.getCoinPos(), 200, 1),
            cc.moveBy(this.delay * 0.7, 100 * p1.node.scaleX, 0)));
        this.time = 0;
    },

    update(dt) {
        let time = this.time;
        time += dt;
        if (time > this.delay) {
            let p = this.node;
            let t = this.target;
            let d = cc.v2(t.x - p.x, t.y - p.y).normalize();
            let s = this.speed * dt;
            p.x += d.x * s;
            p.y += d.y * s;

            if (Math.abs(p.x - t.x) < 10) {
                p.active = false;
                gameEvent.invoke('COIN_CHANGED', 1);
            }
        }

        this.time = time;
    },
});

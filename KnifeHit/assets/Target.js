var gameEvent = require('GameEvent');
var stage = 0;

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        let id = 1;
        let level = Math.floor(stage / 5);
        if (++stage % 5 == 0) id = Math.floor(Math.random() * 4) + 2;

        this.seq1 =
            cc.rotateBy(5 - level * 0.1, 360);
        this.seq2 = cc.sequence(
            cc.rotateBy(3 - level * 0.1, 200),
            cc.rotateBy(2 - level * 0.1, -100));
        this.seq3 = cc.sequence(
            cc.rotateBy(2 - level * 0.1, 200),
            cc.rotateBy(2 - level * 0.1, -200),
            cc.rotateBy(2 - level * 0.1, 200),
            cc.rotateBy(2 - level * 0.1, -500));
        this.seq4 = cc.sequence(
            cc.rotateBy(4 - level * 0.1, 100),
            cc.rotateBy(2 - level * 0.1, 500));
        this.seq5 = cc.sequence(
            cc.rotateBy(4 - level * 0.1, 350),
            cc.rotateBy(4 - level * 0.1, -350));

        this.node.runAction(cc.repeatForever(this['seq' + id]));

        gameEvent.GAME_OVER.push(this.onGameOver.bind(this));
    },

    onGameOver() {
        stage = 0;
    }
});

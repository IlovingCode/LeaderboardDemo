var gameEvent = require('GameEvent');
var stage = 0;
var delta = 0.1;

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:
    start() {
        gameEvent.GAME_OVER.push(this.onGameOver.bind(this));
        gameEvent.START.push(this.reset.bind(this));
    },

    reset() {
        let level = Math.floor(stage++ / 5);
        let id = 0;
        if (stage > 1)
            if (stage % 5 == 0) id = 3 + Math.floor(Math.random() * 5);
            else id = Math.floor(Math.random() * 3);

        this.node.runAction(cc.repeatForever(this['seq' + id](Math.min(level, 10) * delta)));
    },

    seq0(level) {
        return cc.rotateBy(5 - level, 360);
    },

    seq1(level) {
        return cc.rotateBy(5 - level, -360);
    },

    seq2(level) {
        return cc.sequence(
            cc.rotateBy(3 - level, 200),
            cc.rotateBy(2 - level, -100));
    },

    seq3(level) {
        return cc.sequence(
            cc.rotateBy(2 - level, 200),
            cc.rotateBy(2 - level, -200),
            cc.rotateBy(2 - level, 200),
            cc.rotateBy(2 - level, -500));
    },

    seq4(level) {
        return cc.sequence(
            cc.rotateBy(4 - level, 100),
            cc.rotateBy(2 - level, 500));
    },

    seq5(level) {
        return cc.sequence(
            cc.rotateBy(4 - level, 350),
            cc.rotateBy(4 - level, -350));
    },

    seq6(level) {
        level *= 0.5;
        return cc.sequence(
            cc.rotateBy(1 - level, 50),
            cc.rotateBy(1 - level, -50),
            cc.rotateBy(1 - level, 50),
            cc.rotateBy(1 - level, -50),
            cc.rotateBy(1 - level, 50),
            cc.rotateBy(1 - level, -100)
        );
    },

    seq7(level) {
        return cc.sequence(
            cc.rotateBy(2 - level, 200),
            cc.rotateBy(2 - level, 300),
            cc.rotateBy(2 - level, 400),
            cc.rotateBy(2 - level, 500),
            cc.rotateBy(2 - level, 600),
            cc.rotateBy(2 - level, 700),
            cc.rotateBy(2 - level, 800),
            cc.rotateBy(2 - level, 700),
            cc.rotateBy(2 - level, 600),
            cc.rotateBy(2 - level, 500),
            cc.rotateBy(2 - level, 400),
            cc.rotateBy(2 - level, 300)
        );
    },

    onGameOver() {
        stage = 0;
    }
});

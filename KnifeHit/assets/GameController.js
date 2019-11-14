var gameEvent = require('GameEvent');
var bestScore = 0;
var score = 0;

cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        score: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        gameEvent.resetAll();
    },

    start() {
        cc.find('Camera').on('touchstart', gameEvent.invoke.bind(gameEvent, 'TAP'));
        gameEvent.HIT.push(this.onHit.bind(this));
        gameEvent.GAME_OVER.push(this.onGameOver.bind(this));

        let content = this.content;
        let template = content.children[0];

        let count = this.count = 10 + Math.floor(Math.random() * 5);
        while (--count > 0) {
            let obj = cc.instantiate(template);
            content.addChild(obj);
        }

        this.score.string = score;
    },

    onHit() {
        score++;
        this.score.string = score;
        let count = --this.count;
        this.content.children[count].color = cc.Color.BLACK;

        if (!count)
            cc.director.loadScene('game');
    },

    onGameOver() {
        if (score > bestScore) bestScore = score;
        score = 0;
        cc.director.loadScene('game');
    }

    // update (dt) {},
});

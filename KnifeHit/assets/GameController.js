var gameEvent = require('GameEvent');
var bestScore = 0;
var score = 0;
var stage = 0;

cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        score: cc.Label,
        stage: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        gameEvent.resetAll();
    },

    start() {
        cc.find('Camera').on('touchstart', gameEvent.invoke.bind(gameEvent, 'TAP'));
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, gameEvent.invoke.bind(gameEvent, 'TAP'), this);
        gameEvent.HIT.push(this.onHit.bind(this));
        gameEvent.GAME_OVER.push(this.onGameOver.bind(this));

        let content = this.content;
        let template = content.children[0];
        let isBoss = ++stage % 5 == 0;

        let count = this.count = (isBoss ? 13 : 7) + Math.floor(Math.random() * 3);
        while (--count > 0) {
            let obj = cc.instantiate(template);
            content.addChild(obj);
        }

        this.stage.node.color = isBoss ? cc.Color.RED : cc.Color.WHITE;

        this.stage.string = 'Stage ' + stage;
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
        stage = 0;
        cc.director.loadScene('game');
    }

    // update (dt) {},
});

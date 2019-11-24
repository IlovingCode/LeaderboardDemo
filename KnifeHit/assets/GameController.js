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
        preBoss: cc.Animation,
        postBoss: cc.Animation,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        gameEvent.resetAll();
        gameEvent.HIT.push(this.onHit.bind(this));
        gameEvent.GAME_OVER.push(this.onGameOver.bind(this));

        let isBoss = ++stage % 5 == 0;

        let content = this.content;
        let template = content.children[0];
        let count = this.count = (isBoss ? 13 : 7) + Math.floor(Math.random() * 3);
        while (--count > 0) {
            let obj = cc.instantiate(template);
            content.addChild(obj);
        }

        let stageObj = this.stage;
        stageObj.node.color = isBoss ? cc.color(255, 100, 100) : cc.Color.WHITE;

        stageObj.string = isBoss ? ('Boss ' + Math.floor(stage / 5)) : ('Stage ' + stage);
        this.score.string = score;

        let list = stageObj.node.children;
        let m = stage % list.length - 1;
        m < 0 && (m = list.length - 1);
        for (let i = 0; i < m; i++) {
            if (isBoss) {
                list[i].active = false;
            }
            else list[i].color = cc.color(255, 200, 0);
        }

        list[m].runAction(cc.sequence(
            cc.scaleTo(0.1, 1.5), cc.scaleTo(0.1, 1),
            isBoss ? cc.tintTo(0.1, 255, 100, 100) : cc.tintTo(0.1, 255, 200, 0),
            isBoss && cc.moveTo(0.3, 0, list[m].y),
        ));

        let preBoss = this.preBoss;

        if (isBoss) {
            content.active = false;
            this.enabled = false;
            preBoss.node.active = true;
            preBoss.once('finished', this.onFinish.bind(this));
        } else {
            preBoss.node.active = false;
        }
    },

    onFinish() {
        this.enabled = true;
    },

    start() {
        cc.find('Camera').on('touchstart', gameEvent.invoke.bind(gameEvent, 'TAP'));
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, gameEvent.invoke.bind(gameEvent, 'TAP'), this);

        //this.stage.enabled = true;
        this.content.active = true;
        gameEvent.invoke('START');
    },

    onHit() {
        score++;
        this.score.string = score;
        let count = --this.count;
        this.content.children[count].color = cc.Color.BLACK;

        if (!count) {
            let isBoss = stage % 5 == 0;
            let stageObj = this.stage;
            stageObj.enabled = false;
            if (isBoss) {
                let list = stageObj.node.children;
                let m = list.length - 1;

                list[m].runAction(cc.sequence(
                    cc.tintTo(0.1, 255, 255, 255),
                    cc.moveTo(0.3, 106, list[m].y)
                ));

                let preBoss = this.preBoss;
                preBoss.once('finished', cc.director.loadScene.bind(cc.director, 'game', null, null));
                preBoss.play('postBoss');
            } else {
                stageObj.node.runAction(cc.sequence(
                    cc.delayTime(0.4),
                    cc.callFunc(cc.director.loadScene.bind(cc.director, 'game', null, null))
                ));
            }
            gameEvent.invoke('STAGE');
        } else gameEvent.invoke('KNIFE');
    },

    onGameOver() {
        if (score > bestScore) bestScore = score;
        score = 0;
        stage = 0;
        cc.director.loadScene('game');
    }

    // update (dt) {},
});

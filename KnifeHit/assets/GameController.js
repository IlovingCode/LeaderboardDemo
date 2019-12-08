var gameEvent = require('GameEvent');
var Profile = require('Profile');
var score = 0;
var stage = 0;

cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        score: cc.Label,
        stage: cc.Label,
        preBoss: cc.Animation,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        gameEvent.resetAll();

        let content = this.content;
        let template = content.children[0];
        let count = 11;
        while (--count > 0) {
            let obj = cc.instantiate(template);
            content.addChild(obj);
        }
    },

    reset() {
        let isBoss = ++stage % 5 == 0;

        let content = this.content;
        let list = content.children;
        let length = list.length;
        let count = this.count = (isBoss ? 9 : 5) + Math.floor(Math.random() * 3);
        for (let i = 0; i < length; ++i) {
            let node = list[i];
            node.active = i < count;
            node.color = cc.color('8DBF2C');
        }

        let stageObj = this.stage;
        stageObj.node.color = isBoss ? cc.color(255, 100, 100) : cc.color('FFC80D');

        stageObj.string = isBoss ? ('Boss ' + Math.floor(stage / 5)) : ('Stage ' + stage);
        this.score.string = score;

        list = stageObj.node.children;
        let m = stage % list.length - 1;
        m < 0 && (m = list.length - 1);
        for (let i = 0; i < m; i++) {
            if (isBoss) {
                list[i].active = false;
            }
            else list[i].color = cc.color(141, 191, 44);
        }

        list[m].runAction(cc.sequence(
            cc.scaleTo(0.1, 1.5), cc.scaleTo(0.1, 1),
            cc.tintTo(0.1, 141, 191, 44),
            isBoss && cc.moveTo(0.3, 0, list[m].y),
        ));

        gameEvent.invoke('RESET');
        let preBoss = this.preBoss;

        if (isBoss) {
            content.active = false;
            preBoss.node.active = true;
            preBoss.once('finished', this.onFinish.bind(this));
        } else {
            preBoss.node.active = false;
            this.onFinish();
        }
    },

    onFinish() {
        cc.find('Camera').on('touchstart', gameEvent.invoke.bind(gameEvent, 'TAP'));
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, gameEvent.invoke.bind(gameEvent, 'TAP'), this);

        //this.stage.enabled = true;
        this.content.active = true;
        gameEvent.invoke('START', this.count);
    },

    start() {
        gameEvent.HIT.push(this.onHit.bind(this));
        gameEvent.GAME_OVER.push(this.onGameOver.bind(this));

        this.reset();
    },

    onHit() {
        score++;
        this.score.string = score;
        let count = --this.count;
        this.content.children[count].color = cc.color('281E5A');

        if (!count) {
            let isBoss = stage % 5 == 0;
            let stageObj = this.stage;
            stageObj.enabled = false;
            if (isBoss) {
                let list = stageObj.node.children;
                let m = list.length - 1;

                list[m].runAction(cc.sequence(
                    cc.delayTime(1.3),
                    cc.tintTo(0.1, 0, 0, 0),
                    cc.moveTo(0.3, 106, list[m].y),
                    cc.callFunc(this.onPostBoss.bind(this))
                ));
            } else {
                stageObj.node.runAction(cc.sequence(
                    cc.delayTime(1.7),
                    cc.callFunc(this.reset.bind(this))
                ));
            }
            gameEvent.invoke('STAGE');
        } else gameEvent.invoke('KNIFE');
    },

    onPostBoss() {
        let preBoss = this.preBoss;
        preBoss.once('finished', this.reset.bind(this));
        preBoss.play('postBoss');
    },

    onGameOver() {
        Profile.setBestScore(score);
        score = 0;
        stage = 0;
        cc.director.loadScene('main');
    }

    // update (dt) {},
});

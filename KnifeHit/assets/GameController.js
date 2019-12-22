var gameEvent = require('GameEvent');
var Profile = require('Profile');
var score = 0;
var stage = 0;
var coin = 0;

cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        score: cc.Label,
        coin: cc.Label,
        stage: cc.Label,
        preBoss: cc.Animation,
        pixel: cc.Node,
        revive: cc.Node,
        price: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        gameEvent.resetAll();
        Profile.load(); // for play test

        let content = this.content;
        let template = content.children[0];
        let count = 11;
        while (--count > 0) {
            let obj = cc.instantiate(template);
            content.addChild(obj);
        }

        this.seq = cc.sequence(cc.fadeTo(0.1, 150), cc.fadeOut(0.2));
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
        stageObj.enabled = true;
        stageObj.node.color = isBoss ? cc.color(255, 100, 100) : cc.color('FF9900');

        stageObj.string = isBoss ? ('Màn khó ' + Math.floor(stage / 5)) : ('Màn ' + stage);
        this.score.string = score;

        list = stageObj.node.children;
        length = list.length;
        let m = stage % length - 1;
        m < 0 && (m = length - 1);
        for (let i = 0; i < length; i++) {
            let t = list[i];
            t.active = !isBoss || i >= m;
            t.color = cc.color(i < m ? 'FF9900' : '281E5A');
        }

        list[m].runAction(cc.sequence(
            cc.scaleTo(0.1, 1.5), cc.scaleTo(0.1, 1),
            cc.tintTo(0.1, 255, 153, 0),
            isBoss && cc.moveTo(0.3, 0, list[m].y),
        ));

        gameEvent.invoke('RESET');
        let preBoss = this.preBoss;

        if (isBoss) {
            content.active = false;
            preBoss.node.active = true;
            preBoss.once('finished', this.onFinish.bind(this));
            preBoss.play();
            gameEvent.invoke('PLAY_SOUND', 'preboss');
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
        gameEvent.FAILED.push(this.onFailed.bind(this));
        gameEvent.COIN.push(this.onCoin.bind(this));
        gameEvent.GAME_START.push(this.onGameStart.bind(this));

        coin = Profile.coin;
        this.coin.string = coin;
        this.revive.active = false;
    },

    onCoin() {
        coin++;
        this.coin.string = coin;
    },

    onRevive() {
        coin -= this.price;
        this.coin.string = coin;

        this.revive.active = false;
        this.pixel.runAction(this.seq);
        gameEvent.invoke('REVIVE', -this.price);
    },

    onFailed(hasRevive) {
        let revive = this.revive;
        if (hasRevive < 0 && coin >= this.price) {
            //TODO
            revive.active = true;
            revive.scale = 0;
            revive.runAction(cc.sequence(cc.scaleTo(0.1, 1.2), cc.scaleTo(0.2, 1)));
        };

        gameEvent.invoke('SHOW_REVIVE', revive.active);
        this.pixel.runAction(this.seq);
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
        gameEvent.invoke('PLAY_SOUND', 'endboss');
    },

    onGameOver() {
        Profile.set(score, coin);
        this.revive.active = false;
        let list = this.stage.node.children;
        list[list.length - 1].x = 106;
    },

    getData() {
        return [stage, score];
    },

    getCoin() {
        return coin;
    },

    onGameStart() {
        score = 0;
        stage = 0;
    },

    // update (dt) {},
});

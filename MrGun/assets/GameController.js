var gameEvent = require('GameEvent');

cc.Class({
    extends: cc.Component,

    properties: {
        mainMenu: cc.Node,
        actionPhase: cc.Node,
        coinTxt: cc.Label,
        scoreTxt: cc.Label,
        bestScoreTxt: cc.Label,
        lifeBar: cc.ProgressBar,
        subScore: cc.Label,
        splash: cc.Node,
        perfect: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    start() {
        gameEvent.GAME_OVER.push(this.onGameOver.bind(this));
        gameEvent.POST_GAME.push(this.onPostGame.bind(this));
        gameEvent.ENEMY_KILLED.push(this.onEnemyKilled.bind(this));
        gameEvent.COIN_CHANGED.push(this.onCoinChanged.bind(this));
        gameEvent.BOSS_HEALTH.push(this.onBossHealth.bind(this));

        gameEvent.SPLASH.push(this.onHeadShot.bind(this));

        this.bestScore = cc.sys.localStorage.getItem('bestScore') || 0;
        this.coin = cc.sys.localStorage.getItem('coin') || 0;
        this.coinTxt.string = this.coin;
        this.bestScoreTxt.string = this.bestScore;

        this.seq = cc.spawn(cc.moveBy(0.5, 0, 100), cc.fadeOut(0.5));
        this.seq2 = cc.sequence(cc.delayTime(0.5),
            cc.spawn(cc.scaleTo(0.3, 1, 1), cc.moveTo(0.3, 0, 800)),
            cc.callFunc(this.showHealthBar.bind(this)));

        this.seq3 = cc.sequence(cc.fadeTo(0.1, 200), cc.fadeOut(0.5));
        this.seq4 = cc.spawn(
            cc.scaleTo(0.2, 1, 1),
            cc.sequence(cc.fadeIn(0.2), cc.delayTime(0.5), cc.fadeOut(0.3)));
    },

    onHeadShot(player) {
        this.splash.runAction(this.seq3);
        let perfect = this.perfect;
        perfect.node.scale = 3;
        if (!player) {
            perfect.string = 'HOÀN HẢO' + (this.combo > 1 ? (' x' + this.combo) : '');
            perfect.node.runAction(this.seq4);
        } else this.combo = 1;
    },

    onEnemyKilled(headshot) {
        if (headshot) this.combo++;
        else this.combo = 1;

        let s = (headshot ? this.combo : 1) * this.boss;
        this.score += s;
        this.scoreTxt.string = this.score;

        this.subScore.string = '+' + s;

        let node = this.subScore.node;
        node.color = cc.color(headshot ? 'ffc800' : 'ffffff');
        node.opacity = 255;
        node.y = -200;
        node.runAction(this.seq);

        node = this.lifeBar.node;
        node.active = false;
        (this.lifeBar.progress < 0.1) && (node.parent.active = false);
    },

    showHealthBar() {
        this.lifeBar.node.active = true;
    },

    onBossHealth(amount) {
        if (amount == 1) {
            this.boss++;
            let node = this.lifeBar.node.parent;
            node.active = true;
            node.scale = 2;
            node.y = 250;
            node.runAction(this.seq2);
        }
        else amount += 0.001;

        this.lifeBar.progress = amount;
    },

    onCoinChanged(amount) {
        this.coin += amount;
        this.coinTxt.string = this.coin;
    },

    play() {
        this.mainMenu.active = false;
        this.actionPhase.active = true;
        this.score = 0;
        this.boss = 1;
        this.combo = 1;
        this.scoreTxt.string = '0';
        gameEvent.invoke('GAME_START');
    },

    onGameOver() {
        this.mainMenu.active = true;
        this.actionPhase.active = false;
        let node = this.lifeBar.node;
        node.active = false;
        node.parent.active = false;
        gameEvent.invoke('PLAY_SOUND', 'ev_back_to_game');

        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.bestScoreTxt.string = this.score;
        }
    },

    onPostGame() {
        cc.sys.localStorage.setItem('bestScore', this.bestScore);
        cc.sys.localStorage.setItem('coin', this.coin);
    }

    // update (dt) {},
});

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
    },

    // LIFE-CYCLE CALLBACKS:

    start() {
        gameEvent.GAME_OVER.push(this.onGameOver.bind(this));
        gameEvent.ENEMY_KILLED.push(this.onEnemyKilled.bind(this));
        gameEvent.COIN_CHANGED.push(this.onCoinChanged.bind(this));
        gameEvent.BOSS_HEALTH.push(this.onBossHealth.bind(this));
        this.bestScore = 0;
        this.coin = 0;
        this.coinTxt.string = '0';
        this.bestScoreTxt.string = '0';
    },

    onEnemyKilled(headshot) {
        this.score += headshot ? 2 : 1;
        this.scoreTxt.string = this.score;
    },

    onBossHealth(amount) {
        this.lifeBar.node.active = amount > 0;
        this.lifeBar.progress= amount;
    },

    onCoinChanged(amount) {
        this.coin += amount;
        this.coinTxt.string = this.coin;
    },

    play() {
        this.mainMenu.active = false;
        this.actionPhase.active = true;
        this.score = 0;
        this.scoreTxt.string = '0';
        gameEvent.invoke('GAME_START');
    },

    onGameOver() {
        this.mainMenu.active = true;
        this.actionPhase.active = false;

        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.bestScoreTxt.string = this.score;
        }
    }

    // update (dt) {},
});

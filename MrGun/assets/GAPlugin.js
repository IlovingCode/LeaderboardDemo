var ga = require('gameanalytics');
var gameEvent = require('GameEvent');

cc.Class({
    extends: cc.Component,

    properties: {
        key: 'game key',
        secret: 'secret key',
        version: '0.0.1'
    },

    // LIFE-CYCLE CALLBACKS:

    start() {
        ga.GameAnalytics.setEnabledInfoLog(true);
        ga.GameAnalytics.setEnabledVerboseLog(true);

        //ga.GameAnalytics.setEnabledEventSubmission(false);
        //ga.GameAnalytics.configureAvailableResourceCurrencies(['coin']);

        ga.GameAnalytics.configureBuild(this.version);
        ga.GameAnalytics.initialize(this.key, this.secret);


        gameEvent.GAME_START.push(this.onGameStart.bind(this));
        gameEvent.GAME_OVER.push(this.onGameOver.bind(this));
        gameEvent.BOSS_HEALTH.push(this.onBossHealth.bind(this));
        gameEvent.COIN_CHANGED.push(this.onCoinChanged.bind(this));

        ga.GameAnalytics.addProgressionEvent(ga.EGAProgressionStatus.Start, "session");
        this.playTime = 0;
    },

    onGameStart() {
        ga.GameAnalytics.addProgressionEvent(ga.EGAProgressionStatus.Start, "startGame");
        this.playTime++;
    },

    onGameOver() {
        let gameController = cc.find('Canvas').getComponent('GameController');
        ga.GameAnalytics.addProgressionEvent(ga.EGAProgressionStatus.Complete,
            "startGame", gameController.score);
    },

    onBossHealth(amount) {
        //ga.GameAnalytics.addProgressionEvent(ga.EGAProgressionStatus.Complete,
        //    "startGame", gameController.score);
    },

    onCoinChanged(amount) {

    },

    onDestroy() {
        ga.GameAnalytics.addProgressionEvent(ga.EGAProgressionStatus.Complete, 
            "session", this.playTime);
    }
});

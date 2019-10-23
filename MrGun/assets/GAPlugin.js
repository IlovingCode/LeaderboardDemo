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
        ga.GameAnalytics.configureAvailableResourceCurrencies(['coin']);
        ga.GameAnalytics.configureAvailableResourceItemTypes(['kill', 'item']);
        ga.GameAnalytics.configureAvailableCustomDimensions01(['headshot', 'armor']);

        ga.GameAnalytics.configureBuild(this.version);
        ga.GameAnalytics.initialize(this.key, this.secret);


        gameEvent.GAME_START.push(this.onGameStart.bind(this));
        gameEvent.GAME_OVER.push(this.onGameOver.bind(this));
        gameEvent.COIN_CHANGED.push(this.onCoinChanged.bind(this));

        ga.GameAnalytics.addProgressionEvent(ga.EGAProgressionStatus.Complete, 'game', 'launch');
        this.playTime = 0;
        this.coin = 0;

        this.game = cc.find('Canvas').getComponent('GameController');
        this.spawner = cc.find('Camera').getComponent('spawner');
    },

    onGameStart() {
        this.playTime++;
        ga.GameAnalytics.addProgressionEvent(ga.EGAProgressionStatus.Complete,
            'game', 'session', 'start' + this.playTime);

        let coin = this.game.coin - this.coin;
        if (coin > 0) {
            ga.GameAnalytics.addResourceEvent(ga.EGAResourceFlowType.Source,
                'coin', coin, 'kill', 'headshot');
            this.coin = this.game.coin;
        }
    },

    onGameOver() {
        ga.GameAnalytics.addProgressionEvent(ga.EGAProgressionStatus.Complete,
            'game', 'session', 'end' + this.playTime);
        ga.GameAnalytics.addProgressionEvent(ga.EGAProgressionStatus.Complete,
            'game', 'boss_' + this.game.boss, 'enemy_' + (this.spawner.id % 9), this.game.score);
    },

    onCoinChanged(amount) {
        if (amount > 0) return;
        ga.GameAnalytics.addResourceEvent(ga.EGAResourceFlowType.Sink,
            'coin', -amount, 'item', 'armor');

        this.coin -= amount;
    },
});

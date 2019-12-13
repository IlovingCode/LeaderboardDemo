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
        //ga.GameAnalytics.setEnabledInfoLog(true);
        //ga.GameAnalytics.setEnabledVerboseLog(true);

        //ga.GameAnalytics.setEnabledEventSubmission(false);
        ga.GameAnalytics.configureAvailableResourceCurrencies(['coin']);
        ga.GameAnalytics.configureAvailableResourceItemTypes(['collect', 'item']);
        ga.GameAnalytics.configureAvailableCustomDimensions01(['star', 'revive']);

        ga.GameAnalytics.configureBuild(this.version);
        ga.GameAnalytics.initialize(this.key, this.secret);


        gameEvent.GAME_START.push(this.onGameStart.bind(this));
        gameEvent.GAME_OVER.push(this.onGameOver.bind(this));
        gameEvent.REVIVE.push(this.onCoinChanged.bind(this));

        ga.GameAnalytics.addProgressionEvent(ga.EGAProgressionStatus.Complete, 'game', 'launch');
        this.playTime = 0;
        this.coin = 0;

        this.game = cc.find('Canvas').getComponent('GameController');
        //this.spawner = cc.find('Camera').getComponent('spawner');
    },

    onGameStart() {
        this.playTime++;
        ga.GameAnalytics.addProgressionEvent(ga.EGAProgressionStatus.Complete,
            'game', 'session', 'start_' + this.playTime);

        let data = this.game.getCoin();
        let coin = data - this.coin;
        if (coin > 0) {
            ga.GameAnalytics.addResourceEvent(ga.EGAResourceFlowType.Source,
                'coin', coin, 'collect', 'star');
            this.coin = data;
        }
    },

    onGameOver() {
        let data = this.game.getData();
        ga.GameAnalytics.addProgressionEvent(ga.EGAProgressionStatus.Complete,
            'game', 'session', 'end_' + this.playTime);
        ga.GameAnalytics.addProgressionEvent(ga.EGAProgressionStatus.Complete,
            'game', 'boss_' + Math.floor(data[0] / 5), 'stage_' + data[0], data[1]);
    },

    onCoinChanged(amount) {
        if (amount > 0) return;
        ga.GameAnalytics.addResourceEvent(ga.EGAResourceFlowType.Sink,
            'coin', -amount, 'item', 'revive');

        this.coin += amount;
    },
});

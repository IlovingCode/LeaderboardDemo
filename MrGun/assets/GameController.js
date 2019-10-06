var gameEvent = require('GameEvent');


cc.Class({
    extends: cc.Component,

    properties: {
        mainMenu: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    start() {
        gameEvent.GAME_OVER.push(this.onGameOver.bind(this));
    },

    play() {
        this.mainMenu.active = false;
        gameEvent.invoke('GAME_START');
    },

    onGameOver() {
        this.mainMenu.active = true;
    }

    // update (dt) {},
});

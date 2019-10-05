var gameEvent = require('GameEvent');


cc.Class({
    extends: cc.Component,

    properties: {
        mainMenu: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad() { },

    play() {
        this.mainMenu.active = false;
        gameEvent.invoke('GAME_START');
    },

    // update (dt) {},
});

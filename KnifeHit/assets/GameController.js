var gameEvent = require('GameEvent');

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        gameEvent.resetAll();
    },

    start() {
        this.node.on('touchstart', gameEvent.invoke.bind(gameEvent, 'TAP'));
    },

    // update (dt) {},
});

var Profile = require('Profile');
var gameEvent = require('GameEvent');

cc.Class({
    extends: cc.Component,

    properties: {
        playBtn: cc.Node,
        bestScore: cc.Label,

        mainMenu: cc.Node,
        actionPhase: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.playBtn.runAction(cc.repeatForever(cc.sequence(
            cc.scaleTo(0.3, 1.1),
            cc.scaleTo(0.3, 0.9),
            cc.scaleTo(0.3, 1.2),
            cc.scaleTo(0.3, 1),
            cc.delayTime(2)
        )));

        this.bestScore.string = Profile.bestScore;

        this.switch(true);

        gameEvent.GAME_OVER.push(this.onGameOver.bind(this));
    },

    switch(isOn) {
        this.mainMenu.active = isOn;
        this.actionPhase.active = !isOn;
    },

    onGameOver() {
        this.switch(true);
    },
    
    play() {
        this.switch(false);
    },



    // update (dt) {},
});

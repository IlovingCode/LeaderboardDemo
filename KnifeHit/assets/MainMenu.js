var Profile = require('Profile');

cc.Class({
    extends: cc.Component,

    properties: {
        playBtn: cc.Node,
        bestScore: cc.Label,
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

        Profile.load();
        this.bestScore.string = Profile.bestScore;
    },

    play() {
        cc.director.loadScene('game');
    },

    // update (dt) {},
});

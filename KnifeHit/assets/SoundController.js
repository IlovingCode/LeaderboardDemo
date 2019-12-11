var gameEvent = require('GameEvent');

cc.Class({
    extends: cc.Component,

    properties: {
        volume: 1.0,
        clips: {
            type: cc.AudioClip,
            default: []
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.audio = new cc.Audio();
        this.audio.setLoop(false);
        this.audio.setVolume(this.volume);
        gameEvent.PLAY_SOUND.push(this.play.bind(this));
    },

    play(name) {
        let audio = this.audio;
        audio.stop();
        audio.src = this.clips.find(e => { return e.name == name; });
        audio.setCurrentTime(0);
        audio.play();
    },

    // update (dt) {},
});

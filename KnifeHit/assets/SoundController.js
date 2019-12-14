var gameEvent = require('GameEvent');

cc.Class({
    extends: cc.Component,

    properties: {
        count: 1,
        volume: 1.0,
        clips: {
            type: cc.AudioClip,
            default: []
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.audio = [];

        let c = this.count;
        for (let i = 0; i < c; ++i) {
            let audio = new cc.Audio();
            audio.setLoop(false);
            audio.setVolume(this.volume);
            this.audio.push(audio);
        }

        this.id = 0;
        gameEvent.PLAY_SOUND.push(this.play.bind(this));
    },

    play(name) {
        let id = (this.id + 1) % this.audio.length;
        this.id = id;
        let audio = this.audio[id];
        audio.stop();
        audio.src = this.clips.find(e => { return e.name == name; });
        audio.setCurrentTime(0);
        audio.play();
    },

    // update (dt) {},
});

cc.Class({
    extends: cc.Component,

    properties: {
        interval: 0.1,
        sprites: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.sprite = this.node.getComponent(cc.Sprite);
        this.onDisable();
    },

    onDisable() {
        this.timer = 0;
        this.id = 0;
        this.sprite.spriteFrame = this.sprites[this.id++];
    },

    update(dt) {
        let t = this.timer - dt;
        if (t < 0) {
            let id = this.id;
            this.sprite.spriteFrame = this.sprites[id++];
            id == this.sprites.length && (id = 0);
            this.id = id;
            t = this.interval;
        }
        this.timer = t;
    },
});

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.seq1 = cc.rotateBy(1.5 + Math.random() * 0.5, 360);
        this.seq2 = cc.sequence(cc.rotateBy(2, 200), cc.rotateBy(1, -100));
        this.seq3 = cc.sequence(cc.rotateBy(1, 200), cc.rotateBy(1, -200),
            cc.rotateBy(1, 200), cc.rotateBy(1, -500));
        this.seq4 = cc.sequence(cc.rotateBy(2, 100), cc.rotateBy(1, 500));

        let id = Math.floor(Math.random() * 4) + 1;
        this.node.runAction(cc.repeatForever(this['seq' + id]));
    },
});

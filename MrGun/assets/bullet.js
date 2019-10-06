cc.Class({
    extends: cc.Component,

    properties: {
        speed: 100,
    },

    // LIFE-CYCLE CALLBACKS:

    start() {
        let seq2 = cc.sequence(cc.fadeOut(0.3), cc.callFunc(this.onFinish.bind(this)));
        this.seq = cc.spawn(cc.scaleTo(0.3, 7), seq2);
    },

    onFinish() {
        let node = this.node;
        node.active = false;
        node.opacity = 255;
        node.setScale(0.5);
        this.target.checkAlive();
    },

    set(pos, rot, c, target) {
        rot *= Math.PI / 180;
        this.vx = Math.cos(rot) * this.speed * c;
        this.vy = -Math.sin(rot) * this.speed * c;
        this.target = target;

        this.node.setPosition(pos);
        this.node.active = true;
        this.enabled = true;
    },

    onHit(target) {
        let node = this.node;
        this.enabled = false;
        node.runAction(this.seq);
        target.kill();
    },

    aimPlayer(p1, p2, target) {
        let node = this.node;
        this.enabled = false;
        node.active = true;
        node.setPosition(p1);

        let seq = cc.sequence(cc.moveTo(0.1, p2),
            cc.callFunc(this.onHit.bind(this, target)));

        node.runAction(seq);
    },

    update(dt) {
        let node = this.node;
        let pos = node.getPosition();
        let p = cc.v2(pos);
        p.x += this.vx * dt;
        p.y += this.vy * dt;

        let hit = this.target.stair.check(pos, cc.v2(p));
        if (hit) {
            this.onFinish();
            return;
        }

        hit = this.target.check(pos, cc.v2(p));
        if (hit) {
            node.setPosition(hit);
            this.onHit(this.target);
        } else node.setPosition(p);

        if (pos.x < 0 || pos.x > 1100) {
            this.onFinish();
        }
    },
});

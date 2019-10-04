cc.Class({
    extends: cc.Component,

    properties: {
        speed: 100,
    },

    // LIFE-CYCLE CALLBACKS:

    start() {
        this.enemy = cc.find('enemy').getComponent('enemy');

        this.seq = cc.sequence(cc.scaleTo(0.1, 1), cc.callFunc(this.onFinish.bind(this)));
    },

    onFinish() {
        this.node.active = false;
        this.enabled = true;
        this.node.children[0].setScale(0);
    },

    set(pos, rot, c) {
        rot *= Math.PI / 180;
        this.vx = Math.cos(rot) * this.speed * c;
        this.vy = -Math.sin(rot) * this.speed * c;

        this.node.setPosition(pos);
        this.node.active = true;
    },

    update(dt) {
        let node = this.node;
        let pos = node.getPosition();
        let p = cc.v2(pos);
        p.x += this.vx * dt;
        p.y += this.vy * dt;

        let hit = this.enemy.stair.check(pos, cc.v2(p));
        if (hit) {
            node.setPosition(hit);
            this.enabled = false;
            return;
        }

        hit = this.enemy.check(pos, cc.v2(p));
        if (hit) {
            node.setPosition(hit);
            this.enabled = false;
            node.children[0].runAction(this.seq);
            this.enemy.kill();
        } else node.setPosition(p);

        if (pos.x < 0 || pos.x > 1100) {
            node.active = false;
        }
    },
});

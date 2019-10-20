var gameEvent = require('GameEvent');

cc.Class({
    extends: cc.Component,

    properties: {
        speed: 100,
        bullet: cc.SpriteFrame,
        glow: cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    start() {
        let seq2 = cc.sequence(cc.fadeOut(0.3), cc.callFunc(this.onFinish.bind(this)));
        this.seq = cc.spawn(cc.scaleTo(0.3, 2), seq2);

        this.sprite = this.node.getComponent(cc.Sprite);
    },

    onFinish() {
        let node = this.node;
        node.active = false;
        node.opacity = 255;
        node.setScale(1.0);
        this.sprite.spriteFrame = this.bullet;
        this.target.checkAlive();
    },

    set(pos, rot, c, target) {
        let node = this.node;
        node.rotation = rot + 180;
        rot *= Math.PI / 180;
        this.vx = Math.cos(rot) * this.speed * c;
        this.vy = -Math.sin(rot) * this.speed * c;
        this.target = target;

        node.setPosition(pos);
        node.color = cc.Color.WHITE;
        node.active = true;
        this.enabled = true;
    },

    onHit(target) {
        let node = this.node;
        this.enabled = false;
        this.sprite.spriteFrame = this.glow;
        node.runAction(this.seq);
        //node.color = target.node.color;
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
        gameEvent.invoke('PLAY_SOUND', 'ev_gun_4');
    },

    update(dt) {
        let node = this.node;
        let pos = node.getPosition();
        let p = cc.v2(pos);
        p.x += this.vx * dt;
        p.y += this.vy * dt;

        let target = this.target;
        let hit = target.stair.check(pos, cc.v2(p));
        if (hit) {
            this.onFinish();
            return;
        }

        hit = target.check(pos, cc.v2(p));
        if (hit) {
            node.setPosition(hit);
            this.onHit(target);
        } else node.setPosition(p);

        if (pos.x < 0 || pos.x > 1100) {
            this.onFinish();
        }
    },
});

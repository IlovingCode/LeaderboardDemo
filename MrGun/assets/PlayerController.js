var gameEvent = require('GameEvent');

var fireInterval = 5;

cc.Class({
    extends: cc.Component,

    properties: {
        gun: cc.Node,
        rot: 1,
        min: 45,
        max: 90,
        bullet: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad() { },

    start() {
        this.enemy = cc.find('enemy').getComponent('enemy');
        this.bulletPos = this.gun.children[0];
        this.bulletPool = cc.find('bulletPool');
        this.count = 1;
        this.enabled = false;

        gameEvent.GAME_START.push(this.onGameStart.bind(this));
    },

    onGameStart() {
        this.enabled = true;
    },

    onDisable() {
        this.gun.rotation = 90;
    },

    up(stair) {
        let foot = stair.getFootPos();
        let p = stair.getEnemyPos();
        this.node.runAction(cc.sequence(
            cc.moveTo(0.3, foot),
            cc.jumpTo(stair.c * 0.1, p, 50, stair.c),
            cc.jumpTo(0.1, cc.v2(this.node.scaleX < 0 ? 250 : 850, p.y), 50, 1),
            cc.callFunc(this.onFaceBack.bind(this))));
    },

    onFaceBack() {
        this.fireCount = 0;
        let scale = this.node.scaleX;
        this.node.scaleX = -scale;
    },

    fire() {
        !this.fireCount && (this.fireCount = this.count * fireInterval);
    },

    update(dt) {
        let c = this.fireCount;
        if (c > 1) {
            if (c % fireInterval == 0) {
                let pool = this.bulletPool.children;
                let bullet = null;
                // get from pool
                for (let i of pool) !i.active && (bullet = i);
                if (!bullet) { // if not, create new one
                    bullet = cc.instantiate(this.bullet);
                    bullet.parent = this.bulletPool;
                }
                bullet.getComponent('bullet').set(
                    this.gun.convertToWorldSpaceAR(this.bulletPos),
                    this.node.scaleX > 0 ? (this.gun.rotation - 90) : (270 - this.gun.rotation),
                    1.0 / this.count, this.enemy);
                this.rot *= -1;
            }

            this.fireCount--;
        }

        let r = this.gun.rotation;
        r -= dt * this.rot;
        if (r > this.max) this.rot = Math.abs(this.rot);
        if (r < this.min) this.rot = -Math.abs(this.rot);
        this.gun.rotation = r;
    },

    kill() {
        //if (this.dead) return;
        //this.dead = true;
        let scale = this.node.scaleX;
        this.seq = cc.sequence(
            cc.spawn(
                cc.rotateBy(0.5, -scale * 1000),
                cc.jumpTo(0.5, cc.v2(
                    scale < 0 ? 1300 : (-100), this.node.y - 500),
                    500, 1)),
            cc.callFunc(this.onFinish.bind(this)));
        this.node.runAction(this.seq);
    },

    onFinish() {
        //this.node.rotation = 0;
        //this.node.scaleX *= -1;
        gameEvent.invoke('GAME_OVER');
    },
});

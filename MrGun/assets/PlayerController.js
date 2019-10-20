var gameEvent = require('GameEvent');

var fireInterval = 5;

cc.Class({
    extends: cc.Component,

    properties: {
        gun: cc.Node,
        gunFire: cc.Node,
        deltaSpeed: 2,
        minSpeed: 30,
        maxSpeed: 40,
        min: 45,
        max: 90,
        bullet: cc.Prefab,
        matLoader: require('MaterialLoader'),
        particle: cc.ParticleSystem,
        armor: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.enemy = cc.find('enemy').getComponent('enemy');
        this.bulletPos = this.gun.children[0];
        this.bulletPool = cc.find('bulletPool');
        this.count = 1;
        this.armor.active = false;
        this.seq = cc.sequence(cc.fadeTo(0.05, 200), cc.fadeOut(0.05));

        this.seq2 = cc.sequence(
            cc.spawn(
                cc.rotateBy(0.5, -1000),
                cc.jumpTo(0.5, cc.v2(
                    -100, -500),
                    500, 1)),
            cc.callFunc(this.onRevive.bind(this)));
    },

    start() {
        gameEvent.GAME_START.push(this.onGameStart.bind(this));
        gameEvent.BOSS_HEALTH.push(this.setRot.bind(this));
    },

    setRot(amount) {
        if (amount == 1) {
            let rot = this.minSpeed + this.deltaSpeed * this.boss;
            this.boss++;
            rot > this.maxSpeed && (rot = this.maxSpeed);
            this.rot = rot;
        }
    },

    reset() {
        let node = this.node;
        this.fireCount = 1;
        this.enabled = false;
        this.matLoader.set(0);
        this.bulletPos.active = false;
        node.setPosition(200, 0);
        node.rotation = 0;
        node.scaleX = 1;
        this.gun.rotation = this.max;

        this.boss = 0;
        this.setRot(1);
    },

    onGameStart() {
        //this.enabled = true;
    },

    up(stair) {
        gameEvent.invoke('PLAY_SOUND', 'ev_reload_4');
        let foot = stair.getFootPos();
        let p = stair.getEnemyPos();
        this.node.runAction(cc.sequence(
            cc.moveTo(0.3, foot),
            cc.jumpTo(stair.c * 0.1, p, 50, stair.c),
            cc.jumpTo(0.1, cc.v2(this.node.scaleX < 0 ? 200 : 900, p.y), 50, 1),
            cc.callFunc(this.onFaceBack.bind(this))));
    },

    onFaceBack() {
        this.gun.rotation = this.max;
        this.rot = Math.abs(this.rot);
        this.fireCount = 0;
        this.node.scaleX *= -1;
        this.bulletPos.active = true;
        this.enabled = true;
        this.particle.resetSystem();
        gameEvent.invoke('PLAY_SOUND', 'ev_foot_boss_land');
    },

    fire() {
        this.bulletPos.active = false;
        this.matLoader.set(0);
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
                let a = this.gun.rotation;
                bullet.getComponent('bullet').set(
                    this.gun.convertToWorldSpaceAR(this.bulletPos),
                    this.node.scaleX > 0 ? (a - 90) : (270 - a),
                    1.0 / this.count, this.enemy);
                this.rot *= -1;

                //this.gunFire.stopAllActions();
                gameEvent.invoke('PLAY_SOUND', 'ev_gun_4');

                a *= Math.PI / 180;
                let d = cc.v2(Math.sin(a) * -20, Math.cos(a) * -20);
                this.gun.runAction(cc.sequence(cc.moveBy(0.05, d), cc.moveTo(0.05, this.gun)));

                this.gunFire.runAction(this.seq);
            }

            this.fireCount--;
        } else if (!c) {
            let r = this.gun.rotation;
            r -= dt * this.rot;
            if (r > this.max) this.rot = Math.abs(this.rot);
            if (r < this.min) this.rot = -Math.abs(this.rot);
            this.matLoader.set((this.max - r) / (this.max - this.min));
            this.gun.rotation = r;
        }
    },

    kill() {
        //if (this.dead) return;
        //this.dead = true;
        //this.bulletPos.active = false;
        gameEvent.invoke('SPLASH', this);
        if (this.armor.active) {
            this.armor.runAction(this.seq2);
            gameEvent.invoke('PLAY_SOUND', 'ev_armor_hit');
            return;
        }

        gameEvent.invoke('PLAY_SOUND', 'ev_hit_head');
        let scale = this.node.scaleX;
        let seq = cc.sequence(
            cc.spawn(
                cc.rotateBy(0.5, -scale * 1000),
                cc.jumpTo(0.5, cc.v2(
                    this.node.x, this.node.y - 500),
                    500, 1)),
            cc.callFunc(this.onFinish.bind(this)));
        this.node.runAction(seq);
    },

    onRevive() {
        let node = this.armor;
        node.active = false;
        node.rotation = 0;
        node.setPosition(14, 98);

        this.gun.rotation = this.max;
        this.rot = Math.abs(this.rot);
        this.fireCount = 0;
        this.bulletPos.active = true;
        this.enemy.enabled = true;
    },

    onFinish() {
        //this.node.rotation = 0;
        //this.node.scaleX *= -1;
        gameEvent.invoke('GAME_OVER');
    },
});

var gameEvent = require('GameEvent');
var sizeList = [
    { x: 50, y: 60, z: 70, w: 50 },
    { x: 40, y: 90, z: 40, w: 30 },
    { x: 90, y: 60, z: 80, w: 50 },
];

var colorList = [
    '00ffff',
    'ff00ff',
    'ff0000',
    '0000ff',
    '00ff00'
]

cc.Class({
    extends: cc.Component,

    properties: {
        gun: cc.Node,
        gunFire: cc.Node,
        coin: cc.Prefab,
        particle: cc.Prefab,
        text: cc.Label,
        landParticle: cc.ParticleSystem,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.bulletPos = this.gun.children[0];
        this.teleport = cc.find('teleport_light_0');
        this.bulletPool = cc.find('bulletPool');
        this.coinPool = cc.find('coinPool');
        this.particlePool = cc.find('particlePool');
        this.player = cc.find('player').getComponent('PlayerController');

        this.seq = cc.sequence(cc.delayTime(0.4), cc.fadeTo(0.05, 200), cc.fadeOut(0.05));
        this.seq2 = cc.spawn(cc.moveBy(0.5, 0, 100), cc.fadeOut(0.5));
    },

    boss(on) {
        this.maxHealth = on ? (3 + Math.floor(Math.random() * 3)) : 1;

        gameEvent.invoke('BOSS_HEALTH', on ? 1 : 0);
    },

    reset() {
        let node = this.node;
        node.setPosition(-1000, 0);
        node.rotation = 0;
        node.scaleX = 1;
        this.gun.rotation = 90;
    },

    onFinish() {
        this.node.rotation = 0;
        this.node.scaleX *= -1;
        gameEvent.invoke('ENEMY_KILLED', this.isHeadShot);
    },

    onBossLand() {
        this.landParticle.resetSystem();
        gameEvent.invoke('PLAY_SOUND', 'ev_boss_appear_land');
    },

    set(stair) {
        this.stair = stair;
        this.dead = false;
        this.enabled = true;
        this.health = this.maxHealth;
        this.isHeadShot = false;
        let p = stair.getEnemyPos();
        let node = this.node;

        let i = this.updateColor();

        if (this.maxHealth > 1) {
            gameEvent.invoke('PLAY_SOUND', 'ev_boss_appear_spin');
            node.setPosition(p.x > 540 ? 1200 : -100, p.y + 200);
            let seq = cc.spawn(cc.jumpTo(0.7, p, 300, 1), cc.rotateBy(0.7, 360 * node.scaleX));
            node.runAction(seq);

            let port = this.teleport;
            port.setPosition(p.x > 540 ? 1400 : -300, p.y + 200);
            port.scaleX = -node.scaleX;
            port.runAction(cc.sequence(
                cc.moveTo(0.1, p.x > 540 ? 1080 : 0, p.y + 200),
                cc.delayTime(0.7),
                cc.callFunc(this.onBossLand.bind(this)),
                cc.moveTo(0.1, port)
            ));
        } else {
            node.setPosition(p.x > 540 ? 1200 : -100, p.y);
            i == 0 && node.runAction(cc.moveTo(0.3, p));
            i == 1 && node.runAction(cc.jumpTo(0.3, p, 50, 1));
            i == 2 && node.runAction(cc.jumpTo(0.5, p, 20, 5));
        }
    },

    updateColor() {
        let node = this.node;
        let i = Math.floor(Math.random() * colorList.length);
        node.color = cc.color(colorList[i]);

        i = Math.floor(Math.random() * sizeList.length);
        let size = sizeList[i];
        node.setContentSize(size.x, size.y);

        node = this.node.children[0];
        node.setContentSize(size.z, size.w);
        node.y = size.y;

        return i;
    },

    up(stair) {
        this.stair = stair;
        this.dead = false;
        this.enabled = true;
        this.isHeadShot = false;

        let foot = stair.getFootPos();
        let p = stair.getEnemyPos();
        this.node.runAction(cc.sequence(
            cc.moveTo(0.2, foot),
            cc.jumpTo(stair.c * 0.1, p, 50, stair.c),
            cc.callFunc(this.onFaceBack.bind(this))));
    },

    onFaceBack() {
        this.node.scaleX *= -1;
        gameEvent.invoke('PLAY_SOUND', 'ev_foot_boss_land');
    },

    swap(p1, p2) {
        let t = p1.x;
        p1.x = p2.x;
        p2.x = t;

        t = p1.y;
        p1.y = p2.y;
        p2.y = t;
    },

    check(p1, p2) {
        let node = this.node;
        //node.scaleX > 0 && this.swap(p1, p2);
        // body
        let bound = node.getBoundingBox();
        let hit = cc.v2();
        let pass = true;
        if (node.scaleX < 0) {
            if (p2.x < bound.xMin || p1.x > bound.xMax || p1.y > bound.yMax)
                pass = false;
        } else {
            if (p2.x > bound.xMax || p1.x < bound.xMin || p1.y > bound.yMax)
                pass = false;
        }

        if (pass) {
            for (let i = 0; i < 1; i += 0.1) {
                hit.x = p1.x + (p2.x - p1.x) * i;
                hit.y = p1.y + (p2.y - p1.y) * i;
                if (bound.contains(hit)) {
                    gameEvent.invoke('PLAY_SOUND', 'ev_hit_torso');
                    return hit;
                }
            }
        }

        //head
        bound = node.children[0].getBoundingBoxToWorld();
        pass = true;
        if (node.scaleX < 0) {
            if (p2.x < bound.xMin || p1.x > bound.xMax || p1.y > bound.yMax)
                pass = false;
        } else {
            if (p2.x > bound.xMax || p1.x < bound.xMin || p1.y > bound.yMax)
                pass = false;
        }

        if (pass) {
            for (let i = 0; i < 1; i += 0.1) {
                hit.x = p1.x + (p2.x - p1.x) * i;
                hit.y = p1.y + (p2.y - p1.y) * i;
                if (bound.contains(hit)) {
                    //cc.log('head shot');
                    this.isHeadShot = true;
                    this.spawnParticle((Math.random() + 0.5) * 20);
                    gameEvent.invoke('SPLASH');
                    gameEvent.invoke('PLAY_SOUND', 'ev_hit_head');
                    return hit;
                }
            }
        }
    },

    checkAlive() {
        if (this.health < 1 || !this.enabled) return;
        this.enabled = false;
        //if still alive, aim and fire on player
        if (!this.dead) {
            let pool = this.bulletPool.children;
            let bullet = null;
            // get from pool
            for (let i of pool) !i.active && (bullet = i.getComponent('bullet'));

            let node = this.player.node;
            let p2 = node.convertToWorldSpaceAR(node.children[0]);
            let p1 = this.gun.convertToWorldSpaceAR(this.bulletPool);
            let d = cc.v2(p2.x - p1.x, p2.y - p1.y);
            bullet.node.rotation = Math.atan2(d.y, -d.x) * 180 / Math.PI;
            let angle = 270 + Math.atan2(d.y, -d.x * this.node.scaleX) * 180 / Math.PI;

            node = this.gun;
            node.rotation = angle;
            p1 = this.gun.convertToWorldSpaceAR(this.bulletPos);
            node.rotation = 90;

            let r = angle - node.rotation;
            angle *= Math.PI / 180;
            d = cc.v2(Math.sin(angle) * -20, Math.cos(angle) * -20);

            let seq = cc.sequence(cc.rotateBy(0.3, r), cc.delayTime(0.1),
                cc.callFunc(bullet.aimPlayer.bind(bullet,
                    p1, p2, this.player
                )), cc.moveBy(0.05, d), cc.moveTo(0.05, node), cc.rotateBy(0.2, -r)
            );

            this.gunFire.runAction(this.seq);
            node.runAction(seq);
        } else gameEvent.invoke('BOSS_HIT', this.isHeadShot);
    },

    spawnCoin(count) {
        let pool = this.coinPool.children;
        while (count-- > 0) {
            let coin = null;
            // get from pool
            for (let i of pool) !i.active && (coin = i);
            if (!coin) { // if not, create new one
                coin = cc.instantiate(this.coin);
                coin.parent = this.coinPool;
            }

            coin.getComponent('coin').set(this, this.player.node);
        }
    },

    spawnParticle(count) {
        let pool = this.particlePool.children;
        while (count-- > 0) {
            let particle = null;
            // get from pool
            for (let i of pool) !i.active && (particle = i);
            if (!particle) { // if not, create new one
                particle = cc.instantiate(this.particle);
                particle.parent = this.particlePool;
            }

            particle.getComponent('particle').set(this);
        }
    },

    kill() {
        let node = this.node;
        let damage = this.isHeadShot ? 2 : 1;
        this.health -= damage;
        if (this.maxHealth > 1) {
            node.runAction(cc.sequence(cc.moveBy(0.05, -30 * node.scaleX, 0), cc.moveTo(0.1, node)));
            gameEvent.invoke('BOSS_HEALTH', this.health / this.maxHealth);
        }
        this.dead = true;
        if (this.health > 0) {
            let t = this.text.node;
            t.y = 90;
            t.scaleX = node.scaleX;
            t.opacity = 255;
            t.color = cc.color(this.isHeadShot ? 'ffc800' : 'ffffff');
            this.text.string = -damage;

            t.runAction(this.seq2);
            return;
        }
        let scale = node.scaleX;
        let seq = cc.sequence(
            cc.spawn(
                cc.rotateBy(0.5, -scale * 1000),
                cc.jumpTo(0.5, cc.v2(
                    scale < 0 ? 1300 : (-100), node.y - 500),
                    500, 1)),
            cc.callFunc(this.onFinish.bind(this)));
        node.runAction(seq);
        (this.isHeadShot || this.maxHealth > 1) && this.spawnCoin(this.maxHealth);
    },
});

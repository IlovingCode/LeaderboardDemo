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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.bulletPos = this.gun.children[0];
        this.bulletPool = cc.find('bulletPool');
        this.player = cc.find('player').getComponent('PlayerController');

        this.seq = cc.sequence(cc.delayTime(0.2), cc.fadeTo(0.05, 150), cc.fadeOut(0.05));
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
        gameEvent.invoke('ENEMY_KILLED');
    },

    set(stair) {
        this.stair = stair;
        this.dead = false;
        let p = stair.getEnemyPos();
        this.node.setPosition(p.x > 540 ? 1200 : -100, p.y);
        //this.enabled = true;
        let i = this.updateColor();

        i == 0 && this.node.runAction(cc.moveTo(0.3, p));
        i == 1 && this.node.runAction(cc.jumpTo(0.3, p, 50, 1));
        i == 2 && this.node.runAction(cc.jumpTo(0.5, p, 20, 5));
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
        let foot = stair.getFootPos();
        let p = stair.getEnemyPos();
        this.node.runAction(cc.sequence(
            cc.moveTo(0.3, foot),
            cc.jumpTo(0.5, p, 50, stair.c),
            cc.callFunc(this.onFaceBack.bind(this))));
    },

    onFaceBack() {
        let scale = this.node.scaleX;
        this.node.scaleX = -scale;
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
                if (bound.contains(hit)) return hit;
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
                    cc.log('head shot');
                    return hit;
                }
            }
        }
    },

    checkAlive() {
        //if still alive, aim and fire on player
        if (!this.dead) {
            this.dead = true;
            let pool = this.bulletPool.children;
            let bullet = null;
            // get from pool
            for (let i of pool) !i.active && (bullet = i.getComponent('bullet'));

            let node = this.player.node;
            let p2 = node.convertToWorldSpaceAR(node.children[0]);
            let p1 = this.gun.convertToWorldSpaceAR(this.bulletPool);
            let d = cc.v2(p2.x - p1.x, p2.y - p1.y);
            let angle = 270 + Math.atan2(d.y, -d.x * this.node.scaleX) * 180 / Math.PI;


            this.gun.rotation = angle;
            p1 = this.gun.convertToWorldSpaceAR(this.bulletPos);
            this.gun.rotation = 90;
            //cc.log(angle);

            let seq = cc.sequence(cc.rotateTo(0.2, angle),
                cc.callFunc(bullet.aimPlayer.bind(bullet,
                    p1, p2, this.player
                ))
            );

            this.gunFire.runAction(this.seq);
            this.gun.runAction(seq);
        }
    },

    kill() {
        if (this.dead) return;
        this.dead = true;
        let scale = this.node.scaleX;
        let seq = cc.sequence(
            cc.spawn(
                cc.rotateBy(0.5, -scale * 1000),
                cc.jumpTo(0.5, cc.v2(
                    scale < 0 ? 1300 : (-100), this.node.y - 500),
                    500, 1)),
            cc.callFunc(this.onFinish.bind(this)));
        this.node.runAction(seq);
    },
});

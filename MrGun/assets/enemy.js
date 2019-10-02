var gameEvent = require('GameEvent');

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad() { },

    onFinish() {
        this.node.rotation = 0;
        this.node.scaleX *= -1;
        gameEvent.invoke('ENEMY_KILLED');
    },

    set(stair) {
        let p = stair.getEnemyPos();
        this.x = p.x;
        this.node.setPosition(this.x > 540 ? 1200 : -100, p.y);
        //this.enabled = true;
        this.node.runAction(cc.jumpTo(0.3, p, 50, 1));
        this.stair = stair;
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
        node.scaleX > 0 && this.swap(p1, p2);
        // body
        let bound = node.getBoundingBox();
        let hit = cc.v2();
        if (p2.x < bound.xMin || p1.x > bound.xMax || p1.y > bound.yMax) {
            //return null;
        } else {
            for (let i = 0; i < 1; i += 0.1) {
                hit.x = p1.x + (p2.x - p1.x) * i;
                hit.y = p1.y + (p2.y - p1.y) * i;
                if (bound.contains(hit)) return hit;
            }
        }

        //head
        bound = node.children[0].getBoundingBoxToWorld();
        if (p2.x < bound.xMin || p1.x > bound.xMax || p1.y > bound.yMax) {
            return null;
        }

        for (let i = 0; i < 1; i += 0.1) {
            hit.x = p1.x + (p2.x - p1.x) * i;
            hit.y = p1.y + (p2.y - p1.y) * i;
            if (bound.contains(hit)) {
                cc.log('head shot');
                return hit;
            }
        }
    },

    kill() {
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

    // update(dt) {
    //     let x = this.node.x;
    //     x = (x + this.x) * 0.5;
    //     if (Math.abs(this.x - x) < 0.01) this.enabled = false;
    //     this.node.x = x;
    // },
});

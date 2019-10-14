cc.Class({
    extends: cc.Component,

    properties: {
        decoration: cc.Sprite,
        decoList: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.stair = this.node.children[1];
        this.wall = this.node.children[0];
    },

    set(pos, c) {
        let node = this.node;
        if (c > this.decoList.length + 1 || Math.random() > 0.1) this.decoration.node.active = false;
        else {
            this.decoration.node.active = true;
            this.decoration.spriteFrame = this.decoList[c - 2];
        }

        // random position
        this.c = c;
        let x = 5 - Math.floor(Math.random() * (7 - c));
        let y = c * 50;
        let p = cc.v2(x * 50, y - this.stair.height);
        this.stair.setPosition(p);
        this.wall.setPosition(p);

        node.setPosition(540, pos.y);
        node.setSiblingIndex(0);

        pos.y += y;

        c += Math.floor((Math.random() + 0.3) * 3);
        c = c % 7 + 2;

        return c;
    },

    updateColor(color) {
        this.wall.color = color;
        this.stair.color = color;
        this.node.color = color;
        this.decoration.node.color = color;
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
        //node.scaleX < 0 && this.swap(p1, p2);
        let bound = this.stair.getBoundingBoxToWorld();
        // if (p2.x < bound.xMin || p1.y > bound.yMax) {
        //     //return null;
        // } else 
        {
            let hit = cc.v2();
            for (let i = 0; i < 1; i += 0.1) {
                hit.x = p1.x + (p2.x - p1.x) * i;
                hit.y = p1.y + (p2.y - p1.y) * i;

                if (hit.y > bound.yMax) return null;
                let c = Math.floor((hit.y - bound.yMin - 12) / 50);
                if (node.scaleX < 0) {
                    if (hit.x < bound.xMax - c * 50) {
                        return hit;
                    }
                } else {
                    if (hit.x > c * 50 + bound.xMin) {
                        return hit;
                    }
                }
            }
        }
    },

    getEnemyPos() {
        let stair = this.stair;
        let node = this.node;
        return cc.v2(stair.x * node.scaleX + node.x, stair.y + stair.height + node.y);
    },

    getCoinPos() {
        let stair = this.stair;
        let node = this.node;
        let c = this.c + 1;
        return cc.v2((stair.x - c * 50) * node.scaleX + node.x, node.y);
    },

    getFootPos() {
        let stair = this.stair;
        let node = this.node;
        let c = this.c + 1;
        return cc.v2((stair.x - c * 50) * node.scaleX + node.x, node.y);
    }

    // update (dt) {},
});

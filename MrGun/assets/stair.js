var bag = [0];
var height = 50;

cc.Class({
    extends: cc.Component,

    properties: {
        decoration: cc.Sprite,
        decoList: [cc.SpriteFrame],
        patterns: [cc.Node]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let list = this.node.children;
        this.stair = list[1];
        this.wall = list[0];
        this.pixel = list[2].children[0];
    },

    fillBag(pivot) {
        let size = this.decoList.length;
        let count = size;
        let i = Math.floor(Math.random() * size);
        while (count--) {
            while (bag[i]) {
                i += Math.floor(Math.random() * size);
                i %= size;
            }
            bag[i] = count;
        }

        if (bag[size - 1] == pivot) {
            bag[size - 1] = bag[1];
            bag[1] = pivot;
        }

        bag.length = size;
        //cc.log(bag);
    },

    set(pos, c) {
        let node = this.node;
        if (Math.random() > 0.4) this.decoration.spriteFrame = null;
        else {
            let p = bag.pop();
            !bag.length && this.fillBag(p);
            this.decoration.spriteFrame = this.decoList[p];
        }

        let list = this.patterns;
        let i = Math.floor(Math.random() * (list.length - 1));
        for (let c = 0; c < list.length - 1; c++) list[c].active = c == i;

        // random position
        this.c = c;
        let x = 5 - Math.floor(Math.random() * (7 - c));
        let y = c * height;
        let p = cc.v2(x * height, y - this.stair.height);
        this.pixel.width = 1019 + p.x - y;
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
        let list = this.node.children;
        for (let c of list) c.color = color;
        list = this.patterns;
        for (let c of list) c.color = color;
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
                let c = Math.floor((hit.y - bound.yMin - 12) / height);
                if (node.scaleX < 0) {
                    if (hit.x < bound.xMax - c * height) {
                        return hit;
                    }
                } else {
                    if (hit.x > c * height + bound.xMin) {
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
        return cc.v2((stair.x - c * height) * node.scaleX + node.x, node.y);
    },

    getFootPos() {
        let stair = this.stair;
        let node = this.node;
        let c = this.c + 1;
        return cc.v2((stair.x - c * height) * node.scaleX + node.x, node.y);
    }

    // update (dt) {},
});

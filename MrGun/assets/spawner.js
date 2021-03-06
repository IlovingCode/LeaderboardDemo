var gameEvent = require('GameEvent');

cc.Class({
    extends: cc.Component,

    properties: {
        colors: [cc.Color],
        obj: cc.Prefab,
        count: 10,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        gameEvent.resetAll();
    },

    reset() {
        this.player.reset();
        this.enemy.reset();
        this.node.y = 0;
        this.id = 0;
        this.prevC = 2;
        let pos = this.pos = cc.v2(0, this.player.node.y);
        this.color = this.colors[0];

        let stack = this.stack;
        let count = this.count;
        let c = this.prevC;
        for (let i = 0; i < count; i++)
            c = stack[i].set(pos, c);

        this.prevC = c;
    },

    start() {
        this.content = cc.director.getScene();
        let player = cc.find('player');
        let stack = this.stack = [];

        let content = this.content;
        let count = this.count;
        for (let i = 0; i < count; i++) {
            let obj = cc.instantiate(this.obj)
            let stair = obj.getComponent('stair');
            obj.parent = content;
            obj.scaleX = (i % 2) ? -1 : 1;
            stack.push(stair);
        }

        this.enemy = cc.find('enemy').getComponent('enemy');
        this.player = player.getComponent('PlayerController');
        this.delta = this.node.y - player.y;

        this.reset();

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        gameEvent.ENEMY_KILLED.push(this.onEnemyKilled.bind(this));
        gameEvent.GAME_START.push(this.onEnemyKilled.bind(this));
        gameEvent.GAME_OVER.push(this.reset.bind(this));
        gameEvent.BOSS_HIT.push(this.onBossHit.bind(this));
    },

    onEnemyKilled() {
        let id = this.id;
        let stack = this.stack;
        this.player.up(stack[id]);
        if (++id >= stack.length) id = 0;
        this.enemy.boss(id && id % 9 == 0);
        this.enemy.set(stack[id]);
        this.id = id;
    },

    onBossHit() {
        let id = this.id;
        let stack = this.stack;
        this.player.up(stack[id]);
        if (++id >= stack.length) id = 0;
        this.enemy.up(stack[id]);
        this.id = id;
    },

    onTouchStart(e) {
        //cc.find('enemy').getComponent('enemy').up(this.stack[1].getComponent('stair'));
        //cc.find('player').getComponent('PlayerController').up(this.stack[0].getComponent('stair'));
        this.player.fire();
    },

    updateStack() {
        let stack = this.stack;
        let y = this.player.node.y;
        let color = this.color;
        let black = this.colors[1];
        for (let i of stack) {
            let d = i.node.y - y;

            if (d < -1300) {
                this.prevC = i.set(this.pos, this.prevC);
            } else {
                let c = color.lerp(black, d / 1300);
                i.updateColor(c);
            }
        }
    },

    update(dt) {
        let y = this.player.node.y + this.delta;
        let node = this.node;
        if (node.y < y) {
            node.y = (node.y + y) * 0.5;
            this.updateStack();
        }
    },
});

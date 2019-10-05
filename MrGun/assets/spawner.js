var gameEvent = require('GameEvent');

cc.Class({
    extends: cc.Component,

    properties: {
        obj: cc.Prefab,
        count: 10,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        gameEvent.resetAll();
    },

    start() {
        this.content = cc.director.getScene();
        let player = cc.find('player');
        let stack = this.stack = [];

        let pos = this.pos = cc.v2(0, player.y);
        let color = cc.color('006464');
        let black = cc.color('000000');
        let content = this.content;
        let count = this.count;
        for (let i = 0; i < count; i++) {
            let obj = cc.instantiate(this.obj);
            obj.parent = content;
            color = color.lerp(black, (pos.y - player.y) / 1920);
            obj.getComponent('stair').set(color, (i % 2) ? -1 : 1, pos);

            stack.push(obj);
        }

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));

        this.enemy = cc.find('enemy').getComponent('enemy');
        this.id = 0;

        this.player = cc.find('player').getComponent('PlayerController');

        gameEvent.ENEMY_KILLED.push(this.onEnemyKilled.bind(this));
        gameEvent.GAME_START.push(this.onEnemyKilled.bind(this));
    },

    onEnemyKilled() {
        this.player.up(this.stack[this.id].getComponent('stair'));
        this.id++;
        this.enemy.set(this.stack[this.id].getComponent('stair'));
    },

    onTouchStart(e) {
        //cc.find('enemy').getComponent('enemy').up(this.stack[1].getComponent('stair'));
        //cc.find('player').getComponent('PlayerController').up(this.stack[0].getComponent('stair'));
        this.player.fire();
    },

    // update (dt) {},
});

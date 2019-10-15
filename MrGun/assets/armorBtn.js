var gameEvent = require('GameEvent');

cc.Class({
    extends: cc.Component,

    properties: {
        price: 10,
        active: cc.SpriteFrame,
        inactive: cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    start() {
        gameEvent.COIN_CHANGED.push(this.onCoinChanged.bind(this));

        this.player = cc.find('player').getComponent('PlayerController');
        this.btn = this.node.getComponent(cc.Button);
        this.sprite = this.node.getComponent(cc.Sprite);
        this.coin = 0;
        this.onCoinChanged(0);
    },

    onCoinChanged(amount) {
        this.coin += amount;

        let enough = this.coin >= this.price && !this.player.armor.active;;
        this.btn.interactable = enough;
        this.sprite.spriteFrame = enough ? this.active : this.inactive;
    },

    onBuyArmor() {
        if (this.coin < this.price) return;

        this.player.armor.active = true;
        gameEvent.invoke('COIN_CHANGED', -this.price);
    },

    // update (dt) {},
});

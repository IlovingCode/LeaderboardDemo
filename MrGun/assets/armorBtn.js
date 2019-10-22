var gameEvent = require('GameEvent');

cc.Class({
    extends: cc.Component,

    properties: {
        price: 10,
    },

    // LIFE-CYCLE CALLBACKS:

    start() {
        this.armor = cc.find('player').getComponent('PlayerController').armor;
        gameEvent.COIN_CHANGED.push(this.onCoinChanged.bind(this));

        this.btn = this.node.getComponent(cc.Button);
        this.node.getComponentInChildren(cc.Label).string = this.price;
        this.coin = 0;
        this.onCoinChanged(0);
    },

    onCoinChanged(amount) {
        this.coin += amount;

        let enough = this.coin >= this.price && !this.armor.active;
        this.btn.interactable = enough;
    },

    onBuyArmor() {
        if (this.coin < this.price) return;

        this.armor.active = true;
        this.armor.getComponentInChildren(cc.ParticleSystem).resetSystem();
        gameEvent.invoke('COIN_CHANGED', -this.price);
        gameEvent.invoke('PLAY_SOUND', 'ev_armor_equip');
    },

    // update (dt) {},
});

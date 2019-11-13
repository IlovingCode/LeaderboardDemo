var CustomMaterial = require('CustomMaterial');

cc.Class({
    extends: cc.Component,

    properties: {
        effect: 'blend',
    },

    // LIFE-CYCLE CALLBACKS:

    init(effect) {
        this.target = this.node.getComponent(cc.RenderComponent);
        this.shader = require(effect);
        this.material = new CustomMaterial(this.shader);

        this.targetMaterial = this.target._spriteMaterial || this.target.getMaterial();
        return this.material;
    },

    onDisable() {
        this.target._spriteMaterial = this.targetMaterial;
        this.target._activateMaterial(true);
    },

    onEnable() {
        let material = this.material || this.init(this.effect);
        material.color = this.node.color;
        material.texture = this.targetMaterial.texture;
        this.shader.start && this.shader.start(material);

        let target = this.target;
        if (target._spriteMaterial) target._spriteMaterial = material;
        else target._material = material;
        target._activateMaterial(true);

        !this.shader.update && (this.update = undefined);
    },

    set(p1, p2) {
        this.shader.set && this.shader.set(this.material, p1, p2);
    },

    update(dt) {
        (this.shader.update(this.material, dt))
            && (this.enabled = false);
    },
});

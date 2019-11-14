const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;
const gfx = renderEngine.gfx;
const Material = renderEngine.Material;

const Property = {
    '2d': renderer.PARAM_TEXTURE_2D,
    '1f': renderer.PARAM_FLOAT,
    '2f': renderer.PARAM_FLOAT2,
    '4f': renderer.PARAM_FLOAT4,
};

function ParseParam(params) {
    let res = [
        { name: 'texture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'color', type: renderer.PARAM_COLOR4 }
    ];

    if (params) {
        for (let p of params) {
            for (let t in Property)
                p.endsWith(t) && res.push({
                    name: p, type: Property[t]
                })
        }
    }

    return res;
};

var CustomMaterial = (function (Material$$1) {
    function CustomMaterial(shader) {
        Material$$1.call(this, false);

        var pass = new renderer.Pass(shader.name);
        pass.setDepth(false, false);
        pass.setCullMode(gfx.CULL_NONE);
        pass.setBlend(
            gfx.BLEND_FUNC_ADD,
            gfx.BLEND_SRC_ALPHA,
            gfx.BLEND_ONE_MINUS_SRC_ALPHA,
            gfx.BLEND_FUNC_ADD,
            gfx.BLEND_SRC_ALPHA,
            gfx.BLEND_ONE_MINUS_SRC_ALPHA);

        var mainTech = new renderer.Technique(
            ['transparent'],
            ParseParam(shader.params),
            [pass]
        );

        this._color = { r: 1, g: 1, b: 1, a: 1 };
        this._effect = new renderer.Effect(
            [mainTech],
            {
                'color': this._color
            }, []
        );

        this._mainTech = mainTech;
        this._texture = null;
    }

    if (Material$$1) CustomMaterial.__proto__ = Material$$1;
    CustomMaterial.prototype = Object.create(Material$$1 && Material$$1.prototype);
    CustomMaterial.prototype.constructor = CustomMaterial;

    var prototypeAccessors = {
        effect: { configurable: true },
        texture: { configurable: true },
        color: { configurable: true }
    };

    prototypeAccessors.effect.get = function () {
        return this._effect;
    };

    prototypeAccessors.texture.get = function () {
        return this._texture;
    };

    prototypeAccessors.texture.set = function (val) {
        if (this._texture !== val) {
            this._texture = val;
            this._effect.setProperty('texture', val.getImpl());
            this._texIds['texture'] = val.getId();
        }
    };

    prototypeAccessors.color.get = function () {
        return this._color;
    };

    prototypeAccessors.color.set = function (val) {
        var color = this._color;
        color.r = val.r / 255;
        color.g = val.g / 255;
        color.b = val.b / 255;
        color.a = val.a / 255;
        this._effect.setProperty('color', color);
    };

    CustomMaterial.prototype.clone = function clone() {
        var copy = new CustomMaterial();
        copy._mainTech.copy(this._mainTech);
        copy.texture = this.texture;
        copy.color = this.color;
        copy.updateHash();
        return copy;
    };

    CustomMaterial.prototype.setParam = function (name, value) {
        if (value instanceof cc.Texture2D) {
            this._effect.setProperty(name, value.getImpl());
            this._texIds[name] = value.getId();
        } else this._effect.setProperty(name, value);
    }

    Object.defineProperties(CustomMaterial.prototype, prototypeAccessors);

    return CustomMaterial;
}(Material));

module.exports = CustomMaterial;
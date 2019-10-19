var shader = {
    name: 'blend',
    vert: `
    uniform mat4 viewProj;
    uniform mat4 model;
    attribute vec3 a_position;
    attribute vec2 a_uv0;
    varying vec2 uv0;
    
    void main () {
        mat4 mvp;
        mvp = viewProj * model;
        vec4 pos = mvp * vec4(a_position, 1);
        gl_Position = pos;
        uv0 = a_uv0;
    }`,
    frag: `
    uniform sampler2D texture;
    uniform vec4 color;
    uniform float a1f;
    varying vec2 uv0;

    void main () {
        vec2 uv = uv0 - 0.5;
        float r = uv.x * uv.x + uv.y * uv.y;
        float a = texture2D(texture, uv0).a + 0.001;
        a = step(a, a1f) * step(r, 0.23);
        gl_FragColor = vec4(color.rgb, 0.23 * a);
    }`,
    params: ['a1f'],

    set(mat, a) {
        mat.setParam('a1f', a * 0.2 - 0.004);
    },
};

cc.game.once(cc.game.EVENT_ENGINE_INITED, function () {
    cc.renderer._forward._programLib.define(shader.name, shader.vert, shader.frag, []);
});

module.exports = shader;
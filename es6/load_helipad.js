export function load_helipad(app) {
    // Set a prefiltered cubemap as the skybox
    var cubemapAsset = new pc.Asset('helipad', 'cubemap', {
        url: "./assets/cubemap/6079289/Helipad.dds"
    }, {
        "textures": [
            "./assets/cubemap/6079292/Helipad_posx.png",
            "./assets/cubemap/6079290/Helipad_negx.png",
            "./assets/cubemap/6079293/Helipad_posy.png",
            "./assets/cubemap/6079298/Helipad_negy.png",
            "./assets/cubemap/6079294/Helipad_posz.png",
            "./assets/cubemap/6079300/Helipad_negz.png"
        ],
        "magFilter": 1,
        "minFilter": 5,
        "anisotropy": 1,
        "name": "Helipad",
        "rgbm": true,
        "prefiltered": "Helipad.dds"
    });
    app.assets.add(cubemapAsset);
    app.assets.load(cubemapAsset);
    cubemapAsset.ready(function () {
        app.scene.skyboxMip = 2;
        app.scene.setSkybox(cubemapAsset.resources);
    });
}

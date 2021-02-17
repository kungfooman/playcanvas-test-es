var canvas;
var app;
var scriptPreloader;
var camera;
var box;
var light;
var trigger;
var box1;
var box2;
var box3;
var cube;
var example;
var exampleScript;
var orbitCamera;
var keyboardInput;
var mouseInput;
var uiEntity;
var uiScript;
var uiAsset;
var uiAssetProfile;
var layerDebugDraw;
var cameraDebugDraw;

function loadOrbitCamera() {
    camera.addComponent("script");
    orbitCamera   = camera.script.create('orbitCamera');
    keyboardInput = camera.script.create('keyboardInput');
    mouseInput   = camera.script.create('mouseInput');
    orbitCamera.focusEntity = trigger;
    orbitCamera.distance = 50;
    orbitCamera.yaw = 50;
    orbitCamera.pitch = -25;
}

function createBox(name) {
    var box = new pc.Entity(name);
    box.addComponent('model', {
        type: 'box'
    });
    app.root.addChild(box);
    return box;
}

function init_scripts() {
    // create a PlayCanvas application
    canvas = document.getElementById('application');
    app = new pc.Application(canvas, {
        mouse: new pc.Mouse(canvas),
        keyboard: new pc.Keyboard(canvas)
    });
    
    app.start();

    scriptPreloader = new ScriptPreloader(init_preloaded, [
        "./es5/example.js",
        "./es5/ammo-debug-drawer.js",
        "./es5/orbit-camera.js",
        "./es5/trigger.js",
        "./es5/ui.js",
        "./es5/rotate.js",
    ]);
}

function load_ui() {
    uiAsset = new pc.Asset("UI HTML", "html", {
        url: "./es5/ui.html"
    });

    uiAssetProfile = new pc.Asset("UI HTML", "texture", {
        url: "./es5/profile.jpg"
    });

    // Create UI entity with assets (non-loaded yet)
    uiEntity = new pc.Entity("UI");
    app.root.addChild(uiEntity);
    uiEntity.addComponent("script");
    uiScript = uiEntity.script.create("ui", {
        attributes: {
            html: uiAsset,
            profile: uiAssetProfile
        }
    });

    // As soon the assets loaded, update the UI:

    // HTML
    uiAsset.ready(function() {
        uiScript.setMedia();
    });
    app.assets.add(uiAsset);
    app.assets.load(uiAsset);

    // PROFILE
    uiAssetProfile.ready(function() {
        uiScript.setProfile();
    })
    app.assets.add(uiAssetProfile);
    app.assets.load(uiAssetProfile);
}

function init_preloaded() {
    // fill the available space at full resolution
    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);

    // ensure canvas is resized when window changes size
    window.addEventListener('resize', () => app.resizeCanvas());

    // create box entity
    box = new pc.Entity('cube');
    box.addComponent('model', {
        type: 'box'
    });
    app.root.addChild(box);
    box.addComponent("script");
    box.script.create("rotate");

    // create camera entity
    camera = new pc.Entity('camera');
    camera.addComponent('camera', {
        clearColor: new pc.Color(0.1, 0.1, 0.1)
    });
    app.root.addChild(camera);
    camera.setPosition(0, 0, 3);

    // create directional light entity
    light = new pc.Entity('light');
    light.addComponent('light', {
        type: "directional",
        color: new pc.Color(0.8, 0.8, 0.8),
        castShadows: true,
        //shadowBias: 0.05,
        //normalOffsetBias: 0.05,
        //shadowResolution: 2048
    });
    app.root.addChild(light);
    light.setEulerAngles(45, 0, 0);

    // rotate the box according to the delta time since the last frame
    //app.on('update', dt => box.rotate(10 * dt, 20 * dt, 30 * dt));

    load_ui();
    
    trigger = new pc.Entity("Trigger");
    app.root.addChild(trigger);
    trigger.setLocalPosition(0, -6.967, 0);
    trigger.setLocalScale(40, 0.2, 40);
    trigger.addComponent("collision", {
        type: "box",
        halfExtents: new pc.Vec3(20, 0.1, 20)
    });
    trigger.addComponent("script");
    trigger.script.create("trigger");
    // Color fox boxes
    var violet = new pc.StandardMaterial();
    violet.diffuse.set(138/255,43/255,226/255);
    violet.update();

    box1 = createBox("Box 1");
    box1.model.material = violet;
    box1.setLocalPosition(-4.174, 2.428, 2.937);
    box1.setLocalEulerAngles(-28.58, 0, -34.25);
    box1.setLocalScale(8, 0.1, 8);
    box1.addComponent("collision", {
        type: "box",
        halfExtents: new pc.Vec3(4, 0.05, 4)
    });
    box1.addComponent("rigidbody", {
        type: "static",
        restitution: 0.5
    });

    box2 = createBox("Box 2");
    box2.model.material = violet;
    box2.setLocalPosition(-5.966, 1.56, -8.398);
    box2.setLocalEulerAngles(0.03, 6.33, 0.94);
    box2.setLocalScale(8, 0.1, 8);
    box2.addComponent("collision", {
        type: "box",
        halfExtents: new pc.Vec3(4, 0.05, 4)
    });
    box2.addComponent("rigidbody", {
        type: "static",
        restitution: 0.5
    });

    box3 = createBox("Box 3");
    box3.model.material = violet;
    box3.setLocalPosition(3.697, 0.896, -4.896);
    box3.setLocalEulerAngles(172.67, 6.9, -162.31);
    box3.setLocalScale(8, 0.1, 8);
    box3.addComponent("collision", {
        type: "box",
        halfExtents: new pc.Vec3(4, 0.05, 4)
    });
    box3.addComponent("rigidbody", {
        type: "static",
        restitution: 0.5
    });
    
    cube = createBox("Cube");
    cube.enabled = false;
    cube.addComponent("collision", {
        type: "box",
        halfExtents: new pc.Vec3(0.5, 0.5, 0.5),
    });
    cube.addComponent("rigidbody", {
        mass: 10,
        restitution: 0.5,
        type: "dynamic"
    });

    load_helipad();
    loadOrbitCamera();

    layerDebugDraw = new pc.Layer({name: "Debug Draw"});
    app.scene.layers.pushTransparent(layerDebugDraw);
    cameraDebugDraw = new pc.Entity("Camera Debug Draw");
    camera.addChild(cameraDebugDraw);
    cameraDebugDraw.addComponent("camera", {
        layers: [layerDebugDraw.id]
    });
    cameraDebugDraw.camera.clearColorBuffer = false;

    example = new pc.Entity("example");
    app.root.addChild(example);
    example.addComponent("script");
    exampleScript = example.script.create("example", {
        attributes: {
            layer: layerDebugDraw
        }
    });
}

load_ammo(init_scripts);

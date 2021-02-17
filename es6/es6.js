import pc from "./pc.js";
import "../pcui/pcui.js";
import {load_ammo} from "./load_ammo.js";
import {load_helipad} from "./load_helipad.js";

let canvas;
let app;
let scriptPreloader;
let camera;
let box;
let light;
let trigger;
let box1;
let box2;
let box3;
let cube;
let example;
let exampleScript;
let orbitCamera;
let keyboardInput;
let mouseInput;
let uiEntity;
let uiScript;
let uiAsset;
let uiAssetProfile;

function load_ui() {
    uiAsset = new pc.Asset("UI HTML", "html", {
        url: "./es5/ui.html"
    });
    app.assets.add(uiAsset);
    uiAssetProfile = new pc.Asset("UI HTML", "texture", {
        url: "./es5/profile.jpg"
    });
    app.assets.add(uiAssetProfile);

    uiEntity = new pc.Entity("UI");
    app.root.addChild(uiEntity);
    uiEntity.addComponent("script");
    uiScript = uiEntity.script.create("ui", {
        attributes: {
            html: uiAsset,
            profile: uiAssetProfile
        }
    });
}

async function demo() {
    // create a PlayCanvas application
    canvas = document.getElementById('application');
    app = new pc.Application(canvas, {
        mouse: new pc.Mouse(canvas),
        keyboard: new pc.Keyboard(canvas)
    });
    
    app.start();

    await Promise.all([
        import("./example.js"),
        import("./trigger.js"),
        import("./ui.js"),
        import("./orbit-camera.js"),
        import("./rotate.js"),
    ]);

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
    box.addComponent('script');
    box.script.create('rotate');

    // create camera entity
    camera = new pc.Entity('camera');
    camera.addComponent('camera', {
        clearColor: new pc.Color(0.1, 0.1, 0.1)
    });
    app.root.addChild(camera);
    camera.setPosition(0, 0, 3);

    // create directional light entity
    light = new pc.Entity('light');
    light.addComponent('light');
    app.root.addChild(light);
    light.setEulerAngles(45, 0, 0);

    load_ui();

    // rotate the box according to the delta time since the last frame
    //app.on('update', dt => box.rotate(10 * dt, 20 * dt, 30 * dt));

    function createBox(name) {
        box = new pc.Entity(name);
        box.addComponent('model', {
            type: 'box'
        });
        app.root.addChild(box);
        return box;
    }
    
    trigger = createBox("Trigger");
    trigger.setLocalPosition(0, -6.967, 0);
    trigger.setLocalScale(40, 0.2, 40);
    trigger.addComponent("collision", {
        type: "box",
        halfExtents: new pc.Vec3(20, 0.1, 20)
    });
    trigger.addComponent("rigidbody", {
        type: "static",
        restitution: 0.5
    });
    
    box1 = createBox("Box 1");
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

    camera.addComponent("script");

    orbitCamera = camera.script.create('orbitCamera');
    keyboardInput = camera.script.create('keyboardInput');
    mouseInput = camera.script.create('mouseInput');
    orbitCamera.focusEntity = trigger;
    orbitCamera.distance = 50;
    orbitCamera.yaw = 50;
    orbitCamera.pitch = -25;

    load_helipad(app);

    example = new pc.Entity("example");
    app.root.addChild(example);
    example.addComponent("script");
    exampleScript = example.script.create("example");
    

    // Nothing is exported by default, so assign objects to window manually for easy testing/debugging
    Object.assign(window, {
        box1,
        box2,
        box3,
        trigger,
        camera,
        app,
        canvas,
        createBox,
        orbitCamera,
        keyboardInput,
        mouseInput,
        example,
        exampleScript
    });
}

load_ammo(demo);

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

function loadOrbitCamera() {
    // Make the camera interactive
    //app.assets.loadFromUrl('./orbit-camera.js', 'script', function (err, asset) {
        //camera.script.create('orbitCamera');
        //camera.script.create('keyboardInput');
        //camera.script.create('mouseInput');

        //if (this.cameraPosition) {
        //    camera.script.orbitCamera.distance = this.cameraPosition.length();
        //} else if (this.gltf) {
        //    camera.script.orbitCamera.focusEntity = this.gltf;
        //}

        camera.addComponent("script");
        const orbitCamera   = camera.script.create('orbitCamera');
        const keyboardInput = camera.script.create('keyboardInput');
        const mouseInput   = camera.script.create('mouseInput');
        orbitCamera.focusEntity = trigger;
        orbitCamera.distance = 50;
        orbitCamera.yaw = 50;
        orbitCamera.pitch = -25;
    //}.bind(this));
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
        "./es5/ui.js"
    ]);
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
    //app.root.addChild(box);

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

    // rotate the box according to the delta time since the last frame
    //app.on('update', dt => box.rotate(10 * dt, 20 * dt, 30 * dt));

    
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
        axis: 0,
        height: 2,
        radius: 0.5,
        type: "capsule"
    });
    cube.addComponent("rigidbody", {
        angularDamping: 0,
        angularFactor: pc.Vec3.ZERO,
        friction: 0.3,
        linearDamping: 0,
        linearFactor: pc.Vec3.ONE,
        mass: 80,
        restitution: 0,
        type: "dynamic"
    });

    load_helipad();
    loadOrbitCamera();
    
    const example = new pc.Entity("example");
    example.addComponent("script");
    const exampleScript = example.script.create("example");
    console.log("exampleScript", exampleScript);
    if (exampleScript) {
        console.log("exampleScript defined")
        exampleScript.initialize();
        exampleScript.spawnCube();
        setInterval(x=>exampleScript.update(1/60), 1/60);
    } else {
        console.log("exampleScript NOT defined")
        setTimeout(function() {
            // why is this undefined without timeout?!
            example.script.scripts[0].initialize();
            example.script.scripts[0].spawnCube();
            setInterval(x=>example.script.scripts[0].update(1/60), 1/60);
        }, 100)
    }
}

load_ammo(init_scripts);

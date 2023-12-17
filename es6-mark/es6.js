import * as pc from 'playcanvas';
import { createScript } from './createScript.js';
import { load_ammo    } from "./load_ammo.js";
import { load_helipad } from "./load_helipad.js";
import { Rotate       } from './rotate.js';
import { Trigger      } from './trigger.js';
import { Ui           } from './ui.js';
import { Example      } from './example.js';
import { OrbitCamera, MouseInput, KeyboardInput } from './orbit-camera.js';
export let canvas;
export let app;
export let scriptPreloader;
export let camera;
export let box;
export let light;
/** @type {pc.Entity} */
export let trigger;
export let box1;
export let box2;
export let box3;
export let cube;
/** @type {pc.Entity} */
export let example;
/** @type {Example} */
export let exampleScript;
export let orbitCamera;
export let keyboardInput;
export let mouseInput;
export let uiEntity;
export let uiScript;
export let uiAsset;
export let uiAssetProfile;
export let layerDebugDraw;
export let cameraDebugDraw;
export function load_ui() {
    uiAsset = new pc.Asset("UI HTML", "html", {
        url: "./es5/ui.html"
    });
    uiAssetProfile = new pc.Asset("UI HTML", "texture", {
        url: "./es5/profile.jpg"
    });
    // Create UI entity with assets (non-loaded yet)
    uiEntity = new pc.Entity("UI");
    app.root.addChild(uiEntity);
    uiScript = createScript(uiEntity, Ui, {
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
/**
 * @param {string} name - The name.
 * @returns {pc.Entity} The entity with render component.
 */
export function createBox(name) {
    let box = new pc.Entity(name);
    box.addComponent('model', {
        type: 'box'
    });
    app.root.addChild(box);
    return box;
}
export async function init() {
    // create a PlayCanvas application
    canvas = document.getElementById('application');
    app = new pc.Application(canvas, {
        mouse: new pc.Mouse(canvas),
        keyboard: new pc.Keyboard(canvas)
    });
    pc.app.onLibrariesLoaded();
    pc.RigidBodyComponent.onLibraryLoaded();
    app.start();
    // fill the available space at full resolution
    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);
    // ensure canvas is resized when window changes size
    window.addEventListener('resize', () => app.resizeCanvas());
    // create box entity
    box = new pc.Entity('rotating-cube');
    box.addComponent('model', {
        type: 'box'
    });
    app.root.addChild(box);
    createScript(box, Rotate);
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
    // set the direction for our light
    app.root.addChild(light);
    light.setEulerAngles(45, 0, 0);
    load_ui();
    // rotate the box according to the delta time since the last frame
    //app.on('update', dt => box.rotate(10 * dt, 20 * dt, 30 * dt));
    trigger = new pc.Entity("Trigger");
    app.root.addChild(trigger);
    trigger.setLocalPosition(0, -6.967, 0);
    trigger.setLocalScale(40, 0.2, 40);
    trigger.addComponent("collision", {
        type: "box",
        halfExtents: new pc.Vec3(20, 0.1, 20)
    });
    createScript(trigger, Trigger);
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
    orbitCamera = createScript(camera, OrbitCamera);
    keyboardInput = createScript(camera, KeyboardInput);
    mouseInput = createScript(camera, MouseInput);
    orbitCamera.focusEntity = trigger;
    orbitCamera.distance = 50;
    orbitCamera.yaw = 50;
    orbitCamera.pitch = -25;
    load_helipad(app);
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
    exampleScript = createScript(example, Example, {
        attributes: {
            layer: layerDebugDraw
        }
    });
}
export function start() {
    load_ammo(init);
}

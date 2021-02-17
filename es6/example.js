/* jshint esversion: 6 */

import pc from "./pc.js";
import AmmoDebugDrawer from "./ammo-debug-drawer.js";

export default class Example extends pc.ScriptType {

    initialize() {
        this.renderer = new AmmoDebugDrawer();
        this.renderer.enable();
        
        this.bindEvents();
        this.generateCubes();
        
        this.cubeIndex = 0;
        this.allSpawned = false;
        this.reset();
    }
    
    bindEvents() {
        this.app.on('ui:mode-select', this.changeMode, this);
    }
    
    reset() {
        this.time = 0;
        this.delay = pc.math.random(0, 1);        
    }
    
    generateCubes() {
        const cube = this.app.root.findByName('Cube');
        const amount = Example.CUBES_AMOUNT;
        const height = Example.SPAWN_HEIGHT;
        
        this.cubes = [];
        for (let i = 0; i < amount; i++) {
            const clone = cube.clone();
            const x = pc.math.random(-8, 8);
            const y = height;
            const z = pc.math.random(-8, 8);
            const rx = pc.math.random(-90, 90);
            const ry = pc.math.random(-90, 90);
            const rz = pc.math.random(-90, 90);
            clone.rigidbody.teleport(x, y, z, rx, ry, rz);
            this.cubes.push(clone);
        }
        
        this.ready = true;
    }
    
    spawnCube() {
        this.reset();
        
        if (this.cubeIndex > this.cubes.length - 1) {
            this.allSpawned = true;
            return;
        }
        
        const cube = this.cubes[this.cubeIndex++];
        cube.enabled = true;
    }
    
    changeMode(mode) {
        if (!this.renderer) {
            return;
        }
        this.renderer.setMode(mode);
    }
    
    update(dt) {
        if (!this.renderer) {
            return;
        }
        
        this.renderer.update();
        
        if (!this.ready || this.allSpawned) {
            return;
        }
        
        this.time += dt;
        
        if (this.time >= this.delay) {
            this.spawnCube();
        }
    }
    
}

pc.registerScript(Example, 'example');

Example.CUBES_AMOUNT = 30;
Example.SPAWN_HEIGHT = 10;

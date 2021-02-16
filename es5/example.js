/* jshint esversion: 6 */

console.log("load example.js");

var Example = pc.createScript('example');

Example.prototype.initialize = function() {
    this.renderer = new AmmoDebugDrawer(undefined, this.app);
    this.renderer.enable();
    
    this.bindEvents();
    this.generateCubes();
    
    this.cubeIndex = 0;
    this.allSpawned = false;
    this.reset();
}

Example.prototype.bindEvents = function() {
    this.app.on('ui:mode-select', this.changeMode, this);
}

Example.prototype.reset = function() {
    this.time = 0;
    this.delay = pc.math.random(0, 1);        
}

Example.prototype.generateCubes = function() {
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

Example.prototype.spawnCube = function() {
    this.reset();
    
    if (this.cubeIndex > this.cubes.length - 1) {
        this.allSpawned = true;
        return;
    }
    
    const cube = this.cubes[this.cubeIndex++];
    cube.enabled = true;
}

Example.prototype.changeMode = function(mode) {
    if (!this.renderer) return;
    this.renderer.setMode(mode);
}

Example.prototype.update = function(dt) {
    if (!this.renderer) return;
    
    this.renderer.update();
    
    if (!this.ready || this.allSpawned) return;
    
    this.time += dt;
    
    if (this.time >= this.delay) {
        this.spawnCube();
    }
}

Example.CUBES_AMOUNT = 30;
Example.SPAWN_HEIGHT = 10;

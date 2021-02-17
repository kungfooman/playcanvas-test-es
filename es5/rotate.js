var Rotate = pc.createScript('rotate');

Rotate.attributes.add('speed', { type: 'number', default: 10 });

// initialize code called once per entity
Rotate.prototype.initialize = function() {
    this.local = false; // choose local rotation or world rotation
};

// update code called every frame
Rotate.prototype.update = function(dt) {
    if (this.local) {
        this.entity.rotateLocal(0, this.speed * dt, 0);
    } else {
        this.entity.rotate(0, this.speed * dt, 0);
    }
};

import * as pc from 'playcanvas';
import { Example } from "./example.js";
export class Trigger extends pc.ScriptType {
    static registerName = 'trigger';
    initialize() {
        this.bindEvents();
    }
    bindEvents() {
        this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
    }
    onTriggerEnter(cube) {
        cube.rigidbody.linearVelocity = pc.Vec3.ZERO;
        cube.rigidbody.angularVelocity = pc.Vec3.ZERO;
        const x = pc.math.random(-8, 8);
        const y = Example.SPAWN_HEIGHT;
        const z = pc.math.random(-8, 8);
        const rx = pc.math.random(-90, 90);
        const ry = pc.math.random(-90, 90);
        const rz = pc.math.random(-90, 90);
        cube.rigidbody.teleport(x, y, z, rx, ry, rz);
    }    
}

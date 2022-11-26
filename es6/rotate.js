import * as pc from 'playcanvas';
export class Rotate extends pc.ScriptType {
    static registerName = 'rotate';
    static _ = (
        this.attributes.add('speed', {
            type: 'number',
            default: 10
        })
    );
    // initialize code called once per entity
    initialize() {
        this.local = false; // choose local rotation or world rotation
    }
    // update code called every frame
    update(dt) {
        if (this.local) {
            this.entity.rotateLocal(0, this.speed * dt, 0);
        } else {
            this.entity.rotate(0, this.speed * dt, 0);
        }
    }
}

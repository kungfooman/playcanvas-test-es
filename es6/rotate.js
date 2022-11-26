import * as pc from 'playcanvas';
export class Rotate extends pc.ScriptType {
    static registerName = 'rotate';
    /** @type {number} */
    speed;
    static _ = (
        this.attributes.add('speed', {
            type: 'number',
            default: 10
        })
    );
    // Choose local rotation or world rotation.
    local = false; 
    /**
     * Initialize code called once per entity.
     */
    initialize() {
        // nothing yet
    }
    /**
     * Update code called every frame.
     * 
     * @param {number} dt 
     */
    update(dt) {
        const { local, speed, entity } = this;
        if (local) {
            entity.rotateLocal(0, speed * dt, 0);
        } else {
            entity.rotate(0, speed * dt, 0);
        }
        // Test for hot-reload:
        /*
            const url = window.location.origin + '/playcanvas-test-es/es6/rotate.js';
            const { Rotate } = await import(url + "?now=" + Date.now());
            pc.registerScript(Rotate, Rotate.registerName);
        */
        let scale = entity.localScale.x + (Math.random() - 0.4) * dt * 10;
        if (Math.abs(scale) > 10) {
            scale = 2;
        }
        entity.setLocalScale(scale, scale, scale);
    }
    /**
     * @param {Rotate} old 
     */
    swap(old) {
        // nothing yet
    }
}

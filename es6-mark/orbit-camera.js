import * as pc from 'playcanvas';
export class KeyboardInput {
    static registerName = 'keyboardInput';
    /** @type {OrbitCamera} */
    orbitCamera;
    // initialize code called once per entity
    initialize() {
        this.orbitCamera = this.entity.esmscript.get('OrbitCamera');
        this.app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
    }
    postInitialize() {
        if (this.orbitCamera) {
            this.startDistance = this.orbitCamera.distance;
            this.startYaw = this.orbitCamera.yaw;
            this.startPitch = this.orbitCamera.pitch;
            this.startPivotPosition = this.orbitCamera.pivotPoint.clone();
        }
    }
    update(dt) {
        // update code called every frame
    }
    onKeyDown(event) {
        if (event.event.isOverlayEvent === true) {
            return;
        }
        if (this.orbitCamera) {
            if (event.key == pc.KEY_SPACE) {
                this.orbitCamera.reset(this.startYaw, this.startPitch, this.startDistance);
                this.orbitCamera.pivotPoint = this.startPivotPosition;
            }
        }
    }
}

export class MouseInput {
    static registerName = 'mouseInput';
    /** @type {MouseInput} */
    static instance;
    static fromWorldPoint = new pc.Vec3();
    static toWorldPoint = new pc.Vec3();
    static worldDiff = new pc.Vec3();
    /** @type {number} */
    orbitSensitivity;
    /** @type {number} */
    distanceSensitivity;
    static attributes = {
        orbitSensitivity: {
            type: 'number',
            default: 0.3,
            title: 'Orbit Sensitivity',
            description: 'How fast the camera moves around the orbit. Higher is faster'
        },
        distanceSensitivity: {
            type: 'number',
            default: 0.15,
            title: 'Distance Sensitivity',
            description: 'How fast the camera moves in and out. Higher is faster'
        }
    };
    // initialize code called once per entity
    initialize() {
        this.constructor.instance = this;
        this.orbitCamera = this.entity.esmscript.get('OrbitCamera');
        if (this.orbitCamera) {
            var self = this;
            var onMouseOut = function (e) {
                self.onMouseOut(e);
            };
            this.app.mouse.on(pc.EVENT_MOUSEDOWN , this.onMouseDown , this);
            this.app.mouse.on(pc.EVENT_MOUSEUP   , this.onMouseUp   , this);
            this.app.mouse.on(pc.EVENT_MOUSEMOVE , this.onMouseMove , this);
            this.app.mouse.on(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this);
            // Listen to when the mouse travels out of the window
            window.addEventListener('mouseout', onMouseOut, false);
        }
        // Disabling the context menu stops the browser displaying a menu when
        // you right-click the page
        this.app.mouse.disableContextMenu();
        this.lookButtonDown = false;
        this.panButtonDown = false;
        this.lastPoint = new pc.Vec2();
    }
    // Remove the listeners so if this entity is destroyed
    destroy() {
        this.app.mouse.off(pc.EVENT_MOUSEDOWN , this.onMouseDown , this);
        this.app.mouse.off(pc.EVENT_MOUSEUP   , this.onMouseUp   , this);
        this.app.mouse.off(pc.EVENT_MOUSEMOVE , this.onMouseMove , this);
        this.app.mouse.off(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this);
        window.removeEventListener('mouseout', onMouseOut, false);
    };
    pan(screenPoint) {
        var fromWorldPoint = MouseInput.fromWorldPoint;
        var toWorldPoint = MouseInput.toWorldPoint;
        var worldDiff = MouseInput.worldDiff;
        // For panning to work at any zoom level, we use screen point to world projection
        // to work out how far we need to pan the pivotEntity in world space 
        var camera = this.entity.camera;
        var distance = this.orbitCamera.distance;
        camera.screenToWorld(screenPoint.x, screenPoint.y, distance, fromWorldPoint);
        camera.screenToWorld(this.lastPoint.x, this.lastPoint.y, distance, toWorldPoint);
        worldDiff.sub2(toWorldPoint, fromWorldPoint);
        this.orbitCamera.pivotPoint.add(worldDiff);    
    }
    onMouseDown(event) {
        if (event.event.isOverlayEvent === true)
            return;
        switch (event.button) {
            case pc.MOUSEBUTTON_LEFT: {
                this.lookButtonDown = true;
            } break;
            case pc.MOUSEBUTTON_MIDDLE: 
            case pc.MOUSEBUTTON_RIGHT: {
                this.panButtonDown = true;
            } break;
        }
    }
    onMouseUp(event) {
        switch (event.button) {
            case pc.MOUSEBUTTON_LEFT: {
                this.lookButtonDown = false;
            } break;
            case pc.MOUSEBUTTON_MIDDLE: 
            case pc.MOUSEBUTTON_RIGHT: {
                this.panButtonDown = false;            
            } break;
        }
    }
    onMouseMove(event) {    
        //var mouse = pc.app.mouse;
        if (this.lookButtonDown) {
            this.orbitCamera.pitch -= event.dy * this.orbitSensitivity;
            this.orbitCamera.yaw -= event.dx * this.orbitSensitivity;
        } else if (this.panButtonDown) {
            this.pan(event);   
        }
        this.lastPoint.set(event.x, event.y);
    }
    onMouseWheel(event) {
        if (event.event.isOverlayEvent === true)
            return;
        this.orbitCamera.distance -= event.wheel * this.distanceSensitivity * (this.orbitCamera.distance * 0.1);
        event.event.preventDefault();
    }
    onMouseOut(event) {
        this.lookButtonDown = false;
        this.panButtonDown = false;
    }
}
export class TouchInput {
    static attributes = {
        orbitSensitivity: {
            type: 'number', 
            default: 0.4, 
            title: 'Orbit Sensitivity', 
            description: 'How fast the camera moves around the orbit. Higher is faster'
        },
        distanceSensitivity: {
            type: 'number', 
            default: 0.2, 
            title: 'Distance Sensitivity', 
            description: 'How fast the camera moves in and out. Higher is faster'
        }
    };
    /** @type {OrbitCamera} */
    orbitCamera;
    // initialize code called once per entity
    initialize() {
        this.orbitCamera = this.entity.script.orbitCamera;
        // Store the position of the touch so we can calculate the distance moved
        this.lastTouchPoint    = new pc.Vec2();
        this.lastPinchMidPoint = new pc.Vec2();
        this.lastPinchDistance = 0;
        if (this.orbitCamera && this.app.touch) {
            // Use the same callback for the touchStart, touchEnd and touchCancel events as they 
            // all do the same thing which is to deal the possible multiple touches to the screen
            this.app.touch.on(pc.EVENT_TOUCHSTART , this.onTouchStartEndCancel, this);
            this.app.touch.on(pc.EVENT_TOUCHEND   , this.onTouchStartEndCancel, this);
            this.app.touch.on(pc.EVENT_TOUCHCANCEL, this.onTouchStartEndCancel, this);
            this.app.touch.on(pc.EVENT_TOUCHMOVE  , this.onTouchMove          , this);
            this.on('destroy', function() {
                this.app.touch.off(pc.EVENT_TOUCHSTART , this.onTouchStartEndCancel, this);
                this.app.touch.off(pc.EVENT_TOUCHEND   , this.onTouchStartEndCancel, this);
                this.app.touch.off(pc.EVENT_TOUCHCANCEL, this.onTouchStartEndCancel, this);
                this.app.touch.off(pc.EVENT_TOUCHMOVE  , this.onTouchMove          , this);
            });
        }
    }
    getPinchDistance(pointA, pointB) {
        // Return the distance between the two points
        var dx = pointA.x - pointB.x;
        var dy = pointA.y - pointB.y;
        return Math.sqrt((dx * dx) + (dy * dy));
    }
    calcMidPoint(pointA, pointB, result) {
        result.set(pointB.x - pointA.x, pointB.y - pointA.y);
        result.scale(0.5);
        result.x += pointA.x;
        result.y += pointA.y;
    }
    onTouchStartEndCancel(event) {
        // We only care about the first touch for camera rotation. As the user touches the screen, 
        // we stored the current touch position
        var touches = event.touches;
        if (touches.length == 1) {
            this.lastTouchPoint.set(touches[0].x, touches[0].y);
        } else if (touches.length == 2) {
            // If there are 2 touches on the screen, then set the pinch distance
            this.lastPinchDistance = this.getPinchDistance(touches[0], touches[1]);
            this.calcMidPoint(touches[0], touches[1], this.lastPinchMidPoint);
        }
    }
    static fromWorldPoint = new pc.Vec3();
    static toWorldPoint   = new pc.Vec3();
    static worldDiff      = new pc.Vec3();
    pan(midPoint) {
        var fromWorldPoint = TouchInput.fromWorldPoint;
        var toWorldPoint = TouchInput.toWorldPoint;
        var worldDiff = TouchInput.worldDiff;
        // For panning to work at any zoom level, we use screen point to world projection
        // to work out how far we need to pan the pivotEntity in world space 
        var camera = this.entity.camera;
        var distance = this.orbitCamera.distance;
        camera.screenToWorld(midPoint.x, midPoint.y, distance, fromWorldPoint);
        camera.screenToWorld(this.lastPinchMidPoint.x, this.lastPinchMidPoint.y, distance, toWorldPoint);
        worldDiff.sub2(toWorldPoint, fromWorldPoint);
        this.orbitCamera.pivotPoint.add(worldDiff);    
    }
    static pinchMidPoint = new pc.Vec2();
    onTouchMove(event) {
        var pinchMidPoint = TouchInput.pinchMidPoint;
        // We only care about the first touch for camera rotation. Work out the difference moved since the last event
        // and use that to update the camera target position 
        var touches = event.touches;
        if (touches.length == 1) {
            var touch = touches[0];
            this.orbitCamera.pitch -= (touch.y - this.lastTouchPoint.y) * this.orbitSensitivity;
            this.orbitCamera.yaw   -= (touch.x - this.lastTouchPoint.x) * this.orbitSensitivity;
            this.lastTouchPoint.set(touch.x, touch.y);
        } else if (touches.length == 2) {
            // Calculate the difference in pinch distance since the last event
            var currentPinchDistance = this.getPinchDistance(touches[0], touches[1]);
            var diffInPinchDistance  = currentPinchDistance - this.lastPinchDistance;
            this.lastPinchDistance   = currentPinchDistance;
            this.orbitCamera.distance -= (diffInPinchDistance * this.distanceSensitivity * 0.1) * (this.orbitCamera.distance * 0.1);
            // Calculate pan difference
            this.calcMidPoint(touches[0], touches[1], pinchMidPoint);
            this.pan(pinchMidPoint);
            this.lastPinchMidPoint.copy(pinchMidPoint);
        }
    }
}
const attributes = {
    distanceMax: { type: 'number', default: 0, title: 'Distance Max', description: 'Setting this at 0 will give an infinite distance limit' },
    distanceMin: { type: 'number', default: 0, title: 'Distance Min' },
    pitchAngleMax: { type: 'number', default: 90, title: 'Pitch Angle Max (degrees)' },
    pitchAngleMin: { type: 'number', default: -90, title: 'Pitch Angle Min (degrees)' },
    inertiaFactor: {
        type: 'number',
        default: 0,
        title: 'Inertia Factor',
        description: 'Higher value means that the camera will continue moving after the user has stopped dragging. 0 is fully responsive.'
    },
    focusEntity: {
        type: 'entity',
        title: 'Focus Entity',
        description: 'Entity for the camera to focus on. If blank, then the camera will use the whole scene'
    },
    frameOnStart: {
        type: 'boolean',
        default: true,
        title: 'Frame on Start',
        description: 'Frames the entity or scene at the start of the application."'
    }
};
export class OrbitCamera {
    static attributes = attributes;
    static registerName = 'orbitCamera';
    // Property to get and set the distance between the pivot point and camera
    // Clamped between this.distanceMin and this.distanceMax
    get distance() {
        return this._targetDistance;
    }
    set distance(value) {
        this._targetDistance = this._clampDistance(value);
    }
    // Property to get and set the pitch of the camera around the pivot point (degrees)
    // Clamped between this.pitchAngleMin and this.pitchAngleMax
    // When set at 0, the camera angle is flat, looking along the horizon
    get pitch() {
        return this._targetPitch;
    }
    set pitch(value) {
        this._targetPitch = this._clampPitchAngle(value);
    }
    // Property to get and set the yaw of the camera around the pivot point (degrees)
    get yaw() {
        return this._targetYaw;
    }
    set yaw(value) {
        this._targetYaw = value;
        // Ensure that the yaw takes the shortest route by making sure that 
        // the difference between the targetYaw and the actual is 180 degrees
        // in either direction
        var diff = this._targetYaw - this._yaw;
        var reminder = diff % 360;
        if (reminder > 180) {
            this._targetYaw = this._yaw - (360 - reminder);
        } else if (reminder < -180) {
            this._targetYaw = this._yaw + (360 + reminder);
        } else {
            this._targetYaw = this._yaw + reminder;
        }
    }
    // Property to get and set the world position of the pivot point that the camera orbits around
    get pivotPoint() {
        return this._pivotPoint;
    }
    set pivotPoint(value) {
        this._pivotPoint.copy(value);
    }
    // Reapply the clamps if they are changed in the editor
    set distanceMin(value) {
        this._distanceMin = value;
        this._distance = this._clampDistance(this._distance);
    }

    get distanceMin() {
        return this._distanceMin;
    }

    set distanceMax(value) {
        this._distanceMax = value;
        this._distance = this._clampDistance(this._distance);
    }

    get distanceMax() {
        return this._distanceMax;
    }

    set pitchAngleMin(value) {
        this._pitchAngleMin = value;
        this._pitch = this._clampPitchAngle(this._pitch);
    }

    get pitchAngleMin() {
        return this._pitchAngleMin;
    }

    set pitchAngleMax(value) {
        this._pitchAngleMax = value;
        this._pitch = this._clampPitchAngle(this._pitch);
    }

    get pitchAngleMax() {
        return this._pitchAngleMax;
    }

    set frameOnStart(value) {
        this._frameOnStart = value;
        if (value && this.app) {
            this.focus(this.focusEntity || this.app.root);
        }
    }

    get frameOnStart() {
        return this._frameOnStart;
    }

    /** @type {pc.Entity} */
    _focusEntity;

    /** @type {pc.Entity} */
    set focusEntity(value) {
        this._focusEntity = value;
        if (this.frameOnStart) {
            this.focus(value || this.app.root);
        } else {
            this.resetAndLookAtEntity(this.entity.getPosition(), value || this.app.root);
        }
    }
    // Moves the camera to look at an entity and all its children so they are all in the view
    focus(focusEntity) {
        // Calculate an bounding box that encompasses all the models to frame in the camera view
        this._buildAabb(focusEntity, 0);
        var halfExtents = this._modelsAabb.halfExtents;
        var distance = Math.max(halfExtents.x, Math.max(halfExtents.y, halfExtents.z));
        distance = (distance / Math.tan(0.5 * this.entity.camera.fov * pc.math.DEG_TO_RAD));
        distance = (distance * 2);
        this.distance = distance;
        if (this.entity.camera) {
            this.entity.camera.nearClip = distance * 0.002;
            this.entity.camera.farClip = distance * 5;
        }
        this._removeInertia();
        this._pivotPoint.copy(this._modelsAabb.center);
    }
    static distanceBetween = new pc.Vec3();
    // Set the camera position to a world position and look at a world position
    // Useful if you have multiple viewing angles to swap between in a scene
    resetAndLookAtPoint(resetPoint, lookAtPoint) {
        this.pivotPoint.copy(lookAtPoint);
        this.entity.setPosition(resetPoint);
        this.entity.lookAt(lookAtPoint);
        var distance = OrbitCamera.distanceBetween;
        distance.sub2(lookAtPoint, resetPoint);
        this.distance = distance.length();
        this.pivotPoint.copy(lookAtPoint);
        var cameraQuat = this.entity.getRotation();
        this.yaw = this._calcYaw(cameraQuat);
        this.pitch = this._calcPitch(cameraQuat, this.yaw);
        this._removeInertia();
        this._updatePosition();
    }
    // Set camera position to a world position and look at an entity in the scene
    // Useful if you have multiple models to swap between in a scene
    resetAndLookAtEntity(resetPoint, entity) {
        this._buildAabb(entity, 0);
        this.resetAndLookAtPoint(resetPoint, this._modelsAabb.center);
    }
    // Set the camera at a specific, yaw, pitch and distance without inertia (instant cut)
    reset(yaw, pitch, distance) {
        this.pitch = pitch;
        this.yaw = yaw;
        this.distance = distance;
        this._removeInertia();
    }
    // Private methods
    initialize() {
        this.checkAspectRatioBound = _ => this._checkAspectRatio();
        window.addEventListener('resize', this.checkAspectRatioBound, false);
        this._checkAspectRatio();
        // Find all the models in the scene that are under the focused entity
        this._modelsAabb = new pc.BoundingBox();
        this._buildAabb(this.focusEntity || this.app.root, 0);
        this.entity.lookAt(this._modelsAabb.center);
        this._pivotPoint = new pc.Vec3();
        this._pivotPoint.copy(this._modelsAabb.center);
        // Calculate the camera euler angle rotation around x and y axes
        // This allows us to place the camera at a particular rotation to begin with in the scene
        var cameraQuat = this.entity.getRotation();
        // Preset the camera
        this._yaw = this._calcYaw(cameraQuat);
        this._pitch = this._clampPitchAngle(this._calcPitch(cameraQuat, this._yaw));
        this.entity.setLocalEulerAngles(this._pitch, this._yaw, 0);
        this._distance = 0;
        this._targetYaw = this._yaw;
        this._targetPitch = this._pitch;
        // If we have ticked focus on start, then attempt to position the camera where it frames
        // the focused entity and move the pivot point to entity's position otherwise, set the distance
        // to be between the camera position in the scene and the pivot point
        if (this.frameOnStart) {
            this.focus(this.focusEntity || this.app.root);
        } else {
            var distanceBetween = new pc.Vec3();
            distanceBetween.sub2(this.entity.getPosition(), this._pivotPoint);
            this._distance = this._clampDistance(distanceBetween.length());
        }
        this._targetDistance = this._distance;
    }
    destroy() {
        window.removeEventListener('resize', this.onWindowResizeBound, false);
    }
    update(dt) {
        // Add inertia, if any
        var t = this.inertiaFactor === 0 ? 1 : Math.min(dt / this.inertiaFactor, 1);
        this._distance = pc.math.lerp(this._distance, this._targetDistance, t);
        this._yaw      = pc.math.lerp(this._yaw, this._targetYaw, t);
        this._pitch    = pc.math.lerp(this._pitch, this._targetPitch, t);
        this._updatePosition();
    }
    _updatePosition() {
        // Work out the camera position based on the pivot point, pitch, yaw and distance
        this.entity.setLocalPosition(0,0,0);
        this.entity.setLocalEulerAngles(this._pitch, this._yaw, 0);
        var position = this.entity.getPosition();
        position.copy(this.entity.forward);
        position.scale(-this._distance);
        position.add(this.pivotPoint);
        this.entity.setPosition(position);
    }
    _removeInertia() {
        this._yaw = this._targetYaw;
        this._pitch = this._targetPitch;
        this._distance = this._targetDistance;
    }
    _checkAspectRatio() {
        var height = this.app.graphicsDevice.height;
        var width = this.app.graphicsDevice.width;
        // Match the axis of FOV to match the aspect ratio of the canvas so
        // the focused entities is always in frame
        this.entity.camera.horizontalFov = height > width;
    }
    _buildAabb(entity, modelsAdded) {
        var i = 0;
        if (entity.model) {
            var mi = entity.model.meshInstances;
            for (i = 0; i < mi.length; i++) {
                if (modelsAdded === 0) {
                    this._modelsAabb.copy(mi[i].aabb);
                } else {
                    this._modelsAabb.add(mi[i].aabb);
                }
                modelsAdded += 1;
            }
        }
        for (i = 0; i < entity.children.length; ++i) {
            modelsAdded += this._buildAabb(entity.children[i], modelsAdded);
        }
        return modelsAdded;
    }
    _calcYaw(quat) {
        var transformedForward = new pc.Vec3();
        quat.transformVector(pc.Vec3.FORWARD, transformedForward);
        return Math.atan2(-transformedForward.x, -transformedForward.z) * pc.math.RAD_TO_DEG;
    }
    _clampDistance(distance) {
        if (this.distanceMax > 0) {
            return pc.math.clamp(distance, this.distanceMin, this.distanceMax);
        } else {
            return Math.max(distance, this.distanceMin);
        }
    }
    _clampPitchAngle(pitch) {
        // Negative due as the pitch is inversed since the camera is orbiting the entity
        return pc.math.clamp(pitch, -this.pitchAngleMax, -this.pitchAngleMin);
    }
    static quatWithoutYaw = new pc.Quat();
    static yawOffset = new pc.Quat();
    _calcPitch(quat, yaw) {
        var quatWithoutYaw = OrbitCamera.quatWithoutYaw;
        var yawOffset = OrbitCamera.yawOffset;
        yawOffset.setFromEulerAngles(0, -yaw, 0);
        quatWithoutYaw.mul2(yawOffset, quat);
        var transformedForward = new pc.Vec3();
        quatWithoutYaw.transformVector(pc.Vec3.FORWARD, transformedForward);
        return Math.atan2(transformedForward.y, -transformedForward.z) * pc.math.RAD_TO_DEG;
    }
}

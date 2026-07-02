import * as THREE from "three";
import {
  INTRO_ORBIT_RADIUS,
  INTRO_ORBIT_HEIGHT,
  INTRO_LOOK_TARGET,
  INTRO_AUTO_ROTATE_SPEED,
  INTRO_START_ANGLE,
  DESK_CAMERA_POSITION,
  DESK_CAMERA_TARGET,
  DESK_LOOK_X,
  DESK_LOOK_Y,
  DESK_LOOK_SMOOTHING,
  MONITOR_CAMERA_POSITION,
  MONITOR_CAMERA_TARGET,
  PSP_CAMERA_POSITION,
  PSP_CAMERA_TARGET,
} from "../../constants/scene";

export interface KeyframeState {
  clock: THREE.Clock;
  pointer: THREE.Vector2;
}

export abstract class CameraKeyframeInstance {
  position = new THREE.Vector3();
  focalPoint = new THREE.Vector3();

  abstract update(state: KeyframeState): void;
  abstract reset(): void;
}

export class IntroKeyframe extends CameraKeyframeInstance {
  private angle = INTRO_START_ANGLE;

  constructor() {
    super();
    this.position.set(
      -Math.sin(this.angle) * INTRO_ORBIT_RADIUS,
      INTRO_ORBIT_HEIGHT,
      Math.cos(this.angle) * INTRO_ORBIT_RADIUS,
    );
    this.focalPoint.set(...INTRO_LOOK_TARGET);
  }

  update(state: KeyframeState): void {
    const dt = state.clock.getDelta();
    this.angle += INTRO_AUTO_ROTATE_SPEED * dt;
    this.position.set(
      -Math.sin(this.angle) * INTRO_ORBIT_RADIUS,
      INTRO_ORBIT_HEIGHT,
      Math.cos(this.angle) * INTRO_ORBIT_RADIUS,
    );
  }

  reset(): void {
    this.angle = INTRO_START_ANGLE;
    this.position.set(
      -Math.sin(this.angle) * INTRO_ORBIT_RADIUS,
      INTRO_ORBIT_HEIGHT,
      Math.cos(this.angle) * INTRO_ORBIT_RADIUS,
    );
    this.focalPoint.set(...INTRO_LOOK_TARGET);
  }
}

const _lookTarget = new THREE.Vector3();

export class DeskKeyframe extends CameraKeyframeInstance {
  constructor() {
    super();
    this.position.set(...DESK_CAMERA_POSITION);
    this.focalPoint.set(...DESK_CAMERA_TARGET);
  }

  update(state: KeyframeState): void {
    _lookTarget.set(
      DESK_CAMERA_TARGET[0] + state.pointer.x * DESK_LOOK_X,
      DESK_CAMERA_TARGET[1] + state.pointer.y * DESK_LOOK_Y,
      DESK_CAMERA_TARGET[2],
    );
    this.focalPoint.lerp(_lookTarget, DESK_LOOK_SMOOTHING);
  }

  reset(): void {
    this.position.set(...DESK_CAMERA_POSITION);
    this.focalPoint.set(...DESK_CAMERA_TARGET);
  }
}

export class MonitorKeyframe extends CameraKeyframeInstance {
  constructor() {
    super();
    this.position.set(...MONITOR_CAMERA_POSITION);
    this.focalPoint.set(...MONITOR_CAMERA_TARGET);
  }

  update(_state: KeyframeState): void {}

  reset(): void {
    this.position.set(...MONITOR_CAMERA_POSITION);
    this.focalPoint.set(...MONITOR_CAMERA_TARGET);
  }
}

export class PspKeyframe extends CameraKeyframeInstance {
  constructor() {
    super();
    this.position.set(...PSP_CAMERA_POSITION);
    this.focalPoint.set(...PSP_CAMERA_TARGET);
  }

  update(_state: KeyframeState): void {}

  reset(): void {
    this.position.set(...PSP_CAMERA_POSITION);
    this.focalPoint.set(...PSP_CAMERA_TARGET);
  }
}

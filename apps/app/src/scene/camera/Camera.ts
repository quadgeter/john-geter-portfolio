import * as THREE from "three";
import { Tween, Group, Easing } from "@tweenjs/tween.js";
import type { CameraMode } from "../../store/useCameraStore";
import {
  INTRO_TO_DESK_DURATION,
  DESK_TO_MONITOR_DURATION,
  DESK_TO_PSP_DURATION,
  MONITOR_TO_DESK_DURATION,
  PSP_TO_DESK_DURATION,
  ANY_TO_INTRO_DURATION,
} from "../../constants/scene";
import {
  CameraKeyframeInstance,
  IntroKeyframe,
  DeskKeyframe,
  MonitorKeyframe,
  PspKeyframe,
  type KeyframeState,
} from "./CameraKeyframes";

type EasingFunction = (amount: number) => number;

const DURATION_MAP: Record<string, number> = {
  "intro->desk": INTRO_TO_DESK_DURATION,
  "desk->monitor": DESK_TO_MONITOR_DURATION,
  "desk->psp": DESK_TO_PSP_DURATION,
  "monitor->desk": MONITOR_TO_DESK_DURATION,
  "psp->desk": PSP_TO_DESK_DURATION,
};

const EASING_MAP: Record<string, EasingFunction> = {
  "psp->desk": Easing.Cubic.InOut,
};

function getTransitionDuration(from: CameraMode, to: CameraMode): number {
  if (to === "intro") return ANY_TO_INTRO_DURATION;
  return DURATION_MAP[`${from}->${to}`] ?? 800;
}

function getTransitionEasing(from: CameraMode, to: CameraMode): EasingFunction {
  return EASING_MAP[`${from}->${to}`] ?? Easing.Quadratic.InOut;
}

export class Camera {
  keyframes: Map<CameraMode, CameraKeyframeInstance>;
  active: CameraKeyframeInstance;
  activeMode: CameraMode;

  _position = new THREE.Vector3();
  _focalPoint = new THREE.Vector3();

  private _tweenGroup = new Group();
  private _tweening = false;

  private _setInTransition: (v: boolean) => void;

  constructor(
    initialMode: CameraMode,
    setInTransition: (v: boolean) => void,
  ) {
    this._setInTransition = setInTransition;

    this.keyframes = new Map<CameraMode, CameraKeyframeInstance>([
      ["intro", new IntroKeyframe()],
      ["desk", new DeskKeyframe()],
      ["monitor", new MonitorKeyframe()],
      ["psp", new PspKeyframe()],
    ]);

    this.active = this.keyframes.get(initialMode)!;
    this.activeMode = initialMode;
    this._position.copy(this.active.position);
    this._focalPoint.copy(this.active.focalPoint);
  }

  transition(
    mode: CameraMode,
    duration?: number,
    easing?: EasingFunction,
  ): void {
    const target = this.keyframes.get(mode)!;
    target.reset();

    const dur = duration ?? getTransitionDuration(this.activeMode, mode);
    const ease = easing ?? getTransitionEasing(this.activeMode, mode);

    this._tweenGroup.removeAll();
    this._tweening = true;
    this._setInTransition(true);

    const posObj = { x: this._position.x, y: this._position.y, z: this._position.z };
    const posTween = new Tween(posObj)
      .to({ x: target.position.x, y: target.position.y, z: target.position.z }, dur)
      .easing(ease)
      .onUpdate(() => {
        this._position.set(posObj.x, posObj.y, posObj.z);
      });

    const fpObj = { x: this._focalPoint.x, y: this._focalPoint.y, z: this._focalPoint.z };
    const fpTween = new Tween(fpObj)
      .to({ x: target.focalPoint.x, y: target.focalPoint.y, z: target.focalPoint.z }, dur)
      .easing(ease)
      .onUpdate(() => {
        this._focalPoint.set(fpObj.x, fpObj.y, fpObj.z);
      })
      .onComplete(() => {
        this._tweening = false;
        this.active = target;
        this.activeMode = mode;
        this._setInTransition(false);
      });

    this._tweenGroup.add(posTween, fpTween);
    posTween.start();
    fpTween.start();
  }

  update(state: KeyframeState): void {
    if (this._tweening) {
      this._tweenGroup.update();
    } else {
      this.active.update(state);
      this._position.copy(this.active.position);
      this._focalPoint.copy(this.active.focalPoint);
    }
  }
}

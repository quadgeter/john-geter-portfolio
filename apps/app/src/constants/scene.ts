import type { Vector3Tuple } from 'three'

export const CAMERA_FOV = 45
export const CAMERA_NEAR = 0.1
export const CAMERA_FAR = 50

export const INTRO_ORBIT_RADIUS = 5.5
export const INTRO_ORBIT_HEIGHT = 2.5
export const INTRO_AUTO_ROTATE_SPEED = -0.05
export const INTRO_START_ANGLE = 0.4
export const INTRO_LOOK_TARGET: Vector3Tuple = [0, 1.2, -1]

export const DESK_CAMERA_POSITION: Vector3Tuple = [-0.5, 1.5, 1.5]
export const DESK_CAMERA_TARGET: Vector3Tuple = [0.35, 1.15, -0.1]
export const DESK_LOOK_X = 0.6
export const DESK_LOOK_Y = 0.2
export const DESK_LOOK_SMOOTHING = 0.04

export const MONITOR_CAMERA_POSITION: Vector3Tuple = [0.35, 1.22, 0.38]
export const MONITOR_CAMERA_TARGET: Vector3Tuple = [0.545, 1.2, -0.03]

export const PSP_CAMERA_POSITION: Vector3Tuple = [-0.5, 1.5, 1.5]
export const PSP_CAMERA_TARGET: Vector3Tuple = [-0.5, 1.4, 1.35]
export const PSP_HELD_LIFT = 0.44
export const PSP_HELD_FORWARD = 1.29
export const PSP_HELD_LATERAL = 0.28
export const PSP_HELD_TILT = 1.1
export const PSP_HELD_FLATTEN = -0.535

export const INITIAL_POSITION: Vector3Tuple = [
  -Math.sin(INTRO_START_ANGLE) * INTRO_ORBIT_RADIUS,
  INTRO_ORBIT_HEIGHT,
  Math.cos(INTRO_START_ANGLE) * INTRO_ORBIT_RADIUS,
]

export const FOG_COLOR = '#383430'
export const FOG_DENSITY = 0.15
export const BACKGROUND_COLOR = '#0a0908'

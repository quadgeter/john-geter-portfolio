import type { Vector3Tuple } from 'three'

export const CAMERA_FOV = 45
export const CAMERA_NEAR = 0.1
export const CAMERA_FAR = 50

// Intro orbit
export const INTRO_ORBIT_RADIUS = 5.5
export const INTRO_ORBIT_HEIGHT = 2.5
export const INTRO_ORBIT_SPEED = 0.15 // radians per second — tune for feel
export const INTRO_START_ANGLE = 0 // 0 = front of desk (back of monitor)
export const INTRO_LOOK_TARGET: Vector3Tuple = [0, 1.2, -1]

// Desk view
export const DESK_CAMERA_POSITION: Vector3Tuple = [0, 2.5, 5]
export const DESK_CAMERA_TARGET: Vector3Tuple = [0, 1.2, -1]

// Monitor view — tune once scene is confirmed in browser
export const MONITOR_CAMERA_POSITION: Vector3Tuple = [0.4, 1.7, 1.2]
export const MONITOR_CAMERA_TARGET: Vector3Tuple = [0, 1.5, -1]

// Legacy aliases used by App.tsx canvas camera prop
export const INITIAL_POSITION: Vector3Tuple = DESK_CAMERA_POSITION
export const INITIAL_TARGET: Vector3Tuple = DESK_CAMERA_TARGET

export const FOG_COLOR = '#383430'
export const FOG_DENSITY = 0.15
export const BACKGROUND_COLOR = '#0a0908'

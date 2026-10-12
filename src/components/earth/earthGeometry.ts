export const EARTH_RADIUS = 2.592;
export const CAMERA_FOV = 75;
export const CAMERA_POSITION_Z = 5;

/**
 * Visible sphere diameter as a fraction of the (square) canvas box.
 * Perspective silhouette: tan(asin(r / d)) / tan(fov / 2) ≈ 0.79.
 * Layout code sizes the box from the sphere it wants on screen.
 */
export const EARTH_FILL =
  Math.tan(Math.asin(EARTH_RADIUS / CAMERA_POSITION_Z)) /
  Math.tan(((CAMERA_FOV / 2) * Math.PI) / 180);

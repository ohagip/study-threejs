/**
 * clamp
 * @param {number} val
 * @param {number} min
 * @param {number} max
 */
export const clamp = (val, min, max) => {
  return Math.max(min, Math.min(max, val))
}

/**
 * lerp
 * @param {Number} start
 * @param {Number} end
 * @param {Number} amount
 */
export const lerp = (start, end, amount) => {
  return (1 - amount) * start + amount * end
}
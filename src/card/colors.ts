/**
 * Enum holding available card colors.
 *
 * RED, BLUE, GREEN and YELLOW,
 * represented with indexes
 * 1, 2, 3, 4 respectively.
 */
export enum Color {
  RED = 1,
  BLUE = 2,
  GREEN = 3,
  YELLOW = 4,
}

export const colors = [Color.RED, Color.BLUE, Color.GREEN, Color.YELLOW];

/**
 * Runtime type checking
 */
export function isValidColor(color: Color) {
  return colors.indexOf(color) !== -1;
}

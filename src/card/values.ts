export enum Value {
  // numbers
  ZERO = 0,
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
  EIGHT = 8,
  NINE = 9,
  // special cards
  DRAW_TWO = 10,
  REVERSE = 11,
  SKIP = 12,
  WILD = 13,
  WILD_DRAW_FOUR = 14,
}

export const values = [
  Value.ZERO,
  Value.ONE,
  Value.TWO,
  Value.THREE,
  Value.FOUR,
  Value.FIVE,
  Value.SIX,
  Value.SEVEN,
  Value.EIGHT,
  Value.NINE,
  Value.DRAW_TWO,
  Value.REVERSE,
  Value.SKIP,
  Value.WILD,
  Value.WILD_DRAW_FOUR,
];

/**
 * Returns true if `value` is {@link Value.WILD} or {@link Value.WILD_DRAW_FOUR}.
 */
export function isWild(value: Value) {
  return value === Value.WILD || value === Value.WILD_DRAW_FOUR;
}

/**
 * Runtime type checking
 */
export function isValidValue(value: Value) {
  return values.indexOf(value) !== -1;
}

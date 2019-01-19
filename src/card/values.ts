export enum Values {
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

export namespace Values {
  /**
   * Returns true if `value` is {@link Values.WILD} or {@link Values.WILD_DRAW_FOUR}.
   */
  export function isWild(value: Values) {
    return value === Values.WILD || value === Values.WILD_DRAW_FOUR;
  }

  /**
   * Runtime type checking
   */
  export function isValidValue(value: Values) {
    return values.indexOf(value) !== -1;
  }

  export const values = [
    Values.ZERO,
    Values.ONE,
    Values.TWO,
    Values.THREE,
    Values.FOUR,
    Values.FIVE,
    Values.SIX,
    Values.SEVEN,
    Values.EIGHT,
    Values.NINE,
    Values.DRAW_TWO,
    Values.REVERSE,
    Values.SKIP,
    Values.WILD,
    Values.WILD_DRAW_FOUR,
  ];
}

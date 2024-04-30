import { Color, isValidColor } from './colors';
import { isValidValue, isWild, Value } from './values';

export class Card {
  private _value: Value;
  private _color: Color | undefined;

  constructor(value: Value, color?: Color) {
    if (!isWild(value) && color === undefined) {
      throw Error('Only wild cards can be initialized with no color');
    }

    this.value = value;
    this.color = color;
  }

  get value() {
    return this._value;
  }

  set value(value: Value) {
    if (this._value !== undefined && !this.isWildCard())
      throw new Error('Card values cannot be changed.');
    else if (!isValidValue(value))
      throw new Error('The value must be a value from Value enum.');

    this._value = value;
  }

  /**
   * Index of the card color (from 0 to 3).
   *
   * WILD and WILD DRAW FOUR will not have this property set at start,
   * leaving it `undefined` until user sets it.
   */
  get color() {
    return this._color;
  }

  /**
   * @throws if trying to change the color of a non-wild card.
   * @throws if trying to set this to an unexistent color.
   */
  set color(color: Color) {
    if (this._color !== undefined && !this.isWildCard())
      throw new Error('Only wild cards can have theirs colors changed.');
    else if (color !== undefined && !isValidColor(color))
      throw new Error('The color must be a value from Color enum.');

    this._color = color;
  }

  isWildCard() {
    return isWild(this.value);
  }

  isSpecialCard() {
    return (
      this.isWildCard() ||
      this.value === Value.DRAW_TWO ||
      this.value === Value.REVERSE ||
      this.value === Value.SKIP
    );
  }

  /**
   * Checks if this card instance may be played upon
   * the given card.
   *
   * @example
   *
   * const blueZero = new Card(CardValue.ZERO, CardColor.BLUE);
   * const wild = new Card(CardValue.WILD);
   * const redSkip = new Card(CardValue.SKIP, CardColor.RED);
   * blueZero.matches(redSkip);
   * //> false
   * blueZero.matches(new Card(CardValue.ZERO, CardColor.YELLOW));
   * //> true
   * wild.matches(redSkip);
   * //> true
   *
   * @throws If any of the cards don't have their colors set.
   *
   * @param other The card to be compared with
   */
  matches(other: Card) {
    if (this.isWildCard()) return true;
    else if (this.color === undefined || other.color === undefined)
      throw new Error(
        'Both cards must have theirs colors set before comparing',
      );

    return other.value === this.value || other.color === this.color;
  }

  get score() {
    switch (this.value) {
      case Value.DRAW_TWO:
      case Value.SKIP:
      case Value.REVERSE:
        return 20;
      case Value.WILD:
      case Value.WILD_DRAW_FOUR:
        return 50;
      default:
        return this.value;
    }
  }

  /**
   * Check if the card exactly equals with the provided values.
   *
   * If `color` is not specified, only `value` is checked.
   *
   * @param value Value to check against
   * @param color Color to check against
   */
  is(value: Value, color?: Color) {
    let matches = this.value === value;
    if (!!color) matches = matches && this.color === color;
    return matches;
  }

  toString() {
    return `${Color[this.color] || 'NO_COLOR'} ${Value[this.value]}`;
  }
}

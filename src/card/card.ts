import { Colors } from './colors';
import { Values } from './values';

export class Card {
  private _value: Values;
  private _color: Colors | undefined;

  constructor(value: Values, color?: Colors) {
    if (!Values.isWild(value) && color === undefined) {
      throw Error('Only wild cards can be initialized with no color');
    }

    this.value = value;
    this.color = color;
  }

  get value() {
    return this._value;
  }

  set value(value: Values) {
    if (this._value !== undefined && !this.isWildCard())
      throw new Error('Card values cannot be changed.');
    else if (!Values.isValidValue(value))
      throw new Error('The value must be a value from Values enum.');

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
  set color(color: Colors) {
    if (this._color !== undefined && !this.isWildCard())
      throw new Error('Only wild cards can have theirs colors changed.');
    else if (color === undefined || !Colors.isValidValue(color))
      throw new Error('The color must be a value from Colors enum.');

    this._color = color;
  }

  isWildCard() {
    return Values.isWild(this.value);
  }

  isSpecialCard() {
    return (
      this.isWildCard() ||
      this.value === Values.DRAW_TWO ||
      this.value === Values.REVERSE ||
      this.value === Values.SKIP
    );
  }

  /**
   * Checks if this card instance may be played upon
   * the given card.
   *
   * @example
   *
   * const blueZero = new Card(Values.ZERO, Colors.BLUE);
   * const wild = new Card(Values.WILD);
   * const redSkip = new Card(Values.SKIP, Colors.RED);
   * blueZero.matches(redSkip);
   * //> false
   * blueZero.matches(new Card(Values.ZERO, Colors.YELLOW));
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
      case Values.DRAW_TWO:
      case Values.SKIP:
      case Values.REVERSE:
        return 20;
      case Values.WILD:
      case Values.WILD_DRAW_FOUR:
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
  is(value: Values, color?: Colors) {
    let matches = this.value === value;
    if (!!color) matches = matches && this.color === color;
    return matches;
  }

  toString() {
    return `${Colors[this.color] || 'NO_COLOR'} ${Values[this.value]}`;
  }
}

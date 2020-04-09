import { Colors } from './colors';
import { Values } from './values';

export class Card {
  private _value: Values;
  private _color: Colors | null;

  constructor(value: Values, color?: Colors) {
    this._value = value;
    this._color = color === undefined ? undefined : color;

    if (!this.isWildCard() && this.color === undefined) {
      throw Error('Only wild cards can be initialized with no color');
    }
  }

  get color() {
    return this._color;
  }

  set color(color: Colors) {
    if (!this.isWildCard())
      throw new Error('Only wild cards can have theirs colors changed.');
    else if (typeof color === 'undefined' || color < 1 || color > 4)
      throw new Error('The color must be a value from Colors enum.');

    this._color = color;
  }

  get value() {
    return this._value;
  }

  isWildCard() {
    return this.value === Values.WILD || this.value === Values.WILD_DRAW_FOUR;
  }

  isSpecialCard() {
    return (
      this.isWildCard() ||
      this.value === Values.DRAW_TWO ||
      this.value === Values.REVERSE ||
      this.value === Values.SKIP
    );
  }

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

  is(value: Values, color?: Colors) {
    let matches = this.value === value;
    if (!!color) matches = matches && this.color === color;
    return matches;
  }

  toString() {
    return `${Colors[this.color] || 'NO_COLOR'} ${Values[this.value]}`;
  }
}

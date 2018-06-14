import Enum from 'enum';
import Values from './value';

export class Card {
  private _color: EnumItem | null;

  constructor(public value: EnumItem, color: EnumItem) {
    if (!value.is || (color && !color.is))
      throw new Error('The parameter must be an enum.');

    this.color = color || undefined;

    if (!this.isWildCard() && !this.color) {
      throw Error('Only wild cards can be initialized with no color');
    }
  }

  get color() {
    return this._color;
  }

  set color(value: EnumItem) {
    if (!this.isWildCard())
      throw new Error('Only wild cards can have theirs colors changed.');
    else if (!value.is)
      throw new Error('The color must be a value from Colors enum.');
    this._color = value;
  }

  isWildCard() {
    return (
      this.value.is(Values.WILD as EnumItem) ||
      this.value.is(Values.WILD_DRAW_FOUR as EnumItem)
    );
  }

  isSpecialCard() {
    return (
      this.isWildCard() ||
      this.value.is(Values.DRAW_TWO as EnumItem) ||
      this.value.is(Values.REVERSE as EnumItem) ||
      this.value.is(Values.SKIP as EnumItem)
    );
  }

  matches(other: Card) {
    if (this.isWildCard()) return true;
    else if (this.color == undefined || other.color == undefined)
      throw new Error(
        'Both cards must have theirs colors set before comparing',
      );

    return other.value == this.value || other.color == this.color;
  }

  score() {
    switch (this.value) {
      case Values.DRAW_TWO:
      case Values.SKIP:
      case Values.REVERSE:
        return 20;
      case Values.WILD:
      case Values.WILD_DRAW_FOUR:
        return 50;
      default:
        return this.value.value;
    }
  }

  toString() {
    return `${this.color || 'NO_COLOR'} ${this.value}`;
  }
}

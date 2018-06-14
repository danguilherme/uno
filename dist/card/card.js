"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const value_1 = __importDefault(require("src/value"));
class Card {
    constructor(value, color) {
        this.value = value;
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
    set color(value) {
        if (!this.isWildCard())
            throw new Error('Only wild cards can have theirs colors changed.');
        else if (!value.is)
            throw new Error('The color must be a value from Colors enum.');
        this._color = value;
    }
    isWildCard() {
        return (this.value.is(value_1.default.WILD) ||
            this.value.is(value_1.default.WILD_DRAW_FOUR));
    }
    isSpecialCard() {
        return (this.isWildCard() ||
            this.value.is(value_1.default.DRAW_TWO) ||
            this.value.is(value_1.default.REVERSE) ||
            this.value.is(value_1.default.SKIP));
    }
    matches(other) {
        if (this.isWildCard())
            return true;
        else if (this.color == undefined || other.color == undefined)
            throw new Error('Both cards must have theirs colors set before comparing');
        return other.value == this.value || other.color == this.color;
    }
    score() {
        switch (this.value) {
            case value_1.default.DRAW_TWO:
            case value_1.default.SKIP:
            case value_1.default.REVERSE:
                return 20;
            case value_1.default.WILD:
            case value_1.default.WILD_DRAW_FOUR:
                return 50;
            default:
                return this.value.value;
        }
    }
    toString() {
        return `${this.color || 'NO_COLOR'} ${this.value}`;
    }
}
exports.Card = Card;
//# sourceMappingURL=card.js.map
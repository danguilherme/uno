"use strict";
exports.__esModule = true;
var value_1 = require("./value");
var Card = /** @class */ (function () {
    function Card(value, color) {
        this.value = value;
        this.color = color;
        if (!value.is || (color && !color.is))
            throw new Error("The parameter must be an enum.");
        this.color = color || null;
        if (!this.isWildCard() && !this.color) {
            throw Error("Only wild cards can be initialized with no color");
        }
    }
    Card.prototype.isWildCard = function () {
        return this.value.is(value_1["default"].WILD) || this.value.is(value_1["default"].WILD_DRAW_FOUR);
    };
    Card.prototype.isSpecialCard = function () {
        return this.isWildCard() || this.value.is(value_1["default"].DRAW_TWO) ||
            this.value.is(value_1["default"].REVERSE) || this.value.is(value_1["default"].SKIP);
    };
    Card.prototype.matches = function (other) {
        if (this.isWildCard())
            return true;
        else if (this.color == null || other.color == null)
            throw new Error("Both cards must have theirs colors set before comparing");
        return other.value == this.value || other.color == this.color;
    };
    Card.prototype.score = function () {
        switch (this.value) {
            case value_1["default"].DRAW_TWO:
            case value_1["default"].SKIP:
            case value_1["default"].REVERSE:
                return 20;
            case value_1["default"].WILD:
            case value_1["default"].WILD_DRAW_FOUR:
                return 50;
            default:
                return this.value.value;
        }
    };
    Card.prototype.toString = function () {
        return (this.color || 'NO_COLOR') + " " + this.value;
    };
    return Card;
}());
exports.Card = Card;

"use strict";

var Shuffle = require('shuffle');
var Values = require('./values');
var Colors = require('./colors');

function card(value, color) {
  if (!value.is || (color && !color.is))
    throw new Error("The parameter must be an enum.");

  color = color || null;

  let instance = Object.create({}, {
    value: {
      value: value
    },
    color: {
      get: () => {
        return color;
      },
      set: function (newColor) {
        if (!instance.isWildCard())
          throw new Error("Only wild cards can have theirs colors changed.");
        else if (!newColor.is)
          throw new Error("The color must be a value from Colors enum.");
        color = newColor;
      }
    },
    isWildCard: {
      value: function isWildCard() {
        return instance.value.is(Values.WILD) || instance.value.is(Values.WILD_DRAW_FOUR);
      }
    },
    isSpecialCard: {
      value: function isSpecialCard() {
        return instance.isWildCard() || instance.value.is(Values.DRAW_TWO) ||
          instance.value.is(Values.REVERSE) || instance.value.is(Values.SKIP);
      }
    },
    matches: {
      value: function matches(otherCard) {
        if (instance.isWildCard())
          return true;
        else if (instance.color == null || otherCard.color == null)
          throw new Error("Both cards must have theirs colors set before comparing");

        return otherCard.value == instance.value || otherCard.color == instance.color;
      }
    },
    score: {
      get: function score() {
        switch (instance.value) {
          case Values.DRAW_TWO:
          case Values.SKIP:
          case Values.REVERSE:
            return 20;
          case Values.WILD:
          case Values.WILD_DRAW_FOUR:
            return 50;
          default:
            return value.value;
        }
      }
    }
  });

  if (!instance.isWildCard(instance) && !instance.color) {
    throw Error("Only wild cards can be initialized with no color");
  }

  instance.toString = _ => `${instance.color || 'NO_COLOR'} ${instance.value}`;

  return instance;
}

module.exports = card;

"use strict";

var Enum = require('Enum');
var Shuffle = require('shuffle');
var Values = require('./values');
var Colors = require('./colors');

function card(value, color) {
  if (!value.is || (color && !color.is))
    throw new Error("The parameter must be an enum.");

  let instance = {
    value: value
  };

  if (!color)
    instance.color = null;
  else
    instance.color = color;

  instance.isWildCard = function isWildCard() {
    return instance.value.is(Values.WILD) || instance.value.is(Values.WILD_DRAW_FOUR);
  }

  if (!instance.isWildCard(instance) && !instance.color) {
    throw Error("Only wild cards can be initialized with no color");
  }

  instance.match = function match(otherCard) {
    if (this.color == null || otherCard.color == null)
      throw new Error("Both cards must have theirs colors set");

    return otherCard.value == this.value || otherCard.color == this.color;
  }

  instance.setColor = function setColor(newColor) {
    if (!this.isWildCard())
      throw new Error("Only wild cards can have theirs colors changed.")
    this.color = newColor;
  }

  return instance;
}

module.exports = card;

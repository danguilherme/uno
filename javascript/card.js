"use strict";

var Enum = require('Enum');
var Shuffle = require('shuffle');
var Values = require('./values');
var Colors = require('./colors');

function card(value, color) {
  if (!value.is || (color && !color.is))
    throw new Error("The parameter must be an enum.");

  let instance = {
    value: value,
    color: color
  };

  if(!(value.is(Values.WILD) || value.is(Values.WILD_DRAW_FOUR)) &&
    !instance.color) {
      throw Error("Only wild cards can be initialized with no color");
    }

    return instance;
}

card.isWildCard = function(card) {
  return card.value.is(Values.WILD) || card.value.is(Values.WILD_DRAW_FOUR);
}

module.exports = card;

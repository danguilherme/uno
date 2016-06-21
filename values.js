"use strict";

let Enum = require('enum');

module.exports = new Enum(
  {
    'ZERO': 0,
    'ONE': 1,
    'TWO': 2,
    'THREE': 3,
    'FOUR': 4,
    'FIVE': 5,
    'SIX': 6,
    'SEVEN': 7,
    'EIGHT': 8,
    'NINE': 9,
    'DRAW_TWO': 10,
    'REVERSE': 11,
    'SKIP': 12,
    'WILD': 13,
    'WILD_DRAW_FOUR': 14
  }, 'Values');

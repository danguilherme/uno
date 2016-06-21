"use strict";

var Shuffle = require('shuffle');
var Values = require('./values');
var Colors = require('./colors');
var card = require('./card');

function createUnoDeck() {
  /*
    108 cards

    76x numbers (0-9, all colors)
    8x draw two (2x each color)
    8x reverse (2x each color)
    8x skip (2x each color)
    4x wild
    4x wild draw four
  */

  let deck = [];

  const createCards = (qty, value, color) => {
    let cards = [];

    for(let i = 0; i < qty; i++)
      cards.push(card(value, color));

    return cards;
  }

  // for each color...
  for(let i = 1; i <= Colors.size; i++) {
    let color = Colors.get(i);

    // CREATE NUMBERS
    deck.push.apply(deck, createCards(1, Values.ZERO, color));
    for (var n = Values.ONE.value; n <= Values.NINE.value; n++) {
      deck.push.apply(deck, createCards(2, Values.get(n), color));
    }

    deck.push.apply(deck, createCards(2, Values.DRAW_TWO, color));
    deck.push.apply(deck, createCards(2, Values.SKIP, color));
    deck.push.apply(deck, createCards(2, Values.REVERSE, color));
  }

  deck.push.apply(deck, createCards(4, Values.WILD));
  deck.push.apply(deck, createCards(4, Values.WILD_DRAW_FOUR));

  return deck;
}

module.exports = createUnoDeck;

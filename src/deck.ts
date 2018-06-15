'use strict';

const Shuffle = require('shuffle');

import { Card, Colors, Values } from './card';

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

  const deck: Card[] = [];

  const createCards = (qty: number, value: Values, color?: Colors) => {
    const cards = [];

    for (let i = 0; i < qty; i++) cards.push(new Card(value, color));

    return cards;
  };

  // for each color...
  for (let color = 1; color <= 4; color++) {
    // CREATE NUMBERS
    deck.push.apply(deck, createCards(1, Values.ZERO, color));
    for (let n = Values.ONE; n <= Values.NINE; n++) {
      deck.push.apply(deck, createCards(2, n, color));
    }

    deck.push.apply(deck, createCards(2, Values.DRAW_TWO, color));
    deck.push.apply(deck, createCards(2, Values.SKIP, color));
    deck.push.apply(deck, createCards(2, Values.REVERSE, color));
  }

  deck.push.apply(deck, createCards(4, Values.WILD));
  deck.push.apply(deck, createCards(4, Values.WILD_DRAW_FOUR));

  return deck;
}

export function Deck() {
  const instance = Shuffle.shuffle({ deck: createUnoDeck() });

  const originalDraw = instance.draw;

  instance.draw = function(num: number) {
    let cards: Card[] = [];

    // if the amount to draw is more than the cards we have...
    if (num >= instance.length) {
      const length = instance.length;

      // draw all we have...
      cards = cards.concat(originalDraw.call(instance, length));

      // regenerate the draw pile
      instance.reset();
      instance.shuffle();

      // then draw the rest we need
      num = num - length;
      if (num == 0) return cards;
    }

    return cards.concat(originalDraw.call(instance, num));
  };

  return instance;
}

'use strict';

const Game = require('../../src/game');
const { Card } = require('../../src/card/card');
const { Values } = require('../../src/card/values');
const { Colors } = require('../../src/card/colors');
const CumulativeDrawTwo = require('../../src/house-rules/cumulative-draw-two');

describe('House Rule: Cumulative draw two', function() {
  let game = null;

  beforeEach(function() {
    game = Game(['Player 1', 'Player 2', 'Player 3'], [CumulativeDrawTwo]);
    game.newGame();
  });

  it('should force player to draw after a DRAW TWO', function() {
    let curr = game.currentPlayer;
    const discardedCard = game.discardedCard;
    const drawTwo = new Card(Values.DRAW_TWO, discardedCard.color);
    const reverse = new Card(Values.REVERSE, discardedCard.color);

    curr.hand = [drawTwo, drawTwo];

    expect(_ => game.play(drawTwo)).not.toThrow();

    // add reverse to new player hand
    curr = game.currentPlayer;
    curr.hand = [reverse, reverse];

    // cannot pass
    expect(game.pass).toThrow();
    // cannot play no-DRAW card
    expect(_ => game.play(reverse)).toThrow();
    expect(game.draw).not.toThrow();
    expect(curr.hand).toHaveLength(4);
    // lost his turn
    expect(game.currentPlayer.name).not.toBe(curr.name);
  });

  it('should stack DRAW TWO values', function() {
    let curr = game.currentPlayer;
    const discardedCard = game.discardedCard;
    const drawTwo = new Card(Values.DRAW_TWO, discardedCard.color);
    const reverse = new Card(Values.REVERSE, discardedCard.color);

    curr.hand = [drawTwo, drawTwo];
    expect(_ => game.play(drawTwo)).not.toThrow();

    // add reverse to new player hand
    curr = game.currentPlayer;
    curr.hand = [drawTwo, drawTwo];
    expect(_ => game.play(drawTwo)).not.toThrow();

    // add reverse to new player hand
    curr = game.currentPlayer;
    curr.hand = [reverse, reverse];

    expect(game.pass).toThrow();
    expect(_ => game.play(reverse)).toThrow();
    expect(game.draw).not.toThrow();
    expect(curr.hand).toHaveLength(6);
    expect(game.currentPlayer.name).not.toBe(curr.name);
  });
});

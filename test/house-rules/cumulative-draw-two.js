"use strict";

var should = require('chai').should();

const Game = require('../../src/game');
const Card = require('../../src/card');
const Values = require('../../src/values');
const Colors = require('../../src/colors');
const CumulativeDrawTwo = require('../../src/house-rules/cumulative-draw-two');

describe('House Rule: Cumulative draw two', function () {
  let game = null;

  beforeEach(function () {
    game = Game(["Player 1", "Player 2", "Player 3"]);
    CumulativeDrawTwo.setup(game);
    game.newGame();
  });

  it('should force player to draw after a DRAW TWO', function () {
    let curr = game.currentPlayer;
    let discardedCard = game.discardedCard;
    let drawTwo = Card(Values.DRAW_TWO, discardedCard.color);
    let reverse = Card(Values.REVERSE, discardedCard.color);

    curr.hand = [drawTwo, drawTwo];

    should.not.throw(_ => game.play(drawTwo));

    // add reverse to new player hand
    curr = game.currentPlayer;
    curr.hand = [reverse, reverse];

    // cannot pass
    should.throw(game.pass);
    // cannot play no-DRAW card
    should.throw(_ => game.play(reverse));
    should.not.throw(game.draw);
    curr.hand.should.have.length(4);
    // lost his turn
    game.currentPlayer.name.should.not.equal(curr.name);
  });

  it('should stack DRAW TWO values', function () {
    let curr = game.currentPlayer;
    let discardedCard = game.discardedCard;
    let drawTwo = Card(Values.DRAW_TWO, discardedCard.color);
    let reverse = Card(Values.REVERSE, discardedCard.color);

    curr.hand = [drawTwo, drawTwo];
    should.not.throw(_ => game.play(drawTwo));

    // add reverse to new player hand
    curr = game.currentPlayer;
    curr.hand = [drawTwo, drawTwo];
    should.not.throw(_ => game.play(drawTwo));

    // add reverse to new player hand
    curr = game.currentPlayer;
    curr.hand = [reverse, reverse];

    should.throw(game.pass);
    should.throw(_ => game.play(reverse));
    should.not.throw(game.draw);
    curr.hand.should.have.length(6);
    game.currentPlayer.name.should.not.equal(curr.name);
  });
});

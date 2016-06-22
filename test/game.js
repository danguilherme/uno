"use strict";

const should = require('chai').should();
const Game = require('../game');

describe('Game', function() {
  it('should error if started with less than 2 players', function(done) {
    let game = Game(["Guilherme"]);
    game.on('error', e => done());
    game.on('start', e => done(e == null ? new Error("Error expected") : null));
  });

  it('should error if started with more than 10 players', function(done) {
    let game = Game([
      "Player 0", "Player 1", "Player 2", "Player 3", "Player 4",
      "Player 5", "Player 6", "Player 7", "Player 8", "Player 9", "Excess"]);
    game.on('error', e => done());
    game.on('start', e => done(e == null ? new Error("Error expected") : null));
  });

  it('should start', function(done) {
    let game = null;
    should.not.throw(() => game = Game(["Guilherme", "Thamy Top", "André Marques"]));
    game.on('start', done);
  });

  describe("with more than two players", function() {
    let game = null;
    
    beforeEach(function(done) {
      game = Game(["Player 1", "Player 2", "Player 3", "Player 4"]);
      game.on('start', done);
    });

    describe("#play()", function() {
      it('should throw if the card on draw pile does not match with played card');
      it('should change the player clockwise when card is accepted');
      it('should not accept players that must draw to play a card');
    });

    describe('#pass()', function() {
      it('should throw if player did not draw before passing');
      it('should pass the play to the next player');
    });

    describe('#draw()', function() {
      it('should add a card to player hand');
    });
  });

  describe("with two players", function() {
    let game = null;
    
    beforeEach(function(done) {
      game = Game(["Player 1", "Player 2"]);
      game.on('start', done);
    });
  });
});

"use strict";

var should = require('chai').should();
const Game = require('../game');

describe('Play', function () {
  it('should simulate a game', function (done) {
    let game = Game(["Player 1", "Player 2", "Player 3", "Player 4"]);
    game.on('end', done);

    done();
  });
});

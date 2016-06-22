"use strict";

var should = require('chai').should();

describe('Game', function() {
  it('should throw if started with less than 2 players');
  it('should throw if started with more than 10 players');

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

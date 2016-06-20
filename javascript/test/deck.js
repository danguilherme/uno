"use strict";

var assert = require('chai').assert;
var expect = require('chai').should();

let Colors = require('../colors');
let Values = require('../values');
let Card = require('../card');
let Deck = require('../deck');

var filterByValue = (value) => {
  return (card) => card.value.is(value);
}

describe('deck', function() {

  let deck;

  beforeEach(function createDeck() {
    deck = Deck();
  });

  it('should have 108 cards', function() {
    deck.should.have.length(108);
  });
  it('should have 76 numbers', function() {
    let numbers = (card) => card.value.value >= Values.ZERO && card.value.value <= Values.NINE;
    deck.filter(numbers).should.to.have.length(76);
  });
  it('should have 4 zeros', function() {
    let zeroes = deck.filter(filterByValue(Values.ZERO));
    zeroes.should.have.length(4);
  });
  it('should have 8 nines', function() {
    let nines = deck.filter(filterByValue(Values.NINE));
    nines.should.to.have.length(8);
  });
  it('should have 8 draw two', function() {
    let drawTwos = deck.filter(filterByValue(Values.DRAW_TWO))
    drawTwos.should.have.length(8);
  });
  it('should have 8 skip', function() {
    let skips = deck.filter(filterByValue(Values.SKIP));
    skips.should.to.have.length(8);
  });
  it('should have 8 reverse', function() {
    let reverses = deck.filter(filterByValue(Values.REVERSE));
    reverses.should.have.length(8);
  });
  it('should have 4 wild', function() {
    let wilds = deck.filter(filterByValue(Values.WILD));
    wilds.should.to.have.length(4);
  });
  it('should have 4 wild draw four', function() {
    let wildDrawFours = deck.filter(filterByValue(Values.WILD_DRAW_FOUR))
    wildDrawFours.should.have.length(4);
  });

  describe('Card', function () {
    describe('#match()', function () {
      it('should match a card with same value and color');
      it('should match a card with same value');
      it('should match a card with same color');
      it('should not match a card with different value and color');
      it('should match wild card with same color');
    });
    
    describe('#setColor()', function () {
      it('should throw exception when called from normal card');
      it('should change color from none to blue to a wild card');
      it('should change color from red to yellow to a wild draw four card');
    });
  });
});

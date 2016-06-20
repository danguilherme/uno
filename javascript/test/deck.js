"use strict";

var assert = require('chai').assert;
var should = require('chai').should();

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

  describe('Card', function() {
    describe('#constructor', function() {
      it('should create a number card', function() {
        let redEight = Card(Values.EIGHT, Colors.RED);
        redEight.value.should.be.equal(Values.EIGHT);
        redEight.color.should.be.equal(Colors.RED);
      });
      it('should create a wild card', function() {
        let wild = Card(Values.WILD);
        wild.value.should.be.equal(Values.WILD);
        should.not.exist(wild.color);
      });
      it('should throw when creating a normal card with no color', function() {
        should.throw(() => Card(Values.SIX));
      });
    });

    describe('#match()', function() {
      it('should match a card with same value and color', function() {
        let redSkip = Card(Values.SKIP, Colors.RED);
        redSkip.match(Card(Values.SKIP, Colors.RED)).should.be.equal(true);
      });
      it('should match a card with same value', function() {
        let redSkip = Card(Values.SKIP, Colors.RED);
        redSkip.match(Card(Values.SKIP, Colors.BLUE)).should.be.equal(true);
      });
      it('should match a card with same color', function() {
        let redSkip = Card(Values.SKIP, Colors.RED);
        redSkip.match(Card(Values.REVERSE, Colors.RED)).should.be.equal(true);
      });
      it('should not match a card with different value and color', function() {
        let redSkip = Card(Values.SKIP, Colors.RED);
        redSkip.match(Card(Values.REVERSE, Colors.YELLOW)).should.be.equal(false);
      });
      it('should match wild card with same color', function() {
        let redSkip = Card(Values.SKIP, Colors.RED);
        redSkip.match(Card(Values.WILD, Colors.RED)).should.be.equal(true);
      });
      it('should throw when one or more cards do not have a color set', function() {
        let wild1 = Card(Values.WILD);
        let wild2 = Card(Values.WILD_DRAW_FOUR);
        let wild3 = Card(Values.WILD_DRAW_FOUR, Colors.BLUE);

        should.throw(() => wild1.match(wild2));
        should.throw(() => wild1.match(wild3));
        should.throw(() => wild3.match(wild1));
      });
    });

    describe('#setColor()', function() {
      it('should throw exception when called from normal card');
      it('should change color from none to blue to a wild card');
      it('should change color from red to yellow to a wild draw four card');
    });
  });
});

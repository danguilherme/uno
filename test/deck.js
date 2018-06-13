"use strict";

const should = require('chai').should();

const Colors = require('../src/colors');
const Values = require('../src/values');
const Card = require('../src/card');
const Deck = require('../src/deck');

const filterByValue = (value) => {
  return (card) => card.value.is(value);
};

describe('Deck', function() {
  let deck = null;

  beforeEach(function createDeck() {
    deck = Deck(); 
  });

  it('should have 108 cards', function() {
    deck.should.have.length(108);
  });

  it('should have 76 numbers', function() {
    let numbers = (card) => card.value.value >= Values.ZERO && card.value.value <= Values.NINE;
    deck.cards.filter(numbers).should.to.have.length(76);
  });

  it('should have 4 zeros', function() {
    let zeroes = deck.cards.filter(filterByValue(Values.ZERO));
    zeroes.should.have.length(4);
  });

  it('should have 8 nines', function() {
    let nines = deck.cards.filter(filterByValue(Values.NINE));
    nines.should.to.have.length(8);
  });

  it('should have 8 draw two', function() {
    let drawTwos = deck.cards.filter(filterByValue(Values.DRAW_TWO));
    drawTwos.should.have.length(8);
  });

  it('should have 8 skip', function() {
    let skips = deck.cards.filter(filterByValue(Values.SKIP));
    skips.should.to.have.length(8);
  });

  it('should have 8 reverse', function() {
    let reverses = deck.cards.filter(filterByValue(Values.REVERSE));
    reverses.should.have.length(8);
  });

  it('should have 4 wild', function() {
    let wilds = deck.cards.filter(filterByValue(Values.WILD));
    wilds.should.to.have.length(4);
  });

  it('should have 4 wild draw four', function() {
    let wildDrawFours = deck.cards.filter(filterByValue(Values.WILD_DRAW_FOUR));
    wildDrawFours.should.have.length(4);
  });

  it('should have 107 cards after a draw', function() {
    deck.should.have.length(108);
    deck.draw(1);
    deck.should.have.length(107);
  });

  it('should have 108 cards after all cards are drawn', function() {
    deck.should.have.length(108);
    deck.draw(108);
    deck.should.have.length(108);
  });

  it('should have 107 cards after all cards + 1 are drawn', function() {
    deck.should.have.length(108);
    deck.draw(109);
    deck.should.have.length(107);
  });

  describe('Card', function() {
    describe('#constructor', function() {
      it('should create a number card', function() {
        let redEight = Card(Values.EIGHT, Colors.RED);
        redEight.value.should.be.equal(Values.EIGHT);
        redEight.color.should.be.equal(Colors.RED);
      });

      it('should create a wild card with no color', function() {
        let wild = Card(Values.WILD);
        wild.value.should.be.equal(Values.WILD);
        should.not.exist(wild.color);
      });

      it('should throw when creating a normal card with no color', function() {
        should.throw(() => Card(Values.SIX));
      });
    });

    describe('#matches()', function() {
      it('should match a card with same value and color', function() {
        let redSkip = Card(Values.SKIP, Colors.RED);
        redSkip.matches(Card(Values.SKIP, Colors.RED)).should.be.true;
      });

      it('should match a card with same value', function() {
        let redSkip = Card(Values.SKIP, Colors.RED);
        redSkip.matches(Card(Values.SKIP, Colors.BLUE)).should.be.true;
      });

      it('should match a card with same color', function() {
        let redSkip = Card(Values.SKIP, Colors.RED);
        redSkip.matches(Card(Values.REVERSE, Colors.RED)).should.be.true;
      });

      it('should not match a card with different value and color', function() {
        let redSkip = Card(Values.SKIP, Colors.RED);
        redSkip.matches(Card(Values.REVERSE, Colors.YELLOW)).should.be.false;
      });

      it('should match wild card with same color', function() {
        let redSkip = Card(Values.SKIP, Colors.RED);
        redSkip.matches(Card(Values.WILD, Colors.RED)).should.be.true;
      });

      it('should throw when one or more cards do not have a color set and it is not a wild', function() {
        let wild1 = Card(Values.WILD);
        let wild2 = Card(Values.WILD_DRAW_FOUR);
        let wild3 = Card(Values.WILD_DRAW_FOUR, Colors.BLUE);

        should.not.throw(() => wild1.matches(wild2));
        should.not.throw(() => wild1.matches(wild3));
        should.not.throw(() => wild3.matches(wild1));
      });
    });

    describe('#color', function() {
      it('should throw exception when setting color of a normal card', function() {
        let yellowReverse = Card(Values.REVERSE, Colors.YELLOW);
        should.throw(() => yellowReverse.color = Colors.RED);
      });

      it('should change color from none to green to a wild card', function() {
        let wild = Card(Values.WILD);
        should.not.exist(wild.color);

        should.not.throw(() => wild.color = Colors.GREEN);

        should.exist(wild.color);
        wild.color.should.be.equal(Colors.GREEN);
      });

      it('should change color from red to yellow to a wild draw four card', function() {
        let wildDrawFour = Card(Values.WILD_DRAW_FOUR, Colors.RED);
        should.exist(wildDrawFour.color);
        wildDrawFour.color.should.be.equal(Colors.RED);

        should.not.throw(() => wildDrawFour.color = Colors.YELLOW);

        should.exist(wildDrawFour.color);
        wildDrawFour.color.should.be.equal(Colors.YELLOW);
      });
    });

    describe('#score', function() {
      it('should return correct values', function() {
        Card(Values.ZERO, Colors.YELLOW).score.should.be.equal(0);
        Card(Values.ONE, Colors.YELLOW).score.should.be.equal(1);
        Card(Values.TWO, Colors.YELLOW).score.should.be.equal(2);
        Card(Values.THREE, Colors.YELLOW).score.should.be.equal(3);
        Card(Values.FOUR, Colors.YELLOW).score.should.be.equal(4);
        Card(Values.FIVE, Colors.YELLOW).score.should.be.equal(5);
        Card(Values.SIX, Colors.YELLOW).score.should.be.equal(6);
        Card(Values.SEVEN, Colors.YELLOW).score.should.be.equal(7);
        Card(Values.EIGHT, Colors.YELLOW).score.should.be.equal(8);
        Card(Values.NINE, Colors.YELLOW).score.should.be.equal(9);
        Card(Values.DRAW_TWO, Colors.YELLOW).score.should.be.equal(20);
        Card(Values.SKIP, Colors.YELLOW).score.should.be.equal(20);
        Card(Values.REVERSE, Colors.YELLOW).score.should.be.equal(20);
        Card(Values.WILD, Colors.YELLOW).score.should.be.equal(50);
        Card(Values.WILD_DRAW_FOUR, Colors.YELLOW).score.should.be.equal(50);
      });

    });
  });
});

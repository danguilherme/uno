'use strict';

const Colors = require('../src/colors');
const Values = require('../src/values');
const Card = require('../src/card');
const Deck = require('../src/deck');

const filterByValue = value => {
  return card => card.value.is(value);
};

describe('Deck', function() {
  let deck = null;

  beforeEach(function createDeck() {
    deck = Deck();
  });

  it('should have 108 cards', function() {
    expect(deck).toHaveLength(108);
  });

  it('should have 76 numbers', function() {
    let numbers = card =>
      card.value.value >= Values.ZERO && card.value.value <= Values.NINE;
    expect(deck.cards.filter(numbers)).toHaveLength(76);
  });

  it('should have 4 zeros', function() {
    let zeroes = deck.cards.filter(filterByValue(Values.ZERO));
    expect(zeroes).toHaveLength(4);
  });

  it('should have 8 nines', function() {
    let nines = deck.cards.filter(filterByValue(Values.NINE));
    expect(nines).toHaveLength(8);
  });

  it('should have 8 draw two', function() {
    let drawTwos = deck.cards.filter(filterByValue(Values.DRAW_TWO));
    expect(drawTwos).toHaveLength(8);
  });

  it('should have 8 skip', function() {
    let skips = deck.cards.filter(filterByValue(Values.SKIP));
    expect(skips).toHaveLength(8);
  });

  it('should have 8 reverse', function() {
    let reverses = deck.cards.filter(filterByValue(Values.REVERSE));
    expect(reverses).toHaveLength(8);
  });

  it('should have 4 wild', function() {
    let wilds = deck.cards.filter(filterByValue(Values.WILD));
    expect(wilds).toHaveLength(4);
  });

  it('should have 4 wild draw four', function() {
    let wildDrawFours = deck.cards.filter(filterByValue(Values.WILD_DRAW_FOUR));
    expect(wildDrawFours).toHaveLength(4);
  });

  it('should have 107 cards after a draw', function() {
    expect(deck).toHaveLength(108);
    deck.draw(1);
    expect(deck).toHaveLength(107);
  });

  it('should have 108 cards after all cards are drawn', function() {
    expect(deck).toHaveLength(108);
    deck.draw(108);
    expect(deck).toHaveLength(108);
  });

  it('should have 107 cards after all cards + 1 are drawn', function() {
    expect(deck).toHaveLength(108);
    deck.draw(109);
    expect(deck).toHaveLength(107);
  });

  describe('Card', function() {
    describe('#constructor', function() {
      it('should create a number card', function() {
        let redEight = Card(Values.EIGHT, Colors.RED);
        expect(redEight.value).toBe(Values.EIGHT);
        expect(redEight.color).toBe(Colors.RED);
      });

      it('should create a wild card with no color', function() {
        let wild = Card(Values.WILD);
        expect(wild.value).toBe(Values.WILD);
        expect(wild.color).toBeFalsy();
      });

      it('should throw when creating a normal card with no color', function() {
        expect(() => Card(Values.SIX)).throw;
      });
    });

    describe('#matches()', function() {
      it('should match a card with same value and color', function() {
        let redSkip = Card(Values.SKIP, Colors.RED);
        expect(redSkip.matches(Card(Values.SKIP, Colors.RED))).toBe(true);
      });

      it('should match a card with same value', function() {
        let redSkip = Card(Values.SKIP, Colors.RED);
        expect(redSkip.matches(Card(Values.SKIP, Colors.BLUE))).toBe(true);
      });

      it('should match a card with same color', function() {
        let redSkip = Card(Values.SKIP, Colors.RED);
        expect(redSkip.matches(Card(Values.REVERSE, Colors.RED))).toBe(true);
      });

      it('should not match a card with different value and color', function() {
        let redSkip = Card(Values.SKIP, Colors.RED);
        expect(redSkip.matches(Card(Values.REVERSE, Colors.YELLOW))).toBe(
          false,
        );
      });

      it('should match wild card with same color', function() {
        let redSkip = Card(Values.SKIP, Colors.RED);
        expect(redSkip.matches(Card(Values.WILD, Colors.RED))).toBe(true);
      });

      it('should throw when one or more cards do not have a color set and it is not a wild', function() {
        let wild1 = Card(Values.WILD);
        let wild2 = Card(Values.WILD_DRAW_FOUR);
        let wild3 = Card(Values.WILD_DRAW_FOUR, Colors.BLUE);

        expect(() => wild1.matches(wild2)).not.throw;
        expect(() => wild1.matches(wild3)).not.throw;
        expect(() => wild3.matches(wild1)).not.throw;
      });
    });

    describe('#color', function() {
      it('should throw exception when setting color of a normal card', function() {
        let yellowReverse = Card(Values.REVERSE, Colors.YELLOW);
        expect(() => (yellowReverse.color = Colors.RED)).throw;
      });

      it('should change color from none to green to a wild card', function() {
        let wild = Card(Values.WILD);
        expect(wild.color).toBeFalsy();

        expect(() => (wild.color = Colors.GREEN)).not.throw;

        expect(wild.color).toBeDefined();
        expect(wild.color).toBe(Colors.GREEN);
      });

      it('should change color from red to yellow to a wild draw four card', function() {
        let wildDrawFour = Card(Values.WILD_DRAW_FOUR, Colors.RED);
        expect(wildDrawFour.color).toBeDefined();
        expect(wildDrawFour.color).toBe(Colors.RED);

        expect(() => (wildDrawFour.color = Colors.YELLOW)).not.throw;

        expect(wildDrawFour.color).toBeDefined();
        expect(wildDrawFour.color).toBe(Colors.YELLOW);
      });
    });

    describe('#score', function() {
      it('should return correct values', function() {
        expect(Card(Values.ZERO, Colors.YELLOW).score).toBe(0);
        expect(Card(Values.ONE, Colors.YELLOW).score).toBe(1);
        expect(Card(Values.TWO, Colors.YELLOW).score).toBe(2);
        expect(Card(Values.THREE, Colors.YELLOW).score).toBe(3);
        expect(Card(Values.FOUR, Colors.YELLOW).score).toBe(4);
        expect(Card(Values.FIVE, Colors.YELLOW).score).toBe(5);
        expect(Card(Values.SIX, Colors.YELLOW).score).toBe(6);
        expect(Card(Values.SEVEN, Colors.YELLOW).score).toBe(7);
        expect(Card(Values.EIGHT, Colors.YELLOW).score).toBe(8);
        expect(Card(Values.NINE, Colors.YELLOW).score).toBe(9);
        expect(Card(Values.DRAW_TWO, Colors.YELLOW).score).toBe(20);
        expect(Card(Values.SKIP, Colors.YELLOW).score).toBe(20);
        expect(Card(Values.REVERSE, Colors.YELLOW).score).toBe(20);
        expect(Card(Values.WILD, Colors.YELLOW).score).toBe(50);
        expect(Card(Values.WILD_DRAW_FOUR, Colors.YELLOW).score).toBe(50);
      });
    });
  });
});

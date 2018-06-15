'use strict';

import { Deck } from '../src/deck';
import { Card, Values, Colors } from '../src/card';

const filterByValue = value => {
  return card => card.value === value;
};

describe('Deck', function() {
  let deck: Deck;

  beforeEach(function createDeck() {
    deck = new Deck();
  });

  it('should have a public API', function() {
    expect(deck).toHaveProperty('cards');
    expect(deck).toHaveProperty('length');
    expect(typeof deck.length).toBe('number');
    expect(deck).toHaveProperty('draw');
    expect(typeof deck.draw).toBe('function');
  });

  it('should have 108 cards', function() {
    expect(deck).toHaveLength(108);
  });

  it('should have 76 numbers', function() {
    const numbers = card =>
      card.value >= Values.ZERO && card.value <= Values.NINE;
    expect(deck.cards.filter(numbers)).toHaveLength(76);
  });

  it('should have 4 zeros', function() {
    const zeroes = deck.cards.filter(filterByValue(Values.ZERO));
    expect(zeroes).toHaveLength(4);
  });

  it('should have 8 nines', function() {
    const nines = deck.cards.filter(filterByValue(Values.NINE));
    expect(nines).toHaveLength(8);
  });

  it('should have 8 draw two', function() {
    const drawTwos = deck.cards.filter(filterByValue(Values.DRAW_TWO));
    expect(drawTwos).toHaveLength(8);
  });

  it('should have 8 skip', function() {
    const skips = deck.cards.filter(filterByValue(Values.SKIP));
    expect(skips).toHaveLength(8);
  });

  it('should have 8 reverse', function() {
    const reverses = deck.cards.filter(filterByValue(Values.REVERSE));
    expect(reverses).toHaveLength(8);
  });

  it('should have 4 wild', function() {
    const wilds = deck.cards.filter(filterByValue(Values.WILD));
    expect(wilds).toHaveLength(4);
  });

  it('should have 4 wild draw four', function() {
    const wildDrawFours = deck.cards.filter(filterByValue(Values.WILD_DRAW_FOUR));
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
        const redEight = new Card(Values.EIGHT, Colors.RED);
        expect(redEight.value).toBe(Values.EIGHT);
        expect(redEight.color).toBe(Colors.RED);
      });

      it('should create a wild card with no color', function() {
        const wild = new Card(Values.WILD);
        expect(wild.value).toBe(Values.WILD);
        expect(wild.color).toBeFalsy();
      });

      it('should throw when creating a normal card with no color', function() {
        expect(() => new Card(Values.SIX)).toThrow();
      });
    });

    describe('#matches()', function() {
      it('should match a card with same value and color', function() {
        const redSkip = new Card(Values.SKIP, Colors.RED);
        expect(redSkip.matches(new Card(Values.SKIP, Colors.RED))).toBe(true);
      });

      it('should match a card with same value', function() {
        const redSkip = new Card(Values.SKIP, Colors.RED);
        expect(redSkip.matches(new Card(Values.SKIP, Colors.BLUE))).toBe(true);
      });

      it('should match a card with same color', function() {
        const redSkip = new Card(Values.SKIP, Colors.RED);
        expect(redSkip.matches(new Card(Values.REVERSE, Colors.RED))).toBe(
          true,
        );
      });

      it('should not match a card with different value and color', function() {
        const redSkip = new Card(Values.SKIP, Colors.RED);
        expect(redSkip.matches(new Card(Values.REVERSE, Colors.YELLOW))).toBe(
          false,
        );
      });

      it('should match wild card with same color', function() {
        const redSkip = new Card(Values.SKIP, Colors.RED);
        expect(redSkip.matches(new Card(Values.WILD, Colors.RED))).toBe(true);
      });

      it('should throw when one or more cards do not have a color set and it is not a wild', function() {
        const wild1 = new Card(Values.WILD);
        const wild2 = new Card(Values.WILD_DRAW_FOUR);
        const wild3 = new Card(Values.WILD_DRAW_FOUR, Colors.BLUE);

        expect(() => wild1.matches(wild2)).not.toThrow();
        expect(() => wild1.matches(wild3)).not.toThrow();
        expect(() => wild3.matches(wild1)).not.toThrow();
      });
    });

    describe('#color', function() {
      it('should throw exception when setting color of a normal card', function() {
        const yellowReverse = new Card(Values.REVERSE, Colors.YELLOW);
        expect(() => (yellowReverse.color = Colors.RED)).toThrow();
      });

      it('should change color from none to green to a wild card', function() {
        const wild = new Card(Values.WILD);
        expect(wild.color).toBeUndefined();

        expect(() => (wild.color = Colors.GREEN)).not.toThrow();

        expect(wild.color).toBeDefined();
        expect(wild.color).toBe(Colors.GREEN);
      });

      it('should change color from red to yellow to a wild draw four card', function() {
        const wildDrawFour = new Card(Values.WILD_DRAW_FOUR, Colors.RED);
        expect(wildDrawFour.color).toBeDefined();
        expect(wildDrawFour.color).toBe(Colors.RED);

        expect(() => (wildDrawFour.color = Colors.YELLOW)).not.toThrow();

        expect(wildDrawFour.color).toBeDefined();
        expect(wildDrawFour.color).toBe(Colors.YELLOW);
      });
    });

    describe('#score', function() {
      it('should return correct values', function() {
        expect(new Card(Values.ZERO, Colors.YELLOW).score).toBe(0);
        expect(new Card(Values.ONE, Colors.YELLOW).score).toBe(1);
        expect(new Card(Values.TWO, Colors.YELLOW).score).toBe(2);
        expect(new Card(Values.THREE, Colors.YELLOW).score).toBe(3);
        expect(new Card(Values.FOUR, Colors.YELLOW).score).toBe(4);
        expect(new Card(Values.FIVE, Colors.YELLOW).score).toBe(5);
        expect(new Card(Values.SIX, Colors.YELLOW).score).toBe(6);
        expect(new Card(Values.SEVEN, Colors.YELLOW).score).toBe(7);
        expect(new Card(Values.EIGHT, Colors.YELLOW).score).toBe(8);
        expect(new Card(Values.NINE, Colors.YELLOW).score).toBe(9);
        expect(new Card(Values.DRAW_TWO, Colors.YELLOW).score).toBe(20);
        expect(new Card(Values.SKIP, Colors.YELLOW).score).toBe(20);
        expect(new Card(Values.REVERSE, Colors.YELLOW).score).toBe(20);
        expect(new Card(Values.WILD, Colors.YELLOW).score).toBe(50);
        expect(new Card(Values.WILD_DRAW_FOUR, Colors.YELLOW).score).toBe(50);
      });
    });
  });
});

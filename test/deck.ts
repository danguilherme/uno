import { Card, Color, Value } from '../src/card';
import { Deck } from '../src/deck';

const filterByValue = (value: Value) => {
  return (card: Card) => card.value === value;
};

const filterByColor = (color: Color) => {
  return (card: Card) => card.color === color;
};

describe('Deck', function () {
  let deck: Deck;

  beforeEach(function createDeck() {
    deck = new Deck();
  });

  it('has a public API', function () {
    expect(deck).toHaveProperty('cards');
    expect(deck).toHaveProperty('length');
    expect(typeof deck.length).toBe('number');
    expect(deck).toHaveProperty('draw');
    expect(typeof deck.draw).toBe('function');
  });

  it('has 108 cards', function () {
    expect(deck).toHaveLength(108);
  });

  it.only('has 25 cards for each color', function () {
    expect({
      RED: deck.cards.filter(filterByColor(Color.RED)).length,
      BLUE: deck.cards.filter(filterByColor(Color.BLUE)).length,
      GREEN: deck.cards.filter(filterByColor(Color.GREEN)).length,
      YELLOW: deck.cards.filter(filterByColor(Color.YELLOW)).length,
    }).toEqual({
      RED: 25,
      BLUE: 25,
      GREEN: 25,
      YELLOW: 25,
    });
  });

  it('has 76 numbers', function () {
    const numbers = (card: Card) =>
      card.value >= Value.ZERO && card.value <= Value.NINE;
    expect(deck.cards.filter(numbers)).toHaveLength(76);
  });

  it('has 4 zeros', function () {
    const zeroes = deck.cards.filter(filterByValue(Value.ZERO));
    expect(zeroes).toHaveLength(4);
  });

  it('has 8 nines', function () {
    const nines = deck.cards.filter(filterByValue(Value.NINE));
    expect(nines).toHaveLength(8);
  });

  it('has 8 draw two', function () {
    const drawTwos = deck.cards.filter(filterByValue(Value.DRAW_TWO));
    expect(drawTwos).toHaveLength(8);
  });

  it('has 8 skip', function () {
    const skips = deck.cards.filter(filterByValue(Value.SKIP));
    expect(skips).toHaveLength(8);
  });

  it('has 8 reverse', function () {
    const reverses = deck.cards.filter(filterByValue(Value.REVERSE));
    expect(reverses).toHaveLength(8);
  });

  it('has 4 wild', function () {
    const wilds = deck.cards.filter(filterByValue(Value.WILD));
    expect(wilds).toHaveLength(4);
  });

  it('has 4 wild draw four', function () {
    const wildDrawFours = deck.cards.filter(
      filterByValue(Value.WILD_DRAW_FOUR),
    );
    expect(wildDrawFours).toHaveLength(4);
  });

  it('has 107 cards after a draw', function () {
    expect(deck).toHaveLength(108);
    deck.draw(1);
    expect(deck).toHaveLength(107);
  });

  it('has 108 cards after all cards are drawn', function () {
    expect(deck).toHaveLength(108);
    deck.draw(108);
    expect(deck).toHaveLength(108);
  });

  it('has 107 cards after all cards + 1 are drawn', function () {
    expect(deck).toHaveLength(108);
    deck.draw(109);
    expect(deck).toHaveLength(107);
  });

  describe('Card', function () {
    describe('#constructor', function () {
      it('creates a number card', function () {
        const redEight = new Card(Value.EIGHT, Color.RED);
        expect(redEight.value).toBe(Value.EIGHT);
        expect(redEight.color).toBe(Color.RED);
      });

      it('creates a wild card with no color', function () {
        const wild = new Card(Value.WILD);
        expect(wild.value).toBe(Value.WILD);
        expect(wild.color).toBeFalsy();
      });

      it('throws when creating a normal card with no color', function () {
        expect(() => new Card(Value.SIX)).toThrow();
      });
    });

    describe('#matches()', function () {
      it('matches a card with same value and color', function () {
        const redSkip = new Card(Value.SKIP, Color.RED);
        expect(redSkip.matches(new Card(Value.SKIP, Color.RED))).toBe(true);
      });

      it('matches a card with same value', function () {
        const redSkip = new Card(Value.SKIP, Color.RED);
        expect(redSkip.matches(new Card(Value.SKIP, Color.BLUE))).toBe(true);
      });

      it('matches a card with same color', function () {
        const redSkip = new Card(Value.SKIP, Color.RED);
        expect(redSkip.matches(new Card(Value.REVERSE, Color.RED))).toBe(true);
      });

      it('does not match a card with different value and color', function () {
        const redSkip = new Card(Value.SKIP, Color.RED);
        expect(redSkip.matches(new Card(Value.REVERSE, Color.YELLOW))).toBe(
          false,
        );
      });

      it('matches wild card with same color', function () {
        const redSkip = new Card(Value.SKIP, Color.RED);
        expect(redSkip.matches(new Card(Value.WILD, Color.RED))).toBe(true);
      });

      it('throws when one or more cards do not have a color set and it is not a wild', function () {
        const wild1 = new Card(Value.WILD);
        const wild2 = new Card(Value.WILD_DRAW_FOUR);
        const wild3 = new Card(Value.WILD_DRAW_FOUR, Color.BLUE);

        expect(() => wild1.matches(wild2)).not.toThrow();
        expect(() => wild1.matches(wild3)).not.toThrow();
        expect(() => wild3.matches(wild1)).not.toThrow();
      });
    });

    describe('#color', function () {
      it('throws exception when setting color of a normal card', function () {
        const yellowReverse = new Card(Value.REVERSE, Color.YELLOW);
        expect(() => (yellowReverse.color = Color.RED)).toThrow();
      });

      it('changes color from none to green to a wild card', function () {
        const wild = new Card(Value.WILD);
        expect(wild.color).toBeUndefined();

        expect(() => (wild.color = Color.GREEN)).not.toThrow();

        expect(wild.color).toBeDefined();
        expect(wild.color).toBe(Color.GREEN);
      });

      it('changes color from red to yellow to a wild draw four card', function () {
        const wildDrawFour = new Card(Value.WILD_DRAW_FOUR, Color.RED);
        expect(wildDrawFour.color).toBeDefined();
        expect(wildDrawFour.color).toBe(Color.RED);

        expect(() => (wildDrawFour.color = Color.YELLOW)).not.toThrow();

        expect(wildDrawFour.color).toBeDefined();
        expect(wildDrawFour.color).toBe(Color.YELLOW);
      });
    });

    describe('#score', function () {
      it('returns correct values', function () {
        expect(new Card(Value.ZERO, Color.YELLOW).score).toBe(0);
        expect(new Card(Value.ONE, Color.YELLOW).score).toBe(1);
        expect(new Card(Value.TWO, Color.YELLOW).score).toBe(2);
        expect(new Card(Value.THREE, Color.YELLOW).score).toBe(3);
        expect(new Card(Value.FOUR, Color.YELLOW).score).toBe(4);
        expect(new Card(Value.FIVE, Color.YELLOW).score).toBe(5);
        expect(new Card(Value.SIX, Color.YELLOW).score).toBe(6);
        expect(new Card(Value.SEVEN, Color.YELLOW).score).toBe(7);
        expect(new Card(Value.EIGHT, Color.YELLOW).score).toBe(8);
        expect(new Card(Value.NINE, Color.YELLOW).score).toBe(9);
        expect(new Card(Value.DRAW_TWO, Color.YELLOW).score).toBe(20);
        expect(new Card(Value.SKIP, Color.YELLOW).score).toBe(20);
        expect(new Card(Value.REVERSE, Color.YELLOW).score).toBe(20);
        expect(new Card(Value.WILD, Color.YELLOW).score).toBe(50);
        expect(new Card(Value.WILD_DRAW_FOUR, Color.YELLOW).score).toBe(50);
      });
    });
  });
});

import { Card, Color, Value } from '../src/card';

describe('Card', function () {
  describe('#constructor', function () {
    it('creates a valid card', () => {
      expect(() => new Card(Value.ZERO, Color.RED)).not.toThrow();
    });

    it('creates wild cards with no color', () => {
      expect(() => new Card(Value.WILD)).not.toThrow();
    });

    it('creates wild cards with a color', () => {
      expect(() => new Card(Value.WILD, Color.RED)).not.toThrow();
    });

    it('should not create a non-wild card without color', () => {
      expect(() => new Card(Value.ZERO)).toThrow();
      expect(() => new Card(Value.DRAW_TWO)).toThrow();
    });

    it('throws if value is outside the enum', () => {
      expect(() => new Card(123)).toThrow();
      expect(() => new Card(-21, Color.RED)).toThrow();
    });

    it('throws if color is outside the enum', () => {
      expect(() => new Card(Value.WILD, 123 as Color)).toThrow();
      expect(() => new Card(Value.ZERO, -21 as Color)).toThrow();
      expect(() => new Card(Value.REVERSE, 0 as Color)).toThrow();
      expect(() => new Card(Value.REVERSE, 5 as Color)).toThrow();
    });
  });

  describe('#value', function () {
    it('returns the correct value', () => {
      const zero = new Card(Value.ZERO, Color.RED);
      expect(zero.value).toBe(Value.ZERO);

      const wild = new Card(Value.WILD);
      expect(wild.value).toBe(Value.WILD);
    });

    it('should prevent cards from changing value', () => {
      const zero = new Card(Value.ZERO, Color.RED);
      expect(() => (zero.value = Value.ONE)).toThrow();
      expect(zero.value).not.toBe(Value.ONE);

      const reverse = new Card(Value.REVERSE, Color.RED);
      expect(() => (reverse.value = Value.ONE)).toThrow();
      expect(reverse.value).not.toBe(Value.ONE);
    });
  });

  describe('#color', function () {
    it('returns the correct color', () => {
      const zero = new Card(Value.ZERO, Color.RED);
      expect(zero.color).toBe(Color.RED);

      const wild = new Card(Value.WILD);
      expect(wild.color).toBeUndefined();
    });

    it('allows wild cards to change colors', () => {
      const wild = new Card(Value.WILD);
      expect(wild.color).toBeUndefined();

      expect(() => (wild.color = Color.BLUE)).not.toThrow();
      expect(wild.color).toBe(Color.BLUE);

      expect(() => (wild.color = Color.YELLOW)).not.toThrow();
      expect(wild.color).toBe(Color.YELLOW);
    });

    it('prevents normal or special cards from changing colors', () => {
      const zero = new Card(Value.ZERO, Color.RED);
      expect(() => (zero.color = Color.BLUE)).toThrow();
      expect(zero.color).not.toBe(Color.BLUE);

      const reverse = new Card(Value.REVERSE, Color.RED);
      expect(() => (reverse.color = Color.BLUE)).toThrow();
      expect(reverse.color).not.toBe(Color.BLUE);
    });
  });

  describe('#score', function () {
    it('returns the correct score for each card', () => {
      expect(new Card(Value.ZERO, Color.RED).score).toBe(0);
      expect(new Card(Value.THREE, Color.RED).score).toBe(3);
      expect(new Card(Value.FIVE, Color.RED).score).toBe(5);
      expect(new Card(Value.NINE, Color.RED).score).toBe(9);
      expect(new Card(Value.WILD).score).toBe(50);
      expect(new Card(Value.WILD_DRAW_FOUR).score).toBe(50);
      expect(new Card(Value.REVERSE, Color.RED).score).toBe(20);
      expect(new Card(Value.SKIP, Color.RED).score).toBe(20);
      expect(new Card(Value.DRAW_TWO, Color.RED).score).toBe(20);
    });
  });

  describe('#is()', function () {
    it('returns true if value matches', () => {
      const zero = new Card(Value.ZERO, Color.RED);

      expect(zero.is(Value.ZERO)).toBe(true);
    });

    it("returns false if value doesn't match", () => {
      const zero = new Card(Value.ZERO, Color.RED);

      expect(zero.is(Value.ONE)).toBe(false);
    });

    it('returns true if value and color match', () => {
      const zero = new Card(Value.ZERO, Color.RED);

      expect(zero.is(Value.ZERO, Color.RED)).toBe(true);
    });

    it("returns false if value and color don't match", () => {
      const zero = new Card(Value.ZERO, Color.RED);

      expect(zero.is(Value.ONE, Color.BLUE)).toBe(false);
    });

    it("returns false if value matches but color doesn't", () => {
      const zero = new Card(Value.ZERO, Color.RED);

      expect(zero.is(Value.ZERO, Color.BLUE)).toBe(false);
    });
  });

  describe('#isWildCard()', function () {
    it('returns true if card is a WILD_DRAW_FOUR or WILD', () => {
      const wild = new Card(Value.WILD);
      const wd4 = new Card(Value.WILD_DRAW_FOUR);

      expect(wild.isWildCard()).toBe(true);
      expect(wd4.isWildCard()).toBe(true);
    });

    it('returns false if card is any normal or other special card', () => {
      const zero = new Card(Value.ZERO, Color.RED);
      const reverse = new Card(Value.REVERSE, Color.RED);

      expect(zero.isWildCard()).toBe(false);
      expect(reverse.isWildCard()).toBe(false);
    });
  });

  describe('#isSpecialCard()', function () {
    it('returns true if card is one of WILD_DRAW_FOUR, WILD, DRAW_TWO, REVERSE or SKIP', () => {
      const wild = new Card(Value.WILD);
      const wd4 = new Card(Value.WILD_DRAW_FOUR);
      const skip = new Card(Value.SKIP, Color.RED);
      const reverse = new Card(Value.REVERSE, Color.RED);
      const dt = new Card(Value.DRAW_TWO, Color.RED);

      expect(wild.isSpecialCard()).toBe(true);
      expect(wd4.isSpecialCard()).toBe(true);
      expect(skip.isSpecialCard()).toBe(true);
      expect(reverse.isSpecialCard()).toBe(true);
      expect(dt.isSpecialCard()).toBe(true);
    });

    it('returns false if card is any normal card', () => {
      const zero = new Card(Value.ZERO, Color.RED);

      expect(zero.isSpecialCard()).toBe(false);
    });
  });

  describe('#matches()', function () {
    it('returns true if only values match', () => {
      const redZero = new Card(Value.ZERO, Color.RED);
      const blueZero = new Card(Value.ZERO, Color.BLUE);

      expect(redZero.matches(blueZero)).toBe(true);
      expect(blueZero.matches(redZero)).toBe(true);
    });

    it('returns true if only colors match', () => {
      const redOne = new Card(Value.ONE, Color.RED);
      const redTwo = new Card(Value.TWO, Color.RED);

      expect(redOne.matches(redTwo)).toBe(true);
      expect(redTwo.matches(redOne)).toBe(true);
    });

    it('returns true if both values and colors match', () => {
      const redOne = new Card(Value.ONE, Color.RED);
      const anotherRedOne = new Card(Value.ONE, Color.RED);

      expect(redOne.matches(anotherRedOne)).toBe(true);
      expect(anotherRedOne.matches(redOne)).toBe(true);
    });

    it("returns false if value and color doesn't match", () => {
      const redOne = new Card(Value.ONE, Color.RED);
      const yellowFive = new Card(Value.FIVE, Color.YELLOW);

      expect(redOne.matches(yellowFive)).toBe(false);
      expect(yellowFive.matches(redOne)).toBe(false);
    });
  });

  describe('#toString()', function () {
    it('should return the correct name for each card', () => {
      expect(new Card(Value.ZERO, Color.BLUE).toString()).toBe('BLUE ZERO');
      expect(new Card(Value.WILD).toString()).toBe('NO_COLOR WILD');
      expect(new Card(Value.WILD_DRAW_FOUR, Color.GREEN).toString()).toBe(
        'GREEN WILD_DRAW_FOUR',
      );
      expect(new Card(Value.REVERSE, Color.RED).toString()).toBe('RED REVERSE');
      expect(new Card(Value.DRAW_TWO, Color.YELLOW).toString()).toBe(
        'YELLOW DRAW_TWO',
      );
    });
  });
});

import { Card, Colors, Values } from '../src/card';

describe('Card', function () {
  describe('#constructor', function () {
    it('creates a valid card', () => {
      expect(() => new Card(Values.ZERO, Colors.RED)).not.toThrow();
    });

    it('creates wild cards with no color', () => {
      expect(() => new Card(Values.WILD)).not.toThrow();
    });

    it('creates wild cards with a color', () => {
      expect(() => new Card(Values.WILD, Colors.RED)).not.toThrow();
    });

    it('should not create a non-wild card without color', () => {
      expect(() => new Card(Values.ZERO)).toThrow();
      expect(() => new Card(Values.DRAW_TWO)).toThrow();
    });

    it('throws if value is outside the enum', () => {
      expect(() => new Card(123)).toThrow();
      expect(() => new Card(-21, Colors.RED)).toThrow();
    });

    it('throws if color is outside the enum', () => {
      expect(() => new Card(Values.WILD, 123 as Colors)).toThrow();
      expect(() => new Card(Values.ZERO, -21 as Colors)).toThrow();
      expect(() => new Card(Values.REVERSE, 4 as Colors)).toThrow();
    });
  });

  describe('#value', function () {
    it('returns the correct value', () => {
      const zero = new Card(Values.ZERO, Colors.RED);
      expect(zero.value).toBe(Values.ZERO);

      const wild = new Card(Values.WILD);
      expect(wild.value).toBe(Values.WILD);
    });

    it('should prevent cards from changing value', () => {
      const zero = new Card(Values.ZERO, Colors.RED);
      expect(() => (zero.value = Values.ONE)).toThrow();
      expect(zero.value).not.toBe(Values.ONE);

      const reverse = new Card(Values.REVERSE, Colors.RED);
      expect(() => (reverse.value = Values.ONE)).toThrow();
      expect(reverse.value).not.toBe(Values.ONE);
    });
  });

  describe('#color', function () {
    it('returns the correct color', () => {
      const zero = new Card(Values.ZERO, Colors.RED);
      expect(zero.color).toBe(Colors.RED);

      const wild = new Card(Values.WILD);
      expect(wild.color).toBeUndefined();
    });

    it('allows wild cards to change colors', () => {
      const wild = new Card(Values.WILD);
      expect(wild.color).toBeUndefined();

      expect(() => (wild.color = Colors.BLUE)).not.toThrow();
      expect(wild.color).toBe(Colors.BLUE);

      expect(() => (wild.color = Colors.YELLOW)).not.toThrow();
      expect(wild.color).toBe(Colors.YELLOW);
    });

    it('prevents normal or special cards from changing colors', () => {
      const zero = new Card(Values.ZERO, Colors.RED);
      expect(() => (zero.color = Colors.BLUE)).toThrow();
      expect(zero.color).not.toBe(Colors.BLUE);

      const reverse = new Card(Values.REVERSE, Colors.RED);
      expect(() => (reverse.color = Colors.BLUE)).toThrow();
      expect(reverse.color).not.toBe(Colors.BLUE);
    });
  });

  describe('#score', function () {
    it('returns the correct score for each card', () => {
      expect(new Card(Values.ZERO, Colors.RED).score).toBe(0);
      expect(new Card(Values.THREE, Colors.RED).score).toBe(3);
      expect(new Card(Values.FIVE, Colors.RED).score).toBe(5);
      expect(new Card(Values.NINE, Colors.RED).score).toBe(9);
      expect(new Card(Values.WILD).score).toBe(50);
      expect(new Card(Values.WILD_DRAW_FOUR).score).toBe(50);
      expect(new Card(Values.REVERSE, Colors.RED).score).toBe(20);
      expect(new Card(Values.SKIP, Colors.RED).score).toBe(20);
      expect(new Card(Values.DRAW_TWO, Colors.RED).score).toBe(20);
    });
  });

  describe('#is()', function () {
    it('returns true if value matches', () => {
      const zero = new Card(Values.ZERO, Colors.RED);

      expect(zero.is(Values.ZERO)).toBe(true);
    });

    it("returns false if value doesn't match", () => {
      const zero = new Card(Values.ZERO, Colors.RED);

      expect(zero.is(Values.ONE)).toBe(false);
    });

    it('returns true if value and color match', () => {
      const zero = new Card(Values.ZERO, Colors.RED);

      expect(zero.is(Values.ZERO, Colors.RED)).toBe(true);
    });

    it("returns false if value and color don't match", () => {
      const zero = new Card(Values.ZERO, Colors.RED);

      expect(zero.is(Values.ONE, Colors.BLUE)).toBe(false);
    });

    it("returns false if value matches but color doesn't", () => {
      const zero = new Card(Values.ZERO, Colors.RED);

      expect(zero.is(Values.ZERO, Colors.BLUE)).toBe(false);
    });
  });

  describe('#isWildCard()', function () {
    it('returns true if card is a WILD_DRAW_FOUR or WILD', () => {
      const wild = new Card(Values.WILD);
      const wd4 = new Card(Values.WILD_DRAW_FOUR);

      expect(wild.isWildCard()).toBe(true);
      expect(wd4.isWildCard()).toBe(true);
    });

    it('returns false if card is any normal or other special card', () => {
      const zero = new Card(Values.ZERO, Colors.RED);
      const reverse = new Card(Values.REVERSE, Colors.RED);

      expect(zero.isWildCard()).toBe(false);
      expect(reverse.isWildCard()).toBe(false);
    });
  });

  describe('#isSpecialCard()', function () {
    it('returns true if card is one of WILD_DRAW_FOUR, WILD, DRAW_TWO, REVERSE or SKIP', () => {
      const wild = new Card(Values.WILD);
      const wd4 = new Card(Values.WILD_DRAW_FOUR);
      const skip = new Card(Values.SKIP, Colors.RED);
      const reverse = new Card(Values.REVERSE, Colors.RED);
      const dt = new Card(Values.DRAW_TWO, Colors.RED);

      expect(wild.isSpecialCard()).toBe(true);
      expect(wd4.isSpecialCard()).toBe(true);
      expect(skip.isSpecialCard()).toBe(true);
      expect(reverse.isSpecialCard()).toBe(true);
      expect(dt.isSpecialCard()).toBe(true);
    });

    it('returns false if card is any normal card', () => {
      const zero = new Card(Values.ZERO, Colors.RED);

      expect(zero.isSpecialCard()).toBe(false);
    });
  });

  describe('#matches()', function () {
    it('returns true if only values match', () => {
      const redZero = new Card(Values.ZERO, Colors.RED);
      const blueZero = new Card(Values.ZERO, Colors.BLUE);

      expect(redZero.matches(blueZero)).toBe(true);
      expect(blueZero.matches(redZero)).toBe(true);
    });

    it('returns true if only colors match', () => {
      const redOne = new Card(Values.ONE, Colors.RED);
      const redTwo = new Card(Values.TWO, Colors.RED);

      expect(redOne.matches(redTwo)).toBe(true);
      expect(redTwo.matches(redOne)).toBe(true);
    });

    it('returns true if both values and colors match', () => {
      const redOne = new Card(Values.ONE, Colors.RED);
      const anotherRedOne = new Card(Values.ONE, Colors.RED);

      expect(redOne.matches(anotherRedOne)).toBe(true);
      expect(anotherRedOne.matches(redOne)).toBe(true);
    });

    it("returns false if value and color doesn't match", () => {
      const redOne = new Card(Values.ONE, Colors.RED);
      const yellowFive = new Card(Values.FIVE, Colors.YELLOW);

      expect(redOne.matches(yellowFive)).toBe(false);
      expect(yellowFive.matches(redOne)).toBe(false);
    });
  });

  describe('#toString()', function() {
    it('should return the correct name for each card', () => {
      expect(new Card(Values.ZERO, Colors.BLUE).toString()).toBe('BLUE ZERO');
      expect(new Card(Values.WILD).toString()).toBe('NO_COLOR WILD');
      expect(new Card(Values.WILD_DRAW_FOUR, Colors.GREEN).toString()).toBe('GREEN WILD_DRAW_FOUR');
      expect(new Card(Values.REVERSE, Colors.RED).toString()).toBe('RED REVERSE');
      expect(new Card(Values.DRAW_TWO, Colors.YELLOW).toString()).toBe('YELLOW DRAW_TWO');
    });
  });
});

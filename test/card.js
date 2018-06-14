'use strict';

const Colors = require('../src/colors');
const Values = require('../src/values');
const Card = require('../src/card');
const Deck = require('../src/deck');

describe('Card', function() {
  describe('#constructor', function() {
    it('should create a valid card', () => {
      expect(() => Card(Values.ZERO, Colors.RED)).not.throw;
      expect(() => Card(Values.ZERO)).throw;
    });

    it('should create wild cards with no color', () => {
      expect(() => Card(Values.WILD)).not.throw;
    });

    it('should create wild cards with a color', () => {
      expect(() => Card(Values.WILD, Colors.RED)).not.throw;
    });
  });

  describe('#value', function() {
    it('should return the correct value', () => {
      const zero = Card(Values.ZERO, Colors.RED);
      expect(zero.value).toBe(Values.ZERO);

      const wild = Card(Values.WILD);
      expect(wild.value).toBe(Values.WILD);
    });

    it('should prevent value to be changed', () => {
      const zero = Card(Values.ZERO, Colors.RED);
      expect(zero.value).toBe(Values.ZERO);
      expect(() => (zero.value = Values.ONE)).throw;
      expect(zero.value).toBe(Values.ZERO);
    });
  });

  describe('#color', function() {
    it('should return the correct color', () => {
      const zero = Card(Values.ZERO, Colors.RED);
      expect(zero.color).toBe(Colors.RED);

      const wild = Card(Values.WILD);
      expect(wild.color).toBe(null);
    });

    it('should allow wild cards to change colors', () => {
      const wild = Card(Values.WILD);
      expect(wild.color).toBe(null);
      expect(() => (wild.color = Colors.BLUE)).not.throw;
      expect(wild.color).toBe(Colors.BLUE);
      expect(() => (wild.color = Colors.YELLOW)).not.throw;
      expect(wild.color).toBe(Colors.YELLOW);
    });

    it('should prevent normal or special cards from changing colors', () => {
      const zero = Card(Values.ZERO, Colors.RED);
      expect(zero.color).toBe(Colors.RED);
      expect(() => (zero.color = Colors.BLUE)).throw;
      expect(zero.color).not.toBe(Colors.BLUE);

      const reverse = Card(Values.REVERSE, Colors.RED);
      expect(reverse.color).toBe(Colors.RED);
      expect(() => (reverse.color = Colors.BLUE)).throw;
      expect(reverse.color).not.toBe(Colors.BLUE);
    });
  });

  describe('#score', function() {
    it('should return the correct score for each card', () => {
      expect(Card(Values.ZERO, Colors.RED).score).toBe(0);
      expect(Card(Values.THREE, Colors.RED).score).toBe(3);
      expect(Card(Values.FIVE, Colors.RED).score).toBe(5);
      expect(Card(Values.NINE, Colors.RED).score).toBe(9);
      expect(Card(Values.WILD).score).toBe(50);
      expect(Card(Values.WILD_DRAW_FOUR).score).toBe(50);
      expect(Card(Values.REVERSE, Colors.RED).score).toBe(20);
      expect(Card(Values.SKIP, Colors.RED).score).toBe(20);
      expect(Card(Values.DRAW_TWO, Colors.RED).score).toBe(20);
    });
  });

  describe('#is()', function() {
    it('should return true if value matches', () => {
      const zero = Card(Values.ZERO, Colors.RED);

      expect(zero.is(Values.ZERO)).toBe(true);
    });

    it("should return false if value doesn't match", () => {
      const zero = Card(Values.ZERO, Colors.RED);

      expect(zero.is(Values.ONE)).toBe(false);
    });

    it('should return true if value and color match', () => {
      const zero = Card(Values.ZERO, Colors.RED);

      expect(zero.is(Values.ZERO, Colors.RED)).toBe(true);
    });

    it("should return false if value and color don't match", () => {
      const zero = Card(Values.ZERO, Colors.RED);

      expect(zero.is(Values.ONE, Colors.BLUE)).toBe(false);
    });

    it("should return false if value matches but color doesn't", () => {
      const zero = Card(Values.ZERO, Colors.RED);

      expect(zero.is(Values.ZERO, Colors.BLUE)).toBe(false);
    });
  });

  describe('#isWildCard()', function() {
    it('should return true if card is a WILD_DRAW_FOUR or WILD', () => {
      const wild = Card(Values.WILD);
      const wd4 = Card(Values.WILD_DRAW_FOUR);

      expect(wild.isWildCard()).toBe(true);
      expect(wd4.isWildCard()).toBe(true);
    });

    it('should return false if card is any normal or other special card', () => {
      const zero = Card(Values.ZERO, Colors.RED);
      const reverse = Card(Values.REVERSE, Colors.RED);

      expect(zero.isWildCard()).toBe(false);
      expect(reverse.isWildCard()).toBe(false);
    });
  });

  describe('#isSpecialCard()', function() {
    it('should return true if card is one of WILD_DRAW_FOUR, WILD, DRAW_TWO, REVERSE or SKIP', () => {
      const wild = Card(Values.WILD);
      const wd4 = Card(Values.WILD_DRAW_FOUR);
      const skip = Card(Values.SKIP, Colors.RED);
      const reverse = Card(Values.REVERSE, Colors.RED);
      const dt = Card(Values.DRAW_TWO, Colors.RED);

      expect(wild.isSpecialCard()).toBe(true);
      expect(wd4.isSpecialCard()).toBe(true);
      expect(skip.isSpecialCard()).toBe(true);
      expect(reverse.isSpecialCard()).toBe(true);
      expect(dt.isSpecialCard()).toBe(true);
    });

    it('should return false if card is any normal card', () => {
      const zero = Card(Values.ZERO, Colors.RED);

      expect(zero.isSpecialCard()).toBe(false);
    });
  });

  describe('#matches()', function() {
    it('should return true if only values match', () => {
      const redZero = Card(Values.ZERO, Colors.RED);
      const blueZero = Card(Values.ZERO, Colors.BLUE);

      expect(redZero.matches(blueZero)).toBe(true);
      expect(blueZero.matches(redZero)).toBe(true);
    });

    it('should return true if only colors match', () => {
      const redOne = Card(Values.ONE, Colors.RED);
      const redTwo = Card(Values.TWO, Colors.RED);

      expect(redOne.matches(redTwo)).toBe(true);
      expect(redTwo.matches(redOne)).toBe(true);
    });

    it('should return true if both values and colors match', () => {
      const redOne = Card(Values.ONE, Colors.RED);
      const anotherRedOne = Card(Values.ONE, Colors.RED);

      expect(redOne.matches(anotherRedOne)).toBe(true);
      expect(anotherRedOne.matches(redOne)).toBe(true);
    });

    it("should return false if value and color doesn't match", () => {
      const redOne = Card(Values.ONE, Colors.RED);
      const yellowFive = Card(Values.FIVE, Colors.YELLOW);

      expect(redOne.matches(yellowFive)).toBe(false);
      expect(yellowFive.matches(redOne)).toBe(false);
    });
  });
});

"use strict";

const should = require('chai').should();

const Colors = require('../colors');
const Values = require('../values');
const Card = require('../card');
const Deck = require('../deck');

describe('Card', function () {
  describe('#constructor', function () {
    it('should create a valid card', () => {
      should.not.throw(() => Card(Values.ZERO, Colors.RED));
      should.throw(() => Card(Values.ZERO));
    });
    it('should create wild cards with no color', () => {
      should.not.throw(() => Card(Values.WILD));
    });
    it('should create wild cards with a color', () => {
      should.not.throw(() => Card(Values.WILD, Colors.RED));
    });
  });
  describe('#value', function () {
    it('should return the correct value', () => {
      const zero = Card(Values.ZERO, Colors.RED);
      zero.value.should.equal(Values.ZERO);

      const wild = Card(Values.WILD);
      wild.value.should.equal(Values.WILD);
    });
    it('should prevent value to be changed', () => {
      const zero = Card(Values.ZERO, Colors.RED);
      zero.value.should.equal(Values.ZERO);
      should.throw(() => zero.value = Values.ONE);
      zero.value.should.equal(Values.ZERO);
    });
  });
  describe('#color', function () {
    it('should return the correct color', () => {
      const zero = Card(Values.ZERO, Colors.RED);
      zero.color.should.equal(Colors.RED);

      const wild = Card(Values.WILD);
      should.equal(wild.color, null);
    });
    it('should allow wild cards to change colors', () => {
      const wild = Card(Values.WILD);
      should.equal(wild.color, null);
      should.not.throw(() => wild.color = Colors.BLUE);
      wild.color.should.equal(Colors.BLUE);
      should.not.throw(() => wild.color = Colors.YELLOW);
      wild.color.should.equal(Colors.YELLOW);
    });
    it('should prevent normal or special cards from changing colors', () => {
      const zero = Card(Values.ZERO, Colors.RED);
      zero.color.should.equal(Colors.RED);
      should.throw(() => zero.color = Colors.BLUE);
      zero.color.should.not.equal(Colors.BLUE);

      const reverse = Card(Values.REVERSE, Colors.RED);
      reverse.color.should.equal(Colors.RED);
      should.throw(() => reverse.color = Colors.BLUE);
      reverse.color.should.not.equal(Colors.BLUE);
    });
  });
  describe('#score', function () {
    it('should return the correct score for each card', () => {
      Card(Values.ZERO, Colors.RED)
        .score.should.equal(0);
      Card(Values.THREE, Colors.RED)
        .score.should.equal(3);
      Card(Values.FIVE, Colors.RED)
        .score.should.equal(5);
      Card(Values.NINE, Colors.RED)
        .score.should.equal(9);
      Card(Values.WILD)
        .score.should.equal(50);
      Card(Values.WILD_DRAW_FOUR)
        .score.should.equal(50);
      Card(Values.REVERSE, Colors.RED)
        .score.should.equal(20);
      Card(Values.SKIP, Colors.RED)
        .score.should.equal(20);
      Card(Values.DRAW_TWO, Colors.RED)
        .score.should.equal(20);
    });
  });
  describe('#is()', function () {
    it('should return true if value matches', () => {
      const zero = Card(Values.ZERO, Colors.RED);

      zero.is(Values.ZERO).should.be.true;
    });
    it('should return false if value doesn\'t match', () => {
      const zero = Card(Values.ZERO, Colors.RED);

      zero.is(Values.ONE).should.be.false;
    });
    it('should return true if value and color match', () => {
      const zero = Card(Values.ZERO, Colors.RED);

      zero.is(Values.ZERO, Colors.RED).should.be.true;
    });
    it('should return false if value and color don\'t match', () => {
      const zero = Card(Values.ZERO, Colors.RED);

      zero.is(Values.ONE, Colors.BLUE).should.be.false;
    });
    it('should return false if value matches but color doesn\'t', () => {
      const zero = Card(Values.ZERO, Colors.RED);

      zero.is(Values.ZERO, Colors.BLUE).should.be.false;
    });
  });
  describe('#isWildCard()', function () {
    it('should return true if card is a WILD_DRAW_FOUR or WILD', () => {
      const wild = Card(Values.WILD);
      const wd4 = Card(Values.WILD_DRAW_FOUR);

      wild.isWildCard().should.be.true;
      wd4.isWildCard().should.be.true;
    });
    it('should return false if card is any normal or other special card', () => {
      const zero = Card(Values.ZERO, Colors.RED);
      const reverse = Card(Values.REVERSE, Colors.RED);

      zero.isWildCard().should.be.false;
      reverse.isWildCard().should.be.false;
    });
  });
  describe('#isSpecialCard()', function () {
    it('should return true if card is one of WILD_DRAW_FOUR, WILD, DRAW_TWO, REVERSE or SKIP', () => {
      const wild = Card(Values.WILD);
      const wd4 = Card(Values.WILD_DRAW_FOUR);
      const skip = Card(Values.SKIP, Colors.RED);
      const reverse = Card(Values.REVERSE, Colors.RED);
      const dt = Card(Values.DRAW_TWO, Colors.RED);

      wild.isSpecialCard().should.be.true;
      wd4.isSpecialCard().should.be.true;
      skip.isSpecialCard().should.be.true;
      reverse.isSpecialCard().should.be.true;
      dt.isSpecialCard().should.be.true;
    });
    it('should return false if card is any normal card', () => {
      const zero = Card(Values.ZERO, Colors.RED);

      zero.isSpecialCard().should.be.false;
    });
  });
  describe('#matches()', function () {
    it('should return true if only values match', () => {
      const redZero = Card(Values.ZERO, Colors.RED);
      const blueZero = Card(Values.ZERO, Colors.BLUE);

      redZero.matches(blueZero).should.be.true;
      blueZero.matches(redZero).should.be.true;
    });
    it('should return true if only colors match', () => {
      const redOne = Card(Values.ONE, Colors.RED);
      const redTwo = Card(Values.TWO, Colors.RED);

      redOne.matches(redTwo).should.be.true;
      redTwo.matches(redOne).should.be.true;
    });
    it('should return true if both values and colors match', () => {
      const redOne = Card(Values.ONE, Colors.RED);
      const anotherRedOne = Card(Values.ONE, Colors.RED);

      redOne.matches(anotherRedOne).should.be.true;
      anotherRedOne.matches(redOne).should.be.true;
    });
    it('should return false if value and color doesn\'t match', () => {
      const redOne = Card(Values.ONE, Colors.RED);
      const yellowFive = Card(Values.FIVE, Colors.YELLOW);

      redOne.matches(yellowFive).should.be.false;
      yellowFive.matches(redOne).should.be.false;
    });
  });
});

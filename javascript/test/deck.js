var assert = require('chai').assert;

describe('deck', function() {

  it('should have 108 cards');
  it('should have 36 numbers');
  it('should have 8 draw two');
  it('should have 8 skip');
  it('should have 4 wild');
  it('should have 4 wild draw four');

  describe('Card', function () {
    describe('#match()', function () {
      it('should match a card with same value and color');
      it('should match a card with same value');
      it('should match a card with same color');
      it('should not match a card with different value and color');
      it('should match wild card with same color');
    });
  });
});

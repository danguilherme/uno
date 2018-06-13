const Card = require('../card');
const Values = require('../values');

function CumulativeDrawTwo(game) {
  let state = 'normal';
  setup(game);

  /**
   * How many cards must be drawn in the next draw() call.
   * It's used when there's a row of DRAW_TWO running.
   */
  let cardsToDraw = 0;

  function setup(game) {
    game.on('cardplay', onCardPlay.bind(this, game));
    game.on('beforepass', beforePass.bind(this, game));
    game.on('beforeplay', beforePlay.bind(this, game));
    game.on('beforedraw', beforeDraw.bind(this, game));
  }

  function onCardPlay(game, error, card, player) {
    if (error) return;

    if (card.is(Values.DRAW_TWO)) {
      cardsToDraw += 2;
      state = 'stacking';

      game.play(card, { silent: true });
      // we'll take over from here
      return false;
    }

    return true;
  }

  function beforePass(game, error, player) {
    if (isStacking())
      throw new Error(`There are ${cardsToDraw} cards to draw before passing`);
  }

  function beforePlay(game, error, card, player) {
    if (isStacking() && !card.is(Values.DRAW_TWO))
      throw new Error(`${player} must draw cards`);
  }

  function beforeDraw(game, error, player, qty) {
    if (!isStacking()) return true;

    game.draw(player, cardsToDraw, { silent: true });
    cardsToDraw = 0;

    game.pass();

    return false;
  }

  /**
   * Whether or not we are in a row of draw twos.
   */
  function isStacking() {
    return cardsToDraw > 0;
  }
}

module.exports = {
  setup(game) { return CumulativeDrawTwo(game); }
};
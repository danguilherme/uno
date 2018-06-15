const { Card } = require('../card/card');
const { Values } = require('../card/values');
const {
  BeforeDrawEvent,
  BeforePassEvent,
  BeforeCardPlayEvent,
  CardPlayEvent,
} = require('../events/game-events');

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
    game.on('beforecardplay', beforePlay.bind(this, game));
    game.on('beforedraw', beforeDraw.bind(this, game));
  }

  /**
   * @param {Game} game
   * @param {CardPlayEvent} event
   */
  function onCardPlay(game, event) {
    const { card, player } = event.data;

    if (card.is(Values.DRAW_TWO)) {
      cardsToDraw += 2;
      state = 'stacking';

      game.play(card, { silent: true });
      // we'll take over from here
      return false;
    }

    return true;
  }

  /**
   * @param {Game} game
   * @param {BeforePassEvent} event
   */
  function beforePass(game, event) {
    if (isStacking())
      throw new Error(`There are ${cardsToDraw} cards to draw before passing`);
  }

  /**
   * @param {Game} game
   * @param {BeforeCardPlayEvent} event
   */
  function beforePlay(game, event) {
    const { card, player } = event.data;

    if (isStacking() && !card.is(Values.DRAW_TWO))
      throw new Error(`${player} must draw cards`);
  }

  /**
   * @param {Game} game
   * @param {BeforeDrawEvent} event
   */
  function beforeDraw(game, event) {
    if (!isStacking()) return true;

    const { quantity, player } = event.data;

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
  setup(game) {
    return CumulativeDrawTwo(game);
  },
};

import { Values } from '../card';
import {
  BeforeCardPlayEvent,
  BeforeDrawEvent,
  BeforePassEvent,
  CardPlayEvent,
} from '../events/game-events';

export type Game = any;

function CumulativeDrawTwo(game: Game) {
  let state = 'normal';
  setup(game);

  /**
   * How many cards must be drawn in the next draw() call.
   * It's used when there's a row of DRAW_TWO running.
   */
  let cardsToDraw = 0;

  function setup(game: Game) {
    game.on('cardplay', onCardPlay.bind(this, game));
    game.on('beforepass', beforePass.bind(this, game));
    game.on('beforecardplay', beforePlay.bind(this, game));
    game.on('beforedraw', beforeDraw.bind(this, game));
  }

  /**
   * @param {Game} game
   * @param {CardPlayEvent} event
   */
  function onCardPlay(game: Game, event: CardPlayEvent) {
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
  function beforePass(game: Game, event: BeforePassEvent) {
    if (isStacking())
      throw new Error(`There are ${cardsToDraw} cards to draw before passing`);
  }

  /**
   * @param {Game} game
   * @param {BeforeCardPlayEvent} event
   */
  function beforePlay(game: Game, event: BeforeCardPlayEvent) {
    const { card, player } = event.data;

    if (isStacking() && !card.is(Values.DRAW_TWO))
      throw new Error(`${player} must draw cards`);
  }

  /**
   * @param {Game} game
   * @param {BeforeDrawEvent} event
   */
  function beforeDraw(game: Game, event: BeforeDrawEvent) {
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

export default {
  setup(game: Game) {
    return CumulativeDrawTwo(game);
  },
};

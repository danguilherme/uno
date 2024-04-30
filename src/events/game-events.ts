import { Card } from '../card';
import { Player } from '../player';
import { Event } from './event';

/**
 * Fired when a player requests cards from the draw pile.
 *
 * @event
 */
export class BeforeDrawEvent extends Event {
  /**
   * @param {Player} player   The player will draw
   * @param {number} quantity The quantity of cards will be drawn
   */
  constructor(
    public readonly player: Player,
    public readonly quantity: number,
  ) {
    super('beforedraw');
  }
}

/**
 * Fired after player's drawn cards are added to his hands.
 *
 * @event
 */
export class DrawEvent extends Event {
  /**
   * @param {Player} player The player that has drawn
   * @param {Card[]} cards The cards that were drawn
   */
  constructor(public readonly player: Player, public readonly cards: Card[]) {
    super('draw');
  }
}

/**
 * Fired when a player can pass and requests to pass its turn.
 *
 * @event
 */
export class BeforePassEvent extends Event {
  /**
   * @param {Player} player The player that will pass
   */
  constructor(public readonly player: Player) {
    super('beforepass');
  }
}

/**
 * Fired before player discards a card in the discard pile.
 *
 * @event
 */
export class BeforeCardPlayEvent extends Event {
  /**
   * @param {Card} card The card that will be played
   * @param {Player} player The player that will play
   */
  constructor(public readonly card: Card, public readonly player: Player) {
    super('beforecardplay');
  }
}

/**
 * Fired after player's card is thrown in the discard pile.
 *
 * @event
 */
export class CardPlayEvent extends Event {
  /**
   * @param {Card} card The card that was played
   * @param {Player} player The player that played
   */
  constructor(public readonly card: Card, public readonly player: Player) {
    super('cardplay');
  }
}

/**
 * Fired when {@link game#currentPlayer | currentPlayer} changes.
 *
 * @event
 */
export class NextPlayerEvent extends Event {
  /**
   * @param {Player} player The new player
   */
  constructor(public readonly player: Player) {
    super('nextplayer');
  }
}

/**
 * Fired when `winner` has 0 cards at hand.
 *
 * @event
 */
export class GameEndEvent extends Event {
  /**
   * @param {Player} winner The big winner
   * @param {number} score Player's final score
   */
  constructor(public readonly winner: Player, public readonly score: number) {
    super('end', {
      isCancelable: false,
    });
  }
}

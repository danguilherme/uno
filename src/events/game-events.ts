import { Card } from '../card';
import { Player } from '../player';
import { Event } from './event';

export interface BeforeDrawEventData {
  player: Player;
  quantity: number;
}

/**
 * Fired when a player requests cards from the draw pile.
 */
export class BeforeDrawEvent extends Event<BeforeDrawEventData> {
  /**
   * @param {Player} player  thatThe player will draw
   * @param {number} quantity The quantity of cards will be drawn
   */
  constructor(player: Player, quantity: number) {
    super('beforedraw', {
      isCancelable: true,
      data: {
        player,
        quantity,
      },
    });
  }
}

export interface DrawEventData {
  player: Player;
  cards: Card[];
}

/**
 * Fired after player's drawn cards are added to his hands.
 */
export class DrawEvent extends Event<DrawEventData> {
  /**
   * @param {Player} player The player that has drawn
   * @param {Card[]} cards The cards that were drawn
   */
  constructor(player: Player, cards: Card[]) {
    super('draw', {
      isCancelable: true,
      data: {
        player,
        cards,
      },
    });
  }
}

export interface BeforePassEventData {
  player: Player;
}

/**
 * Fired when a player can pass and requests to pass its turn.
 */
export class BeforePassEvent extends Event<BeforePassEventData> {
  /**
   * @param {Player} player The player that will pass
   */
  constructor(player: Player) {
    super('beforepass', {
      isCancelable: true,
      data: {
        player,
      },
    });
  }
}

export interface BeforeCardPlayEventData {
  card: Card;
  player: Player;
}

/**
 * Fired before player discards a card in the discard pile.
 */
export class BeforeCardPlayEvent extends Event<BeforeCardPlayEventData> {
  /**
   * @param {Card} card The card that will be played
   * @param {Player} player The player that will play
   */
  constructor(card: Card, player: Player) {
    super('beforecardplay', {
      isCancelable: true,
      data: {
        card,
        player,
      },
    });
  }
}

export type CardPlayEventData = BeforeCardPlayEventData;

/**
 * Fired after player's card is thrown in the discard pile.
 */
export class CardPlayEvent extends Event<CardPlayEventData> {
  /**
   * @param {Card} card The card that was played
   * @param {Player} player The player that played
   */
  constructor(card: Card, player: Player) {
    super('cardplay', {
      isCancelable: true,
      data: {
        card,
        player,
      },
    });
  }
}

export interface NextPlayerEventData {
  player: Player;
}

/**
 * Fired when {@link game#currentPlayer | currentPlayer} changes.
 */
export class NextPlayerEvent extends Event {
  /**
   * @param {Player} player The new player
   */
  constructor(player: Player) {
    super('nextplayer', {
      isCancelable: false,
      data: {
        player,
      },
    });
  }
}

export interface GameEndEventData<GameEndEventData> {
  winner: Player;
  score: number;
}

/**
 * Fired when `winner` has 0 cards at hand.
 */
export class GameEndEvent extends Event {
  /**
   * @param {Player} winner The big winner
   * @param {number} score Player's final score
   */
  constructor(winner: Player, score: number) {
    super('end', {
      isCancelable: false,
      data: {
        winner,
        score,
      },
    });
  }
}

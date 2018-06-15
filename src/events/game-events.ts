import { Event } from './event';
import { Card } from '../card';

export interface BeforeDrawEventData {
  player: string;
  quantity: number;
}

export class BeforeDrawEvent extends Event<BeforeDrawEventData> {
  /**
   * @param {string} player  thatThe player will draw
   * @param {number} quantity The quantity of cards will be drawn
   */
  constructor(player: string, quantity: number) {
    super('beforedraw', {
      isCancelable: true,
      data: {
        player,
        quantity,
      },
    });
  }
}

export type DrawEventData = BeforeDrawEventData;

export class DrawEvent extends Event<DrawEventData> {
  /**
   * @param {string} player The player that has drawn
   * @param {number} quantity The quantity of cards was drawn
   */
  constructor(player: string, quantity: number) {
    super('draw', {
      isCancelable: true,
      data: {
        player,
        quantity,
      },
    });
  }
}

export interface BeforePassEventData {
  player: string;
}

export class BeforePassEvent extends Event<BeforePassEventData> {
  /**
   * @param {string} player The player that will pass
   */
  constructor(player: string) {
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
  player: string;
}

export class BeforeCardPlayEvent extends Event<BeforeCardPlayEventData> {
  /**
   * @param {Card} card The card that will be played
   * @param {string} player The player that will play
   */
  constructor(card: Card, player: string) {
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

export class CardPlayEvent extends Event<CardPlayEventData> {
  /**
   * @param {Card} card The card that was played
   * @param {string} player The player that played
   */
  constructor(card: Card, player: string) {
    super('cardplay', {
      isCancelable: true,
      data: {
        card,
        player,
      },
    });
  }
}

export interface GameEndEventData<GameEndEventData> {
  winner: string;
  score: number;
}

export class GameEndEvent extends Event {
  /**
   * @param {string} winner The big winner
   * @param {number} score Player's final score
   */
  constructor(winner: string, score: number) {
    super('end', {
      isCancelable: false,
      data: {
        winner,
        score,
      },
    });
  }
}

export interface NextPlayerEventData {
  player: string;
}

export class NextPlayerEvent extends Event {
  /**
   * @param {string} player The new player
   */
  constructor(player: string) {
    super('nextplayer', {
      isCancelable: false,
      data: {
        player,
      },
    });
  }
}

import { Event } from './event';
import { Card } from '../card';
import { Player } from '../player';

export interface BeforeDrawEventData {
  player: Player;
  quantity: number;
}

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

export type DrawEventData = BeforeDrawEventData;

export class DrawEvent extends Event<DrawEventData> {
  /**
   * @param {Player} player The player that has drawn
   * @param {number} quantity The quantity of cards was drawn
   */
  constructor(player: Player, quantity: number) {
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
  player: Player;
}

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

export interface GameEndEventData<GameEndEventData> {
  winner: Player;
  score: number;
}

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

export interface NextPlayerEventData {
  player: Player;
}

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

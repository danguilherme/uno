const Event = require('./event');

class BeforeDrawEvent extends Event {
  /**
   * @param {string} player The player that will draw
   * @param {number} quantity The quantity of cards will be drawn
   */
  constructor(player, quantity) {
    super("beforedraw", {
      isCancelable: true,
      data: {
        player,
        quantity
      }
    });
  }
}

class DrawEvent extends Event {
  /**
   * @param {string} player The player that has drawn
   * @param {number} quantity The quantity of cards was drawn
   */
  constructor(player, quantity) {
    super("draw", {
      isCancelable: true,
      data: {
        player,
        quantity
      }
    });
  }
}

class BeforePassEvent extends Event {
  /**
   * @param {string} player The player that will pass
   */
  constructor(player, quantity) {
    super("beforepass", {
      isCancelable: true,
      data: {
        player
      }
    });
  }
}

class BeforeCardPlayEvent extends Event {
  /**
   * @param {Card} card The card that will be played
   * @param {string} player The player that will play
   */
  constructor(card, player) {
    super("beforecardplay", {
      isCancelable: true,
      data: {
        card,
        player
      }
    });
  }
}

class CardPlayEvent extends Event {
  /**
   * @param {Card} card The card that was played
   * @param {string} player The player that played
   */
  constructor(card, player) {
    super("cardplay", {
      isCancelable: true,
      data: {
        card,
        player
      }
    });
  }
}

class GameEndEvent extends Event {
  /**
   * @param {string} winner The big winner
   * @param {number} score Player's final score
   */
  constructor(winner, score) {
    super("end", {
      isCancelable: false,
      data: {
        winner,
        score
      }
    });
  }
}

class NextPlayerEvent extends Event {
  /**
   * @param {string} player The new player
   */
  constructor(player) {
    super("nextplayer", {
      isCancelable: false,
      data: {
        player
      }
    });
  }
}

module.exports = {
  BeforeDrawEvent,
  DrawEvent,
  BeforePassEvent,
  BeforeCardPlayEvent,
  CardPlayEvent,
  GameEndEvent,
  NextPlayerEvent,
};

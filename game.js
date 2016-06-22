"use strict";

const util = require('util');
const EventEmitter = require('events').EventEmitter;

const Deck = require('./deck');
const Card = require('./card');
const Player = require('./player');
const GameDirections = require('./game_directions');

const CARDS_PER_PLAYER = 7;

const game = function (playerNames) {
  // extends EventEmitter
  // events:
  // - start (players)
  // - card-play (card)
  // - uno (player)
  // - end (winner)

  let instance = Object.create(EventEmitter.prototype);

  let drawPile = null;
  let direction = null;
  let currentPlayer = null;
  let players = [];
  let discardedCard = null;

  // control vars
  /**
   * The player have draw in his turn?
   */
  let drawn = false;
  /**
   * How many cards must be drawn in the next draw() call.
   * It's used when there's a row of DRAW_TWO running.
   */
  let cardsToDraw = 0;

  function init() {
    instance.newGame();
  };

  instance.newGame = () => {
    try {
      drawPile = Deck();
      direction = GameDirections.CLOCKWISE;
      players = [];
      initPlayers();
      // do not start with special cards (REVERSE, DRAW, etc)
      do {
        discardedCard = drawPile.draw()[0];
      } while (discardedCard.isSpecialCard());

      // select starting player
      currentPlayer = players[getRandomInt(0, players.length - 1)];
    } catch (e) {
      instance.emit('error', e);
      return;
    }

    instance.emit('start', null, players);
  };

  function initPlayers() {
    if (!playerNames || !playerNames.length ||
      playerNames.length < 2 || playerNames.length > 10)
      throw new Error("There must be 2 to 10 players in the game");

    players = playerNames.map(player => {
      if (typeof player == 'string')
        player = Player(player);

      player.hand = drawPile.draw(CARDS_PER_PLAYER);

      return player;
    });
  };

  instance.getCurrentPlayer = () => currentPlayer;
  instance.getDiscardedCard = () => discardedCard;
  instance.draw = () => {
    drawn = true;
  };
  instance.pass = () => {
    if (!drawn)
      throw new Error("User must draw at least one card before passing");
    if (cardsToDraw > 0)
      throw new Error(`${currentPlayer} must draw cards before passing`);

    goToNextPlayer();
  };
  instance.play = card => {
    let currentPlayer = instance.getCurrentPlayer();
    // check if player has the card at hand...
    if (!currentPlayer.hasCard(card))
      throw new Error(`${currentPlayer} does not have card ${card} at hand`);
    // check if there isn't any pendent draw amount...
    if (cardsToDraw > 0)
      throw new Error(`${currentPlayer} must draw cards`);
    // check if the played card matches the card from the discard pile...
    if (!discardedCard.matches(card))
      throw new Error(`${card} does not match ${discardedCard} from discard pile`);

    currentPlayer.removeCard(card);
    discardedCard = card;
    goToNextPlayer();
  };

  function getNextPlayer() {
    let idx = getPlayerIndex(currentPlayer);

    if (++idx == players.length)
      idx = 0;

    return players[idx];
  }

  function getPlayerIndex(playerName) {
    if (typeof playerName != 'string')
      playerName = playerName.name;

    return players.map(p => p.name).indexOf(playerName);
  }

  /**
   * Set current player to the next in the line,
   * with no validations, reseting all per-turn controllers
   * (`draw`, `cardsToDraw`, ...)
   */
  function goToNextPlayer() {
    cardsToDraw = 0;
    drawn = false;

    currentPlayer = getNextPlayer();
  }

  function reverseGame() {
    players.reverse();
    direction = direction == GameDirections.CLOCKWISE ?
      GameDirections.COUNTER_CLOCKWISE :
      GameDirections.CLOCKWISE;
  }

  process.nextTick(() => {
    init();
  });

  return instance;
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = game;
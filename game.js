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

  const init = () => {
    instance.newGame();
  };

  const initPlayers = () => {
    if (!playerNames || !playerNames.length ||
      playerNames.length < 2 || playerNames.length > 10)
      throw new Error("There must be 2 to 10 players in the game");
    
    playerNames.map(player => {
      if (typeof player == 'string')
        player = Player(player);
      
      player.deck = drawPile.draw(CARDS_PER_PLAYER);

      return player;
    });
  };

  instance.newGame = () => {
    try {
      drawPile = Deck();
      direction = GameDirections.CLOCKWISE;
      players = [];
      initPlayers();
    } catch(e) {
      instance.emit('error', e);
      return;
    }

    instance.emit('start', null, players);
  };

  process.nextTick(() => {
    init();
  });

  return instance;
};

module.exports = game;
"use strict";

const util = require('util');
const EventEmitter = require('events').EventEmitter;

const Deck = require('./deck');
const Card = require('./card');
const Values = require('./values');
const Player = require('./player');
const GameDirections = require('./game_directions');

const CARDS_PER_PLAYER = 7;

const game = function (playerNames) {
  // extends EventEmitter
  // events:
  // - start (players)
  // - cardplay (player, card)
  // - uno (player)
  // - end (winner)

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
  /**
   * Who yelled uno?
   *
   * key: player name
   * value: true/false
   */
  let yellers = {};

  let instance = Object.create(EventEmitter.prototype, {
    newGame: {
      value: function newGame() {
        drawPile = Deck();
        direction = GameDirections.CLOCKWISE;

        players.forEach(p => p.hand = drawPile.draw(CARDS_PER_PLAYER));

        // do not start with special cards (REVERSE, DRAW, etc)
        do {
          discardedCard = drawPile.draw()[0];
        } while (discardedCard.isSpecialCard());

        // select starting player
        currentPlayer = players[getRandomInt(0, players.length - 1)];
      }
    },
    getPlayer: {
      value: function (name) {
        let player = players[getPlayerIndex(name)];
        if (!player)
          return null;
        return player;
      }
    },
    getCurrentPlayer: {
      value: () => currentPlayer
    },
    getNextPlayer: {
      value: () => getNextPlayer()
    },
    getDiscardedCard: {
      value: () => discardedCard
    },
    getPlayingDirection: {
      value: () => direction
    },
    draw: {
      value: function () {
        let currentPlayer = instance.getCurrentPlayer();

        draw(currentPlayer, cardsToDraw || 1);

        drawn = true;
        // reset UNO! yell state
        yellers[currentPlayer.name] = false;

        if (cardsToDraw > 0) {
          cardsToDraw = 0;
          goToNextPlayer();
        }
      }
    },
    pass: {
      value: function pass() {
        if (cardsToDraw > 0)
          throw new Error(`There are ${cardsToDraw} cards to draw before passing`);
        if (!drawn)
          throw new Error(`${currentPlayer} must draw at least one card before passing`);

        goToNextPlayer();
      }
    },
    play: {
      value: function play(card) {
        let currentPlayer = instance.getCurrentPlayer();
        if (!card)
          return;
        // check if player has the card at hand...
        if (!currentPlayer.hasCard(card))
          throw new Error(`${currentPlayer} does not have card ${card} at hand`);
        if (card.color == null)
          throw new Error("Card must have its color set before playing");
        // check if there isn't any pendent draw amount...
        if (cardsToDraw > 0 && card.value != Values.DRAW_TWO) // TODO: can throw DRAW_TWO on WILD_DRAW_FOUR?
          throw new Error(`${currentPlayer} must draw cards`);
        // check if the played card matches the card from the discard pile...
        if (!card.matches(discardedCard))
          throw new Error(`${discardedCard}, from discard pile, does not match ${card}`);

        currentPlayer.removeCard(card);
        discardedCard = card;

        instance.emit('cardplay', null, card, currentPlayer);

        if (currentPlayer.hand.length == 0) {
          let score = calculateScore();
          // game is over, we have a winner!
          instance.emit('end', null, currentPlayer, score);
          // TODO: how to stop game after it's finished? Finished variable? >.<
          return;
        }

        switch (discardedCard.value) {
          case Values.WILD_DRAW_FOUR:
            cardsToDraw += 4;
            break;
          case Values.DRAW_TWO:
            cardsToDraw += 2;
            break;
          case Values.SKIP:
            goToNextPlayer(true);
            break;
          case Values.REVERSE:
            reverseGame();
            if (players.length == 2)
              // Reverse works like Skip
              goToNextPlayer();
            break;
        }

        goToNextPlayer();
      }
    },
    uno: {
      value: function uno(yellingPlayer) {
        yellingPlayer = yellingPlayer || instance.getCurrentPlayer();

        // the users that will draw;
        let drawingPlayers;

        // if player is the one who has 1 card, just mark as yelled
        // (he may yell UNO! before throwing his card, so he may have
        // 2 cards at hand when yelling uno)
        if (yellingPlayer.hand.length <= 2 && !yellers[yellingPlayer.name]) {
          yellers[yellingPlayer.name] = true;
          return [];
        } else {
          // else if the user has already yelled or if he has more than 2 cards...

          // is there anyone with 1 card at hand that did not yell uno?
          drawingPlayers = players.filter(p => p.hand.length == 1 && !yellers[p.name]);

          // if there isn't anyone...
          if (drawingPlayers.length == 0) {
            // the player was lying, so he will draw
            drawingPlayers = [yellingPlayer];
          }
        }

        drawingPlayers.forEach(p => draw(p, 2));

        // return who drawn
        return drawingPlayers;
      }
    }
  });

  function init() {
    players = fixPlayers(playerNames);
    instance.newGame();
  };

  function fixPlayers(playerNames) {
    if (!playerNames || !playerNames.length ||
      playerNames.length < 2 || playerNames.length > 10)
      throw new Error("There must be 2 to 10 players in the game");
    else if (findDuplicates(playerNames).length)
      throw new Error("Player names must be different");

    return playerNames.map(player => {
      if (typeof player == 'string')
        player = Player(player);

      return player;
    });
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
  function goToNextPlayer(silent) {
    drawn = false;

    currentPlayer = getNextPlayer();
    if (!silent)
      instance.emit('nextplayer', null, currentPlayer);
  }

  function reverseGame() {
    players.reverse();
    direction = direction == GameDirections.CLOCKWISE ?
      GameDirections.COUNTER_CLOCKWISE :
      GameDirections.CLOCKWISE;
  }

  function draw(player, amount) {
    if (!player)
      throw new Error('Player is mandatory');

    player.hand = player.hand.concat(drawPile.draw(amount));
  }

  function calculateScore() {
    return players
      .map(player => player.hand)
      .reduce((amount, cards) => {
        amount += cards.reduce((s, c) => s += c.score, 0);
        return amount;
      }, 0);
  }

  init();

  return instance;
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// http://stackoverflow.com/a/840812/1574059
function findDuplicates(array) {
  // expects an string array
  var uniq = array
    .map((name, idx) => {
      return { count: 1, name: name };
    })
    .reduce((a, b) => {
      a[b.name] = (a[b.name] || 0) + b.count;
      return a;
    }, {});

  var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1);

  return duplicates;
}

module.exports = game;
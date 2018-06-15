"use strict";


const util = require('util');
import { CancelableEventEmitter } from './events/cancelable-emitter';
import {
  Event,
  BeforeDrawEvent,
  DrawEvent,
  BeforePassEvent,
  BeforeCardPlayEvent,
  CardPlayEvent,
  GameEndEvent,
  NextPlayerEvent,
} from './events';

import { Card, Values } from './card';
import { Deck } from './deck';
import { GameDirections } from './game_directions';
import { Player } from './player';

const CARDS_PER_PLAYER = 7;

export type Deck = any;

export function Game (playerNames: string[], houseRules: { setup: Function }[] = []) {
  // extends CancelableEventEmitter
  // events:
  // - start (players)
  // - cardplay (card, player)
  // - uno (player)
  // - end (winner)

  let drawPile: Deck;
  let direction: GameDirections;
  let currentPlayer: Player;
  let players: Player[] = [];
  let discardedCard: Card;

  // control vars
  /**
   * The player have draw in his turn?
   */
  let drawn = false;
  /**
   * Who yelled uno?
   *
   * key: player name
   * value: true/false
   */
  const yellers: { [key: string]: boolean } = {};

  const instance = Object.create(CancelableEventEmitter.prototype, {
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
      value: function (name: string) {
        const player: Player = players[getPlayerIndex(name)];
        if (!player)
          return undefined;
        return player;
      }
    },
    currentPlayer: {
      get: () => currentPlayer,
      set: (name: string | Player) => {
        // if we received a player, extract the name from it
        if (typeof name === 'object')
          name = name.name;

        if (!name)
          throw new Error("Player name is invalid");

        const player = instance.getPlayer(name);
        if (!player)
          throw new Error("The given player does not exist");
        currentPlayer = instance.getPlayer(name);
      }
    },
    nextPlayer: {
      get: () => getNextPlayer()
    },
    discardedCard: {
      get: () => discardedCard,
      set: (card: Card) => {
        if (!card)
          return;
        if (card.color === undefined)
          throw new Error("Discarded cards cannot have theirs colors as null");

        discardedCard = card;
      }
    },
    players: {
      get: () => players
    },
    deck: {
      get: () => drawPile
    },
    playingDirection: {
      get: () => direction,
      set: dir => {
        if (dir !== GameDirections.CLOCKWISE && dir != GameDirections.COUNTER_CLOCKWISE)
          throw new Error("Invalid direction");

        if (dir !== direction)
          reverseGame();
      }
    },
    draw: {
      value: function publicDraw(player: Player, qty: number, { silent } = { silent: false }) {
        if (arguments.length == 0)
          player = instance.currentPlayer;

        qty = qty || 1;

        if (!silent && !emit(new BeforeDrawEvent(player, qty)))
          return;

        draw(player, qty);

        if (!silent && !emit(new DrawEvent(player, qty)))
          return;

        drawn = true;
        // reset UNO! yell state
        yellers[player.name] = false;
      }
    },
    pass: {
      value: function pass() {
        if (!emit(new BeforePassEvent(instance.currentPlayer)))
          return;

        if (!drawn)
          throw new Error(`${currentPlayer} must draw at least one card before passing`);

        goToNextPlayer();
      }
    },
    play: {
      value: function play(card: Card, { silent } = { silent: false }) {
        const currentPlayer = instance.currentPlayer;
        if (!card)
          return;
        // check if player has the card at hand...
        if (!currentPlayer.hasCard(card))
          throw new Error(`${currentPlayer} does not have card ${card} at hand`);

        if (!silent && !emit(new BeforeCardPlayEvent(card, instance.currentPlayer)))
          return;

        if (card.color == undefined)
          throw new Error("Card must have its color set before playing");
        // check if the played card matches the card from the discard pile...
        if (!card.matches(discardedCard))
          throw new Error(`${discardedCard}, from discard pile, does not match ${card}`);

        currentPlayer.removeCard(card);
        discardedCard = card;

        if (!silent && !emit(new CardPlayEvent(card, currentPlayer)))
          return;

        if (currentPlayer.hand.length == 0) {
          const score = calculateScore();
          // game is over, we have a winner!
          emit(new GameEndEvent(currentPlayer, score));
          // TODO: how to stop game after it's finished? Finished variable? >.<
          return;
        }

        switch (discardedCard.value) {
          case Values.WILD_DRAW_FOUR:
            draw(getNextPlayer(), 4);
            goToNextPlayer(true);
            break;
          case Values.DRAW_TWO:
            draw(getNextPlayer(), 2);
            goToNextPlayer(true);
            break;
          case Values.SKIP:
            goToNextPlayer(true);
            break;
          case Values.REVERSE:
            reverseGame();
            if (players.length == 2)
              // Reverse works like Skip
              goToNextPlayer(true);
            break;
        }

        goToNextPlayer();
      }
    },
    uno: {
      value: function uno(yellingPlayer: Player) {
        yellingPlayer = yellingPlayer || instance.currentPlayer;

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
    houseRules.forEach(rule => rule.setup(instance));
    instance.newGame();
  }

  function fixPlayers(playerNames: string[]) {
    if (!playerNames || !playerNames.length ||
      playerNames.length < 2 || playerNames.length > 10)
      throw new Error("There must be 2 to 10 players in the game");
    else if (findDuplicates(playerNames).length)
      throw new Error("Player names must be different");

    return playerNames.map(player => {
      return new Player(player);
    });
  }

  function getNextPlayer() {
    let idx = getPlayerIndex(currentPlayer);

    if (++idx == players.length)
      idx = 0;

    return players[idx];
  }

  function getPlayerIndex(playerName: string | Player) {
    if (typeof playerName !== 'string')
      playerName = playerName.name;

    return players.map(p => p.name).indexOf(playerName);
  }

  /**
   * Set current player to the next in the line,
   * with no validations, reseting all per-turn controllers
   * (`draw`, ...)
   */
  function goToNextPlayer(silent?: boolean) {
    drawn = false;

    currentPlayer = getNextPlayer();
    if (!silent)
      emit(new NextPlayerEvent(currentPlayer));
  }

  function reverseGame() {
    players.reverse();
    direction = direction == GameDirections.CLOCKWISE ?
      GameDirections.COUNTER_CLOCKWISE :
      GameDirections.CLOCKWISE;
  }

  function draw(player: Player, amount: number) {
    if (!player)
      throw new Error('Player is mandatory');

    // console.log(`draw ${amount} to ${player}`);

    player.hand = player.hand.concat(drawPile.draw(amount));
  }

  function calculateScore() {
    return players
      .map(player => player.hand)
      .reduce((amount, cards) => {
        amount += cards.reduce((s: number, c: Card) => s += c.score, 0);
        return amount;
      }, 0);
  }

  /**
   * @param {Event} event
   */
  function emit(event: Event) {
    let result = false;
    try {
      result = instance.dispatchEvent.call(instance, event);
    } catch (error) {
      // console.error('\t[event error]', eventName, '::', error.message);
      throw error;
    }
    return result;
  }

  init();

  return instance;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// https://stackoverflow.com/a/24968449/1574059
function findDuplicates(array: string[]) {
  type SingleWord = { count: number; name: string; };
  type WordCount = { [key: string]: number };

  // expects an string array
  const uniq: WordCount = array
    .map((name, idx) => {
      return { count: 1, name: name };
    })
    .reduce((a: WordCount, b: SingleWord) => {
      a[b.name] = (a[b.name] || 0) + b.count;
      return a;
    }, {});

  const duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1);

  return duplicates;
}

function isObject(val: any) {
  return val !== null && typeof val === 'object';
}
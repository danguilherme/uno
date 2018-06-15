import {
  Event,
  CancelableEventEmitter,
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

export class Game extends CancelableEventEmitter {
  // events:
  // - start (players)
  // - cardplay (card, player)
  // - uno (player)
  // - end (winner)

  private drawPile: Deck;
  private direction: GameDirections;
  private _currentPlayer: Player;
  private _players: Player[] = [];
  private _discardedCard: Card;

  // control vars
  /**
   * The player have draw in his turn?
   */
  private drawn = false;
  /**
   * Who yelled uno?
   *
   * key: player name
   * value: true/false
   */
  private yellers: { [key: string]: boolean } = {};

  constructor(playerNames: string[], houseRules: { setup: Function }[] = []) {
    super();

    this._players = this.fixPlayers(playerNames);
    houseRules.forEach(rule => rule.setup(this));
    this.newGame();
  }

  newGame() {
    this.drawPile = new Deck();
    this.direction = GameDirections.CLOCKWISE;

    this._players.forEach(p => (p.hand = this.drawPile.draw(CARDS_PER_PLAYER)));

    // do not start with special cards (REVERSE, DRAW, etc)
    do {
      this._discardedCard = this.drawPile.draw()[0];
    } while (this._discardedCard.isSpecialCard());

    // select starting player
    this._currentPlayer = this._players[
      getRandomInt(0, this._players.length - 1)
    ];
  }

  getPlayer(name: string) {
    const player: Player = this._players[this.getPlayerIndex(name)];
    if (!player) return undefined;
    return player;
  }

  get currentPlayer(): Player {
    return this._currentPlayer;
  }

  set currentPlayer(player: Player) {
    player = this.getPlayer(player.name);
    if (!player) throw new Error('The given player does not exist');

    this._currentPlayer = player;
  }

  get nextPlayer() {
    return this.getNextPlayer();
  }

  get discardedCard() {
    return this._discardedCard;
  }

  set discardedCard(card: Card) {
    if (!card) return;
    if (card.color === undefined || card.color === null)
      throw new Error('Discarded cards cannot have theirs colors as null');

    this._discardedCard = card;
  }

  get players() {
    return this._players;
  }

  get deck() {
    return this.drawPile;
  }

  get playingDirection() {
    return this.direction;
  }

  set playingDirection(dir: GameDirections) {
    if (
      dir !== GameDirections.CLOCKWISE &&
      dir != GameDirections.COUNTER_CLOCKWISE
    )
      throw new Error('Invalid direction');

    if (dir !== this.direction) this.reverseGame();
  }

  public draw(player?: Player, qty?: number, { silent } = { silent: false }) {
    if (arguments.length == 0) player = this._currentPlayer;

    qty = qty || 1;

    if (!silent && !this.dispatchEvent(new BeforeDrawEvent(player, qty)))
      return;

    this.privateDraw(player, qty);

    if (!silent && !this.dispatchEvent(new DrawEvent(player, qty))) return;

    this.drawn = true;
    // reset UNO! yell state
    this.yellers[player.name] = false;
  }

  pass() {
    if (!this.dispatchEvent(new BeforePassEvent(this._currentPlayer))) return;

    if (!this.drawn)
      throw new Error(
        `${this._currentPlayer} must draw at least one card before passing`,
      );

    this.goToNextPlayer();
  }

  play(card: Card, { silent } = { silent: false }) {
    const currentPlayer = this._currentPlayer;
    if (!card) return;
    // check if player has the card at hand...
    if (!currentPlayer.hasCard(card))
      throw new Error(`${currentPlayer} does not have card ${card} at hand`);

    if (
      !silent &&
      !this.dispatchEvent(new BeforeCardPlayEvent(card, this._currentPlayer))
    )
      return;

    if (card.color == undefined)
      throw new Error('Card must have its color set before playing');
    // check if the played card matches the card from the discard pile...
    if (!card.matches(this._discardedCard))
      throw new Error(
        `${this._discardedCard}, from discard pile, does not match ${card}`,
      );

    currentPlayer.removeCard(card);
    this._discardedCard = card;

    if (
      !silent &&
      !this.dispatchEvent(new CardPlayEvent(card, this._currentPlayer))
    )
      return;

    if (currentPlayer.hand.length == 0) {
      const score = this.calculateScore();
      // game is over, we have a winner!
      this.dispatchEvent(new GameEndEvent(this._currentPlayer, score));
      // TODO: how to stop game after it's finished? Finished variable? >.<
      return;
    }

    switch (this._discardedCard.value) {
      case Values.WILD_DRAW_FOUR:
        this.privateDraw(this.getNextPlayer(), 4);
        this.goToNextPlayer(true);
        break;
      case Values.DRAW_TWO:
        this.privateDraw(this.getNextPlayer(), 2);
        this.goToNextPlayer(true);
        break;
      case Values.SKIP:
        this.goToNextPlayer(true);
        break;
      case Values.REVERSE:
        this.reverseGame();
        if (this._players.length == 2)
          // Reverse works like Skip
          this.goToNextPlayer(true);
        break;
    }

    this.goToNextPlayer();
  }

  uno(yellingPlayer?: Player) {
    yellingPlayer = yellingPlayer || this._currentPlayer;

    // the users that will draw;
    let drawingPlayers;

    // if player is the one who has 1 card, just mark as yelled
    // (he may yell UNO! before throwing his card, so he may have
    // 2 cards at hand when yelling uno)
    if (yellingPlayer.hand.length <= 2 && !this.yellers[yellingPlayer.name]) {
      this.yellers[yellingPlayer.name] = true;
      return [];
    } else {
      // else if the user has already yelled or if he has more than 2 cards...

      // is there anyone with 1 card at hand that did not yell uno?
      drawingPlayers = this._players.filter(
        p => p.hand.length == 1 && !this.yellers[p.name],
      );

      // if there isn't anyone...
      if (drawingPlayers.length == 0) {
        // the player was lying, so he will draw
        drawingPlayers = [yellingPlayer];
      }
    }

    drawingPlayers.forEach(p => this.privateDraw(p, 2));

    // return who drawn
    return drawingPlayers;
  }

  fixPlayers(playerNames: string[]) {
    if (
      !playerNames ||
      !playerNames.length ||
      playerNames.length < 2 ||
      playerNames.length > 10
    )
      throw new Error('There must be 2 to 10 players in the game');
    else if (findDuplicates(playerNames).length)
      throw new Error('Player names must be different');

    return playerNames.map(player => {
      return new Player(player);
    });
  }

  getNextPlayer() {
    let idx = this.getPlayerIndex(this._currentPlayer);

    if (++idx == this._players.length) idx = 0;

    return this._players[idx];
  }

  getPlayerIndex(playerName: string | Player) {
    if (typeof playerName !== 'string') playerName = playerName.name;

    return this._players.map(p => p.name).indexOf(playerName);
  }

  /**
   * Set current player to the next in the line,
   * with no validations, reseting all per-turn controllers
   * (`draw`, ...)
   */
  goToNextPlayer(silent?: boolean) {
    this.drawn = false;

    this._currentPlayer = this.getNextPlayer();
    if (!silent) this.dispatchEvent(new NextPlayerEvent(this._currentPlayer));
  }

  reverseGame() {
    this._players.reverse();
    this.direction =
      this.direction == GameDirections.CLOCKWISE
        ? GameDirections.COUNTER_CLOCKWISE
        : GameDirections.CLOCKWISE;
  }

  private privateDraw(player: Player, amount: number) {
    if (!player) throw new Error('Player is mandatory');

    // console.log(`draw ${amount} to ${player}`);

    player.hand = player.hand.concat(this.drawPile.draw(amount));
  }

  calculateScore() {
    return this._players.map(player => player.hand).reduce((amount, cards) => {
      amount += cards.reduce((s: number, c: Card) => (s += c.score), 0);
      return amount;
    }, 0);
  }
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
  type SingleWord = { count: number; name: string };
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

  const duplicates = Object.keys(uniq).filter(a => uniq[a] > 1);

  return duplicates;
}

function isObject(val: any) {
  return val !== null && typeof val === 'object';
}

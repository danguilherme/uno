'use strict';

const Game = require('../src/game');
const Card = require('../src/card');
const Values = require('../src/values');
const Colors = require('../src/colors');
const GameDirections = require('../src/game_directions');

describe('Game', function() {
  it('should have a public API', function() {
    let game = Game(['Guilherme', 'Maria']);

    expect(game).toHaveProperty('on');
    expect(typeof game.on).toBe('function');
    expect(game).toHaveProperty('newGame');
    expect(typeof game.newGame).toBe('function');
    expect(game).toHaveProperty('getPlayer');
    expect(typeof game.getPlayer).toBe('function');
    expect(game).toHaveProperty('deck');
    expect(game).toHaveProperty('currentPlayer');
    expect(game).toHaveProperty('players');
    expect(game).toHaveProperty('nextPlayer');
    expect(game).toHaveProperty('discardedCard');
    expect(game).toHaveProperty('playingDirection');
    expect(game).toHaveProperty('play');
    expect(typeof game.play).toBe('function');
    expect(game).toHaveProperty('draw');
    expect(typeof game.draw).toBe('function');
    expect(game).toHaveProperty('pass');
    expect(typeof game.pass).toBe('function');
    expect(game).toHaveProperty('uno');
    expect(typeof game.uno).toBe('function');
  });

  it('should error if started with less than 2 players', function() {
    expect(() => Game(['Guilherme'])).throw;
  });

  it('should error if started with more than 10 players', function() {
    expect(() =>
      Game([
        'Player 0',
        'Player 1',
        'Player 2',
        'Player 3',
        'Player 4',
        'Player 5',
        'Player 6',
        'Player 7',
        'Player 8',
        'Player 9',
        'Excess',
      ]),
    ).throw;
  });

  it('should error if player names repeat', function() {
    expect(() => Game(['Player 0', 'Player 0'])).throw;
  });

  it('should not start with a wild card', function() {
    let game = null;
    expect(
      () => (game = Game(['Player 1', 'Player 2', 'Player 3', 'Player 4'])),
    ).not.throw;

    expect(game.discardedCard.isWildCard()).toBe(false);
  });

  it('should start', function() {
    expect(() => Game(['Guilherme', 'Thamy Top', 'André Marques'])).not.throw;
  });

  describe('with more than two players', function() {
    let game = null;

    beforeEach(function() {
      game = Game(['Player 1', 'Player 2', 'Player 3']);
      game.newGame();
    });

    describe('#play()', function() {
      it('should throw if user does not have the played card in hand', function() {
        let curr = game.currentPlayer;

        curr.hand = [Card(Values.ZERO, Colors.RED)];

        expect(_ => game.play(Card(Values.EIGHT, Colors.BLUE))).throw;
      });

      it('should throw if the card on discard pile does not match with played card', function() {
        const curr = game.currentPlayer;
        const discardedCard = game.discardedCard;

        const blueZero = Card(Values.ZERO, Colors.BLUE);
        const redOne = Card(Values.ONE, Colors.RED);

        const playerCard = discardedCard.matches(blueZero) ? redOne : blueZero;

        curr.hand = [playerCard];

        expect(playerCard.matches(discardedCard)).toBe(false);
        expect(_ => game.play(playerCard)).throw;

        // don't touch player's hand
        expect(curr.hand).toHaveLength(1);
      });

      it('should throw if the played wild card does not have a color set', function() {
        let curr = game.currentPlayer;
        let discardedCard = game.discardedCard;
        let playerCard = Card(Values.WILD);

        curr.hand = [playerCard];

        expect(_ => game.play(playerCard)).throw;
      });

      it('should remove played card from player hand', function() {
        let curr = game.currentPlayer;
        let discardedCard = game.discardedCard;
        let playerCard = Card(
          discardedCard.value,
          discardedCard.color == Colors.BLUE ? Colors.RED : Colors.BLUE,
        );

        curr.hand = [playerCard];

        expect(playerCard.matches(discardedCard)).toBe(true);

        expect(_ => game.play(playerCard)).not.throw;
        expect(curr.hand).toHaveLength(0);
        expect(curr.hand).not.toContain(playerCard);
        expect(curr.hand.indexOf(playerCard)).toBe(-1);

        // discarded card must be equal to player card now
        expect(game.discardedCard.color.is(playerCard.color)).toBe(true);
        expect(game.discardedCard.value.is(playerCard.value)).toBe(true);
      });

      it('should pass turn to next player', function() {
        let curr = game.currentPlayer;
        let discardedCard = game.discardedCard;
        let playerCard = Card(
          discardedCard.value,
          discardedCard.color == Colors.BLUE ? Colors.RED : Colors.BLUE,
        );

        curr.hand = [playerCard, playerCard];

        expect(playerCard.matches(discardedCard)).toBe(true);

        expect(game.currentPlayer.name).toBe(curr.name);
        expect(_ => game.play(playerCard)).not.throw;
        expect(game.currentPlayer.name).not.toBe(curr.name);
      });

      it('should accept WILD cards no matter their colors', function() {
        let curr = game.currentPlayer;
        let discardedCard = game.discardedCard;
        let wildCard = Card(
          Values.WILD,
          discardedCard.color == Colors.RED ? Colors.BLUE : Colors.RED,
        );

        curr.hand = [wildCard];

        expect(wildCard.matches(discardedCard)).toBe(true);
        expect(_ => game.play(wildCard)).not.throw;

        curr = game.currentPlayer;
        discardedCard = game.discardedCard;
        wildCard = Card(
          Values.WILD_DRAW_FOUR,
          discardedCard.color == Colors.RED ? Colors.BLUE : Colors.RED,
        );

        curr.hand = [wildCard];

        expect(wildCard.matches(discardedCard)).toBe(true);
        expect(_ => game.play(wildCard)).not.throw;
      });

      it('should skip next player if thrown SKIP', function() {
        const curr = game.currentPlayer;
        const next = game.nextPlayer;
        const discardedCard = game.discardedCard;
        const skip = Card(Values.SKIP, discardedCard.color);

        curr.hand = [skip, skip];

        expect(game.currentPlayer.name).toBe(curr.name);
        expect(_ => game.play(skip)).not.throw;
        expect(game.currentPlayer).not.toBe(next);
        expect(game.currentPlayer).not.toBe(curr);
      });

      it('should change the playing direction if thrown REVERSE', function() {
        const curr = game.currentPlayer;
        const next = game.nextPlayer;
        const discardedCard = game.discardedCard;
        const reverse = Card(Values.REVERSE, discardedCard.color);

        curr.hand = [reverse, reverse];

        expect(game.currentPlayer.name).toBe(curr.name);
        expect(_ => game.play(reverse)).not.throw;
        expect(game.currentPlayer).not.toBe(next);
        expect(game.currentPlayer).not.toBe(curr);
      });

      it('should add 2 cards to next player after a DRAW TWO', function() {
        const curr = game.currentPlayer;
        const next = game.nextPlayer;
        const oldLength = next.hand.length;
        const discardedCard = game.discardedCard;

        const drawTwo = Card(Values.DRAW_TWO, discardedCard.color);
        const reverse = Card(Values.REVERSE, discardedCard.color);

        curr.hand = [drawTwo, drawTwo];

        expect(_ => game.play(drawTwo)).not.throw;

        expect(game.currentPlayer).not.toBe(curr);
        expect(game.currentPlayer).not.toBe(next);
        expect(game.nextPlayer).toBe(curr);
        expect(next.hand.length).toBe(oldLength + 2);
      });
    });

    describe('#pass()', function() {
      it('should throw if player did not draw before passing', function() {
        expect(game.pass).throw;
        expect(game.draw).not.throw;
        expect(game.pass).not.throw;
        expect(game.pass).throw;
      });

      it('should pass the play to the next player', function() {
        let curr = game.currentPlayer;
        game.draw();
        expect(game.currentPlayer.name).toBe(curr.name);
        expect(game.pass).not.throw;
        expect(game.currentPlayer.name).not.toBe(curr.name);
      });
    });

    describe('#draw()', function() {
      it(
        'should pass to next player if draw card was at place (draw two, wild draw four)',
      );
      it('should add a card to player hand');
    });

    describe('#uno()', function() {
      it('should make "UNO" yeller to draw 2 cards if there isn\'t any player with 1 card', function() {
        let currentPlayer = game.currentPlayer;

        expect(currentPlayer.hand).toHaveLength(7);
        game.uno();
        expect(currentPlayer.hand).toHaveLength(9);
      });

      it('should make user with 1 card that not yelled UNO! to draw 2 cards', function() {
        let curr = game.currentPlayer;
        let discardedCard = game.discardedCard;
        let drawTwo = Card(Values.DRAW_TWO, discardedCard.color);
        let reverse = Card(Values.REVERSE, discardedCard.color);

        curr.hand = [reverse, drawTwo];

        expect(_ => game.play(reverse)).not.throw;
        expect(curr.hand).toHaveLength(1);

        discardedCard = game.discardedCard;

        game.uno();
        expect(curr.hand).toHaveLength(3);
      });

      it('should not make user draw if he has already drawn', function() {
        let curr = game.currentPlayer;
        let discardedCard = game.discardedCard;
        let drawTwo = Card(Values.DRAW_TWO, discardedCard.color);
        let reverse = Card(Values.REVERSE, discardedCard.color);

        curr.hand = [reverse, drawTwo];

        expect(_ => game.play(reverse)).not.throw;
        expect(curr.hand).toHaveLength(1);

        game.uno();
        expect(curr.hand).toHaveLength(3);

        game.uno();
        // the other player has already drawn, this player will draw now
        expect(game.currentPlayer.hand).toHaveLength(9);
      });

      it('should not make user draw if he has already yelled UNO!', function() {
        let curr = game.currentPlayer;
        let discardedCard = game.discardedCard;
        let drawTwo = Card(Values.DRAW_TWO, discardedCard.color);
        let reverse = Card(Values.REVERSE, discardedCard.color);

        curr.hand = [reverse, drawTwo];
        game.uno();

        expect(_ => game.play(reverse)).not.throw;
        expect(curr.hand).toHaveLength(1);

        game.uno();
        // the other player has already yelled UNO!, this player will draw now
        expect(game.currentPlayer.hand).toHaveLength(9);
      });
    });
  });

  describe('with two players', function() {
    let game = null;

    beforeEach(function() {
      game = Game(['Player 1', 'Player 2']);
    });

    describe('#play()', function() {
      it('should maintain current player turn when played REVERSE', function() {
        let curr = game.currentPlayer;
        let discardedCard = game.discardedCard;
        let reverse = Card(Values.REVERSE, discardedCard.color);

        curr.hand = [reverse];

        expect(game.currentPlayer).toBe(curr);
        expect(_ => game.play(reverse)).not.throw;
        expect(game.currentPlayer).toBe(curr);
      });
    });

    describe('#pass()', function() {
      // TODO: check rules for this
      it('should allow user to pass after throwing a REVERSE card');
    });
  });

  describe('setting game state', function() {
    let game = null;

    beforeEach(function() {
      game = Game(['Player 1', 'Player 2']);
    });

    describe('#currentPlayer', function() {
      it('should change current player', function() {
        let player = game.nextPlayer;
        expect(_ => (game.currentPlayer = player)).not.throw;
        expect(game.currentPlayer.name).toBe(player.name);

        player = game.nextPlayer;
        expect(_ => (game.currentPlayer = player.name)).not.throw;
        expect(game.currentPlayer.name).toBe(player.name);
      });

      it('should not change current player if not existent', function() {
        let originalPlayer = game.currentPlayer.name;
        expect(_ => (game.currentPlayer = 'Player 1024')).throw;
        expect(game.currentPlayer.name).toBe(originalPlayer);
      });
    });

    describe('#discardedCard', function() {
      it('should change discarded card', function() {
        expect(_ => (game.discardedCard = Card(Values.ZERO, Colors.RED))).not
          .throw;
        expect(game.discardedCard.value).toBe(Values.ZERO);
        expect(game.discardedCard.color).toBe(Colors.RED);
      });

      it('should not change discarded card to card with no color', function() {
        let originalCard = game.discardedCard;
        expect(_ => (game.discardedCard = Card(Values.WILD, null))).throw;
        expect(game.discardedCard.value).toBe(originalCard.value);
        expect(game.discardedCard.color).toBe(originalCard.color);
      });

      it('should not change discarded card to invalid Card object', function() {
        let originalCard = game.discardedCard;
        expect(_ => (game.discardedCard = 'RED ZERO')).throw;
        expect(game.discardedCard.value).toBe(originalCard.value);
        expect(game.discardedCard.color).toBe(originalCard.color);
      });
    });

    describe('#playingDirection', function() {
      it('should change gameplay direction', function() {
        expect(_ => (game.playingDirection = 'right')).throw;
        expect(game.playingDirection).toBe(GameDirections.CLOCKWISE);

        expect(_ => (game.playingDirection = GameDirections.COUNTER_CLOCKWISE))
          .not.throw;
        expect(game.playingDirection).toBe(GameDirections.COUNTER_CLOCKWISE);
      });
    });
  });
});

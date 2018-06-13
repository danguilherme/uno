"use strict";

const should = require('chai').should();

const Game = require('../src/game');
const Card = require('../src/card');
const Values = require('../src/values');
const Colors = require('../src/colors');
const GameDirections = require('../src/game_directions');

describe('Game', function () {

  it('should have a public API', function () {
    let game = Game(["Guilherme", "Maria"]);

    game.should.respondTo('on');
    game.should.respondTo('newGame');
    game.should.respondTo('getPlayer');
    game.should.have.property('currentPlayer');
    game.should.have.property('nextPlayer');
    game.should.have.property('discardedCard');
    game.should.have.property('playingDirection');
    game.should.respondTo('play');
    game.should.respondTo('draw');
    game.should.respondTo('pass');
    game.should.respondTo('uno');
  });

  it('should error if started with less than 2 players', function () {
    should.throw(() => Game(["Guilherme"]));
  });

  it('should error if started with more than 10 players', function () {
    should.throw(() => Game([
      "Player 0", "Player 1", "Player 2", "Player 3", "Player 4",
      "Player 5", "Player 6", "Player 7", "Player 8", "Player 9", "Excess"]));
  });

  it('should error if player names repeat', function () {
    should.throw(() => Game(["Player 0", "Player 0"]));
  });

  it('should not start with a wild card', function () {
    let game = null;
    should.not.throw(() => game = Game(["Player 1", "Player 2", "Player 3", "Player 4"]));

    game.discardedCard.isWildCard().should.be.false;
  });

  it('should start', function () {
    should.not.throw(() => Game(["Guilherme", "Thamy Top", "André Marques"]));
  });

  describe("with more than two players", function () {
    let game = null;

    beforeEach(function () {
      game = Game(["Player 1", "Player 2", "Player 3"]);
      game.newGame();
    });

    describe("#play()", function () {
      it('should throw if user does not have the played card in hand', function () {
        let curr = game.currentPlayer;

        curr.hand = [
          Card(Values.ZERO, Colors.RED)
        ];

        should.throw(_ => game.play(Card(Values.EIGHT, Colors.BLUE)));
      });

      it('should throw if the card on discard pile does not match with played card', function () {
        const curr = game.currentPlayer;
        const discardedCard = game.discardedCard;

        const blueZero = Card(Values.ZERO, Colors.BLUE);
        const redOne = Card(Values.ONE, Colors.RED);

        const playerCard = discardedCard.matches(blueZero) ? redOne : blueZero;

        curr.hand = [playerCard];

        playerCard.matches(discardedCard).should.be.false;
        should.throw(_ => game.play(playerCard));

        // don't touch player's hand
        curr.hand.should.have.length(1);
      });

      it('should throw if the played wild card does not have a color set', function () {
        let curr = game.currentPlayer;
        let discardedCard = game.discardedCard;
        let playerCard = Card(Values.WILD);

        curr.hand = [playerCard];

        should.throw(_ => game.play(playerCard));
      });

      it('should remove played card from player hand', function () {
        let curr = game.currentPlayer;
        let discardedCard = game.discardedCard;
        let playerCard = Card(discardedCard.value,
          discardedCard.color == Colors.BLUE ? Colors.RED : Colors.BLUE);

        curr.hand = [playerCard];

        playerCard.matches(discardedCard).should.be.true;

        should.not.throw(_ => game.play(playerCard));
        curr.hand.should.have.length(0);
        curr.hand.should.not.contain(playerCard);
        curr.hand.indexOf(playerCard).should.equal(-1);

        // discarded card must be equal to player card now
        game.discardedCard.color.is(playerCard.color).should.be.true;
        game.discardedCard.value.is(playerCard.value).should.be.true;
      });

      it('should pass turn to next player', function () {
        let curr = game.currentPlayer;
        let discardedCard = game.discardedCard;
        let playerCard = Card(discardedCard.value,
          discardedCard.color == Colors.BLUE ? Colors.RED : Colors.BLUE);

        curr.hand = [playerCard, playerCard];

        playerCard.matches(discardedCard).should.be.true;

        game.currentPlayer.name.should.equal(curr.name);
        should.not.throw(_ => game.play(playerCard));
        game.currentPlayer.name.should.not.equal(curr.name);
      });

      it('should accept WILD cards no matter their colors', function () {
        let curr = game.currentPlayer;
        let discardedCard = game.discardedCard;
        let wildCard = Card(Values.WILD,
          discardedCard.color == Colors.RED ? Colors.BLUE : Colors.RED
        );

        curr.hand = [wildCard];

        wildCard.matches(discardedCard).should.be.true;
        should.not.throw(_ => game.play(wildCard));

        curr = game.currentPlayer;
        discardedCard = game.discardedCard;
        wildCard = Card(Values.WILD_DRAW_FOUR,
          discardedCard.color == Colors.RED ? Colors.BLUE : Colors.RED
        );

        curr.hand = [wildCard];

        wildCard.matches(discardedCard).should.be.true;
        should.not.throw(_ => game.play(wildCard));
      });

      it('should skip next player if thrown SKIP', function () {
        const curr = game.currentPlayer;
        const next = game.nextPlayer;
        const discardedCard = game.discardedCard;
        const skip = Card(Values.SKIP, discardedCard.color);

        curr.hand = [skip, skip];

        game.currentPlayer.name.should.equal(curr.name);
        should.not.throw(_ => game.play(skip));
        game.currentPlayer.should.not.equal(next);
        game.currentPlayer.should.not.equal(curr);
      });

      it('should change the playing direction if thrown REVERSE', function () {
        const curr = game.currentPlayer;
        const next = game.nextPlayer;
        const discardedCard = game.discardedCard;
        const reverse = Card(Values.REVERSE, discardedCard.color);

        curr.hand = [reverse, reverse];

        game.currentPlayer.name.should.equal(curr.name);
        should.not.throw(_ => game.play(reverse));
        game.currentPlayer.should.not.equal(next);
        game.currentPlayer.should.not.equal(curr);
      });

      it('should add 2 cards to next player after a DRAW TWO', function () {
        const curr = game.currentPlayer;
        const next = game.nextPlayer;
        const oldLength = next.hand.length;
        const discardedCard = game.discardedCard;

        const drawTwo = Card(Values.DRAW_TWO, discardedCard.color);
        const reverse = Card(Values.REVERSE, discardedCard.color);

        curr.hand = [drawTwo, drawTwo];

        should.not.throw(_ => game.play(drawTwo));

        game.currentPlayer.should.not.equal(curr);
        game.currentPlayer.should.not.equal(next);
        game.nextPlayer.should.equal(curr);
        next.hand.length.should.equal(oldLength + 2);
      });
    });

    describe('#pass()', function () {
      it('should throw if player did not draw before passing', function () {
        should.throw(game.pass);
        should.not.throw(game.draw);
        should.not.throw(game.pass);
        should.throw(game.pass);
      });

      it('should pass the play to the next player', function () {
        let curr = game.currentPlayer;
        game.draw();
        game.currentPlayer.name.should.equal(curr.name);
        should.not.throw(game.pass);
        game.currentPlayer.name.should.not.equal(curr.name);
      });
    });

    describe('#draw()', function () {
      it('should pass to next player if draw card was at place (draw two, wild draw four)');
      it('should add a card to player hand');
    });

    describe('#uno()', function () {
      it('should make "UNO" yeller to draw 2 cards if there isn\'t any player with 1 card', function () {
        let currentPlayer = game.currentPlayer;

        currentPlayer.hand.should.have.length(7);
        game.uno();
        currentPlayer.hand.should.have.length(9);
      });

      it('should make user with 1 card that not yelled UNO! to draw 2 cards', function () {
        let curr = game.currentPlayer;
        let discardedCard = game.discardedCard;
        let drawTwo = Card(Values.DRAW_TWO, discardedCard.color);
        let reverse = Card(Values.REVERSE, discardedCard.color);

        curr.hand = [reverse, drawTwo];

        should.not.throw(_ => game.play(reverse));
        curr.hand.should.have.length(1);

        discardedCard = game.discardedCard;

        game.uno();
        curr.hand.should.have.length(3);
      });

      it('should not make user draw if he has already drawn', function () {
        let curr = game.currentPlayer;
        let discardedCard = game.discardedCard;
        let drawTwo = Card(Values.DRAW_TWO, discardedCard.color);
        let reverse = Card(Values.REVERSE, discardedCard.color);

        curr.hand = [reverse, drawTwo];

        should.not.throw(_ => game.play(reverse));
        curr.hand.should.have.length(1);

        game.uno();
        curr.hand.should.have.length(3);

        game.uno();
        // the other player has already drawn, this player will draw now
        game.currentPlayer.hand.should.have.length(9);
      });

      it('should not make user draw if he has already yelled UNO!', function () {
        let curr = game.currentPlayer;
        let discardedCard = game.discardedCard;
        let drawTwo = Card(Values.DRAW_TWO, discardedCard.color);
        let reverse = Card(Values.REVERSE, discardedCard.color);

        curr.hand = [reverse, drawTwo];
        game.uno();

        should.not.throw(_ => game.play(reverse));
        curr.hand.should.have.length(1);

        game.uno();
        // the other player has already yelled UNO!, this player will draw now
        game.currentPlayer.hand.should.have.length(9);
      });
    });
  });

  describe("with two players", function () {
    let game = null;

    beforeEach(function () {
      game = Game(["Player 1", "Player 2"]);
    });

    describe('#play()', function () {
      it('should maintain current player turn when played REVERSE', function () {
        let curr = game.currentPlayer;
        let discardedCard = game.discardedCard;
        let reverse = Card(Values.REVERSE, discardedCard.color);

        curr.hand = [reverse];

        game.currentPlayer.should.equal(curr);
        should.not.throw(_ => game.play(reverse));
        game.currentPlayer.should.equal(curr);
      });
    });

    describe('#pass()', function () {
      // TODO: check rules for this
      it('should allow user to pass after throwing a REVERSE card');
    });
  });

  describe("setting game state", function () {
    let game = null;

    beforeEach(function () {
      game = Game(["Player 1", "Player 2"]);
    });

    describe('#currentPlayer', function () {
      it('should change current player', function () {
        let player = game.nextPlayer;
        should.not.throw(_ => game.currentPlayer = player);
        game.currentPlayer.name.should.equal(player.name);

        player = game.nextPlayer;
        should.not.throw(_ => game.currentPlayer = player.name);
        game.currentPlayer.name.should.equal(player.name);
      });

      it('should not change current player if not existent', function () {
        let originalPlayer = game.currentPlayer.name;
        should.throw(_ => game.currentPlayer = "Player 1024");
        game.currentPlayer.name.should.equal(originalPlayer);
      });
    });

    describe('#discardedCard', function () {
      it('should change discarded card', function () {
        should.not.throw(_ => game.discardedCard = Card(Values.ZERO, Colors.RED));
        game.discardedCard.value.should.equal(Values.ZERO);
        game.discardedCard.color.should.equal(Colors.RED);
      });

      it('should not change discarded card to card with no color', function () {
        let originalCard = game.discardedCard;
        should.throw(_ => game.discardedCard = Card(Values.WILD, null));
        game.discardedCard.value.should.equal(originalCard.value);
        game.discardedCard.color.should.equal(originalCard.color);
      });

      it('should not change discarded card to invalid Card object', function () {
        let originalCard = game.discardedCard;
        should.throw(_ => game.discardedCard = "RED ZERO");
        game.discardedCard.value.should.equal(originalCard.value);
        game.discardedCard.color.should.equal(originalCard.color);
      });
    });

    describe('#playingDirection', function () {
      it('should change gameplay direction', function () {
        should.throw(_ => game.playingDirection = "right");
        game.playingDirection.should.equal(GameDirections.CLOCKWISE);

        should.not.throw(_ => game.playingDirection = GameDirections.COUNTER_CLOCKWISE);
        game.playingDirection.should.equal(GameDirections.COUNTER_CLOCKWISE);
      });
    });
  });
});

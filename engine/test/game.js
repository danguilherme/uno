"use strict";

const should = require('chai').should();
const Game = require('../game');
const Card = require('../card');
const Values = require('../values');
const Colors = require('../colors');

describe('Game', function () {

  it('should have a public API', function () {
    let game = Game(["Guilherme", "Maria"]);

    game.should.respondTo('on');
    game.should.respondTo('newGame');
    game.should.respondTo('getPlayer');
    game.should.respondTo('getCurrentPlayer');
    game.should.respondTo('getNextPlayer');
    game.should.respondTo('getDiscardedCard');
    game.should.respondTo('getPlayingDirection');
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

    game.getDiscardedCard().isWildCard().should.be.false;
  });

  it('should start', function () {
    should.not.throw(() => Game(["Guilherme", "Thamy Top", "André Marques"]));
  });

  describe("with more than two players", function () {
    let game = null;

    beforeEach(function () {
      game = Game(["Player 1", "Player 2", "Player 3", "Player 4"]);
    });

    describe("#play()", function () {
      it('should throw if user does not have the played card in hand', function () {
        let curr = game.getCurrentPlayer();

        curr.hand = [
          Card(Values.ZERO, Colors.RED)
        ];

        should.throw(_ => game.play(Card(Values.EIGHT, Colors.BLUE)));
      });

      it.only('should throw if the card on discard pile does not match with played card', function () {
        const curr = game.getCurrentPlayer();
        const discardedCard = game.getDiscardedCard();

        const blueZero = Card(Values.ZERO, Colors.BLUE);
        const redOne = Card(Values.ONE, Colors.RED);

        const playerCard = discardedCard.value == Colors.ONE || discardedCard.color == Colors.RED ?
          blueZero : redOne;

        curr.hand = [playerCard];

        playerCard.matches(discardedCard).should.be.false;
        should.throw(_ => game.play(playerCard));

        // don't touch player's hand
        curr.hand.should.have.length(1);
      });

      it('should throw if the played wild card does not have a color set', function () {
        let curr = game.getCurrentPlayer();
        let discardedCard = game.getDiscardedCard();
        let playerCard = Card(Values.WILD);

        curr.hand = [playerCard];

        should.throw(_ => game.play(playerCard));
      });

      it('should remove played card from player hand', function () {
        let curr = game.getCurrentPlayer();
        let discardedCard = game.getDiscardedCard();
        let playerCard = Card(discardedCard.value,
          discardedCard.color == Colors.BLUE ? Colors.RED : Colors.BLUE);

        curr.hand = [playerCard];

        playerCard.matches(discardedCard).should.be.true;

        should.not.throw(_ => game.play(playerCard));
        curr.hand.should.have.length(0);
        curr.hand.should.not.contain(playerCard);
        curr.hand.indexOf(playerCard).should.equal(-1);

        // discarded card must be equal to player card now
        game.getDiscardedCard().color.is(playerCard.color).should.be.true;
        game.getDiscardedCard().value.is(playerCard.value).should.be.true;
      });

      it('should pass turn to next player', function () {
        let curr = game.getCurrentPlayer();
        let discardedCard = game.getDiscardedCard();
        let playerCard = Card(discardedCard.value,
          discardedCard.color == Colors.BLUE ? Colors.RED : Colors.BLUE);

        curr.hand = [playerCard, playerCard];

        playerCard.matches(discardedCard).should.be.true;

        game.getCurrentPlayer().name.should.equal(curr.name);
        should.not.throw(_ => game.play(playerCard));
        game.getCurrentPlayer().name.should.not.equal(curr.name);
      });

      it('should accept WILD cards no matter their colors', function () {
        let curr = game.getCurrentPlayer();
        let discardedCard = game.getDiscardedCard();
        let wildCard = Card(Values.WILD,
          discardedCard.color == Colors.RED ? Colors.BLUE : Colors.RED
        );

        curr.hand = [wildCard];

        wildCard.matches(discardedCard).should.be.true;
        should.not.throw(_ => game.play(wildCard));

        curr = game.getCurrentPlayer();
        discardedCard = game.getDiscardedCard();
        wildCard = Card(Values.WILD_DRAW_FOUR,
          discardedCard.color == Colors.RED ? Colors.BLUE : Colors.RED
        );

        curr.hand = [wildCard];

        wildCard.matches(discardedCard).should.be.true;
        should.not.throw(_ => game.play(wildCard));
      });

      it('should skip next player if thrown SKIP', function () {
        let curr = game.getCurrentPlayer();
        let discardedCard = game.getDiscardedCard();
        let skip = Card(Values.SKIP, discardedCard.color);

        // get the player after the next, by getting theirs numbers
        // through theirs names 
        let pnum = +game.getCurrentPlayer().name.split(' ')[1];
        if (pnum >= 3)
          pnum -= 2;
        else
          pnum += 2;

        curr.hand = [skip, skip];

        game.getCurrentPlayer().name.should.equal(curr.name);
        should.not.throw(_ => game.play(skip));
        game.getCurrentPlayer().name.should.equal(`Player ${pnum}`);
      });

      it('should change the playing direction if thrown REVERSE', function () {
        let curr = game.getCurrentPlayer();
        let discardedCard = game.getDiscardedCard();
        let reverse = Card(Values.REVERSE, discardedCard.color);

        // get the player after the next, by getting theirs numbers
        // through theirs names 
        let pnum = +game.getCurrentPlayer().name.split(' ')[1];
        if (pnum == 1)
          pnum = 4;
        else
          pnum--;

        curr.hand = [reverse, reverse];

        game.getCurrentPlayer().name.should.equal(curr.name);
        should.not.throw(_ => game.play(reverse));
        game.getCurrentPlayer().name.should.equal(`Player ${pnum}`);
      });

      it('should skip next player if thrown REVERSE with 2 players', function () {
        game = Game(["Player 1", "Player 2"]);

        let curr = game.getCurrentPlayer();
        let discardedCard = game.getDiscardedCard();
        let reverse = Card(Values.REVERSE, discardedCard.color);

        curr.hand = [reverse];

        game.getCurrentPlayer().name.should.equal(curr.name);
        should.not.throw(_ => game.play(reverse));
        game.getCurrentPlayer().name.should.equal(curr.name);
      });

      it('should force player to draw after a DRAW TWO', function () {
        let curr = game.getCurrentPlayer();
        let discardedCard = game.getDiscardedCard();
        let drawTwo = Card(Values.DRAW_TWO, discardedCard.color);
        let reverse = Card(Values.REVERSE, discardedCard.color);

        curr.hand = [drawTwo, drawTwo];

        should.not.throw(_ => game.play(drawTwo));

        // add reverse to new player hand
        curr = game.getCurrentPlayer();
        curr.hand = [reverse, reverse];

        // cannot pass
        should.throw(game.pass);
        // cannot play no-DRAW card
        should.throw(_ => game.play(reverse));
        should.not.throw(game.draw);
        curr.hand.should.have.length(4);
        // lost his turn
        game.getCurrentPlayer().name.should.not.equal(curr.name);
      });

      it('should stack DRAW TWO values', function () {
        let curr = game.getCurrentPlayer();
        let discardedCard = game.getDiscardedCard();
        let drawTwo = Card(Values.DRAW_TWO, discardedCard.color);
        let reverse = Card(Values.REVERSE, discardedCard.color);

        curr.hand = [drawTwo, drawTwo];
        should.not.throw(_ => game.play(drawTwo));

        // add reverse to new player hand
        curr = game.getCurrentPlayer();
        curr.hand = [drawTwo, drawTwo];
        should.not.throw(_ => game.play(drawTwo));

        // add reverse to new player hand
        curr = game.getCurrentPlayer();
        curr.hand = [reverse, reverse];

        should.throw(game.pass);
        should.throw(_ => game.play(reverse));
        should.not.throw(game.draw);
        curr.hand.should.have.length(6);
        game.getCurrentPlayer().name.should.not.equal(curr.name);
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
        let curr = game.getCurrentPlayer();
        game.draw();
        game.getCurrentPlayer().name.should.equal(curr.name);
        should.not.throw(game.pass);
        game.getCurrentPlayer().name.should.not.equal(curr.name);
      });
    });

    describe('#draw()', function () {
      it('should pass to next player if draw card was at place (draw two, wild draw four)');
      it('should add a card to player hand');
    });

    describe('#uno()', function () {
      it('should make "UNO" yeller to draw 2 cards if there isn\'t any player with 1 card', function () {
        let currentPlayer = game.getCurrentPlayer();

        currentPlayer.hand.should.have.length(7);
        game.uno();
        currentPlayer.hand.should.have.length(9);
      });

      it('should make user with 1 card that not yelled UNO! to draw 2 cards', function () {
        let curr = game.getCurrentPlayer();
        let discardedCard = game.getDiscardedCard();
        let drawTwo = Card(Values.DRAW_TWO, discardedCard.color);
        let reverse = Card(Values.REVERSE, discardedCard.color);

        curr.hand = [reverse, drawTwo];

        should.not.throw(_ => game.play(reverse));
        curr.hand.should.have.length(1);

        discardedCard = game.getDiscardedCard();

        game.uno();
        curr.hand.should.have.length(3);
      });

      it('should not make user draw if he has already drawn', function () {
        let curr = game.getCurrentPlayer();
        let discardedCard = game.getDiscardedCard();
        let drawTwo = Card(Values.DRAW_TWO, discardedCard.color);
        let reverse = Card(Values.REVERSE, discardedCard.color);

        curr.hand = [reverse, drawTwo];

        should.not.throw(_ => game.play(reverse));
        curr.hand.should.have.length(1);

        game.uno();
        curr.hand.should.have.length(3);

        game.uno();
        // the other player has already drawn, this player will draw now
        game.getCurrentPlayer().hand.should.have.length(9);
      });

      it('should not make user draw if he has already yelled UNO!', function () {
        let curr = game.getCurrentPlayer();
        let discardedCard = game.getDiscardedCard();
        let drawTwo = Card(Values.DRAW_TWO, discardedCard.color);
        let reverse = Card(Values.REVERSE, discardedCard.color);

        curr.hand = [reverse, drawTwo];
        game.uno();

        should.not.throw(_ => game.play(reverse));
        curr.hand.should.have.length(1);

        game.uno();
        // the other player has already yelled UNO!, this player will draw now
        game.getCurrentPlayer().hand.should.have.length(9);
      });
    });
  });

  describe("with two players", function () {
    let game = null;

    beforeEach(function () {
      game = Game(["Player 1", "Player 2"]);

      it('should come back to the same player when played REVERSE');
      // TODO: check rules for this
      it('should allow user to pass after throwing a REVERSE card');
    });
  });
});

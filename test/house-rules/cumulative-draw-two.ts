import { Card, Value } from '../../src/card';
import { Game } from '../../src/game';
import CumulativeDrawTwo from '../../src/house-rules/cumulative-draw-two';

describe('House Rule: Cumulative draw two', function () {
  let game: Game;

  beforeEach(function () {
    game = new Game(['Player 1', 'Player 2', 'Player 3'], [CumulativeDrawTwo]);
    game.newGame();
  });

  it('forces player to draw after a DRAW TWO', function () {
    let curr = game.currentPlayer;
    const discardedCard = game.discardedCard;
    const drawTwo = new Card(Value.DRAW_TWO, discardedCard.color);
    const reverse = new Card(Value.REVERSE, discardedCard.color);

    curr.hand = [drawTwo, drawTwo];

    expect(() => game.play(drawTwo)).not.toThrow();

    // add reverse to new player hand
    curr = game.currentPlayer;
    curr.hand = [reverse, reverse];

    // cannot pass
    expect(() => game.pass()).toThrow();
    // cannot play no-DRAW card
    expect(() => game.play(reverse)).toThrow();
    expect(() => game.draw()).not.toThrow();
    // expect(curr.hand).toHaveLength(4);
    expect(curr.hand.length).toBe(4);
    // lost his turn
    expect(game.currentPlayer.name).not.toBe(curr.name);
  });

  it('stacks DRAW TWO values', function () {
    let curr = game.currentPlayer;
    const discardedCard = game.discardedCard;
    const drawTwo = new Card(Value.DRAW_TWO, discardedCard.color);
    const reverse = new Card(Value.REVERSE, discardedCard.color);

    curr.hand = [drawTwo, drawTwo];
    expect(() => game.play(drawTwo)).not.toThrow();

    // add reverse to new player hand
    curr = game.currentPlayer;
    curr.hand = [drawTwo, drawTwo];
    expect(() => game.play(drawTwo)).not.toThrow();

    // add reverse to new player hand
    curr = game.currentPlayer;
    curr.hand = [reverse, reverse];

    expect(() => game.pass()).toThrow();
    expect(() => game.play(reverse)).toThrow();
    expect(() => game.draw()).not.toThrow();
    // expect(curr.hand).toHaveLength(6);
    expect(curr.hand.length).toBe(6);
    expect(game.currentPlayer.name).not.toBe(curr.name);
  });

  it('does not interfere if no DRAW TWO is played', () => {
    let curr = game.currentPlayer;
    const discardedCard = game.discardedCard;
    const reverse = new Card(Value.REVERSE, discardedCard.color);

    curr.hand = [reverse, reverse];

    expect(() => game.play(reverse)).not.toThrow();

    // add reverse to new player hand
    curr = game.currentPlayer;
    curr.hand = [reverse, reverse];

    // cannot pass before playing
    expect(() => game.pass()).toThrow();
    // can play any matching
    expect(() => game.play(reverse)).not.toThrow();
    expect(curr.hand).toHaveLength(1);
    // lost his turn
    expect(game.currentPlayer.name).not.toBe(curr.name);

    // add reverse to new player hand
    curr = game.currentPlayer;
    curr.hand = [reverse, reverse];

    // can draw
    expect(() => game.draw()).not.toThrow();
    expect(curr.hand).toHaveLength(3);
  });
});

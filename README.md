# UNO
> Uno game implemented in JavaScript

[![Build Status](https://travis-ci.org/danguilherme/uno.svg?branch=master)](https://travis-ci.org/danguilherme/uno)

## Installation
```bash
$ npm install uno-engine
```

## Usage

### Import
**JavaScript**
```js
const { Game } = require('uno-engine');
```

**TypeScript**
```ts
import { Game } from 'uno-engine';
```

### New Game
```ts
const players = ['Player 1', 'Player 2', 'etc.']; // maximum 10 players with unique names
const customRules = [CumulativeDrawTwo];          // you can add your own rules (see https://github.com/danguilherme/uno/tree/v0.1.0-alpha/src/house-rules)
const game = new Game(players, customRules);      // initialize the game
```
After starting a new game, the first card will be randomly chosen, hands of 7 dealt, and a player will be randomly chosen to go first.

### Player Properties
```ts
const player = game.currentPlayer;          // player whose turn it is
const hand = player.hand;                   // array of `Card` objects
const p = game.getPlayer("Player 1");       // get player by name
const card = player.getCardByValue(value);  // get the exact card in the player's hand
```

### Card Properties
```ts
import { Colors, Values } from 'uno-engine';

const card = game.discardedCard;  // current card in-play
const cardColor = card.color;     // get the index of the card color: 0 to 3
                                  // (WILD and WILD DRAW FOUR will not have this property set)
Colors[cardColor];                // get the name of the color: RED, BLUE, GREEN, or YELLOW

// Card value
const cardValue = card.value; // get the index of the card value: 0 to 14
Values[cardValue];            // get the name of the card:
                              // 0-9, SKIP, REVERSE, DRAW_TWO, WILD, or WILD_DRAW_TWO

// Get card from value/color strings
const value = Values.SIX;
const color = Colors.BLUE;
const card = new Card(value, color);

// Set WILD or WD4 color
const [color, value] = ['GREEN', 'WILD'];   // get args from player input
const card = player.getCardByValue(value);  // get exact WILD/WD4 in player's hand
card.color = Colors[color];                 // set color of WILD/WD4 in hand

// Get Card from args function
const getCard = ([color, value], player) => {
  let card = new Card(Values[value], Colors[color]);
  if (value === 'WILD' || value === 'WILD_DRAW_FOUR') {
    card = player.getCardByValue(Values[value]);
    card.color = Colors[color];
  }
  return card;
};
```

### Game Loop
```ts
try {
  game.play(card); // play a card from the hand of the current player
} catch (e) {
  // throws error if player tries to play a card they don't have
  // throws error if player tries to play a card that can't be played (doesn't match discardedCard)
  // throws error if card doesn't have a color property (wild, wd4)
  // see `Card Properties` for setting wild and wd4 color
}

game.draw(); // draw a card for the current player

try {
  game.pass(); // current player pass after drawing
} catch (e) {
  // throws error if player hasn't drawn yet
}

// Yelling UNO!
game.uno();           // game.currentPlayer is yelling UNO!
game.uno("Player 1"); // Other than current player yells UNO
                      // - If the yelling player is the current player,
                      //   and they have 2 or less cards, he is just marked as "yelled"
                      // - If the yelling player has more than 2 cards,
                      //   the game searches for someone with 1 card that did not yell "UNO!",
                      //   and make him draw 2 cards. If there's no one,
                      //   the yelling player draws instead.
```

### Game Events

- [Game Events](https://github.com/danguilherme/uno/blob/feature/typescript/src/events/game-events.ts)

```ts
game.on('beforedraw', ({ data: { player, quantity } }) => {
  // Fired when a player requests cards from the draw pile.
});

game.on('draw', ({ data: { player, cards } }) => {
  // Fired after player's drawn cards are added to his hands.
});

game.on('beforepass', ({ data: { player } }) => {
  // Fired when a player can pass and requests to pass its turn.
});

game.on('beforecardplay', ({ data: { card, player } }) => {
  // Fired before player discards a card in the discard pile.
});

game.on('cardplay', ({ data: { card, player } }) => {
  // Fired after player's card is thrown in the discard pile.
});

game.on('nextplayer', ({ data: { player } ) => {
  // Fired when `game.currentPlayer` changes.
});

game.on('end', ({ data: { winner, score } }) => {
  // emitted when any player has 0 cards left
  // ----------
  // the winner gets score based on the cards the other players have remaining at the end:
  // - number cards are worth their own value
  // - WILD and WD4 are worth 50
  // - DRAW TWO, SKIP, and REVERSE are worth 20
});
```

## Game Rules

Check all the [official game rules](RULES.md).
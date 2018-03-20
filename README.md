# UNO
> Uno game implemented in JavaScript

[![Build Status](https://travis-ci.org/danguilherme/uno.svg?branch=master)](https://travis-ci.org/danguilherme/uno)

## Installation
```bash
$ npm install uno-engine
```

## Usage
```js
const { Game, Card, Values, Colors } = require('uno-engine');
const players = ['Player 1', 'Player 2', 'etc.']; // maximum 10 players with unique names
const game = Game(players); // initialize the game
game.newGame();
```
After starting a new game, the first card will be randomly chosen, hands of 7 dealt, and a player will be randomly chosen to go first.

### Player Properties
```js
let player = game.currentPlayer; // player whose turn it is
let hand = player.hand; // array of `Card` objects
let p = game.getPlayer("Player 1"); // get non-current player
let card = player.getCardByValue(value); // get the exact card in the player's hand
```

### Card Properties
```js
let card = game.discardedCard; // current card in-play

// Card color (wild and wd4 will not have this property set)
let cardColor = card.color; // EnumItem with key equal to color in uppercase
cardColor.toString(); // RED, BLUE, GREEN, or YELLOW

// Card value
let cardValue = card.value; // EnumItem with key equal to value in uppercase
cardValue.toString(); // 0-9, SKIP, REVERSE, DRAW_TWO, WILD, or WILD_DRAW_TWO

// Get card from value/color strings
let value = Values.get("SIX");
let color = Colors.get("BLUE");
let card = Card(value, color);

// Set wild or wd4 color
const args = ['GREEN', 'WILD']; // get args from player input
let card = player.getCardByValue(Values.get(args[1])); // get exact wild/wd4 in player's hand
card.color = Colors.get(c); // set color of wild/wd4 in hand

// Get Card from args function
const getCard = ([color, value], player) => {
  let card = Card(Values.get(value), Colors.get(color));
  if (value === 'WILD' || value === 'WILD_DRAW_FOUR') {
    card = player.getCardByValue(Values.get(value));
    card.color = Colors.get(color);
  }
  return card;
};
```

### Game Loop
```js
try {
  game.play(card); //play a card from the hand of the current player
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
game.uno(); // game.currentPlayer is yelling UNO!
game.uno("Player 1"); // Other than current player yells UNO
// - If the yelling player is the current player, and they have 2 or less cards, he is just marked as "yelled"
// - If the yelling player has more than 2 cards, the game searches for someone with 1 card that did not yell "UNO!", and make him draw 2 cards. If there's no one, the yelling player draws instead.

// Events
game.on('cardplay', (error, playedCard, playedBy) => {
  // emitted every time a card is played
});
game.on('nextplayer', (error, nextPlayer) => {
  // emitted whenever the `game.currentPlayer` changes
});
game.on('end', (error, winner, score) => {
  // emitted when any player has 0 cards left
  // ----------
  // the winner gets score based on the cards the other players have reminaing at the end:
  // - number cards are worth their own value
  // - wild and wd4 are worth 50
  // - dt, skip, and reverse are worth 20
});
```

## [Game Rules](http://www.unorules.com/)
- **Cards** _(108 cards)_
  - **Number cards** _(for each color)_
    - 19x cards (0-9, only one 0)
  - **Action cards** _(for each color)_
    - 2x Draw Two
      ```
      When a person places this card, the next player will have to pick up two cards and forfeit his/her turn.
      ```
    - 2x Reverse
      ```
      If going clockwise, switch to counterclockwise or vice versa
      ```
    - 2x Skip
      ```
      When a player places this card, the next player has to skip their turn. If turned up at the beginning, the first player loses his/her turn.
      ```
  - **Wild cards**
    - 4x Wild
      ```
      This card represents all four colors, and can be placed on any card. The player has to state which color it will represent for the next player. It can be played regardless of whether another card is available.
      ```
    - 4x Wild Draw Four
      ```
      This acts just like the wild card except that the next player also has to draw four cards. With this card, you must have no other alternative cards to play that matches the color of the card previously played. If you play this card illegally, you may be challenged by the other player to show your hand. If guilty, you need to draw 4 cards. If not, the challenger needs to draw 6 cards instead.
      ```
- **Setup**
  - 2-10 players, ages 7 and over :P
  - each player starts with 7 cards
  - rest of cards are placed in a Draw Pile faced down
  - players throw theirs cards in a Discard Pile
- **Game Play**
  - the first player is the player on the left of the dealer (or the youngest player).
  - game play follows a clockwise direction
  - every player can see theirs cards and tries to match the card in the Discard Pile
    - cards have to match by color, number or the symbol/action.
  - a wild card matches cards with any colors or numbers  and it can change the current color in play
  - if player has no matches (or simply don't want to play), they must draw a card from the Draw Pile. If that card can be played, play it. Or just pass theirs turn.
    ```
    There are two different ways to play regarding drawing new cards. The Official Uno Rules states that after a card is drawn the player can discard it if it is a match, or if not, play passes on to the next player. The other type is where players continue to draw cards until they have a match, even if it is 10 times.
    ```
  - if the first card from the Discard Pile (chosen by the system, from Draw Pile) is an Action Card, its action must be carried out
    - exception is for wild cards. If one is the first card from the Discard Pile, return them to the Draw Pile, shuffle it, and try to get first card
  - game continues until a player has one card left. The moment a player has just one card they must yell “**UNO!**”
    - If they are caught not saying “Uno” by another player before any card has been played, the player must draw two new cards.
  - Once a player has no cards remaining, the game round is over, points are scored, and the game begins over again.
    - Normally, everyone tries to be the first one to achieve 500 points, but you can also choose whatever points number to win the game, as long as everyone agrees to it.
- **Scoring**
  - When a player no longer has any cards and the game ends, he receives points.
  - All opponents’ cards are given to the winner and points are counted.
    - number cards have the same value as theirs number (eg. a 9 is 9 points).
    - Draw Two: 20 points
    - Skip: 20 points
    - Reverse: 20 points
    - Wild: 50 points
    - Wild Draw Four: 50 points
  - The first player to attain 500 points wins the game.

### For Two Players

For two players, there is a slight change of game play rules:

- Play Skip, and you may immediately play another card
- Reverse works like Skip
- If you play a Draw Two or Wild Draw Four card, your opponent has to draw the number of cards required, and then play immediately resumes back on your turn.

"use strict";

const Game = require('./game');
const Card = require('./card');
const Values = require('./values');
const Colors = require('./colors');

const SYSTEM_IDENTIFIER = "UNO";

var rl = require('readline');
startGame();

function prompt(str, tag) {
  if (tag == undefined)
    return `${str}> `;
  return `${tag}> `;
}

function startGame() {
  const play = players => {
    let game = Game(players);
    game.on('start', () => {
      playerTurn(game);
    });

    game.on('end', (err, winner, score) => {
      console.log(`Congratulatios ${winner}! You are the big winner! Score: ${score}`);
      game = null;
      play(players);
    });
  };

  getPlayers()
    .then(players => play(players));
}

function getPlayers(readline) {
  return new Promise((resolve, reject) => {
    let readline = rl.createInterface(process.stdin, process.stdout);
    let players = [];

    console.log("Write player names (2-10 players)");

    readline.setPrompt(prompt`${SYSTEM_IDENTIFIER}`);
    readline.prompt();

    readline
      .on('line', line => {
        line = line.trim();

        if (line == 'done') {
          if (players.length >= 2)
            return readline.close();
        } else if (!!line)
          players.push(line.trim());

        readline.prompt();
      })
      .on('close', () => resolve(players));
  });
}

function playerTurn(game) {
  return new Promise((resolve, reject) => {
    let readline = rl.createInterface(process.stdin, process.stdout);
    let player = game.getCurrentPlayer();
    let discarded = game.getDiscardedCard();

    const commands = {
      help: () => {
        console.log("Actions:",
          "\n\tplay {CARD}          => Play the specified card",
          "\n\tdraw                 => Draw a card from draw pile",
          "\n\tpass                 => Pass your turn",
          "\n\tcolor {CARD} {COLOR} => Set the color of the WILD or WILD_DRAW_FOUR card");
      },

      info: () => {
        console.log("-----");
        console.log(".....You are:", player.name);
        console.log("...Your hand:", player.hand.map(card => card.toString()).join(', '));
        console.log("...Discarded:", discarded.toString());
      },

      table: () => {
        console.log(discarded.toString());
      },

      player: () => {
        console.log(player.name);
      },

      hand: () => {
        console.log(player.hand.map(card => card.toString()).join(', '));
      }
    };

    commands.info();
    game.on('nextplayer', () => {
      player = game.getCurrentPlayer();
      discarded = game.getDiscardedCard();

      commands.info();
    });

    readline.setPrompt(prompt`${player.name}`);
    readline.prompt();

    readline
      .on('line', line => {
        line = line.trim().toLowerCase();

        try {
          let entries = line.split(' ');
          switch (entries[0]) {
            case 'play':
              let cardStr = entries.splice(1).join(' ');
              game.play(str2card(cardStr));
              break;
            case 'draw':
              game.draw();
              console.log("Your hand:", player.hand.map(card => card.toString()).join(', '));
              break;
            case 'pass':
              game.pass();
              break;
            case 'color':
              let card = player.getCardByValue(Values.get(entries[1].toUpperCase()));
              if (!card)
                throw new Error(`${player.name} has no ${card.value}`);
              card.setColor(Colors.get(entries[2].toUpperCase()));
              console.log("Color set:", card.toString());
              break;
            default:
              if (entries[0] in commands)
                commands[entries[0]]();
          }
        } catch (error) {
          console.error("ERROR:", error.message);
        }

        // if (line == 'done') {
        //   if (players.length >= 2)
        //     return readline.close();
        // } else if (!!line)
        //   players.push(line.trim());

        readline.setPrompt(prompt`${player.name}`);
        readline.prompt();
      })
      .on('error', err => console.error(err.message))
      .on('close', () => resolve(players));
  });
}

function str2card(str) {
  let splitted = str.toUpperCase().split(' ');
  let value = splitted[1];
  let color = splitted[0];

  return Card(Values.get(value), Colors.get(color));
}

module.exports = Game;
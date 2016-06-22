"use strict";

const Deck = require('./deck');

const player = function (name) {
  name = !!name ? name.trim() : name;
  if (!name)
    throw new Error("Player must have a name");;

  let instance = {
    name: name,
    hand: []
  };

  instance.hasCard = card => {
    if (!card)
      return false;
    
    return instance.hand.some(c => c.value === card.value && c.color === card.color);
  };

  instance.removeCard = card => {
    if (!instance.hasCard(card))
      return;
    
    let c = instance.hand.find(c => c.value === card.value && c.color === card.color);
    let i = instance.hand.indexOf(c);
    instance.hand.splice(i, 1);
  };

  instance.valueOf = function () {
    return this.name;
  };

  instance.toString = function () {
    return this.name;
  };

  return instance;
};

module.exports = player;
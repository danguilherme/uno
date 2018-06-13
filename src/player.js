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

  instance.getCardByValue = value => {
    if (!value)
      return null;
    
    return instance.hand.find(c => c.value === value);
  };

  instance.hasCard = card => {
    if (!card)
      return false;
    
    return instance.hand.some(c => c.value === card.value && c.color === card.color);
  };

  instance.removeCard = card => {
    if (!instance.hasCard(card))
      return;
    
    let i = instance.hand.findIndex(c => c.value === card.value && c.color === card.color);
    instance.hand.splice(i, 1);
  };

  instance.valueOf = () => instance.name;

  instance.toString = () => instance.name;

  return instance;
};

module.exports = player;
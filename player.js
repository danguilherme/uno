"use strict";

const Deck = require('./deck');

const player = function(name) {
    name = !!name ? name.trim() : name;
    if (!name)
        throw new Error("Player must have a name");;
    
    let instance = {
        name: name
    };

    instance.deck = [];

    return instance;
};

module.exports = player;
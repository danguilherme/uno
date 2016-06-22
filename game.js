"use strict";

const util = require('util');
const EventEmitter = require('events').EventEmitter;

const card = require('./card');

const game = function(players) {
    // extends EventEmitter
    // events:
    // - start (players)
    // - card-play (card)
    // - uno (player)
    // - end (winner)

    let instance = {};
    util.inherits(game, EventEmitter);

    return;
};
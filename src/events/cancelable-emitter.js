'use strict';

const EventEmitter = require("events").EventEmitter;

function createProxyListener(originalListener, context) {
  return function() {
    const returnValue = originalListener.apply(context, Array.from(arguments));
    const shouldContinue = returnValue !== false;

    // console.log("cancel?", !shouldContinue);
    return shouldContinue;
  };
}

class CancelableEmitter extends EventEmitter {
  on(eventName, listener) {
    return super.on(eventName, createProxyListener(listener, this));
  }

  emit(eventName) {
    return this.listeners(eventName).every(l => l.apply(this, args2array(arguments).slice(1)));
  }
}

function args2array(args) {
  return Array.prototype.slice.call(args);
}

module.exports = CancelableEmitter;

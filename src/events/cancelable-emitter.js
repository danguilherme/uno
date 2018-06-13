const { EventEmitter } = require("events");

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

  emit(eventName, ...data) {
    return this.listeners(eventName).every(l => l(...data));
  }
}

module.exports = CancelableEmitter;

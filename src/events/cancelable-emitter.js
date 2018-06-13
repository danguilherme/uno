const { EventEmitter } = require("events");

function createProxyListener(originalListener, context) {
  return function() {
    const args = Array.from(arguments);
    console.log("proxy!"/*, args*/);
    const returnValue = originalListener.apply(context, args);
    const preventDefault = returnValue !== false;
    console.log("preventDefault", preventDefault);
    return preventDefault;
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

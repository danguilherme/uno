const { EventEmitter } = require("events");
const Event = require("./event");

function createProxyListener(originalListener, context) {
  return function(event) {
    const returnValue = originalListener.call(context, event);
    const shouldContinue = returnValue !== false;

    if (!shouldContinue) event.preventDefault();

    // console.log("cancel?", !shouldContinue);
    return !event.canceled;
  };
}

class CancelableEmitter extends EventEmitter {
  on(eventName, listener) {
    return super.on(eventName, createProxyListener(listener, this));
  }

  /**
   * @param {Event} event
   */
  emit(event) {
    return this.listeners(event.type).every(handler => handler(event));
  }
}

module.exports = CancelableEmitter;

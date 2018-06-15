import { EventEmitter } from 'events';
import { Event } from './event';

function createProxyListener(originalListener: Function, context: any) {
  return function(event: Event) {
    const returnValue = originalListener.call(context, event);
    const shouldContinue = returnValue !== false;

    if (!shouldContinue) event.preventDefault();

    // console.log("cancel?", !shouldContinue);
    return !event.canceled;
  };
}

export class CancelableEventEmitter extends EventEmitter {
  on(eventName: string, listener: Function) {
    return super.on(eventName, createProxyListener(listener, this));
  }

  emit(type: string, data?: any) {
    const event = new Event(type, {
      data,
    });
    return this.dispatchEvent(event);
  }

  /**
   * @param {Event} event
   */
  dispatchEvent(event: Event) {
    return this.listeners(event.type).every((handler: Function) =>
      handler(event),
    );
  }
}

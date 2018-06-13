const defaults = {
  isCancelable: true,
  data: null,
};

class Event {
  constructor(type, { isCancelable, data } = defaults) {
    if (!type) throw new Error('Event type is mandatory');
    if (typeof isCancelable === 'undefined') isCancelable = true;

    this.type = type;
    this.isCancelable = isCancelable;
    this.data = data;
    this.canceled = false;
  }

  preventDefault() {
    this.canceled = true;
  }
}

const myEvent = new Event("hello", {
  data: "teste",
});

module.exports = Event;
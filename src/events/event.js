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
    if (this.isCancelable)
      this.canceled = true;
  }
}

module.exports = Event;
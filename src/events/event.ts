export interface EventOptions {
  /**
   * @default false
   */
  isCancelable: boolean;
}

const defaults: EventOptions = {
  isCancelable: true,
};

export class Event {
  private _type: string;
  private _isCancelable: boolean;
  private _canceled: boolean;

  get type() {
    return this._type;
  }

  get isCancelable() {
    return this._isCancelable;
  }

  get canceled() {
    return this._canceled;
  }

  constructor(type: string, options?: Partial<EventOptions>) {
    if (!type) throw new Error('Event type is mandatory');

    options = Object.assign({}, defaults, options) as EventOptions;

    if (typeof options.isCancelable === 'undefined')
      options.isCancelable = true;

    this._type = type;
    this._isCancelable = options.isCancelable;
    this._canceled = false;
  }

  preventDefault() {
    if (this.isCancelable) this._canceled = true;
  }
}

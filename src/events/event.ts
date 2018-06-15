export interface EventOptions<T = any> {
  isCancelable: boolean;
  data: T;
}

const defaults: EventOptions = {
  isCancelable: true,
  data: {},
};

export class Event<T = any> {
  private _type: string;
  private _isCancelable: boolean;
  private _data: T;
  private _canceled: boolean;

  get type() {
    return this._type;
  }

  get isCancelable() {
    return this._isCancelable;
  }

  get data() {
    return Object.freeze(this._data);
  }

  get canceled() {
    return this._canceled;
  }

  constructor(type: string, options: Partial<EventOptions<T>>) {
    if (!type) throw new Error('Event type is mandatory');

    options = Object.assign({}, defaults, options) as EventOptions;

    if (typeof options.isCancelable === 'undefined')
      options.isCancelable = true;

    this._type = type;
    this._isCancelable = options.isCancelable;
    this._data = options.data;
    this._canceled = false;
  }

  preventDefault() {
    if (this.isCancelable) this._canceled = true;
  }
}

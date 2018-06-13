interface EnumItem {
  key: number;
  value: string;

  is(item: EnumItem | number | string): boolean;
  has(item: EnumItem | number | string): boolean;
  toString(): string;
  toJSON(): string;
  valueOf(): number;
}

declare module "enum" {
  export default class Enum {
    /**
     * Get the item by its name
     */
    [x: string]: EnumItem | Function;

    get(key: string | number): EnumItem;
    isDefined(key: string | number | EnumItem): boolean;
    constructor(items: any, name: string);
  }
}
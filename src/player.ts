import { Card, Values } from './card';

const Deck = require('./deck');

export class Player {
  name: string;
  hand: Card[] = [];

  constructor(name: string) {
    name = !!name ? name.trim() : name;
    if (!name) throw new Error('Player must have a name');

    this.name = name;
  }

  getCardByValue(value: Values) {
    if (!value) return undefined;

    return this.hand.find(c => c.value === value);
  }

  hasCard(card: Card) {
    if (!card) return false;

    return this.hand.some(
      c => c.value === card.value && c.color === card.color,
    );
  }

  removeCard(card: Card) {
    if (!this.hasCard(card)) return;

    const i = this.hand.findIndex(
      c => c.value === card.value && c.color === card.color,
    );
    this.hand.splice(i, 1);
  }

  valueOf() {
    return this.name;
  }

  toString() {
    return this.name;
  }
}

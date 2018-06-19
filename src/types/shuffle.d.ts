// https://www.npmjs.com/package/shuffle
declare module 'shuffle' {
  class Deck<T = any> {
    cards: T[];
    length: number;
    /**
     * sets the deck back to the full deck, unshuffled
     */
    reset(): void;
    shuffle(): void;
    draw(): T;
    draw(quantity: number): T[];
  }

  interface ShuffleOptions<T = any> {
    /**
     * Deck creator
     */
    deck: T[];
  }

  function shuffle<T>(options: ShuffleOptions<T>): Deck<T>;
}

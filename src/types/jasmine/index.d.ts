import 'jasmine';

declare namespace jasmine {
  interface Matchers<T> {
    /**
     * Use `.toHaveLength` to check that an object has a `.length` property and it is set to a certain numeric value.
     *
     * This is especially useful for checking arrays or strings size.
     *
     * @example
     * expect([1, 2, 3]).toHaveLength(3);
     * expect('abc').toHaveLength(3);
     * expect('').not.toHaveLength(5);
     */
    toHaveLength(length: number): boolean;
  }
}

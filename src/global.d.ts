declare namespace NodeJS {
  export interface ProcessEnv {
    /**
     * The build target for the current bundle.
     *
     * Used to remove code on compilation time.
     */
    PLATFORM: 'node' | 'browser';
  }
}

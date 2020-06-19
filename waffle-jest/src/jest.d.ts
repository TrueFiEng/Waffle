declare namespace jest {
  interface Matchers<R> {
    toBeProperAddress(): CustomMatcherResult;
    toBeProperPrivateKey(): CustomMatcherResult;
  }
}

import {MockProvider} from '../src';

export const describeMockProviderCases = (
  title: string,
  testCases: (provider: MockProvider) => void
) => {
  describe(title, () => {
    describe('default options', () => {
      const provider = new MockProvider();
      testCases(provider);
    });

    // describe('instanbul hardfork', () => {
    //   const provider = new MockProvider({
    //     ganacheOptions: {
    //       chain: {
    //         hardfork: 'istanbul'
    //       }
    //     }
    //   });
    //   testCases(provider);
    // });

    // describe('berlin hardfork', () => {
    //   const provider = new MockProvider({
    //     ganacheOptions: {
    //       chain: {
    //         hardfork: 'berlin'
    //       }
    //     }
    //   });
    //   testCases(provider);
    // });

    // describe('london hardfork', () => {
    //   const provider = new MockProvider({
    //     ganacheOptions: {
    //       chain: {
    //         hardfork: 'london'
    //       }
    //     }
    //   });
    //   testCases(provider);
    // });

    // describe('with block gas limit', () => {
    //   const provider = new MockProvider({
    //     ganacheOptions: {
    //       miner: {
    //         blockGasLimit: 9_999_999
    //       }
    //     }
    //   });
    //   testCases(provider);
    // });
  });
};

import {providers} from 'ethers';
import {Suite} from 'mocha';
import {createGanacheProvider, createBuidlerProvider} from '../../lib';

export const providerCreators = [{
  name: 'Ganache',
  createProvider: createGanacheProvider
}, {
  name: 'Buidler',
  createProvider: createBuidlerProvider
}];
export const forEachProvider = {
  /* tslint:disable-next-line:max-line-length */
  describe: (description: string, suite: (provider: providers.JsonRpcProvider) => void | Promise<void>): Suite =>
    describe(description, () => providerCreators.forEach((providerCreator) => {
      describe(`Provider: ${providerCreator.name}`, async () => await suite(providerCreator.createProvider()));
    })),
  it: (description: string, test: (provider: providers.JsonRpcProvider) => void | Promise<void>): void =>
    providerCreators.forEach((providerCreator) => {
      it(`${description} [${providerCreator.name}]`, async () => await test(providerCreator.createProvider()));
    })
};

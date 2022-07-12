import type {MockProvider} from '@ethereum-waffle/provider';
import {Contract} from 'ethers';
import {EncodingError} from './error';

export function assertFunctionCalled(chai: Chai.AssertionStatic, contract: Contract, fnName: string) {
  const fnSighash = contract.interface.getSighash(fnName);

  chai.assert(
    (contract.provider as unknown as MockProvider).callHistory.some(
      call => call.address === contract.address && call.data.startsWith(fnSighash)
    ),
    `Expected contract function ${fnName} to be called`,
    `Expected contract function ${fnName} NOT to be called`,
    undefined
  );
}

export function assertCalledWithParams(
  chai: Chai.AssertionStatic,
  contract: Contract,
  fnName: string,
  parameters: any[],
  negated: boolean
) {
  if (!negated) {
    assertFunctionCalled(chai, contract, fnName);
  }

  let funCallData: string;
  try {
    funCallData = contract.interface.encodeFunctionData(fnName, parameters);
  } catch (e) {
    const error = new EncodingError('Something went wrong - probably wrong parameters format');
    error.error = e as any;
    throw error;
  }

  chai.assert(
    (contract.provider as unknown as MockProvider).callHistory.some(
      call => call.address === contract.address && call.data === funCallData
    ),
    generateWrongParamsMessage(contract, fnName, parameters),
    `Expected contract function ${fnName} not to be called with parameters ${parameters}, but it was`,
    undefined
  );
}

function generateWrongParamsMessage(contract: Contract, fnName: string, parameters: any[]) {
  const fnSighash = contract.interface.getSighash(fnName);
  const functionCalls = (contract.provider as unknown as MockProvider)
    .callHistory.filter(
      call => call.address === contract.address && call.data.startsWith(fnSighash)
    );
  const paramsToDisplay = functionCalls.slice(0, 3);
  const leftParamsCount = functionCalls.length - paramsToDisplay.length;

  return `Expected contract function ${fnName} to be called with parameters ${parameters} \
but it was called with parameters:
${paramsToDisplay.map(call => contract.interface.decodeFunctionData(fnName, call.data).toString()).join('\n')}` +
(leftParamsCount > 0 ? `\n...and ${leftParamsCount} more.` : '');
}

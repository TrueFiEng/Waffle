import {Contract} from 'ethers';
import {
  validateContract,
  validateMockProvider,
  validateFnName
} from './calledOnContractValidators';

export function toBeCalledOnContractWith(
  fnName: string,
  contract: Contract,
  parameters: any[]
) {
  validateContract(contract);
  validateMockProvider(contract.provider);
  validateFnName(fnName, contract);

  const funCallData = contract.interface.encodeFunctionData(fnName, parameters);
  const {callHistory} = contract.provider;
  const pass = callHistory.some(
    (call) => call.address === contract.address && call.data === funCallData
  );

  return pass
    ? {
      pass: true,
      message: () => 'Expected contract function with parameters NOT to be called'
    }
    : {
      pass: false,
      message: () => 'Expected contract function with parameters to be called'
    };
}

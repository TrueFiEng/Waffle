import {Contract} from 'ethers';
import {
  validateContract,
  validateMockProvider,
  validateFnName
} from './calledOnContractValidators';

export function toBeCalledOnContract(fnName: string, contract: Contract) {
  validateContract(contract);
  validateMockProvider(contract.provider);
  if (fnName !== undefined) {
    validateFnName(fnName, contract);
  }

  const fnSighash = contract.interface.getSighash(fnName);
  const {callHistory} = contract.provider;

  const pass = callHistory.some(
    (call) =>
      call.address === contract.address && call.data.startsWith(fnSighash)
  );

  return pass
    ? {
      pass: true,
      message: () => 'Expected contract function NOT to be called'
    }
    : {
      pass: false,
      message: () => 'Expected contract function to be called'
    };
}

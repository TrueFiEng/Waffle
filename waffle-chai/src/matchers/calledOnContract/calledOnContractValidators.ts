import {Contract} from 'ethers';
import {MockProvider} from '@ethereum-waffle/provider';

export function validateContract(contract: any): asserts contract is Contract {
  validateCondition(
    contract instanceof Contract,
    'argument must be a contract'
  );
}

export function validateMockProvider(provider: any): asserts provider is MockProvider {
  validateCondition(
    provider instanceof MockProvider,
    'contract.provider must be a MockProvider'
  );
}

export function validateFnName(fnName: any, contract: Contract): asserts fnName is string {
  validateCondition(
    typeof fnName === 'string',
    'function name must be a string'
  );
  validateCondition(
    !!contract.interface.getFunction(fnName),
    'function must exist in provided contract'
  );
}

function validateCondition(condition: boolean, msg: string): asserts condition {
  if (!condition) {
    throw new TypeError(msg);
  }
}

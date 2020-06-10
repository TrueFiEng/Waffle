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
    !!provider.callHistory,
    'contract.provider should have a call history'
  );

  validateCondition(
    provider.callHistory instanceof Array,
    'contract.provider.callHistory must be a CallHistory'
  );
}

export function validateFnName(fnName: any, contract: Contract): asserts fnName is string {
  validateCondition(
    typeof fnName === 'string',
    'function name must be a string'
  );
  function isFunction(name: string) {
    try {
      return !!contract.interface.getFunction(name);
    } catch (e) {
      return false;
    }
  }
  validateCondition(
    isFunction(fnName),
    'function must exist in provided contract'
  );
}

function validateCondition(condition: boolean, msg: string): asserts condition {
  if (!condition) {
    throw new TypeError(msg);
  }
}

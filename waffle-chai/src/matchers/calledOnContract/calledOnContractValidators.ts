import {Contract} from 'ethers';
import {MockProvider} from '@ethereum-waffle/provider';

interface ErrorConstructor<T extends any[]> {
  new (...args: T): Error;
}

export function validateContract(contract: any): asserts contract is Contract {
  ensure(
    contract instanceof Contract, TypeError,
    'argument must be a contract'
  );
}

export function validateMockProvider(provider: any): asserts provider is MockProvider {
  ensure(
    !!provider.callHistory, TypeError,
    'contract.provider should have a call history'
  );

  ensure(
    provider.callHistory instanceof Array, Error,
    'calledOnContract matcher requires provider that support call history'
  );
}

export function validateFnName(fnName: any, contract: Contract): asserts fnName is string {
  ensure(
    typeof fnName === 'string', TypeError,
    'function name must be a string'
  );
  function isFunction(name: string) {
    try {
      return !!contract.interface.getFunction(name);
    } catch (e) {
      return false;
    }
  }
  ensure(
    isFunction(fnName), TypeError,
    'function must exist in provided contract'
  );
}

export function ensure<T extends any[]>(condition: boolean, ErrorToThrow: ErrorConstructor<T>, ...errorArgs: T):
  asserts condition {
  if (!condition) {
    throw new ErrorToThrow(...errorArgs);
  }
}

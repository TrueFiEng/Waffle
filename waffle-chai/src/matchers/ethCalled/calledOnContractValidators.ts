import {Contract} from 'ethers';
import {MockProvider} from '@ethereum-waffle/provider';

export function validateExpectArguments(contract: any) {
  isInstanceOfContract(contract);
  isInstanceOfMockProvider(contract.provider);
}

export function validateFnName(fnName: string, contract: any) {
  isString(fnName);
  validateCondition(
    fnName in contract.interface.functions,
    'ethCalled: function must exist in provided contract'
  );
}

function isString(val: any): asserts val is string {
  if (typeof val !== 'string') {
    throw new TypeError('ethCalled: function name must be a string');
  }
}

function isInstanceOfContract(val: any): asserts val is Contract {
  if (!(val instanceof Contract)) {
    throw new TypeError('ethCalled: argument must be a contract');
  }
}

function isInstanceOfMockProvider(val: any): asserts val is MockProvider {
  if (!(val instanceof MockProvider)) {
    throw new TypeError('ethCalled: contract.provider must be a MockProvider');
  }
}

function validateCondition(condition: boolean, msg: string): asserts condition {
  if (!condition) {
    throw new TypeError(msg);
  }
}

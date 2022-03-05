import {decodeRevertString} from '@ethereum-waffle/provider';

export async function toBeRevertedWith(
  promise: Promise<any>,
  revertReason: string | RegExp
) {
  try {
    const tx = await promise;
    await tx.wait();
    return {
      pass: false,
      message: () => 'Expected transaction to be reverted'
    };
  } catch (error: any) {
    const revertString = error?.receipt?.revertString ?? decodeRevertString(error);
    if (revertString) {
      return {
        pass: revertString === revertReason,
        message: () =>
          `Expected transaction to be reverted with ${revertReason}, but other reason was found: ${revertString}`
      };
    }

    const message = error instanceof Object && 'message' in error ? (error as any).message : JSON.stringify(error);

    const isReverted = message.search('revert') >= 0 &&
      (revertReason instanceof RegExp ? revertReason.test(message) : message.search(revertReason) >= 0);
    const isThrown = message.search('invalid opcode') >= 0 && revertReason === '';
    const isError = message.search('code=') >= 0;

    const pass = isReverted || isThrown || isError;
    if (pass) {
      return {
        pass: true,
        message: () => `Expected transaction NOT to be reverted with ${revertReason}`
      };
    } else {
      return {
        pass: false,
        message: () =>
          `Expected transaction to be reverted with ${revertReason}, but other exception was thrown: ${error}`
      };
    }
  }
}

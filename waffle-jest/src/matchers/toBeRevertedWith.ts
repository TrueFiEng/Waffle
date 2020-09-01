export async function toBeRevertedWith(
  promise: Promise<any>,
  revertReason: string
) {
  try {
    await promise;
    return {
      pass: false,
      message: () => 'Expected transaction to be reverted'
    };
  } catch (error) {
    const message = error instanceof Object && 'message' in error ? error.message : JSON.stringify(error);

    const isReverted = message.search('revert') >= 0 && message.search(revertReason) >= 0;
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

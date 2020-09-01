export async function toBeReverted(promise: Promise<any>) {
  try {
    await promise;
    return {
      pass: false,
      message: () => 'Expected transaction to be reverted'
    };
  } catch (error) {
    const message =
      error instanceof Object && 'message' in error ? error.message : JSON.stringify(error);

    const isReverted = message.search('revert') >= 0;
    const isThrown = message.search('invalid opcode') >= 0;
    const isError = message.search('code=') >= 0;

    const pass = isReverted || isThrown || isError;
    if (pass) {
      return {
        pass: true,
        message: () => 'Expected transaction NOT to be reverted'
      };
    } else {
      return {
        pass: false,
        message: () =>
          `Expected transaction to be reverted, but other exception was thrown: ${error}`
      };
    }
  }
}

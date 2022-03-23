export async function toBeReverted(promise: Promise<any>) {
  try {
    const tx = await promise;
    if ('wait' in tx) {
      // Sending the transaction succeeded, but we wait to see if it will revert on-chain.
      try {
        await tx.wait();
      } catch(e) {
        return {
          pass: true,
          message: () => 'Expected transaction to be reverted'
        };
      }
    }

    return {
      pass: false,
      message: () => 'Expected transaction to be reverted'
    };
  } catch (error) {
    const message =
      error instanceof Object && 'message' in error ? (error as any).message : JSON.stringify(error);

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

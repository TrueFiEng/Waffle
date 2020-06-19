export function toBeProperAddress(received: string) {
  const pass = /^0x[0-9-a-fA-F]{40}$/.test(received);
  return pass
    ? {
      pass: true,
      message: () => `Expected "${received}" not to be a proper address`
    }
    : {
      pass: false,
      message: () => `Expected "${received}" to be a proper address`
    };
}

export function toBeProperPrivateKey(received: string) {
  const pass = /^0x[0-9-a-fA-F]{64}$/.test(received);
  return pass
    ? {
      pass: true,
      message: () => `Expected "${received}" not to be a proper private key`
    }
    : {
      pass: false,
      message: () => `Expected "${received}" to be a proper private key`
    };
}

export function toBeProperHex(received: string, length: number) {
  const regexp = new RegExp(`^0x[0-9-a-fA-F]{${length}}$`);
  const pass = regexp.test(received);
  return pass
    ? {
      pass: true,
      message: () => `Expected "${received}" not to be a proper hex of length ${length}, but it was`
    }
    : {
      pass: false,
      message: () => `Expected "${received}" to be a proper hex of length ${length}`
    };
}

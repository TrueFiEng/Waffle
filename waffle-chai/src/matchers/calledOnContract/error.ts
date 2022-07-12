export class ProviderWithHistoryExpected extends Error {
  constructor() {
    super('calledOnContract matcher requires provider that support call history');
  }
}

export class EncodingError extends Error {
  error: Error | undefined;
}

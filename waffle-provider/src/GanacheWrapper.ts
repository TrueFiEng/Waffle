import Ganache from 'ganache-core';

export class GanacheWrapper {
  provider: any; // TODO: fixme
  preprocessCallback?: (request: any, error: any, response: any) => Promise<void>

  constructor(options: Ganache.IProviderOptions) {
    this.provider = Ganache.provider(options);
  }

  sendAsync(request: { method: string; params?: any[] }, callback: (error: any, response: any) => void) {
    this.provider.sendAsync(request, async (error: any, response: any) => {
      await this.preprocessCallback?.(request, error, response);
      callback(error, response);
    });
  }
}

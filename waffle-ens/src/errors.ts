export class MissingDomain extends Error {
  constructor(domain: string) {
    super(`Domain ${domain} doesn't exist.`);
  }
}

export class MissingTopLevelDomain extends Error {
  constructor(domain: string) {
    super(`Top level domain ${domain} doesn't exist.`);
  }
}

export class InvalidDomain extends Error {
  constructor(domain: string) {
    super(`Invalid domain: '${domain}'`);
  }
}

export class NoTopLevelDomain extends Error {
  constructor() {
    super('Invalid domain. Please, enter no top level domain.');
  }
}

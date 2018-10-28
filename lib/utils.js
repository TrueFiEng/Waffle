import fs from 'fs';

export const readFileContent = (path) =>
  fs.readFileSync(path).toString();

export const isPositiveIntegerString = (string) =>
  /^\d+$/.test(string);

export const eventParseResultToArray = (eventResult) =>
  Object.keys(eventResult)
    .filter(isPositiveIntegerString)
    .map((key) => eventResult[key]);

export const isWarningMessage = (error) =>
  /: Warning: /.test(error);

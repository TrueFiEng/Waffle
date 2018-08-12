import fs from 'fs';

export const readFileContent = (path) =>
  fs.readFileSync(path).toString();

export const arrayIntersection = (array1, array2) =>
  array1.filter((element) => array2.includes(element));

export const isPositiveIntegerString = (string) =>
  /^\d+$/.test(string);

export const eventParseResultToArray = (eventResult) =>
  Object.keys(eventResult)
    .filter(isPositiveIntegerString)
    .map((key) => eventResult[key]);

export const isWarningMessage = (error) =>
  /: Warning: /.test(error);

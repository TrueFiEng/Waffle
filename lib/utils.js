import fs from 'fs';

export const readFileContent = (path) => 
  fs.readFileSync(path).toString();  
  
export const arrayIntersection = (array1, array2) =>
  array1.filter((element) => array2.includes(element));

import fs from 'fs';

export const fileContent = (path) => 
  fs.readFileSync(path).toString();  


import fs from 'fs';

export const fileContent = (path) => {
  return fs.readFileSync(path).toString();  
};

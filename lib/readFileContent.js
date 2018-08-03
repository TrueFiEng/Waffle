import fs from 'fs';

const readFileContent = (path) => 
  fs.readFileSync(path).toString();  
  
export default readFileContent;

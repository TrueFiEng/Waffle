import fs from 'fs';
import path from 'path';

export default class WrapperBase {
  async saveOutput(output, targetPath) {
    for (const key of Object.keys(output.contracts)) {
      const [, fileName] = key.split(':');
      const filePath = path.join(targetPath, `${fileName}.json`);
      const dirPath = path.dirname(filePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }
      const content = output.contracts[key];
      content.evm = {bytecode: {object: content.bin}};
      content.abi = JSON.parse(content.abi);
      try {
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
      } catch (err) {
        this.console.error(err);
      }
    }
  }
}

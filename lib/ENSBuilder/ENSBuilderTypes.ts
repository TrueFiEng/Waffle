import {Contract} from 'ethers';

export interface Registrars {
  [x: string]: Contract;
}

import Ganache from 'ganache-core';  
import Web3 from 'web3';

export async function createWeb3() {
  const web3 = new Web3();  
  web3.setProvider(Ganache.provider);      
  return {web3};
}

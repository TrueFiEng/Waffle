// import {createWeb3} from '../lib/waffle'
// import StandardToken from '../build/StandardToken.json';

// describe('StandardToken', () => {
//   const amount = 100;
//   let web3;
//   let accounts;
//   let token;
//   let to;
//   let from;

//   beforeEach(async () => {
//     ({web3, accounts} = createWeb3());
//     [from, to]= account;
//     token = await deployContract(StandardTokenMock.new(from, amount));
//   });
  
//   it("Should transfer", async () => {
//     await token.methods.transfer(to, amount).send({from});
//     expect(await token.balanceOf(from)).to.eq('0');
//     expect(await token.balanceOf(to)).to.eq('0');
//   });
  
//   it("Transfer should emit event", async () => {
//     expect(token.methods.transfer(to, amount).send({from})).to
//       .to.emitEvent('Transfered')
//       .withParams(from, to, amount);
//   });
// });

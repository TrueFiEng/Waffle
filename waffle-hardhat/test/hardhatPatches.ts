import { waffle } from 'hardhat'
import { utils } from 'ethers'

// const callHistory = []

const init = (waffle.provider as any)._hardhatNetwork.provider._wrapped._wrapped._wrapped._init

// function patchCallHistory() {
//   (waffle.provider as any)._hardhatNetwork.provider._wrapped._wrapped._wrapped._node._vmTracer._vm.on('beforeMessage', (message) => {
//     if (message.to) {
//       callHistory.push({
//         address: utils.getAddress(message.to.toString()),
//         data: `0x${message.data.toString('hex')}`,
//       })
//     }
//   })
// }

function patchSkipGasCostCheck() {
  const originalProcess = (waffle.provider as any)._hardhatNetwork.provider._wrapped._wrapped._wrapped._ethModule.processRequest.bind(
    (waffle.provider as any)._hardhatNetwork.provider._wrapped._wrapped._wrapped._ethModule,
  )
  ;(waffle.provider as any)._hardhatNetwork.provider._wrapped._wrapped._wrapped._ethModule.processRequest = (
    method: string,
    params: any[],
  ) => {
    if (method === 'eth_estimateGas') {
      return '0xB71B00'
    } else {
      return originalProcess(method, params)
    }
  }
}

(waffle.provider as any)._hardhatNetwork.provider._wrapped._wrapped._wrapped._init = async function () {
  await init.apply(this)
  if ((waffle.provider as any)._hardhatNetwork.provider._wrapped._wrapped._wrapped._node._vmTracer._vm.listenerCount('beforeMessage') < 2) {
    // patchCallHistory()
    patchSkipGasCostCheck()
  }
}

const proxyProvider = new Proxy(waffle.provider, {
  get(target: any, name) {
    // if (name === 'callHistory') {
    //   return callHistory
    // }
    return target[name]
  },
})

// proxyProvider.clearCallHistory = () => {
//   callHistory.length = 0
// }

export { proxyProvider }

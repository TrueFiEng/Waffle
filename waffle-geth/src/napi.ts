export const addon = require('bindings')('addon.node')

console.log('This should be eight:', addon.cgoCurrentMillis())

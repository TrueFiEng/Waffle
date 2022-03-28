[![CircleCI](https://circleci.com/gh/EthWorks/Waffle.svg?style=svg)](https://circleci.com/gh/EthWorks/Waffle)
[![](https://img.shields.io/npm/v/@ethereum-waffle/provider.svg)](https://www.npmjs.com/package/@ethereum-waffle/provider)

![Ethereum Waffle](https://raw.githubusercontent.com/EthWorks/Waffle/master/docs/source/logo.png)

# @ethereum-waffle/geth

**Tested on Intel cpus: make sure native libraries and installed node_modules match desired architecture**

# `./go`
Go implementation of the node.

## `./go/main` - C API.

`make build` to build. Builds both statically and dynamically linked binaries. **Watch out for the arch of the binary.**

`CGO_ENABLED=1 GOOS=darwin GOARCH=amd64 make build` - to build for intel

Can be also loaded though `ffi-napi` package but slow.

# `./napi` - Bindings between NAPI (Node.JS) and GO's C API.

`yarn node-gyp configure build` to build.
Builds `*.node` file which can be `require`d.
Faster than `ffi-napi`.
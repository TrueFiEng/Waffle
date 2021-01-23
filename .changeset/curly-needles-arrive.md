---
"@ethereum-waffle/chai": patch
"ethereum-waffle": patch
"@ethereum-waffle/compiler": patch
"@ethereum-waffle/e2e": patch
"@ethereum-waffle/ens": patch
"@ethereum-waffle/jest": patch
"@ethereum-waffle/mock-contract": patch
"@ethereum-waffle/provider": patch
---

- Allow asserting events on previously executed transactions (#424)
- Make BN matchers compatible with chai's lengthOf (#423)
- expect().to.emit().withArgs() - add assertion for indexed dynamic size parameters (#413)
- Add hexEqual matcher (#415)
- Update types for matchers to explicitly return promises (#403)
- Update dev dependencies, replace node 11 with 14

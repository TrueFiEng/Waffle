@startuml

title ENSBuilder

actor User
participant ENS
participant Resolver
participant EthRegistrar
participant FIFSRegistrar2

== Get resolver ==
User -> ENS: resolver('eth')

== Get registrar ==
User -> ENS: owner('eth')

== builder.createTopLevelDomain('eth') ==
User -> EthRegistrar: construtor(ens, 'eth')
User -> ENS: setSubnodeOwner(HashZero, 'ethworks.eth', ethRegistrar)

== builder.createDomain('ethworks.eth') ==
User -> ENS: owner('eth')
User -> ENS: setResolver(namehash('ethworks.eth'), resolver)
User -> FIFSRegistrar2: construtor(ens, 'ethworks.eth')
User -> ENS: setOwner(namehash('ethworks.eth'), FIFSRegistrar2)

== buidler.setAddress('vald.ethworks.eth', '0x99..99') ==
User -> ENS: owner('ethworks.eth')
User -> FIFSRegistrar2: register(namehash('vlad.ethworks.eth'), wallet)
User -> ENS: setResolver('vlad.ethworks.eth', resolver)
User -> Resolver: addr('vald.ethworks.eth', '0x99..99')

@enduml

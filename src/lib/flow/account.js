import fcl from "@onflow/fcl"
import t from "@onflow/types"

import utilEncodeKey from "@onflow/util-encode-key"
const {
  ECDSA_P256,
  ECDSA_secp256k1,
  SHA2_256,
  SHA3_256,
  encodeKey,
} = utilEncodeKey

import {sendTransaction} from "./send.js"

const sigAlgos = {
  ECDSA_P256: ECDSA_P256,
  ECDSA_secp256k1: ECDSA_secp256k1,
}

const hashAlgos = {
  SHA2_256: SHA2_256,
  SHA3_256: SHA3_256,
}

const accountKeyWeight = 1000
const initialStorageDeposit = "0.5"

function txCreateAccount(contracts) {
return `
import FungibleToken from ${contracts.FungibleToken}
import FlowToken from ${contracts.FlowToken}

transaction(publicKey: String, storageDeposit: UFix64) {

  let account: AuthAccount
  let storageDepositVault: @FungibleToken.Vault

  prepare(signer: AuthAccount) {
    self.account = AuthAccount(payer: signer)

    let vaultRef = signer
      .borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!

    self.storageDepositVault <- vaultRef.withdraw(amount: storageDeposit)
  }

  execute {
    self.account.addPublicKey(publicKey.decodeHex())

    let receiverRef = self.account
      .getCapability(/public/flowTokenReceiver)
      .borrow<&{FungibleToken.Receiver}>()!

    receiverRef.deposit(from: <-self.storageDepositVault)

    // TODO: Initialize account with resourcess
  }
}
`
}

export async function createAccount(
  publicKey,
  sigAlgo,
  hashAlgo,
  authorization,
  contracts
) {
  const encodedPublicKey = encodeKey(
    publicKey, 
    sigAlgos[sigAlgo], 
    hashAlgos[hashAlgo], 
    accountKeyWeight,
  )

  const result = await sendTransaction({
    transaction: txCreateAccount(contracts),
    args: [
      fcl.arg(encodedPublicKey, t.String),
      fcl.arg(initialStorageDeposit, t.UFix64),
    ],
    authorizations: [authorization],
    payer: authorization,
    proposer: authorization,
  })

  const accountCreatedEvent = result.events[0].data

  return accountCreatedEvent.address
}

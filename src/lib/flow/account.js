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

const txCreateAccount = `
transaction(publicKey: String) {

  let account: AuthAccount

  prepare(signer: AuthAccount) {
    self.account = AuthAccount(payer: signer)
  }

  execute {
    self.account.addPublicKey(publicKey.decodeHex())

    // TODO: Initialize account with resourcess
  }
}
`

export async function createAccount(
  publicKey,
  sigAlgo,
  hashAlgo,
  authorization
) {
  const encodedPublicKey = encodeKey(
    publicKey, 
    sigAlgos[sigAlgo], 
    hashAlgos[hashAlgo], 
    accountKeyWeight,
  )

  const result = await sendTransaction({
    transaction: txCreateAccount,
    args: [
      fcl.arg(encodedPublicKey, t.String),
    ],
    authorizations: [authorization],
    payer: authorization,
    proposer: authorization,
  })

  const accountCreatedEvent = result.events[0].data

  return accountCreatedEvent.address
}

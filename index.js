import fcl from "@onflow/fcl"

import {
  createAccount, 
  getAuthorization,
  sendTransaction,
} from "./src/lib/flow/index.js"
import {sigAlgos, hashAlgos, generateKeyPair} from "./src/lib/crypto.js"
import config from "./src/config.js"

fcl.config().put("accessNode.api", config.accessApiHost)

async function run() {

  const sigAlgo = sigAlgos.ECDSA_secp256k1
  const hashAlgo = hashAlgos.SHA3_256

  const { privateKey, publicKey } = generateKeyPair(sigAlgo)

  console.log("Generated new user key pair")
  console.log("Private key", privateKey)
  console.log("Public key", publicKey)

  const creatorAuthorization = getAuthorization(
    config.signerAddress,
    config.signerPrivateKey,
    config.signerSigAlgo,
    config.signerHashAlgo,
    config.signerKeyIndex,
  )
  
  const address = await createAccount(
    publicKey,
    sigAlgo,
    hashAlgo,
    creatorAuthorization,
  )

  console.log("User account created")
  console.log("Address", fcl.display(address))

  const userAuthorization = getAuthorization(
    address,
    privateKey,
    sigAlgo,
    hashAlgo,
    0,
  )

  console.log("Sending transaction from user account")

  await sendTransaction({
    transaction: `
      transaction {
        prepare(signer: AuthAccount) {
          log("Hello, World!")
          log(signer.address)
        }
      }
    `,
    authorizations: [userAuthorization],
    payer: userAuthorization,
    proposer: userAuthorization,
  })

  console.log("Transaction sent")
}

run()

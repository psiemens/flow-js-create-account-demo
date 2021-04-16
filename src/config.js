import dotenv from "dotenv"

const chainEmulator = "emulator"
const chainTestnet = "testnet"

const contractsEmulator = {
  FlowToken: "0x0ae53cb6e3f42a79",
  FungibleToken: "0xee82856bf20e2aa6",
}

const contractsTestnet = {
  FlowToken: "0x7e60df042a9c0868",
  FungibleToken: "0x9a0766d93b6608b7",
}

function getContracts(chain) {
  chain = chain || chainEmulator

  switch (chain) {
    case chainEmulator:
      return contractsEmulator
    case chainTestnet:
      return contractsTestnet
  }

  throw `Invalid chain: ${chain}`
}

function getConfig() {
  dotenv.config()

  return {
    accessApiHost:    process.env.ACCESS_API_HOST                || "http://localhost:8080",
    signerAddress:    process.env.SIGNER_ADDRESS                 || "f8d6e0586b0a20c7",
    signerPrivateKey: process.env.SIGNER_PRIVATE_KEY             || "274939297cb7c5d1f7d27bec6946ffdd6ad5e7f88b5daf42d17e8d02967a6db2",
    signerSigAlgo:    process.env.SIGNER_SIG_ALGO                || "ECDSA_P256",
    signerHashAlgo:   process.env.SIGNER_HASH_ALGO               || "SHA3_256",
    signerKeyIndex:   parseInt(process.env.SIGNER_KEY_INDEX, 10) || 0,
    contracts:        getContracts(process.env.CHAIN),
  }
}

export default getConfig

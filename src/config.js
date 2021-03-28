export default {
  accessApiHost:    process.env.ACCESS_API_HOST    || "http://localhost:8080",
  signerAddress:    process.env.SIGNER_ADDRESS     || "f8d6e0586b0a20c7",
  signerPrivateKey: process.env.SIGNER_PRIVATE_KEY || "274939297cb7c5d1f7d27bec6946ffdd6ad5e7f88b5daf42d17e8d02967a6db2",
  signerSigAlgo:    process.env.SIGNER_SIG_ALGO    || "ECDSA_P256",
  signerHashAlgo:   process.env.SIGNER_HASH_ALGO   || "SHA3_256",
  signerKeyIndex:   process.env.SIGNER_KEY_INDEX   || 0,
}

import fcl from "@onflow/fcl"

import {signWithPrivateKey} from "../crypto.js"

export const getAuthorization = (
  signerAddress,
  signerPrivateKey,
  signerSigAlgo,
  signerHashAlgo,
  signerKeyIndex = 0,
) => {
  return async (account = {}) => {
    return {
      ...account,
      tempId: "SIGNER",
      addr: fcl.sansPrefix(signerAddress),
      keyId: signerKeyIndex,
      signingFunction: data => ({
        addr: fcl.withPrefix(signerAddress),
        keyId: signerKeyIndex,
        signature: signWithPrivateKey(
          signerPrivateKey,
          signerSigAlgo,
          signerHashAlgo,
          data.message
        ),
      }),
    }
  }
}

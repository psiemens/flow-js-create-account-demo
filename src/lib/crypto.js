import {createHash} from "crypto"

import sha3 from "sha3"
const {SHA3} = sha3;

import elliptic from "elliptic";
const {ec: EC} = elliptic;

export const sigAlgos = {
  ECDSA_P256: "ECDSA_P256",
  ECDSA_secp256k1: "ECDSA_secp256k1",
}

export const hashAlgos = {
  SHA2_256: "SHA2_256",
  SHA3_256: "SHA3_256",
}

const signers = {
  ECDSA_P256: () => new EC("p256"),
  ECDSA_secp256k1: () => new EC("secp256k1"),
}

const hashSHA2 = msg => {
  const sha = createHash("sha256")
  sha.update(Buffer.from(msg, "hex"))
  return sha.digest()
}

const hashSHA3 = msg => {
  const sha = new SHA3(256)
  sha.update(Buffer.from(msg, "hex"))
  return sha.digest()
}

const hashers = {
  SHA2_256: hashSHA2,
  SHA3_256: hashSHA3,
}

const getSigner = sigAlgo => signers[sigAlgo]()
const getHasher = hashAlgo => hashers[hashAlgo]

function encodePrivateKey(privateKey) {
  return privateKey.toArrayLike(Buffer, "be").toString("hex")
}

// encodedPublicKey = bigEndianBytes(X) + bigEndianBytes(Y)
function encodePublicKey(publicKey) {
  const x = publicKey.getX().toArrayLike(Buffer, "be")
  const y = publicKey.getY().toArrayLike(Buffer, "be")

  return Buffer.concat([x, y]).toString("hex")
}

export function generateKeyPair(sigAlgo) {
  const signer = getSigner(sigAlgo)
  const keyPair = signer.genKeyPair()

  return {
    privateKey: encodePrivateKey(keyPair.getPrivate()),
    publicKey: encodePublicKey(keyPair.getPublic()),
  }
}

function encodeSignature(sig) {
  const n = 32
  const r = sig.r.toArrayLike(Buffer, "be", n)
  const s = sig.s.toArrayLike(Buffer, "be", n)

  return Buffer.concat([r, s]).toString("hex")
}

export function signWithPrivateKey(privateKey, sigAlgo, hashAlgo, msg) {
  const signer = getSigner(sigAlgo)
  const hasher = getHasher(hashAlgo)

  const key = signer.keyFromPrivate(Buffer.from(privateKey, "hex"))
  const digest = hasher(msg)

  const sig = key.sign(digest)

  return encodeSignature(sig)
}

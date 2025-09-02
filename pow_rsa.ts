import * as crypto from "crypto";

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048, // Recommended key size
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

const HASH = "00007f3abb65aaa427e3fe1d24c589a980b2b361c63f0019aa37771298cd0b8e";
function generateSignature(data: string): string {
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(data);
  const signature = signer.sign(privateKey, "base64");
  return signature;
}

function verifySigner(signature: string, dataToVerify: string): boolean {
  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(dataToVerify);
  const isVerified = verifier.verify(publicKey, signature, "base64");
  return isVerified;
}
const signature = generateSignature(HASH);
console.log("signature", signature);
if (signature) {
  const isVerified = verifySigner(signature, HASH);
  console.log(`isVerified: ${isVerified}`);
}

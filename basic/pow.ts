import { createHash } from "crypto";

const NAME = "chopper";
function generateSha256Hash(data: string): string {
  const hash = createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
}

function matchPrefix(
  prefix: string
): { usedTime: number; hashKey: string; hashVar: string } | null {
  let startTime = Date.now();
  let sha256Hash_ = "";
  let nonce;
  for (let i = 0; i < 1000000000; i++) {
    const sha256Hash = generateSha256Hash(NAME + i);
    if (sha256Hash.startsWith(prefix)) {
      nonce = i;
      sha256Hash_ = sha256Hash;
      break;
    }
  }
  let endTime = Date.now();
  const usedTime = endTime - startTime;
  if (nonce === undefined) {
    return null;
  }
  return { usedTime, hashKey: NAME + nonce, hashVar: sha256Hash_ };
}
const result1 = matchPrefix("0000");
const result2 = matchPrefix("00000");
if (result1 !== null) {
  console.log(
    `0000 usedTime: ${result1.usedTime} ms, hash key: ${result1.hashKey}, value: ${result1.hashVar} `
  );
}
if (result2 !== null) {
  console.log(
    `00000 usedTime: ${result2.usedTime} ms, hash key: ${result2.hashKey}, value: ${result2.hashVar} `
  );
}

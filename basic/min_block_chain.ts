import * as crypto from "crypto";

type Transaction = {
  sender: string;
  recipient: string;
  amount: number;
};

type Block = {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previous_hash: string;
  proof: number;
};

class Blockchain {
  private chain: Block[];
  private currentTransactions: Transaction[];

  constructor() {
    this.chain = [];
    this.currentTransactions = [];
  }

  private isValidProof(lastProof: number, proof: number): boolean {
    const guess = `${lastProof}${proof}`;
    const guessHash = crypto.createHash("sha256").update(guess).digest("hex");
    return guessHash.startsWith("0000");
  }

  proofOfWork(lastProof: number): number {
    let proof = 0;
    while (!this.isValidProof(lastProof, proof)) {
      proof += 1;
    }
    return proof;
  }

  addNewTransaction(sender: string, recipient: string, amount: number): number {
    this.currentTransactions.push({
      sender,
      recipient,
      amount,
    });
    return this.lastBlock.index + 1;
  }

  getChain(): Block {
    return [...this.chain];
  }
}

if (require.main === module) {
  const blockchain = new Blockchain();
  blockchain.addNewTransaction("Alice", "Bob", 5);
}

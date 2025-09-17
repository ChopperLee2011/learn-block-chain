import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Bank", () => {
  let bank: any, owner: any, user: any;
  const amount = ethers.parseEther("1.0");
  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    bank = await ethers.deployContract("PiggyBank");
  });

  it("should allow to receive Eth and emit EventReceived", async () => {
    const address = await bank.getAddress(); // or bank.target
    await expect(user.sendTransaction({ to: address, value: amount }))
      .to.emit(bank, "EventReceived")
      .withArgs(user.address, amount);
    expect((await bank.getBalance()).toString()).to.equal(amount.toString());
  });

  it("should allow to withdraw Eth and emit EventWithdraw", async () => {
    const address = await bank.getAddress();
    await user.sendTransaction({ to: address, value: amount });
    await expect(bank.withdraw(user.address, amount))
      .to.emit(bank, "EventWithdraw")
      .withArgs(user.address, amount);
  });

  it("should throw error when receive Eth is 0", async () => {
    const address = await bank.target;
    await expect(
      user.sendTransaction({ to: address, value: 0 })
    ).to.be.revertedWith("Must be some Ether.");
  });

  it("should throw error when withdraw Eth is 0", async () => {
    await expect(bank.withdraw(user.address, 0)).to.be.revertedWith(
      "Must be some Ether."
    );
  });

  it("should throw error when withdraw Eth is greater then balance", async () => {
    const address = await bank.target;
    await user.sendTransaction({ to: address, value: amount });
    const withdrawAmount = ethers.parseEther("2.0");
    await expect(
      bank.withdraw(user.address, withdrawAmount)
    ).to.be.revertedWith("Insufficient balance.");
  });

  it("should throw error when withdraw is not from contract owner", async () => {
    const address = await bank.target;
    await user.sendTransaction({ to: address, value: amount });
    const withdrawAmount = ethers.parseEther("1.0");
    await expect(
      bank.connect(user).withdraw(user.address, withdrawAmount)
    ).to.be.revertedWith("Only owner can withdraw.");
  });
});

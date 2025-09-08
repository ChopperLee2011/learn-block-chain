import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Counter", function () {
  let counter: any;
  beforeEach(async () => {
    counter = await ethers.deployContract("Counter");
  });

  it("should increment the counter", async function () {
    await expect(counter.increment(5))
      .to.emit(counter, "plusNumLog")
      .withArgs(5);
    expect(await counter.get()).to.equal(5);
  });

  it("should decrement the counter", async function () {
    await counter.increment(5);
    await expect(counter.decrement(2))
      .to.emit(counter, "minusNumLog")
      .withArgs(2);
    expect(await counter.get()).to.equal(3);
  });

  it("should throw error if num is 0", async () => {
    await expect(counter.increment(0)).to.be.revertedWith("invalid number");
    await expect(counter.decrement(0)).to.be.revertedWith("invalid number");
  });
});

import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();
const amount = ethers.parseUnits("1", "ether");

describe("MyToken", () => {
  let myToken: any;

  beforeEach(async () => {
    myToken = await ethers.deployContract("MyToken", [amount]);
  });

  it("should able to mint", async () => {
    expect(await myToken.totalSupply()).to.equal(amount);
  });
});

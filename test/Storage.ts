import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect({
  network: "hardhatMainnet",
  chainType: "l1",
});

describe("Storage", () => {
  let storage: any;
  beforeEach(async () => {
    const Storage = await ethers.getContractFactory("Storage");
    storage = await Storage.deploy(1, "hello");
    await storage.waitForDeployment();
  });
  it("should init x and ans correctly", async () => {
    expect(await storage.getX()).to.equal(1);
    expect(await storage.getAns()).to.equal("hello");
  });
  it("should set x", async () => {
    await storage.setX(2);
    expect(await storage.getX()).to.equal(2);
  });
  it("should set ans", async () => {
    await storage.setAns("world");
    expect(await storage.getAns()).to.eql("world");
  });
});

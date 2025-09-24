import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

const name = "Chopper Token";
const symbol = "CTKN";

describe("ERC20", () => {
  let erc20: any, owner: any, user: any, user2: any;

  beforeEach(async () => {
    [owner, user, user2] = await ethers.getSigners();
    erc20 = await ethers.deployContract("ERC20", [name, symbol]);
  });

  it("should able to init", async () => {
    expect(await erc20.name()).to.equal(name);
    expect(await erc20.symbol()).to.equal(symbol);
    expect(await erc20.decimals()).to.equal(18);
    expect(await erc20.totalSupply()).to.equal(0);
  });

  it("should able to mint", async () => {
    const amount = ethers.parseUnits("1", "ether");
    await erc20.mint(amount);
    expect(await erc20.totalSupply()).to.equal(amount);
  });

  it("can transfer token", async () => {
    const amount = ethers.parseUnits("1", "ether");
    await erc20.mint(amount);
    await erc20.transfer(user, ethers.parseUnits("100", "wei"));
    expect(await erc20.balanceOf(user)).to.equal(100);
  });

  it("can transfer token from some user", async () => {
    const amount = ethers.parseUnits("1", "ether");
    await erc20.mint(amount);
    await erc20.transferFrom(owner, user, ethers.parseUnits("100", "wei"));
    expect(await erc20.balanceOf(user)).to.equal(100);
    await erc20.transferFrom(user, user2, ethers.parseUnits("100", "wei"));
    expect(await erc20.balanceOf(user)).to.equal(0);
    expect(await erc20.balanceOf(user2)).to.equal(100);
    await expect(
      erc20.transferFrom(owner, user, ethers.parseUnits("100", "wei"))
    )
      .to.emit(erc20, "Transfer")
      .withArgs(owner, user, 100);
  });
});

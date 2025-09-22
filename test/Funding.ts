import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Funding", () => {
  let funding: any, owner: any, user: any, user2: any, user3: any;
  beforeEach(async () => {
    funding = await ethers.deployContract("Funding");
    [owner, user, user2, user3] = await ethers.getSigners();
    const deadline = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // one week
    await funding.createProject(
      "AI hospital helper",
      "an AI agent who can QA any hospital question.",
      deadline,
      10000
    );
  });

  it("should able to create new project", async () => {
    const deadline = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // one week
    await funding.createProject(
      "AI travel helper",
      "an AI agent who can generate a travel plan for user",
      deadline,
      100n
    );
    expect(await funding.projectCount()).to.equal(2n);
    const project = await funding.projects(1);
    expect(project[0]).to.equal("AI travel helper");
    expect(project[1]).to.equal(
      "an AI agent who can generate a travel plan for user"
    );
    expect(project[2]).to.equal(owner);
    expect(project[3]).to.be.a("bigint");
    expect(project[4]).to.equal(100n);
    expect(project[5]).to.equal(0n);
    expect(project[6]).to.equal(0n);
  });

  it("should accept donation", async () => {
    const amount = ethers.parseUnits("1", "ether");
    const pId = 0n;
    await funding.connect(user).donate(pId, { value: amount });
    const project = await funding.projects(0);
    // check project donation amount get this coin.
    expect(project[5]).to.equal(amount);
    // check project donation list has this record.
    const userDonorAmount = await funding.getProjectDonationByPerson(0n, user);
    expect(userDonorAmount).to.equal(amount);
  });

  it("should accept to refund", async () => {
    const amount = ethers.parseUnits("1", "ether");
    const pId = 0;
    await funding.connect(user).donate(pId, { value: amount });
    await funding.connect(user).refund(pId);
    expect((await funding.projects(0))[5]).to.be.equal(0n);
  });

  it("should accept to withdraw", async () => {
    const deadline = Math.floor(Date.now() / 1000) + 86400 * 7;
    await funding.createProject(
      "withdraw tester",
      "an test project for withdraw method.",
      deadline,
      10n
    );
    const beforeDonorBalance = await ethers.provider.getBalance(owner);
    const user2amount = ethers.parseUnits("1", "ether");
    const user3amount = ethers.parseUnits("100", "ether");
    const pId = 1n;
    await funding.connect(user2).donate(pId, { value: user2amount });
    await funding.connect(user3).donate(pId, { value: user3amount });
    const donateAmount = (await funding.projects(1))[5];
    await ethers.provider.send("evm_increaseTime", [86400 * 7]);
    await ethers.provider.send("evm_mine");
    await funding.withdraw(pId);
    const afterWithdrawAmount = await ethers.provider.getBalance(owner);
    expect(afterWithdrawAmount)
      .to.be.lt(beforeDonorBalance + donateAmount)
      .and.to.be.gt(beforeDonorBalance);
  });
});

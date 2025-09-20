import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect({
  network: "hardhatMainnet",
  chainType: "l1",
});

describe("Vote", () => {
  let vote: any, owner: any, user: any, user2: any, user3: any;

  beforeEach(async () => {
    const proposalStrings = ["Proposal 1", "Proposal 2", "Proposal 3"];
    const proposalBytes32 = proposalStrings.map(ethers.encodeBytes32String);
    [owner, user, user2, user3] = await ethers.getSigners();
    const Vote = await ethers.getContractFactory("Vote");
    vote = await Vote.deploy(proposalBytes32);
    await vote.waitForDeployment();
  });

  it("should able to init", async () => {
    const chairperson = await vote.chairperson();
    expect(typeof chairperson).to.be.a("string");
    const proposal = await vote.proposals(0);
    expect(proposal[0]).to.be.a("string");
    expect(proposal[1]).to.be.a("bigint");
  });

  it("should allow chairperson to give right to vote", async () => {
    expect(await vote.voters(user)).to.eql([0n, false, 0n]);
    await vote.connect(owner).giveRightToVote(user);
    expect(await vote.voters(user)).to.eql([1n, false, 0n]);
  });

  it("should reject normal user to give right to vote", async () => {
    await expect(vote.connect(user).giveRightToVote(user)).to.revertedWith(
      "Only chairperson can give right to vote."
    );
  });

  it("should allow user to vote", async () => {
    await vote.connect(owner).giveRightToVote(user);
    await vote.connect(user).vote(2);
    expect(await vote.voters(user)).eql([1n, true, 2n]);
  });

  it("should return winner", async () => {
    await Promise.all(
      [user, user2, user3].map((u) => vote.connect(owner).giveRightToVote(u))
    );
    await vote.connect(user).vote(1);
    await vote.connect(user2).vote(1);
    await vote.connect(user3).vote(2);
    expect(await vote.winningProposal()).to.eql(1n);
  });
});

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Ownership", function () {
  it("Should return the new greeting once it's changed", async function () {
    const demo = await ethers.getContractFactory("Election");
    const Demo = await demo.deploy();
    await Demo.deployed();

    expect(await Demo.candidateName()).to.equal("Candidate 1");

    const setDemo = await Demo.setCandidate("Bilal");

    await setDemo.wait();

    console.log(await Demo.candidater())

    expect(await Demo.candidateName()).to.equal("Bilal");
  });
});

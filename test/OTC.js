const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
describe("OTC", function () {
  async function deployOTC() {
    const [owner, otherAccount] = await ethers.getSigners();

    const OTC = await ethers.getContractFactory("OTC");
    const otc = await OTC.deploy();

    return { otc, owner, otherAccount };
  }
  describe("Deployment", function () {
    it("Should deposit to the contract", async function () {
      const { otc } = await loadFixture(deployOTC);
      const [user1] = await ethers.getSigners();
      const depAmt = 1;
      await otc.connect(user1).deposit(depAmt, { value: 1 });

      expect(await otc.deposits(user1.address)).to.equal(BigInt(1));
      // checks the txHistory list
      expect((await otc.TxHistoryList(0))[0]).to.equal(1);
      expect((await otc.TxHistoryList(0))[1]).to.equal(user1.address);
      expect((await otc.TxHistoryList(0))[2]).to.equal(otc.target);
      expect((await otc.TxHistoryList(0))[3]).to.equal(BigInt(1));
    });
    it("Should throw error Deposit : wrong amt deposist", async function () {
      const { otc } = await loadFixture(deployOTC);
      const [user1] = await ethers.getSigners();
      const depAmt = 10;
      const actualdepAmt = 100;
      await expect(
        otc.connect(user1).deposit(depAmt, { value: 100 })
      ).to.be.revertedWith("ETH Amount Error");
    });
    it("Should withdraw from the contract by whiltelist address", async function () {
      const { otc } = await loadFixture(deployOTC);
      const [user1, user2] = await ethers.getSigners();
      const depAmt = 100;
      const withdrawAmt = 50;
      await otc.connect(user1).deposit(depAmt, { value: 100 });
      expect(await otc.deposits(user1.address)).to.equal(BigInt(depAmt));
      await otc.connect(user1).whitelistAddr(user2.address);
      await otc
        .connect(user2)
        .Withdraw(withdrawAmt, user2.address, user1.address);
      expect(await otc.deposits(user1.address)).to.equal(
        BigInt(depAmt - withdrawAmt)
      );
    });
    it("Should throw error not whitelisted address", async function () {
      const { otc } = await loadFixture(deployOTC);
      const [user1, user2] = await ethers.getSigners();
      const depAmt = 100;
      const withdrawAmt = 50;
      await otc.connect(user1).deposit(depAmt, { value: 100 });
      expect(await otc.deposits(user1.address)).to.equal(BigInt(depAmt));
      await expect(
        otc.connect(user2).Withdraw(withdrawAmt, user2.address, user1.address)
      ).to.be.revertedWith("Not Whitelisted");
    });
    it("Should throw error wrong  withdrawal: deposits amt is less than withdrawal amt ", async function () {
      const { otc } = await loadFixture(deployOTC);
      const [user1, user2] = await ethers.getSigners();
      const depAmt = 100;
      const withdrawAmt = 200;
      await otc.connect(user1).deposit(depAmt, { value: 100 });
      expect(await otc.deposits(user1.address)).to.equal(BigInt(depAmt));
      await otc.connect(user1).whitelistAddr(user2.address);
      await expect(
        otc.connect(user2).Withdraw(withdrawAmt, user2.address, user1.address)
      ).to.be.revertedWith("OTC : You dont have enough funds");
    });
    it("Should throw error wrong  withdrawal: deposits amt is 0 ", async function () {
      const { otc } = await loadFixture(deployOTC);
      const [user1, user2] = await ethers.getSigners();
      const withdrawAmt = 200;
      await expect(
        otc.connect(user2).Withdraw(withdrawAmt, user2.address, user1.address)
      ).to.be.revertedWith("Not Whitelisted");
    })
    it("Should throw error wrong  whitelisting : cant whitelisted wit 0 deposits ", async function () {
      const { otc } = await loadFixture(deployOTC);
      const [user1, user2] = await ethers.getSigners();

      await expect(
        otc.connect(user1).whitelistAddr(user2.address)
      ).to.be.revertedWith("OTC : You dont have enough funds");
    })

  });
});

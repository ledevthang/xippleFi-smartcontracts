import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { lock, parseEther } from "ethers";

describe("Lock", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployOneYearLockFixture () {


        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await hre.ethers.getSigners();

        const XRPL = await hre.ethers.getContractFactory("WXRP");
        const wxrp = await XRPL.deploy();

        return { wxrp, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("Should set the right unlockTime", async function () {
            const { wxrp, owner } = await loadFixture(deployOneYearLockFixture);

        });
    });

    describe("WXRP Token", function () {

        it("Should mint XRPL tokens", async function () {
            const { wxrp, owner } = await loadFixture(deployOneYearLockFixture);

            await wxrp.deposit({ value: parseEther('1') })

            const balance = await wxrp.balanceOf(owner.address)

            expect(balance).to.equal(parseEther('1'))

        });

        it("Should transfer XRPL tokens", async function () {
            const { wxrp, owner, otherAccount } = await loadFixture(deployOneYearLockFixture);



            await wxrp.deposit({ value: parseEther('1') })

            const balance = await wxrp.balanceOf(owner.address)

            expect(balance).to.equal(parseEther('1'))

            await wxrp.transfer(otherAccount.address, parseEther('0.5'))

            const anotherBalance = await wxrp.balanceOf(otherAccount.address)

            expect(anotherBalance).to.equal(parseEther('0.5'));

        });

        it("Should withdraw XRPL tokens", async function () {
            const { wxrp, owner, otherAccount } = await loadFixture(deployOneYearLockFixture);



            await wxrp.deposit({ value: parseEther('1') })

            const balance = await wxrp.balanceOf(owner.address)

            expect(balance).to.equal(parseEther('1'))

            await wxrp.transfer(otherAccount.address, parseEther('0.5'))

            const anotherBalance = await wxrp.balanceOf(otherAccount.address)

            expect(anotherBalance).to.equal(parseEther('0.5'));

            await wxrp.connect(otherAccount).withdraw(parseEther('0.5'))

            const xrpBalance = await otherAccount.provider.getBalance(otherAccount.address)

        });

    });
});

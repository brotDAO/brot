// tests for bread token contract

import { waffle, ethers } from "hardhat";
import chai from "chai";
import chaiAsPromised from 'chai-as-promised';

import  BrotArtifact  from '../artifacts/contracts/brottoken.sol/Brot.json';
import { Brot } from '../typechain';
import {  Wallet } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
// typechain contract artifacts are located in front end 


const { deployContract } = waffle;
const { expect } = chai;





describe("Brot Token Contract", () => {

    // Define contract type
    let bread: Brot;
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;
    let addr3: SignerWithAddress;
    let addrs: SignerWithAddress[];


    // Before each test we deploy our contract 
    beforeEach(async () => {

        // Get the signer from ethers (secret key)
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        // setup our contract and deploy
        bread = (await deployContract(
            owner,
            BrotArtifact
        )) as unknown as Brot;

        


    });


    describe("Deployment", () => {

        // test 1
        it("Should set correct contract owner", async () => {

            // Returns promise string with address of owner
            // const contractOwner = await bread.DEFAULT_ADMIN_ROLE();

            const contractAdminRole = await bread.DEFAULT_ADMIN_ROLE();

            const contractOwner = await bread.getRoleAdmin(contractAdminRole);
            // Assertion to check 
            expect(await bread.hasRole(contractAdminRole,owner.address)).to.equal(true);
        });

        // test 2
        it("Should mint 10 initial supply of tokens to the owner", async () => {
            // Returns owner balance for "BREAD"
            const ownerBalance = await bread.balanceOf(owner.address);

            // Returns total supply of BREAD
            const totalSupply = await bread.totalSupply();
            
            
            // Assertion
            expect(totalSupply).to.equal(ownerBalance);
        });


    })


    // 2
    describe("Minting", () => {


        it("Should mint the remaining 99,990 tokens to the owner", async ()=> {

            const ownerBalance = await bread.balanceOf(owner.address);

            if (ownerBalance.lt(100000) && ownerBalance.eq(10)) {
                // Mint 99,990 tokens to owner
                await bread.mint(owner.address, 99990);

 
            }
            const totalSupply = await bread.totalSupply();
            const newBalance = await bread.balanceOf(owner.address);

            expect(newBalance).to.equal(totalSupply);
        });
    })



    // 3
    describe("Transactions", () => {

        // test 1
        it("Should transfer tokens between accounts", async () => {

            // Transfer 50 tokens from owner to addr1
            await bread.transfer(addr1.address, 50);
            const addr1Balance = await bread.balanceOf(addr1.address);

            // assertion for addr1 balance
            expect(addr1Balance).to.equal(50);


            // Transfer 50 tokens from addr1 to addr2
            // Using .connect(signer) to send a transaction from another account (since we are the owner)
            await bread.connect(addr1).transfer(addr2.address, 50);
            const addr2Balance = await bread.balanceOf(addr2.address);

            // assertion for addr2 balance
            expect(addr2Balance).to.equal(50);
        });

        // test 2
        it("Should fail if the sender doesn't have enough tokens", async () => {

            // get the inital balance
            const initOwnerBalance = await bread.balanceOf(owner.address);

            // Attempt to send 1 token from addr1(0 tokens) to owner (999k tokens)
            // require will evaluate false and revert transaction
            await expect (
                bread.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWith("transfer amount exceeds balance");

            // The owner balance should not have changed,
            expect(await bread.balanceOf(owner.address)).to.equal(initOwnerBalance);
        });


        // test3
        it("Should update balances after transfers", async () => {
            // get our init balance
            const initOwnerBalance = await bread.balanceOf(owner.address);

            // transfer 100 token from owner to addr1
            await bread.transfer(addr1.address, 100);

            // transfer +50 from owner to addr2
            await bread.transfer(addr2.address, 50);


            // Check our balances
            const finalOwnerBalance = await bread.balanceOf(owner.address);
            // Assertion
            expect(finalOwnerBalance).to.equal(initOwnerBalance.sub(150));

            const addr1Balance = await bread.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(100);

            const addr2Balance = await bread.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });


    });



    //TODO: thoroughly test each function of the contract


    
});
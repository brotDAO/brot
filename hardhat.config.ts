import { HardhatUserConfig, task } from 'hardhat/config';
import "@nomiclabs/hardhat-waffle";
import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import 'hardhat-abi-exporter';
import 'hardhat-spdx-license-identifier';
import 'tsconfig-paths/register';

// key setup
const fs = require('fs');
const privateKey = fs.readFileSync(".secret").toString().trim();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",

  networks: {

    hardhat: {
      accounts: {
        mnemonic: "test test test test test test test test test test test junk", // test test test test test test test test test test test junk
      },
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/3befaad3be0d4a25b12651aadbcd02f5",
      accounts: [privateKey]
    },
    goerli: {
      url: "https://goerli.infura.io/v3/3befaad3be0d4a25b12651aadbcd02f5",
      accounts: [privateKey]
    },
    mumbai: {
      url: "https://polygon-mumbai.infura.io/v3/3befaad3be0d4a25b12651aadbcd02f5",
      accounts: [privateKey]
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/490519a8c6374fbeb1fbe2fd2ca39e1c",
      accounts: [`0x${privateKey}`]
    },
    matic_testnet: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [privateKey]
    },
    matic: {
      url: "https://rpc-mainnet.maticvigil.com",
      accounts: [privateKey]
    },
    bsc_testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [privateKey]
    }
  },
  
  solidity: {
    compilers: [ 
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },

  namedAccounts: {
    deployer: 0,
    tokenOwner: 0x1CD4935Eb3d7291b2B0782F9aF7525564D277E7B,
  },

  mocha: {
    timeout: 20000
  },

  abiExporter: {
    path: './data/abi',
    clear: true,
    spacing: 2
  },

  spdxLicenseIdentifier: {
    overwrite: false,
    runOnCompile: true,
  },

  
};


export default config;


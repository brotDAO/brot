// testing deploy from hardhat-react implementation

// TODO: Fix this shit, it's so lazy. who the fuck wants to go in here everytime and uncomment/copy paste to deploy a contract. wtf man?
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';


// Polygon mumbai child chain manager proxy address: 0xb5505a6d998549090530911180f38aC5130101c6
// Polygon mainnet child chain manager proxy address: 0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;

    const { deployer } = await getNamedAccounts();

    const POLYGON_PROXY_MAINNET = '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa';
    const POLYGON_PROXY_MUMBAI = '0xb5505a6d998549090530911180f38aC5130101c6';

    // await deploy("PbNFT", {
    //     from: deployer,
    //     contract: "PbNFT",
    //     args: [],
    //     log: true,
    // });

    // await deploy("Brot", {
    //     from: deployer,
    //     contract: "Brot",
    //     args:[],
    //     log: true,
    // });


    await deploy("ChildERC20", {
        from: deployer,
        contract: "ChildERC20",
        args: ['brotDAO', 'BROT', 18, POLYGON_PROXY_MAINNET],
        log: true,
    });

};

export default func;
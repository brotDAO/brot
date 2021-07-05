// SPDX-License-Identifier: MIT


/*
        __                              __      _______    ______    ______  
        /  |                            /  |    /       \  /      \  /      \ 
        $$ |____    ______     _____   _$$ |_   $$$$$$$  |/$$$$$$  |/$$$$$$  |
        $$      \  /      \  /      \ / $$   |  $$ |  $$ |$$ |__$$ |$$ |  $$ |
        $$$$$$$  |/$$$$$$  |/$$$$$$  |$$$$$$/   $$ |  $$ |$$    $$ |$$ |  $$ |
        $$ |  $$ |$$ |  $$/ $$ |  $$ |  $$ | __ $$ |  $$ |$$$$$$$$ |$$ |  $$ |
        $$ |__$$ |$$ |      $$ \__$$ |  $$ |/  |$$ |__$$ |$$ |  $$ |$$ \__$$ |
        $$    $$/ $$ |      $$    $$/   $$  $$/ $$    $$/ $$ |  $$ |$$    $$/ 
        $$$$$$$/  $$/        $$$$$$/     $$$$/  $$$$$$$/  $$/   $$/  $$$$$$/  
                                                                            
    --------------------------------------------------------------------------
    |equality and opportunity for artists and community.| 2021 @brotdao.eth  |
    --------------------------------------------------------------------------
    brot brechen. break bread.
    --------------------------------------------------------------------------
    V1 Contract. Imported from @bretth18/hardhat-dapp (origin project)


    - contract "Brot" is a "Matic Mintable" asset. allowing for gas efficient token controls
    on the Polygon L2 network and interoperable with Ethereum L1 mainnet. 
    - See https://docs.matic.network/docs/develop/ethereum-matic/mintable-assets for more info.

*/

pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

// Define token
contract Brot is 
    ERC20, 
    ERC20Burnable, 
    ERC20Snapshot, 
    AccessControl,
    Pausable {
    
    // Setup roles
    bytes32 public constant SNAPSHOT_ROLE = keccak256("SNAPSHOT_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    // MINTER_ROLE will be designated to the MintableERC20PredicateProxy contract to allow Matic Mintable Assets
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");



    constructor () ERC20("brotDAO", "BROT") {

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(SNAPSHOT_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);

        // Mint 10 tokens to deployer, we will mint the remaining 99,990 tokens on MATIC
        _mint(msg.sender, 10 * 10 ** decimals());

        _setupRole(MINTER_ROLE, msg.sender);

    }

    function snapshot() public {
        require(hasRole(SNAPSHOT_ROLE, msg.sender));
        _snapshot();
    }

    function pause() public {
        require(hasRole(PAUSER_ROLE, msg.sender));
        _pause();
    }

    function unpause() public {
        require(hasRole(PAUSER_ROLE, msg.sender));
        _unpause();
    }

    // only MINTER_ROLE  can mint
    function mint(address to, uint256 amount) public {
        require(hasRole(MINTER_ROLE, msg.sender));
        _mint(to, amount);
    }

    // snapshot 
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override(ERC20, ERC20Snapshot) {

            super._beforeTokenTransfer(from, to, amount);
    }
}





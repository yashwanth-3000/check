// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockMNEE
 * @dev A mock MNEE token for testing on Sepolia testnet
 * 
 * This is NOT the real MNEE token!
 * Real MNEE on Mainnet: 0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF
 * 
 * Use this for testing purposes only.
 */
contract MockMNEE is ERC20, Ownable {
    
    uint8 private _decimals = 18;
    
    constructor() ERC20("Mock MNEE", "mMNEE") Ownable(msg.sender) {
        // Mint 1,000,000 tokens to deployer for testing
        _mint(msg.sender, 1_000_000 * 10**18);
    }
    
    /**
     * @dev Faucet function - anyone can get 100 tokens for testing
     */
    function faucet() external {
        _mint(msg.sender, 100 * 10**18);
    }
    
    /**
     * @dev Mint tokens (owner only)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}


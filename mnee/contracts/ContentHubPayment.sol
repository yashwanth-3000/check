// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ContentHubPayment
 * @dev Smart contract for handling MNEE token payments for AI content generation
 * 
 * This contract allows users to:
 * 1. Deposit MNEE tokens
 * 2. Pay for content generation based on token usage
 * 3. Withdraw remaining balance
 * 
 * The platform owner can:
 * 1. Set the rate per token (cost per AI token used)
 * 2. Charge users for content generation
 * 3. Withdraw collected fees
 */
contract ContentHubPayment is Ownable, ReentrancyGuard {
    
    // MNEE Token Contract Address on Ethereum Mainnet
    // 0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF
    IERC20 public immutable mneeToken;
    
    // Rate: MNEE tokens charged per 1000 AI tokens used
    // Example: 0.001 MNEE per 1000 tokens = 1e15 wei (MNEE has 18 decimals)
    uint256 public ratePerThousandTokens;
    
    // User balances (deposited MNEE)
    mapping(address => uint256) public userBalances;
    
    // User usage statistics
    mapping(address => uint256) public totalTokensUsed;
    mapping(address => uint256) public totalAmountSpent;
    mapping(address => uint256) public generationCount;
    
    // Platform statistics
    uint256 public totalPlatformRevenue;
    uint256 public totalGenerations;
    
    // Events
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event ContentGenerated(
        address indexed user, 
        uint256 tokensUsed, 
        uint256 amountCharged,
        string contentType
    );
    event RateUpdated(uint256 oldRate, uint256 newRate);
    event PlatformWithdrawal(address indexed to, uint256 amount);
    
    /**
     * @dev Constructor
     * @param _mneeToken Address of the MNEE token contract
     * @param _initialRate Initial rate per 1000 AI tokens (in MNEE wei)
     */
    constructor(
        address _mneeToken,
        uint256 _initialRate
    ) Ownable(msg.sender) {
        require(_mneeToken != address(0), "Invalid token address");
        require(_initialRate > 0, "Rate must be positive");
        
        mneeToken = IERC20(_mneeToken);
        ratePerThousandTokens = _initialRate;
    }
    
    /**
     * @dev Deposit MNEE tokens into the contract
     * @param amount Amount of MNEE to deposit (in wei, 18 decimals)
     */
    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be positive");
        
        // Transfer MNEE from user to contract
        require(
            mneeToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        
        userBalances[msg.sender] += amount;
        
        emit Deposited(msg.sender, amount);
    }
    
    /**
     * @dev Withdraw MNEE tokens from the contract
     * @param amount Amount of MNEE to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be positive");
        require(userBalances[msg.sender] >= amount, "Insufficient balance");
        
        userBalances[msg.sender] -= amount;
        
        require(
            mneeToken.transfer(msg.sender, amount),
            "Transfer failed"
        );
        
        emit Withdrawn(msg.sender, amount);
    }
    
    /**
     * @dev Charge user for content generation (called by platform backend)
     * @param user Address of the user to charge
     * @param tokensUsed Number of AI tokens used in generation
     * @param contentType Type of content generated (e.g., "linkedin", "twitter")
     */
    function chargeForGeneration(
        address user,
        uint256 tokensUsed,
        string calldata contentType
    ) external onlyOwner nonReentrant {
        require(tokensUsed > 0, "Tokens used must be positive");
        
        // Calculate cost: (tokensUsed / 1000) * ratePerThousandTokens
        uint256 cost = (tokensUsed * ratePerThousandTokens) / 1000;
        require(cost > 0, "Cost calculation error");
        require(userBalances[user] >= cost, "User has insufficient balance");
        
        // Deduct from user balance
        userBalances[user] -= cost;
        
        // Update statistics
        totalTokensUsed[user] += tokensUsed;
        totalAmountSpent[user] += cost;
        generationCount[user] += 1;
        totalPlatformRevenue += cost;
        totalGenerations += 1;
        
        emit ContentGenerated(user, tokensUsed, cost, contentType);
    }
    
    /**
     * @dev Direct payment without deposit (approve + pay in one flow)
     * @param tokensUsed Number of AI tokens used
     * @param contentType Type of content generated
     */
    function payForGeneration(
        uint256 tokensUsed,
        string calldata contentType
    ) external nonReentrant {
        require(tokensUsed > 0, "Tokens used must be positive");
        
        uint256 cost = (tokensUsed * ratePerThousandTokens) / 1000;
        require(cost > 0, "Cost calculation error");
        
        // Transfer MNEE directly from user to contract
        require(
            mneeToken.transferFrom(msg.sender, address(this), cost),
            "Transfer failed - ensure you have approved enough MNEE"
        );
        
        // Update statistics
        totalTokensUsed[msg.sender] += tokensUsed;
        totalAmountSpent[msg.sender] += cost;
        generationCount[msg.sender] += 1;
        totalPlatformRevenue += cost;
        totalGenerations += 1;
        
        emit ContentGenerated(msg.sender, tokensUsed, cost, contentType);
    }
    
    /**
     * @dev Calculate the cost for a given number of tokens
     * @param tokensUsed Number of AI tokens
     * @return cost Cost in MNEE (wei)
     */
    function calculateCost(uint256 tokensUsed) external view returns (uint256) {
        return (tokensUsed * ratePerThousandTokens) / 1000;
    }
    
    /**
     * @dev Check if user has sufficient balance for token usage
     * @param user User address
     * @param tokensUsed Estimated tokens to be used
     */
    function hasSufficientBalance(
        address user,
        uint256 tokensUsed
    ) external view returns (bool) {
        uint256 cost = (tokensUsed * ratePerThousandTokens) / 1000;
        return userBalances[user] >= cost;
    }
    
    /**
     * @dev Get user statistics
     * @param user User address
     */
    function getUserStats(address user) external view returns (
        uint256 balance,
        uint256 tokensUsed,
        uint256 amountSpent,
        uint256 generations
    ) {
        return (
            userBalances[user],
            totalTokensUsed[user],
            totalAmountSpent[user],
            generationCount[user]
        );
    }
    
    // ============ Owner Functions ============
    
    /**
     * @dev Update the rate per 1000 tokens
     * @param newRate New rate in MNEE wei
     */
    function setRate(uint256 newRate) external onlyOwner {
        require(newRate > 0, "Rate must be positive");
        
        uint256 oldRate = ratePerThousandTokens;
        ratePerThousandTokens = newRate;
        
        emit RateUpdated(oldRate, newRate);
    }
    
    /**
     * @dev Withdraw platform revenue
     * @param to Address to send funds
     * @param amount Amount to withdraw
     */
    function withdrawPlatformFunds(
        address to,
        uint256 amount
    ) external onlyOwner nonReentrant {
        require(to != address(0), "Invalid address");
        
        // Calculate available platform funds (total balance - user deposits)
        uint256 contractBalance = mneeToken.balanceOf(address(this));
        
        require(amount <= contractBalance, "Insufficient contract balance");
        require(
            mneeToken.transfer(to, amount),
            "Transfer failed"
        );
        
        emit PlatformWithdrawal(to, amount);
    }
    
    /**
     * @dev Get contract's MNEE balance
     */
    function getContractBalance() external view returns (uint256) {
        return mneeToken.balanceOf(address(this));
    }
}


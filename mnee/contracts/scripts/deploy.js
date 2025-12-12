const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  const network = hre.network.name;
  console.log("Network:", network);

  // MNEE Token addresses
  const MNEE_MAINNET = "0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF";
  
  let mneeAddress;
  
  if (network === "sepolia" || network === "hardhat") {
    // Deploy Mock MNEE for testing
    console.log("\n--- Deploying Mock MNEE Token ---");
    const MockMNEE = await hre.ethers.getContractFactory("MockMNEE");
    const mockMNEE = await MockMNEE.deploy();
    await mockMNEE.waitForDeployment();
    mneeAddress = await mockMNEE.getAddress();
    console.log("MockMNEE deployed to:", mneeAddress);
    
    // Get some tokens from faucet for testing
    console.log("Getting test tokens from faucet...");
    await mockMNEE.faucet();
    console.log("Received 100 test MNEE tokens");
  } else {
    // Use real MNEE on mainnet
    mneeAddress = MNEE_MAINNET;
    console.log("Using real MNEE at:", mneeAddress);
  }

  // Deploy ContentHubPayment
  console.log("\n--- Deploying ContentHubPayment ---");
  
  // Initial rate: 0.001 MNEE per 1000 tokens
  // In wei (18 decimals): 0.001 * 10^18 = 10^15 = 1000000000000000
  const initialRate = hre.ethers.parseUnits("0.001", 18);
  
  const ContentHubPayment = await hre.ethers.getContractFactory("ContentHubPayment");
  const contentHubPayment = await ContentHubPayment.deploy(mneeAddress, initialRate);
  await contentHubPayment.waitForDeployment();
  
  const paymentAddress = await contentHubPayment.getAddress();
  console.log("ContentHubPayment deployed to:", paymentAddress);
  
  // Summary
  console.log("\n========================================");
  console.log("DEPLOYMENT SUMMARY");
  console.log("========================================");
  console.log("Network:", network);
  console.log("MNEE Token:", mneeAddress);
  console.log("ContentHubPayment:", paymentAddress);
  console.log("Rate per 1000 tokens:", "0.001 MNEE");
  console.log("========================================");
  
  // Update instructions
  console.log("\n📝 Next Steps:");
  console.log("1. Update mnee/config/contracts.ts with these addresses:");
  console.log(`   - ${network === "mainnet" ? "PAYMENT_CONTRACT_MAINNET" : "PAYMENT_CONTRACT_SEPOLIA"} = "${paymentAddress}"`);
  if (network !== "mainnet") {
    console.log(`   - MNEE_SEPOLIA = "${mneeAddress}"`);
  }
  console.log("\n2. Verify contracts on Etherscan:");
  console.log(`   npx hardhat verify --network ${network} ${paymentAddress} "${mneeAddress}" "${initialRate}"`);
  if (network !== "mainnet") {
    console.log(`   npx hardhat verify --network ${network} ${mneeAddress}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


/**
 * Contract addresses and configuration for MNEE integration
 * 
 * MNEE Hackathon: Programmable Money for Agents, Creators and Automated Finance
 * Track: AI & Agent Payments
 */

// ============================================
// MNEE Token Contract (Ethereum Mainnet)
// This is the OFFICIAL MNEE contract required by the hackathon
// ============================================
export const MNEE_MAINNET = "0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF" as const;

// For testing on Sepolia (if deployed)
export const MNEE_SEPOLIA = "" as const;

// ContentHubPayment contract addresses (if deployed)
export const PAYMENT_CONTRACT_MAINNET = "" as const;
export const PAYMENT_CONTRACT_SEPOLIA = "" as const;

// ============================================
// Environment Configuration
// ============================================
// Set to "false" for mainnet, "true" for testnet
export const IS_TESTNET = process.env.NEXT_PUBLIC_USE_TESTNET === "true";

export const MNEE_ADDRESS = IS_TESTNET ? MNEE_SEPOLIA : MNEE_MAINNET;
export const PAYMENT_CONTRACT = IS_TESTNET ? PAYMENT_CONTRACT_SEPOLIA : PAYMENT_CONTRACT_MAINNET;

// ============================================
// HACKATHON PRICING - Optimized for Testing
// ============================================
export const PRICING = {
  // ============================================
  // HACKATHON MODE - Very Low Prices for Testing!
  // ============================================
  
  // Fixed cost per generation (flat rate for simplicity)
  // 0.0001 MNEE = $0.0001 = 0.01 cents per generation
  COST_PER_GENERATION: 0.0001,
  
  // Rate per 1000 AI tokens (for display purposes)
  // With 2 MNEE, user can generate 20,000 posts!
  RATE_PER_1000_TOKENS: 0.0001,
  
  // Minimum balance required to generate
  MIN_BALANCE_MNEE: 0.0001,
  
  // Estimated tokens per content type (for display)
  // All set to 1000 for consistent 0.0001 MNEE cost
  ESTIMATED_TOKENS: {
    linkedin: 1000,
    twitter: 1000,
    instagram: 1000,
    thread: 1000,
  },
} as const;

// ============================================
// Mode Configuration
// ============================================
export type PaymentMode = "demo" | "live";
export type LivePaymentOption = "lite" | "premium";

export const MODES = {
  // Demo Mode: For judges and testing without real MNEE
  DEMO: {
    name: "Demo Mode",
    description: "Test the flow without real payments",
    icon: "🎮",
    requiresWallet: true,
    requiresMNEE: false,
    showsSimulatedTx: true,
  },
  // Live Mode: Real MNEE payments
  LIVE: {
    name: "Live Mode", 
    description: "Pay with real MNEE tokens",
    icon: "💎",
    requiresWallet: true,
    requiresMNEE: true,
    showsSimulatedTx: false,
  },
} as const;

export const LIVE_OPTIONS = {
  // Lite: Gasless signing, batch settlement
  LITE: {
    name: "Lite",
    description: "Gasless signing, settle later",
    icon: "⚡",
    gasPerGeneration: 0,
    gasOnSettlement: true,
  },
  // Premium: On-chain each time
  PREMIUM: {
    name: "Premium",
    description: "Immediate on-chain proof",
    icon: "💎",
    gasPerGeneration: true,
    gasOnSettlement: false,
  },
} as const;

// ============================================
// Helper Functions
// ============================================

// Calculate cost for a content type
export function calculateCost(contentType: keyof typeof PRICING.ESTIMATED_TOKENS): number {
  return PRICING.COST_PER_GENERATION;
}

// Format MNEE amount for display
export function formatMNEE(amount: number): string {
  if (amount < 0.0001) return amount.toExponential(2);
  if (amount < 1) return amount.toFixed(6);
  return amount.toFixed(4);
}

// Get Etherscan link for transaction
export function getEtherscanLink(txHash: string, isTestnet: boolean = false): string {
  const baseUrl = isTestnet ? "https://sepolia.etherscan.io" : "https://etherscan.io";
  return `${baseUrl}/tx/${txHash}`;
}

// Get Etherscan link for token
export function getTokenEtherscanLink(isTestnet: boolean = false): string {
  const baseUrl = isTestnet ? "https://sepolia.etherscan.io" : "https://etherscan.io";
  return `${baseUrl}/token/${MNEE_MAINNET}`;
}

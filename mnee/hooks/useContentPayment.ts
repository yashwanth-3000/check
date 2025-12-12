"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { CONTENT_HUB_PAYMENT_ABI, ERC20_ABI } from "../config/abis";
import { PAYMENT_CONTRACT, MNEE_ADDRESS, PRICING } from "../config/contracts";

export type ContentType = "linkedin" | "twitter" | "instagram" | "thread";

/**
 * Hook to handle content generation payments
 */
export function useContentPayment() {
  const { address, isConnected } = useAccount();

  // Read user balance in payment contract
  const { data: depositedBalance, refetch: refetchDeposited } = useReadContract({
    address: PAYMENT_CONTRACT as `0x${string}`,
    abi: CONTENT_HUB_PAYMENT_ABI,
    functionName: "userBalances",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!PAYMENT_CONTRACT,
    },
  });

  // Read user stats
  const { data: userStats, refetch: refetchStats } = useReadContract({
    address: PAYMENT_CONTRACT as `0x${string}`,
    abi: CONTENT_HUB_PAYMENT_ABI,
    functionName: "getUserStats",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!PAYMENT_CONTRACT,
    },
  });

  // Read current rate
  const { data: currentRate } = useReadContract({
    address: PAYMENT_CONTRACT as `0x${string}`,
    abi: CONTENT_HUB_PAYMENT_ABI,
    functionName: "ratePerThousandTokens",
    query: {
      enabled: !!PAYMENT_CONTRACT,
    },
  });

  // Calculate cost for tokens
  const { data: calculatedCost } = useReadContract({
    address: PAYMENT_CONTRACT as `0x${string}`,
    abi: CONTENT_HUB_PAYMENT_ABI,
    functionName: "calculateCost",
    args: [BigInt(PRICING.ESTIMATED_TOKENS.linkedin)], // Default calculation
    query: {
      enabled: !!PAYMENT_CONTRACT,
    },
  });

  // Deposit MNEE
  const {
    writeContract: depositWrite,
    data: depositHash,
    isPending: isDepositing,
    error: depositError,
  } = useWriteContract();

  const { isLoading: isDepositConfirming, isSuccess: isDepositConfirmed } =
    useWaitForTransactionReceipt({
      hash: depositHash,
    });

  // Pay for generation (direct payment)
  const {
    writeContract: payWrite,
    data: payHash,
    isPending: isPaying,
    error: payError,
  } = useWriteContract();

  const { isLoading: isPayConfirming, isSuccess: isPayConfirmed } =
    useWaitForTransactionReceipt({
      hash: payHash,
    });

  // Withdraw balance
  const {
    writeContract: withdrawWrite,
    data: withdrawHash,
    isPending: isWithdrawing,
    error: withdrawError,
  } = useWriteContract();

  const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawConfirmed } =
    useWaitForTransactionReceipt({
      hash: withdrawHash,
    });

  // Deposit function
  const deposit = async (amount: string) => {
    if (!PAYMENT_CONTRACT) throw new Error("Payment contract not configured");
    
    const amountWei = parseUnits(amount, 18);
    
    depositWrite({
      address: PAYMENT_CONTRACT as `0x${string}`,
      abi: CONTENT_HUB_PAYMENT_ABI,
      functionName: "deposit",
      args: [amountWei],
    });
  };

  // Pay for generation function
  const payForGeneration = async (tokensUsed: number, contentType: ContentType) => {
    if (!PAYMENT_CONTRACT) throw new Error("Payment contract not configured");
    
    payWrite({
      address: PAYMENT_CONTRACT as `0x${string}`,
      abi: CONTENT_HUB_PAYMENT_ABI,
      functionName: "payForGeneration",
      args: [BigInt(tokensUsed), contentType],
    });
  };

  // Withdraw function
  const withdraw = async (amount: string) => {
    if (!PAYMENT_CONTRACT) throw new Error("Payment contract not configured");
    
    const amountWei = parseUnits(amount, 18);
    
    withdrawWrite({
      address: PAYMENT_CONTRACT as `0x${string}`,
      abi: CONTENT_HUB_PAYMENT_ABI,
      functionName: "withdraw",
      args: [amountWei],
    });
  };

  // Estimate cost for content type
  const estimateCost = (contentType: ContentType): string => {
    const tokens = PRICING.ESTIMATED_TOKENS[contentType];
    const cost = (tokens / 1000) * PRICING.RATE_PER_1000_TOKENS;
    return cost.toFixed(6);
  };

  // Calculate actual cost for specific token count
  const calculateActualCost = (tokensUsed: number): string => {
    const cost = (tokensUsed / 1000) * PRICING.RATE_PER_1000_TOKENS;
    return cost.toFixed(6);
  };

  // Format deposited balance
  const formattedDeposited = depositedBalance 
    ? formatUnits(depositedBalance as bigint, 18) 
    : "0";

  // Parse user stats
  const stats = userStats as [bigint, bigint, bigint, bigint] | undefined;

  return {
    // State
    isConnected,
    address,
    depositedBalance: formattedDeposited,
    depositedBalanceRaw: depositedBalance as bigint | undefined,
    currentRate: currentRate ? formatUnits(currentRate as bigint, 18) : "0",
    
    // User stats
    stats: stats ? {
      balance: formatUnits(stats[0], 18),
      tokensUsed: stats[1].toString(),
      amountSpent: formatUnits(stats[2], 18),
      generations: stats[3].toString(),
    } : null,
    
    // Actions
    deposit,
    payForGeneration,
    withdraw,
    refetchDeposited,
    refetchStats,
    
    // Transaction states - Deposit
    isDepositing: isDepositing || isDepositConfirming,
    isDepositConfirmed,
    depositError,
    depositHash,
    
    // Transaction states - Pay
    isPaying: isPaying || isPayConfirming,
    isPayConfirmed,
    payError,
    payHash,
    
    // Transaction states - Withdraw
    isWithdrawing: isWithdrawing || isWithdrawConfirming,
    isWithdrawConfirmed,
    withdrawError,
    withdrawHash,
    
    // Helpers
    estimateCost,
    calculateActualCost,
    estimatedTokens: PRICING.ESTIMATED_TOKENS,
  };
}


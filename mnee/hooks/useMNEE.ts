"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { ERC20_ABI } from "../config/abis";
import { MNEE_ADDRESS, PAYMENT_CONTRACT } from "../config/contracts";

/**
 * Hook to interact with MNEE token
 */
export function useMNEE() {
  const { address, isConnected } = useAccount();

  // Read MNEE balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: MNEE_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!MNEE_ADDRESS,
    },
  });

  // Read allowance for payment contract
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: MNEE_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address && PAYMENT_CONTRACT ? [address, PAYMENT_CONTRACT as `0x${string}`] : undefined,
    query: {
      enabled: !!address && !!MNEE_ADDRESS && !!PAYMENT_CONTRACT,
    },
  });

  // Approve MNEE spending
  const {
    writeContract: approve,
    data: approveHash,
    isPending: isApproving,
    error: approveError,
  } = useWriteContract();

  const { isLoading: isApproveConfirming, isSuccess: isApproveConfirmed } =
    useWaitForTransactionReceipt({
      hash: approveHash,
    });

  // Format balance for display
  const formattedBalance = balance ? formatUnits(balance as bigint, 18) : "0";
  const formattedAllowance = allowance ? formatUnits(allowance as bigint, 18) : "0";

  // Approve function
  const approveMNEE = async (amount: string) => {
    if (!PAYMENT_CONTRACT) {
      throw new Error("Payment contract not configured");
    }
    
    const amountWei = parseUnits(amount, 18);
    
    approve({
      address: MNEE_ADDRESS as `0x${string}`,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [PAYMENT_CONTRACT as `0x${string}`, amountWei],
    });
  };

  // Check if user has sufficient allowance
  const hasSufficientAllowance = (requiredAmount: string): boolean => {
    if (!allowance) return false;
    const required = parseUnits(requiredAmount, 18);
    return (allowance as bigint) >= required;
  };

  // Check if user has sufficient balance
  const hasSufficientBalance = (requiredAmount: string): boolean => {
    if (!balance) return false;
    const required = parseUnits(requiredAmount, 18);
    return (balance as bigint) >= required;
  };

  return {
    // State
    isConnected,
    address,
    balance: formattedBalance,
    balanceRaw: balance as bigint | undefined,
    allowance: formattedAllowance,
    allowanceRaw: allowance as bigint | undefined,
    
    // Actions
    approveMNEE,
    refetchBalance,
    refetchAllowance,
    
    // Transaction states
    isApproving: isApproving || isApproveConfirming,
    isApproveConfirmed,
    approveError,
    approveHash,
    
    // Helpers
    hasSufficientAllowance,
    hasSufficientBalance,
  };
}


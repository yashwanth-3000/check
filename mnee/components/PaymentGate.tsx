"use client";

import { useState, ReactNode } from "react";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { Coins, Lock, Wallet } from "lucide-react";
import ConnectWalletButton from "./ConnectWalletButton";
import PaymentModal from "./PaymentModal";
import { useMNEE } from "../hooks/useMNEE";
import { ContentType } from "../hooks/useContentPayment";
import { PRICING } from "../config/contracts";

interface PaymentGateProps {
  children: ReactNode;
  contentType: ContentType;
  onPaymentSuccess?: () => void;
  estimatedTokens?: number;
  disabled?: boolean;
}

/**
 * PaymentGate Component
 * 
 * Wraps content generation functionality and requires MNEE payment before proceeding.
 * Shows wallet connection if not connected, otherwise shows payment modal on click.
 */
export default function PaymentGate({
  children,
  contentType,
  onPaymentSuccess,
  estimatedTokens,
  disabled = false,
}: PaymentGateProps) {
  const { isConnected } = useAccount();
  const { balance, hasSufficientBalance } = useMNEE();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const estimatedCost = ((estimatedTokens || PRICING.ESTIMATED_TOKENS[contentType]) / 1000) * PRICING.RATE_PER_1000_TOKENS;
  const hasEnoughBalance = hasSufficientBalance(estimatedCost.toString());

  const handlePaymentSuccess = () => {
    setIsPaid(true);
    setShowPaymentModal(false);
    onPaymentSuccess?.();
  };

  // If already paid, just render children
  if (isPaid) {
    return <>{children}</>;
  }

  // If not connected, show connect button
  if (!isConnected) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-6"
          >
            <div className="inline-flex p-4 bg-cyan-500/20 rounded-full mb-4">
              <Wallet className="h-8 w-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Connect Wallet to Generate
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Pay with MNEE stablecoin for AI content generation
            </p>
            <ConnectWalletButton />
          </motion.div>
        </div>
        <div className="opacity-30 pointer-events-none">
          {children}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        {/* Payment Required Overlay */}
        <div 
          className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-lg cursor-pointer hover:bg-gray-900/70 transition-colors"
          onClick={() => !disabled && setShowPaymentModal(true)}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-6"
          >
            <div className="inline-flex p-4 bg-cyan-500/20 rounded-full mb-4">
              <Coins className="h-8 w-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Pay to Generate
            </h3>
            <p className="text-gray-400 text-sm mb-2">
              Estimated cost: <span className="text-cyan-300 font-mono">{estimatedCost.toFixed(6)} MNEE</span>
            </p>
            <p className="text-gray-500 text-xs mb-4">
              Your balance: {parseFloat(balance).toFixed(4)} MNEE
            </p>
            
            {!hasEnoughBalance && (
              <p className="text-red-400 text-sm mb-4">
                Insufficient balance
              </p>
            )}
            
            <button
              disabled={disabled || !hasEnoughBalance}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              <Lock className="h-4 w-4" />
              Unlock with MNEE
            </button>
          </motion.div>
        </div>
        
        {/* Blurred content preview */}
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
        contentType={contentType}
        estimatedTokens={estimatedTokens}
      />
    </>
  );
}


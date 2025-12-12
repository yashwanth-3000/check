"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Coins, Check, Loader2, AlertCircle, Zap } from "lucide-react";
import { useMNEE } from "../hooks/useMNEE";
import { useContentPayment, ContentType } from "../hooks/useContentPayment";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  contentType: ContentType;
  estimatedTokens?: number;
}

type PaymentStep = "approve" | "pay" | "success" | "error";

export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  contentType,
  estimatedTokens,
}: PaymentModalProps) {
  const { balance, approveMNEE, isApproving, isApproveConfirmed, hasSufficientBalance, hasSufficientAllowance, refetchAllowance } = useMNEE();
  const { payForGeneration, isPaying, isPayConfirmed, estimateCost, calculateActualCost, estimatedTokens: defaultTokens } = useContentPayment();

  const [step, setStep] = useState<PaymentStep>("approve");
  const [error, setError] = useState<string | null>(null);

  const tokens = estimatedTokens || defaultTokens[contentType];
  const cost = calculateActualCost(tokens);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("approve");
      setError(null);
    }
  }, [isOpen]);

  // Handle approve confirmation
  useEffect(() => {
    if (isApproveConfirmed) {
      refetchAllowance();
      setStep("pay");
    }
  }, [isApproveConfirmed, refetchAllowance]);

  // Handle payment confirmation
  useEffect(() => {
    if (isPayConfirmed) {
      setStep("success");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    }
  }, [isPayConfirmed, onSuccess, onClose]);

  const handleApprove = async () => {
    try {
      setError(null);
      // Approve a bit more than needed for future transactions
      const approveAmount = (parseFloat(cost) * 10).toString();
      await approveMNEE(approveAmount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approval failed");
      setStep("error");
    }
  };

  const handlePay = async () => {
    try {
      setError(null);
      await payForGeneration(tokens, contentType);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setStep("error");
    }
  };

  // Check if user already has allowance
  useEffect(() => {
    if (isOpen && hasSufficientAllowance(cost)) {
      setStep("pay");
    }
  }, [isOpen, cost, hasSufficientAllowance]);

  if (!isOpen) return null;

  const insufficientBalance = !hasSufficientBalance(cost);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 border border-cyan-500/30 rounded-2xl p-6 w-full max-w-md m-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Coins className="h-5 w-5 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-cyan-300">Pay with MNEE</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Content Type & Cost */}
          <div className="bg-gray-800/50 border border-cyan-500/20 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-cyan-500/70">Content Type</span>
              <span className="text-cyan-300 font-medium capitalize">{contentType}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-cyan-500/70">Estimated Tokens</span>
              <span className="text-cyan-300 font-mono">{tokens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-cyan-500/20">
              <span className="text-cyan-400 font-medium">Total Cost</span>
              <span className="text-2xl font-bold text-cyan-300 font-mono">
                {cost} <span className="text-lg text-cyan-500">MNEE</span>
              </span>
            </div>
          </div>

          {/* Balance Check */}
          {insufficientBalance && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-red-400 text-sm">
                Insufficient balance. You have {parseFloat(balance).toFixed(4)} MNEE.
              </span>
            </div>
          )}

          {/* Steps */}
          <div className="space-y-3">
            {/* Step 1: Approve */}
            <div
              className={`p-4 rounded-lg border ${
                step === "approve"
                  ? "border-cyan-500 bg-cyan-500/10"
                  : step === "pay" || step === "success"
                  ? "border-green-500/30 bg-green-500/10"
                  : "border-gray-700 bg-gray-800/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {step === "pay" || step === "success" ? (
                    <Check className="h-5 w-5 text-green-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-cyan-500 flex items-center justify-center">
                      <span className="text-xs text-cyan-500">1</span>
                    </div>
                  )}
                  <span className={step === "approve" ? "text-cyan-300" : "text-gray-400"}>
                    Approve MNEE
                  </span>
                </div>
                {step === "approve" && (
                  <button
                    onClick={handleApprove}
                    disabled={isApproving || insufficientBalance}
                    className="px-4 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                  >
                    {isApproving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Approving...
                      </>
                    ) : (
                      "Approve"
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Step 2: Pay */}
            <div
              className={`p-4 rounded-lg border ${
                step === "pay"
                  ? "border-cyan-500 bg-cyan-500/10"
                  : step === "success"
                  ? "border-green-500/30 bg-green-500/10"
                  : "border-gray-700 bg-gray-800/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {step === "success" ? (
                    <Check className="h-5 w-5 text-green-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-cyan-500 flex items-center justify-center">
                      <span className="text-xs text-cyan-500">2</span>
                    </div>
                  )}
                  <span className={step === "pay" ? "text-cyan-300" : "text-gray-400"}>
                    Confirm Payment
                  </span>
                </div>
                {step === "pay" && (
                  <button
                    onClick={handlePay}
                    disabled={isPaying}
                    className="px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-400 disabled:opacity-50 flex items-center gap-2 font-medium"
                  >
                    {isPaying ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Pay {cost} MNEE
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Success State */}
          {step === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-center"
            >
              <Check className="h-12 w-12 text-green-400 mx-auto mb-2" />
              <p className="text-green-300 font-medium">Payment Successful!</p>
              <p className="text-green-500/70 text-sm">Generating your content...</p>
            </motion.div>
          )}

          {/* Error State */}
          {step === "error" && error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
              <button
                onClick={() => setStep("approve")}
                className="mt-2 text-cyan-400 text-sm hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-gray-500 text-xs mt-4">
            1 MNEE = $1 USD • Powered by MNEE Stablecoin
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


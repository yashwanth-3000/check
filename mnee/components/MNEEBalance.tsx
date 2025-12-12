"use client";

import { useMNEE } from "../hooks/useMNEE";
import { useContentPayment } from "../hooks/useContentPayment";
import { Coins, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface MNEEBalanceProps {
  showStats?: boolean;
  compact?: boolean;
}

export default function MNEEBalance({ showStats = false, compact = false }: MNEEBalanceProps) {
  const { balance, isConnected } = useMNEE();
  const { stats, depositedBalance } = useContentPayment();

  if (!isConnected) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg">
        <Coins className="h-4 w-4 text-cyan-400" />
        <span className="text-cyan-300 font-mono text-sm">
          {parseFloat(balance).toFixed(4)} MNEE
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-gray-900/80 border border-cyan-500/30 rounded-xl"
    >
      {/* Main Balance */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Coins className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <p className="text-cyan-500/70 text-sm">Wallet Balance</p>
            <p className="text-2xl font-bold text-cyan-300 font-mono">
              {parseFloat(balance).toFixed(4)}
              <span className="text-lg ml-1 text-cyan-500">MNEE</span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-cyan-500/70 text-sm">≈ USD Value</p>
          <p className="text-xl font-bold text-green-400">
            ${parseFloat(balance).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Deposited Balance */}
      {parseFloat(depositedBalance) > 0 && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-400" />
              <span className="text-green-400 text-sm">Ready to Generate</span>
            </div>
            <span className="text-green-300 font-mono font-bold">
              {parseFloat(depositedBalance).toFixed(4)} MNEE
            </span>
          </div>
        </div>
      )}

      {/* Stats */}
      {showStats && stats && (
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-cyan-500/20">
          <div className="text-center">
            <p className="text-cyan-500/60 text-xs">Generations</p>
            <p className="text-cyan-300 font-bold font-mono">{stats.generations}</p>
          </div>
          <div className="text-center">
            <p className="text-cyan-500/60 text-xs">Tokens Used</p>
            <p className="text-cyan-300 font-bold font-mono">
              {parseInt(stats.tokensUsed).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-cyan-500/60 text-xs">Total Spent</p>
            <p className="text-cyan-300 font-bold font-mono">
              {parseFloat(stats.amountSpent).toFixed(4)}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}


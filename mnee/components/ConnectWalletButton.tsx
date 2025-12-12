"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet } from "lucide-react";

interface ConnectWalletButtonProps {
  className?: string;
  showBalance?: boolean;
}

export default function ConnectWalletButton({
  className = "",
  showBalance = true,
}: ConnectWalletButtonProps) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium shadow-lg shadow-cyan-500/25 ${className}`}
                  >
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className={`flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 ${className}`}
                  >
                    Wrong Network
                  </button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  {/* Chain Selector */}
                  <button
                    onClick={openChainModal}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded-lg hover:bg-gray-700 transition-all duration-300"
                  >
                    {chain.hasIcon && (
                      <div
                        className="w-4 h-4 rounded-full overflow-hidden"
                        style={{ background: chain.iconBackground }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            className="w-4 h-4"
                          />
                        )}
                      </div>
                    )}
                    <span className="text-cyan-300 text-sm">{chain.name}</span>
                  </button>

                  {/* Account Button */}
                  <button
                    onClick={openAccountModal}
                    className={`flex items-center gap-2 px-4 py-2 bg-gray-800 border border-cyan-500/30 rounded-lg hover:bg-gray-700 transition-all duration-300 ${className}`}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-cyan-300 font-mono text-sm">
                      {account.displayName}
                    </span>
                    {showBalance && account.displayBalance && (
                      <span className="text-cyan-500/70 text-sm">
                        ({account.displayBalance})
                      </span>
                    )}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}


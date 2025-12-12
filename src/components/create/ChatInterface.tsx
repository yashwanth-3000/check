import React, { useRef, useState, useEffect } from 'react';
import { MoreHorizontal, X, ArrowUp, Mic, Paperclip, ChevronDown, Sparkles, Bot, Target, Link2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

// --- Types ---
interface ThoughtStep {
  title: string;
  content: string;
}

interface Message {
  id: string;
  isUser: boolean;
  content: string;
  timestamp: Date;
  thinkingSteps?: ThoughtStep[];
}

interface SelectedNodeData {
  id: string;
  type: string | undefined;
  name: string;
  platform?: string;
  content: string;
}

interface ParentNodeContext {
  nodeId: string;
  platform: string;
  x: number;
  y: number;
  nodeName: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  currentInput: string;
  setCurrentInput: (value: string) => void;
  handleSendMessage: () => void;
  isCodeMode: boolean;
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
  PlatformDropdown: React.ComponentType<{ selectedPlatform: string; setSelectedPlatform: (platform: string) => void }>;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  selectedNode?: SelectedNodeData | null;
  parentNodeContext?: ParentNodeContext | null;
}

// --- Components ---

const AIMessageBlock = ({ message }: { message: Message }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasThinkingSteps = message.thinkingSteps && message.thinkingSteps.length > 0;

  return (
    <div className="max-w-[90%] w-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="group"
      >
        {/* Thinking Process Header */}
        {hasThinkingSteps && (
          <div className="mb-2">
             <button 
              className="flex items-center gap-2 text-[10px] font-medium text-zinc-400 hover:text-zinc-600 transition-colors uppercase tracking-wider bg-zinc-50 hover:bg-zinc-100 px-2 py-1 rounded-md border border-zinc-100"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Sparkles size={10} className="text-zinc-500" />
              <span>Thinking Process</span>
              <motion.div animate={{ rotate: isExpanded ? 0 : -90 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={10} />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pl-2 pt-2 pb-1 space-y-2 border-l border-zinc-200 ml-3 my-1">
                    {message.thinkingSteps?.map((step, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="pl-3 relative"
                      >
                         <div className="absolute left-[-5px] top-1.5 w-1 h-1 rounded-full bg-zinc-300"></div>
                        <h4 className="font-medium text-[11px] text-zinc-700 mb-0.5">{step.title}</h4>
                        <p className="text-[10px] text-zinc-500 leading-relaxed">{step.content}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Content */}
        {message.content && (
          <div className="flex gap-3 items-start">
             <div className="w-6 h-6 rounded-md bg-white border border-zinc-200 shadow-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot size={14} className="text-zinc-700" />
             </div>
             <div className="text-sm leading-relaxed text-zinc-800 markdown-content bg-white border border-zinc-200/60 shadow-sm rounded-lg px-4 py-3">
                {message.content}
             </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export const ChatInterface = ({
  messages,
  currentInput,
  setCurrentInput,
  handleSendMessage,
  isCodeMode,
  selectedPlatform,
  setSelectedPlatform,
  PlatformDropdown,
  inputRef,
  selectedNode,
  parentNodeContext
}: ChatInterfaceProps) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-full w-full bg-zinc-50/30 flex flex-col relative font-sans">
      {/* Header */}
      <div className="h-14 border-b border-zinc-200 flex items-center justify-between px-4 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <h2 className="font-semibold text-sm text-zinc-800">Assistant</h2>
        </div>
        <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-zinc-700">
                <MoreHorizontal size={14} />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-zinc-700">
                <X size={14} />
            </Button>
        </div>
      </div>
      
      {/* Selected Node Context Banner */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
              <div className="flex items-center gap-2 text-blue-700">
                <Target size={14} />
                <span className="text-xs font-semibold uppercase tracking-wide">Selected Node</span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-sm font-medium text-blue-900">{selectedNode.name}</span>
                {selectedNode.platform && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                    {selectedNode.platform}
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-600 mt-1 line-clamp-2">
                {selectedNode.content.slice(0, 100)}{selectedNode.content.length > 100 ? '...' : ''}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Extending From Node Banner */}
      <AnimatePresence>
        {parentNodeContext && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-700">
                <Link2 size={14} />
                <span className="text-xs font-semibold uppercase tracking-wide">Extending From</span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-sm font-medium text-emerald-900">{parentNodeContext.nodeName}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded font-medium">
                  {parentNodeContext.platform}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              {message.isUser ? (
                <div className="max-w-[85%] bg-zinc-900 text-white rounded-xl px-4 py-2.5 shadow-sm">
                  <p className="text-sm leading-relaxed font-light">{message.content}</p>
                </div>
              ) : (
                <AIMessageBlock message={message} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {messages.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center text-zinc-300 p-8">
                <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-4 border border-zinc-200">
                    <Bot size={32} className="text-zinc-400" />
                </div>
                <p className="text-sm font-medium text-zinc-500">How can I help you today?</p>
             </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-zinc-200">
        <div className="relative bg-white border border-zinc-200 rounded-xl p-2 focus-within:ring-1 focus-within:ring-zinc-950 focus-within:border-zinc-950 transition-all shadow-sm hover:border-zinc-300">
            <textarea
                ref={inputRef}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                    }
                }}
                placeholder="Ask anything..."
                className={`w-full bg-transparent text-zinc-900 placeholder-zinc-400 resize-none focus:outline-none text-sm px-2 py-1 min-h-[44px] max-h-32 ${isCodeMode ? 'font-mono' : ''}`}
                rows={1}
                style={{ height: 'auto' }}
                onInput={(e) => {
                    e.currentTarget.style.height = 'auto';
                    e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                }}
            />
            
            <div className="flex justify-between items-center mt-2 px-1 pt-1 border-t border-zinc-50">
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md">
                        <Paperclip size={14} />
                    </Button>
                    <div className="h-3 w-[1px] bg-zinc-200 mx-1" />
                    <PlatformDropdown selectedPlatform={selectedPlatform} setSelectedPlatform={setSelectedPlatform} />
                </div>
                
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md">
                        <Mic size={14} />
                    </Button>
                    <Button
                        onClick={handleSendMessage}
                        size="icon"
                        className={`h-7 w-7 rounded-md transition-all ${currentInput.trim() ? 'bg-zinc-900 hover:bg-black text-white shadow-sm' : 'bg-zinc-100 text-zinc-300 cursor-not-allowed'}`}
                        disabled={!currentInput.trim()}
                    >
                        <ArrowUp size={14} strokeWidth={2.5} />
                    </Button>
                </div>
            </div>
        </div>
        <div className="text-[10px] text-center text-zinc-400 mt-2 font-medium">
            Press <span className="font-mono">Return</span> to send
        </div>
      </div>
    </div>
  );
};

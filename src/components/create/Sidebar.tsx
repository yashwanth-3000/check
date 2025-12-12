import React from 'react';
import Image from 'next/image';
import { Plus, MessageSquare, Settings, PanelLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface SidebarProps {
  chatHistory: ChatHistory[];
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const Sidebar = ({ chatHistory, isCollapsed, toggleSidebar }: SidebarProps) => {
  return (
    <div className={`h-full bg-zinc-50 border-r border-zinc-200 flex flex-col transition-all duration-300 font-sans ${isCollapsed ? 'items-center' : ''}`}>
      {/* Header */}
      <div className={`h-14 flex ${isCollapsed ? 'justify-center' : 'justify-between px-4'} items-center flex-shrink-0 border-b border-zinc-100/50`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
             <div className="w-5 h-5 bg-black rounded-md flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                C
             </div>
             <span className="font-semibold text-sm tracking-tight text-zinc-900">ContentFlow</span>
          </div>
        )}
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="h-7 w-7 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/50 rounded-md"
        >
          <PanelLeft size={16} />
        </Button>
      </div>
      
      {/* Actions */}
      <div className={`px-3 py-3 ${isCollapsed ? 'flex justify-center' : ''}`}>
        {!isCollapsed ? (
            <div className="space-y-3">
                 <Button className="w-full justify-start gap-2 bg-white hover:bg-zinc-50 text-zinc-900 shadow-sm border border-zinc-200 h-9 transition-all hover:border-zinc-300">
                    <Plus size={14} className="text-zinc-500" />
                    <span className="text-sm font-medium">New Flow</span>
                </Button>
                <div className="relative group">
                    <Search size={14} className="absolute left-2.5 top-2.5 text-zinc-400 group-focus-within:text-zinc-800 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full h-9 pl-8 pr-3 text-sm bg-zinc-100/50 border border-transparent rounded-md focus:outline-none focus:bg-white focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100 transition-all placeholder:text-zinc-400 font-medium text-zinc-700"
                    />
                </div>
            </div>
        ) : (
          <Button size="icon" className="h-9 w-9 bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200 shadow-sm rounded-lg">
            <Plus size={16} />
          </Button>
        )}
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
         {!isCollapsed && <div className="text-[10px] font-semibold text-zinc-400 px-2 py-2 uppercase tracking-wider">Recent Projects</div>}
        {chatHistory.map((chat) => (
          <button
            key={chat.id}
            className={`w-full text-left group flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white hover:shadow-sm border border-transparent hover:border-zinc-200/60 transition-all duration-200 ${isCollapsed ? 'justify-center' : ''}`}
          >
             {isCollapsed ? (
                <div className="w-8 h-8 flex items-center justify-center bg-white border border-zinc-200 rounded-md text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 shadow-sm transition-all">
                    <MessageSquare size={14} />
                </div>
             ) : (
                <>
                    <MessageSquare size={14} className="text-zinc-400 group-hover:text-zinc-800 flex-shrink-0 transition-colors" />
                    <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium text-zinc-600 group-hover:text-zinc-900 truncate transition-colors">
                            {chat.title}
                        </h4>
                        <p className="text-[10px] text-zinc-400 truncate opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 font-medium">
                            {chat.lastMessage}
                        </p>
                    </div>
                </>
             )}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className={`p-3 border-t border-zinc-200 bg-white/50 flex-shrink-0 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button className={`flex items-center gap-3 text-sm text-zinc-600 hover:text-zinc-900 transition-colors w-full ${isCollapsed ? 'justify-center' : ''} group p-2 rounded-lg hover:bg-zinc-100/50`}>
          <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
             <Image src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" width={32} height={32} className="opacity-80" />
          </div>
          {!isCollapsed && (
              <div className="flex-1 text-left">
                  <div className="font-medium text-xs text-zinc-900">Yashwanth</div>
                  <div className="text-[10px] text-zinc-400 font-medium">Pro Plan</div>
              </div>
          )}
          {!isCollapsed && <Settings size={14} className="text-zinc-400 group-hover:text-zinc-600 transition-colors" />}
        </button>
      </div>
    </div>
  );
};

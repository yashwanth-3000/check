import React from 'react';
import { Code, Settings, Share2, Play, LayoutTemplate, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CanvasHeaderProps {
    isCodeMode: boolean;
    setIsCodeMode: (value: boolean) => void;
    title?: string;
}

export const CanvasHeader = ({ isCodeMode, setIsCodeMode, title = "Untitled Flow" }: CanvasHeaderProps) => {
    return (
        <header className="h-14 bg-white/80 backdrop-blur-sm border-b border-zinc-200 flex items-center justify-between px-4 z-10 relative">
            <div className="flex items-center gap-4">
                 <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-sm text-zinc-900 tracking-tight">
                            {title}
                        </h2>
                        <span className="px-1.5 py-0.5 rounded-md bg-zinc-100 text-zinc-500 text-[10px] font-medium border border-zinc-200 uppercase tracking-wide">
                            Draft
                        </span>
                    </div>
                 </div>
            </div>

            <div className="flex items-center gap-2">
                 
                <div className="flex items-center bg-zinc-100/80 p-0.5 rounded-lg border border-zinc-200 shadow-sm">
                    <button 
                        onClick={() => setIsCodeMode(false)}
                        className={`px-3 py-1.5 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-all ${!isCodeMode ? 'bg-white text-zinc-900 shadow-sm border border-zinc-100' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                        <LayoutTemplate size={12} />
                        Visual
                    </button>
                    <button 
                        onClick={() => setIsCodeMode(true)}
                        className={`px-3 py-1.5 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-all ${isCodeMode ? 'bg-white text-zinc-900 shadow-sm border border-zinc-100' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                        <Code size={12} />
                        Code
                    </button>
                </div>

                <div className="h-4 w-[1px] bg-zinc-200 mx-2" />

                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md">
                        <Settings size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md">
                        <MoreHorizontal size={14} />
                    </Button>
                </div>
                
                <div className="flex items-center gap-2 ml-2">
                    <Button variant="outline" className="h-8 text-xs font-medium bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 shadow-sm gap-2">
                        <Share2 size={12} />
                        Share
                    </Button>
                    <Button className="h-8 text-xs font-medium gap-2 bg-zinc-900 text-white hover:bg-black shadow-sm border border-transparent">
                        <Play size={12} className="fill-current" />
                        Run
                    </Button>
                </div>
            </div>
        </header>
    );
};

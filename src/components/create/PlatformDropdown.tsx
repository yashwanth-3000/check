import React, { useState, useRef, useEffect } from 'react';
import { Globe, Instagram, Twitter, Youtube, Linkedin, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlatformDropdownProps {
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
}

export const PlatformDropdown = ({ selectedPlatform, setSelectedPlatform }: PlatformDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const platforms = [
    { name: "All", icon: Globe, color: "text-slate-500" },
    { name: "Instagram", icon: Instagram, color: "text-pink-500" },
    { name: "Twitter", icon: Twitter, color: "text-blue-400" },
    { name: "YouTube", icon: Youtube, color: "text-red-500" },
    { name: "LinkedIn", icon: Linkedin, color: "text-blue-700" }
  ];
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedPlatformData = platforms.find(p => p.name === selectedPlatform) || platforms[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-200/50 transition-colors text-slate-600 text-xs font-medium border border-transparent hover:border-slate-200"
      >
        <selectedPlatformData.icon size={14} className={selectedPlatformData.color} />
        <span>{selectedPlatform}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={12} className="opacity-50" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="absolute bottom-full mb-2 left-0 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 origin-bottom-left overflow-hidden ring-1 ring-slate-900/5"
          >
            <div className="px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50 border-b border-slate-100">
                Select Platform
            </div>
            <ul className="py-1">
              {platforms.map(platform => (
                <li
                  key={platform.name}
                  onClick={() => {
                    setSelectedPlatform(platform.name);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors ${selectedPlatform === platform.name ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1 rounded-md ${selectedPlatform === platform.name ? 'bg-blue-100' : 'bg-slate-100'}`}>
                        <platform.icon size={14} className={platform.color} />
                    </div>
                    <span className="font-medium">{platform.name}</span>
                  </div>
                  {selectedPlatform === platform.name && <Check size={14} className="text-blue-600" />}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


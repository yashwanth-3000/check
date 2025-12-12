import React from 'react';
import { Handle, Position, NodeProps, Node, useReactFlow } from '@xyflow/react';
import { Instagram, Twitter, Youtube, Linkedin, Globe, Sparkles, User, Loader, MessageSquare, Trash2, Plus } from 'lucide-react';

// --- Node Data Types ---
export interface PlatformNodeData extends Record<string, unknown> {
  platform: string;
  content: string;
  nodeName?: string;
  nodeNumber?: number;
  outputNumber?: number;
  onAddImprovement?: (nodeId: string, platform: string, content: string, x: number, y: number, nodeName: string) => void;
}

export interface PromptNodeData extends Record<string, unknown> {
  content: string;
  nodeName?: string;
  nodeNumber?: number;
}

export interface ProcessingNodeData extends Record<string, unknown> {
  stage: string;
  nodeName?: string;
  nodeNumber?: number;
}

// --- Preview Components ---

const TwitterPreview = ({ content }: { content: string }) => (
  <div className="bg-white flex flex-col h-full rounded-2xl overflow-hidden border border-[#eff3f4] shadow-sm font-sans">
    <div className="flex items-start gap-3 p-4">
      <div className="w-10 h-10 bg-[#1d9bf0] rounded-full flex items-center justify-center flex-shrink-0">
        <User size={20} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="font-bold text-[#0f1419] text-[15px] leading-5">Display Name</span>
          <svg viewBox="0 0 22 22" className="w-[18px] h-[18px] text-[#1d9bf0]" fill="currentColor">
            <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
          </svg>
          <span className="text-[#536471] text-[15px] leading-5">@username</span>
          <span className="text-[#536471] text-[15px] leading-5">·</span>
          <span className="text-[#536471] text-[15px] leading-5 hover:underline cursor-pointer">2h</span>
        </div>
        <div className="mt-1">
          <p className="text-[#0f1419] text-[15px] leading-5 whitespace-pre-wrap">{content}</p>
        </div>
        <div className="flex items-center justify-between mt-3 max-w-[425px] text-[#536471]">
          <div className="flex items-center gap-1 group cursor-pointer">
            <div className="w-[34.75px] h-[34.75px] rounded-full group-hover:bg-[#1d9bf0]/10 flex items-center justify-center transition-colors">
              <svg viewBox="0 0 24 24" className="w-[18.75px] h-[18.75px] group-hover:text-[#1d9bf0]" fill="currentColor">
                <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path>
              </svg>
            </div>
            <span className="text-[13px] leading-4 group-hover:text-[#1d9bf0]">42</span>
          </div>
          <div className="flex items-center gap-1 group cursor-pointer">
            <div className="w-[34.75px] h-[34.75px] rounded-full group-hover:bg-[#00ba7c]/10 flex items-center justify-center transition-colors">
              <svg viewBox="0 0 24 24" className="w-[18.75px] h-[18.75px] group-hover:text-[#00ba7c]" fill="currentColor">
                <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>
              </svg>
            </div>
            <span className="text-[13px] leading-4 group-hover:text-[#00ba7c]">17</span>
          </div>
          <div className="flex items-center gap-1 group cursor-pointer">
            <div className="w-[34.75px] h-[34.75px] rounded-full group-hover:bg-[#f91880]/10 flex items-center justify-center transition-colors">
              <svg viewBox="0 0 24 24" className="w-[18.75px] h-[18.75px] group-hover:text-[#f91880]" fill="currentColor">
                <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
              </svg>
            </div>
            <span className="text-[13px] leading-4 group-hover:text-[#f91880]">234</span>
          </div>
          <div className="flex items-center gap-1 group cursor-pointer">
            <div className="w-[34.75px] h-[34.75px] rounded-full group-hover:bg-[#1d9bf0]/10 flex items-center justify-center transition-colors">
              <svg viewBox="0 0 24 24" className="w-[18.75px] h-[18.75px] group-hover:text-[#1d9bf0]" fill="currentColor">
                <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path>
              </svg>
            </div>
            <span className="text-[13px] leading-4 group-hover:text-[#1d9bf0]">1.2K</span>
          </div>
          <div className="flex items-center gap-1 group cursor-pointer">
            <div className="w-[34.75px] h-[34.75px] rounded-full group-hover:bg-[#1d9bf0]/10 flex items-center justify-center transition-colors">
              <svg viewBox="0 0 24 24" className="w-[18.75px] h-[18.75px] group-hover:text-[#1d9bf0]" fill="currentColor">
                <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const InstagramPreview = ({ content }: { content: string }) => (
  <div className="bg-white border border-[#dbdbdb] rounded-[4px] overflow-hidden shadow-sm font-sans max-w-[470px]">
    <div className="px-4 py-[14px] flex items-center gap-3 border-b border-[#efefef]">
      <div className="w-8 h-8 bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] rounded-full p-[2px]">
        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
          <User size={18} className="text-[#262626]" />
        </div>
      </div>
      <span className="font-semibold text-[14px] text-[#262626]">username</span>
      <button className="ml-auto">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="1.5"></circle>
          <circle cx="6" cy="12" r="1.5"></circle>
          <circle cx="18" cy="12" r="1.5"></circle>
        </svg>
      </button>
    </div>
    <div className="aspect-square bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center relative">
      <svg className="w-16 h-16 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
        <polyline points="21 15 16 10 5 21" strokeWidth="2"/>
      </svg>
    </div>
    <div className="px-4 pt-3 pb-2">
      <div className="flex items-center gap-4 mb-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M22 2L11 13"></path>
          <path d="M22 2L15 22 11 13 2 9 22 2z"></path>
        </svg>
        <svg className="w-6 h-6 ml-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      <div className="mb-2">
        <span className="font-semibold text-[14px] text-[#262626]">1,234 likes</span>
      </div>
      <div className="text-[14px] text-[#262626] leading-[18px]">
        <span className="font-semibold">username</span>{' '}
        <span className="inline">{content.slice(0, 50)}{content.length > 50 ? '...' : ''}</span>
        {content.length > 50 && <button className="text-[#8e8e8e] ml-1">more</button>}
      </div>
      <button className="text-[#8e8e8e] text-[14px] mt-1 block">View all 42 comments</button>
      <div className="text-[10px] text-[#8e8e8e] uppercase mt-1">2 HOURS AGO</div>
    </div>
    <div className="border-t border-[#efefef] px-4 py-2 flex items-center gap-3">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
      </svg>
      <input 
        type="text" 
        placeholder="Add a comment..."
        className="flex-1 text-[14px] outline-none"
        readOnly
      />
      <button className="text-[#0095f6] font-semibold text-[14px]">Post</button>
    </div>
  </div>
);

const YouTubePreview = ({ content }: { content: string }) => (
  <div className="bg-white rounded-xl overflow-hidden font-sans max-w-[360px]">
    <div className="relative aspect-video bg-black flex items-center justify-center group cursor-pointer">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900"></div>
      <div className="relative z-10 w-16 h-16 bg-[#ff0000] rounded-full flex items-center justify-center shadow-lg group-hover:bg-[#cc0000] transition-colors">
        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
      </div>
      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-1 rounded">
        4:20
      </div>
    </div>
    <div className="p-3 flex gap-3">
      <div className="w-9 h-9 bg-[#ff0000] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
        U
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-[14px] leading-[20px] text-[#0f0f0f] line-clamp-2 mb-1">
          {content}
        </h3>
        <div className="text-[12px] leading-[18px] text-[#606060]">
          <div className="mb-0.5">Channel Name</div>
          <div className="flex items-center gap-1">
            <span>1.2K views</span>
            <span>•</span>
            <span>2 hours ago</span>
          </div>
        </div>
      </div>
      <button className="text-[#0f0f0f] hover:text-[#606060] p-2">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 16.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zM10.5 12c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5zm0-6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5z"></path>
        </svg>
      </button>
    </div>
  </div>
);

const LinkedInPreview = ({ content }: { content: string }) => (
  <div className="bg-white border border-[#e0dfdc] rounded-lg overflow-hidden shadow-sm font-sans max-w-[552px]">
    <div className="p-3 flex items-start gap-2">
      <div className="w-12 h-12 bg-gradient-to-br from-[#1877f2] to-[#0a66c2] rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
        U
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-[14px] text-[#191919] hover:text-[#0a66c2] hover:underline cursor-pointer">
            Your Name
          </span>
          <span className="text-[#00000099] text-[12px]">• 1st</span>
        </div>
        <div className="text-[12px] text-[#00000099] leading-[16px]">
          Software Engineer | Content Creator
        </div>
        <div className="flex items-center gap-1 text-[12px] text-[#00000099] mt-0.5">
          <span>2h</span>
          <span>•</span>
          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 1 0 7 7 7 7 0 0 0-7-7zM3 8a5 5 0 0 1 5-5v5h5a5 5 0 0 1-10 0z"></path>
          </svg>
        </div>
      </div>
      <button className="text-[#00000099] hover:bg-[#00000014] rounded-full p-2">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 12a2 2 0 11-2-2 2 2 0 012 2zM4 10a2 2 0 102 2 2 2 0 00-2-2zm16 0a2 2 0 102 2 2 2 0 00-2-2z"></path>
        </svg>
      </button>
    </div>
    <div className="px-3 pb-2">
      <p className="text-[14px] text-[#191919] leading-[20px] whitespace-pre-wrap">
        {content}
      </p>
    </div>
    <div className="relative aspect-video bg-gradient-to-br from-[#f3f2ef] to-[#e8e6e3] flex items-center justify-center border-y border-[#e0dfdc]">
      <svg className="w-16 h-16 text-[#666666]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none"/>
        <path d="M21 15l-5-5L5 21"/>
      </svg>
    </div>
    <div className="px-3 py-2">
      <div className="flex items-center justify-between text-[12px] text-[#00000099] pb-2">
        <div className="flex items-center gap-1">
          <div className="flex items-center -space-x-1">
            <div className="w-4 h-4 bg-[#0a66c2] rounded-full flex items-center justify-center border border-white">
              <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0a8 8 0 018 8 8 8 0 01-8 8 8 8 0 01-8-8 8 8 0 018-8zm3.36 9.15l.31-2.09a.54.54 0 00-.52-.63h-1.7V5.38a1.07 1.07 0 011.07-1.07h.93V2.4a.54.54 0 00-.53-.54 11.26 11.26 0 00-1.46.09 2.72 2.72 0 00-2.37 2.92v1.56h-1.4a.54.54 0 00-.54.54v2a.54.54 0 00.54.54h1.4v4.95a.54.54 0 00.54.54h2.15a.54.54 0 00.54-.54V9.69h1.56z"></path>
              </svg>
            </div>
            <div className="w-4 h-4 bg-[#df704d] rounded-full flex items-center justify-center border border-white">
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.4 10.8h-.4l-.4.8h.5s0 .2-.1.3-.2.1-.4.1h-.6l-.6 1.2h1.7c.4 0 .7-.1.9-.3.2-.2.3-.5.3-.8 0-.4-.1-.7-.3-.9s-.6-.4-1-.4zm-4-7.2c-.8 0-1.5.3-2 .8s-.8 1.2-.8 2c0 .7.2 1.3.6 1.8L4 11.5l.9-.3 1.4-2.6c.4.1.8.1 1.1 0 .8-.2 1.5-.6 1.9-1.2.5-.6.7-1.4.6-2.1-.1-.8-.5-1.5-1.1-2s-1.4-.7-2.4-.7zm1.3 4.5c-.3.4-.8.6-1.3.7-.6.1-1.1 0-1.6-.3s-.8-.8-.9-1.4c-.1-.6 0-1.1.3-1.6s.8-.8 1.3-.9 1.1 0 1.6.3c.5.3.8.8.9 1.4.1.6 0 1.2-.3 1.8z"></path>
              </svg>
            </div>
            <div className="w-4 h-4 bg-[#6dae4f] rounded-full flex items-center justify-center border border-white">
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.67 6L7.34 9.33a.67.67 0 01-.94 0L4.33 7.26a.67.67 0 11.94-.94L6.86 7.9l3.87-2.82a.67.67 0 01.94.92z"></path>
              </svg>
            </div>
          </div>
          <span className="ml-1">142</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="hover:text-[#0a66c2] hover:underline">28 comments</button>
          <span>•</span>
          <button className="hover:text-[#0a66c2] hover:underline">5 reposts</button>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[#e0dfdc] pt-1">
        <button className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-[#00000014] rounded text-[#00000099] hover:text-[#191919] transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.46 11l-3.91-3.91a7 7 0 01-1.69-2.74l-.49-1.47A2.76 2.76 0 0010.76 1 2.75 2.75 0 008 3.74v1.12a9.19 9.19 0 00.46 2.85L8.89 9H4.12A2.12 2.12 0 002 11.12a2.16 2.16 0 00.92 1.76A2.11 2.11 0 002 14.62a2.14 2.14 0 001.28 2 2 2 0 00-.28 1 2.12 2.12 0 002 2.12v.14A2.12 2.12 0 007.12 22h7.49a8.08 8.08 0 003.58-.84l.31-.16H21V11zM19 19h-1l-.73.37a6.14 6.14 0 01-2.69.63H7.72a1 1 0 01-1-.72l-.25-.87-.85-.41A1 1 0 015 17l.17-1-.76-.74A1 1 0 014.27 14l.66-1.09-.73-1.1a.49.49 0 01.08-.7.48.48 0 01.34-.11h7.05l-1.31-3.92A7 7 0 0110 4.86V3.75a.77.77 0 01.75-.75.75.75 0 01.71.51L12 5a9 9 0 002.13 3.5l4.5 4.5H19z"></path>
          </svg>
          <span className="font-semibold text-[14px]">Like</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-[#00000014] rounded text-[#00000099] hover:text-[#191919] transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 9h10v1H7zm0 4h7v-1H7z"></path>
            <path d="M20.5 3A2.5 2.5 0 0123 5.5v12.93a2.5 2.5 0 01-2.5 2.5H5.9l-3.78 3a1 1 0 01-1.62-.77V5.5A2.5 2.5 0 013 3zM6.41 20H20.5a.5.5 0 00.5-.5V5.5a.5.5 0 00-.5-.5h-17a.5.5 0 00-.5.5v13.73z"></path>
          </svg>
          <span className="font-semibold text-[14px]">Comment</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-[#00000014] rounded text-[#00000099] hover:text-[#191919] transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23 12l-4.61 7H16l4-6H8a3.92 3.92 0 00-4 3.84V17a4 4 0 00.19 1.24L5.12 21H3l-.73-2.22A6.4 6.4 0 012 16.94 6 6 0 018 11h12l-4-6h2.39z"></path>
          </svg>
          <span className="font-semibold text-[14px]">Repost</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-[#00000014] rounded text-[#00000099] hover:text-[#191919] transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 3L0 10l7.66 4.26L16 8l-6.26 8.34L14 24l7-21z"></path>
          </svg>
          <span className="font-semibold text-[14px]">Send</span>
        </button>
      </div>
    </div>
  </div>
);

const GenericPreview = ({ content }: { content: string }) => (
  <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm p-4 font-sans">
    <div className="flex items-center gap-2 mb-3 text-zinc-500 border-b border-zinc-100 pb-2">
        <Globe size={14} />
        <span className="text-[10px] uppercase tracking-wider font-semibold">Generic Content</span>
    </div>
    <p className="text-zinc-800 text-[13px] leading-relaxed">{content}</p>
  </div>
);

// --- React Flow Nodes ---

export const PromptNode = ({ data, id }: NodeProps<Node<PromptNodeData>>) => {
  const { deleteElements } = useReactFlow();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };

  return (
    <div className="w-80 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-zinc-200 p-0 relative group font-sans transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
      {/* Target handle on left - receives connections from parent platform nodes */}
      <Handle type="target" position={Position.Left} className="!bg-emerald-500 !w-2.5 !h-2.5 !-left-[5px] !border-2 !border-white transition-all hover:!bg-emerald-600 hover:!w-3 hover:!h-3" />
      {/* Source handle on right - connects to processing node */}
      <Handle type="source" position={Position.Right} className="!bg-zinc-400 !w-2.5 !h-2.5 !-right-[5px] !border-2 !border-white transition-all hover:!bg-zinc-900 hover:!w-3 hover:!h-3" />
      
      {/* Hover Controls */}
      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <button
          onClick={handleDelete}
          className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all hover:scale-110"
          title="Delete"
        >
          <Trash2 size={12} />
        </button>
      </div>
      
      <div className="flex items-center justify-between p-3 border-b border-zinc-100 bg-zinc-50/50 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-zinc-900 rounded-md text-white shadow-sm">
              <MessageSquare size={12} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-700">Prompt</span>
        </div>
        {data.nodeName && (
          <span className="text-[10px] font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
            {data.nodeName}
          </span>
        )}
      </div>
      
      <div className="p-4 text-[13px] text-zinc-800 font-medium leading-relaxed">
        {data.content}
      </div>
    </div>
  );
};

export const ProcessingNode = ({ data, id }: NodeProps<Node<ProcessingNodeData>>) => {
  const { deleteElements } = useReactFlow();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };

  return (
    <div className="w-64 bg-zinc-900 text-white rounded-full shadow-lg border border-zinc-800 p-3 flex items-center gap-3 relative animate-pulse font-sans group">
      <Handle type="target" position={Position.Left} className="!bg-zinc-600 !w-2 !h-2 !border-none" />
      <Handle type="source" position={Position.Right} className="!bg-zinc-600 !w-2 !h-2 !border-none" />
      
      {/* Hover Controls */}
      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <button
          onClick={handleDelete}
          className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all hover:scale-110"
          title="Delete"
        >
          <Trash2 size={12} />
        </button>
      </div>
      
      <div className="p-2 bg-zinc-800 rounded-full shadow-inner">
        <Sparkles size={14} className="text-yellow-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mb-0.5">AI Processing</div>
        <div className="text-xs font-semibold truncate">{data.stage || "Generating..."}</div>
      </div>
      <Loader size={14} className="animate-spin text-zinc-500" />
    </div>
  );
};

export const PlatformNode = ({ data, id, positionAbsoluteX = 0, positionAbsoluteY = 0 }: NodeProps<Node<PlatformNodeData>>) => {
  const { deleteElements } = useReactFlow();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };

  const handleAddImprovementClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onAddImprovement) {
      // Pass the current position directly from props - this avoids stale closure issues
      const x = typeof positionAbsoluteX === 'number' && !isNaN(positionAbsoluteX) ? positionAbsoluteX : 0;
      const y = typeof positionAbsoluteY === 'number' && !isNaN(positionAbsoluteY) ? positionAbsoluteY : 0;
      const nodeName = data.nodeName || `${data.platform} Output`;
      data.onAddImprovement(id, data.platform, data.content, x, y, nodeName);
    }
  };

  const getPreview = () => {
    switch (data.platform) {
      case 'Twitter': return <TwitterPreview content={data.content} />;
      case 'Instagram': return <InstagramPreview content={data.content} />;
      case 'YouTube': return <YouTubePreview content={data.content} />;
      case 'LinkedIn': return <LinkedInPreview content={data.content} />;
      default: return <GenericPreview content={data.content} />;
    }
  };

  const getPlatformStyle = () => {
    switch (data.platform) {
        case 'Twitter': return { bg: 'bg-blue-500', icon: Twitter };
        case 'Instagram': return { bg: 'bg-pink-500', icon: Instagram };
        case 'YouTube': return { bg: 'bg-red-500', icon: Youtube };
        case 'LinkedIn': return { bg: 'bg-blue-700', icon: Linkedin };
        default: return { bg: 'bg-zinc-500', icon: Globe };
    }
  }

  const { bg, icon: Icon } = getPlatformStyle();

  return (
    <div className="w-[320px] relative group font-sans">
      {/* Target handle on left - receives connection from processing node */}
      <Handle type="target" position={Position.Left} className="!bg-zinc-300 !w-2.5 !h-2.5 !-left-[5px] !border-2 !border-white transition-all hover:!bg-zinc-900" />
      {/* Source handle on right - connects to extended chains (hidden, plus icon is used instead) */}
      <Handle type="source" position={Position.Right} className="!bg-emerald-500 !w-0 !h-0 !opacity-0 !pointer-events-none" id="chain-source" />
      
      {/* Delete Button - Top Right */}
      <div className="absolute -top-3 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
        <button
          onClick={handleDelete}
          className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all hover:scale-110"
          title="Delete"
        >
          <Trash2 size={12} />
        </button>
      </div>
      
      <div className="absolute -top-3 left-4 flex items-center gap-2 z-10">
        <div className={`px-2 py-1 ${bg} text-white rounded-full shadow-sm flex items-center gap-1.5 border border-white/20`}>
          <Icon size={10} strokeWidth={2.5} />
          <span className="text-[9px] font-bold uppercase tracking-wider">{data.platform}</span>
        </div>
        {data.nodeName && (
          <span className="text-[10px] font-medium text-zinc-600 bg-white px-2 py-0.5 rounded-full shadow-sm border border-zinc-200">
            {data.nodeName}
          </span>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 border border-zinc-200 group-hover:border-zinc-300/80">
        {getPreview()}
      </div>
      
      {/* Plus Icon on Right Side - Replaces the handle visually */}
      <div className="absolute top-1/2 -right-[18px] -translate-y-1/2 z-20">
        <button
          onClick={handleAddImprovementClick}
          className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg transition-all hover:scale-110 border-2 border-white"
          title="Extend and improve this content"
        >
          <Plus size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};


"use client"

import { useState } from "react"

interface Node {
  id: string;
  platform: string;
  content: string;
  x: number;
  y: number;
}

export default function CreateNewPage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState("Twitter");
  const [content, setContent] = useState("");

  const createNode = () => {
    if (!content.trim()) return;

    const newNode: Node = {
      id: Date.now().toString(),
      platform: selectedPlatform,
      content: content,
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100
    };

    setNodes(prev => [...prev, newNode]);
    setContent("");
  };

  const clearNodes = () => {
    setNodes([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Content Preview Canvas</h1>
        
        {/* Controls */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-2">Platform</label>
              <select 
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 min-w-[120px]"
              >
                <option value="Twitter">Twitter</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
                <option value="LinkedIn">LinkedIn</option>
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Content</label>
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your content..."
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                onKeyPress={(e) => e.key === 'Enter' && createNode()}
              />
            </div>
            
            <button
              onClick={createNode}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium"
            >
              Create Node
            </button>
            
            {nodes.length > 0 && (
              <button
                onClick={clearNodes}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div className="relative bg-white rounded-lg shadow-sm border-2 border-gray-200" style={{ height: '600px' }}>
          <div className="absolute top-4 left-4 text-sm text-gray-500">
            Nodes: {nodes.length}
          </div>
          
          {/* Render Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className="absolute bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-72 min-h-40"
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                zIndex: 10
              }}
            >
              {/* Platform Header */}
              <div className="flex items-center gap-2 mb-3">
                {node.platform === "Twitter" && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    T
                  </div>
                )}
                {node.platform === "Instagram" && (
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    I
                  </div>
                )}
                {node.platform === "YouTube" && (
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    ▶
                  </div>
                )}
                {node.platform === "LinkedIn" && (
                  <div className="w-6 h-6 bg-blue-700 rounded-sm flex items-center justify-center text-white text-xs font-bold">
                    in
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">{node.platform}</span>
              </div>

              {/* Content */}
              <div className="mb-3">
                <p className="text-sm text-gray-600 leading-relaxed">{node.content}</p>
              </div>

              {/* Footer */}
              <div className="text-xs text-gray-400 border-t border-gray-100 pt-2">
                {node.platform === "Twitter" && "Tweet Preview"}
                {node.platform === "Instagram" && "Post Preview"}
                {node.platform === "YouTube" && "Video Preview"}
                {node.platform === "LinkedIn" && "Post Preview"}
              </div>
            </div>
          ))}

          {/* Empty State */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-lg font-medium mb-2">Create Your First Node</h3>
                <p className="text-sm">Select a platform, enter content, and click &quot;Create Node&quot;</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

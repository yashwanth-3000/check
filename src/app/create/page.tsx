"use client"

import { useState, useRef, useCallback } from "react"
import { Panel, PanelGroup, PanelResizeHandle, ImperativePanelHandle } from "react-resizable-panels";
import { Node, Edge, Connection, addEdge, useNodesState, useEdgesState, ReactFlowInstance } from '@xyflow/react';

import FlowCanvas from "@/components/flow/FlowCanvas";
import { Sidebar } from "@/components/create/Sidebar";
import { ChatInterface } from "@/components/create/ChatInterface";
import { CanvasHeader } from "@/components/create/CanvasHeader";
import { PlatformDropdown } from "@/components/create/PlatformDropdown";

// Types (Keep these or move to a types file)
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

interface ChatHistory {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}

// Main Component
export default function CreatePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm here to help you create amazing designs and code. What would you like to build today?",
      timestamp: new Date(),
      isUser: false
    }
  ])
  
  const [chatHistory] = useState<ChatHistory[]>([
    {
      id: "1",
      title: "Landing Page Design",
      lastMessage: "Create a modern hero section",
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: "2", 
      title: "React Component Library",
      lastMessage: "Build a reusable button component",
      timestamp: new Date(Date.now() - 7200000)
    },
    {
      id: "3",
      title: "Admin Dashboard Layout",
      lastMessage: "Design a responsive sidebar and main content area",
      timestamp: new Date(Date.now() - 86400000)
    }
  ])

  const [currentInput, setCurrentInput] = useState("")
  const [isCodeMode, setIsCodeMode] = useState(false)
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState("All")
  const leftPanelRef = useRef<ImperativePanelHandle>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const chatInputRef = useRef<HTMLTextAreaElement | null>(null)
  const [parentNodeContext, setParentNodeContext] = useState<{ nodeId: string; platform: string; x: number; y: number; nodeName: string } | null>(null)

  // Node naming and selection state
  const [nodeCounter, setNodeCounter] = useState(0)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  // React Flow State
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Get selected node data
  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const selectedNodeData = selectedNode ? {
    id: selectedNode.id,
    type: selectedNode.type,
    name: String(selectedNode.data?.nodeName || 'Unknown'),
    platform: selectedNode.data?.platform as string | undefined,
    content: String(selectedNode.data?.content || selectedNode.data?.stage || '')
  } : null;

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  // Handle node click for selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  // Handle pane click to deselect
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // This callback receives position directly from the component, avoiding stale closure issues
  const handleAddImprovement = useCallback((nodeId: string, platform: string, content: string, x: number, y: number, nodeName: string) => {
    // Validate positions - ensure they are valid numbers
    const validX = typeof x === 'number' && !isNaN(x) ? x : 250;
    const validY = typeof y === 'number' && !isNaN(y) ? y : 150;
    
    // Store the parent node context for extension - position comes directly from component props
    setParentNodeContext({
      nodeId,
      platform,
      x: validX,
      y: validY,
      nodeName: nodeName || `${platform} Output`
    });
    
    // Populate the chat input with improvement suggestion
    const improvementPrompt = `Extend from "${nodeName || platform + ' Output'}": Improve this ${platform} content and make it more engaging.`;
    setCurrentInput(improvementPrompt);
    
    // Focus the chat input after a short delay to ensure it's rendered
    setTimeout(() => {
      const textarea = document.querySelector('textarea[placeholder="Ask anything..."]') as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  }, []);

  const handleSendMessage = () => {
    if (!currentInput.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: currentInput,
      timestamp: new Date(),
      isUser: true
    }
    setMessages(prev => [...prev, newMessage]);

    // --- Node Generation Logic ---
    let startX = 250;
    let startY = 150;
    let parentConnectionNodeId: string | null = null;
    let parentNodeName: string | null = null;
    
    // Increment node counter for naming
    const currentNodeNumber = nodeCounter + 1;
    setNodeCounter(currentNodeNumber);
    
    // Check if extending from a parent node (plus icon clicked)
    if (parentNodeContext) {
      // Position new chain to the right of the parent node
      startX = parentNodeContext.x + 550; // Position to the right
      startY = parentNodeContext.y; // Same vertical level as parent
      parentConnectionNodeId = parentNodeContext.nodeId;
      parentNodeName = parentNodeContext.nodeName;
      
      // Clear the parent context after using it
      setParentNodeContext(null);
    } else {
      // Normal flow: stack vertically below existing nodes
      const nodeYPositions = nodes.map(n => n.position.y).filter(y => typeof y === 'number' && !isNaN(y));
      const maxY = nodeYPositions.length > 0 ? Math.max(...nodeYPositions) + 300 : 150;
      startY = maxY;
    }
    
    // Ensure positions are valid numbers
    if (isNaN(startX)) startX = 250;
    if (isNaN(startY)) startY = 150; 

    // Generate node names
    const promptName = parentNodeName 
      ? `Prompt ${currentNodeNumber} (from ${parentNodeName})`
      : `Prompt ${currentNodeNumber}`;
    const processingName = `Processing ${currentNodeNumber}`;

    // 1. Add Prompt Node
    const promptNodeId = `prompt-${Date.now()}`;
    const promptNode: Node = {
        id: promptNodeId,
        type: 'prompt',
        position: { x: startX, y: startY },
        data: { 
          content: currentInput,
          nodeName: promptName,
          nodeNumber: currentNodeNumber
        }
    };
    
    // 2. Add Processing Node (Horizontal to the Right of Prompt)
    const processingNodeId = `proc-${Date.now()}`;
    const processingNode: Node = {
        id: processingNodeId,
        type: 'processing',
        position: { x: startX + 400, y: startY },
        data: { 
          stage: 'Analyzing Intent',
          nodeName: processingName,
          nodeNumber: currentNodeNumber
        }
    };

    const promptToProcEdge: Edge = {
        id: `e-${promptNodeId}-${processingNodeId}`,
        source: promptNodeId,
        target: processingNodeId,
        animated: true,
        style: { stroke: '#94a3b8' }
    };
    
    // If extending from a parent node, create edge from parent to new prompt
    const parentEdge: Edge | null = parentConnectionNodeId ? {
        id: `e-${parentConnectionNodeId}-${promptNodeId}`,
        source: parentConnectionNodeId,
        target: promptNodeId,
        animated: true,
        style: { stroke: '#10b981', strokeWidth: 2 }
    } : null;

    setNodes((nds) => [...nds, promptNode, processingNode]);
    setEdges((eds) => parentEdge ? [...eds, parentEdge, promptToProcEdge] : [...eds, promptToProcEdge]);
    
    setCurrentInput("");

    const aiMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: aiMessageId,
      isUser: false,
      content: "",
      timestamp: new Date(),
      thinkingSteps: []
    }]);

    // Simulate Processing
    setTimeout(() => {
        setNodes((nds) => nds.map((n) => {
            if (n.id === processingNodeId) {
                return { ...n, data: { ...n.data, stage: 'Generating Content' } };
            }
            return n;
        }));

        setMessages(prev => prev.map(m => m.id === aiMessageId ? {
            ...m,
            thinkingSteps: [...(m.thinkingSteps || []), { 
                title: "Creating Content Preview", 
                content: `I'm generating ${selectedPlatform === "All" ? "previews for all platforms" : `a ${selectedPlatform} preview`} for your content.`
            }]
        } : m));
    }, 1500);

    // Finalize
    setTimeout(() => {
        // 3. Add Platform Node(s) - Horizontal to the Right of Processing
        const platformsToGenerate = selectedPlatform === "All" 
            ? ["Twitter", "Instagram", "LinkedIn", "YouTube"] 
            : [selectedPlatform];

        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];

        platformsToGenerate.forEach((platform, index) => {
            const platformNodeId = `platform-${Date.now()}-${index}`;
            const outputNumber = index + 1;
            const outputName = `${platform} Output ${currentNodeNumber}.${outputNumber}`;
            
            // For "All", give proper vertical spacing between platforms
            // Center them around the processing node
            const yOffset = selectedPlatform === "All" 
                ? (index * 450) - ((platformsToGenerate.length - 1) * 225) 
                : 0;
            
            const platformNode: Node = {
                id: platformNodeId,
                type: 'platform',
                position: { x: startX + 800, y: startY + yOffset },
                data: { 
                    platform: platform,
                    content: currentInput, // In real app, this would be AI generated per platform
                    onAddImprovement: handleAddImprovement,
                    nodeName: outputName,
                    nodeNumber: currentNodeNumber,
                    outputNumber: outputNumber
                }
            };
            newNodes.push(platformNode);

            const procToPlatformEdge: Edge = {
                id: `e-${processingNodeId}-${platformNodeId}`,
                source: processingNodeId,
                target: platformNodeId,
                animated: true,
                style: { stroke: '#3b82f6' }
            };
            newEdges.push(procToPlatformEdge);
        });

        setNodes((nds) => {
             // Mark processing as done and add new platform nodes
             const updatedNodes = nds.map(n => n.id === processingNodeId ? { ...n, data: { ...n.data, stage: 'Complete' } } : n);
             return [...updatedNodes, ...newNodes];
        });
        setEdges((eds) => [...eds, ...newEdges]);

        setMessages(prev => prev.map(m => m.id === aiMessageId ? {
            ...m,
            content: `I've created ${platformsToGenerate.length > 1 ? 'previews for all platforms' : `a ${selectedPlatform} preview`} on your canvas.`
        } : m));

        // Auto-fit view to show all nodes with padding
        setTimeout(() => {
            if (reactFlowInstance) {
                reactFlowInstance.fitView({ 
                    padding: 0.2,
                    duration: 800,
                    maxZoom: 1
                });
            }
        }, 100);

    }, 3500);
  }

  const toggleLeftSidebar = () => {
    const panel = leftPanelRef.current;
    if (panel) {
      if (panel.isCollapsed()) {
        panel.expand();
      } else {
        panel.collapse();
      }
    }
  }

  return (
    <div className="h-screen bg-white text-slate-800 flex flex-col font-sans overflow-hidden">
      <div className="flex-1 flex h-full">
        <PanelGroup direction="horizontal" className="w-full h-full">
          <Panel 
            ref={leftPanelRef}
            collapsible 
            collapsedSize={4}
            minSize={15}
            defaultSize={18}
            onCollapse={() => setIsLeftSidebarCollapsed(true)}
            onExpand={() => setIsLeftSidebarCollapsed(false)}
            className="!overflow-y-auto border-r border-slate-200"
          >
            <Sidebar 
                isCollapsed={isLeftSidebarCollapsed} 
                toggleSidebar={toggleLeftSidebar} 
                chatHistory={chatHistory} 
            />
          </Panel>
          
          <ResizeHandle />
          
          <Panel minSize={30} defaultSize={57}>
             <div className="flex flex-col h-full bg-slate-50/30">
                <CanvasHeader 
                    isCodeMode={isCodeMode} 
                    setIsCodeMode={setIsCodeMode} 
                />
                <div className="flex-1 relative">
                    <FlowCanvas 
                        nodes={nodes} 
                        edges={edges} 
                        onNodesChange={onNodesChange} 
                        onEdgesChange={onEdgesChange} 
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onNodeClick={onNodeClick}
                        onPaneClick={onPaneClick}
                        selectedNodeId={selectedNodeId}
                    />
                </div>
             </div>
          </Panel>
          
          <ResizeHandle />
          
          <Panel defaultSize={25} minSize={20} maxSize={40} className="border-l border-slate-200">
            <ChatInterface 
              messages={messages} 
              currentInput={currentInput}
              setCurrentInput={setCurrentInput}
              handleSendMessage={handleSendMessage}
              isCodeMode={isCodeMode}
              selectedPlatform={selectedPlatform}
              setSelectedPlatform={setSelectedPlatform}
              PlatformDropdown={PlatformDropdown}
              inputRef={chatInputRef}
              selectedNode={selectedNodeData}
              parentNodeContext={parentNodeContext}
            />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  )
}

const ResizeHandle = ({ className = '' }: { className?: string }) => (
  <PanelResizeHandle 
    className={`w-[1px] bg-transparent hover:bg-blue-400 hover:w-1 transition-all flex items-center justify-center group z-50 ${className}`}>
    <div className="w-[1px] h-full bg-slate-200 group-hover:bg-blue-400" />
  </PanelResizeHandle>
);

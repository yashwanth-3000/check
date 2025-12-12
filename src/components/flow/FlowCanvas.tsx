import React, { useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  SelectionMode,
  OnNodesChange,
  OnEdgesChange,
  ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { PromptNode, ProcessingNode, PlatformNode } from './CustomNodes';

const nodeTypes = {
  prompt: PromptNode,
  processing: ProcessingNode,
  platform: PlatformNode,
};

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  onInit?: (instance: ReactFlowInstance) => void;
  onNodeClick?: (event: React.MouseEvent, node: Node) => void;
  onPaneClick?: () => void;
  selectedNodeId?: string | null;
}

export default function FlowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onInit,
  onNodeClick,
  onPaneClick,
  selectedNodeId,
}: FlowCanvasProps) {
  // Add selected styling to nodes
  const styledNodes: Node[] = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      selected: node.id === selectedNodeId,
    })) as Node[];
  }, [nodes, selectedNodeId]);
  return (
    <div className="w-full h-full bg-zinc-50/50">
      <ReactFlow
        nodes={styledNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        selectionMode={SelectionMode.Partial}
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        proOptions={{ hideAttribution: true }}
      >
        <Controls 
            showInteractive={false}
            showZoom={true}
            showFitView={true}
            fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
            className="!bg-white !shadow-lg !border !border-zinc-200 !rounded-xl !m-4 !p-2 !gap-2" 
        />
        <MiniMap 
            className="!bg-white !shadow-lg !border !border-zinc-200 !rounded-xl !m-4"
            nodeColor={(node) => {
                switch (node.type) {
                    case 'prompt': return '#18181b'; // zinc-900
                    case 'platform': return '#3b82f6'; // blue-500
                    case 'processing': return '#fbbf24'; // amber-400
                    default: return '#e4e4e7'; // zinc-200
                }
            }}
            maskColor="rgba(244, 244, 245, 0.6)" // zinc-100 with opacity
            zoomable
            pannable
        />
        <Background 
            variant={BackgroundVariant.Dots} 
            gap={24} 
            size={1.5} 
            color="#e4e4e7" // zinc-200
            className="opacity-50"
        />
      </ReactFlow>
    </div>
  );
}

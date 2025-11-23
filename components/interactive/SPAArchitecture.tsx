'use client';

import { useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'User Browser' },
    position: { x: 100, y: 100 },
    style: {
      background: '#3b82f6',
      color: '#fff',
      border: '2px solid #1e40af',
      borderRadius: '8px',
      padding: '20px',
      width: 200,
    },
  },
  {
    id: '2',
    data: { label: 'SPA Client\n(SpaClient.tsx)' },
    position: { x: 400, y: 100 },
    style: {
      background: '#10b981',
      color: '#fff',
      border: '2px solid #059669',
      borderRadius: '8px',
      padding: '20px',
      width: 200,
    },
  },
  {
    id: '3',
    data: { label: 'UIF Components\n(Rendering)' },
    position: { x: 700, y: 100 },
    style: {
      background: '#8b5cf6',
      color: '#fff',
      border: '2px solid #6d28d9',
      borderRadius: '8px',
      padding: '20px',
      width: 200,
    },
  },
  {
    id: '4',
    data: { label: 'Router\n(Navigation)' },
    position: { x: 400, y: 250 },
    style: {
      background: '#f59e0b',
      color: '#fff',
      border: '2px solid #d97706',
      borderRadius: '8px',
      padding: '20px',
      width: 200,
    },
  },
  {
    id: '5',
    data: { label: 'State Management\n(Store)' },
    position: { x: 700, y: 250 },
    style: {
      background: '#ec4899',
      color: '#fff',
      border: '2px solid #db2777',
      borderRadius: '8px',
      padding: '20px',
      width: 200,
    },
  },
  {
    id: '6',
    type: 'output',
    data: { label: 'SPA Server\n(SpaServer.ts)' },
    position: { x: 400, y: 400 },
    style: {
      background: '#ef4444',
      color: '#fff',
      border: '2px solid #dc2626',
      borderRadius: '8px',
      padding: '20px',
      width: 200,
    },
  },
  {
    id: '7',
    type: 'output',
    data: { label: 'NetSuite APIs\n(N/record, N/search)' },
    position: { x: 700, y: 400 },
    style: {
      background: '#6366f1',
      color: '#fff',
      border: '2px solid #4f46e5',
      borderRadius: '8px',
      padding: '20px',
      width: 200,
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    label: 'Loads',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    label: 'Renders',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
    label: 'Uses',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e2-5',
    source: '2',
    target: '5',
    label: 'Manages',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e3-6',
    source: '3',
    target: '6',
    label: 'API Calls',
    animated: true,
    style: { stroke: '#ef4444' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e6-7',
    source: '6',
    target: '7',
    label: 'Queries',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e7-6',
    source: '7',
    target: '6',
    label: 'Returns Data',
    animated: true,
    style: { stroke: '#10b981' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e6-3',
    source: '6',
    target: '3',
    label: 'Updates UI',
    animated: true,
    style: { stroke: '#10b981' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];

export default function SPAArchitecture() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const nodeDescriptions: Record<string, string> = {
    '1': 'The user\'s web browser loads the SPA from NetSuite',
    '2': 'SpaClient.tsx is the entry point that bootstraps the application',
    '3': 'UIF components render the user interface using React-like patterns',
    '4': 'Router handles navigation and URL changes without page reloads',
    '5': 'Store manages application state (similar to Redux)',
    '6': 'SpaServer.ts handles server-side logic and API endpoints',
    '7': 'NetSuite APIs provide data access (records, searches, etc.)',
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        SPA Architecture
      </h3>
      <p className="text-center text-gray-600 mb-6">
        Click on any node to learn more about it
      </p>

      <div className="h-[600px] border-2 border-gray-200 rounded-lg">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {selectedNode && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-lg font-semibold text-blue-900 mb-2">
            {selectedNode.data.label}
          </h4>
          <p className="text-blue-800">
            {nodeDescriptions[selectedNode.id] || 'No description available'}
          </p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Client-Side</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Runs in the browser</li>
            <li>Handles UI rendering</li>
            <li>Manages routing and state</li>
          </ul>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Server-Side</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Runs in NetSuite</li>
            <li>Handles business logic</li>
            <li>Accesses NetSuite data</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


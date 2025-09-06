import React, { useState, useCallback } from 'react';
import ReactFlow, { 
  addEdge, 
  Controls, 
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode
} from 'react-flow-renderer';

// Default styling themes
const defaultThemes = {
  primary: { background: '#e1f5fe', border: '2px solid #0277bd', borderRadius: 8 },
  secondary: { background: '#f3e5f5', border: '2px solid #7b1fa2', borderRadius: 8 },
  accent: { background: '#fff3e0', border: '2px solid #f57c00', borderRadius: 8 },
  danger: { background: '#ffebee', border: '2px solid #d32f2f', borderRadius: 8 },
  success: { background: '#e8f5e8', border: '2px solid #2e7d32', borderRadius: 8 },
  warning: { background: '#fff8e1', border: '2px solid #f9a825', borderRadius: 8 },
  info: { background: '#f3e5f5', border: '2px solid #1976d2', borderRadius: 8 }
};

export const mockData = [
  {
    campaign: "Campaign 1",
    mitreTactic: "Initial Access",
    agentIP: "192.168.1.101",
    maliciousConfidence: "High",
    description: "Phishing email with malicious macro for access.",
    node: [ 
    { 
      id: '1', 
      type: 'input', 
      data: { label: 'Campaign' }, 
      position: { x: 250, y: 5 },
      theme: 'primary'
    },
    { 
      id: '2', 
      data: { label: 'Event Id Pattern Recognition' }, 
      position: { x: 100, y: 100 },
      theme: 'secondary'
    },
    { 
      id: '3', 
      data: { label: 'Behavioral Sequence Analysis' }, 
      position: { x: 400, y: 200 },
      theme: 'accent'
    },
    { 
      id: '5', 
      data: { label: 'Intervened' }, 
      position: { x: 600, y: 300 },
      theme: 'danger'
    }
    ],
    edge: [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '2', target: '3' },
      { id: 'e4', source: '3', target: '5' }
    ]
  },
  {
    campaign: "Campaign 2",
    mitreTactic: "Lateral Movement",
    agentIP: "192.168.1.102",
    maliciousConfidence: "Medium",
    description: "WMI used to move across the network.",
    node: [ 
    { 
      id: '1', 
      type: 'input', 
      data: { label: 'Campaign2' }, 
      position: { x: 250, y: 5 },
      theme: 'primary'
    },
    { 
      id: '2', 
      data: { label: 'Event Id Pattern Recognition2' }, 
      position: { x: 100, y: 100 },
      theme: 'secondary'
    },
    { 
      id: '3', 
      data: { label: 'Behavioral Sequence Analysis2' }, 
      position: { x: 400, y: 200 },
      theme: 'accent'
    },
    { 
      id: '5', 
      data: { label: 'Intervened2' }, 
      position: { x: 600, y: 300 },
      theme: 'danger'
    }
    ],
    edge: [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '2', target: '3' },
      { id: 'e4', source: '3', target: '5' }
    ]
  }  
];



export const campaignNodes = [ 
    { 
      id: '1', 
      type: 'input', 
      data: { label: 'Campaign' }, 
      position: { x: 250, y: 5 },
      theme: 'primary'
    },
    { 
      id: '2', 
      data: { label: 'Event Id Pattern Recognition' }, 
      position: { x: 100, y: 100 },
      theme: 'secondary'
    },
    { 
      id: '3', 
      data: { label: 'Behavioral Sequence Analysis' }, 
      position: { x: 400, y: 200 },
      theme: 'accent'
    },
    { 
      id: '5', 
      data: { label: 'Intervened' }, 
      position: { x: 600, y: 300 },
      theme: 'danger'
    }
  ];

export const campaignNodes2 = [ 
    { 
      id: '1', 
      type: 'input', 
      data: { label: 'Campaign2' }, 
      position: { x: 250, y: 5 },
      theme: 'primary'
    },
    { 
      id: '2', 
      data: { label: 'Event Id Pattern Recognition2' }, 
      position: { x: 100, y: 100 },
      theme: 'secondary'
    },
    { 
      id: '3', 
      data: { label: 'Behavioral Sequence Analysis2' }, 
      position: { x: 400, y: 200 },
      theme: 'accent'
    },
    { 
      id: '5', 
      data: { label: 'Intervened2' }, 
      position: { x: 600, y: 300 },
      theme: 'danger'
    }
  ];

  export const campaignEdges2 = [
    { id: 'e1', source: '1', target: '2' },
    { id: 'e2', source: '2', target: '3' },
    { id: 'e4', source: '3', target: '5' }
  ];



const defaultEdgeStyle = { stroke: '#0277bd', strokeWidth: 2 };

// Reusable Flow Diagram Component
export const FlowDiagram = ({ 
  nodeConfig = [], 
  edgeConfig = [], 
  width = '100%', 
  height = '600px',
  themes = defaultThemes,
  edgeStyle = defaultEdgeStyle,
  backgroundProps = { color: "#aaa", gap: 16 },
  connectionMode = ConnectionMode.Loose,
  showControls = true,
  showBackground = true,
  containerStyle = {},
  // onNodeClick,
  // onEdgeClick,
  allowConnection = true
}) => {
  // Process nodes with themes
  const processedNodes = nodeConfig.map(node => ({
    ...node,
    style: node.theme ? themes[node.theme] : (node.style || themes.primary)
  }));

  // Process edges with default styling
  const processedEdges = edgeConfig.map(edge => ({
    ...edge,
    style: edge.style || edgeStyle,
    animated: edge.animated !== undefined ? edge.animated : true
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(processedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(processedEdges);

  const onConnect = useCallback(
    (params) => {
      if (allowConnection) {
        setEdges((eds) => addEdge(params, eds));
      }
    },
    [setEdges, allowConnection]
  );

  const defaultContainerStyle = {
    width,
    height,
    border: '1px solid #ddd',
    borderRadius: 8,
    ...containerStyle
  };

  return (
    <div style={defaultContainerStyle}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionMode={connectionMode}
        fitView
      >
        {showControls && <Controls />}
        {showBackground && <Background {...backgroundProps} />}
      </ReactFlow>
    </div>
  );
};

// Example usage - Campaign Flow
const CampaignFlow = () => {
  
  const handleNodeClick = (event, node) => {
    console.log('Node clicked:', node);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Campaign Flow Diagram</h2>
      <FlowDiagram 
        height="500px"
      />
    </div>
  );
};

// Example usage - Different Flow
const DataProcessingFlow = () => {
  const dataNodes = [
    { 
      id: '1', 
      type: 'input', 
      data: { label: 'Raw Data' }, 
      position: { x: 100, y: 50 },
      theme: 'info'
    },
    { 
      id: '2', 
      data: { label: 'Data Cleaning' }, 
      position: { x: 300, y: 50 },
      theme: 'warning'
    },
    { 
      id: '3', 
      data: { label: 'Analysis' }, 
      position: { x: 500, y: 50 },
      theme: 'accent'
    },
    { 
      id: '4', 
      type: 'output', 
      data: { label: 'Results' }, 
      position: { x: 700, y: 50 },
      theme: 'success'
    }
  ];

  const dataEdges = [
    { id: 'e1', source: '1', target: '2' },
    { id: 'e2', source: '2', target: '3' },
    { id: 'e3', source: '3', target: '4' }
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Data Processing Flow</h2>
      <FlowDiagram 
        nodeConfig={dataNodes}
        edgeConfig={dataEdges}
        height="300px"
        backgroundProps={{ color: "#f0f0f0", gap: 20 }}
        edgeStyle={{ stroke: '#2e7d32', strokeWidth: 3 }}
      />
    </div>
  );
};
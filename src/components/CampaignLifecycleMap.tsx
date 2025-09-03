import React, { useState, useRef, useCallback } from 'react';

export type CampaignStage = {
  id: string;
  x: number;
  y: number;
  label: string;
  description?: string;
  status?: 'planning' | 'active' | 'paused' | 'completed' | 'failed';
};

export type Campaign = {
  id: string;
  name: string;
  color: string; // Use semantic color tokens
  stages: string[]; // stage ids in lifecycle order
  startY: number; // Y position where this campaign starts on X axis
};

export type CampaignLifecycleMapProps = {
  width?: number;
  height?: number;
  grid?: boolean;
  stages: CampaignStage[];
  campaigns: Campaign[];
  onSelectStage?: (stageId: string, campaignId: string) => void;
};

const CampaignLifecycleMap: React.FC<CampaignLifecycleMapProps> = ({
  width = 1000,
  height = 600,
  grid = true,
  stages,
  campaigns,
  onSelectStage,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const [focusedStage, setFocusedStage] = useState<string | null>(null);

  const minZoom = 0.5;
  const maxZoom = 3.0;

  // Create stage lookup map
  const stageMap = stages.reduce((acc, stage) => {
    acc[stage.id] = stage;
    return acc;
  }, {} as Record<string, CampaignStage>);

  // Generate grid pattern
  const gridSize = 25;
  const gridDots = [];
  if (grid) {
    for (let x = 0; x <= width; x += gridSize) {
      for (let y = 0; y <= height; y += gridSize) {
        gridDots.push({ x, y });
      }
    }
  }

  // Handle zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const delta = -e.deltaY * 0.001;
    const newScale = Math.max(minZoom, Math.min(maxZoom, transform.scale + delta));
    
    if (newScale !== transform.scale) {
      const scaleRatio = newScale / transform.scale;
      setTransform(prev => ({
        x: mouseX - (mouseX - prev.x) * scaleRatio,
        y: mouseY - (mouseY - prev.y) * scaleRatio,
        scale: newScale,
      }));
    }
  }, [transform.scale]);

  // Handle pan start
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as Element).classList.contains('campaign-background')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  }, [transform.x, transform.y]);

  // Handle pan
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    }
  }, [isDragging, dragStart]);

  // Handle pan end
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle stage click
  const handleStageClick = useCallback((stageId: string, campaignId: string) => {
    onSelectStage?.(stageId, campaignId);
  }, [onSelectStage]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && focusedStage) {
      const campaign = campaigns.find(c => c.stages.includes(focusedStage));
      if (campaign) {
        handleStageClick(focusedStage, campaign.id);
      }
    }
  }, [focusedStage, handleStageClick, campaigns]);

  // Generate path for a campaign
  const generateCampaignPath = (campaign: Campaign) => {
    const campaignStages = campaign.stages
      .map(id => stageMap[id])
      .filter(Boolean);

    if (campaignStages.length < 2) return '';

    // Start from X axis (left side)
    const startX = 0;
    const startY = campaign.startY;
    
    let path = `M ${startX} ${startY} L ${campaignStages[0].x} ${campaignStages[0].y}`;
    
    for (let i = 1; i < campaignStages.length; i++) {
      path += ` L ${campaignStages[i].x} ${campaignStages[i].y}`;
    }
    
    return path;
  };

  // Get status color
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'planning': return 'hsl(var(--info))';
      case 'active': return 'hsl(var(--chart-1))';
      case 'paused': return 'hsl(var(--medium))';
      case 'completed': return 'hsl(142 71% 45%)';
      case 'failed': return 'hsl(var(--critical))';
      default: return 'hsl(var(--muted-foreground))';
    }
  };

  // Truncate long labels
  const truncateLabel = (label: string, maxLength = 15) => {
    return label.length > maxLength ? label.substring(0, maxLength) + '...' : label;
  };

  return (
    <div className="relative w-full bg-background rounded-lg border border-border overflow-hidden">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="img"
        aria-label="Campaign lifecycle map diagram"
      >
        <defs>
          {/* Grid pattern */}
          {grid && (
            <pattern id="campaign-grid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
              <circle cx={gridSize / 2} cy={gridSize / 2} r="1" fill="hsl(var(--border))" opacity="0.3" />
            </pattern>
          )}
          
          {/* Glow filters */}
          <filter id="campaign-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Arrow marker */}
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="hsl(var(--muted-foreground))"
            />
          </marker>
        </defs>

        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
          {/* Grid background */}
          {grid && (
            <rect
              width={width}
              height={height}
              fill="url(#campaign-grid)"
              className="campaign-background"
            />
          )}

          {/* X-axis baseline */}
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={height}
            stroke="hsl(var(--border))"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.5"
          />

          {/* Campaign paths */}
          {campaigns.map(campaign => (
            <g key={campaign.id}>
              {/* Campaign path */}
              <path
                d={generateCampaignPath(campaign)}
                stroke={campaign.color}
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#campaign-glow)"
                opacity="0.8"
                markerEnd="url(#arrowhead)"
              />
              
              {/* Campaign label at start */}
              <text
                x="10"
                y={campaign.startY - 10}
                className="text-sm font-medium fill-foreground"
                textAnchor="start"
              >
                {campaign.name}
              </text>
            </g>
          ))}

          {/* Stages */}
          {stages.map(stage => {
            const isHovered = hoveredStage === stage.id;
            const isFocused = focusedStage === stage.id;
            const campaign = campaigns.find(c => c.stages.includes(stage.id));
            
            return (
              <g key={stage.id}>
                {/* Stage circle */}
                <circle
                  cx={stage.x}
                  cy={stage.y}
                  r="8"
                  fill={getStatusColor(stage.status)}
                  stroke="hsl(var(--background))"
                  strokeWidth="2"
                  className="cursor-pointer transition-transform duration-200"
                  style={{
                    transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                    transformOrigin: `${stage.x}px ${stage.y}px`,
                  }}
                  onMouseEnter={() => setHoveredStage(stage.id)}
                  onMouseLeave={() => setHoveredStage(null)}
                  onFocus={() => setFocusedStage(stage.id)}
                  onBlur={() => setFocusedStage(null)}
                  onClick={() => campaign && handleStageClick(stage.id, campaign.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Campaign stage ${stage.label}`}
                />

                {/* Focus ring */}
                {isFocused && (
                  <circle
                    cx={stage.x}
                    cy={stage.y}
                    r="14"
                    fill="none"
                    stroke="hsl(var(--ring))"
                    strokeWidth="2"
                    strokeDasharray="3,3"
                  />
                )}

                {/* Hover ring */}
                {isHovered && (
                  <circle
                    cx={stage.x}
                    cy={stage.y}
                    r="16"
                    fill="none"
                    stroke="hsl(var(--foreground))"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                )}

                {/* Stage label */}
                <text
                  x={stage.x}
                  y={stage.y - 20}
                  textAnchor="middle"
                  className="text-xs fill-foreground font-medium pointer-events-none select-none"
                >
                  <title>{stage.label}</title>
                  {truncateLabel(stage.label)}
                </text>

                {/* Description callout */}
                {stage.description && isHovered && (
                  <g>
                    {/* Callout bubble */}
                    <rect
                      x={stage.x + 20}
                      y={stage.y - 30}
                      width={Math.min(stage.description.length * 8 + 16, 200)}
                      height="24"
                      rx="12"
                      fill="hsl(var(--popover))"
                      stroke="hsl(var(--border))"
                      strokeWidth="1"
                    />
                    {/* Callout text */}
                    <text
                      x={stage.x + 28}
                      y={stage.y - 14}
                      className="text-xs fill-popover-foreground font-normal pointer-events-none select-none"
                    >
                      {truncateLabel(stage.description, 25)}
                    </text>
                    {/* Callout pointer */}
                    <path
                      d={`M ${stage.x + 20} ${stage.y - 18} L ${stage.x + 12} ${stage.y - 8} L ${stage.x + 20} ${stage.y - 6}`}
                      fill="hsl(var(--popover))"
                    />
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Zoom controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          className="w-10 h-10 bg-card border border-border rounded-md text-foreground hover:bg-accent flex items-center justify-center text-lg font-bold"
          onClick={() => setTransform(prev => ({ ...prev, scale: Math.min(maxZoom, prev.scale * 1.2) }))}
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          className="w-10 h-10 bg-card border border-border rounded-md text-foreground hover:bg-accent flex items-center justify-center text-lg font-bold"
          onClick={() => setTransform(prev => ({ ...prev, scale: Math.max(minZoom, prev.scale / 1.2) }))}
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          className="w-10 h-10 bg-card border border-border rounded-md text-foreground hover:bg-accent flex items-center justify-center text-sm"
          onClick={() => setTransform({ x: 0, y: 0, scale: 1 })}
          aria-label="Reset view"
        >
          ⌂
        </button>
      </div>

      {/* Scale indicator */}
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-card px-2 py-1 rounded border border-border">
        Zoom: {Math.round(transform.scale * 100)}%
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-card border border-border rounded-lg p-3">
        <h3 className="text-sm font-semibold text-foreground mb-2">Campaign Status</h3>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--info))' }}></div>
            <span className="text-foreground">Planning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-1))' }}></div>
            <span className="text-foreground">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--medium))' }}></div>
            <span className="text-foreground">Paused</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(142 71% 45%)' }}></div>
            <span className="text-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--critical))' }}></div>
            <span className="text-foreground">Failed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignLifecycleMap;
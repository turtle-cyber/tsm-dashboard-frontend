import React, { useState, useRef, useCallback, useEffect } from 'react';

export type Station = {
  id: string;
  x: number;
  y: number;
  label: string;
  note?: string;
  campaignId?: string;
};

export type Line = {
  id: string;
  colorVar: string;
  stations: string[];
};

export type MetroMapProps = {
  width?: number;
  height?: number;
  grid?: boolean;
  stations: Station[];
  lines: Line[];
  onSelectStation?: (id: string) => void;
};

const MetroMap: React.FC<MetroMapProps> = ({
  width = 900,
  height = 380,
  grid = true,
  stations,
  lines,
  onSelectStation,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const [focusedStation, setFocusedStation] = useState<string | null>(null);

  const minZoom = 0.8;
  const maxZoom = 2.5;

  // Create station lookup map
  const stationMap = stations.reduce((acc, station) => {
    acc[station.id] = station;
    return acc;
  }, {} as Record<string, Station>);

  // Generate grid pattern
  const gridSize = 20;
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
    if (e.target === svgRef.current || (e.target as Element).classList.contains('metro-background')) {
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

  // Handle station click
  const handleStationClick = useCallback((stationId: string) => {
    onSelectStation?.(stationId);
  }, [onSelectStation]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && focusedStation) {
      handleStationClick(focusedStation);
    }
  }, [focusedStation, handleStationClick]);

  // Generate path for a line
  const generateLinePath = (line: Line) => {
    const lineStations = line.stations
      .map(id => stationMap[id])
      .filter(Boolean);

    if (lineStations.length < 2) return '';

    let path = `M ${lineStations[0].x} ${lineStations[0].y}`;
    for (let i = 1; i < lineStations.length; i++) {
      path += ` L ${lineStations[i].x} ${lineStations[i].y}`;
    }
    return path;
  };

  // Truncate long labels
  const truncateLabel = (label: string, maxLength = 20) => {
    return label.length > maxLength ? label.substring(0, maxLength) + '...' : label;
  };

  return (
    <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden">
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
        aria-label="Metro map diagram"
      >
        <defs>
          {/* Grid pattern */}
          {grid && (
            <pattern id="grid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
              <circle cx={gridSize / 2} cy={gridSize / 2} r="1" fill="rgba(255,255,255,0.1)" />
            </pattern>
          )}
          
          {/* Glow filters for dark mode */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Define line colors as CSS variables */}
          <style>
            {`.line-red { stroke: hsl(var(--critical)); }
              .line-blue { stroke: hsl(var(--info)); }
              .line-green { stroke: hsl(142 71% 45%); }
              .line-yellow { stroke: hsl(var(--medium)); }`}
          </style>
        </defs>

        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
          {/* Grid background */}
          {grid && (
            <rect
              width={width}
              height={height}
              fill="url(#grid)"
              className="metro-background"
            />
          )}

          {/* Lines */}
          {lines.map(line => (
            <path
              key={line.id}
              d={generateLinePath(line)}
              className={`line-${line.colorVar}`}
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              style={{ opacity: 0.8 }}
            />
          ))}

          {/* Stations */}
          {stations.map(station => {
            const isHovered = hoveredStation === station.id;
            const isFocused = focusedStation === station.id;
            
            return (
              <g key={station.id}>
                {/* Station circle */}
                <circle
                  cx={station.x}
                  cy={station.y}
                  r="6"
                  fill="#1f2937"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-pointer transition-transform duration-200"
                  style={{
                    transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                    transformOrigin: `${station.x}px ${station.y}px`,
                  }}
                  onMouseEnter={() => setHoveredStation(station.id)}
                  onMouseLeave={() => setHoveredStation(null)}
                  onFocus={() => setFocusedStation(station.id)}
                  onBlur={() => setFocusedStation(null)}
                  onClick={() => handleStationClick(station.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Station ${station.label}`}
                />

                {/* Focus ring */}
                {isFocused && (
                  <circle
                    cx={station.x}
                    cy={station.y}
                    r="10"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="2,2"
                  />
                )}

                {/* Hover ring */}
                {isHovered && (
                  <circle
                    cx={station.x}
                    cy={station.y}
                    r="12"
                    fill="none"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1"
                  />
                )}

                {/* Station label */}
                <text
                  x={station.x}
                  y={station.y - 15}
                  textAnchor="middle"
                  className="text-xs fill-gray-300 font-medium pointer-events-none select-none"
                >
                  <title>{station.label}</title>
                  {truncateLabel(station.label)}
                </text>

                {/* Note callout */}
                {station.note && (
                  <g>
                    {/* Callout bubble */}
                    <rect
                      x={station.x + 15}
                      y={station.y - 25}
                      width={Math.min(station.note.length * 6 + 10, 150)}
                      height="20"
                      rx="10"
                      fill="rgba(30, 41, 59, 0.9)"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="1"
                    />
                    {/* Callout text */}
                    <text
                      x={station.x + 20}
                      y={station.y - 12}
                      className="text-xs fill-gray-200 font-normal pointer-events-none select-none"
                    >
                      {truncateLabel(station.note, 20)}
                    </text>
                    {/* Callout pointer */}
                    <path
                      d={`M ${station.x + 15} ${station.y - 15} L ${station.x + 8} ${station.y - 8} L ${station.x + 15} ${station.y - 5}`}
                      fill="rgba(30, 41, 59, 0.9)"
                    />
                  </g>
                )}

                {/* Campaign status */}
                {station.campaignId && (
                  <text
                    x={station.x}
                    y={station.y + 25}
                    textAnchor="middle"
                    className="text-xs fill-orange-400 font-semibold pointer-events-none select-none"
                  >
                    {station.campaignId}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Zoom controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          className="w-8 h-8 bg-gray-800 border border-gray-600 rounded text-white hover:bg-gray-700 flex items-center justify-center"
          onClick={() => setTransform(prev => ({ ...prev, scale: Math.min(maxZoom, prev.scale * 1.2) }))}
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          className="w-8 h-8 bg-gray-800 border border-gray-600 rounded text-white hover:bg-gray-700 flex items-center justify-center"
          onClick={() => setTransform(prev => ({ ...prev, scale: Math.max(minZoom, prev.scale / 1.2) }))}
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          className="w-8 h-8 bg-gray-800 border border-gray-600 rounded text-white hover:bg-gray-700 flex items-center justify-center text-xs"
          onClick={() => setTransform({ x: 0, y: 0, scale: 1 })}
          aria-label="Reset view"
        >
          ⌂
        </button>
      </div>

      {/* Scale indicator */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-400">
        Zoom: {Math.round(transform.scale * 100)}%
      </div>
    </div>
  );
};

export default MetroMap;
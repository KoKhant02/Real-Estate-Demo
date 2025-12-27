import React, { useRef, useState } from 'react';
import type { CityMapConfig, ParsedPath, ParsedShape, WardMapConfig } from '../utils/svgParser';

interface Estate {
  shapeId: string;
  lotNumber: number;
  status: 'available' | 'purchased' | 'reserved';
  price: number;
  area: number;
  streetFacing?: string;
}

interface UniversalMapProps {
  config: WardMapConfig | CityMapConfig;
  estates?: Estate[];
  purchasedEstateIds?: Set<string>;
  selectedEstateId?: string | null;
  onEstateClick?: (shapeId: string) => void;
  onWardClick?: (wardId: string) => void;
  enableZoom?: boolean;
  enablePan?: boolean;
  showGrid?: boolean;
}

export function UniversalMap({
  config,
  estates = [],
  purchasedEstateIds = new Set(),
  selectedEstateId = null,
  onEstateClick,
  onWardClick,
  enableZoom = true,
  enablePan = true,
  showGrid = true
}: UniversalMapProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 5;
  const ZOOM_STEP = 0.1;

  // Handle zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (!enableZoom) return;
    e.preventDefault();
    
    // Disabled scroll-to-zoom - use buttons only
    // const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    // const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom + delta));
    // setZoom(newZoom);
  };

  // Handle pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!enablePan) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Get estate data for a shape
  const getEstateForShape = (shapeId: string): Estate | undefined => {
    return estates.find(e => e.shapeId === shapeId);
  };
  
  // Get estate data for a path
  const getEstateForPath = (pathId: string): Estate | undefined => {
    return estates.find(e => e.shapeId === pathId);
  };
  
  // Calculate centroid of a path by parsing SVG commands properly
  const calculatePathCentroid = (pathStr: string): { x: number; y: number } => {
    // Parse the path string to extract coordinates from all commands
    const commands = pathStr.match(/[MLHVCSQTAZmlhvcsqtaz][^MLHVCSQTAZmlhvcsqtaz]*/g) || [];
    const points: { x: number; y: number }[] = [];
    let currentX = 0;
    let currentY = 0;
    
    commands.forEach(cmd => {
      const type = cmd[0];
      const coords = cmd.slice(1).trim().match(/-?[\d.]+/g)?.map(Number) || [];
      
      switch (type.toUpperCase()) {
        case 'M': // moveto
        case 'L': // lineto
          for (let i = 0; i < coords.length; i += 2) {
            currentX = coords[i];
            currentY = coords[i + 1];
            points.push({ x: currentX, y: currentY });
          }
          break;
        case 'H': // horizontal lineto
          coords.forEach(x => {
            currentX = x;
            points.push({ x: currentX, y: currentY });
          });
          break;
        case 'V': // vertical lineto
          coords.forEach(y => {
            currentY = y;
            points.push({ x: currentX, y: currentY });
          });
          break;
        // For cubic/quadratic curves and other commands, extract coordinate pairs
        default:
          for (let i = 0; i < coords.length; i += 2) {
            if (coords[i + 1] !== undefined) {
              points.push({ x: coords[i], y: coords[i + 1] });
            }
          }
      }
    });
    
    if (points.length === 0) {
      return { x: config.width / 2, y: config.height / 2 };
    }
    
    // Calculate average centroid
    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    
    return {
      x: sumX / points.length,
      y: sumY / points.length
    };
  };

  // Get fill color for a shape
  const getShapeColor = (shape: ParsedShape): string => {
    const estate = getEstateForShape(shape.id);
    
    if (!estate) {
      // Not an estate, use original fill or default
      return shape.fill || '#e5e7eb';
    }

    // Estate coloring based on status
    if (purchasedEstateIds.has(shape.id)) return '#3b82f6'; // Blue
    if (selectedEstateId === shape.id) return '#10b981'; // Green
    if (estate.status === 'reserved') return '#8b5cf6'; // Purple
    return '#fbbf24'; // Yellow (available)
  };

  // Render coordinate grid
  const renderGrid = () => {
    if (!showGrid) return null;

    const gridLines = [];
    const interval = 50;

    // Vertical lines
    for (let x = 0; x <= config.width; x += interval) {
      gridLines.push(
        <line
          key={`grid-v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={config.height}
          stroke={x === 0 ? '#64748b' : '#cbd5e1'}
          strokeWidth={x === 0 ? 1 : 0.5}
        />
      );
    }

    // Horizontal lines
    for (let y = 0; y <= config.height; y += interval) {
      gridLines.push(
        <line
          key={`grid-h-${y}`}
          x1={0}
          y1={y}
          x2={config.width}
          y2={y}
          stroke={y === 0 ? '#64748b' : '#cbd5e1'}
          strokeWidth={y === 0 ? 1 : 0.5}
        />
      );
    }

    return <g className="grid" opacity="0.3">{gridLines}</g>;
  };

  // Render path element (updated to support estates)
  const renderPath = (path: ParsedPath, isClickable: boolean = false, onClick?: () => void) => {
    // Check if this path is an estate
    const estate = getEstateForPath(path.id);
    const isEstatePath = !!estate;
    
    let fillColor = path.fill || 'none';
    let isEstateClickable = false;
    
    if (isEstatePath && estate) {
      // This is an estate path - color it based on status
      if (purchasedEstateIds.has(path.id)) {
        fillColor = '#3b82f6'; // Blue - purchased
      } else if (selectedEstateId === path.id) {
        fillColor = '#10b981'; // Green - selected
      } else if (estate.status === 'reserved') {
        fillColor = '#8b5cf6'; // Purple - reserved
      } else if (estate.status === 'available') {
        fillColor = '#fbbf24'; // Yellow - available
        isEstateClickable = true;
      }
      
      // Calculate path center for label using a simple coordinate extraction
      const pathStr = path.d;
      const centroid = calculatePathCentroid(pathStr);
      
      return (
        <g key={path.id}>
          <path
            d={path.d}
            fill={fillColor}
            stroke={path.stroke || '#000000'}
            strokeWidth={path.strokeWidth || 1}
            className={isEstateClickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
            onClick={() => {
              if (isEstateClickable && onEstateClick) {
                onEstateClick(path.id);
              }
            }}
          />
          <text
            x={centroid.x}
            y={centroid.y}
            fontSize="16"
            fontWeight="bold"
            fill="#1f2937"
            textAnchor="middle"
            dominantBaseline="middle"
            className="pointer-events-none select-none"
            style={{ textShadow: '0 0 3px white, 0 0 3px white' }}
          >
            {estate.lotNumber}
          </text>
          {purchasedEstateIds.has(path.id) && (
            <text
              x={centroid.x}
              y={centroid.y + 20}
              fontSize="10"
              fontWeight="bold"
              fill="#ffffff"
              textAnchor="middle"
              dominantBaseline="middle"
              className="pointer-events-none select-none"
              style={{ textShadow: '0 0 2px #3b82f6, 0 0 2px #3b82f6' }}
            >
              PURCHASED
            </text>
          )}
        </g>
      );
    }
    
    // Not an estate, render normally
    return (
      <path
        key={path.id}
        d={path.d}
        fill={fillColor}
        stroke={path.stroke || '#000000'}
        strokeWidth={path.strokeWidth || 1}
        className={isClickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
        onClick={onClick}
      />
    );
  };

  // Render shape element
  const renderShape = (shape: ParsedShape) => {
    const estate = getEstateForShape(shape.id);
    const fillColor = getShapeColor(shape);
    const isClickable = estate && estate.status === 'available' && !purchasedEstateIds.has(shape.id);

    const handleClick = () => {
      if (isClickable && onEstateClick) {
        onEstateClick(shape.id);
      }
    };

    const commonProps = {
      fill: fillColor,
      stroke: shape.stroke || '#1f2937',
      strokeWidth: shape.strokeWidth || 2,
      className: isClickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : '',
      onClick: handleClick
    };

    // Calculate center for label
    let centerX = 0;
    let centerY = 0;

    if (shape.type === 'rect' && shape.x !== undefined && shape.y !== undefined) {
      centerX = shape.x + (shape.width || 0) / 2;
      centerY = shape.y + (shape.height || 0) / 2;
      
      return (
        <g key={shape.id}>
          <rect
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            {...commonProps}
          />
          {estate && (
            <text
              x={centerX}
              y={centerY}
              fontSize="14"
              fill="#1f2937"
              textAnchor="middle"
              dominantBaseline="middle"
              className="pointer-events-none"
            >
              {estate.lotNumber}
            </text>
          )}
        </g>
      );
    } else if (shape.type === 'polygon' && shape.polygon) {
      centerX = shape.polygon.reduce((sum, p) => sum + p.x, 0) / shape.polygon.length;
      centerY = shape.polygon.reduce((sum, p) => sum + p.y, 0) / shape.polygon.length;
      
      return (
        <g key={shape.id}>
          <polygon
            points={shape.points}
            {...commonProps}
          />
          {estate && (
            <text
              x={centerX}
              y={centerY}
              fontSize="14"
              fill="#1f2937"
              textAnchor="middle"
              dominantBaseline="middle"
              className="pointer-events-none"
            >
              {estate.lotNumber}
            </text>
          )}
        </g>
      );
    } else if (shape.type === 'circle' && shape.cx !== undefined && shape.cy !== undefined) {
      return (
        <g key={shape.id}>
          <circle
            cx={shape.cx}
            cy={shape.cy}
            r={shape.r}
            {...commonProps}
          />
          {estate && (
            <text
              x={shape.cx}
              y={shape.cy}
              fontSize="14"
              fill="#1f2937"
              textAnchor="middle"
              dominantBaseline="middle"
              className="pointer-events-none"
            >
              {estate.lotNumber}
            </text>
          )}
        </g>
      );
    } else if (shape.type === 'ellipse' && shape.cx !== undefined && shape.cy !== undefined) {
      return (
        <g key={shape.id}>
          <ellipse
            cx={shape.cx}
            cy={shape.cy}
            rx={shape.rx}
            ry={shape.ry}
            {...commonProps}
          />
          {estate && (
            <text
              x={shape.cx}
              y={shape.cy}
              fontSize="14"
              fill="#1f2937"
              textAnchor="middle"
              dominantBaseline="middle"
              className="pointer-events-none"
            >
              {estate.lotNumber}
            </text>
          )}
        </g>
      );
    }

    return null;
  };

  // Render ward view
  const renderWardView = (config: WardMapConfig) => {
    // Debug: Log road/estate counts
    console.log('Rendering ward view:', {
      totalRoads: config.roads.length,
      estatesConfigured: estates.length,
      matchingEstates: config.roads.filter(road => estates.some(e => e.shapeId === road.id)).length
    });
    
    return (
      <>
        {/* Grid */}
        {renderGrid()}

        {/* Ward Boundary */}
        {renderPath(config.boundary)}

        {/* Roads */}
        <g className="roads">
          {config.roads.map(road => renderPath(road))}
        </g>

        {/* Buildings/Estates */}
        <g className="buildings">
          {config.buildings.map(building => renderShape(building))}
        </g>

        {/* Labels */}
        <g className="labels">
          {config.labels.map(label => (
            <text
              key={label.id}
              x={label.x}
              y={label.y}
              fontSize={label.fontSize}
              fill={label.fill || '#000000'}
            >
              {label.content}
            </text>
          ))}
        </g>
      </>
    );
  };

  // Render city view
  const renderCityView = (config: CityMapConfig) => {
    return (
      <>
        {/* Grid */}
        {renderGrid()}

        {/* Wards */}
        <g className="wards">
          {config.wards.map(ward => 
            renderPath(
              ward.path, 
              true, 
              () => onWardClick?.(ward.id)
            )
          )}
        </g>

        {/* Labels from original SVG only */}
        <g className="labels">
          {config.labels.map(label => (
            <text
              key={label.id}
              x={label.x}
              y={label.y}
              fontSize={label.fontSize}
              fill={label.fill || '#000000'}
            >
              {label.content}
            </text>
          ))}
        </g>
      </>
    );
  };

  return (
    <div className="bg-white rounded-lg p-4 relative">
      {/* Zoom Controls */}
      {enableZoom && (
        <div className="absolute top-6 right-6 z-10 flex flex-col gap-2 bg-slate-800 rounded-lg p-2 shadow-lg">
          <button
            onClick={() => setZoom(Math.min(MAX_ZOOM, zoom + ZOOM_STEP))}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white transition-colors"
          >
            +
          </button>
          <div className="px-3 py-1 text-white text-sm text-center">
            {Math.round(zoom * 100)}%
          </div>
          <button
            onClick={() => setZoom(Math.max(MIN_ZOOM, zoom - ZOOM_STEP))}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white transition-colors"
          >
            −
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-white text-xs transition-colors"
          >
            Reset
          </button>
        </div>
      )}

      {/* SVG Map */}
      <div className="overflow-hidden rounded-lg">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${config.width} ${config.height}`}
          className="w-full h-auto"
          style={{
            maxHeight: '75vh',
            cursor: isPanning ? 'grabbing' : (enablePan ? 'grab' : 'default'),
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: 'center',
            transition: isPanning ? 'none' : 'transform 0.1s ease-out'
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Background */}
          <rect
            x="0"
            y="0"
            width={config.width}
            height={config.height}
            fill="#f1f5f9"
          />

          {/* Render based on map type */}
          {config.type === 'ward' ? renderWardView(config) : renderCityView(config)}
        </svg>
      </div>

      {/* Instructions */}
      {(enableZoom || enablePan) && (
        <div className="mt-2 text-xs text-slate-500 text-center">
          {enableZoom && 'Use +/- buttons to zoom • '}
          {enablePan && 'Click and drag to pan • '}
          Reset button returns to default view
        </div>
      )}
    </div>
  );
}
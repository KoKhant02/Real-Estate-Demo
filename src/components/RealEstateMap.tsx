import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface Block {
  id: string;
  status: 'available' | 'purchased';
  row: number;
  col: number;
  price?: number;
  name?: string;
  number?: number;
}

export interface RealEstateMapProps {
  rows: number;
  cols: number;
  initialBlocks?: Block[];
  blocks?: Block[]; // Controlled mode: parent manages blocks
  onPurchase?: (blockId: string, block: Block) => void;
  onBlockSelect?: (blockId: string | null, block: Block | null) => void;
  onBlocksChange?: (blocks: Block[]) => void; // Callback when internal state changes
  availableColor?: string;
  purchasedColor?: string;
  showPurchasePanel?: boolean;
  blockGap?: number;
  blockBorderRadius?: string;
  // New: Simple interval-based road configuration
  horizontalRoadInterval?: number; // Add horizontal road every N rows
  verticalRoadInterval?: number;   // Add vertical road every N columns
  // Legacy: Array-based road configuration (for backward compatibility)
  roads?: {
    horizontal?: number[]; // row indices where horizontal roads should be
    vertical?: number[];   // column indices where vertical roads should be
  };
  roadColor?: string;
  showBlockNumbers?: boolean;
}

type GridCell = 
  | { type: 'block'; block: Block }
  | { type: 'road'; direction: 'horizontal' | 'vertical' }
  | { type: 'intersection' };

export function RealEstateMap({
  rows,
  cols,
  initialBlocks,
  blocks: controlledBlocks,
  onPurchase,
  onBlockSelect,
  onBlocksChange,
  availableColor = 'bg-yellow-400 border-yellow-500',
  purchasedColor = 'bg-blue-500 border-blue-600',
  showPurchasePanel = true,
  blockGap = 1,
  blockBorderRadius = 'rounded',
  // New: Simple interval-based road configuration
  horizontalRoadInterval,
  verticalRoadInterval,
  // Legacy: Array-based road configuration (for backward compatibility)
  roads = { horizontal: [], vertical: [] },
  roadColor = 'bg-gray-600',
  showBlockNumbers = true
}: RealEstateMapProps) {
  // Check if component is controlled
  const isControlled = controlledBlocks !== undefined;

  // Calculate roads from intervals if provided, otherwise use roads prop
  const calculateRoadsFromIntervals = () => {
    const horizontalRoads: number[] = [];
    const verticalRoads: number[] = [];

    // If intervals are provided, calculate road positions
    if (horizontalRoadInterval && horizontalRoadInterval > 0) {
      for (let i = horizontalRoadInterval; i < rows; i += horizontalRoadInterval) {
        horizontalRoads.push(i);
      }
    } else if (roads.horizontal) {
      horizontalRoads.push(...roads.horizontal);
    }

    if (verticalRoadInterval && verticalRoadInterval > 0) {
      for (let i = verticalRoadInterval; i < cols; i += verticalRoadInterval) {
        verticalRoads.push(i);
      }
    } else if (roads.vertical) {
      verticalRoads.push(...roads.vertical);
    }

    return { horizontal: horizontalRoads, vertical: verticalRoads };
  };

  const computedRoads = calculateRoadsFromIntervals();

  // Initialize internal state
  const [internalBlocks, setInternalBlocks] = useState<Block[]>(() => {
    if (initialBlocks) return initialBlocks;
    
    const defaultBlocks: Block[] = [];
    let blockNumber = 1;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        defaultBlocks.push({
          id: `${row}-${col}`,
          status: 'available',
          row,
          col,
          number: blockNumber++
        });
      }
    }
    return defaultBlocks;
  });

  // Use controlled blocks if provided, otherwise use internal state
  const blocks = isControlled ? controlledBlocks : internalBlocks;
  
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  // Sync internal state with initialBlocks changes (for uncontrolled mode)
  useEffect(() => {
    if (!isControlled && initialBlocks) {
      setInternalBlocks(initialBlocks);
    }
  }, [initialBlocks, isControlled]);

  // Create grid with roads
  const createGridWithRoads = (): GridCell[][] => {
    const horizontalRoads = computedRoads.horizontal || [];
    const verticalRoads = computedRoads.vertical || [];
    
    const gridRows: GridCell[][] = [];
    
    for (let row = 0; row < rows; row++) {
      const gridRow: GridCell[] = [];
      
      for (let col = 0; col < cols; col++) {
        const block = blocks.find(b => b.row === row && b.col === col);
        if (block) {
          gridRow.push({ type: 'block', block });
        }
        
        // Add vertical road after this column if specified
        if (verticalRoads.includes(col + 1)) {
          gridRow.push({ type: 'road', direction: 'vertical' });
        }
      }
      
      gridRows.push(gridRow);
      
      // Add horizontal road after this row if specified
      if (horizontalRoads.includes(row + 1)) {
        const roadRow: GridCell[] = [];
        for (let col = 0; col < cols; col++) {
          roadRow.push({ type: 'road', direction: 'horizontal' });
          
          // Add intersection where roads cross
          if (verticalRoads.includes(col + 1)) {
            roadRow.push({ type: 'intersection' });
          }
        }
        gridRows.push(roadRow);
      }
    }
    
    return gridRows;
  };

  const grid = createGridWithRoads();
  const totalCols = cols + (computedRoads.vertical?.length || 0);

  const handleBlockClick = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (block?.status === 'available') {
      setSelectedBlock(blockId);
      onBlockSelect?.(blockId, block);
    }
  };

  const handlePurchase = () => {
    if (selectedBlock) {
      const block = blocks.find(b => b.id === selectedBlock);
      if (block) {
        if (isControlled) {
          // Controlled mode: notify parent
          onPurchase?.(selectedBlock, block);
        } else {
          // Uncontrolled mode: update internal state
          const updatedBlocks = internalBlocks.map(b => 
            b.id === selectedBlock 
              ? { ...b, status: 'purchased' as const }
              : b
          );
          setInternalBlocks(updatedBlocks);
          onBlocksChange?.(updatedBlocks);
          onPurchase?.(selectedBlock, block);
        }
        setSelectedBlock(null);
        onBlockSelect?.(null, null);
      }
    }
  };

  const handleCancel = () => {
    setSelectedBlock(null);
    onBlockSelect?.(null, null);
  };

  const selectedBlockData = blocks.find(b => b.id === selectedBlock);

  return (
    <div>
      {/* Map Grid with Roads as Gaps */}
      <div 
        className="grid"
        style={{ 
          gridTemplateColumns: `repeat(${totalCols}, minmax(0, 1fr))`,
          gap: `${blockGap * 0.25}rem`
        }}
      >
        {grid.map((row, rowIndex) => 
          row.map((cell, colIndex) => {
            if (cell.type === 'block') {
              const { block } = cell;
              return (
                <div
                  key={`${rowIndex}-${colIndex}-${block.id}`}
                  onClick={() => handleBlockClick(block.id)}
                  className={`
                    aspect-square border-2 cursor-pointer transition-all relative
                    ${blockBorderRadius}
                    ${block.status === 'available' 
                      ? `${availableColor} hover:scale-105` 
                      : purchasedColor
                    }
                    ${selectedBlock === block.id ? 'ring-4 ring-white scale-105 z-10' : ''}
                  `}
                >
                  {block.status === 'purchased' && (
                    <div className="w-full h-full flex items-center justify-center">
                      <Check className="text-white" size={20} />
                    </div>
                  )}
                  {showBlockNumbers && block.status === 'available' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-800 font-semibold text-sm">
                        {block.number || block.name || block.id}
                      </span>
                    </div>
                  )}
                </div>
              );
            } else if (cell.type === 'road') {
              return (
                <div
                  key={`${rowIndex}-${colIndex}-road`}
                  className={`${roadColor} ${cell.direction === 'horizontal' ? 'h-3' : 'aspect-square'}`}
                />
              );
            } else {
              // Intersection
              return (
                <div
                  key={`${rowIndex}-${colIndex}-intersection`}
                  className={`${roadColor} h-3`}
                />
              );
            }
          })
        )}
      </div>

      {/* Purchase Panel */}
      {showPurchasePanel && selectedBlock && selectedBlockData && (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
          <h2 className="text-xl mb-2">
            Selected Block: {selectedBlockData.number || selectedBlockData.name || selectedBlock}
          </h2>
          {selectedBlockData.price && (
            <p className="text-gray-600 mb-4">Price: ${selectedBlockData.price.toLocaleString()}</p>
          )}
          <div className="flex gap-3">
            <button
              onClick={handlePurchase}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Purchase Block
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
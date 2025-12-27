import { DollarSign, Home, MapPin } from 'lucide-react';
import React from 'react';
import type { Block } from './components/RealEstateMap';
import { RealEstateMap } from './components/RealEstateMap';
import * as ENV from './env';

export default function App() {
  const getInitialBlocks = (): Block[] => {
    const customBlocks: Block[] = [];
    let blockNumber = 1;
    
    for (let row = 0; row < ENV.GRID_ROWS; row++) {
      for (let col = 0; col < ENV.GRID_COLS; col++) {
        customBlocks.push({
          id: `Block-${row * ENV.GRID_COLS + col + 1}`,
          status: Math.random() > (1 - ENV.INITIAL_SOLD_PROBABILITY) ? 'purchased' : 'available',
          row,
          col,
          price: ENV.MIN_BLOCK_PRICE + Math.floor(Math.random() * (ENV.MAX_BLOCK_PRICE - ENV.MIN_BLOCK_PRICE)),
          name: `Lot ${blockNumber}`,
          number: blockNumber++
        });
      }
    }
    return customBlocks;
  };

  const [blocks, setBlocks] = React.useState<Block[]>(getInitialBlocks());
  const [selectedBlockInfo, setSelectedBlockInfo] = React.useState<Block | null>(null);

  const handlePurchase = (blockId: string, block: Block) => {
    setBlocks(prevBlocks => 
      prevBlocks.map(b => 
        b.id === blockId ? { ...b, status: 'purchased' } : b
      )
    );
  };

  const handleBlockSelect = (blockId: string | null, block: Block | null) => {
    setSelectedBlockInfo(block);
  };

  const availableCount = blocks.filter(b => b.status === 'available').length;
  const purchasedCount = blocks.filter(b => b.status === 'purchased').length;
  const totalBlocks = blocks.length;
  
  const averagePrice = blocks
    .filter(b => b.status === 'available' && b.price)
    .reduce((sum, b) => sum + (b.price || 0), 0) / availableCount || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Home className="w-8 h-8 text-yellow-400" />
              <div>
                <h1 className="text-3xl">{ENV.PROJECT_NAME}</h1>
                <p className="text-slate-400 text-sm">{ENV.PROJECT_TAGLINE}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-green-600 px-6 py-3 rounded-lg">
              <MapPin className="w-5 h-5" />
              <span>{ENV.PROJECT_LOCATION}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Statistics Dashboard */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6" />
              </div>
              <span className="text-yellow-100">Available Lots</span>
            </div>
            <p className="text-4xl">{availableCount}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6" />
              </div>
              <span className="text-blue-100">Sold Lots</span>
            </div>
            <p className="text-4xl">{purchasedCount}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="text-purple-100">Average Price</span>
            </div>
            <p className="text-3xl">${(averagePrice / 1000).toFixed(0)}K</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-green-100">Total Lots</span>
            </div>
            <p className="text-4xl">{totalBlocks}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl">Development Master Plan</h2>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                    <span className="text-slate-300">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-slate-300">Sold</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-slate-600 rounded"></div>
                    <span className="text-slate-300">Road</span>
                  </div>
                </div>
              </div>

              <RealEstateMap
                rows={ENV.GRID_ROWS}
                cols={ENV.GRID_COLS}
                blocks={blocks}
                onPurchase={handlePurchase}
                onBlockSelect={handleBlockSelect}
                availableColor={ENV.AVAILABLE_BLOCK_COLOR}
                purchasedColor={ENV.PURCHASED_BLOCK_COLOR}
                showPurchasePanel={ENV.SHOW_PURCHASE_PANEL}
                blockGap={ENV.BLOCK_GAP}
                blockBorderRadius={ENV.BLOCK_BORDER_RADIUS}
                horizontalRoadInterval={ENV.HORIZONTAL_BLOCKS_BEFORE_ROAD}
                verticalRoadInterval={ENV.VERTICAL_BLOCKS_BEFORE_ROAD}
                roadColor={ENV.ROAD_COLOR}
                showBlockNumbers={ENV.SHOW_BLOCK_NUMBERS}
              />
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-4">
            {/* Selected Lot Info */}
            {selectedBlockInfo ? (
              <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 space-y-4">
                <h3 className="text-xl border-b border-slate-600 pb-3">Selected Property</h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-slate-400 text-sm">Lot Number</p>
                    <p className="text-2xl">{selectedBlockInfo.number}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                      selectedBlockInfo.status === 'available' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {selectedBlockInfo.status === 'available' ? 'Available' : 'Sold'}
                    </span>
                  </div>

                  {selectedBlockInfo.price && (
                    <div>
                      <p className="text-slate-400 text-sm">Price</p>
                      <p className="text-3xl text-yellow-400">${selectedBlockInfo.price.toLocaleString()}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-slate-400 text-sm">Location</p>
                    <p>Row {selectedBlockInfo.row + 1}, Col {selectedBlockInfo.col + 1}</p>
                  </div>

                  <div className="pt-2 space-y-2 text-sm text-slate-300">
                    <p>✓ Water & Electricity Ready</p>
                    <p>✓ Paved Road Access</p>
                    <p>✓ 30-Year Title Deed</p>
                    <p>✓ Building Permit Available</p>
                  </div>
                </div>

                {selectedBlockInfo.status === 'available' && (
                  <button
                    onClick={() => handlePurchase(selectedBlockInfo.id, selectedBlockInfo)}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-lg transition-all font-semibold text-lg shadow-lg"
                  >
                    Purchase Lot
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl border-b border-slate-600 pb-3 mb-4">Property Details</h3>
                <p className="text-slate-400 text-center py-8">
                  Click on any available lot to view details
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-800/50 backdrop-blur-sm border-t border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-8 py-6 text-center text-slate-400 text-sm">
          <p>© {ENV.PROJECT_YEAR} {ENV.PROJECT_NAME}. All rights reserved.</p>
          <p className="mt-2">Contact: {ENV.CONTACT_EMAIL} | {ENV.CONTACT_PHONE}</p>
        </div>
      </footer>
    </div>
  );
}
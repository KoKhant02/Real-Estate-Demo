import { useEffect, useState } from 'react';
import { SVGImporter } from './components/SVGImporter';
import { UniversalMap } from './components/UniversalMap';
import * as ENV from './env';
import type { CityMapConfig, svgToMapConfig, WardMapConfig } from './utils/svgParser';

export default function App() {
  const [mapConfig, setMapConfig] = useState<WardMapConfig | CityMapConfig | null>(null);
  const [selectedEstateId, setSelectedEstateId] = useState<string | null>(null);
  const [purchasedEstates, setPurchasedEstates] = useState<Set<string>>(new Set());

  // Load default SVG on mount if available
  useEffect(() => {
    if (ENV.DEFAULT_WARD_SVG && !mapConfig) {
      try {
        const config = svgToMapConfig(ENV.DEFAULT_WARD_SVG);
        setMapConfig(config);
      } catch (err) {
        console.error('Failed to load default SVG:', err);
      }
    }
  }, []);

  const handleSVGImport = (config: WardMapConfig | CityMapConfig) => {
    setMapConfig(config);
    setSelectedEstateId(null);
  };

  const handleEstateClick = (shapeId: string) => {
    console.log('Estate clicked:', shapeId);
    setSelectedEstateId(shapeId);
  };

  const handleWardClick = (wardId: string) => {
    console.log('Ward clicked:', wardId);
    // TODO: Load ward detail view when city view is implemented
    alert(`Clicked ward: ${wardId}\n\nIn the future, this will zoom into the ward detail view!`);
  };

  const handlePurchase = () => {
    if (selectedEstateId) {
      setPurchasedEstates(prev => new Set([...prev, selectedEstateId]));
      setSelectedEstateId(null);
    }
  };

  const selectedEstate = ENV.ESTATES.find(e => e.shapeId === selectedEstateId);
  const availableEstates = ENV.ESTATES.filter(e => 
    e.status === 'available' && !purchasedEstates.has(e.shapeId)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl">{ENV.PROJECT_NAME}</h1>
              <p className="text-slate-400 text-sm mt-1">
                {mapConfig?.type === 'city' ? 'City View' : 'Ward View'} - Universal SVG Map System
              </p>
            </div>
            <div className="bg-green-600 px-6 py-3 rounded-lg">
              <span>{ENV.PROJECT_LOCATION}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* SVG Importer */}
        <SVGImporter 
          onImport={handleSVGImport}
          defaultSVG={ENV.DEFAULT_WARD_SVG}
        />

        {/* Map Display */}
        {mapConfig ? (
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl">
                  {mapConfig.type === 'city' ? '🏙️ City Map' : '🏘️ Ward Map'}
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  {mapConfig.width} × {mapConfig.height} units • 
                  {mapConfig.type === 'city' 
                    ? ` ${(mapConfig as CityMapConfig).wards.length} wards`
                    : ` ${ENV.ESTATES.length} estates configured`
                  }
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-400"></div>
                  <span className="text-slate-300">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-500"></div>
                  <span className="text-slate-300">Purchased</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500"></div>
                  <span className="text-slate-300">Selected</span>
                </div>
              </div>
            </div>

            {/* Universal Map Component */}
            <UniversalMap
              config={mapConfig}
              estates={ENV.ESTATES}
              purchasedEstateIds={purchasedEstates}
              selectedEstateId={selectedEstateId}
              onEstateClick={handleEstateClick}
              onWardClick={handleWardClick}
              enableZoom={ENV.ENABLE_ZOOM}
              enablePan={ENV.ENABLE_PAN}
              showGrid={ENV.SHOW_COORDINATE_GRID}
            />

            {/* Map Info */}
            <div className="mt-4 text-sm text-slate-400">
              {mapConfig.type === 'ward' ? (
                <>
                  <p>
                    <strong>Ward Boundary:</strong> Auto-extracted from SVG • 
                    <strong className="ml-2">Roads/Paths:</strong> {(mapConfig as WardMapConfig).roads.length} detected • 
                    <strong className="ml-2">Buildings:</strong> {(mapConfig as WardMapConfig).buildings.length} shapes •
                    <strong className="ml-2 text-yellow-400">Estates:</strong> {ENV.ESTATES.length} configured
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>City View:</strong> {(mapConfig as CityMapConfig).wards.length} wards • 
                    Click any ward to zoom into ward detail view
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-sm p-12 rounded-xl border border-slate-700 text-center">
            <p className="text-slate-400 text-lg">
              👆 Paste your SVG code above to generate the map
            </p>
          </div>
        )}

        {/* Estate Selection Panel */}
        {selectedEstate && (
          <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm p-6 rounded-xl border border-green-500/30">
            <h3 className="text-xl mb-4">Selected Estate</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p><strong>Lot Number:</strong> {selectedEstate.lotNumber}</p>
                <p><strong>Area:</strong> {selectedEstate.area} sq m</p>
                <p><strong>Price:</strong> ${selectedEstate.price.toLocaleString()}</p>
                {selectedEstate.streetFacing && (
                  <p><strong>Street Facing:</strong> {selectedEstate.streetFacing}</p>
                )}
              </div>
              <div className="flex items-center justify-end">
                <button
                  onClick={handlePurchase}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg transition-colors"
                >
                  Purchase Estate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
            <div className="text-3xl text-blue-400">{ENV.ESTATES.length}</div>
            <div className="text-sm text-slate-400 mt-1">Total Estates</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
            <div className="text-3xl text-yellow-400">{availableEstates.length}</div>
            <div className="text-sm text-slate-400 mt-1">Available</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
            <div className="text-3xl text-green-400">{purchasedEstates.size}</div>
            <div className="text-sm text-slate-400 mt-1">Purchased</div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
          <h3 className="text-xl mb-4">🎉 Universal SVG Map System Active!</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm uppercase tracking-wider text-slate-400 mb-3">✨ Features</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>✓ <strong>Auto-parse SVG</strong> - Paste code, instant map</li>
                <li>✓ <strong>Auto-detect</strong> - City or ward view</li>
                <li>✓ <strong>X/Y coordinates</strong> - True coordinate system</li>
                <li>✓ <strong>Universal</strong> - Works for any SVG</li>
                <li>✓ <strong>Multi-level</strong> - City → Ward → Estate</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm uppercase tracking-wider text-slate-400 mb-3">📝 How to Edit</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>1. Open <code className="bg-slate-700 px-2 py-1 rounded text-blue-400">/env.ts</code></li>
                <li>2. Paste your SVG in <code className="bg-slate-700 px-2 py-1 rounded text-green-400">DEFAULT_WARD_SVG</code></li>
                <li>3. Add <code className="bg-slate-700 px-2 py-1 rounded text-yellow-400">data-id</code> attributes to estate paths</li>
                <li>4. Configure estates in <code className="bg-slate-700 px-2 py-1 rounded text-purple-400">ESTATES</code> array</li>
                <li>5. Done! Map updates automatically ✨</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-sm text-blue-200">
              <strong>💡 Pro Tip:</strong> In your SVG, use <code className="bg-slate-700 px-2 py-1 rounded mx-1">data-id="estate-01"</code> 
              to identify purchasable estates. The first path is always the ward boundary!
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm p-6 rounded-xl border border-purple-500/30">
          <h3 className="text-xl mb-3">📋 Next Steps</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
            <div>
              <p className="mb-2"><strong>For Current Ward View:</strong></p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Add estate configurations in env.ts</li>
                <li>Match shapeId to SVG shape IDs</li>
                <li>Set prices, lot numbers, status</li>
              </ul>
            </div>
            <div>
              <p className="mb-2"><strong>For Future City View:</strong></p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Create city SVG with multiple ward paths</li>
                <li>Paste in SVG Importer</li>
                <li>System auto-detects as city view!</li>
                <li>Click ward → Loads ward detail SVG</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
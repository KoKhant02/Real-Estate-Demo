import { CheckCircle, FileText, Upload, XCircle } from 'lucide-react';
import { useState } from 'react';
import type { CityMapConfig, WardMapConfig } from '../utils/svgParser';
import { svgToMapConfig } from '../utils/svgParser';

interface SVGImporterProps {
  onImport: (config: WardMapConfig | CityMapConfig) => void;
  defaultSVG?: string;
}

export function SVGImporter({ onImport, defaultSVG }: SVGImporterProps) {
  const [svgCode, setSvgCode] = useState(defaultSVG || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!defaultSVG);

  const handleImport = () => {
    setError(null);
    setSuccess(false);

    try {
      // Parse and convert SVG
      const config = svgToMapConfig(svgCode);
      
      // Success!
      setSuccess(true);
      onImport(config);
      
      // Auto-collapse after successful import
      setTimeout(() => {
        setIsExpanded(false);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse SVG');
    }
  };

  const handleClear = () => {
    setSvgCode('');
    setError(null);
    setSuccess(false);
  };

  const exampleSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="972" height="800" viewBox="0 0 972 800" fill="none">
<path d="M776.5 17.7584C620.167 17.7584 247.9 16.1584 9.5 9.75842V544.758L37.5 669.758L141.5 655.758L587.5 787.758L715.5 453.758L958.5 175.758L776.5 17.7584Z" stroke="black" stroke-width="19"/>
</svg>`;

  const loadExample = () => {
    setSvgCode(exampleSVG);
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
      {/* Header */}
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl">SVG Importer</h3>
            <p className="text-sm text-slate-400">
              Paste SVG code to auto-generate map {success && '✓'}
            </p>
          </div>
        </div>
        
        <button 
          className="text-slate-400 hover:text-white transition-colors"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="mt-6 space-y-4">
          {/* Instructions */}
          <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-300">
                <p className="mb-2">
                  <strong className="text-white">How to use:</strong>
                </p>
                <ol className="space-y-1 list-decimal list-inside">
                  <li>Copy your SVG code from design tools (Figma, Illustrator, etc.)</li>
                  <li>Paste it in the text area below</li>
                  <li>Click "Generate Map" to auto-convert</li>
                  <li>The system will auto-detect ward or city view!</li>
                </ol>
              </div>
            </div>
          </div>

          {/* SVG Code Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-slate-300">
                SVG Code
              </label>
              <button
                onClick={loadExample}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Load Example SVG
              </button>
            </div>
            <textarea
              value={svgCode}
              onChange={(e) => {
                setSvgCode(e.target.value);
                setError(null);
                setSuccess(false);
              }}
              placeholder='<svg xmlns="http://www.w3.org/2000/svg" width="972" height="800">
  <path d="M776.5 17.7584..." stroke="black"/>
</svg>'
              className="w-full h-48 bg-slate-900 text-slate-200 rounded-lg p-4 text-sm font-mono border border-slate-600 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400">Error parsing SVG</p>
                <p className="text-sm text-red-300 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-400">SVG successfully parsed!</p>
                <p className="text-sm text-green-300 mt-1">
                  Map generated and ready to use.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleImport}
              disabled={!svgCode.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Generate Map
            </button>
            <button
              onClick={handleClear}
              className="bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Info */}
          <div className="text-xs text-slate-400 space-y-1">
            <p>✓ Supports: paths, rectangles, polygons, circles, ellipses</p>
            <p>✓ Auto-extracts: dimensions, boundaries, roads, buildings</p>
            <p>✓ Auto-detects: city view (multiple wards) or ward view (single ward)</p>
          </div>
        </div>
      )}
    </div>
  );
}

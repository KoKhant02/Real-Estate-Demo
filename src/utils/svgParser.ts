// ============================================
// UNIVERSAL SVG PARSER
// ============================================
// Parses SVG code and extracts map data for both city and ward views

export interface ParsedPath {
  id: string;
  d: string;  // SVG path data
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export interface ParsedShape {
  id: string;
  type: 'rect' | 'polygon' | 'circle' | 'ellipse';
  // For rectangles
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  // For polygons
  points?: string;
  polygon?: Array<{ x: number; y: number }>;
  // For circles/ellipses
  cx?: number;
  cy?: number;
  r?: number;
  rx?: number;
  ry?: number;
  // Styling
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export interface ParsedText {
  id: string;
  x: number;
  y: number;
  content: string;
  fontSize?: number;
  fill?: string;
}

export interface ParsedSVGData {
  width: number;
  height: number;
  viewBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  paths: ParsedPath[];
  shapes: ParsedShape[];
  texts: ParsedText[];
}

export interface WardMapConfig {
  type: 'ward';
  width: number;
  height: number;
  boundary: ParsedPath;
  roads: ParsedPath[];
  buildings: ParsedShape[];
  labels: ParsedText[];
}

export interface CityMapConfig {
  type: 'city';
  width: number;
  height: number;
  wards: Array<{
    id: string;
    path: ParsedPath;
    name?: string;
  }>;
  roads: ParsedPath[];
  labels: ParsedText[];
}

/**
 * Parse SVG string and extract all elements
 */
export function parseSVG(svgString: string): ParsedSVGData {
  // Create a temporary DOM element to parse the SVG
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const svgElement = doc.querySelector('svg');

  if (!svgElement) {
    throw new Error('Invalid SVG: No <svg> element found');
  }

  // Extract dimensions
  const width = parseFloat(svgElement.getAttribute('width') || '800');
  const height = parseFloat(svgElement.getAttribute('height') || '600');
  
  // Extract viewBox
  const viewBoxAttr = svgElement.getAttribute('viewBox');
  let viewBox = { x: 0, y: 0, width, height };
  if (viewBoxAttr) {
    const [x, y, w, h] = viewBoxAttr.split(/\s+/).map(parseFloat);
    viewBox = { x, y, width: w, height: h };
  }

  // Extract all paths
  const paths: ParsedPath[] = [];
  const pathElements = svgElement.querySelectorAll('path');
  pathElements.forEach((path, index) => {
    const d = path.getAttribute('d');
    if (d) {
      paths.push({
        id: path.getAttribute('data-id') || path.getAttribute('id') || `path-${index}`,
        d,
        fill: path.getAttribute('fill') || undefined,
        stroke: path.getAttribute('stroke') || undefined,
        strokeWidth: parseFloat(path.getAttribute('stroke-width') || '1')
      });
    }
  });

  // Extract all shapes (rect, polygon, circle, ellipse)
  const shapes: ParsedShape[] = [];
  
  // Rectangles
  const rectElements = svgElement.querySelectorAll('rect');
  rectElements.forEach((rect, index) => {
    shapes.push({
      id: rect.getAttribute('id') || `rect-${index}`,
      type: 'rect',
      x: parseFloat(rect.getAttribute('x') || '0'),
      y: parseFloat(rect.getAttribute('y') || '0'),
      width: parseFloat(rect.getAttribute('width') || '0'),
      height: parseFloat(rect.getAttribute('height') || '0'),
      fill: rect.getAttribute('fill') || undefined,
      stroke: rect.getAttribute('stroke') || undefined,
      strokeWidth: parseFloat(rect.getAttribute('stroke-width') || '1')
    });
  });

  // Polygons
  const polygonElements = svgElement.querySelectorAll('polygon');
  polygonElements.forEach((polygon, index) => {
    const pointsStr = polygon.getAttribute('points') || '';
    const pointsArray = parsePolygonPoints(pointsStr);
    
    shapes.push({
      id: polygon.getAttribute('id') || `polygon-${index}`,
      type: 'polygon',
      points: pointsStr,
      polygon: pointsArray,
      fill: polygon.getAttribute('fill') || undefined,
      stroke: polygon.getAttribute('stroke') || undefined,
      strokeWidth: parseFloat(polygon.getAttribute('stroke-width') || '1')
    });
  });

  // Circles
  const circleElements = svgElement.querySelectorAll('circle');
  circleElements.forEach((circle, index) => {
    shapes.push({
      id: circle.getAttribute('id') || `circle-${index}`,
      type: 'circle',
      cx: parseFloat(circle.getAttribute('cx') || '0'),
      cy: parseFloat(circle.getAttribute('cy') || '0'),
      r: parseFloat(circle.getAttribute('r') || '0'),
      fill: circle.getAttribute('fill') || undefined,
      stroke: circle.getAttribute('stroke') || undefined,
      strokeWidth: parseFloat(circle.getAttribute('stroke-width') || '1')
    });
  });

  // Ellipses
  const ellipseElements = svgElement.querySelectorAll('ellipse');
  ellipseElements.forEach((ellipse, index) => {
    shapes.push({
      id: ellipse.getAttribute('id') || `ellipse-${index}`,
      type: 'ellipse',
      cx: parseFloat(ellipse.getAttribute('cx') || '0'),
      cy: parseFloat(ellipse.getAttribute('cy') || '0'),
      rx: parseFloat(ellipse.getAttribute('rx') || '0'),
      ry: parseFloat(ellipse.getAttribute('ry') || '0'),
      fill: ellipse.getAttribute('fill') || undefined,
      stroke: ellipse.getAttribute('stroke') || undefined,
      strokeWidth: parseFloat(ellipse.getAttribute('stroke-width') || '1')
    });
  });

  // Extract all text elements
  const texts: ParsedText[] = [];
  const textElements = svgElement.querySelectorAll('text');
  textElements.forEach((text, index) => {
    texts.push({
      id: text.getAttribute('id') || `text-${index}`,
      x: parseFloat(text.getAttribute('x') || '0'),
      y: parseFloat(text.getAttribute('y') || '0'),
      content: text.textContent || '',
      fontSize: parseFloat(text.getAttribute('font-size') || '12'),
      fill: text.getAttribute('fill') || undefined
    });
  });

  return {
    width,
    height,
    viewBox,
    paths,
    shapes,
    texts
  };
}

/**
 * Convert parsed SVG data to Ward Map configuration
 */
export function toWardMapConfig(parsedData: ParsedSVGData): WardMapConfig {
  // First path is assumed to be the ward boundary
  const boundary = parsedData.paths[0];
  
  if (!boundary) {
    throw new Error('No boundary path found in SVG');
  }

  // Remaining paths could be roads OR estates - we'll treat them all as "roads" for now
  // The UniversalMap component will check if they're estates via ESTATES config
  const roads = parsedData.paths.slice(1);

  return {
    type: 'ward',
    width: parsedData.viewBox.width,
    height: parsedData.viewBox.height,
    boundary,
    roads, // These roads may actually be estate paths - let the component decide
    buildings: parsedData.shapes,
    labels: parsedData.texts
  };
}

/**
 * Convert parsed SVG data to City Map configuration
 */
export function toCityMapConfig(parsedData: ParsedSVGData): CityMapConfig {
  // All paths are assumed to be ward boundaries
  const wards = parsedData.paths.map((path, index) => ({
    id: path.id || `ward-${index + 1}`,
    path,
    name: `Ward ${index + 1}`
  }));

  return {
    type: 'city',
    width: parsedData.viewBox.width,
    height: parsedData.viewBox.height,
    wards,
    roads: [], // City view typically doesn't show detailed roads
    labels: parsedData.texts
  };
}

/**
 * Smart auto-detect: is this a city or ward view?
 */
export function autoDetectMapType(parsedData: ParsedSVGData): 'city' | 'ward' {
  // Heuristic: If there are multiple large paths, it's probably a city view
  // If there's one main path and smaller elements, it's probably a ward view
  
  const largePaths = parsedData.paths.filter(p => {
    // Consider a path "large" if it's complex (many commands)
    return p.d.length > 100;
  });

  if (largePaths.length >= 3) {
    return 'city'; // Multiple large boundaries = city with multiple wards
  } else {
    return 'ward'; // One main boundary = single ward
  }
}

/**
 * Parse polygon points string to array of {x, y} objects
 */
function parsePolygonPoints(pointsStr: string): Array<{ x: number; y: number }> {
  if (!pointsStr.trim()) return [];
  
  const points = pointsStr.trim().split(/\s+/);
  const result: Array<{ x: number; y: number }> = [];
  
  for (let i = 0; i < points.length; i++) {
    const coords = points[i].split(',');
    if (coords.length === 2) {
      result.push({
        x: parseFloat(coords[0]),
        y: parseFloat(coords[1])
      });
    }
  }
  
  return result;
}

/**
 * Helper: Convert any SVG to map config (auto-detects type)
 */
export function svgToMapConfig(svgString: string): WardMapConfig | CityMapConfig {
  const parsed = parseSVG(svgString);
  const type = autoDetectMapType(parsed);
  
  if (type === 'city') {
    return toCityMapConfig(parsed);
  } else {
    return toWardMapConfig(parsed);
  }
}
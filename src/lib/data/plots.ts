// Plot data for the public /map page.
// Each plot has a center (used to recenter the map) and an optional
// polygon outlining the actual land boundary. When `polygon` is
// undefined, only a marker is shown.
//
// To "upload" a real plot:
//   1. Walk the corners of the plot and record GPS for each corner.
//   2. Add a new entry below with the lat/lng pairs.
//   3. Set status to "owned" or "active" once acquired.
//
// Coordinates are decimal degrees. East/North positive.

export type PlotStatus = "concept" | "negotiating" | "owned" | "active";

export type LatLng = { lat: number; lng: number };

export type Plot = {
  id: string;
  /** Short label shown on the map and in legends. */
  name: string;
  /** Lifecycle status. Drives colour intensity on the map. */
  status: PlotStatus;
  /** Center point for the map view and the marker. */
  center: LatLng;
  /** Optional polygon corners (clockwise or counter-clockwise). */
  polygon?: LatLng[];
  /** Per-plot zoom override. Default map zoom is 9. */
  zoom?: number;
  /** Short description shown in the legend / info window. */
  description?: string;
  /** ISO date this plot was first added. */
  addedOn?: string;
};

export type ReferencePoint = {
  name: string;
  lat: number;
  lng: number;
  kind: "city" | "polygon" | "forest";
};

/**
 * REFERENCE POINTS — landmarks for context, not Túbir plots.
 * Coordinates are approximate centers, not surveyed values.
 */
export const REFERENCE_POINTS: ReferencePoint[] = [
  { name: "Усть-Каменогорск", lat: 49.948, lng: 82.628, kind: "city" },
  { name: "Семипалатинский полигон", lat: 50.07, lng: 78.3, kind: "polygon" },
  { name: "Семей орманы", lat: 50.41, lng: 80.27, kind: "forest" },
];

/**
 * PLOTS — actual or planned Túbir plots.
 *
 * The seed plot below is a concept centered just south of
 * Усть-Каменогорск. Replace center and polygon with real survey
 * coordinates once a participок is acquired.
 */
export const PLOTS: Plot[] = [
  {
    id: "ukk-01",
    name: "Plot 01 · ВКО",
    status: "concept",
    center: { lat: 49.85, lng: 82.55 },
    zoom: 10,
    description: "Концепт. Точные границы — после покупки.",
    addedOn: "2026-05-18",
    polygon: [
      { lat: 49.872, lng: 82.512 },
      { lat: 49.872, lng: 82.588 },
      { lat: 49.828, lng: 82.588 },
      { lat: 49.828, lng: 82.512 },
    ],
  },
];

/** Default map center — fits both Усть-Каменогорск and the polygon area. */
export const DEFAULT_MAP_CENTER: LatLng = { lat: 49.95, lng: 80.7 };
export const DEFAULT_MAP_ZOOM = 7;

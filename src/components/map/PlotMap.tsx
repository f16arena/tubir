"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, { type StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  PLOTS,
  REFERENCE_POINTS,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  type Plot,
} from "@/lib/data/plots";

type Props = {
  /** Optional plot id to focus initially. Defaults to first plot. */
  focusPlotId?: string;
};

const PRIMARY = "#3f8048";
const PRIMARY_DEEP = "#2c5a33";

// CARTO Positron — light, desaturated raster tiles. Free for low-traffic
// embeds; attribution required (rendered by MapLibre automatically).
const POSITRON_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    carto: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
    },
  },
  layers: [
    {
      id: "carto-base",
      type: "raster",
      source: "carto",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

function statusOpacity(status: Plot["status"]): number {
  switch (status) {
    case "active":
      return 0.45;
    case "owned":
      return 0.32;
    case "negotiating":
      return 0.24;
    case "concept":
    default:
      return 0.2;
  }
}

function buildMarkerEl(opts: {
  color: string;
  label: string;
  size: number;
  bold?: boolean;
}) {
  const root = document.createElement("div");
  root.className = "plot-marker";
  root.style.display = "flex";
  root.style.alignItems = "center";
  root.style.gap = "6px";
  root.style.transform = "translate(8px, -50%)"; // anchor at left

  const dot = document.createElement("span");
  dot.style.display = "inline-block";
  dot.style.width = `${opts.size}px`;
  dot.style.height = `${opts.size}px`;
  dot.style.borderRadius = "9999px";
  dot.style.background = opts.color;
  dot.style.boxShadow = "0 0 0 2px #fff, 0 1px 2px rgba(0,0,0,0.25)";

  const label = document.createElement("span");
  label.textContent = opts.label;
  label.style.fontFamily = "var(--font-mono), monospace";
  label.style.fontSize = "11px";
  label.style.letterSpacing = "0.1em";
  label.style.color = "#2c2c25";
  label.style.background = "rgba(252, 250, 244, 0.92)";
  label.style.padding = "2px 6px";
  label.style.borderRadius = "2px";
  label.style.whiteSpace = "nowrap";
  if (opts.bold) {
    label.style.fontWeight = "600";
    label.style.color = PRIMARY_DEEP;
  }

  root.appendChild(dot);
  root.appendChild(label);
  return root;
}

export function PlotMap({ focusPlotId }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!containerRef.current) return;

    const focus = PLOTS.find((p) => p.id === focusPlotId) ?? PLOTS[0];
    const center: [number, number] = focus
      ? [focus.center.lng, focus.center.lat]
      : [DEFAULT_MAP_CENTER.lng, DEFAULT_MAP_CENTER.lat];
    const zoom = focus?.zoom ?? DEFAULT_MAP_ZOOM;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: POSITRON_STYLE,
      center,
      zoom,
      attributionControl: { compact: true },
      cooperativeGestures: true,
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    map.on("load", () => {
      // Túbir plot polygons
      for (const plot of PLOTS) {
        if (plot.polygon && plot.polygon.length >= 3) {
          const ring = [...plot.polygon.map((p) => [p.lng, p.lat] as [number, number])];
          // GeoJSON polygons must be closed (first == last)
          if (
            ring[0][0] !== ring[ring.length - 1][0] ||
            ring[0][1] !== ring[ring.length - 1][1]
          ) {
            ring.push(ring[0]);
          }
          const srcId = `plot-${plot.id}`;
          map.addSource(srcId, {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: { type: "Polygon", coordinates: [ring] },
            },
          });
          map.addLayer({
            id: `${srcId}-fill`,
            type: "fill",
            source: srcId,
            paint: {
              "fill-color": PRIMARY,
              "fill-opacity": statusOpacity(plot.status),
            },
          });
          map.addLayer({
            id: `${srcId}-line`,
            type: "line",
            source: srcId,
            paint: {
              "line-color": PRIMARY_DEEP,
              "line-width": 2,
              "line-opacity": 0.9,
            },
          });
        }

        // Plot marker
        new maplibregl.Marker({
          element: buildMarkerEl({
            color: PRIMARY_DEEP,
            label: plot.name,
            size: 14,
            bold: true,
          }),
          anchor: "left",
        })
          .setLngLat([plot.center.lng, plot.center.lat])
          .addTo(map);
      }

      // Reference points
      for (const ref of REFERENCE_POINTS) {
        const color =
          ref.kind === "polygon"
            ? "#a44a3a"
            : ref.kind === "forest"
              ? "#7a9460"
              : "#3a3a32";
        new maplibregl.Marker({
          element: buildMarkerEl({
            color,
            label: ref.name,
            size: ref.kind === "city" ? 10 : 8,
          }),
          anchor: "left",
        })
          .setLngLat([ref.lng, ref.lat])
          .addTo(map);
      }

      setState("ready");
    });

    map.on("error", () => {
      // Tile errors etc — mark as error overlay, but keep map visible.
      setState((s) => (s === "loading" ? "error" : s));
    });

    return () => {
      mapRef.current = null;
      map.remove();
    };
  }, [focusPlotId]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="aspect-[16/9] w-full overflow-hidden rounded-sm border border-border bg-muted/30"
        aria-label="Túbir plot map"
      />
      {state === "loading" ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-sm border border-border bg-background/85 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm">
            <span className="text-serif-italic">Загружаем карту…</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

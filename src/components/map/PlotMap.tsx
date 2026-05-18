"use client";

import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import {
  PLOTS,
  REFERENCE_POINTS,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  type Plot,
} from "@/lib/data/plots";

type Props = {
  apiKey: string;
  /** Optional plot id to focus initially. Defaults to first plot. */
  focusPlotId?: string;
};

// Editorial map style — desaturated, paper-ish, green water.
const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#f4f1e8" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#5a5a4d" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f4f1e8" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
  { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
  { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#cdc7b3" }] },
  { featureType: "administrative.province", elementType: "geometry.stroke", stylers: [{ color: "#d6d0b8" }] },
  { featureType: "landscape.man_made", elementType: "geometry", stylers: [{ color: "#ece8da" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#e9e4d2" }] },
  { featureType: "landscape.natural.terrain", elementType: "geometry", stylers: [{ color: "#e1dbc4" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#dcd6c0" }] },
  { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#c8c19f" }] },
  { featureType: "road.highway", elementType: "labels", stylers: [{ visibility: "on" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#b9c8a8" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#5a7050" }] },
];

const PRIMARY = "#3f8048"; // brand green (oklch ≈ 0.42 0.13 148)
const PRIMARY_DEEP = "#2c5a33";

function statusFill(status: Plot["status"]): { fill: string; opacity: number } {
  switch (status) {
    case "active":
      return { fill: PRIMARY, opacity: 0.42 };
    case "owned":
      return { fill: PRIMARY, opacity: 0.3 };
    case "negotiating":
      return { fill: PRIMARY, opacity: 0.22 };
    case "concept":
    default:
      return { fill: PRIMARY, opacity: 0.18 };
  }
}

function makePin(
  symbolPath: typeof google.maps.SymbolPath,
  color: string,
  size = 12,
): google.maps.Symbol {
  return {
    path: symbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: "#fff",
    strokeWeight: 2,
    scale: size / 2,
  };
}

export function PlotMap({ apiKey, focusPlotId }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let map: google.maps.Map | null = null;

    setOptions({ key: apiKey, v: "weekly" });

    Promise.all([importLibrary("maps"), importLibrary("marker")])
      .then(async ([maps, markerLib]) => {
        if (cancelled || !containerRef.current) return;
        const focus = PLOTS.find((p) => p.id === focusPlotId) ?? PLOTS[0];
        const center: google.maps.LatLngLiteral = focus
          ? { lat: focus.center.lat, lng: focus.center.lng }
          : { lat: DEFAULT_MAP_CENTER.lat, lng: DEFAULT_MAP_CENTER.lng };
        const zoom = focus?.zoom ?? DEFAULT_MAP_ZOOM;

        map = new maps.Map(containerRef.current, {
          center,
          zoom,
          styles: MAP_STYLES,
          disableDefaultUI: true,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          gestureHandling: "cooperative",
          backgroundColor: "#f4f1e8",
        });

        // Reference points (cities, polygon, forest)
        for (const ref of REFERENCE_POINTS) {
          const color =
            ref.kind === "polygon"
              ? "#a44a3a"
              : ref.kind === "forest"
                ? "#7a9460"
                : "#3a3a32";
          new markerLib.Marker({
            position: { lat: ref.lat, lng: ref.lng },
            map,
            icon: makePin(google.maps.SymbolPath, color, ref.kind === "city" ? 10 : 8),
            label: {
              text: ref.name,
              color: "#3a3a32",
              fontSize: "11px",
              fontWeight: "500",
              className: "plotmap-label",
            },
            title: ref.name,
          });
        }

        // Túbir plots
        for (const plot of PLOTS) {
          const fill = statusFill(plot.status);
          if (plot.polygon && plot.polygon.length >= 3) {
            new maps.Polygon({
              paths: plot.polygon,
              map,
              strokeColor: PRIMARY_DEEP,
              strokeOpacity: 0.9,
              strokeWeight: 2,
              fillColor: fill.fill,
              fillOpacity: fill.opacity,
              clickable: true,
            });
          }
          new markerLib.Marker({
            position: plot.center,
            map,
            icon: makePin(google.maps.SymbolPath, PRIMARY_DEEP, 14),
            label: {
              text: plot.name,
              color: PRIMARY_DEEP,
              fontSize: "12px",
              fontWeight: "600",
              className: "plotmap-label",
            },
            title: plot.description ?? plot.name,
          });
        }

        if (!cancelled) setState("ready");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setState("error");
        setErrorMessage(err instanceof Error ? err.message : String(err));
      });

    return () => {
      cancelled = true;
      map = null;
    };
  }, [apiKey, focusPlotId]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="aspect-[16/9] w-full overflow-hidden rounded-sm border border-border bg-muted/30"
        aria-label="Túbir plot map"
      />
      {state !== "ready" ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-sm border border-border bg-background/85 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm">
            {state === "loading" ? (
              <span className="text-serif-italic">Загружаем карту…</span>
            ) : (
              <span className="text-serif-italic">
                Карту не удалось загрузить. {errorMessage}
              </span>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

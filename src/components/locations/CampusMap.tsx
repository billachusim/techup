import { useEffect, useRef } from "react";
import { campuses, directionsUrl, type Campus } from "@/data/campuses";

declare global {
  interface Window {
    google?: any;
    __initTfMap?: () => void;
  }
}

interface Props {
  activeId?: string | null;
  onSelect?: (id: string) => void;
}

const BROWSER_KEY = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY as string | undefined;
const CHANNEL = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID as string | undefined;

let loadingPromise: Promise<void> | null = null;
function loadMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.google?.maps) return Promise.resolve();
  if (loadingPromise) return loadingPromise;
  loadingPromise = new Promise((resolve, reject) => {
    if (!BROWSER_KEY) return reject(new Error("Missing Google Maps browser key"));
    window.__initTfMap = () => resolve();
    const s = document.createElement("script");
    const params = new URLSearchParams({ key: BROWSER_KEY, loading: "async", callback: "__initTfMap" });
    if (CHANNEL) params.set("channel", CHANNEL);
    s.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    s.async = true;
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
  return loadingPromise;
}

const CampusMap = ({ activeId, onSelect }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const infoRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    loadMaps()
      .then(() => {
        if (cancelled || !containerRef.current || !window.google) return;
        const g = window.google;
        const map = new g.maps.Map(containerRef.current, {
          center: { lat: 9.082, lng: 8.6753 },
          zoom: 6,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });
        mapRef.current = map;
        infoRef.current = new g.maps.InfoWindow();
        campuses.forEach((c: Campus) => {
          const marker = new g.maps.Marker({
            position: { lat: c.lat, lng: c.lng },
            map,
            title: c.name,
          });
          marker.addListener("click", () => {
            infoRef.current.setContent(
              `<div style="max-width:240px;font-family:inherit"><div style="font-weight:600;margin-bottom:4px">${c.name}</div><div style="font-size:12px;color:#555;margin-bottom:6px">${c.address}</div><a href="${directionsUrl(c)}" target="_blank" rel="noopener" style="color:#0ea5a4;font-size:12px;font-weight:600">Get directions →</a></div>`,
            );
            infoRef.current.open({ anchor: marker, map });
            onSelect?.(c.id);
          });
          markersRef.current[c.id] = marker;
        });
      })
      .catch((e) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div style="padding:24px;text-align:center;color:#888;font-size:14px">Map unavailable: ${e.message}</div>`;
        }
      });
    return () => {
      cancelled = true;
    };
  }, [onSelect]);

  useEffect(() => {
    if (!activeId || !mapRef.current || !window.google) return;
    const c = campuses.find((x) => x.id === activeId);
    const marker = markersRef.current[activeId];
    if (!c || !marker) return;
    mapRef.current.panTo({ lat: c.lat, lng: c.lng });
    mapRef.current.setZoom(12);
    infoRef.current?.setContent(
      `<div style="max-width:240px;font-family:inherit"><div style="font-weight:600;margin-bottom:4px">${c.name}</div><div style="font-size:12px;color:#555;margin-bottom:6px">${c.address}</div><a href="${directionsUrl(c)}" target="_blank" rel="noopener" style="color:#0ea5a4;font-size:12px;font-weight:600">Get directions →</a></div>`,
    );
    infoRef.current?.open({ anchor: marker, map: mapRef.current });
  }, [activeId]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[480px] rounded-xl border border-border bg-muted overflow-hidden"
      role="application"
      aria-label="Map of Tech Faculty campuses across Nigeria"
    />
  );
};

export default CampusMap;
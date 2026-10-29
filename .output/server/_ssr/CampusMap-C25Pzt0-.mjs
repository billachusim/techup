import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { i as directionsUrl, n as campuses } from "./campuses-DtkbL75I.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/CampusMap-C25Pzt0-.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var BROWSER_KEY = "AIzaSyAy1C2D3dViZzL0xzCoFL--un0f014P9oI";
var CHANNEL = "d30c3922867c12efb21ca99a0ce186a9";
var loadingPromise = null;
function loadMaps() {
	if (typeof window === "undefined") return Promise.reject(/* @__PURE__ */ new Error("no window"));
	if (window.google?.maps) return Promise.resolve();
	if (loadingPromise) return loadingPromise;
	loadingPromise = new Promise((resolve, reject) => {
		window.__initTfMap = () => resolve();
		const s = document.createElement("script");
		const params = new URLSearchParams({
			key: BROWSER_KEY,
			loading: "async",
			callback: "__initTfMap"
		});
		params.set("channel", CHANNEL);
		s.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
		s.async = true;
		s.onerror = () => reject(/* @__PURE__ */ new Error("Failed to load Google Maps"));
		document.head.appendChild(s);
	});
	return loadingPromise;
}
var CampusMap = ({ activeId, onSelect, items, center, zoom, className, ariaLabel }) => {
	const points = items ?? campuses;
	const containerRef = (0, import_react.useRef)(null);
	const mapRef = (0, import_react.useRef)(null);
	const markersRef = (0, import_react.useRef)({});
	const infoRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		loadMaps().then(() => {
			if (cancelled || !containerRef.current || !window.google) return;
			const g = window.google;
			const map = new g.maps.Map(containerRef.current, {
				center: center ?? {
					lat: 9.082,
					lng: 8.6753
				},
				zoom: zoom ?? 6,
				mapTypeControl: false,
				streetViewControl: false,
				fullscreenControl: false
			});
			mapRef.current = map;
			infoRef.current = new g.maps.InfoWindow();
			points.forEach((c) => {
				const marker = new g.maps.Marker({
					position: {
						lat: c.lat,
						lng: c.lng
					},
					map,
					title: c.name
				});
				marker.addListener("click", () => {
					infoRef.current?.setContent(`<div style="max-width:240px;font-family:inherit"><div style="font-weight:600;margin-bottom:4px">${c.name}</div><div style="font-size:12px;color:#555;margin-bottom:6px">${c.address}</div><a href="${directionsUrl(c)}" target="_blank" rel="noopener" style="color:#0ea5a4;font-size:12px;font-weight:600">Get directions →</a></div>`);
					infoRef.current?.open({
						anchor: marker,
						map
					});
					onSelect?.(c.id);
				});
				markersRef.current[c.id] = marker;
			});
		}).catch((e) => {
			if (containerRef.current) containerRef.current.innerHTML = `<div style="padding:24px;text-align:center;color:#888;font-size:14px">Map unavailable: ${e.message}</div>`;
		});
		return () => {
			cancelled = true;
		};
	}, [
		onSelect,
		points,
		center,
		zoom
	]);
	(0, import_react.useEffect)(() => {
		if (!activeId || !mapRef.current || !window.google) return;
		const c = points.find((x) => x.id === activeId);
		const marker = markersRef.current[activeId];
		if (!c || !marker) return;
		mapRef.current.panTo({
			lat: c.lat,
			lng: c.lng
		});
		mapRef.current.setZoom(12);
		infoRef.current?.setContent(`<div style="max-width:240px;font-family:inherit"><div style="font-weight:600;margin-bottom:4px">${c.name}</div><div style="font-size:12px;color:#555;margin-bottom:6px">${c.address}</div><a href="${directionsUrl(c)}" target="_blank" rel="noopener" style="color:#0ea5a4;font-size:12px;font-weight:600">Get directions →</a></div>`);
		infoRef.current?.open({
			anchor: marker,
			map: mapRef.current
		});
	}, [activeId, points]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: containerRef,
		className: className ?? "w-full h-[480px] rounded-xl border border-border bg-muted overflow-hidden",
		role: "application",
		"aria-label": ariaLabel ?? "Map of Tech Faculty campuses across Nigeria"
	});
};
//#endregion
export { CampusMap as t };

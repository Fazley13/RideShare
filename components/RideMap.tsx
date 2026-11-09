"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix standard marker loading issues in Next.js
fixLeafletIcons();

function fixLeafletIcons() {
  if (typeof window !== "undefined") {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
  }
}

interface Passenger {
  name: string;
  position: [number, number];
}

interface RideMapProps {
  center?: [number, number];
  pickup?: [number, number];
  destination?: [number, number];
  currentPos?: [number, number];
  polylinePoints?: [number, number][];
  passengers?: Passenger[];
  zoom?: number;
}

// Helper to fit the bounds of the map dynamically
function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points && points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [points, map]);
  return null;
}

export default function RideMap({
  center = [23.8103, 90.4125], // Dhaka, Bangladesh
  pickup,
  destination,
  currentPos,
  polylinePoints,
  passengers = [],
  zoom = 13,
}: RideMapProps) {
  // Custom icon for pulsing current position
  const pulseIcon = typeof window !== "undefined"
    ? L.divIcon({
        className: "map-pulse-marker",
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      })
    : null;

  // Custom icon for standard markers in brand color
  const markerIcon = typeof window !== "undefined"
    ? L.icon({
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })
    : null;

  const allPoints: [number, number][] = [];
  if (pickup) allPoints.push(pickup);
  if (destination) allPoints.push(destination);
  if (currentPos) allPoints.push(currentPos);
  passengers.forEach((p) => allPoints.push(p.position));

  return (
    <div className="w-full h-full min-h-[200px] bg-gray-50 overflow-hidden relative">
      <MapContainer
        center={currentPos || pickup || center}
        zoom={zoom}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Start/Pickup Marker */}
        {pickup && markerIcon && (
          <Marker position={pickup} icon={markerIcon} />
        )}

        {/* Destination Marker */}
        {destination && markerIcon && (
          <Marker position={destination} icon={markerIcon} />
        )}

        {/* Current pulsing position */}
        {currentPos && pulseIcon && (
          <Marker position={currentPos} icon={pulseIcon} />
        )}

        {/* Passengers positions */}
        {passengers.map((p, idx) => markerIcon && (
          <Marker key={idx} position={p.position} icon={markerIcon} />
        ))}

        {/* Route Polyline (Dashed) */}
        {polylinePoints && polylinePoints.length > 0 && (
          <Polyline
            positions={polylinePoints}
            color="#DC2626"
            dashArray="8, 8"
            weight={4}
          />
        )}

        {/* Autoscale bounds */}
        {allPoints.length > 1 && <FitBounds points={allPoints} />}
      </MapContainer>
    </div>
  );
}

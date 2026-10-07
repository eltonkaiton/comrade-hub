import { useEffect } from 'react';
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapPoints({ pickup, destination }) {
  const map = useMap();

  useEffect(() => {
    const points = [pickup, destination].filter(Boolean);
    if (points.length === 1) {
      map.setView(points[0], 14);
    } else if (points.length === 2) {
      map.fitBounds(points, { padding: [36, 36], maxZoom: 14 });
    }
  }, [destination, map, pickup]);

  return (
    <>
      {pickup && (
        <CircleMarker
          center={pickup}
          radius={9}
          pathOptions={{ color: '#176b3a', fillOpacity: 0.9 }}
        >
          <Popup>Pickup point</Popup>
        </CircleMarker>
      )}
      {destination && (
        <CircleMarker
          center={destination}
          radius={9}
          pathOptions={{ color: '#d94841', fillOpacity: 0.9 }}
        >
          <Popup>Destination</Popup>
        </CircleMarker>
      )}
      {pickup && destination && (
        <Polyline
          positions={[pickup, destination]}
          pathOptions={{ color: '#2563eb', dashArray: '7 8' }}
        />
      )}
    </>
  );
}

function TransportBookingMap({ pickup, destination }) {
  return (
    <MapContainer
      className="transport-booking-map"
      center={pickup || destination || [-1.286389, 36.817223]}
      zoom={6}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapPoints pickup={pickup} destination={destination} />
    </MapContainer>
  );
}

export default TransportBookingMap;
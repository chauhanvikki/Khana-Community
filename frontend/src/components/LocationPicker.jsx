import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useGoogleMaps } from '../hooks/useGoogleMaps';

const containerStyle = { width: '100%', height: '320px', borderRadius: '12px', overflow: 'hidden' };
const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };

const LocationPicker = ({ onConfirm, onClose }) => {
  const { isLoaded } = useGoogleMaps();

  const [markerPos, setMarkerPos] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const mapRef = useRef(null);

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();
      if (data.results?.[0]) return data.results[0].formatted_address;
    } catch (_) {}
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  };

  const handleMapClick = useCallback(async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPos({ lat, lng });
    setLoading(true);
    const addr = await reverseGeocode(lat, lng);
    setAddress(addr);
    setLoading(false);
  }, []);

  const handleGPS = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    let best = null;
    let bestAccuracy = Infinity;

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;
        if (accuracy < bestAccuracy) {
          bestAccuracy = accuracy;
          best = { lat, lng };
          setMarkerPos({ lat, lng });
          mapRef.current?.panTo({ lat, lng });
          mapRef.current?.setZoom(16);
          const addr = await reverseGeocode(lat, lng);
          setAddress(addr);
        }
        if (accuracy <= 20) {
          navigator.geolocation.clearWatch(watchId);
          setGpsLoading(false);
        }
      },
      () => setGpsLoading(false),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );

    setTimeout(() => {
      navigator.geolocation.clearWatch(watchId);
      setGpsLoading(false);
    }, 10000);
  };

  const handleConfirm = () => {
    if (!markerPos) return;
    onConfirm({ coords: markerPos, address });
  };

  if (!isLoaded) return <div className="h-[320px] flex items-center justify-center text-gray-400">Loading map...</div>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 flex items-center justify-between">
          <h3 className="text-white font-bold text-lg">📍 Pick Your Location</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl font-bold">✕</button>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-sm text-gray-500">Click on the map or use GPS to set your exact pickup location. You can drag the pin to adjust.</p>

          <button onClick={handleGPS} disabled={gpsLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-60">
            {gpsLoading ? '📡 Getting GPS...' : '🎯 Use My GPS Location'}
          </button>

          <GoogleMap
            mapContainerStyle={containerStyle}
            center={markerPos || INDIA_CENTER}
            zoom={markerPos ? 16 : 5}
            onClick={handleMapClick}
            onLoad={(map) => { mapRef.current = map; }}
            options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
          >
            {markerPos && (
              <Marker
                position={markerPos}
                draggable
                onDragEnd={async (e) => {
                  const lat = e.latLng.lat();
                  const lng = e.latLng.lng();
                  setMarkerPos({ lat, lng });
                  setLoading(true);
                  const addr = await reverseGeocode(lat, lng);
                  setAddress(addr);
                  setLoading(false);
                }}
              />
            )}
          </GoogleMap>

          {address && (
            <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-sm text-gray-700">
              📍 {loading ? 'Getting address...' : address}
            </div>
          )}

          <button onClick={handleConfirm} disabled={!markerPos || loading}
            className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all disabled:opacity-50">
            ✅ Confirm This Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;

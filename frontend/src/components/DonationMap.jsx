import React, { useCallback, useRef, useEffect, useState, useMemo } from 'react';
import { GoogleMap, Marker, InfoWindow, Polyline, OverlayView } from '@react-google-maps/api';
import { useGoogleMaps } from '../hooks/useGoogleMaps';

const containerStyle = { width: '100%', height: '380px', borderRadius: '16px', overflow: 'hidden' };
const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };

// ─── OSRM Route Fetcher ─────────────────────────────────────────────────────
async function fetchRoute(origin, destination) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes?.length) return null;
    const route = data.routes[0];
    return {
      path: route.geometry.coordinates.map(([lng, lat]) => ({ lat, lng })),
      distanceKm: (route.distance / 1000).toFixed(1),
      durationMin: Math.round(route.duration / 60),
    };
  } catch {
    return null;
  }
}

// ─── Custom Marker SVGs ──────────────────────────────────────────────────────
function createVolunteerIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="20" fill="#2563EB" fill-opacity="0.18" stroke="#2563EB" stroke-width="2"/>
    <circle cx="22" cy="22" r="11" fill="#2563EB"/>
    <circle cx="22" cy="22" r="5" fill="white"/>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createDonorIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 40 52">
    <path d="M20 50 C20 50 38 30 38 18 C38 8 30 0 20 0 C10 0 2 8 2 18 C2 30 20 50 20 50Z" fill="#EA580C" stroke="#fff" stroke-width="2"/>
    <circle cx="20" cy="18" r="8" fill="white"/>
    <text x="20" y="22" text-anchor="middle" font-size="14" fill="#EA580C">🏠</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createVolunteerLiveIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="22" fill="#3B82F6" fill-opacity="0.12">
      <animate attributeName="r" values="16;22;16" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="fill-opacity" values="0.2;0.05;0.2" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="24" cy="24" r="14" fill="#2563EB"/>
    <text x="24" y="29" text-anchor="middle" font-size="16" fill="white">🚗</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

// ─── ETA Info Card (Overlay) ─────────────────────────────────────────────────
const ETACard = ({ routeInfo, isDonorView }) => {
  if (!routeInfo) return null;
  return (
    <div style={{
      position: 'absolute',
      top: '12px',
      left: '12px',
      zIndex: 10,
      background: 'linear-gradient(135deg, #1e40af, #2563eb)',
      color: '#fff',
      padding: '10px 16px',
      borderRadius: '14px',
      boxShadow: '0 4px 20px rgba(37,99,235,0.35)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontFamily: "'Segoe UI', Arial, sans-serif",
      minWidth: '180px',
    }}>
      <div style={{
        width: '38px', height: '38px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.2)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: '18px',
        flexShrink: 0,
      }}>
        🚗
      </div>
      <div>
        <div style={{ fontSize: '18px', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-0.3px' }}>
          {routeInfo.durationMin} min
        </div>
        <div style={{ fontSize: '11px', opacity: 0.85, marginTop: '2px', fontWeight: '500' }}>
          {routeInfo.distanceKm} km · {isDonorView ? 'Volunteer en route' : 'To pickup point'}
        </div>
      </div>
      <div style={{
        width: '8px', height: '8px', borderRadius: '50%',
        background: '#4ade80', marginLeft: 'auto', flexShrink: 0,
        animation: 'pulse 1.5s ease-in-out infinite',
      }} />
    </div>
  );
};

// ─── Animated Polyline Options ───────────────────────────────────────────────
const ROUTE_LINE_OPTIONS = {
  strokeColor: '#2563EB',
  strokeWeight: 5,
  strokeOpacity: 0.85,
  geodesic: true,
  zIndex: 2,
};

const ROUTE_BG_LINE_OPTIONS = {
  strokeColor: '#93C5FD',
  strokeWeight: 8,
  strokeOpacity: 0.4,
  geodesic: true,
  zIndex: 1,
};

const ROUTE_DASH_OPTIONS = {
  strokeOpacity: 0,
  zIndex: 3,
  icons: [{
    icon: {
      path: 'M 0,-1 0,1',
      strokeOpacity: 1,
      strokeColor: '#BFDBFE',
      strokeWeight: 3,
      scale: 4,
    },
    offset: '0',
    repeat: '20px',
  }],
};

// ─── Main Component ──────────────────────────────────────────────────────────
const DonationMap = ({
  mode = 'nearby',
  donations = [],
  volunteerCoords,
  donorCoords,
  volunteerLiveCoords,
  centerOn = 'volunteer',
  onRouteInfo,
}) => {
  const { isLoaded } = useGoogleMaps();
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [routePath, setRoutePath] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const mapRef = useRef(null);
  const routeTimerRef = useRef(null);
  const dashOffsetRef = useRef(0);
  const animFrameRef = useRef(null);
  const polylineRef = useRef(null);

  const volunteerIcon = useMemo(() => isLoaded ? {
    url: createVolunteerIcon(),
    scaledSize: new window.google.maps.Size(44, 44),
    anchor: new window.google.maps.Point(22, 22),
  } : null, [isLoaded]);

  const volunteerLiveIcon = useMemo(() => isLoaded ? {
    url: createVolunteerLiveIcon(),
    scaledSize: new window.google.maps.Size(48, 48),
    anchor: new window.google.maps.Point(24, 24),
  } : null, [isLoaded]);

  const donorIcon = useMemo(() => isLoaded ? {
    url: createDonorIcon(),
    scaledSize: new window.google.maps.Size(40, 52),
    anchor: new window.google.maps.Point(20, 52),
  } : null, [isLoaded]);

  const getCenter = () => {
    if (centerOn === 'donor' && donorCoords) return donorCoords;
    if (volunteerLiveCoords) return volunteerLiveCoords;
    if (volunteerCoords) return volunteerCoords;
    return INDIA_CENTER;
  };

  const onLoad = useCallback((map) => { mapRef.current = map; }, []);

  // ─── Auto-fit bounds to show full route ────────────────────────────────
  const fitRoute = useCallback((path, origin, destination) => {
    if (!mapRef.current || !window.google) return;
    const bounds = new window.google.maps.LatLngBounds();
    if (origin) bounds.extend(origin);
    if (destination) bounds.extend(destination);
    if (path) path.forEach((p) => bounds.extend(p));
    mapRef.current.fitBounds(bounds, { top: 70, bottom: 30, left: 20, right: 20 });
  }, []);

  // ─── Route fetching with periodic refresh ──────────────────────────────
  const fetchAndSetRoute = useCallback(async (origin, dest) => {
    const result = await fetchRoute(origin, dest);
    if (result) {
      setRoutePath(result.path);
      setRouteInfo({ distanceKm: result.distanceKm, durationMin: result.durationMin });
      if (onRouteInfo) onRouteInfo({ distanceKm: result.distanceKm, durationMin: result.durationMin });
      fitRoute(result.path, origin, dest);
    }
  }, [fitRoute, onRouteInfo]);

  useEffect(() => {
    // Clear previous timer
    if (routeTimerRef.current) {
      clearInterval(routeTimerRef.current);
      routeTimerRef.current = null;
    }

    if (mode !== 'tracking') {
      setRoutePath(null);
      setRouteInfo(null);
      return;
    }

    const origin = volunteerLiveCoords || volunteerCoords;
    if (!origin || !donorCoords) {
      setRoutePath(null);
      setRouteInfo(null);
      return;
    }

    // Fetch immediately
    fetchAndSetRoute(origin, donorCoords);

    // Re-fetch every 15 seconds for live updates
    routeTimerRef.current = setInterval(() => {
      const liveOrigin = volunteerLiveCoords || volunteerCoords;
      if (liveOrigin && donorCoords) {
        fetchAndSetRoute(liveOrigin, donorCoords);
      }
    }, 15000);

    return () => {
      if (routeTimerRef.current) {
        clearInterval(routeTimerRef.current);
        routeTimerRef.current = null;
      }
    };
  }, [mode, volunteerCoords, volunteerLiveCoords, donorCoords, fetchAndSetRoute]);

  // ─── Animated dash offset ──────────────────────────────────────────────
  useEffect(() => {
    if (!routePath || !polylineRef.current) return;

    const animate = () => {
      dashOffsetRef.current = (dashOffsetRef.current + 0.5) % 100;
      if (polylineRef.current) {
        const icons = polylineRef.current.get('icons');
        if (icons && icons[0]) {
          icons[0].offset = dashOffsetRef.current + '%';
          polylineRef.current.set('icons', icons);
        }
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [routePath]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (routeTimerRef.current) clearInterval(routeTimerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  if (!isLoaded) return (
    <div style={{ height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', borderRadius: '16px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '28px', marginBottom: '8px' }}>🗺️</div>
        <span style={{ color: '#9ca3af', fontWeight: '600' }}>Loading map...</span>
      </div>
    </div>
  );

  const isDonorView = centerOn === 'donor';

  return (
    <div style={{ position: 'relative' }}>
      {/* ETA Card Overlay */}
      {mode === 'tracking' && <ETACard routeInfo={routeInfo} isDonorView={isDonorView} />}

      {/* Pulse animation CSS */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={getCenter()}
        zoom={14}
        onLoad={onLoad}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          styles: mode === 'tracking' ? [
            { featureType: 'poi', stylers: [{ visibility: 'off' }] },
            { featureType: 'transit', stylers: [{ visibility: 'off' }] },
          ] : [],
        }}
      >
        {/* ── Route Lines (3-layer: glow bg → solid → animated dash) ────── */}
        {routePath && (
          <>
            {/* Background glow line */}
            <Polyline path={routePath} options={ROUTE_BG_LINE_OPTIONS} />
            {/* Main solid line */}
            <Polyline path={routePath} options={ROUTE_LINE_OPTIONS} />
            {/* Animated dashes */}
            <Polyline
              path={routePath}
              options={ROUTE_DASH_OPTIONS}
              onLoad={(poly) => { polylineRef.current = poly; }}
            />
          </>
        )}

        {/* ── Volunteer static marker ──────────────────────────────────── */}
        {volunteerCoords && !volunteerLiveCoords && (
          <Marker
            position={volunteerCoords}
            icon={volunteerIcon}
            title="You (Volunteer)"
            zIndex={10}
          />
        )}

        {/* ── Volunteer live marker (pulsing car) ──────────────────────── */}
        {volunteerLiveCoords && (
          <Marker
            position={volunteerLiveCoords}
            icon={volunteerLiveIcon}
            title="Volunteer (live)"
            zIndex={15}
          />
        )}

        {/* ── Donor marker (orange pin) ────────────────────────────────── */}
        {donorCoords && mode === 'tracking' && (
          <Marker
            position={donorCoords}
            icon={donorIcon}
            title="Donor / Pickup Location"
            zIndex={10}
          />
        )}

        {/* ── Nearby donations markers ─────────────────────────────────── */}
        {mode === 'nearby' && donations
          .filter((d) => d.coordinates?.coordinates?.length === 2)
          .map((d) => (
            <Marker
              key={d._id}
              position={{ lat: d.coordinates.coordinates[1], lng: d.coordinates.coordinates[0] }}
              title={d.foodName}
              onClick={() => setSelectedDonation(d)}
            />
          ))}

        {selectedDonation && (
          <InfoWindow
            position={{ lat: selectedDonation.coordinates.coordinates[1], lng: selectedDonation.coordinates.coordinates[0] }}
            onCloseClick={() => setSelectedDonation(null)}
          >
            <div>
              <strong>🍱 {selectedDonation.foodName}</strong>
              <p>{selectedDonation.distanceKm ? `${selectedDonation.distanceKm} km away` : selectedDonation.location}</p>
              <p style={{ color: '#6b7280', fontSize: '12px' }}>Donor: {selectedDonation.donorId?.name || 'Unknown'}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default DonationMap;

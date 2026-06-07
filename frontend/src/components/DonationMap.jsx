import React, { useCallback, useRef } from 'react';
import { GoogleMap, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { useGoogleMaps } from '../hooks/useGoogleMaps';

const containerStyle = { width: '100%', height: '380px', borderRadius: '16px', overflow: 'hidden' };

const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };

const DonationMap = ({
  mode = 'nearby',
  donations = [],
  volunteerCoords,
  donorCoords,
  volunteerLiveCoords,
  centerOn = 'volunteer',
}) => {
  const { isLoaded } = useGoogleMaps();

  const [selectedDonation, setSelectedDonation] = React.useState(null);
  const [directions, setDirections] = React.useState(null);
  const mapRef = useRef(null);

  const getCenter = () => {
    if (centerOn === 'donor' && donorCoords) return donorCoords;
    if (volunteerCoords) return volunteerCoords;
    if (volunteerLiveCoords) return volunteerLiveCoords;
    return INDIA_CENTER;
  };

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // Fetch directions when both volunteer and donor coords are available in tracking mode
  React.useEffect(() => {
    if (mode !== 'tracking') return;
    const origin = volunteerLiveCoords || volunteerCoords;
    const destination = donorCoords;
    if (!origin || !destination || !window.google) return;

    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') setDirections(result);
        else setDirections(null);
      }
    );
  }, [mode, volunteerCoords, volunteerLiveCoords, donorCoords]);

  if (!isLoaded) return <div style={{ height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={getCenter()}
      zoom={14}
      onLoad={onLoad}
      options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: true }}
    >
      {/* Route between volunteer and donor in tracking mode */}
      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            suppressMarkers: true,
            polylineOptions: { strokeColor: '#4285F4', strokeWeight: 5, strokeOpacity: 0.8 }
          }}
        />
      )}

      {/* Volunteer position */}
      {volunteerCoords && (
        <Marker
          position={volunteerCoords}
          label={{ text: '🧑 You', color: '#fff', fontSize: '12px' }}
          title="You (Volunteer)"
        />
      )}

      {/* Live volunteer position */}
      {volunteerLiveCoords && (
        <Marker
          position={volunteerLiveCoords}
          label={{ text: '🚗', color: '#fff', fontSize: '14px' }}
          title="Volunteer (live)"
        />
      )}

      {/* Donor pin in tracking mode */}
      {donorCoords && mode === 'tracking' && (
        <Marker
          position={donorCoords}
          label={{ text: '🏠', color: '#fff', fontSize: '14px' }}
          title="Donor Location"
        />
      )}

      {/* Nearby donations */}
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

      {/* Info window for selected donation */}
      {selectedDonation && (
        <InfoWindow
          position={{
            lat: selectedDonation.coordinates.coordinates[1],
            lng: selectedDonation.coordinates.coordinates[0],
          }}
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
  );
};

export default DonationMap;

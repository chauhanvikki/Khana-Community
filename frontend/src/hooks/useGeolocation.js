import { useState, useCallback, useRef } from 'react';

export const useGeolocation = () => {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const bestAccuracy = useRef(Infinity);
  const watchId = useRef(null);
  const timer = useRef(null);

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);
    bestAccuracy.current = Infinity;

    // Stop any previous watch
    if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    if (timer.current) clearTimeout(timer.current);

    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;

        // Only update if this reading is more accurate
        if (accuracy < bestAccuracy.current) {
          bestAccuracy.current = accuracy;
          setCoords({ lat: latitude, lng: longitude });
        }

        // If accuracy is good enough (within 20 meters), stop watching
        if (accuracy <= 20) {
          navigator.geolocation.clearWatch(watchId.current);
          setLoading(false);
        }
      },
      (err) => {
        setError(err.code === 1 ? 'Location permission denied.' : 'Unable to get location.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );

    // Stop watching after 10 seconds regardless — use best result so far
    timer.current = setTimeout(() => {
      navigator.geolocation.clearWatch(watchId.current);
      setLoading(false);
    }, 10000);
  }, []);

  return { coords, error, loading, request };
};

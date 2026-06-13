import { useState, useCallback, useRef, useEffect } from 'react';

export const useGeolocation = (continuous = false) => {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const bestAccuracy = useRef(Infinity);
  const watchId = useRef(null);
  const timer = useRef(null);

  // Cleanup helper
  const stopWatching = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);
    bestAccuracy.current = Infinity;

    // Stop any previous watch
    stopWatching();

    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;

        // Only update if this reading is more accurate or in continuous mode
        if (continuous || accuracy < bestAccuracy.current) {
          bestAccuracy.current = accuracy;
          setCoords({ lat: latitude, lng: longitude });
        }

        // In continuous mode, never auto-stop — keep updating
        if (continuous) {
          setLoading(false);
          return;
        }

        // In one-shot mode: stop once accuracy is good
        if (accuracy <= 20) {
          navigator.geolocation.clearWatch(watchId.current);
          watchId.current = null;
          setLoading(false);
        }
      },
      (err) => {
        setError(err.code === 1 ? 'Location permission denied.' : 'Unable to get location.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: continuous ? 3000 : 0 }
    );

    // In one-shot mode, stop watching after 10 seconds
    if (!continuous) {
      timer.current = setTimeout(() => {
        if (watchId.current !== null) {
          navigator.geolocation.clearWatch(watchId.current);
          watchId.current = null;
        }
        setLoading(false);
      }, 10000);
    }
  }, [continuous, stopWatching]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopWatching();
  }, [stopWatching]);

  return { coords, error, loading, request, stopWatching };
};

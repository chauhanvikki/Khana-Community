import { useState, useEffect, useRef } from 'react';

/**
 * role: 'volunteer' | 'donor'
 * volunteer \u2014 broadcasts GPS via socket
 * donor \u2014 listens for volunteer location updates
 */
export const useTracking = (socket, donationId, role) => {
  const [volunteerLocation, setVolunteerLocation] = useState(null);
  const watchId = useRef(null);

  useEffect(() => {
    if (!socket || !donationId) return;

    // Both sides join the donation-specific room
    socket.emit('join:tracking', { donationId });

    if (role === 'volunteer') {
      if (!navigator.geolocation) return;
      watchId.current = navigator.geolocation.watchPosition(
        (pos) => {
          socket.emit('volunteer:location', {
            donationId,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        null,
        { enableHighAccuracy: true, maximumAge: 3000 }
      );
    }

    if (role === 'donor') {
      const handler = ({ lat, lng }) => setVolunteerLocation({ lat, lng });
      socket.on('location:update', handler);
      return () => {
        socket.off('location:update', handler);
        socket.emit('leave:tracking', { donationId });
      };
    }

    return () => {
      socket.emit('leave:tracking', { donationId });
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    };
  }, [socket, donationId, role]);

  return { volunteerLocation };
};

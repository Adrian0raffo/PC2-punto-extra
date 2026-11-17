import { useEffect, useState } from 'react';
import { getBooking } from '../services/flightService';
import { getStatus } from '../services/errors';
import {
  forgetBookingIds,
  getSavedBookings,
  matchesBooking,
  saveBookingReference,
} from '../utils/bookingStorage';
import type { Booking, User } from '../types';
export function useMyBookings(user: User | null) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serverDown, setServerDown] = useState(false);
  const [removedCount, setRemovedCount] = useState(0);
  const [reloadCount, setReloadCount] = useState(0);
  useEffect(() => {
    if (!user) return;
    let ignore = false;
    const saved = getSavedBookings(user.email);
    setIsLoading(true);
    setServerDown(false);
    setRemovedCount(0);
    void Promise.allSettled(saved.map((r) => getBooking(r.id))).then((results) => {
      if (ignore) return;
      const mine: Booking[] = [];
      const missing: number[] = [];
      let failed = false;
      results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          if (matchesBooking(saved[i], result.value, user)) {
            mine.push(result.value);
            saveBookingReference(user, result.value);
          } else missing.push(saved[i].id);
        } else {
          const status = getStatus(result.reason);
          // El backend usa 500 incluso para IDs inexistentes: no podemos distinguirlo de una falla temporal.
          // Solo 404/410 confirman ausencia. Ante 500, 503, timeout o fallo de red conservamos la referencia.
          if (status === 404 || status === 410) missing.push(saved[i].id);
          else if (status !== 403) failed = true;
        }
      });
      forgetBookingIds(user.email, missing);
      setBookings(
        mine.sort(
          (a, b) => new Date(a.estDepartureTime).getTime() - new Date(b.estDepartureTime).getTime(),
        ),
      );
      setRemovedCount(missing.length);
      setServerDown(failed);
      setIsLoading(false);
    });
    return () => {
      ignore = true;
    };
  }, [user, reloadCount]);
  return {
    bookings,
    isLoading,
    serverDown,
    removedCount,
    reload: () => setReloadCount((n) => n + 1),
  };
}

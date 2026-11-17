import { useEffect, useState } from 'react';
import { getBooking } from '../services/flightService';
import { getErrorMessage } from '../services/errors';
import { getSavedBookings, matchesBooking, saveBookingReference } from '../utils/bookingStorage';
import type { Booking, User } from '../types';
export function useBookingDetail(id: string | undefined, user: User | null) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadCount, setReloadCount] = useState(0);
  useEffect(() => {
    if (!user) return;
    let ignore = false;
    setBooking(null);
    setError('');
    setIsLoading(true);
    async function load() {
      if (!id || !/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id)))
        throw new Error('El número de reserva no es válido.');
      const record = getSavedBookings(user!.email).find((r) => r.id === Number(id));
      if (!record)
        throw new Error(
          'No hay una referencia verificable de esta reserva en este navegador. Los IDs antiguos sin fecha no se pueden recuperar automáticamente.',
        );
      const data = await getBooking(Number(id));
      if (!matchesBooking(record, data, user!))
        throw new Error(
          'Esta reserva ya no corresponde a la que guardaste. El servidor pudo haberse reiniciado.',
        );
      return data;
    }
    void load()
      .then((data) => {
        if (!ignore) {
          saveBookingReference(user, data);
          setBooking(data);
        }
      })
      .catch((err) => {
        if (!ignore) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [id, user, reloadCount]);
  return { booking, isLoading, error, reload: () => setReloadCount((n) => n + 1) };
}

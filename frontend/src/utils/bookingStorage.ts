import type { Booking, Flight, User } from '../types';
export interface SavedBooking {
  id: number;
  customerId: number;
  flightId: number;
  departure: string;
  bookingDate: string | null;
  createdAt: number;
}
const key = (email: string) => 'bookings:' + email;
export function getSavedBookings(email: string): SavedBooking[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key(email)) ?? '[]');
    return Array.isArray(value)
      ? value.filter(
          (r): r is SavedBooking =>
            r &&
            typeof r === 'object' &&
            Number.isInteger(r.id) &&
            Number.isInteger(r.customerId) &&
            Number.isInteger(r.flightId) &&
            typeof r.departure === 'string' &&
            (typeof r.bookingDate === 'string' || r.bookingDate === null) &&
            Number.isFinite(r.createdAt),
        )
      : [];
  } catch {
    return [];
  }
}
export function getSavedBookingIds(email: string) {
  return getSavedBookings(email).map((r) => r.id);
}
function put(email: string, record: SavedBooking) {
  localStorage.setItem(
    key(email),
    JSON.stringify([...getSavedBookings(email).filter((r) => r.id !== record.id), record]),
  );
}
export function savePendingBooking(user: User, id: number, flight: Flight) {
  put(user.email, {
    id,
    customerId: user.id,
    flightId: flight.id,
    departure: flight.estDepartureTime,
    bookingDate: null,
    createdAt: Date.now(),
  });
}
export function saveBookingReference(user: User, booking: Booking) {
  put(user.email, {
    id: booking.id,
    customerId: booking.customerId,
    flightId: booking.flightId,
    departure: booking.estDepartureTime,
    bookingDate: booking.bookingDate,
    createdAt: Date.now(),
  });
}
export function matchesBooking(record: SavedBooking, booking: Booking, user: User) {
  return (
    record.customerId === user.id &&
    booking.customerId === user.id &&
    record.flightId === booking.flightId &&
    record.departure === booking.estDepartureTime &&
    (record.bookingDate !== null
      ? record.bookingDate === booking.bookingDate
      : Math.abs(new Date(booking.bookingDate).getTime() - record.createdAt) < 120000)
  );
}
export function forgetBookingIds(email: string, ids: number[]) {
  if (ids.length)
    localStorage.setItem(
      key(email),
      JSON.stringify(getSavedBookings(email).filter((r) => !ids.includes(r.id))),
    );
}
// Los IDs antiguos sin fecha no permiten comprobar su identidad; no se muestran automáticamente.

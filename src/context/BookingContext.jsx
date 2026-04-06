import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { getBookings, saveBookings } from '../services/storage'

const BookingContext = createContext(null)

function uid() {
  return `bk_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(() => getBookings())

  const refresh = useCallback(() => {
    setBookings(getBookings())
  }, [])

  const addBooking = useCallback(
    (payload) => {
      const list = getBookings()
      const row = {
        id: uid(),
        ...payload,
        createdAt: new Date().toISOString(),
      }
      list.unshift(row)
      saveBookings(list)
      setBookings([...list])
      return row
    },
    []
  )

  const getBookingsForUser = useCallback(
    (email) => bookings.filter((b) => b.userEmail === email),
    [bookings]
  )

  const value = useMemo(
    () => ({
      bookings,
      addBooking,
      refresh,
      getBookingsForUser,
    }),
    [bookings, addBooking, refresh, getBookingsForUser]
  )

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}

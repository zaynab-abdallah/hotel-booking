const USERS = 'hotel_booking_users'
const SESSION = 'hotel_booking_session'
const BOOKINGS = 'hotel_booking_list'
const FAVORITES = 'hotel_booking_favorites'

export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS) || '[]')
  } catch {
    return []
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS, JSON.stringify(users))
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION) || 'null')
  } catch {
    return null
  }
}

export function saveSession(session) {
  if (session) localStorage.setItem(SESSION, JSON.stringify(session))
  else localStorage.removeItem(SESSION)
}

export function getBookings() {
  try {
    return JSON.parse(localStorage.getItem(BOOKINGS) || '[]')
  } catch {
    return []
  }
}

export function saveBookings(bookings) {
  localStorage.setItem(BOOKINGS, JSON.stringify(bookings))
}

export function getFavoriteIds() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES) || '[]')
  } catch {
    return []
  }
}

export function saveFavoriteIds(ids) {
  localStorage.setItem(FAVORITES, JSON.stringify(ids))
}

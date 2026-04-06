import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { getFavoriteIds, saveFavoriteIds } from '../services/storage'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [ids, setIds] = useState(() => getFavoriteIds())

  const toggleFavorite = useCallback((hotelId) => {
    const current = getFavoriteIds()
    const next = current.includes(hotelId)
      ? current.filter((id) => id !== hotelId)
      : [...current, hotelId]
    saveFavoriteIds(next)
    setIds(next)
  }, [])

  const isFavorite = useCallback(
    (hotelId) => ids.includes(hotelId),
    [ids]
  )

  const value = useMemo(
    () => ({ favoriteIds: ids, toggleFavorite, isFavorite }),
    [ids, toggleFavorite, isFavorite]
  )

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}

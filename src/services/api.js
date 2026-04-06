import axios from 'axios'

const hotelsUrl = '/hotels.json'

export async function fetchHotels() {
  const { data } = await axios.get(hotelsUrl)
  return data
}

export async function fetchHotelById(id) {
  const hotels = await fetchHotels()
  return hotels.find((h) => h.id === id) ?? null
}

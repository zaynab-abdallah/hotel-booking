import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Row, Col, Spinner, Alert, Container } from 'react-bootstrap'
import { fetchHotels } from '../services/api'
import HotelCard from '../components/HotelCard'
import SearchBar from '../components/SearchBar'
import HotelFilters from '../components/HotelFilters'

function normalize(s) {
  return (s || '').toLowerCase().trim()
}

export default function Hotels() {
  const [searchParams] = useSearchParams()
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)
  const [city, setCity] = useState(() => searchParams.get('city') || '')
  const [query, setQuery] = useState('')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(500)
  const [minRating, setMinRating] = useState(0)
  const [hotelType, setHotelType] = useState('')

  useEffect(() => {
    const c = searchParams.get('city')
    if (c) setCity(c)
  }, [searchParams])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const data = await fetchHotels()
        if (!cancelled) {
          setHotels(data)
          setErr(null)
        }
      } catch {
        if (!cancelled) setErr('Could not load hotels. Please try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    const q = normalize(query)
    return hotels.filter((h) => {
      if (city && h.city !== city) return false
      if (h.pricePerNight < minPrice || h.pricePerNight > maxPrice) return false
      if (h.rating < minRating) return false
      if (hotelType && h.hotelType !== hotelType) return false
      if (!q) return true
      const blob = `${h.name} ${h.city} ${h.country} ${h.description} ${(h.amenities || []).join(' ')} ${h.hotelType || ''}`
      return normalize(blob).includes(q)
    })
  }, [hotels, city, query, minPrice, maxPrice, minRating, hotelType])

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" variant="primary" />
        <p className="mt-3 text-muted">Loading hotels…</p>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <h1 className="h2 fw-bold mb-2">Find your hotel</h1>
      <p className="text-muted mb-4">
        Use filters on the left and browse the grid on the right.
      </p>
      {err && <Alert variant="danger">{err}</Alert>}
      <Row className="g-4">
        <Col lg={4} xl={3}>
          <aside className="filters-sidebar rounded-4 bg-white p-4 shadow-sm border-0">
            <h2 className="h6 text-uppercase text-muted mb-3">Filters</h2>
            <SearchBar
              city={city}
              onCityChange={setCity}
              query={query}
              onQueryChange={setQuery}
            />
            <hr className="my-4" />
            <HotelFilters
              minPrice={minPrice}
              maxPrice={maxPrice}
              minRating={minRating}
              hotelType={hotelType}
              onMinPrice={setMinPrice}
              onMaxPrice={setMaxPrice}
              onMinRating={setMinRating}
              onHotelType={setHotelType}
            />
          </aside>
        </Col>
        <Col lg={8} xl={9}>
          <p className="text-muted small mb-3">
            Showing {filtered.length} of {hotels.length} properties
          </p>
          <Row className="g-4">
            {filtered.map((h) => (
              <Col key={h.id} md={6} xl={6}>
                <HotelCard hotel={h} />
              </Col>
            ))}
          </Row>
          {!filtered.length && !err && (
            <p className="text-center text-muted py-5">
              No hotels match your filters.
            </p>
          )}
        </Col>
      </Row>
    </Container>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Badge,
  Button,
  Form,
  Carousel,
} from 'react-bootstrap'
import { fetchHotelById } from '../services/api'
import { useFavorites } from '../context/FavoritesContext'
import DateRangePicker from '../components/DateRangePicker'
import { nightsBetween } from '../utils/dates'

function StarRow({ rating }) {
  const full = Math.min(5, Math.floor(rating))
  return (
    <div className="d-flex align-items-center gap-1 mb-2" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= full ? 'text-warning' : 'text-muted'} style={{ fontSize: '1.25rem' }}>
          ★
        </span>
      ))}
      <span className="ms-2 text-muted small fw-semibold">{rating.toFixed(1)} / 5</span>
    </div>
  )
}

export default function HotelDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)
  const [roomIndex, setRoomIndex] = useState(0)
  const { isFavorite, toggleFavorite } = useFavorites()

  const today = new Date().toISOString().slice(0, 10)
  const [checkIn, setCheckIn] = useState(today)
  const [checkOut, setCheckOut] = useState(() => {
    const t = new Date()
    t.setDate(t.getDate() + 2)
    return t.toISOString().slice(0, 10)
  })
  const [guests, setGuests] = useState(2)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const h = await fetchHotelById(id)
        if (!cancelled) {
          setHotel(h)
          setErr(h ? null : 'Hotel not found')
        }
      } catch {
        if (!cancelled) setErr('Something went wrong while loading.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  const selected = useMemo(() => {
    if (!hotel) return null
    const r = hotel.rooms ?? []
    return (
      r[roomIndex] || {
        type: 'Standard Room',
        price: hotel.pricePerNight,
        maxGuests: 2,
      }
    )
  }, [hotel, roomIndex])

  const nights = useMemo(
    () => nightsBetween(checkIn, checkOut),
    [checkIn, checkOut]
  )

  const totalPrice = useMemo(() => {
    if (!selected) return 0
    return nights * selected.price
  }, [nights, selected])

  const galleryImages = useMemo(() => {
    if (!hotel) return []
    if (hotel.images?.length) return hotel.images
    return [hotel.image]
  }, [hotel])

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    )
  }

  if (err || !hotel || !selected) {
    return (
      <Container className="py-4">
        <Alert variant="warning">{err || 'Not found'}</Alert>
      </Container>
    )
  }

  const fav = isFavorite(hotel.id)

  const handleBook = () => {
    if (new Date(checkOut) <= new Date(checkIn)) return
    navigate('/booking', {
      state: {
        hotelId: hotel.id,
        roomType: selected.type,
        roomPrice: selected.price,
        checkIn,
        checkOut,
        guests: Number(guests),
        nights,
        totalPrice,
      },
    })
  }

  return (
    <Container className="py-4">
      <Row className="g-4 g-lg-5">
        <Col lg={8}>
          <Carousel fade className="hotel-carousel rounded-4 overflow-hidden shadow">
            {galleryImages.map((src, i) => (
              <Carousel.Item key={src + i}>
                <img
                  src={src}
                  alt={`${hotel.name} ${i + 1}`}
                  className="d-block w-100"
                  style={{ height: 420, objectFit: 'cover' }}
                />
              </Carousel.Item>
            ))}
          </Carousel>

          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mt-4">
            <div>
              <h1 className="h2 fw-bold mb-1">{hotel.name}</h1>
              <StarRow rating={hotel.rating} />
              <p className="text-muted mb-0">
                📍 {hotel.city}, {hotel.country}
                {hotel.hotelType && (
                  <Badge bg="secondary" className="ms-2">
                    {hotel.hotelType}
                  </Badge>
                )}
              </p>
            </div>
            <Button
              type="button"
              variant={fav ? 'danger' : 'outline-primary'}
              className="rounded-pill"
              onClick={() => toggleFavorite(hotel.id)}
            >
              {fav ? '♥ Saved' : '♡ Save'}
            </Button>
          </div>

          <p className="lead text-secondary mt-4 mb-4">{hotel.description}</p>

          <h2 className="h5 fw-bold mb-3">Amenities</h2>
          <div className="d-flex flex-wrap gap-2 mb-5">
            {(hotel.amenities || []).map((a) => (
              <Badge key={a} bg="light" text="dark" className="px-3 py-2 border">
                {a}
              </Badge>
            ))}
          </div>
        </Col>

        <Col lg={4}>
          <div className="sticky-booking glass-light rounded-4 p-4 shadow">
            <h2 className="h5 fw-bold mb-3">Book this stay</h2>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold">Room type</Form.Label>
              {(hotel.rooms?.length ?? 0) > 0 ? (
                <Form.Select
                  value={roomIndex}
                  onChange={(e) => setRoomIndex(Number(e.target.value))}
                >
                  {(hotel.rooms ?? []).map((r, i) => (
                    <option key={r.type} value={i}>
                      {r.type} — ${r.price}/night · up to {r.maxGuests} guests
                    </option>
                  ))}
                </Form.Select>
              ) : (
                <p className="small text-muted mb-0">Standard pricing applies.</p>
              )}
            </Form.Group>

            <DateRangePicker
              checkIn={checkIn}
              checkOut={checkOut}
              onCheckIn={setCheckIn}
              onCheckOut={setCheckOut}
              minDate={today}
            />

            <Form.Group className="mt-3">
              <Form.Label className="small fw-semibold">Guests</Form.Label>
              <Form.Control
                type="number"
                min={1}
                max={selected.maxGuests + 4}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              />
              <Form.Text className="text-muted">
                Selected room fits up to {selected.maxGuests} guests comfortably.
              </Form.Text>
            </Form.Group>

            <div className="mt-4 p-3 rounded-3 bg-white bg-opacity-50 border">
              <div className="d-flex justify-content-between small">
                <span className="text-muted">Nights</span>
                <strong>{nights}</strong>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span className="text-muted">Price / night</span>
                <strong>${selected.price}</strong>
              </div>
              <hr className="my-2 opacity-25" />
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-semibold">Total</span>
                <span className="fs-4 fw-bold gradient-text">${totalPrice}</span>
              </div>
            </div>

            <Button
              type="button"
              className="w-100 mt-3 rounded-pill py-2 fw-semibold gradient-bg border-0"
              size="lg"
              onClick={handleBook}
              disabled={nights < 1}
            >
              Book now
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'

const locations = [
  { value: '', label: 'Anywhere' },
  { value: 'Cairo', label: 'Cairo' },
  { value: 'Sharm El Sheikh', label: 'Sharm El Sheikh' },
  { value: 'Dubai', label: 'Dubai' },
  { value: 'Istanbul', label: 'Istanbul' },
  { value: 'Marrakech', label: 'Marrakech' },
]

export default function HeroSearch() {
  const navigate = useNavigate()
  const today = new Date().toISOString().slice(0, 10)
  const [city, setCity] = useState('')
  const [checkIn, setCheckIn] = useState(today)
  const [checkOut, setCheckOut] = useState(() => {
    const t = new Date()
    t.setDate(t.getDate() + 3)
    return t.toISOString().slice(0, 10)
  })
  const [guests, setGuests] = useState(2)

  const handleSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (city) params.set('city', city)
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    params.set('guests', String(guests))
    navigate(`/hotels?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-light rounded-4 p-3 p-md-4 shadow-lg animate-fade-up animate-delay-2"
    >
      <Row className="g-3 align-items-end">
        <Col md={6} lg={3}>
          <Form.Label className="small fw-semibold text-secondary mb-1">
            Location
          </Form.Label>
          <Form.Select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-3"
          >
            {locations.map((o) => (
              <option key={o.value || 'any'} value={o.value}>
                {o.label}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={6} md={6} lg={2}>
          <Form.Label className="small fw-semibold text-secondary mb-1">
            Check-in
          </Form.Label>
          <Form.Control
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => setCheckIn(e.target.value)}
            className="rounded-3"
            required
          />
        </Col>
        <Col xs={6} md={6} lg={2}>
          <Form.Label className="small fw-semibold text-secondary mb-1">
            Check-out
          </Form.Label>
          <Form.Control
            type="date"
            value={checkOut}
            min={checkIn || today}
            onChange={(e) => setCheckOut(e.target.value)}
            className="rounded-3"
            required
          />
        </Col>
        <Col md={6} lg={2}>
          <Form.Label className="small fw-semibold text-secondary mb-1">
            Guests
          </Form.Label>
          <Form.Control
            type="number"
            min={1}
            max={12}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value) || 1)}
            className="rounded-3"
          />
        </Col>
        <Col md={6} lg={3}>
          <Button
            type="submit"
            className="w-100 rounded-3 py-2 fw-semibold gradient-bg border-0"
            size="lg"
          >
            Search
          </Button>
        </Col>
      </Row>
    </form>
  )
}

import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Row,
  Col,
  Card,
  Modal,
  Button,
  Form,
  Alert,
  Container,
} from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { useBooking } from '../context/BookingContext'
import { fetchHotelById } from '../services/api'

export default function Booking() {
  const location = useLocation()
  const { user } = useAuth()
  const { addBooking } = useBooking()
  const initial = location.state || {}

  const [hotel, setHotel] = useState(null)
  const [loadErr, setLoadErr] = useState(null)
  const [loadingHotel, setLoadingHotel] = useState(true)
  const [showPay, setShowPay] = useState(false)
  const [pending, setPending] = useState(null)
  const [card, setCard] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const [fullName, setFullName] = useState(user?.name || '')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [formErr, setFormErr] = useState('')

  useEffect(() => {
    setFullName(user?.name || '')
  }, [user])

  useEffect(() => {
    let cancelled = false
    if (!initial.hotelId) return
    setLoadingHotel(true)
    ;(async () => {
      try {
        const h = await fetchHotelById(initial.hotelId)
        if (!cancelled) {
          setHotel(h)
          setLoadErr(h ? null : 'Hotel not found')
        }
      } catch {
        if (!cancelled) setLoadErr('Could not load hotel')
      } finally {
        if (!cancelled) setLoadingHotel(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [initial.hotelId])

  if (!initial.hotelId) {
    return (
      <Container className="py-5">
        <Alert variant="info">
          No hotel selected.{' '}
          <Link to="/hotels">Browse hotels</Link>
        </Alert>
      </Container>
    )
  }

  if (loadingHotel) {
    return (
      <Container className="py-5 text-center text-muted">
        Loading booking details…
      </Container>
    )
  }

  if (loadErr || !hotel) {
    return (
      <Container className="py-5">
        <Alert variant="warning">{loadErr || 'Unavailable'}</Alert>
      </Container>
    )
  }

  if (!initial.checkIn || !initial.checkOut || initial.totalPrice == null) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="mb-3">
          Dates are missing. Please choose check-in and check-out on the hotel
          page first.
        </Alert>
        <Button as={Link} to={`/hotels/${hotel.id}`} variant="primary">
          Back to hotel
        </Button>
      </Container>
    )
  }

  const roomType = initial.roomType || 'Standard Room'
  const {
    checkIn,
    checkOut,
    guests,
    nights,
    totalPrice,
  } = initial

  const handleConfirm = (e) => {
    e.preventDefault()
    setFormErr('')
    const name = fullName.trim()
    const tel = phone.replace(/\s/g, '')
    if (name.length < 2) {
      setFormErr('Please enter your full name.')
      return
    }
    if (tel.length < 8) {
      setFormErr('Please enter a valid phone number.')
      return
    }
    setPending({
      checkIn,
      checkOut,
      guests,
      nights,
      totalPrice,
      roomType,
      hotelId: hotel.id,
      hotelName: hotel.name,
      fullName: name,
      phone: tel,
      notes: notes.trim(),
    })
    setShowPay(true)
  }

  const handleFakePay = (e) => {
    e.preventDefault()
    if (card.replace(/\s/g, '').length < 12) return
    setSubmitting(true)
    setTimeout(() => {
      addBooking({
        userEmail: user.email,
        userName: user.name,
        guestName: pending.fullName,
        guestPhone: pending.phone,
        notes: pending.notes,
        hotelId: hotel.id,
        hotelName: hotel.name,
        city: hotel.city,
        roomType,
        checkIn: pending.checkIn,
        checkOut: pending.checkOut,
        guests: pending.guests,
        nights: pending.nights,
        totalPrice: pending.totalPrice,
        paymentMethod: 'fake_card',
        paymentStatus: 'paid',
      })
      setSubmitting(false)
      setShowPay(false)
      setDone(true)
    }, 800)
  }

  if (done) {
    return (
      <Container className="py-5">
        <Card className="text-center p-4 border-0 shadow-lg rounded-4 overflow-hidden">
          <Card.Body className="p-4">
            <h2 className="h4 text-success mb-2">Booking confirmed (demo)</h2>
            <p className="text-muted mb-4">
              Thank you, {user?.name}. Your reservation is saved in this browser.
            </p>
            <Button as={Link} to="/my-bookings" variant="primary" className="me-2 rounded-pill">
              My bookings
            </Button>
            <Button as={Link} to="/hotels" variant="outline-secondary" className="rounded-pill">
              Explore more
            </Button>
          </Card.Body>
        </Card>
      </Container>
    )
  }

  return (
    <Container className="py-4 py-lg-5">
      <h1 className="h2 fw-bold mb-2">Complete your booking</h1>
      <p className="text-muted mb-4">
        Review your stay and add guest details — then confirm with a fake payment.
      </p>

      <Row className="g-4">
        <Col lg={5}>
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
            <div className="img-zoom-wrap" style={{ height: 220 }}>
              <Card.Img
                src={hotel.image}
                alt=""
                className="w-100 h-100 object-fit-cover"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <Card.Body className="p-4">
              <h2 className="h5 fw-bold">{hotel.name}</h2>
              <p className="text-muted small mb-3">
                {hotel.city} · {roomType}
              </p>
              <ul className="list-unstyled small mb-0">
                <li className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted">Check-in</span>
                  <strong>{checkIn}</strong>
                </li>
                <li className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted">Check-out</span>
                  <strong>{checkOut}</strong>
                </li>
                <li className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted">Guests</span>
                  <strong>{guests}</strong>
                </li>
                <li className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted">Nights</span>
                  <strong>{nights}</strong>
                </li>
                <li className="d-flex justify-content-between pt-3">
                  <span className="fw-semibold">Total</span>
                  <span className="fs-4 fw-bold gradient-text">${totalPrice}</span>
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body className="p-4 p-md-5">
              <h2 className="h5 fw-bold mb-4">Guest details</h2>
              {formErr && <Alert variant="danger">{formErr}</Alert>}
              <Form onSubmit={handleConfirm}>
                <Form.Group className="mb-3">
                  <Form.Label>Full name</Form.Label>
                  <Form.Control
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="rounded-3"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control value={user?.email || ''} disabled className="rounded-3" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 000 0000"
                    className="rounded-3"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Special requests (optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Late check-in, dietary needs…"
                    className="rounded-3"
                  />
                </Form.Group>
                <Button
                  type="submit"
                  size="lg"
                  className="w-100 rounded-pill gradient-bg border-0 fw-semibold"
                >
                  Confirm booking
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showPay} onHide={() => !submitting && setShowPay(false)} centered contentClassName="border-0 rounded-4">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title>Fake payment</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFakePay}>
          <Modal.Body>
            <p className="small text-muted">
              Enter any card number with 12+ digits — nothing is sent to a real
              server.
            </p>
            {pending && (
              <p className="fw-bold fs-5 mb-3">
                Amount due: ${pending.totalPrice}
              </p>
            )}
            <Form.Group>
              <Form.Label>Card number (test)</Form.Label>
              <Form.Control
                value={card}
                onChange={(e) => setCard(e.target.value)}
                placeholder="4242 4242 4242 4242"
                autoComplete="off"
                className="rounded-3"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="outline-secondary" type="button" onClick={() => setShowPay(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="success" className="rounded-pill px-4" disabled={submitting}>
              {submitting ? 'Processing…' : 'Pay now'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

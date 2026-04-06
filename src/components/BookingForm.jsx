import { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import DateRangePicker from './DateRangePicker'

function nightsBetween(start, end) {
  const a = new Date(start)
  const b = new Date(end)
  const diff = (b - a) / (1000 * 60 * 60 * 24)
  return Math.max(0, Math.round(diff))
}

export default function BookingForm({
  hotel,
  roomType,
  roomPrice,
  onSubmit,
  submitting,
}) {
  const today = new Date().toISOString().slice(0, 10)
  const [checkIn, setCheckIn] = useState(today)
  const [checkOut, setCheckOut] = useState(() => {
    const t = new Date()
    t.setDate(t.getDate() + 2)
    return t.toISOString().slice(0, 10)
  })
  const [guests, setGuests] = useState(2)
  const [error, setError] = useState('')

  const nights = nightsBetween(checkIn, checkOut)
  const total = nights * (roomPrice || hotel.pricePerNight)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!checkIn || !checkOut) {
      setError('Please select valid dates.')
      return
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setError('Check-out must be after check-in.')
      return
    }
    onSubmit({
      checkIn,
      checkOut,
      guests: Number(guests),
      nights,
      totalPrice: total,
      roomType,
      roomPrice: roomPrice || hotel.pricePerNight,
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      {error && (
        <Alert variant="danger" className="py-2">
          {error}
        </Alert>
      )}
      <DateRangePicker
        checkIn={checkIn}
        checkOut={checkOut}
        onCheckIn={setCheckIn}
        onCheckOut={setCheckOut}
        minDate={today}
      />
      <Form.Group className="mt-3">
        <Form.Label>Guests</Form.Label>
        <Form.Control
          type="number"
          min={1}
          max={10}
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
        />
      </Form.Group>
      <div className="mt-3 p-3 bg-light rounded-3">
        <div className="d-flex justify-content-between">
          <span>Nights</span>
          <strong>{nights}</strong>
        </div>
        <div className="d-flex justify-content-between mt-2">
          <span>Estimated total</span>
          <strong className="text-primary">${total}</strong>
        </div>
      </div>
      <Button
        type="submit"
        variant="success"
        className="w-100 mt-3 rounded-pill"
        disabled={submitting}
      >
        {submitting ? 'Processing…' : 'Continue to payment'}
      </Button>
    </Form>
  )
}

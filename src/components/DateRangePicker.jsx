import { Form, Row, Col } from 'react-bootstrap'

export default function DateRangePicker({
  checkIn,
  checkOut,
  onCheckIn,
  onCheckOut,
  minDate,
}) {
  return (
    <Row className="g-2">
      <Col xs={12} sm={6}>
        <Form.Group>
          <Form.Label className="small">Check-in</Form.Label>
          <Form.Control
            type="date"
            value={checkIn}
            min={minDate}
            onChange={(e) => onCheckIn(e.target.value)}
            required
          />
        </Form.Group>
      </Col>
      <Col xs={12} sm={6}>
        <Form.Group>
          <Form.Label className="small">Check-out</Form.Label>
          <Form.Control
            type="date"
            value={checkOut}
            min={checkIn || minDate}
            onChange={(e) => onCheckOut(e.target.value)}
            required
          />
        </Form.Group>
      </Col>
    </Row>
  )
}

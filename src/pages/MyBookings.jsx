import { Table, Badge, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useBooking } from '../context/BookingContext'

export default function MyBookings() {
  const { user } = useAuth()
  const { getBookingsForUser } = useBooking()
  const list = getBookingsForUser(user?.email)

  if (!list.length) {
    return (
      <Container className="py-5 text-center">
        <p className="text-muted mb-3">You have no bookings yet.</p>
        <Link to="/hotels" className="fw-semibold">
          Browse hotels
        </Link>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <h1 className="h2 fw-bold mb-4">My bookings</h1>
      <div className="table-responsive rounded-4 border bg-white shadow-sm">
        <Table hover className="align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Hotel</th>
              <th>City</th>
              <th>Room</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Nights</th>
              <th>Total</th>
              <th>Guest</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((b) => (
              <tr key={b.id}>
                <td>{b.hotelName}</td>
                <td>{b.city}</td>
                <td>{b.roomType}</td>
                <td>{b.checkIn}</td>
                <td>{b.checkOut}</td>
                <td>{b.nights}</td>
                <td>${b.totalPrice}</td>
                <td className="small">{b.guestName || b.userName}</td>
                <td>
                  <Badge bg="success" className="rounded-pill">
                    {b.paymentStatus}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  )
}

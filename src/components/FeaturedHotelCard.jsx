import { Card, Badge, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function FeaturedHotelCard({ hotel }) {
  return (
    <Card className="h-100 border-0 shadow card-lift overflow-hidden">
      <div className="img-zoom-wrap" style={{ height: 220 }}>
        <Card.Img
          src={hotel.image}
          alt={hotel.name}
          className="w-100 h-100"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <Card.Body className="d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <Card.Title as="h3" className="h5 mb-0">
            {hotel.name}
          </Card.Title>
          <Badge bg="warning" text="dark" className="flex-shrink-0 rounded-pill">
            ★ {hotel.rating}
          </Badge>
        </div>
        <Card.Text className="text-muted small mb-3">
          {hotel.city}, {hotel.country}
        </Card.Text>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="fw-bold fs-5 gradient-text">
            ${hotel.pricePerNight}
            <span className="fs-6 text-muted fw-normal"> / night</span>
          </span>
          <Button
            as={Link}
            to={`/hotels/${hotel.id}`}
            variant="primary"
            className="rounded-pill px-4"
          >
            View Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

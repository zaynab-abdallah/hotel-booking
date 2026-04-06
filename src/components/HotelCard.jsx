import { Card, Badge, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'

export default function HotelCard({ hotel }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const fav = isFavorite(hotel.id)

  return (
    <Card className="h-100 border-0 shadow card-lift overflow-hidden">
      <div className="position-relative img-zoom-wrap" style={{ height: 260 }}>
        <Card.Img
          src={hotel.image}
          alt={hotel.name}
          className="w-100 h-100"
          style={{ objectFit: 'cover' }}
        />
        <Button
          type="button"
          variant={fav ? 'danger' : 'light'}
          size="sm"
          className="position-absolute top-0 end-0 m-3 rounded-circle shadow"
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          onClick={() => toggleFavorite(hotel.id)}
        >
          {fav ? '♥' : '♡'}
        </Button>
        {hotel.hotelType && (
          <Badge
            bg="dark"
            className="position-absolute bottom-0 start-0 m-3 opacity-90"
          >
            {hotel.hotelType}
          </Badge>
        )}
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
        <Card.Text className="text-muted small mb-2">
          📍 {hotel.city}, {hotel.country}
        </Card.Text>
        <Card.Text className="flex-grow-1 small text-secondary">
          {hotel.description.slice(0, 120)}
          {hotel.description.length > 120 ? '…' : ''}
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
          <div>
            <span className="fw-bold fs-5 gradient-text">${hotel.pricePerNight}</span>
            <span className="text-muted small"> / night</span>
          </div>
          <Button
            as={Link}
            to={`/hotels/${hotel.id}`}
            variant="primary"
            className="rounded-pill px-4"
          >
            Book now
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

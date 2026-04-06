import { Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export default function DestinationCard({ name, image, count }) {
  const navigate = useNavigate()

  return (
    <Card
      role="button"
      tabIndex={0}
      className="border-0 shadow card-lift overflow-hidden h-100"
      onClick={() => navigate(`/hotels?city=${encodeURIComponent(name)}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          navigate(`/hotels?city=${encodeURIComponent(name)}`)
        }
      }}
    >
      <div className="img-zoom-wrap" style={{ height: 200 }}>
        <Card.Img
          src={image}
          alt={name}
          className="w-100 h-100"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <Card.Body className="p-3">
        <Card.Title as="h3" className="h5 mb-1">
          {name}
        </Card.Title>
        <Card.Text className="text-muted small mb-0">
          {count} {count === 1 ? 'property' : 'properties'}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

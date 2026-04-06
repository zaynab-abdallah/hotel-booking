import { Form } from 'react-bootstrap'

export default function HotelFilters({
  minPrice,
  maxPrice,
  minRating,
  hotelType,
  onMinPrice,
  onMaxPrice,
  onMinRating,
  onHotelType,
}) {
  return (
    <div className="d-flex flex-column gap-3">
      <div>
        <Form.Label className="small fw-semibold text-secondary mb-1">
          Price range ($ / night)
        </Form.Label>
        <div className="d-flex gap-2 align-items-center">
          <Form.Control
            type="number"
            min={0}
            placeholder="Min"
            value={minPrice || ''}
            onChange={(e) => onMinPrice(Number(e.target.value) || 0)}
          />
          <span className="text-muted">—</span>
          <Form.Control
            type="number"
            min={0}
            placeholder="Max"
            value={maxPrice || ''}
            onChange={(e) => onMaxPrice(Number(e.target.value) || 9999)}
          />
        </div>
      </div>
      <Form.Group>
        <Form.Label className="small fw-semibold text-secondary mb-1">
          Minimum rating
        </Form.Label>
        <Form.Select
          value={minRating}
          onChange={(e) => onMinRating(Number(e.target.value))}
        >
          <option value={0}>Any rating</option>
          <option value={3}>3+ stars</option>
          <option value={4}>4+ stars</option>
          <option value={4.5}>4.5+ stars</option>
        </Form.Select>
      </Form.Group>
      <Form.Group>
        <Form.Label className="small fw-semibold text-secondary mb-1">
          Hotel type
        </Form.Label>
        <Form.Select
          value={hotelType}
          onChange={(e) => onHotelType(e.target.value)}
        >
          <option value="">All types</option>
          <option value="Resort">Resort</option>
          <option value="Business">Business</option>
          <option value="Boutique">Boutique</option>
          <option value="Luxury">Luxury</option>
        </Form.Select>
      </Form.Group>
    </div>
  )
}

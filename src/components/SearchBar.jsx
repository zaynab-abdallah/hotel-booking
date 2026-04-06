import { Form, InputGroup } from 'react-bootstrap'

const cities = [
  { value: '', label: 'All cities' },
  { value: 'Cairo', label: 'Cairo' },
  { value: 'Sharm El Sheikh', label: 'Sharm El Sheikh' },
  { value: 'Dubai', label: 'Dubai' },
  { value: 'Istanbul', label: 'Istanbul' },
  { value: 'Marrakech', label: 'Marrakech' },
]

export default function SearchBar({ city, onCityChange, query, onQueryChange }) {
  return (
    <div className="d-flex flex-column gap-3">
      <Form.Group>
        <Form.Label className="small fw-semibold text-secondary mb-1">
          Smart search
        </Form.Label>
        <InputGroup>
          <InputGroup.Text className="bg-white border-end-0">🔍</InputGroup.Text>
          <Form.Control
            type="search"
            placeholder="Hotel name, city, or amenity…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="border-start-0"
            aria-label="Search hotels"
          />
        </InputGroup>
      </Form.Group>
      <Form.Group>
        <Form.Label className="small fw-semibold text-secondary mb-1">
          City
        </Form.Label>
        <Form.Select
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          aria-label="Filter by city"
        >
          {cities.map((c) => (
            <option key={c.value || 'all'} value={c.value}>
              {c.label}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </div>
  )
}

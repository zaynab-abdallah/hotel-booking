import { useEffect, useMemo, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { fetchHotels } from '../services/api'
import HeroSearch from '../components/HeroSearch'
import DestinationCard from '../components/DestinationCard'
import FeaturedHotelCard from '../components/FeaturedHotelCard'

const HERO_BG =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80'

const cityImages = {
  Cairo:
    'https://images.unsplash.com/photo-1572252009286-268b7aa4d14e?w=800&q=80',
  'Sharm El Sheikh':
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
  Dubai:
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
  Istanbul:
    'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
  Marrakech:
    'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80',
}

export default function Home() {
  const [hotels, setHotels] = useState([])

  useEffect(() => {
    fetchHotels().then(setHotels).catch(() => {})
  }, [])

  const destinations = useMemo(() => {
    const map = new Map()
    hotels.forEach((h) => {
      const prev = map.get(h.city) || { count: 0, image: cityImages[h.city] }
      map.set(h.city, {
        count: prev.count + 1,
        image: cityImages[h.city] || h.image,
      })
    })
    return [...map.entries()]
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [hotels])

  const featured = useMemo(() => hotels.slice(0, 3), [hotels])

  const features = [
    {
      icon: '🛡️',
      title: 'Secure Booking',
      text: 'Encrypted session and safe checkout flow (demo).',
    },
    {
      icon: '💰',
      title: 'Best Prices',
      text: 'Compare nightly rates and pick what fits your budget.',
    },
    {
      icon: '⚡',
      title: 'Fast Search',
      text: 'Filter by city, price, rating, and hotel type in seconds.',
    },
    {
      icon: '📞',
      title: '24/7 Support',
      text: 'Our team is here around the clock (demo messaging).',
    },
  ]

  return (
    <>
      <section className="hero-section">
        <div
          className="hero-bg"
          style={{ backgroundImage: `url(${HERO_BG})` }}
          aria-hidden
        />
        <div className="hero-overlay" />
        <div className="hero-content px-3">
          <h1 className="display-4 fw-bold text-white text-center mb-2 animate-fade-up">
            Find your perfect stay, anywhere{' '}
            <span className="d-inline-block" aria-hidden>
              🌍
            </span>
          </h1>
          <p className="lead text-white-50 text-center mb-4 mx-auto animate-fade-up animate-delay-1" style={{ maxWidth: 560 }}>
            Search destinations, compare top-rated hotels, and book with a
            polished, glass-style experience.
          </p>
          <HeroSearch />
        </div>
      </section>

      <section className="section-soft py-5">
        <Container>
          <h2 className="h3 fw-bold text-center mb-2 animate-fade-up">
            Popular destinations
          </h2>
          <p className="text-center text-muted mb-5 mx-auto" style={{ maxWidth: 520 }}>
            Explore cities with hand-picked stays — hover cards for a subtle zoom.
          </p>
          <Row className="g-4">
            {destinations.map((d, i) => (
              <Col key={d.name} md={6} lg={4} className="animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <DestinationCard
                  name={d.name}
                  image={d.image}
                  count={d.count}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <h2 className="h3 fw-bold text-center mb-2">Featured hotels</h2>
          <p className="text-center text-muted mb-5">
            Curated picks with ratings, nightly prices, and quick details.
          </p>
          <Row className="g-4">
            {featured.map((h, i) => (
              <Col key={h.id} md={6} lg={4}>
                <div className="animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <FeaturedHotelCard hotel={h} />
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section-deep py-5">
        <Container>
          <h2 className="h3 fw-bold text-center mb-5">Why choose us</h2>
          <Row className="g-4">
            {features.map((f, i) => (
              <Col key={f.title} md={6} lg={3}>
                <div
                  className="p-4 h-100 rounded-4 bg-white shadow-sm border-0 card-lift animate-fade-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="fs-2 mb-2">{f.icon}</div>
                  <h3 className="h5 mb-2">{f.title}</h3>
                  <p className="text-muted small mb-0">{f.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  )
}

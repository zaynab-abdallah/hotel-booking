import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const social = [
  { href: 'https://twitter.com', label: 'X', icon: '𝕏' },
  { href: 'https://facebook.com', label: 'Facebook', icon: 'f' },
  { href: 'https://instagram.com', label: 'Instagram', icon: '◎' },
]

export default function SiteFooter() {
  return (
    <footer className="site-footer py-5 mt-5">
      <Container>
        <Row className="g-4">
          <Col md={4}>
            <h3 className="h5 text-white mb-3">StayBook</h3>
            <p className="small mb-0">
              Find your perfect stay anywhere. Demo app with search, filters, and
              secure booking flow.
            </p>
          </Col>
          <Col md={4}>
            <h4 className="h6 text-white mb-3">Explore</h4>
            <ul className="list-unstyled small mb-0">
              <li className="mb-2">
                <Link to="/">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/hotels">Hotels</Link>
              </li>
              <li className="mb-2">
                <Link to="/login">Sign in</Link>
              </li>
              <li>
                <Link to="/register">Create account</Link>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h4 className="h6 text-white mb-3">Follow</h4>
            <div className="d-flex gap-3">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-inline-flex align-items-center justify-content-center rounded-circle border border-secondary text-decoration-none"
                  style={{ width: 40, height: 40 }}
                  aria-label={s.label}
                >
                  <span className="small fw-bold">{s.icon}</span>
                </a>
              ))}
            </div>
          </Col>
        </Row>
        <hr className="border-secondary opacity-25 my-4" />
        <p className="text-center small mb-0">
          © {new Date().getFullYear()} StayBook. Demo data only.
        </p>
      </Container>
    </footer>
  )
}

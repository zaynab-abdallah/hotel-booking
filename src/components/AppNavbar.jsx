import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const linkClass = ({ isActive }) =>
  isActive ? 'nav-link active fw-semibold text-white' : 'nav-link text-white-50'

export default function AppNavbar() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <Navbar
      variant="dark"
      expand="md"
      sticky="top"
      className="navbar-surface py-2 mb-0"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          🏨 StayBook
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <NavLink to="/" end className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/hotels" className={linkClass}>
              Hotels
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/my-bookings" className={linkClass}>
                My bookings
              </NavLink>
            )}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <>
                <Navbar.Text className="me-3 text-white-50 d-none d-sm-inline">
                  Hi, {user?.name}
                </Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={logout}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>
                  Sign in
                </NavLink>
                <NavLink to="/register" className={linkClass}>
                  Register
                </NavLink>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      navigate(location.state?.from || { pathname: '/' }, { replace: true })
    }
  }, [isAuthenticated, location.state, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 4) {
      setError('Password must be at least 4 characters.')
      return
    }
    const res = register(name.trim(), email.trim(), password)
    if (!res.ok) setError(res.error)
    else navigate(location.state?.from || { pathname: '/' }, { replace: true })
  }

  return (
    <div className="auth-page">
      <div className="mx-auto w-100" style={{ maxWidth: 420 }}>
        <Card className="auth-card shadow-lg">
          <Card.Body className="p-4 p-md-5">
            <h1 className="h4 mb-4">Create account</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Full name</Form.Label>
                <Form.Control
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </Form.Group>
              <Button
                type="submit"
                className="w-100 rounded-pill py-2 fw-semibold gradient-bg border-0"
              >
                Register
              </Button>
            </Form>
            <p className="text-center mt-4 mb-0 small" style={{ color: '#94a3b8' }}>
              Already have an account?{' '}
              <Link to="/login" state={location.state} className="text-white fw-semibold">
                Sign in
              </Link>
            </p>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

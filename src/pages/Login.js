import { useState, useContext } from 'react';
import { Notyf } from 'notyf';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { Container, Form, Button, Card, FloatingLabel, Spinner } from 'react-bootstrap';

const notyf = new Notyf();

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setToken(data.token);
        notyf.success('Login successful');
        navigate('/');
      } else {
        notyf.error(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      notyf.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="shadow-sm border-0" style={{ width: '100%', maxWidth: '450px' }}>
        <Card.Body className="p-4 p-md-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-3" style={{ color: '#3a0ca3' }}>Welcome Back</h2>
            <p className="text-muted">Sign in to access your account</p>
          </div>

          <Form onSubmit={handleLogin}>
            <FloatingLabel controlId="email" label="   Email address" className="mb-3">
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-2"
              />
              <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
                <FiMail className="text-muted" />
              </div>
            </FloatingLabel>

            <FloatingLabel controlId="password" label="    Password" className="mb-4">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-2"
              />
              <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
                <FiLock className="text-muted" />
              </div>
            </FloatingLabel>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <Form.Check 
                type="checkbox" 
                id="remember-me" 
                label="Remember me" 
                className="text-muted small"
              />
              <Link  className="text-decoration-none small" style={{ color: '#3a0ca3' }}>
                Forgot password?
              </Link>
            </div>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 py-2 fw-bold" 
              disabled={isLoading}
              style={{ backgroundColor: '#3a0ca3', borderColor: '#3a0ca3' }}
            >
              {isLoading ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              ) : (
                <>
                  <FiLogIn className="me-2" /> Sign In
                </>
              )}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <p className="text-muted small mb-0">
              Don't have an account?{' '}
              <Link to="/register" className="text-decoration-none fw-bold" style={{ color: '#3a0ca3' }}>
                Sign up
              </Link>
            </p>
          </div>



        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
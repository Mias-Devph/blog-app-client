import { useState } from 'react';
import { Notyf } from 'notyf';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEdit2, FiArrowRight } from 'react-icons/fi';
import { Container, Form, Button, Card, FloatingLabel, Spinner, Row, Col } from 'react-bootstrap';

const notyf = new Notyf();

const Register = () => {
const [formData, setFormData] = useState({ 
  username: '', 
  email: '', 
  password: '', 
  confirmPassword: '',
  firstName: '', 
  lastName: '' 
});

  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Calculate password strength
    if (name === 'password') {
      let strength = 0;
      if (value.length > 5) strength += 1;
      if (value.length > 8) strength += 1;
      if (/[A-Z]/.test(value)) strength += 1;
      if (/[0-9]/.test(value)) strength += 1;
      if (/[^A-Za-z0-9]/.test(value)) strength += 1;
      setPasswordStrength(strength);
    }
  };

  const handleRegister = async (e) => {
      e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    notyf.error('Passwords do not match.');
    return;
  }

  setIsLoading(true);
    
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if (res.ok) {
        notyf.success('Registration successful! Welcome aboard!');
        navigate('/login');
      } else {
        notyf.error(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      notyf.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-secondary';
    if (passwordStrength <= 2) return 'bg-danger';
    if (passwordStrength <= 4) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="shadow-sm border-0" style={{ width: '100%', maxWidth: '500px' }}>
        <Card.Body className="p-4 p-md-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-3" style={{ color: '#3a0ca3' }}>Create Your Account</h2>
            <p className="text-muted">Join our community today</p>
          </div>

          <Form onSubmit={handleRegister}>
            <Row>
              <Col md={6}>
                <FloatingLabel controlId="firstName" label="First Name" className="mb-3">
                  <Form.Control
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="border-2"
                  />
                  <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
                    <FiUser className="text-muted" />
                  </div>
                </FloatingLabel>
              </Col>
              <Col md={6}>
                <FloatingLabel controlId="lastName" label="Last Name" className="mb-3">
                  <Form.Control
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="border-2"
                  />
                </FloatingLabel>
              </Col>
            </Row>

            <FloatingLabel controlId="username" label="Username" className="mb-3">
              <Form.Control
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="border-2"
              />
              <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
                <FiEdit2 className="text-muted" />
              </div>
            </FloatingLabel>

            <FloatingLabel controlId="email" label="Email address" className="mb-3">
              <Form.Control
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="border-2"
              />
              <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
                <FiMail className="text-muted" />
              </div>
            </FloatingLabel>

            <FloatingLabel controlId="password" label="Password" className="mb-3">
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="border-2"
              />
              <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
                <FiLock className="text-muted" />
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="progress" style={{ height: '4px' }}>
                    <div 
                      className={`progress-bar ${getPasswordStrengthColor()}`} 
                      role="progressbar" 
                      style={{ width: `${passwordStrength * 20}%` }}
                    ></div>
                  </div>
                  <small className={`text-${passwordStrength <= 2 ? 'danger' : passwordStrength <= 4 ? 'warning' : 'success'}`}>
                    {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 4 ? 'Moderate' : 'Strong'} password
                  </small>
                </div>
              )}
            </FloatingLabel>

          <FloatingLabel controlId="confirmPassword" label="Confirm Password" className="mb-3">
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="border-2"
            />
            <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
              <FiLock className="text-muted" />
            </div>
          </FloatingLabel>


            <Form.Group className="mb-4">
              <Form.Check 
                type="checkbox" 
                id="terms" 
                label={
                  <small className="text-muted">
                    I agree to the <Link  className="text-decoration-none" style={{ color: '#3a0ca3' }}>Terms of Service</Link> and <Link  className="text-decoration-none" style={{ color: '#3a0ca3' }}>Privacy Policy</Link>
                  </small>
                } 
                required
              />
            </Form.Group>

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
                  Create Account <FiArrowRight className="ms-2" />
                </>
              )}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <p className="text-muted small mb-0">
              Already have an account?{' '}
              <Link to="/login" className="text-decoration-none fw-bold" style={{ color: '#3a0ca3' }}>
                Sign in
              </Link>
            </p>
          </div>

          
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
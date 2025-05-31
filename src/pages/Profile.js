import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { Container, Row, Col, Form, Button, Card, Image, Tab, Nav } from 'react-bootstrap';
import { FiUser, FiLink, FiMapPin, FiAward, FiSave } from 'react-icons/fi';
import { FaTwitter, FaGithub, FaLinkedin, FaFacebook } from 'react-icons/fa';

const notyf = new Notyf();

const ProfilePage = () => {
  const { user, token, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    avatar: '',
    location: '',
    socialLinks: {
      twitter: '',
      github: '',
      linkedin: '',
      facebook: ''
    },
    interests: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        location: user.location || '',
        socialLinks: user.socialLinks || {},
        interests: (user.interests || []).join(', ')
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('socialLinks.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [key]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean)
    };

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        notyf.success('Profile updated successfully');
        setUser(data.user);
      } else {
        notyf.error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      notyf.error('Error updating profile');
    }
  };

  if (!user) return <p className="text-center mt-5">Loading profile...</p>;

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white border-bottom-0 py-4">
              <Row className="align-items-center">
                <Col xs="auto">
                  <div className="avatar-container position-relative">
                    <Image 
                      src={formData.avatar || 'https://via.placeholder.com/150'} 
                      roundedCircle 
                      width={120} 
                      height={120} 
                      className="border border-3 border-primary"
                    />
                    <Button 
                      variant="light" 
                      size="sm" 
                      className="position-absolute bottom-0 end-0 rounded-circle p-2"
                      onClick={() => document.getElementById('avatar').click()}
                    >
                      <FiUser size={16} />
                    </Button>
                  </div>
                </Col>
                <Col>
                  <h2 className="mb-1">{formData.firstName} {formData.lastName}</h2>
                  <p className="text-muted mb-2">
                    <FiMapPin className="me-1" size={14} />
                    {formData.location || 'Not specified'}
                  </p>
                  <div className="d-flex gap-2">
                    {formData.socialLinks?.twitter && (
                      <a href={formData.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <FaTwitter className="text-primary" size={20} />
                      </a>
                    )}
                    {formData.socialLinks?.github && (
                      <a href={formData.socialLinks.github} target="_blank" rel="noopener noreferrer">
                        <FaGithub className="text-dark" size={20} />
                      </a>
                    )}
                    {formData.socialLinks?.linkedin && (
                      <a href={formData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <FaLinkedin className="text-primary" size={20} />
                      </a>
                    )}
                    {formData.socialLinks?.facebook && (
                      <a href={formData.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                        <FaFacebook className="text-primary" size={20} />
                      </a>
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Header>
            
            <Card.Body>
              <Tab.Container defaultActiveKey="profile">
                <Row>
                  <Col md={3}>
                    <Nav variant="pills" className="flex-column">
                      <Nav.Item>
                        <Nav.Link eventKey="profile" className="d-flex align-items-center gap-2">
                          <FiUser size={16} /> Personal Info
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="social" className="d-flex align-items-center gap-2">
                          <FiLink size={16} /> Social Links
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="interests" className="d-flex align-items-center gap-2">
                          <FiAward size={16} /> Interests
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>
                  <Col md={9}>
                    <Tab.Content>
                      <Tab.Pane eventKey="profile">
                        <Form onSubmit={handleSubmit}>
                          <Row>
                            <Col md={6}>
                              <Form.Group controlId="firstName" className="mb-3">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control 
                                  type="text" 
                                  name="firstName" 
                                  value={formData.firstName} 
                                  onChange={handleChange} 
                                  placeholder="Enter your first name"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group controlId="lastName" className="mb-3">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control 
                                  type="text" 
                                  name="lastName" 
                                  value={formData.lastName} 
                                  onChange={handleChange} 
                                  placeholder="Enter your last name"
                                />
                              </Form.Group>
                            </Col>
                          </Row>

                          <Form.Group controlId="bio" className="mb-3">
                            <Form.Label>Bio</Form.Label>
                            <Form.Control 
                              as="textarea" 
                              name="bio" 
                              rows={4} 
                              value={formData.bio} 
                              onChange={handleChange} 
                              placeholder="Tell us about yourself..."
                            />
                          </Form.Group>

                          <Form.Group controlId="avatar" className="mb-3">
                            <Form.Label>Avatar URL</Form.Label>
                            <Form.Control 
                              type="text" 
                              id="avatar"
                              name="avatar" 
                              value={formData.avatar} 
                              onChange={handleChange} 
                              placeholder="Paste your profile image URL"
                            />
                          </Form.Group>

                          <Form.Group controlId="location" className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control 
                              type="text" 
                              name="location" 
                              value={formData.location} 
                              onChange={handleChange} 
                              placeholder="Where are you based?"
                            />
                          </Form.Group>
                        </Form>
                      </Tab.Pane>

                      <Tab.Pane eventKey="social">
                        <Form onSubmit={handleSubmit}>
                          {['twitter', 'github', 'linkedin', 'facebook'].map((platform) => (
                            <Form.Group key={platform} className="mb-3">
                              <Form.Label className="text-capitalize d-flex align-items-center gap-2">
                                {platform === 'twitter' && <FaTwitter className="text-primary" />}
                                {platform === 'github' && <FaGithub />}
                                {platform === 'linkedin' && <FaLinkedin className="text-primary" />}
                                {platform === 'facebook' && <FaFacebook className="text-primary" />}
                                {platform}
                              </Form.Label>
                              <Form.Control
                                type="url"
                                name={`socialLinks.${platform}`}
                                value={formData.socialLinks?.[platform] || ''}
                                onChange={handleChange}
                                placeholder={`https://${platform}.com/yourusername`}
                              />
                            </Form.Group>
                          ))}
                        </Form>
                      </Tab.Pane>

                      <Tab.Pane eventKey="interests">
                        <Form onSubmit={handleSubmit}>
                          <Form.Group controlId="interests" className="mb-3">
                            <Form.Label>Interests</Form.Label>
                            <Form.Control 
                              as="textarea"
                              name="interests" 
                              value={formData.interests} 
                              onChange={handleChange} 
                              placeholder="Enter your interests separated by commas (e.g., programming, design, photography)"
                              rows={4}
                            />
                            <Form.Text className="text-muted">
                              Separate multiple interests with commas
                            </Form.Text>
                          </Form.Group>
                        </Form>
                      </Tab.Pane>
                    </Tab.Content>

                    <div className="d-flex justify-content-end mt-4 border-top pt-3">
                      <Button type="submit" variant="primary" onClick={handleSubmit} className="d-flex align-items-center gap-2">
                        <FiSave size={18} /> Save Changes
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
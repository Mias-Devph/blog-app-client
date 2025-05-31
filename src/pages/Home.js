import React from 'react';
import { Container, Row, Col, Card, Button, Navbar, Nav, Form, InputGroup, Badge } from 'react-bootstrap';
import { FiSearch, FiBookmark, FiShare2, FiUser, FiCalendar, FiHome, FiCoffee, FiHeart, FiSun } from 'react-icons/fi';
import { FaInstagram, FaPinterest } from 'react-icons/fa';

const DailyLifeBlog = () => {
  // Sample blog post data
  const featuredPost = {
    id: 1,
    title: "Finding Joy in Everyday Moments",
    excerpt: "How cultivating mindfulness can transform ordinary days into extraordinary experiences.",
    author: "Emma Wilson",
    date: "May 20, 2024",
    category: "Mindfulness",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  };

  const recentPosts = [
    {
      id: 2,
      title: "10 Simple Morning Routines to Start Your Day Right",
      excerpt: "Easy habits to incorporate into your mornings for a more productive and peaceful day.",
      author: "James Carter",
      date: "May 18, 2024",
      category: "Routines",
      readTime: "7 min read",
      image: "https://vikasa.com/wp-content/uploads/2024/08/RAW09580-1024x631.jpg"
    },
    {
      id: 3,
      title: "The Art of Homemaking: Creating Comfort",
      excerpt: "Transform your living space into a sanctuary with these thoughtful touches.",
      author: "Sophia Rodriguez",
      date: "May 15, 2024",
      category: "Home",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 4,
      title: "Weekend Rituals That Actually Refresh You",
      excerpt: "Move beyond binge-watching with these rejuvenating weekend activities.",
      author: "Michael Chen",
      date: "May 12, 2024",
      category: "Self-Care",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 5,
      title: "Cooking for One: Making Solo Meals Special",
      excerpt: "Turn cooking for yourself from a chore into a cherished daily ritual.",
      author: "Olivia Park",
      date: "May 10, 2024",
      category: "Cooking",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    }
  ];

  const popularCategories = [
    { name: "Home & Living", icon: <FiHome />, count: 28 },
    { name: "Daily Routines", icon: <FiSun />, count: 22 },
    { name: "Relationships", icon: <FiHeart />, count: 18 },
    { name: "Simple Pleasures", icon: <FiCoffee />, count: 15 },
    { name: "Mindfulness", icon: <FiHeart />, count: 12 }
  ];

  return (
    <div className="bg-light">
      

      {/* Hero Section */}
      <section className="py-5 bg-white">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-5 fw-bold mb-4" style={{ color: '#5A3921' }}>Celebrating Life's Simple Joys</h1>
              <p className="lead text-muted mb-4">
                Inspiration for creating meaning in your everyday moments - from morning coffee to evening wind-downs.
              </p>
              <div className="d-flex gap-3">
                <Button variant="primary" size="lg" style={{ backgroundColor: '#8B5A2B', borderColor: '#8B5A2B' }}>Read Journal</Button>
                <Button variant="outline-secondary" size="lg">Browse Topics</Button>
              </div>
            </Col>
            <Col lg={6} className="d-none d-lg-block">
              <img 
                src="https://img.freepik.com/free-photo/3d-cartoon-coffee-cup_23-2151751969.jpg?semt=ais_hybrid&w=740" 
                alt="Cozy home scene" 
                className="img-fluid rounded shadow"
                style={{ border: '8px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Post */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="h4 text-uppercase text-muted mb-4">Featured Story</h2>
          <Card className="border-0 shadow-sm overflow-hidden">
            <Row className="g-0">
              <Col md={6}>
                <Card.Img 
                  src={featuredPost.image} 
                  alt={featuredPost.title} 
                  style={{ height: '100%', objectFit: 'cover' }}
                />
              </Col>
              <Col md={6}>
                <Card.Body className="p-4 p-lg-5 bg-white">
                  <Badge bg="light" text="dark" className="mb-3 d-flex align-items-center gap-1">
                    <FiHeart size={14} /> {featuredPost.category}
                  </Badge>
                  <Card.Title as="h2" className="mb-3" style={{ color: '#5A3921' }}>{featuredPost.title}</Card.Title>
                  <Card.Text className="text-muted mb-4">{featuredPost.excerpt}</Card.Text>
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-light rounded-circle p-2 me-3">
                      <FiUser size={20} />
                    </div>
                    <div>
                      <p className="mb-0 fw-bold">{featuredPost.author}</p>
                      <small className="text-muted d-flex align-items-center">
                        <FiCalendar className="me-1" size={14} />
                        {featuredPost.date} · {featuredPost.readTime}
                      </small>
                    </div>
                  </div>
                  <div className="d-flex gap-3">
                    <Button variant="primary" style={{ backgroundColor: '#8B5A2B', borderColor: '#8B5A2B' }}>Read Story</Button>
                    <Button variant="outline-secondary">
                      <FiBookmark className="me-1" /> Save
                    </Button>
                  </div>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Container>
      </section>

      {/* Recent Posts */}
      <section className="py-5 bg-white">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h2 className="h4 text-uppercase text-muted mb-0">Latest Stories</h2>
            <Button variant="outline-primary" style={{ color: '#8B5A2B', borderColor: '#8B5A2B' }}>View All</Button>
          </div>
          <Row>
            {recentPosts.map(post => (
              <Col key={post.id} md={6} lg={3} className="mb-4">
                <Card className="h-100 border-0 shadow-sm overflow-hidden">
                  <Card.Img variant="top" src={post.image} style={{ height: '180px', objectFit: 'cover' }} />
                  <Card.Body>
                    <Badge bg="light" text="dark" className="mb-3">{post.category}</Badge>
                    <Card.Title as="h3" className="h5 mb-3" style={{ color: '#5A3921' }}>{post.title}</Card.Title>
                    <Card.Text className="text-muted small mb-4">{post.excerpt}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted d-flex align-items-center">
                        <FiCalendar className="me-1" size={12} />
                        {post.date}
                      </small>
                      <small className="text-muted">{post.readTime}</small>
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-white border-0">
                    <Button variant="link" size="sm" className="text-decoration-none ps-0" style={{ color: '#8B5A2B' }}>
                      Read more →
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Categories & Newsletter */}
      <section className="py-5 bg-light">
        <Container>
          <Row>
            <Col lg={4} className="mb-5 mb-lg-0">
              <h2 className="h4 text-uppercase text-muted mb-4">Daily Life Categories</h2>
              <div className="list-group">
                {popularCategories.map((category, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center border-0 py-3 px-0 bg-transparent"
                  >
                    <span className="d-flex align-items-center gap-2">
                      {category.icon} {category.name}
                    </span>
                    <Badge bg="light" text="dark" pill>{category.count}</Badge>
                  </a>
                ))}
              </div>
            </Col>
            <Col lg={8}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-4 p-lg-5 d-flex flex-column justify-content-center">
                  <h2 className="h4 mb-4" style={{ color: '#5A3921' }}>Join Our Community</h2>
                  <p className="text-muted mb-4">
                    Get weekly inspiration for living your best daily life. Receive our "Moment of Joy" newsletter every Sunday.
                  </p>
                  <Form>
                    <Row>
                      <Col md={8} className="mb-3 mb-md-0">
                        <Form.Control type="email" placeholder="Your email address" />
                      </Col>
                      <Col md={4}>
                        <Button 
                          variant="primary" 
                          type="submit" 
                          className="w-100"
                          style={{ backgroundColor: '#8B5A2B', borderColor: '#8B5A2B' }}
                        >
                          Subscribe
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Instagram Feed Preview */}
      <section className="py-5 bg-white">
        <Container>
          <h2 className="h4 text-center mb-4" style={{ color: '#5A3921' }}>Follow Along on Instagram</h2>
          <p className="text-center text-muted mb-5">Daily snippets from our community</p>
          <Row className="g-3">
            {[1, 2, 3, 4, 5, 6].map(item => (
              <Col key={item} xs={4} md={2}>
                <div className="ratio ratio-1x1">
                  <img 
                    src={`https://source.unsplash.com/random/300x300/?daily,life,${item}`} 
                    alt="Instagram post" 
                    className="img-fluid rounded shadow-sm object-fit-cover"
                  />
                </div>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Button 
              variant="outline-primary" 
              className="d-inline-flex align-items-center gap-2"
              style={{ color: '#8B5A2B', borderColor: '#8B5A2B' }}
            >
              <FaInstagram /> @EverydayBliss
            </Button>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <Container>
          <Row>
            <Col md={4} className="mb-4 mb-md-0">
              <h3 className="h5 mb-3" style={{ color: '#D2B48C' }}>Everyday Bliss</h3>
              <p className="text-muted small">
                Celebrating the beauty in ordinary days and finding magic in the mundane.
              </p>
              <div className="d-flex gap-3 mt-4">
                <a href="#" className="text-white"><FaInstagram size={20} /></a>
                <a href="#" className="text-white"><FaPinterest size={20} /></a>
              </div>
            </Col>
            <Col md={2} className="mb-4 mb-md-0">
              <h4 className="h6 mb-3" style={{ color: '#D2B48C' }}>Explore</h4>
              <ul className="list-unstyled small">
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Home</a></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Categories</a></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Journal</a></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none">About</a></li>
              </ul>
            </Col>
            <Col md={2} className="mb-4 mb-md-0">
              <h4 className="h6 mb-3" style={{ color: '#D2B48C' }}>Connect</h4>
              <ul className="list-unstyled small">
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Contact</a></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Contribute</a></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none">FAQ</a></li>
              </ul>
            </Col>
            <Col md={4}>
              <h4 className="h6 mb-3" style={{ color: '#D2B48C' }}>Newsletter</h4>
              <p className="small text-muted mb-3">
                Get our weekly dose of everyday inspiration
              </p>
              <Form>
                <InputGroup>
                  <Form.Control placeholder="Your email" />
                  <Button variant="primary" style={{ backgroundColor: '#8B5A2B', borderColor: '#8B5A2B' }}>
                    Join
                  </Button>
                </InputGroup>
              </Form>
            </Col>
          </Row>
          <hr className="my-4 bg-secondary" />
          <p className="small text-muted mb-0">&copy; {new Date().getFullYear()} Everyday Bliss. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

export default DailyLifeBlog;
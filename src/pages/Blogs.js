import React, { useEffect, useState, useContext } from 'react';
import { Card, Button, Modal, Form, Dropdown, Container, Spinner } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { UserContext } from '../context/UserContext';
import CommentSection from '../components/CommentSection';
import CommentsModalWrapper from '../components/CommentsModalWrapper';

import { FaEllipsisH, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import format from 'date-fns/format';
import parse from 'date-fns/parse';

import '../components/BlogsPage.css'; // New CSS file for custom styles

const notyf = new Notyf();

const BlogsPage = () => {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [modalData, setModalData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

const Avatar = ({ user }) => {
  const imageUrl = user?.avatar; // Adjust based on your backend's field for profile image
  const username = user?.username;

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt="avatar"
        className="rounded-circle"
        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
      />
    );
  }

  const initial = username?.charAt(0).toUpperCase() || 'U';
  return (
    <div
      className="bg-secondary text-white d-flex align-items-center justify-content-center rounded-circle"
      style={{ width: '40px', height: '40px', fontWeight: 'bold' }}
    >
      {initial}
    </div>
  );
};

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/`);
      const data = await res.json();
      setPosts(data);
      setLoading(false);
    } catch (err) {
      notyf.error('Failed to fetch posts');
      setLoading(false);
    }
  };

const handlePostSubmit = async () => {
  if (user?.isAdmin) return; // block admin from submitting

  const method = editingPost ? 'PUT' : 'POST';
  const url = editingPost 
    ? `${process.env.REACT_APP_API_BASE_URL}/posts/${editingPost._id}`
    : `${process.env.REACT_APP_API_BASE_URL}/posts/createPost`;

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(modalData),
    });

    if (!res.ok) throw new Error();
    notyf.success(editingPost ? 'Post updated' : 'Post created');
    setShowPostModal(false);
    setModalData({ title: '', content: '' });
    setEditingPost(null);
    fetchPosts();
  } catch (err) {
    notyf.error('Failed to submit post');
  }
};


const handleDeletePost = async (id) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!res.ok) throw new Error();
    notyf.success('Post deleted');
    fetchPosts();
  } catch (err) {
    notyf.error('Failed to delete post');
  }
};


  useEffect(() => {
    fetchPosts();
  }, []);

console.log('user._id:', user?._id);


console.log('User:', user);

  return (
    <Container fluid className="blogs-container px-lg-5">
      <div className="blog-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="page-title">Community Blog</h1>
{user && !user.isAdmin && (
  <Button 
    variant="primary" 
    onClick={() => setShowPostModal(true)}
    className="create-post-btn"
  >
    <FaPlus className="me-2" />
    Create Post
  </Button>
)}

        </div>
        <p className="text-muted">Share your thoughts and ideas with the community</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="empty-state text-center py-5">
          <h4>No posts yet</h4>
          <p className="text-muted">Be the first to share something with the community</p>
{user && !user.isAdmin && (
  <Button 
    variant="primary" 
    onClick={() => setShowPostModal(true)}
    className="create-post-btn"
  >
    <FaPlus className="me-2" />
    Create Post
  </Button>
)}

        </div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <Card key={post._id} className="mb-4 post-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center">
<div className="user-avatar me-3">
  <Avatar user={post.author} />
</div>
                    <div>
                      <Card.Title className="mb-0 post-title">{post.title}</Card.Title>
                      <div className="post-meta text-muted">
                        <span className="author-name">
                          {'@'}{post.author ? post.author.username : 'Unknown'}
                        </span>
                        <span className="mx-2">•</span>
                        <span className="post-date">
                          {format(new Date(post.createdAt), 'MMM d, yyyy • h:mm a')}
                        </span>
                      </div>
                    </div>
                  </div>
{user && post.author && (String(user._id) === String(post.author._id) ) && ( 
                    <Dropdown>
                      <Dropdown.Toggle variant="link" className="post-actions">
                        <FaEllipsisH size={16} color="gray"/>
                      </Dropdown.Toggle>
                      <Dropdown.Menu align="end">
                        <Dropdown.Item 
                          onClick={() => {
                            setEditingPost(post);
                            setModalData({ title: post.title, content: post.content });
                            setShowPostModal(true);
                          }}
                        >
                          <FaEdit className="me-2" />
                          Edit
                        </Dropdown.Item>
                          <Dropdown.Item onClick={() => {
                            setPostToDelete(post);
                            setShowDeleteModal(true);
                          }}>
                            <FaTrash className="me-2" />
                            Delete
                          </Dropdown.Item>

                      </Dropdown.Menu>
                    </Dropdown>
)}                  
                </div>
                <Card.Text className="post-content">{post.content}</Card.Text>
                <div className="post-interactions mt-3">
                  <CommentsModalWrapper 
                    postId={post._id} 
                    user={user} 
                    token={user?.token} 
                    title={post.title} 
                    content={post.content}
                    author={post.author} />
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal show={showPostModal} onHide={() => setShowPostModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingPost ? 'Edit Post' : 'Create New Post'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={modalData.title}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                placeholder="What's on your mind?"
                className="modal-input"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={modalData.content}
                onChange={(e) => setModalData({ ...modalData, content: e.target.value })}
                placeholder="Share your thoughts..."
                className="modal-input"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPostModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePostSubmit}>
            {editingPost ? 'Update Post' : 'Publish Post'}
          </Button>
        </Modal.Footer>
      </Modal>

<Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Delete</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    Are you sure you want to delete the post <strong>"{postToDelete?.title}"</strong>?
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
      Cancel
    </Button>
    <Button
      variant="danger"
      onClick={() => {
        handleDeletePost(postToDelete._id);
        setShowDeleteModal(false);
        setPostToDelete(null);
      }}
    >
      Delete
    </Button>
  </Modal.Footer>
</Modal>


    </Container>
  );
};

export default BlogsPage;
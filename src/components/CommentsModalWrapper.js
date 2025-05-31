import React, { useEffect, useState, useContext } from 'react';
import { Button, Modal, Badge, Container, Spinner } from 'react-bootstrap';
import { UserContext } from '../context/UserContext';
import CommentSection from './CommentSection';
import { FaComments, FaTimes } from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import './CommentsModal.css';

const CommentsModalWrapper = ({ postId, title, content, author, createdAt }) => {
  const { token, user } = useContext(UserContext);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [loadingCount, setLoadingCount] = useState(true);

  const handleOpen = () => setShowCommentsModal(true);
  const handleClose = () => setShowCommentsModal(false);

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

  // Safe date formatting function
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'No date';
      const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return format(date, 'MMMM d, yyyy • h:mm a');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  // Fetch comment count
  useEffect(() => {
    if (!token) {
      setLoadingCount(false);
      return;
    }

    setLoadingCount(true);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/comments/post/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch comments');
        return res.json();
      })
      .then(data => {
        setCommentCount(data.length);
        setLoadingCount(false);
      })
      .catch(err => {
        console.error("Failed to fetch comment count:", err);
        setLoadingCount(false);
      });
  }, [postId, token]);

  return (
    <>
      <Button 
        variant="outline-secondary" 
        onClick={handleOpen}
        className="comments-button"
      >
        <FaComments className="me-2" />
        Comments
        {loadingCount ? (
          <Spinner animation="border" size="sm" className="ms-2" />
        ) : (
          <Badge bg="light" text="dark" pill className="ms-2">
            {commentCount}
          </Badge>
        )}
      </Button>

      <Modal 
        show={showCommentsModal} 
        onHide={handleClose} 
        size="lg" 
        centered 
        scrollable
        className="comments-modal"
      >
        <Modal.Header className="modal-header">
          <Container className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
<div className="user-avatar me-3">
  <Avatar user={author} />
</div>
              <div>
                <h5 className="author-name mb-0">{'@'}
                  {author?.username || 'Unknown Author'}
                
                </h5>

              </div>
            </div>
            <Button 
              variant="link" 
              onClick={handleClose}
              className="close-button"
            >
              <FaTimes />
            </Button>
          </Container>
        </Modal.Header>
        
        <Modal.Body className="modal-body">
          <div className="post-content mb-4">
            <h4 className="post-title">{title}</h4>
            <p className="post-text">{content}</p>
          </div>
          
          <div className="comments-section">
{/*            <div className="d-flex align-items-center mb-3">
              <h5 className="mb-0 me-2">Comments</h5>
              <Badge bg="light" text="dark" pill>{commentCount}</Badge>
            </div>*/}
            
            <CommentSection
              postId={postId}
              onCommentCountChange={setCommentCount}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CommentsModalWrapper;
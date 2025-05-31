import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Button, Form, ListGroup, Spinner, Badge, Modal } from 'react-bootstrap';
import { Notyf } from 'notyf';
import { UserContext } from '../context/UserContext';
import { FaPaperPlane, FaEdit, FaTrash, FaSave, FaTimes, FaTrashAlt   } from 'react-icons/fa';
import format from 'date-fns/format';
import {jwtDecode} from 'jwt-decode';



const notyf = new Notyf();

const CommentSection = ({ postId, title, content, onCommentCountChange }) => {
  const { user, token } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [editingId, setEditingId] = useState(null);
const [editedContent, setEditedContent] = useState('');
const [showConfirmModal, setShowConfirmModal] = useState(false);
const [commentToDelete, setCommentToDelete] = useState(null);
const [isAdminDelete, setIsAdminDelete] = useState(false);

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


console.log("Decoded token:", jwtDecode(token));

  useEffect(() => {
    if (!token) {
      console.log("No token provided, skipping fetch");
      setLoading(false);
      return;
    }

    fetch(`${process.env.REACT_APP_API_BASE_URL}/comments/post/${postId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error(`Fetch error status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setComments(data);
        onCommentCountChange?.(data.length);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load comments:", err);
        notyf.error('Failed to load comments');
        setLoading(false);
      });
  }, [postId, token]);

 const handleAddComment = useCallback(async (e) => {
  e.preventDefault();
  if (!user || !commentContent.trim()) return;

  setSending(true);
  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/comments/post/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ content: commentContent })
    });

    const newComment = await res.json();

    // ✅ Add this block:
    console.log('New comment from backend:', newComment);

    // If backend's author info is missing or incomplete, fallback to user context:
    if (!newComment.author || !newComment.author.username) {
      newComment.author = {
        _id: user._id,
        username: user.username
      };
    }

    // Now update comments state safely with the full author info
    setComments(prev => [newComment, ...prev]);
    onCommentCountChange?.(comments.length + 1);

    setCommentContent('');
    notyf.success('Comment added');
  } catch (err) {
    console.error("Failed to add comment:", err);
    notyf.error('Failed to add comment');
  } finally {
    setSending(false);
  }
}, [user, token, commentContent, postId, onCommentCountChange]);


const handleDeleteComment = async (commentId) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      setComments(prev => {
        const newComments = prev.filter(c => c._id !== commentId);
        onCommentCountChange?.(newComments.length);
        return newComments;
      });
      notyf.success('Comment deleted');
    } else {
      notyf.error('Failed to delete comment');
    }
  } catch (err) {
    console.error("Delete error:", err);
    notyf.error('Error deleting comment');
  }
};


const handleEditComment = (commentId, currentContent) => {
  setEditingId(commentId);
  setEditedContent(currentContent);
};

const handleSaveEdit = async (commentId) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ content: editedContent })
    });

    if (res.ok) {
      const updated = await res.json();
      setComments(prev => prev.map(c => c._id === commentId ? updated : c));
      setEditingId(null);
      notyf.success('Comment updated');
    } else {
      notyf.error('Failed to update comment');
    }
  } catch (err) {
    console.error("Edit error:", err);
    notyf.error('Error updating comment');
  }
};

const handleAdminDeleteComment = async (commentId) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/comments/admin/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to delete comment');
    }

    setComments(prev => {
      const newComments = prev.filter(c => c._id !== commentId);
      onCommentCountChange?.(newComments.length);
      return newComments;
    });
    notyf.success('Comment deleted as admin');
  } catch (err) {
    notyf.error(err.message);
  }
};


// console.log("Token:", token);
console.log("AVATAR URL:", user.avatar)


  if (!user) {
    return (
      <div className="comment-login-prompt">
        <p className="text-muted">Please login to view and write comments.</p>
      </div>
    );
  }

  console.log("Current user in CommentSection:", user);

  return (
<>
    <div className="comment-section">
      <h4>{title}</h4>
      <p>{content}</p>

      <div className="d-flex align-items-center mb-3">
        <h6 className="mb-0 me-2">Comments</h6>
        <Badge bg="light" text="dark" pill>{comments.length}</Badge>
      </div>

      <Form onSubmit={handleAddComment} className="comment-form mb-4">
        <div className="d-flex">

<div className="me-2">
  <Avatar user={user} />
</div>

          <Form.Group className="flex-grow-1">
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Write a comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="comment-input"
            />
          </Form.Group>
        </div>
        <div className="text-end mt-2">
          <Button
            variant="primary"
            type="submit"
            disabled={!commentContent.trim() || sending}
            className="comment-submit-btn"
          >
            {sending ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <>
                <FaPaperPlane className="me-1" />
                Post
              </>
            )}
          </Button>
        </div>
      </Form>

      {loading ? (
        <div className="text-center py-3">
          <Spinner animation="border" size="sm" />
        </div>
      ) : (
        <ListGroup variant="flush" className="comments-list">
{comments.map((c) => {
  const isOwner = c.author?._id === user?._id;
  return (
    <ListGroup.Item key={c._id} className="comment-item">
      <div className="d-flex">

<div className="me-3">
  <Avatar user={c.author} />
</div>

        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <strong className="comment-author">@{c.author?.username || 'Unknown User'}</strong>
            <small className="text-muted comment-date">
              {format(new Date(c.createdAt), 'MMM d, yyyy • h:mm a')}
            </small>
          </div>

          {editingId === c._id ? (
            <>
              <Form.Control
                as="textarea"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="mb-2"
              />
              <div className="text-end">
                <FaSave
                  style={{ cursor: 'pointer', marginRight: '8px' }}
                  title="Save"
                  onClick={() => handleSaveEdit(c._id)}
                />
                <FaTimes
                  style={{ cursor: 'pointer' }}
                  title="Cancel"
                  onClick={() => setEditingId(null)}
                />
              </div>
            </>
          ) : (
            <div className="comment-content">{c.content}</div>
          )}

          {isOwner && editingId !== c._id && (
            <div className="text-end mt-1">
              <FaEdit
                style={{ cursor: 'pointer', marginRight: '12px' }}
                title="Edit"
                onClick={() => handleEditComment(c._id, c.content)}
              />
              <FaTrash
                style={{ cursor: 'pointer' }}
                title="Delete"
                onClick={() => {
                  setCommentToDelete(c._id);
                  setIsAdminDelete(false);
                  setShowConfirmModal(true);
                }}

              />
            </div>
          )}

          {/* Admin delete control (can delete any comment) */}
          {user.isAdmin && !isOwner && editingId !== c._id && (
            <div className="text-end mt-1">
              <FaTrash
                style={{ cursor: 'pointer', color: 'red' }}
                title="Admin Delete"
                onClick={() => {
                  setCommentToDelete(c._id);
                  setIsAdminDelete(true);
                  setShowConfirmModal(true);
                }}

              />
            </div>  
          )}
        </div>
      </div>
    </ListGroup.Item>
  );
})}



          {comments.length === 0 && (
            <ListGroup.Item className="text-muted text-center py-3">
              No comments yet. Be the first to comment!
            </ListGroup.Item>
          )}
        </ListGroup>
      )}
    </div>

    <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete this comment? This action cannot be undone.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={async () => {
            if (isAdminDelete) {
              await handleAdminDeleteComment(commentToDelete);
            } else {
              await handleDeleteComment(commentToDelete);
            }
            setShowConfirmModal(false);
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>

</>
  );
};

export default CommentSection;

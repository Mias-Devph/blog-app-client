import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();


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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Everyday Bliss</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>

            {!user ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/posts"> 
                    {user && user.isAdmin ? 'Admin-Blogs' : 'Blogs' } 
                  </Link>
                </li>

 
                {!user.isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link " to="/profile">Profile</Link>

                  </li>
                )}
                <div className="user-avatar me-3 mb-2">
                    <Avatar user={user} />
                </div>

                <li className="nav-item">
                  <button className="btn btn-danger btn-sm ms-2" onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

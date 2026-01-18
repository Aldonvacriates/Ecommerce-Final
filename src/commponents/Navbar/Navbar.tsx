import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const { user } = useAuth();
  return (
    <header className="nav-shell">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          Aldo Website
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <Link className="nav-link" to="/">
            Home
          </Link>
          <Link className="nav-link" to="/cart">
            Cart
          </Link>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <Link className="nav-ghost" to="/profile">
                Profile
              </Link>
              <Link className="nav-pill" to="/logout">
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link className="nav-ghost" to="/register">
                Register
              </Link>
              <Link className="nav-pill" to="/login">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
export default Navbar;

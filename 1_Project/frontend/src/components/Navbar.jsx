import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Link } from "react-router";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom px-3">
      <Link className="navbar-brand fw-bold" to="/">
        TaskForge
      </Link>

      <div className="ms-auto d-flex align-items-center gap-2">
        {!user ? (
          <>
            <Link to="/login" className="btn btn-outline-primary">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <span className="me-2 fw-semibold">
              👋 {user.username}
            </span>
            <button className="btn btn-danger" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
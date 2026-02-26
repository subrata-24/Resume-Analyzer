import React from "react";
import { Link, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const Navbar = () => {
  const { auth } = usePuterStore();
  const navigate = useNavigate();
  const handleUpload = () => {
    {
      auth.isAuthenticated
        ? navigate("/upload-resume")
        : navigate("/auth/?next=/upload-resume");
    }
  };
  return (
    <nav className="navbar-modern">
      <div className="navbar-content">
        <Link to={"/"} className="navbar-logo">
          <div className="logo-wrapper">
            <p className="navbar-title">ResumeIQ</p>
          </div>
        </Link>

        <div className="navbar-actions">
          <button
            className="navbar-button navbar-button-primary"
            onClick={handleUpload}
          >
            <span className="button-shine"></span>
            <span className="button-text"> Analyze ATS</span>
          </button>

          {auth.isAuthenticated ? (
            <button
              className="navbar-button navbar-button-secondary"
              onClick={() => auth.signOut()}
            >
              <span className="button-text">Log Out</span>
            </button>
          ) : (
            <button
              className="navbar-button navbar-button-secondary"
              onClick={() => {
                navigate("/auth?next=/");
              }}
            >
              <span className="button-text">Log In</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

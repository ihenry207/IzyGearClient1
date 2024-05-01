import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

function Footer() {
  return (
    <footer className="app-footer">
      <Link to="/terms">Terms of Service</Link>
      <Link to="/privacy">Privacy Policy</Link>
      <Link to="/contact-us">Contact Us</Link>
    </footer>
  );
}

export default Footer;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    NetandPro<span>Systems</span>
                </Link>

                <button className="navbar-toggle" onClick={toggleMenu}>
                    ☰
                </button>

                <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
                    <li><Link to="/" onClick={() => setMenuOpen(false)}>Accueil</Link></li>
                    <li><Link to="/planifier" onClick={() => setMenuOpen(false)}>Planifier</Link></li>
                    <li><Link to="/about" onClick={() => setMenuOpen(false)}>À propos</Link></li>
                    {/* Lien Admin retiré - accès uniquement via URL directe /admin */}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
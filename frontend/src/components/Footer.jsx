import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import '../styles/footer.css';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Section 1: Logo et description */}
                <div className="footer-section">
                    <div className="footer-logo">
                        NetandPro <span>Systems</span>
                    </div>
                    <p className="footer-description">
                        Votre partenaire de confiance pour l'organisation d'événements professionnels 
                        et personnels d'exception au Cameroun.
                    </p>
                    <div className="footer-social">
                        {/* Prevu pour ajouter des icônes sociales ici plus tard */}
                    </div>
                </div>

                {/* Section 2: Navigation rapide */}
                <div className="footer-section">
                    <h4 className="footer-title">Navigation</h4>
                    <ul className="footer-links">
                        <li><Link to="/">Accueil</Link></li>
                        <li><Link to="/planifier">Planifier un événement</Link></li>
                        <li><Link to="/about">À propos</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>

                {/* Section 3: Services */}
                <div className="footer-section">
                    <h4 className="footer-title">Nos services</h4>
                    <ul className="footer-links">
                        <li>Interprétation simultanée</li>
                        <li>Sonorisation professionnelle</li>
                        <li>Vidéo & Projection</li>
                        <li>Conférence hybride</li>
                        <li>Solutions intégrées</li>
                    </ul>
                </div>

                {/* Section 4: Contact */}
                <div className="footer-section">
                    <h4 className="footer-title">Contact</h4>
                    <ul className="footer-contact">
                        <li>
                            <Phone size={18} />
                            <a href="tel:+237698200792">+237 698 200 792</a>
                        </li>
                        <li>
                            <Mail size={18} />
                            <a href="mailto:contact@netandprosystems.com">contact@netandprosystems.com</a>
                        </li>
                        <li>
                            <MapPin size={18} />
                            <span>Yaoundé, Cameroun</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Barre du bas */}
            <div className="footer-bottom">
                <div className="footer-container">
                    <p>&copy; {currentYear} NetandProSystems. Tous droits réservés.</p>
                    <div className="footer-bottom-links">
                        <Link to="/about">Mentions légales</Link>
                        <span className="separator">•</span>
                        <Link to="/about">Politique de confidentialité</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
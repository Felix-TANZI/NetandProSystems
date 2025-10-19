import React, { useState } from 'react';
import { Phone, Mail, MapPin, User, Send } from 'lucide-react';
import '../styles/contact.css';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Effacer l'erreur du champ modifié
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Le nom est requis';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email invalide';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Le sujet est requis';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Le message est requis';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Le message doit contenir au moins 10 caractères';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Appel API backend
            const response = await fetch('http://localhost:5000/api/email/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setSubmitted(true);
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

                // Réinitialiser après 5 secondes
                setTimeout(() => setSubmitted(false), 5000);
            } else {
                alert(data.message || 'Erreur lors de l\'envoi du message');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur de connexion au serveur. Vérifiez que le backend est démarré.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="contact-page">
            {/* Hero Section */}
            <section className="contact-hero">
                <div className="contact-hero-content">
                    <h1>Contactez-nous</h1>
                    <p>Notre équipe est à votre écoute pour répondre à toutes vos questions</p>
                </div>
            </section>

            {/* Contenu principal */}
            <section className="contact-main-section">
                <div className="container">
                    <div className="contact-layout">
                        {/* Informations de contact */}
                        <div className="contact-info-side">
                            <h2>Nos coordonnées</h2>
                            <p className="contact-intro">
                                N'hésitez pas à nous contacter pour toute question concernant nos services, 
                                vos réservations ou pour obtenir un devis personnalisé.
                            </p>

                            <div className="contact-info-cards">
                                <div className="contact-info-card">
                                    <div className="contact-info-icon">
                                        <Phone size={24} color="white" strokeWidth={2} />
                                    </div>
                                    <div className="contact-info-content">
                                        <h4>Téléphone</h4>
                                        <a href="tel:+237698200792">+237 698 200 792</a>
                                    </div>
                                </div>

                                <div className="contact-info-card">
                                    <div className="contact-info-icon">
                                        <Mail size={24} color="white" strokeWidth={2} />
                                    </div>
                                    <div className="contact-info-content">
                                        <h4>Email</h4>
                                        <a href="mailto:contact@netandprosystems.com">contact@netandprosystems.com</a>
                                    </div>
                                </div>

                                <div className="contact-info-card">
                                    <div className="contact-info-icon">
                                        <MapPin size={24} color="white" strokeWidth={2} />
                                    </div>
                                    <div className="contact-info-content">
                                        <h4>Localisation</h4>
                                        <p>Yaoundé, Cameroun</p>
                                    </div>
                                </div>

                                <div className="contact-info-card">
                                    <div className="contact-info-icon">
                                        <User size={24} color="white" strokeWidth={2} />
                                    </div>
                                    <div className="contact-info-content">
                                        <h4>Responsable</h4>
                                        <p>Ramses Fouda</p>
                                    </div>
                                </div>
                            </div>

                            {/* Heures d'ouverture */}
                            <div className="opening-hours">
                                <h3>Heures d'ouverture</h3>
                                <div className="hours-list">
                                    <div className="hours-item">
                                        <span className="day">Lundi - Vendredi</span>
                                        <span className="time">8h00 - 18h00</span>
                                    </div>
                                    <div className="hours-item">
                                        <span className="day">Samedi</span>
                                        <span className="time">9h00 - 14h00</span>
                                    </div>
                                    <div className="hours-item">
                                        <span className="day">Dimanche</span>
                                        <span className="time">Fermé</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Formulaire de contact */}
                        <div className="contact-form-side">
                            {submitted ? (
                                <div className="success-message-box">
                                    <div className="success-icon-big">✓</div>
                                    <h3>Message envoyé avec succès !</h3>
                                    <p>Nous avons bien reçu votre message. Notre équipe vous répondra dans les plus brefs délais.</p>
                                </div>
                            ) : (
                                <>
                                    <h2>Envoyez-nous un message</h2>
                                    <form className="contact-form" onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label className="form-label">Nom complet *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                className={`form-input ${errors.name ? 'error' : ''}`}
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Votre nom complet"
                                            />
                                            {errors.name && <span className="form-error">{errors.name}</span>}
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">Email *</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className={`form-input ${errors.email ? 'error' : ''}`}
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="votre@email.com"
                                                />
                                                {errors.email && <span className="form-error">{errors.email}</span>}
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">Téléphone</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    className="form-input"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="+237 6XX XXX XXX"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Sujet *</label>
                                            <input
                                                type="text"
                                                name="subject"
                                                className={`form-input ${errors.subject ? 'error' : ''}`}
                                                value={formData.subject}
                                                onChange={handleChange}
                                                placeholder="Objet de votre message"
                                            />
                                            {errors.subject && <span className="form-error">{errors.subject}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Message *</label>
                                            <textarea
                                                name="message"
                                                className={`form-textarea ${errors.message ? 'error' : ''}`}
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Décrivez votre demande en détail..."
                                                rows="6"
                                            />
                                            {errors.message && <span className="form-error">{errors.message}</span>}
                                        </div>

                                        <button type="submit" className="btn-submit" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                'Envoi en cours...'
                                            ) : (
                                                <>
                                                    <Send size={20} />
                                                    <span>Envoyer le message</span>
                                                </>
                                            )}
                                        </button>

                                        <p className="form-note">
                                            * Champs obligatoires
                                        </p>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="container">
                    <h2>Questions fréquentes</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h4>Quel est le délai de réponse ?</h4>
                            <p>Nous nous engageons à vous répondre sous 24 heures ouvrables maximum.</p>
                        </div>
                        <div className="faq-item">
                            <h4>Puis-je obtenir un devis gratuitement ?</h4>
                            <p>Oui, tous nos devis sont gratuits et sans engagement. Contactez-nous avec les détails de votre projet.</p>
                        </div>
                        <div className="faq-item">
                            <h4>Proposez-vous des visites des lieux ?</h4>
                            <p>Absolument ! Nous organisons des visites sur rendez-vous de tous nos établissements partenaires.</p>
                        </div>
                        <div className="faq-item">
                            <h4>Comment annuler une réservation ?</h4>
                            <p>Contactez-nous au plus vite. Les conditions d'annulation dépendent du délai avant l'événement.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Contact;
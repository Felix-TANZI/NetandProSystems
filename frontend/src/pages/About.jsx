import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Calendar, Volume2, Briefcase, CheckCircle, Zap, Building2, Target, Users, Phone, Mail, MapPin, User } from 'lucide-react';
import '../styles/about.css';

function About() {
    const [currentService, setCurrentService] = useState(0);

    // Services avec images
    const services = [
        {
            name: 'Interprétation simultanée',
            image: '/assets/images/services/Interpretation_Simultanee.png',
            description: 'Service professionnel d\'interprétation en temps réel pour vos conférences multilingues avec cabines insonorisées et équipements de pointe.'
        },
        {
            name: 'Interprétation simultanée à distance',
            image: '/assets/images/services/Interpretation_Simultanee_Distant.png',
            description: 'Solutions d\'interprétation à distance pour événements virtuels et hybrides avec connexion sécurisée et qualité audio professionnelle.'
        },
        {
            name: 'Sonorisation',
            image: '/assets/images/services/Sonorisation.png',
            description: 'Systèmes audio haute fidélité adaptés à tous types d\'espaces, du petit séminaire au grand congrès avec techniciens qualifiés.'
        },
        {
            name: 'Vidéo & Projection',
            image: '/assets/images/services/Video_Projection.png',
            description: 'Écrans LED géants, vidéoprojecteurs HD et solutions d\'affichage dynamique pour rendre vos présentations percutantes.'
        },
        {
            name: 'Éclairage',
            image: '/assets/images/services/Éclairage.png',
            description: 'Éclairage scénique professionnel et ambiance lumineuse personnalisée pour créer l\'atmosphère parfaite de votre événement.'
        },
        {
            name: 'Captation vidéo',
            image: '/assets/images/services/Captation_Video.png',
            description: 'Enregistrement professionnel multi-caméras HD, montage et streaming live pour immortaliser vos moments importants.'
        },
        {
            name: 'Webinar',
            image: '/assets/images/services/Webinar.png',
            description: 'Plateforme complète pour webinaires interactifs avec gestion des participants, chat en direct et enregistrement automatique.'
        },
        {
            name: 'Tourguide',
            image: '/assets/images/services/Tourguide.png',
            description: 'Systèmes de visite guidée sans fil pour groupes avec récepteurs individuels et qualité audio cristalline.'
        },
        {
            name: 'Conférence silencieuse',
            image: '/assets/images/services/Conference_Silencieuse.png',
            description: 'Technologie innovante de casques sans fil permettant plusieurs conférences simultanées dans un même espace.'
        },
        {
            name: 'Solutions intégrées',
            image: '/assets/images/services/Solution_Integrees.png',
            description: 'Pack complet clé en main combinant tous nos services pour une expérience événementielle sans faille de A à Z.'
        }
    ];

    // Partenaires avec logos PNG
    const partners = [
        { name: 'Hilton Yaoundé', logo: '/assets/images/logos/hilton.jpg' },
        { name: 'LAGON Club', logo: '/assets/images/logos/lagon.png' },
        { name: 'Palais des Congrès', logo: '/assets/images/logos/palais.png' },
        { name: 'Hôtel Mont Fébé', logo: '/assets/images/logos/febe.png' },
        { name: 'Hôtel Starland', logo: '/assets/images/logos/starland.png' }
    ];

    // Navigation carrousel
    const nextService = () => {
        setCurrentService((prev) => (prev + 1) % services.length);
    };

    const prevService = () => {
        setCurrentService((prev) => (prev - 1 + services.length) % services.length);
    };

    // Défilement automatique du carrousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentService((prev) => (prev + 1) % services.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [services.length]);

    // Animation au scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.2 }
        );

        document.querySelectorAll('.step-item').forEach((item) => {
            observer.observe(item);
        });

        return () => observer.disconnect();
    }, []);

    const getCardClass = (index) => {
        if (index === currentService) return 'active';
        if (index === (currentService - 1 + services.length) % services.length) return 'prev';
        if (index === (currentService + 1) % services.length) return 'next';
        return 'hidden';
    };

    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1>À propos de NetandProSystems</h1>
                    <p>Votre partenaire pour l'organisation d'événements professionnels et personnels d'exception</p>
                </div>
            </section>

            {/* Qui sommes-nous */}
            <section className="about-section">
                <div className="container">
                    <div className="about-intro">
                        <h2>Qui sommes-nous ?</h2>
                        <p>
                            <strong>NetandProSystems</strong> est une plateforme innovante de planification d'événements lancée en 2025. 
                            Nous combinons technologie moderne et expertise événementielle pour vous offrir une solution complète de 
                            gestion d'événements professionnels et personnels.
                        </p>
                        <p>
                            Que vous organisiez une conférence internationale, un séminaire d'entreprise, un gala, ou un événement 
                            privé, <strong>NetandProSystems</strong> vous accompagne de la planification à la réalisation, avec 
                            une interface moderne et un suivi en temps réel pour garantir le succès de votre événement.
                        </p>
                    </div>
                </div>
            </section>

            {/* Comment ça marche */}
            <section className="how-it-works">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Comment ça marche ?</h2>
                        <p className="section-subtitle">Planifiez votre événement en 5 étapes simples</p>
                    </div>

                    <div className="steps-container">
                        {/* ÉTAPE 1 */}
                        <div className="step-item">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <div className="step-icon-wrapper">
                                    <ClipboardList size={40} color="#1e40af" strokeWidth={2} />
                                </div>
                                <h3>Renseignez vos informations</h3>
                                <p>
                                    Commencez par remplir vos informations de contact : nom complet, raison sociale, 
                                    adresse, téléphone et email. Vous pouvez également ajouter votre NUI (Numéro d'Identification Unique) 
                                    si vous en disposez. Ces informations nous permettront de vous identifier et de vous recontacter 
                                    facilement pour confirmer votre réservation.
                                </p>
                            </div>
                        </div>

                        {/* ÉTAPE 2 */}
                        <div className="step-item">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <div className="step-icon-wrapper">
                                    <Calendar size={40} color="#1e40af" strokeWidth={2} />
                                </div>
                                <h3>Définissez les détails de votre événement</h3>
                                <p>
                                    Sélectionnez le lieu parmi nos 5 établissements premium (Hilton Yaoundé, LAGON Club, 
                                    Palais des Congrès, Hôtel Mont Fébé, Hôtel Starland). Indiquez les dates de début et de fin 
                                    de votre événement, le nombre de participants attendus et le nombre de jours de location. 
                                    Ces informations nous permettent de préparer l'espace selon vos besoins spécifiques.
                                </p>
                            </div>
                        </div>

                        {/* ÉTAPE 3 */}
                        <div className="step-item">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <div className="step-icon-wrapper">
                                    <Volume2 size={40} color="#1e40af" strokeWidth={2} />
                                </div>
                                <h3>Choisissez vos services audio/vidéo</h3>
                                <p>
                                    Sélectionnez parmi notre gamme complète de services techniques : traduction simultanée, 
                                    sonorisation professionnelle, conférence hybride, écrans géants, microphones de table, 
                                    moniteurs de contrôle, caméras tracking, et solutions Zoom intégrées ou à distance. 
                                    Vous pouvez cocher plusieurs services selon les besoins de votre événement pour une 
                                    expérience audiovisuelle optimale.
                                </p>
                            </div>
                        </div>

                        {/* ÉTAPE 4 */}
                        <div className="step-item">
                            <div className="step-number">4</div>
                            <div className="step-content">
                                <div className="step-icon-wrapper">
                                    <Briefcase size={40} color="#1e40af" strokeWidth={2} />
                                </div>
                                <h3>Ajoutez des services complémentaires</h3>
                                <p>
                                    Complétez votre événement avec nos services d'interprétation (interprètes professionnels, 
                                    cabines de traduction, interprétation d'escorte) et nos services bureautiques (copieurs 
                                    couleur/N&B, imprimantes, ordinateurs, secrétariat, gestion complète, assistance technique). 
                                    Précisez le nombre de langues nécessaires si vous optez pour l'interprétation. Ces options 
                                    garantissent le bon déroulement de votre événement de A à Z.
                                </p>
                            </div>
                        </div>

                        {/* ÉTAPE 5 */}
                        <div className="step-item">
                            <div className="step-number">5</div>
                            <div className="step-content">
                                <div className="step-icon-wrapper">
                                    <CheckCircle size={40} color="#10b981" strokeWidth={2} />
                                </div>
                                <h3>Confirmez et validez votre réservation</h3>
                                <p>
                                    Consultez le récapitulatif détaillé de votre événement avec tous les services sélectionnés. 
                                    Choisissez vos conditions de paiement (50/50 ou 70/30) et votre mode de paiement préféré 
                                    (chèque, espèces, MTN Mobile Money, Orange Money, virement bancaire). Ajoutez des notes 
                                    particulières si nécessaire, acceptez nos conditions générales et validez votre demande. 
                                    Vous recevrez instantanément un email de confirmation avec tous les détails de votre réservation !
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA après les étapes */}
                    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--gray)' }}>
                            Prêt à commencer ? Planifiez votre événement dès maintenant !
                        </p>
                        <Link to="/planifier" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                            Démarrer votre projet →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Services Carousel 3D */}
            <section className="services-carousel-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Nos services techniques</h2>
                        <p className="section-subtitle">Des solutions professionnelles pour tous vos besoins</p>
                    </div>

                    <div className="carousel-wrapper">
                        <div className="carousel-container">
                            {services.map((service, index) => (
                                <div
                                    key={index}
                                    className={`service-card-carousel ${getCardClass(index)}`}
                                    onClick={() => setCurrentService(index)}
                                >
                                    <img
                                        src={service.image}
                                        alt={service.name}
                                        className="service-card-image"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.paddingTop = '3rem';
                                        }}
                                    />
                                    <div className="service-card-content">
                                        <h3>{service.name}</h3>
                                        <p>{service.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="carousel-controls">
                            <button className="carousel-btn" onClick={prevService}>←</button>
                            <button className="carousel-btn" onClick={nextService}>→</button>
                        </div>

                        <div className="carousel-indicators">
                            {services.map((_, index) => (
                                <div
                                    key={index}
                                    className={`carousel-indicator ${index === currentService ? 'active' : ''}`}
                                    onClick={() => setCurrentService(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Partners Slider */}
            <section className="partners-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Nos partenaires</h2>
                        <p className="section-subtitle">Des établissements prestigieux qui nous font confiance</p>
                    </div>

                    <div className="partners-slider">
                        <div className="partners-track">
                            {[...partners, ...partners, ...partners].map((partner, index) => (
                                <div key={index} className="partner-item">
                                    <img
                                        src={partner.logo}
                                        alt={partner.name}
                                        className="partner-logo-img"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                    <div className="partner-logo-fallback" style={{ display: 'none' }}>
                                        {partner.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Us */}
            <section className="why-us-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Pourquoi choisir NetandProSystems ?</h2>
                        <p className="section-subtitle">L'excellence au service de vos événements</p>
                    </div>

                    <div className="why-us-grid">
                        <div className="why-card">
                            <div className="why-card-header">
                                <div className="why-card-icon">
                                    <Zap size={32} color="white" strokeWidth={2.5} />
                                </div>
                                <h3>Simple et rapide</h3>
                            </div>
                            <p>
                                Plateforme intuitive et moderne pour réserver votre événement en quelques clics. 
                                Formulaire guidé étape par étape, récapitulatif instantané et confirmation immédiate 
                                par email pour une expérience sans friction.
                            </p>
                        </div>

                        <div className="why-card">
                            <div className="why-card-header">
                                <div className="why-card-icon">
                                    <Building2 size={32} color="white" strokeWidth={2.5} />
                                </div>
                                <h3>Lieux premium</h3>
                            </div>
                            <p>
                                Accès exclusif aux établissements les plus prestigieux de Yaoundé : Hilton, 
                                LAGON Club, Palais des Congrès, Mont Fébé et Starland. Espaces modulables, 
                                équipés et adaptés à tous types d'événements.
                            </p>
                        </div>

                        <div className="why-card">
                            <div className="why-card-header">
                                <div className="why-card-icon">
                                    <Target size={32} color="white" strokeWidth={2.5} />
                                </div>
                                <h3>Services complets</h3>
                            </div>
                            <p>
                                10 services techniques professionnels regroupés en un seul endroit : de la 
                                sonorisation à l'interprétation simultanée, en passant par l'éclairage scénique 
                                et la captation vidéo HD. Pack tout-en-un disponible.
                            </p>
                        </div>

                        <div className="why-card">
                            <div className="why-card-header">
                                <div className="why-card-icon">
                                    <Users size={32} color="white" strokeWidth={2.5} />
                                </div>
                                <h3>Suivi professionnel</h3>
                            </div>
                            <p>
                                Gestion sécurisée avec authentification JWT, suivi en temps réel du statut de 
                                votre événement, tableau de bord administrateur complet et support client 
                                réactif pour répondre à toutes vos questions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section className="contact-section">
                <div className="contact-wrapper">
                    <div className="section-header">
                        <h2 className="section-title">Nous contacter</h2>
                        <p className="section-subtitle">Notre équipe est à votre écoute pour répondre à toutes vos questions</p>
                    </div>

                    <div className="contact-content">
                        <div className="contact-grid">
                            <div className="contact-card">
                                <div className="contact-card-header">
                                    <div className="contact-icon">
                                        <Phone size={24} color="white" strokeWidth={2} />
                                    </div>
                                    <h4>Téléphone</h4>
                                </div>
                                <div className="contact-card-content">
                                    <p><a href="tel:+237698200792">+237 698 200 792</a></p>
                                </div>
                            </div>

                            <div className="contact-card">
                                <div className="contact-card-header">
                                    <div className="contact-icon">
                                        <Mail size={24} color="white" strokeWidth={2} />
                                    </div>
                                    <h4>Email</h4>
                                </div>
                                <div className="contact-card-content">
                                    <p><a href="mailto:contact@netandprosystems.com">contact@netandprosystems.com</a></p>
                                </div>
                            </div>

                            <div className="contact-card">
                                <div className="contact-card-header">
                                    <div className="contact-icon">
                                        <MapPin size={24} color="white" strokeWidth={2} />
                                    </div>
                                    <h4>Localisation</h4>
                                </div>
                                <div className="contact-card-content">
                                    <p>Yaoundé, Cameroun</p>
                                </div>
                            </div>

                            <div className="contact-card">
                                <div className="contact-card-header">
                                    <div className="contact-icon">
                                        <User size={24} color="white" strokeWidth={2} />
                                    </div>
                                    <h4>Responsable</h4>
                                </div>
                                <div className="contact-card-content">
                                    <p>Ramses Fouda</p>
                                </div>
                            </div>
                        </div>

                        <div className="contact-divider"></div>

                        <div className="contact-cta">
                            <p>Vous avez un projet d'événement ? Parlons-en !</p>
                            <Link to="/planifier" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                                Démarrer votre projet →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="about-cta">
                <div className="container">
                    <h2>Prêt à planifier votre prochain événement ?</h2>
                    <p>Commencez dès maintenant et bénéficiez de notre expertise</p>
                    <Link to="/planifier" className="btn btn-accent" style={{ fontSize: '1.2rem', padding: '1rem 2.5rem' }}>
                        Planifier maintenant →
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default About;
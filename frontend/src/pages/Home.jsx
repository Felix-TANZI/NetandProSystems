import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { eventService } from '../services/eventService';
import TestimonialForm from '../components/TestimonialForm';
import '../styles/home.css';

function Home() {
    const [events, setEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [filter, setFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    // Témoignages statiques
    const staticTestimonials = [
        {
            quote: "Service irréprochable et très professionnel. Une équipe à l'écoute et des résultats au top !",
            author: "Ramses F.",
            role: "Directeur Événementiel, Dakar"
        },
        {
            quote: "Une expérience incroyable. Je recommande vivement cette entreprise pour vos événements.",
            author: "Jean P.",
            role: "Chef de Projet, Abidjan"
        },
        {
            quote: "Organisation parfaite du début à la fin. Ils ont su s'adapter à nos besoins avec efficacité.",
            author: "Felix N.",
            role: "Chef Cellule Finance Club GI, Cameroun"
        },
        {
            quote: "Des prestations de grande qualité, une équipe très humaine. Merci encore pour tout !",
            author: "Dylan W.",
            role: "Responsable Communication, Cotonou"
        }
    ];

    // État pour tous les témoignages (statiques + dynamiques)
    const [allTestimonials, setAllTestimonials] = useState(staticTestimonials);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    // Services proposés
    const services = [
        { icon: '🎤', title: 'Interprétation simultanée', desc: 'Service professionnel multilingue' },
        { icon: '🔊', title: 'Sonorisation', desc: 'Équipement audio haute qualité' },
        { icon: '📽️', title: 'Vidéo & Projection', desc: 'Écrans LED et projecteurs HD' },
        { icon: '💡', title: 'Éclairage', desc: 'Ambiance lumineuse personnalisée' },
        { icon: '🎥', title: 'Captation vidéo', desc: 'Enregistrement professionnel' },
        { icon: '💻', title: 'Webinar', desc: 'Événements virtuels interactifs' },
        { icon: '🎧', title: 'Tourguide', desc: 'Systèmes de visite guidée' },
        { icon: '🔇', title: 'Conférence silencieuse', desc: 'Technologie sans fil avancée' },
        { icon: '⚙️', title: 'Solutions intégrées', desc: 'Pack complet clé en main' },
        { icon: '🌐', title: 'Interprétation à distance', desc: 'Service en ligne sécurisé' }
    ];

    // Charger les événements depuis l'API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsLoading(true);
                const data = await eventService.getPublicEvents();
                
                // Formater pour FullCalendar
                const formattedEvents = data.map(event => ({
                    id: event.id,
                    title: event.client_name,
                    start: event.date_start,
                    end: event.date_end,
                    backgroundColor: getStatusColor(event.status),
                    borderColor: getStatusColor(event.status),
                    extendedProps: {
                        location: event.location_name,
                        status: event.status
                    }
                }));

                setEvents(formattedEvents);
                
                // Événements à venir (3 prochains)
                const upcoming = data
                    .filter(e => new Date(e.date_start) >= new Date() && e.status === 'Confirmé')
                    .slice(0, 3);
                setUpcomingEvents(upcoming);

            } catch (error) {
                console.error('Erreur chargement événements:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Charger les témoignages dynamiques
    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/testimonials/recent');
                const data = await response.json();
                
                // Formater les témoignages dynamiques
                const formatted = data.map(t => ({
                    quote: t.comment,
                    author: t.client_name,
                    role: "Client NetandPro"
                }));

                // Combiner statiques + dynamiques
                setAllTestimonials([...staticTestimonials, ...formatted]);
            } catch (error) {
                console.error('Erreur chargement témoignages:', error);
            }
        };

        fetchTestimonials();
    }, [staticTestimonials]);

    // Rotation automatique témoignages
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % allTestimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [allTestimonials.length]);

    // Animation scroll timeline
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

        document.querySelectorAll('.timeline-item').forEach((item) => {
            observer.observe(item);
        });

        return () => observer.disconnect();
    }, [upcomingEvents]);

    // Couleur selon statut
    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmé': return '#10b981';
            case 'En attente': return '#f59e0b';
            case 'Annulé': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Confirmé': return 'status-confirmed';
            case 'En attente': return 'status-pending';
            case 'Annulé': return 'status-cancelled';
            default: return '';
        }
    };

    // Clic sur événement du calendrier
    const handleEventClick = (info) => {
        const { title, extendedProps } = info.event;
        alert(`📅 Événement: ${title}\n📍 Lieu: ${extendedProps.location}\n✅ Statut: ${extendedProps.status}`);
    };

    // Filtrage événements
    const getFilteredEvents = () => {
        if (filter === 'all') return events;
        if (filter === 'confirmed') return events.filter(e => e.extendedProps.status === 'Confirmé');
        if (filter === 'pending') return events.filter(e => e.extendedProps.status === 'En attente');
        return events;
    };

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Organisez des événements d'exception</h1>
                    <p>
                        Plateforme complète de planification pour vos événements professionnels et personnels.
                        Services techniques premium et gestion simplifiée.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/planifier" className="btn btn-accent">
                            Planifier un événement
                        </Link>
                        <Link to="/about" className="btn btn-outline">
                            Découvrir nos services
                        </Link>
                    </div>
                </div>
            </section>

            {/* Calendrier */}
            <section className="section calendar-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Calendrier des événements</h2>
                        <p className="section-subtitle">
                            Consultez tous les événements planifiés et réservez vos dates
                        </p>
                    </div>

                    <div className="calendar-container">
                        <div className="calendar-filters">
                            <button 
                                className={`filter-btn ${filter === 'all' ? 'active' : ''}`} 
                                onClick={() => setFilter('all')}
                            >
                                Tous ({events.length})
                            </button>
                            <button 
                                className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`} 
                                onClick={() => setFilter('confirmed')}
                            >
                                Confirmés ({events.filter(e => e.extendedProps.status === 'Confirmé').length})
                            </button>
                            <button 
                                className={`filter-btn ${filter === 'pending' ? 'active' : ''}`} 
                                onClick={() => setFilter('pending')}
                            >
                                En attente ({events.filter(e => e.extendedProps.status === 'En attente').length})
                            </button>
                        </div>

                        {isLoading ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <p>Chargement du calendrier...</p>
                            </div>
                        ) : (
                            <FullCalendar
                                plugins={[dayGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                events={getFilteredEvents()}
                                eventClick={handleEventClick}
                                height="auto"
                                locale="fr"
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,dayGridWeek'
                                }}
                                buttonText={{
                                    today: "Aujourd'hui",
                                    month: 'Mois',
                                    week: 'Semaine'
                                }}
                            />
                        )}
                    </div>
                </div>
            </section>

            {/* Timeline Événements à venir */}
            <section className="section timeline-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Prochains événements confirmés</h2>
                        <p className="section-subtitle">Les événements à venir dans notre agenda</p>
                    </div>

                    {upcomingEvents.length > 0 ? (
                        <div className="timeline">
                            {upcomingEvents.map((event, index) => (
                                <div key={event.id} className="timeline-item" style={{ transitionDelay: `${index * 0.1}s` }}>
                                    <div className="timeline-card">
                                        <div className="timeline-date">
                                            📅 {new Date(event.date_start).toLocaleDateString('fr-FR', { 
                                                day: 'numeric', 
                                                month: 'long', 
                                                year: 'numeric' 
                                            })}
                                        </div>
                                        <h3 className="timeline-title">{event.client_name}</h3>
                                        <div className="timeline-location">📍 {event.location_name}</div>
                                        <span className={`status-badge ${getStatusClass(event.status)}`}>
                                            {event.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>
                            <p>Aucun événement confirmé à venir pour le moment.</p>
                            <Link to="/planifier" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                Planifier le premier événement
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Services */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Nos services techniques</h2>
                        <p className="section-subtitle">
                            Solutions complètes pour tous vos besoins événementiels
                        </p>
                    </div>

                    <div className="services-grid">
                        {services.map((service, index) => (
                            <div key={index} className="service-card">
                                <div className="service-icon">{service.icon}</div>
                                <h3 className="service-title">{service.title}</h3>
                                <p className="service-description">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Témoignages Carrousel 3D */}
            <section className="section testimonials-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Ce que disent nos clients</h2>
                    </div>

                    <div className="testimonials-carousel">
                        {allTestimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className={`testimonial-card ${
                                    index === currentTestimonial
                                        ? 'active'
                                        : index === (currentTestimonial - 1 + allTestimonials.length) % allTestimonials.length
                                        ? 'prev'
                                        : index === (currentTestimonial + 1) % allTestimonials.length
                                        ? 'next'
                                        : ''
                                }`}
                            >
                                <p className="testimonial-quote">"{testimonial.quote}"</p>
                                <div className="testimonial-author">{testimonial.author}</div>
                                <div className="testimonial-role">{testimonial.role}</div>
                            </div>
                        ))}
                    </div>

                    <div className="carousel-dots">
                        {allTestimonials.map((_, index) => (
                            <div
                                key={index}
                                className={`carousel-dot ${index === currentTestimonial ? 'active' : ''}`}
                                onClick={() => setCurrentTestimonial(index)}
                            />
                        ))}
                    </div>

                    {/* Formulaire de témoignage */}
                    <div style={{ marginTop: '4rem' }}>
                        <TestimonialForm />
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="cta-section">
                <div className="container">
                    <h2>Prêt à planifier votre événement ?</h2>
                    <p>Réservez dès maintenant et bénéficiez de nos services premium</p>
                    <Link to="/planifier" className="btn btn-accent" style={{ fontSize: '1.2rem', padding: '1rem 2.5rem' }}>
                        Commencer maintenant →
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default Home;
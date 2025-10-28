import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { eventService } from '../services/eventService';
import TestimonialForm from '../components/TestimonialForm';
import EventCard from '../components/EventCard';
import Calendar from '../components/Calendar';
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

    const [allTestimonials, setAllTestimonials] = useState(staticTestimonials);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

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

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsLoading(true);
                const data = await eventService.getPublicEvents();
                
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

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/testimonials/recent');
                const data = await response.json();
                
                const formatted = data.map(t => ({
                    quote: t.comment,
                    author: t.client_name,
                    role: "Client NetandPro"
                }));

                setAllTestimonials([...staticTestimonials, ...formatted]);
            } catch (error) {
                console.error('Erreur chargement témoignages:', error);
            }
        };

        fetchTestimonials();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % allTestimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [allTestimonials.length]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item) => observer.observe(item));

        return () => observer.disconnect();
    }, [upcomingEvents]);

    const getStatusColor = (status) => {
        switch(status) {
            case 'Confirmé': return '#10b981';
            case 'En attente': return '#f59e0b';
            case 'Annulé': return '#ef4444';
            default: return '#6b7280';
        }
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container hero-content">
                    <h1>Planifiez vos événements avec NetandPro</h1>
                    <p>
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

                    <Calendar 
                        events={events}
                        filter={filter}
                        onFilterChange={setFilter}
                        isLoading={isLoading}
                    />
                </div>
            </section>

            {/* Événements à venir */}
            <section className="section timeline-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Événements à venir</h2>
                        <p className="section-subtitle">
                            Les prochains événements confirmés
                        </p>
                    </div>

                    {upcomingEvents.length > 0 ? (
                        <div className="timeline">
                            {upcomingEvents.map((event, index) => (
                                <EventCard 
                                    key={event.id} 
                                    event={event} 
                                    index={index} 
                                />
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

            {/* Témoignages Carrousel 3D - VERSION ORIGINALE */}
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

                    <TestimonialForm />
                </div>
            </section>

            {/* CTA Final */}
            <section className="cta-section">
                <div className="container">
                    <h2>Prêt à planifier votre événement ?</h2>
                    <p>Contactez-nous dès maintenant pour une consultation gratuite</p>
                    <Link to="/planifier" className="btn btn-accent" style={{ marginTop: '1rem' }}>
                        Commencer maintenant
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default Home;
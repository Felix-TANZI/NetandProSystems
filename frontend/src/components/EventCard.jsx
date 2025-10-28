import React from 'react';
import { Calendar, MapPin, User } from 'lucide-react';
import PropTypes from 'prop-types';

function EventCard({ event, index }) {
    const getStatusClass = (status) => {
        switch(status) {
            case 'Confirmé':
                return 'status-confirmed';
            case 'En attente':
                return 'status-pending';
            case 'Annulé':
                return 'status-cancelled';
            default:
                return 'status-pending';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
    };

    return (
        <div 
            className="timeline-item" 
            style={{ transitionDelay: `${index * 0.1}s` }}
        >
            <div className="timeline-card">
                <div className="timeline-date">
                    <Calendar size={18} strokeWidth={2} />
                    {formatDate(event.date_start)}
                </div>
                
                <h3 className="timeline-title">
                    <User size={20} strokeWidth={2} />
                    {event.client_name}
                </h3>
                
                <div className="timeline-location">
                    <MapPin size={16} strokeWidth={2} />
                    {event.location_name}
                </div>
                
                <span className={`status-badge ${getStatusClass(event.status)}`}>
                    {event.status}
                </span>
            </div>
        </div>
    );
}

EventCard.propTypes = {
    event: PropTypes.shape({
        id: PropTypes.number.isRequired,
        client_name: PropTypes.string.isRequired,
        location_name: PropTypes.string.isRequired,
        date_start: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired
    }).isRequired,
    index: PropTypes.number
};

EventCard.defaultProps = {
    index: 0
};

export default EventCard;
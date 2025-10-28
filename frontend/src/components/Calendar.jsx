import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Calendar as CalendarIcon, Filter } from 'lucide-react';
import PropTypes from 'prop-types';

function Calendar({ events, filter, onFilterChange, isLoading }) {
    // Filtrer les événements selon le filtre actif
    const getFilteredEvents = () => {
        if (filter === 'all') return events;
        
        return events.filter(event => {
            const status = event.extendedProps?.status || '';
            if (filter === 'confirmed') return status === 'Confirmé';
            if (filter === 'pending') return status === 'En attente';
            return true;
        });
    };

    const filteredEvents = getFilteredEvents();

    // Compter les événements par statut
    const getCount = (filterType) => {
        if (filterType === 'all') return events.length;
        
        return events.filter(e => {
            const status = e.extendedProps?.status || '';
            if (filterType === 'confirmed') return status === 'Confirmé';
            if (filterType === 'pending') return status === 'En attente';
            return false;
        }).length;
    };

    return (
        <div className="calendar-component">
            <div className="calendar-header">
                <div className="calendar-title">
                    <CalendarIcon size={24} strokeWidth={2} />
                    <h3>Calendrier des événements</h3>
                </div>
                
                <div className="calendar-filters">
                    <Filter size={18} strokeWidth={2} />
                    <button 
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`} 
                        onClick={() => onFilterChange('all')}
                    >
                        Tous ({getCount('all')})
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`} 
                        onClick={() => onFilterChange('confirmed')}
                    >
                        Confirmés ({getCount('confirmed')})
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'pending' ? 'active' : ''}`} 
                        onClick={() => onFilterChange('pending')}
                    >
                        En attente ({getCount('pending')})
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="calendar-loading">
                    <div className="spinner"></div>
                    <p>Chargement du calendrier...</p>
                </div>
            ) : (
                <div className="calendar-wrapper">
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={filteredEvents}
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
                        height="auto"
                        eventTimeFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        }}
                        displayEventTime={true}
                        eventDisplay="block"
                        dayMaxEvents={3}
                        moreLinkText="événements"
                        noEventsContent="Aucun événement pour cette période"
                    />
                </div>
            )}
        </div>
    );
}

Calendar.propTypes = {
    events: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string.isRequired,
        start: PropTypes.string.isRequired,
        end: PropTypes.string,
        backgroundColor: PropTypes.string,
        borderColor: PropTypes.string,
        extendedProps: PropTypes.object
    })).isRequired,
    filter: PropTypes.oneOf(['all', 'confirmed', 'pending']).isRequired,
    onFilterChange: PropTypes.func.isRequired,
    isLoading: PropTypes.bool
};

Calendar.defaultProps = {
    isLoading: false
};

export default Calendar;
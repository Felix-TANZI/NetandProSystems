import React, { useState } from 'react';

function TestimonialForm() {
    const [formData, setFormData] = useState({
        clientName: '',
        comment: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.clientName || formData.clientName.trim().length < 2) {
            newErrors.clientName = 'Le nom doit contenir au moins 2 caractères';
        }

        if (!formData.comment || formData.comment.trim().length < 10) {
            newErrors.comment = 'Le commentaire doit contenir au moins 10 caractères';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/testimonials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setSubmitted(true);
                setFormData({ clientName: '', comment: '' });
                setTimeout(() => setSubmitted(false), 5000);
            } else {
                alert('Erreur lors de l\'envoi du témoignage');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div style={{
                background: '#d1fae5',
                padding: '2rem',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid #a7f3d0'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ color: '#065f46', marginBottom: '0.5rem' }}>Merci pour votre témoignage !</h3>
                <p style={{ color: '#047857' }}>Votre avis a été enregistré avec succès.</p>
            </div>
        );
    }

    return (
        <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-md)',
            maxWidth: '600px',
            margin: '0 auto'
        }}>
            <h3 style={{ 
                color: 'var(--dark)', 
                marginBottom: '1rem',
                textAlign: 'center' 
            }}>
                ✍️ Partagez votre expérience
            </h3>
            <p style={{ 
                color: 'var(--gray)', 
                textAlign: 'center',
                marginBottom: '2rem' 
            }}>
                Vous avez travaillé avec nous ? Laissez-nous un témoignage !
            </p>

            <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label required">Votre nom</label>
                    <input
                        type="text"
                        name="clientName"
                        className={`form-input ${errors.clientName ? 'error' : ''}`}
                        value={formData.clientName}
                        onChange={handleChange}
                        placeholder="Ex: Felix NZKO"
                    />
                    {errors.clientName && <span className="form-error">{errors.clientName}</span>}
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label required">Votre témoignage</label>
                    <textarea
                        name="comment"
                        className={`form-textarea ${errors.comment ? 'error' : ''}`}
                        value={formData.comment}
                        onChange={handleChange}
                        placeholder="Partagez votre expérience avec Netandprosystems..."
                        rows="5"
                        style={{ resize: 'vertical' }}
                    />
                    {errors.comment && <span className="form-error">{errors.comment}</span>}
                    <small style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>
                        Minimum 10 caractères
                    </small>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ width: '100%', padding: '1rem' }}
                >
                    {loading ? 'Envoi en cours...' : 'Envoyer mon témoignage'}
                </button>
            </form>
        </div>
    );
}

export default TestimonialForm;
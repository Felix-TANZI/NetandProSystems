import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/admin.css';

function AdminPassword() {
    const { changePassword } = useAuth();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrors({ ...errors, [e.target.name]: '' });
        setMessage({ type: '', text: '' });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Mot de passe actuel requis';
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'Nouveau mot de passe requis';
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirmation requise';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        if (formData.currentPassword === formData.newPassword) {
            newErrors.newPassword = 'Le nouveau mot de passe doit être différent de l\'ancien';
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
        const result = await changePassword(formData.currentPassword, formData.newPassword);

        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } else {
            setMessage({ type: 'error', text: result.message });
        }

        setLoading(false);
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />

            <main className="admin-main">
                <div className="admin-header">
                    <h1>🔑 Changer le mot de passe</h1>
                </div>

                <div className="admin-card" style={{ maxWidth: '600px' }}>
                    <h2>Sécurité du compte</h2>
                    <p style={{ color: 'var(--gray)', marginBottom: '2rem' }}>
                        Votre mot de passe expire tous les 3 mois. Changez-le régulièrement pour garantir la sécurité de votre compte.
                    </p>

                    {message.text && (
                        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '1.5rem' }}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label required">Mot de passe actuel</label>
                            <input
                                type="password"
                                name="currentPassword"
                                className={`form-input ${errors.currentPassword ? 'error' : ''}`}
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                            />
                            {errors.currentPassword && <span className="form-error">{errors.currentPassword}</span>}
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label required">Nouveau mot de passe</label>
                            <input
                                type="password"
                                name="newPassword"
                                className={`form-input ${errors.newPassword ? 'error' : ''}`}
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                            />
                            {errors.newPassword && <span className="form-error">{errors.newPassword}</span>}
                            <small style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>
                                Minimum 8 caractères
                            </small>
                        </div>

                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label className="form-label required">Confirmer le nouveau mot de passe</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ width: '100%', padding: '1rem' }}
                        >
                            {loading ? 'Modification...' : 'Changer le mot de passe'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default AdminPassword;
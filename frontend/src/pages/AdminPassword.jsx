import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import { KeyRound, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
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
                    <h1>
                        <KeyRound size={32} strokeWidth={2.5} />
                        Changer le mot de passe
                    </h1>
                </div>

                <div className="admin-card" style={{ maxWidth: '700px' }}>
                    <div className="password-header">
                        <Lock size={32} color="var(--admin-accent)" />
                        <div>
                            <h2>Sécurité du compte</h2>
                            <p style={{ color: 'var(--admin-text-muted)', marginTop: '0.5rem' }}>
                                Votre mot de passe expire tous les 3 mois. Changez-le régulièrement pour garantir la sécurité de votre compte.
                            </p>
                        </div>
                    </div>

                    {message.text && (
                        <div className={`alert alert-${message.type}`}>
                            {message.type === 'success' ? (
                                <CheckCircle2 size={20} />
                            ) : (
                                <AlertCircle size={20} />
                            )}
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="password-form">
                        <div className="form-group">
                            <label className="form-label">
                                <Lock size={18} />
                                Mot de passe actuel
                            </label>
                            <input
                                type="password"
                                name="currentPassword"
                                className={`form-input ${errors.currentPassword ? 'error' : ''}`}
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                            />
                            {errors.currentPassword && (
                                <span className="form-error">
                                    <AlertCircle size={14} />
                                    {errors.currentPassword}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <Lock size={18} />
                                Nouveau mot de passe
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                className={`form-input ${errors.newPassword ? 'error' : ''}`}
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                            />
                            {errors.newPassword && (
                                <span className="form-error">
                                    <AlertCircle size={14} />
                                    {errors.newPassword}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <Lock size={18} />
                                Confirmer le mot de passe
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && (
                                <span className="form-error">
                                    <AlertCircle size={14} />
                                    {errors.confirmPassword}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}
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
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, LogIn } from 'lucide-react';
import '../styles/admin.css';

function AdminLogin() {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [passwordExpired, setPasswordExpired] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData.email, formData.password);

        if (!result.success) {
            setError(result.message);
            setPasswordExpired(result.passwordExpired || false);
        }

        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className="login-card">
                <div className="login-header">
                    <div className="login-icon">
                        <Shield size={48} strokeWidth={2} />
                    </div>
                    <h1>Admin Panel</h1>
                    <p>NetandPro Systems - Espace Administrateur</p>
                </div>

                {error && (
                    <div className={`alert ${passwordExpired ? 'alert-warning' : 'alert-error'}`}>
                        {error}
                    </div>
                )}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">
                            <Mail size={18} />
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="admin@netandpro.com"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <Lock size={18} />
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-login"
                        disabled={loading}
                    >
                        <LogIn size={20} />
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>© 2025 NetandPro Systems. Tous droits réservés.</p>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
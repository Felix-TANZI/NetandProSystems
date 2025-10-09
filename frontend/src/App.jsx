import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages publiques
import Home from './pages/Home';
import Planifier from './pages/Planifier';
import About from './pages/About';

// Pages admin
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminEvents from './pages/AdminEvents';
import AdminPassword from './pages/AdminPassword';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Routes publiques avec Navbar/Footer */}
                    <Route path="/*" element={
                        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                            <Navbar />
                            <main style={{ flex: 1 }}>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/planifier" element={<Planifier />} />
                                    <Route path="/about" element={<About />} />
                                </Routes>
                            </main>
                            <Footer />
                        </div>
                    } />

                    {/* Route de connexion admin (sans Navbar/Footer) */}
                    <Route path="/admin" element={<AdminLogin />} />

                    {/* Routes admin protégées (sans Navbar/Footer) */}
                    <Route path="/admin/dashboard" element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/events" element={
                        <ProtectedRoute>
                            <AdminEvents />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/password" element={
                        <ProtectedRoute>
                            <AdminPassword />
                        </ProtectedRoute>
                    } />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
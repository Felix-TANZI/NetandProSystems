const pool = require('../config/database');

// Statistiques générales
exports.getStats = async (req, res) => {
    try {
        // Total événements
        const [totalResult] = await pool.execute(
            'SELECT COUNT(*) as total FROM events'
        );

        // Par statut
        const [statusResult] = await pool.execute(`
            SELECT status, COUNT(*) as count 
            FROM events 
            GROUP BY status
        `);

        // Par mois (année en cours)
        const [monthlyResult] = await pool.execute(`
            SELECT 
                MONTH(date_start) as month,
                COUNT(*) as count
            FROM events
            WHERE YEAR(date_start) = YEAR(CURDATE())
            GROUP BY MONTH(date_start)
            ORDER BY month
        `);

        // Services les plus demandés
        const [servicesResult] = await pool.execute(`
            SELECT services FROM events
        `);

        // Compter les services
        const servicesCount = {};
        servicesResult.forEach(row => {
            const services = JSON.parse(row.services);
            services.forEach(service => {
                servicesCount[service] = (servicesCount[service] || 0) + 1;
            });
        });

        // Trier par popularité
        const topServices = Object.entries(servicesCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

        res.json({
            total: totalResult[0].total,
            byStatus: statusResult,
            byMonth: monthlyResult,
            topServices
        });

    } catch (error) {
        console.error('Erreur récupération stats:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
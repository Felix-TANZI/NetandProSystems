import React from 'react';

function Footer() {
    return (
        <footer style={styles.footer}>
            <div className="container" style={styles.content}>
                <p>&copy; 2025 NetandProSystems. Tous droits réservés.</p>
                <div style={styles.links}>
                    <a href="https://www.netandprosystems.com" target="_blank" rel="noopener noreferrer">
                        Site principal
                    </a>
                    <span style={styles.separator}>|</span>
                    <a href="tanzifelix@gmail.com">Contact</a>
                </div>
            </div>
        </footer>
    );
}

const styles = {
    footer: {
        background: '#1f2937',
        color: '#fff',
        padding: '2rem 0',
        marginTop: '4rem',
        textAlign: 'center'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    links: {
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        alignItems: 'center'
    },
    separator: {
        color: '#6b7280'
    }
};

export default Footer;
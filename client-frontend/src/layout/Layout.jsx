// Layout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent'; // Cambiar este import
import { useState } from 'react';
import { CookieProvider } from '../contexts/CookieContext';

const Layout = () => {
    const [username, setUsername] = useState(localStorage.getItem('name') || '');

    return (
        <CookieProvider>
            <Navbar username={username} />
            <Outlet context={{ setUsername }} />
            <Footer />
            <CookieConsent /> {/* Cambiar este componente */}
        </CookieProvider>
    );
};

export default Layout;



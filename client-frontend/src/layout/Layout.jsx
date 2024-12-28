// Layout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';

const Layout = () => {
    const [username, setUsername] = useState(localStorage.getItem('name') || '');

    return (
        <>
            <Navbar username={username} />
            <Outlet context={{ setUsername }} />
            <Footer />
        </>
    );
};

export default Layout;



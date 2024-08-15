import React, { useState, useEffect } from 'react';
import Login from './views/Login';
import Signup from './views/Signup';
import Dashboard from './views/Dashboard';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [user, setUser] = useState(null);
    const [isSigningUp, setIsSigningUp] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogin = (username) => {
        setUser({ username });
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const handleSignup = (username) => {
        setUser({ username });
        setIsSigningUp(false);
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100'>
            <ToastContainer />
            {user ? (
                <Dashboard onLogout={handleLogout} />
            ) : (
                isSigningUp ? (
                    <Signup onSignup={handleSignup} />
                ) : (
                    <Login onLogin={handleLogin} onSignupClick={() => setIsSigningUp(true)} />
                )
            )}
        </div>
    );
}

export default App;

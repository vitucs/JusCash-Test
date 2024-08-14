import React, { useState, useEffect } from 'react';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import './index.css';

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

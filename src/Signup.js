import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

function validatePassword(password) {
    const minLength = 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const hasNumericChar = /[0-9]/;
    const hasAlphanumericChar = /[a-zA-Z]/;

    if (password.length < minLength) {
        return 'A senha deve ter pelo menos 8 caracteres.';
    }
    if (!hasSpecialChar.test(password)) {
        return 'A senha deve conter pelo menos um caractere especial.';
    }
    if (!hasNumericChar.test(password)) {
        return 'A senha deve conter pelo menos um caractere numérico.';
    }
    if (!hasAlphanumericChar.test(password)) {
        return 'A senha deve conter pelo menos um caractere alfanumérico.';
    }
    return null; // Senha válida
}

function Signup({ onSignup }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const passwordError = validatePassword(password);

        if (passwordError) {
            alert(passwordError);
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.email === email);

        if (userExists) {
            alert('Nome de usuário já existe');
        } else if (password !== passwordConfirm) {
            alert('As senhas não são iguais');
        } else {
            const newUser = { email, password };
            localStorage.setItem('users', JSON.stringify([...users, newUser]));

            localStorage.setItem('user', JSON.stringify({ email }));

            onSignup(email);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(prevState => !prevState);
    };

    const handleTogglePasswordConfirm = () => {
        setShowPasswordConfirm(prevState => !prevState);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Seu nome completo:*</label>
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Email:*</label>
                <input 
                    type="text" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Senha:</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={handleTogglePassword}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                            ) : (
                                <EyeIcon className="h-5 w-5 text-gray-500" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Confirme sua senha:</label>
                    <div className="relative">
                        <input
                            type={showPasswordConfirm ? 'text' : 'password'}
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={handleTogglePasswordConfirm}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                            {showPasswordConfirm ? (
                                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                            ) : (
                                <EyeIcon className="h-5 w-5 text-gray-500" />
                            )}
                        </button>
                    </div>
                </div>
            <button 
                type="submit" 
                className="w-full bg-customBlue text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Criar Conta
            </button>
        </form>
    );
}

export default Signup;

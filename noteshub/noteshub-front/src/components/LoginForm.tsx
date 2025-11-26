import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/user';
import { Link } from 'react-router-dom';
import useUserStore from '../store/userStore';

const LoginForm = () => {
    const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setToken);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) return;

        try {
            const res = await login({ email, password });
            if (res) {
                setUser({
                    name: res.name,
                    email: res.email
                });
                setToken(res.token);
                
                navigate('/notes');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Iniciar Sesión
                        </h2>
                        <p className="text-gray-600">Accede a tus notas</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>

                        <div>
                            <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Correo Electrónico
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="email@ejemplo.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex items-center justify-end">
                            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            Iniciar Sesión
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-center text-sm text-gray-600">
                            ¿No tienes cuenta?
                            <Link
                                to="/register"
                                className="ml-2 font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>

                </div>
            </div></>
    );
};

export default LoginForm;

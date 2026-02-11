import React, { useState } from 'react';
import { Mail, Lock, UserPlus, ArrowRight, Loader2 } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: 'info', message: 'Creating your account...' });

        try {
            const response = await fetch('http://127.0.0.1:8000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ type: 'success', message: '✅ Account created successfully! You can now log in.' });
                setFormData({ email: '', password: '' });
            } else {
                setStatus({ type: 'error', message: `❌ ${data.detail || 'Signup failed. Please try again.'}` });
            }
        } catch (error) {
            setStatus({ type: 'error', message: '❌ Network error. Please check if the backend is running.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
            <div className="w-full max-w-md">
                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] border border-white p-8 md:p-10">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white mb-6 shadow-xl shadow-indigo-200 ring-8 ring-indigo-50">
                            <UserPlus size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Create an account</h1>
                        <p className="text-gray-500">Start your journey with us today</p>
                    </div>

                    {status.message && (
                        <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                status.type === 'info' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                                    'bg-rose-50 text-rose-700 border border-rose-100'
                            }`}>
                            <span className="text-sm font-medium">{status.message}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-200"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-200"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative group overflow-hidden bg-indigo-600 disabled:bg-indigo-400 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-gray-500 text-sm">
                            Already have an account?{' '}
                            <a href="/login" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                                Log in
                            </a>
                        </p>
                    </div>
                </div>

                {/* Background Blobs */}
                <div className="fixed top-20 -left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob -z-10"></div>
                <div className="fixed bottom-20 -right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 -z-10"></div>
            </div>
        </div>
    );
};

export default Signup;
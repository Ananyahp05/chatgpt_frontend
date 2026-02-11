import React, { useState } from 'react';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Action: Connect to http://127.0.0.1
    console.log('Form Data:', formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900">Sign Up</h2>
          <p className="mt-2 text-sm text-gray-500">Join the squad today.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent outline-none transition-all"
              placeholder="alex@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold shadow-md hover:bg-indigo-700 hover:shadow-lg transform transition-active:scale-95 transition-all"
          >
            Create Account
          </button>
        </form>

        <div className="mt-8 text-center">
          <span className="text-sm text-gray-600">Already a member? </span>
          <a href="/login" className="text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;

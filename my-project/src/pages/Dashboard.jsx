import React, { useState } from 'react';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Example data for the dashboard
  const stats = [
    { name: 'Total Revenue', value: '$45,231', change: '+12.5%', icon: '💰' },
    { name: 'Active Users', value: '2,345', change: '+3.2%', icon: '👥' },
    { name: 'New Signups', value: '122', change: '+18.1%', icon: '📈' },
    { name: 'Server Uptime', value: '99.9%', change: 'Stable', icon: '⚡' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-indigo-700 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-6 flex items-center gap-3">
          <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
            <div className="h-5 w-5 bg-indigo-600 rounded-sm"></div>
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">AdminPro</span>}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {['Dashboard', 'Analytics', 'Users', 'Settings'].map((item) => (
            <a key={item} href="#" className="flex items-center p-3 rounded-lg hover:bg-indigo-600 transition-colors group">
              <span className="text-xl">📁</span>
              {isSidebarOpen && <span className="ml-3 font-medium">{item}</span>}
            </a>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="m-4 p-3 flex items-center rounded-lg bg-indigo-800 hover:bg-red-500 transition-colors"
        >
          <span>🚪</span>
          {isSidebarOpen && <span className="ml-3 font-medium">Logout</span>}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-500 hover:text-indigo-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">4mh23cs010@gmail.com</span>
            <div className="h-10 w-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
              JD
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
            <p className="text-gray-500">Welcome back! Here is what's happening today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">{stat.name}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Recent Transactions</h3>
              <button className="text-sm text-indigo-600 font-semibold hover:underline">View All</button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs uppercase font-semibold">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[1, 2, 3].map((i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">User_{i}@example.com</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs">Completed</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">$240.00</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Feb 11, 2026</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
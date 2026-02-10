'use client';

import { FC, useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Eye, Trash2, User, TrendingUp, Flag, Clock } from 'lucide-react';

const AdminDashboardPage: FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'moderation' | 'users' | 'audit'>('overview');
  const [flaggedListings, setFlaggedListings] = useState([
    {
      id: '1',
      title: 'Suspicious Rental Listing',
      reason: 'Potential scam - unusually low price',
      flaggedBy: 'user_123',
      status: 'pending',
      createdAt: '2 hours ago',
    },
    {
      id: '2',
      title: 'Offensive Content',
      reason: 'Contains inappropriate language',
      flaggedBy: 'user_456',
      status: 'pending',
      createdAt: '4 hours ago',
    },
  ]);

  const stats = [
    { label: 'Total Listings', value: '1,234', icon: TrendingUp, color: 'blue' },
    { label: 'Pending Moderation', value: '23', icon: Clock, color: 'yellow' },
    { label: 'Flagged Content', value: '8', icon: Flag, color: 'red' },
    { label: 'Active Users', value: '856', icon: User, color: 'green' },
  ];

  const recentActions = [
    {
      action: 'Approved Listing',
      user: 'listing_567',
      time: '2 minutes ago',
      type: 'success',
    },
    {
      action: 'Suspended User',
      user: 'user_890',
      time: '45 minutes ago',
      type: 'warning',
    },
    {
      action: 'Deleted Inappropriate Content',
      user: 'listing_234',
      time: '2 hours ago',
      type: 'error',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Platform moderation and management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      stat.color === 'blue'
                        ? 'bg-blue-100 text-blue-600'
                        : stat.color === 'yellow'
                        ? 'bg-yellow-100 text-yellow-600'
                        : stat.color === 'red'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-green-100 text-green-600'
                    }`}
                  >
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-md mb-8">
          <div className="border-b border-gray-200 flex">
            {['overview', 'moderation', 'users', 'audit'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-4 font-medium transition capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Admin Actions</h2>
                  <div className="space-y-3">
                    {recentActions.map((action, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {action.type === 'success' && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                          {action.type === 'warning' && (
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          )}
                          {action.type === 'error' && (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{action.action}</p>
                            <p className="text-sm text-gray-600">{action.user}</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-600">{action.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'moderation' && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Flagged Content</h2>
                <div className="space-y-3">
                  {flaggedListings.map((listing) => (
                    <div key={listing.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Flag className="w-4 h-4 text-red-600" />
                          <p className="font-medium text-gray-900">{listing.title}</p>
                        </div>
                        <p className="text-sm text-gray-600">Reason: {listing.reason}</p>
                        <p className="text-xs text-gray-500 mt-1">Reported {listing.createdAt} by {listing.flaggedBy}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition">
                          Approve
                        </button>
                        <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">User Management</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">User</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Listings</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3].map((i) => (
                        <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">user_{i}@example.com</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                              Active
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium">{i}</td>
                          <td className="px-4 py-3 text-sm space-x-2">
                            <button className="text-blue-600 hover:underline">Verify</button>
                            <button className="text-red-600 hover:underline">Suspend</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'audit' && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Audit Log</h2>
                <p className="text-gray-600">All admin actions are logged for compliance and security. Coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

'use client'

import { useEffect, useState } from 'react'
import StatCard from '@/components/admin/StatCard'

interface UserStats {
  totalUsers: number
  totalVendors: number
  activeUsersToday: number
  dailyActiveUsers: number
  newUsersThisWeek: number
  retentionRate: number
  avgSessionTime: string
  collegeDistribution: Array<{
    college: string
    count: number
  }>
  systemStatus: {
    database: string
    api: string
    storage: string
  }
  loading: boolean
  error: string | null
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    totalVendors: 0,
    activeUsersToday: 0,
    dailyActiveUsers: 0,
    newUsersThisWeek: 0,
    retentionRate: 0,
    avgSessionTime: '0m 0s',
    collegeDistribution: [],
    systemStatus: {
      database: 'unknown',
      api: 'unknown',
      storage: '0%'
    },
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await fetch('/api/admin/users')
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`)
        }
        const data = await res.json()
        if (!data?.success || !data?.stats) {
          throw new Error('Invalid response from server')
        }

        setStats({
          ...data.stats,
          loading: false,
          error: null,
        })
      } catch (err) {
        console.error('Failed to load admin stats', err)
        setStats(s => ({
          ...s,
          loading: false,
          error: 'Failed to load stats',
          systemStatus: {
            database: 'error',
            api: 'error',
            storage: '0%',
          },
        }))
      }
    }

    fetchUserStats()
  }, [])

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Key metrics for platform performance</p>
        </div>

        {/* Main Metrics - Users & Vendors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <StatCard
            title="Total Users"
            icon="👥"
            value={stats.totalUsers}
            loading={stats.loading}
            error={stats.error}
          />
          <StatCard
            title="Total Vendors"
            icon="🛍️"
            value={stats.totalVendors}
            loading={stats.loading}
            error={stats.error}
          />
        </div>

        {/* Activity Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Active Users Today */}
          <div className="group relative">
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 hover-lift glass-effect overflow-hidden p-6">
              {/* Subtle Animated Border */}
              <div className="absolute inset-0 border border-transparent bg-gradient-to-r from-gray-200 via-transparent to-gray-200 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>

              <div className="relative">
                {/* Smaller Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center">
                    <span className="text-xl">⚡</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Active Today</div>
                  </div>
                </div>

                {/* Smaller Big Number */}
                <div className="mb-4">
                  {stats.loading ? (
                    <div className="animate-pulse">
                      <div className="h-12 bg-gray-200 rounded-lg w-32"></div>
                    </div>
                  ) : stats.error ? (
                    <div className="text-red-600 text-lg font-medium">
                      Error
                    </div>
                  ) : (
                    <div className="text-5xl font-bold text-gray-700 mb-1">
                      {stats.activeUsersToday.toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Smaller Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  Users active on the platform today
                </p>

                {/* Smaller Progress bar */}
                <div className="mt-6">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-gray-400 to-gray-600 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Smaller Geometric Accent */}
              <div className="absolute bottom-3 right-3 w-16 h-16 border border-gray-200 opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-lg"></div>
            </div>
          </div>

          {/* Growth Rate */}
          <div className="group relative">
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 hover-lift glass-effect overflow-hidden p-6">
              {/* Subtle Animated Border */}
              <div className="absolute inset-0 border border-transparent bg-gradient-to-r from-gray-200 via-transparent to-gray-200 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>

              <div className="relative">
                {/* Smaller Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center">
                    <span className="text-xl">📈</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Growth Rate</div>
                  </div>
                </div>

                {/* Smaller Big Number */}
                <div className="mb-4">
                  <div className="text-5xl font-bold text-gray-700 mb-1">
                    +12%
                  </div>
                </div>

                {/* Smaller Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  Monthly user growth rate
                </p>

                {/* Smaller Progress bar */}
                <div className="mt-6">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-gray-400 to-gray-600 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Smaller Geometric Accent */}
              <div className="absolute bottom-3 right-3 w-16 h-16 border border-gray-200 opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-lg"></div>
            </div>
          </div>

        </div>

        {/* College Distribution Section */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-black/10 glass-effect overflow-hidden p-8 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">Users by College</h3>
            <div className="text-xs text-gray-600">Top 10 universities</div>
          </div>
          {stats.loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : stats.collegeDistribution.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-gray-600">No college data available yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-600">#</th>
                    <th className="px-4 py-3 font-medium text-gray-600">College</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Students</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.collegeDistribution.slice(0, 10).map((college, index) => (
                    <tr key={college.college} className="border-b last:border-0 border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 w-12 text-gray-700">{index + 1}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{college.college}</td>
                      <td className="px-4 py-3 text-gray-900">{college.count.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-700">{((college.count / stats.totalUsers) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Additional Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Quick Stats */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-black/10 glass-effect overflow-hidden">
            <div className="p-8">
              <h3 className="text-3xl font-bold text-black mb-8">Platform Metrics</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-black/5 rounded-2xl hover-lift">
                  <span className="text-black/70 text-lg">Daily Active Users</span>
                  <span className="text-black font-bold text-2xl">
                    {stats.loading ? '...' : stats.dailyActiveUsers.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-black/5 rounded-2xl hover-lift">
                  <span className="text-black/70 text-lg">New Users This Week</span>
                  <span className="text-black font-bold text-2xl">
                    {stats.loading ? '...' : stats.newUsersThisWeek.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-black/5 rounded-2xl hover-lift">
                  <span className="text-black/70 text-lg">Retention Rate</span>
                  <span className="text-black font-bold text-2xl">
                    {stats.loading ? '...' : `${stats.retentionRate}%`}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-black/5 rounded-2xl hover-lift">
                  <span className="text-black/70 text-lg">Avg. Session Time</span>
                  <span className="text-black font-bold text-2xl">
                    {stats.loading ? '...' : stats.avgSessionTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Geometric Accent */}
            <div className="absolute bottom-4 right-4 w-16 h-16 border border-black/10 rounded-full"></div>
          </div>

          {/* System Status */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-black/10 glass-effect overflow-hidden">
            <div className="p-8">
              <h3 className="text-3xl font-bold text-black mb-8">System Status</h3>
              <div className="space-y-6">
                <div className={`flex items-center justify-between p-4 rounded-2xl ${
                  stats.systemStatus.database === 'healthy'
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <span className="text-black/70 text-lg">Database</span>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 animate-pulse ${
                      stats.systemStatus.database === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className={`text-lg font-medium ${
                      stats.systemStatus.database === 'healthy' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {stats.systemStatus.database === 'healthy' ? 'Healthy' : 'Error'}
                    </span>
                  </div>
                </div>
                <div className={`flex items-center justify-between p-4 rounded-2xl ${
                  stats.systemStatus.api === 'healthy'
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <span className="text-black/70 text-lg">API Response</span>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 animate-pulse ${
                      stats.systemStatus.api === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className={`text-lg font-medium ${
                      stats.systemStatus.api === 'healthy' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {stats.systemStatus.api === 'healthy' ? 'Fast' : 'Error'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                  <span className="text-black/70 text-lg">Storage</span>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                    <span className="text-blue-700 text-lg font-medium">
                      {stats.systemStatus.storage} Used
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Geometric Accent */}
            <div className="absolute bottom-4 right-4 w-12 h-12 bg-black/10 rotate-45"></div>
          </div>
        </div>

        {/* Error Display */}
        {stats.error && (
          <div className="relative bg-red-50 backdrop-blur-sm border border-red-200 rounded-3xl p-8 glass-effect mb-16">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 border border-red-200 rounded-2xl flex items-center justify-center">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-bold text-red-800 mb-2">
                  Connection Error
                </h3>
                <div className="text-lg text-red-700">
                  {stats.error}
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-red-600 text-white px-6 py-3 rounded-xl text-lg font-medium hover:bg-red-700 transition-all duration-300 hover-lift"
                  >
                    Retry Connection 🔄
                  </button>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-4 left-4 w-8 h-8 border border-red-300 rounded-full"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 bg-red-200 rotate-45"></div>
          </div>
        )}

      </div>
    </div>
  )
}

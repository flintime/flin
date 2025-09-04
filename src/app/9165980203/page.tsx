'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

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
        const response = await fetch('/api/admin/users')
        const data = await response.json()

        if (data.success && data.stats) {
          setStats({
            totalUsers: data.stats.totalUsers,
            totalVendors: data.stats.totalVendors,
            activeUsersToday: data.stats.activeUsersToday,
            dailyActiveUsers: data.stats.dailyActiveUsers,
            newUsersThisWeek: data.stats.newUsersThisWeek,
            retentionRate: data.stats.retentionRate,
            avgSessionTime: data.stats.avgSessionTime,
            collegeDistribution: data.stats.collegeDistribution,
            systemStatus: data.stats.systemStatus,
            loading: false,
            error: null
          })
        } else {
          setStats({
            totalUsers: 0,
            totalVendors: 0,
            activeUsersToday: 0,
            dailyActiveUsers: 0,
            newUsersThisWeek: 0,
            retentionRate: 0,
            avgSessionTime: '0m 0s',
            collegeDistribution: [],
            systemStatus: {
              database: 'error',
              api: 'error',
              storage: '0%'
            },
            loading: false,
            error: data.error || 'Failed to fetch user stats'
          })
        }
      } catch (error) {
        setStats({
          totalUsers: 0,
          totalVendors: 0,
          activeUsersToday: 0,
          dailyActiveUsers: 0,
          newUsersThisWeek: 0,
          retentionRate: 0,
          avgSessionTime: '0m 0s',
          collegeDistribution: [],
          systemStatus: {
            database: 'error',
            api: 'error',
            storage: '0%'
          },
          loading: false,
          error: 'Failed to connect to server'
        })
      }
    }

    fetchUserStats()
  }, [])

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20"></div>

      {/* Floating Geometric Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-black/20 rounded-lg animate-float"></div>
      <div className="absolute top-40 right-20 w-12 h-12 border border-black/30 rotate-45 animate-float-delay"></div>
      <div className="absolute bottom-40 left-20 w-16 h-16 border border-black/20 rounded-full animate-float"></div>
      <div className="absolute bottom-20 right-10 w-8 h-8 bg-black animate-float-delay"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header with Flin Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center">
            <Image
              src="/flin.png"
              alt="Flin Logo"
              width={200}
              height={200}
              className="drop-shadow-lg"
              priority
            />
          </div>
        </div>

        {/* Main Metrics - Users & Vendors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Total Users Card */}
          <div className="group relative">
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-black/10 hover-lift glass-effect overflow-hidden p-10 shadow-xl">
              {/* Animated Border */}
              <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-black/5 via-transparent to-black/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative">
                {/* Icon */}
                <div className="flex items-center justify-between mb-10">
                  <div className="w-20 h-20 bg-black/5 border border-black/10 rounded-3xl flex items-center justify-center shadow-2xl">
                    <span className="text-4xl">👥</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-black/60 font-medium">Total Users</div>
                  </div>
                </div>

                {/* Big Number */}
                <div className="mb-8">
                  {stats.loading ? (
                    <div className="animate-pulse">
                      <div className="h-24 bg-black/10 rounded-xl w-64"></div>
                    </div>
                  ) : stats.error ? (
                    <div className="text-red-600 text-3xl font-medium">
                      Error loading data
                    </div>
                  ) : (
                    <div className="text-8xl lg:text-9xl font-black text-black mb-4">
                      {stats.totalUsers.toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-black/70 text-xl leading-relaxed font-medium">
                  Registered users on your platform
                </p>

                {/* Progress bar */}
                <div className="mt-10">
                  <div className="h-3 bg-black/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-black to-black/60 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Geometric Accent */}
              <div className="absolute bottom-6 right-6 w-32 h-32 border border-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </div>
          </div>

          {/* Total Vendors Card */}
          <div className="group relative">
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-black/10 hover-lift glass-effect overflow-hidden p-10 shadow-xl">
              {/* Animated Border */}
              <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-black/5 via-transparent to-black/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative">
                {/* Icon */}
                <div className="flex items-center justify-between mb-10">
                  <div className="w-20 h-20 bg-black/5 border border-black/10 rounded-3xl flex items-center justify-center shadow-2xl">
                    <span className="text-4xl">🏪</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-black/60 font-medium">Total Vendors</div>
                  </div>
                </div>

                {/* Big Number */}
                <div className="mb-8">
                  {stats.loading ? (
                    <div className="animate-pulse">
                      <div className="h-24 bg-black/10 rounded-xl w-64"></div>
                    </div>
                  ) : stats.error ? (
                    <div className="text-red-600 text-3xl font-medium">
                      Error loading data
                    </div>
                  ) : (
                    <div className="text-8xl lg:text-9xl font-black text-black mb-4">
                      {stats.totalVendors.toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-black/70 text-xl leading-relaxed font-medium">
                  Registered vendors on your platform
                </p>

                {/* Progress bar */}
                <div className="mt-10">
                  <div className="h-3 bg-black/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-black to-black/60 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Geometric Accent */}
              <div className="absolute bottom-6 right-6 w-32 h-32 border border-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </div>
          </div>
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
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-black">🎓 Users by College</h3>
            <div className="text-sm text-black/60">
              Top 10 universities
            </div>
          </div>

          <div className="space-y-4">
            {stats.loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-12 bg-black/10 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : stats.collegeDistribution.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📊</div>
                <p className="text-black/60 text-lg">No college data available yet</p>
              </div>
            ) : (
              stats.collegeDistribution.map((college, index) => (
                <div
                  key={college.college}
                  className="group flex items-center justify-between p-4 bg-black/5 rounded-2xl hover-lift transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-black/10 border border-black/20 rounded-lg flex items-center justify-center text-sm font-bold text-black">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-black text-lg">
                        {college.college}
                      </div>
                      <div className="text-sm text-black/60">
                        {((college.count / stats.totalUsers) * 100).toFixed(1)}% of total users
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-black">
                      {college.count.toLocaleString()}
                    </div>
                    <div className="text-sm text-black/60">students</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          {!stats.loading && stats.collegeDistribution.length > 0 && (
            <div className="mt-8 pt-6 border-t border-black/10">
              <div className="text-center">
                <p className="text-black/70 text-lg">
                  Total students from {stats.collegeDistribution.length} colleges
                </p>
                <p className="text-black/60 text-sm mt-1">
                  Data shows university distribution across your platform
                </p>
              </div>
            </div>
          )}

          {/* Geometric Accent */}
          <div className="absolute bottom-4 right-4 w-16 h-16 border border-black/10 rounded-full"></div>
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

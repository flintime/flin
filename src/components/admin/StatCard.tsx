interface StatCardProps {
  title: string
  value: string | number
  icon?: string
  loading?: boolean
  error?: string | null
}

export default function StatCard({ title, value, icon, loading, error }: StatCardProps) {
  return (
    <div className="group relative">
      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-black/10 hover-lift glass-effect overflow-hidden p-10 shadow-xl">
        <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-black/5 via-transparent to-black/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative">
          <div className="flex items-center justify-between mb-10">
            <div className="w-20 h-20 bg-black/5 border border-black/10 rounded-3xl flex items-center justify-center shadow-2xl">
              <span className="text-4xl">{icon}</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-black/60 font-medium">{title}</div>
            </div>
          </div>

          <div className="mb-8">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-24 bg-black/10 rounded-xl w-64"></div>
              </div>
            ) : error ? (
              <div className="text-red-600 text-3xl font-medium">Error loading data</div>
            ) : (
              <div className="text-8xl lg:text-9xl font-black text-black mb-4">{typeof value === 'number' ? value.toLocaleString() : value}</div>
            )}
          </div>

          <div className="h-3 bg-black/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-black to-black/60 rounded-full"></div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 w-32 h-32 border border-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
      </div>
    </div>
  )
}



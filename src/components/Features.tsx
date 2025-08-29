import Link from 'next/link';

export default function Features() {
  const features = [
    {
      title: 'For Students',
      description: 'Discover exclusive discounts and deals from local businesses near your campus. Save money on food, entertainment, and essentials.',
      icon: '🎓',
      href: '#download',
      benefits: ['Student-exclusive discounts', 'Local business partnerships', 'Real-time deal updates']
    },
    {
      title: 'For Vendors',
      description: 'Reach thousands of college students in your area. Create offers, manage your business profile, and grow your customer base.',
      icon: '🏪',
      href: '/vendor/signup',
      benefits: ['Student-focused marketing', 'Easy offer management', 'Analytics dashboard']
    },
    {
      title: 'Safe & Secure',
      description: 'Our platform ensures secure transactions and verified accounts for both students and vendors. Trust and safety first.',
      icon: '🔒',
      href: '#download',
      benefits: ['Verified accounts', 'Secure payments', 'Community guidelines']
    },
    {
      title: 'Mobile First',
      description: 'Access everything from your smartphone. Our mobile app is designed for the on-the-go college lifestyle.',
      icon: '📱',
      href: '#download',
      benefits: ['Mobile-optimized', 'Push notifications', 'Offline access']
    }
  ];

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-6 tracking-tight">
            Built for Students
            <span className="block relative">
              & Vendors
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black/20 animate-pulse"></div>
            </span>
          </h2>
          <p className="text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Connecting college students with local businesses through exclusive deals and seamless experiences. 
            Everything you need in one platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-black/10 hover-lift glass-effect overflow-hidden"
            >
              {/* Animated Border */}
              <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-black/5 via-transparent to-black/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative p-8">
                {/* Icon */}
                <div className="flex items-center justify-center w-20 h-20 bg-black/5 border border-black/10 rounded-2xl mb-8 group-hover:bg-black/10 transition-all duration-300 animate-glow">
                  <span className="text-4xl">{feature.icon}</span>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-black transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-black/70 mb-8 leading-relaxed text-lg">
                  {feature.description}
                </p>

                {/* Benefits */}
                <ul className="space-y-3 mb-8">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-black/70">
                      <div className="w-2 h-2 bg-black rounded-full mr-4 animate-pulse"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  href={feature.href}
                  className="inline-flex items-center text-black font-semibold hover:text-black/80 transition-all duration-300 group-hover:translate-x-2"
                >
                  Explore {feature.title}
                  <span className="ml-3 text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>

              {/* Coming Soon Badge */}
              <div className="absolute top-6 right-6">
                <span className="bg-black/10 border border-black/20 text-black text-xs font-medium px-4 py-2 rounded-full backdrop-blur-sm">
                  Coming Soon
                </span>
              </div>
              
              {/* Geometric Accent */}
              <div className="absolute bottom-0 right-0 w-24 h-24 border-l border-t border-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="relative bg-black/5 backdrop-blur-sm border border-black/10 rounded-3xl p-12 glass-effect overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 grid-pattern opacity-10"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-black mb-6">
                Ready to Transform Your College Experience?
              </h3>
              <p className="text-xl text-black/70 mb-8 max-w-2xl mx-auto">
                Join thousands of students who are already saving money and staying connected with Flin.
              </p>
              <Link
                href="#download"
                className="inline-flex items-center bg-black text-white px-10 py-5 rounded-xl text-lg font-semibold hover:bg-black/80 transition-all duration-300 hover-lift animate-glow"
              >
                Get Started Today 🚀
              </Link>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-4 left-4 w-8 h-8 border border-black/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 bg-black/20 rotate-45 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

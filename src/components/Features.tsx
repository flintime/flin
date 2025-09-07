import Link from 'next/link';

export default function Features() {
  const features = [
    {
      title: 'Local Offers',
      description: 'Unlock exclusive student discounts at restaurants, shops, and services near your campus. Save up to 50% on everything you need.',
      icon: '🏷️',
      benefits: ['Up to 50% off local businesses', 'Student ID verification', 'New deals added weekly']
    },
    {
      title: 'Student Marketplace',
      description: 'Buy and sell textbooks, electronics, and dorm essentials with verified students. Safe transactions, great prices.',
      icon: '🛒',
      benefits: ['Verified student sellers', 'Secure payment system', 'Campus pickup available']
    },
    {
      title: 'Housing',
      description: 'Discover the perfect place to call home. From dorms to apartments, find housing that fits your budget and lifestyle.',
      icon: '🏠',
      benefits: ['Verified landlords', 'Virtual tours available', 'Roommate matching']
    },
    {
      title: 'Events',
      description: 'Never miss out on campus life. Discover parties, study groups, career fairs, and social events happening around you.',
      icon: '🎉',
      benefits: ['Real-time event updates', 'RSVP and reminders', 'Connect with attendees']
    }
  ];

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-6 tracking-tight">
            Everything You Need
            <span className="block relative">
              For College Life
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black/20"></div>
            </span>
          </h2>
          <p className="text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Discover local deals, buy/sell with fellow students, find housing, and stay connected with campus events.
            Your complete college companion in one app.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-white rounded-3xl border border-black/10 hover-lift shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              {/* Orange Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative p-8">
                {/* Icon */}
                <div className="mb-8">
                  <div className="flex items-center justify-center w-24 h-24 bg-white border-2 border-orange-500/20 rounded-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-5xl">{feature.icon}</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-3xl font-bold text-black mb-4 group-hover:text-orange-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-black/70 mb-8 leading-relaxed text-lg">
                  {feature.description}
                </p>

                {/* Benefits with orange styling */}
                <div className="space-y-4">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center text-black/70 group-hover:text-black transition-colors duration-300">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mr-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Orange corner accent */}
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tl-3xl"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="relative bg-black/5 backdrop-blur-sm border border-black/10 rounded-3xl p-12 glass-effect overflow-hidden">
            
            
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
            
            
          </div>
        </div>
      </div>
    </section>
  );
}

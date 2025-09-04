import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center bg-white overflow-hidden">
      {/* Futuristic Grid Background */}
      <div className="absolute inset-0 grid-pattern opacity-30"></div>
      
      {/* Floating Geometric Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-black/20 rounded-lg animate-float"></div>
      <div className="absolute top-40 right-20 w-12 h-12 border border-black/30 rotate-45 animate-float-delay"></div>
      <div className="absolute bottom-40 left-20 w-16 h-16 border border-black/20 rounded-full animate-float"></div>
      <div className="absolute bottom-20 right-10 w-8 h-8 bg-black animate-float-delay"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black mb-8 tracking-tight">
              The Ultimate
              <span className="block relative">
                Student App
                <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20 animate-pulse"></div>
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-black/70 mb-10 max-w-2xl leading-relaxed">
              Empowering college students across America with exclusive deals, local offers, housing, and campus events.
              Save money and discover everything your campus has to offer! 🇺🇸
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
              <span className="bg-black/5 border border-black/20 text-black px-6 py-3 rounded-full text-sm font-medium hover-lift animate-pulse-border">
                🎓 Student Focused
              </span>
              <span className="bg-black/5 border border-black/20 text-black px-6 py-3 rounded-full text-sm font-medium hover-lift animate-pulse-border">
                💰 Save Money
              </span>
              <span className="bg-black/5 border border-black/20 text-black px-6 py-3 rounded-full text-sm font-medium hover-lift animate-pulse-border">
                🔒 Safe & Secure
              </span>
              <span className="bg-black/5 border border-black/20 text-black px-6 py-3 rounded-full text-sm font-medium hover-lift animate-pulse-border">
                📱 Mobile First
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-12">
              <Link
                href="#download"
                className="bg-black text-white px-10 py-5 rounded-xl text-lg font-semibold hover:bg-black/80 transition-all duration-300 hover-lift animate-glow"
              >
                📱 Download iOS App
              </Link>
              <Link
                href="#features"
                className="border-2 border-black text-black px-10 py-5 rounded-xl text-lg font-semibold hover:bg-black hover:text-white transition-all duration-300 hover-lift"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-black/20">
              <div className="text-center hover-lift">
                <div className="text-3xl font-bold text-black mb-2">10K+</div>
                <div className="text-sm text-black/60 uppercase tracking-wide">Active Students</div>
              </div>
              <div className="text-center hover-lift">
                <div className="text-3xl font-bold text-black mb-2">500+</div>
                <div className="text-sm text-black/60 uppercase tracking-wide">Campus Partners</div>
              </div>
              <div className="text-center hover-lift">
                <div className="text-3xl font-bold text-black mb-2">50+</div>
                <div className="text-sm text-black/60 uppercase tracking-wide">Cities</div>
              </div>
            </div>
          </div>

          {/* Right Column - Mascot */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Futuristic Glow Effect */}
              <div className="absolute inset-0 bg-black/5 rounded-full blur-3xl scale-110 animate-pulse"></div>
              
              <Image
                src="/flin.png"
                alt="Flin Mascot"
                width={450}
                height={450}
                className="relative z-10 filter drop-shadow-2xl animate-float"
                priority
              />
              
              {/* Floating Geometric Elements */}
              <div className="absolute top-10 -left-8 bg-white border-2 border-black/20 p-4 rounded-xl shadow-2xl transform rotate-12 animate-float hover-lift">
                <span className="text-3xl">🎓</span>
              </div>
              <div className="absolute top-20 -right-12 bg-white border-2 border-black/20 p-4 rounded-xl shadow-2xl transform -rotate-12 animate-float-delay hover-lift">
                <span className="text-3xl">🇺🇸</span>
              </div>
              <div className="absolute bottom-20 -left-12 bg-white border-2 border-black/20 p-4 rounded-xl shadow-2xl transform rotate-6 animate-float hover-lift">
                <span className="text-3xl">💰</span>
              </div>
              
              {/* Geometric Accent Lines */}
              <div className="absolute top-0 left-1/2 w-px h-20 bg-black/20 animate-pulse"></div>
              <div className="absolute bottom-0 right-1/4 w-px h-16 bg-black/20 animate-pulse"></div>
              <div className="absolute left-0 top-1/2 w-16 h-px bg-black/20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

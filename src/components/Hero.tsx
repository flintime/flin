import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center bg-white overflow-hidden">
      
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content - First on desktop, Second on mobile */}
          <div className="text-center lg:text-left order-2 lg:order-1">
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

          {/* Mascot - First on mobile, Second on desktop */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative">
              
              <Image
                src="/flin.png"
                alt="Flin Mascot"
                width={450}
                height={450}
                className="relative z-10 filter drop-shadow-2xl animate-float"
                priority
              />
              {/* Icon Badges around mascot */}
              <div className="absolute top-10 -left-8 bg-white border-2 border-black/20 p-4 rounded-xl shadow-2xl transform rotate-12 animate-float hover-lift">
                <span className="text-3xl">🎓</span>
              </div>
              <div className="absolute top-20 -right-12 bg-white border-2 border-black/20 p-4 rounded-xl shadow-2xl transform -rotate-12 animate-float-delay hover-lift">
                <span className="text-3xl">🇺🇸</span>
              </div>
              <div className="absolute bottom-20 -left-12 bg-white border-2 border-black/20 p-4 rounded-xl shadow-2xl transform rotate-6 animate-float hover-lift">
                <span className="text-3xl">💰</span>
              </div>
              <div className="absolute bottom-20 -right-12 bg-white border-2 border-black/20 p-4 rounded-xl shadow-2xl transform -rotate-6 animate-float-delay hover-lift">
                <span className="text-3xl">🏠</span>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

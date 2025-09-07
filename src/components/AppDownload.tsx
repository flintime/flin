import Image from 'next/image';

export default function AppDownload() {
  return (
    <section id="download" className="py-24 bg-black text-white relative overflow-hidden">
      
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <span className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm glass-effect">
                📱 Available Now
              </span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8 tracking-tight">
              Get the Flin App
              <span className="block relative">
                on Your iPhone
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 animate-pulse"></div>
              </span>
            </h2>
            
            <p className="text-xl text-white/80 mb-10 leading-relaxed">
              Take the full Flin experience with you wherever you go! Our iOS app gives you instant access
              to local offers, student marketplace, housing listings, and campus events - all in one place.
            </p>

            {/* App Features */}
            <div className="space-y-6 mb-12">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center mr-6">
                  <span className="text-white text-lg">🏷️</span>
                </div>
                <span className="text-white/80 text-lg">Local offers and exclusive student discounts</span>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center mr-6">
                  <span className="text-white text-lg">🛒</span>
                </div>
                <span className="text-white/80 text-lg">Buy and sell with fellow students safely</span>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center mr-6">
                  <span className="text-white text-lg">🏠</span>
                </div>
                <span className="text-white/80 text-lg">Find housing near campus with ease</span>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center mr-6">
                  <span className="text-white text-lg">🎉</span>
                </div>
                <span className="text-white/80 text-lg">Stay updated on all campus events</span>
              </div>
            </div>

            {/* Download Button */}
            <div className="flex justify-center lg:justify-start">
              <button className="bg-white text-black px-10 py-5 rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 hover-lift flex items-center justify-center space-x-4">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-sm text-black/60">Download on the</div>
                  <div className="text-xl font-bold">App Store</div>
                </div>
              </button>
            </div>

            {/* App Stats */}
            <div className="mt-16 pt-8 border-t border-white/30">
              <div className="grid grid-cols-2 gap-12">
                <div className="text-center lg:text-left hover-lift">
                  <div className="text-3xl font-bold text-white mb-2">0★</div>
                  <div className="text-sm text-white/60 uppercase tracking-wide">App Store Rating</div>
                </div>
                <div className="text-center lg:text-left hover-lift">
                  <div className="text-3xl font-bold text-white mb-2">0</div>
                  <div className="text-sm text-white/60 uppercase tracking-wide">Downloads</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Phone Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              
              {/* Phone Frame */}
              <div className="relative bg-white p-3 rounded-[3rem] shadow-2xl animate-glow">
                <div className="bg-white rounded-[2.5rem] overflow-hidden w-80 h-[700px] relative border border-black/10">
                  {/* Simulator Image */}
                  <Image
                    src="/simulator.png"
                    alt="Flin App Simulator"
                    width={320}
                    height={650}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
}

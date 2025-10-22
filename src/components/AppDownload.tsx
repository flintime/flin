import Image from 'next/image';

export default function AppDownload() {
  return (
    <section id="download" className="py-16 md:py-20 lg:py-24 bg-black text-white relative overflow-hidden">
      
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8 tracking-tight">
              Get the <span className="text-[#fb541c]">Flin App</span>
              <span className="block relative">
                on Your iPhone
              </span>
            </h2>
            
            <p className="text-xl text-white/80 mb-10 leading-relaxed">
              Take Flin wherever you go! Explore local offers, brand deals, student marketplace, and campus events - all in one app
            </p>

            {/* App Features */}
            <div className="space-y-6 mb-12">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 mr-6 flex items-center justify-center">
                  <Image src="/icons/10.png" alt="Local offers" width={48} height={48} className="object-contain" />
                </div>
                <span className="text-white/80 text-lg">Local offers and exclusive student discounts</span>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 mr-6 flex items-center justify-center">
                  <Image src="/icons/11.png" alt="Brand deals" width={48} height={48} className="object-contain" />
                </div>
                <span className="text-white/80 text-lg">Deals from major brands</span>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 mr-6 flex items-center justify-center">
                  <Image src="/icons/12.png" alt="Buy and sell" width={48} height={48} className="object-contain" />
                </div>
                <span className="text-white/80 text-lg">Buy and sell with fellow students safely</span>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 mr-6 flex items-center justify-center">
                  <Image src="/icons/13.png" alt="Campus events" width={48} height={48} className="object-contain" />
                </div>
                <span className="text-white/80 text-lg">Stay updated on all campus events</span>
              </div>
            </div>

            {/* App Store CTA (image) */}
            <div className="flex justify-center lg:justify-start">
              <a
                href="https://apps.apple.com/app/flin-college/id6751548665"
                target="_blank"
                rel="noopener noreferrer"
                className="w-[160px] sm:w-[180px] inline-flex items-center justify-center mx-auto lg:mx-0"
              >
                <Image
                  src="/iosdownload2.svg"
                  alt="Download on the App Store"
                  width={180}
                  height={54}
                  className="block w-full h-auto"
                  sizes="(max-width: 640px) 160px, 180px"
                  priority
                />
              </a>
            </div>

            {/* App Stats - hidden until real metrics available */}
            {/* Intentionally hidden to avoid showing placeholder zeros */}
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

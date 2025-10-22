import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center bg-white overflow-hidden pt-24 md:pt-28 lg:pt-32 pb-16 md:pb-20 lg:pb-24">
      
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content - First on desktop, Second on mobile */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black mb-8 tracking-tight">
              The Student
              <span className="block relative">
                <span className="text-[#fb541c]">Super App</span>
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-black/70 mb-10 max-w-2xl leading-relaxed">
              Student discounts at local restaurants & stores, deals from major brands, marketplace to buy & sell with verified students, and campus events.
            </p>
            
            

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-12 w-full">
              <Link
                href="https://apps.apple.com/app/flin-college/id6751548665"
                target="_blank"
                rel="noopener noreferrer"
                className="w-[160px] sm:w-[180px] inline-flex items-center justify-center mx-auto sm:mx-0"
              >
                <Image
                  src="/iosdownload.svg"
                  alt="Download on the App Store"
                  width={180}
                  height={54}
                  className="block w-full h-auto"
                  sizes="(max-width: 640px) 160px, 180px"
                  priority
                />
              </Link>
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
                <span className="text-3xl">🛍️</span>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

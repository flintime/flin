import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <Image
                src="/Flinlogo.png"
                alt="Flin Logo"
                width={80}
                height={80}
                className=""
              />
            </div>
            <p className="text-white/70 text-sm mb-6 leading-relaxed">
              The ultimate student platform connecting college students across America with local offers, student marketplace, housing listings, and campus events.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-white/50 hover:text-white transition-all duration-300 hover-lift">
                <span className="sr-only">Facebook</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-white/50 hover:text-white transition-all duration-300 hover-lift">
                <span className="sr-only">Instagram</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323C6.001 8.198 7.152 7.708 8.449 7.708s2.448.49 3.323 1.418c.925.875 1.418 2.026 1.418 3.323s-.493 2.448-1.418 3.323c-.875.925-2.026 1.418-3.323 1.418zm7.138 0c-1.297 0-2.448-.49-3.323-1.297-.925-.875-1.418-2.026-1.418-3.323s.493-2.448 1.418-3.323c.875-.925 2.026-1.418 3.323-1.418s2.448.49 3.323 1.418c.925.875 1.418 2.026 1.418 3.323s-.493 2.448-1.418 3.323c-.875.925-2.026 1.418-3.323 1.418z"/>
                </svg>
              </a>
              <a href="#" className="text-white/50 hover:text-white transition-all duration-300 hover-lift">
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Student Resources Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white relative">
              Student Resources
              <div className="absolute bottom-0 left-0 w-8 h-px bg-white/30 animate-pulse"></div>
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">
                  Campus Directory
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">
                  Study Groups
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">
                  Event Calendar
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">
                  Student Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white relative">
              Support
              <div className="absolute bottom-0 left-0 w-8 h-px bg-white/30 animate-pulse"></div>
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/legal" className="text-white/70 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">
                  Legal & Policies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-white/70 mb-4 md:mb-0">
              © {currentYear} Flintime Inc. Made with ❤️ for American college students 🇺🇸
            </div>
            <div className="flex items-center space-x-8 text-sm">
              <Link href="/legal" className="text-white/70 hover:text-white transition-all duration-300 hover-lift">
                Legal & Policies
              </Link>
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <span className="text-white/80">🇺🇸</span>
                <span className="text-white/80 text-xs font-medium">United States</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-8 right-8 w-4 h-4 border border-white/20 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-8 left-8 w-6 h-6 border border-white/20 rounded-full animate-pulse"></div>
      </div>
    </footer>
  );
}

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white relative overflow-hidden">
      
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
            
            <div className="flex space-x-6">
              <a href="https://www.instagram.com/flin.college/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-all duration-300 hover-lift">
                <span className="sr-only">Instagram</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.2.3c3.4 0 3.8 0 5.1.1 1.2.1 2.1.2 2.8.5.8.3 1.4.7 2 1.3.6.6 1 1.2 1.3 2 .3.7.4 1.6.5 2.8.1 1.3.1 1.7.1 5.1s0 3.8-.1 5.1c-.1 1.2-.2 2.1-.5 2.8-.3.8-.7 1.4-1.3 2-.6.6-1.2 1-2 1.3-.7.3-1.6.4-2.8.5-1.3.1-1.7.1-5.1.1s-3.8 0-5.1-.1c-1.2-.1-2.1-.2-2.8-.5-.8-.3-1.4-.7-2-1.3-.6-.6-1-1.2-1.3-2-.3-.7-.4-1.6-.5-2.8-.1-1.3-.1-1.7-.1-5.1s0-3.8.1-5.1c.1-1.2.2-2.1.5-2.8.3-.8.7-1.4 1.3-2 .6-.6 1.2-1 2-1.3.7-.3 1.6-.4 2.8-.5 1.3-.1 1.7-.1 5.1-.1zm0 2.2c-3.3 0-3.7 0-5 .1-1.1 0-1.7.2-2.1.3-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.1.4-.3 1-.3 2.1-.1 1.3-.1 1.6-.1 5s0 3.7.1 5c0 1.1.2 1.7.3 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.1 1 .3 2.1.3 1.3.1 1.6.1 5 .1s3.7 0 5-.1c1.1 0 1.7-.2 2.1-.3.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.1-.4.3-1 .3-2.1.1-1.3.1-1.6.1-5s0-3.7-.1-5c0-1.1-.2-1.7-.3-2.1-.2-.5-.4-.9-.8-1.3-.4-.4-.8-.6-1.3-.8-.4-.1-1-.3-2.1-.3-1.3-.1-1.6-.1-5-.1zm0 3.8c3.6 0 6.5 2.9 6.5 6.5s-2.9 6.5-6.5 6.5-6.5-2.9-6.5-6.5 2.9-6.5 6.5-6.5zm0 10.7c2.3 0 4.2-1.9 4.2-4.2s-1.9-4.2-4.2-4.2-4.2 1.9-4.2 4.2 1.9 4.2 4.2 4.2zm8.2-11c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5 1.5.7 1.5 1.5z"/>
                </svg>
              </a>
              <a href="https://x.com/flincollege" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-all duration-300 hover-lift">
                <span className="sr-only">X (Twitter)</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/flincollege" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-all duration-300 hover-lift">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white relative">
              Legal
              <div className="absolute bottom-0 left-0 w-8 h-px bg-white/30 animate-pulse"></div>
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/legal/terms-of-service" className="text-white/70 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy-policy" className="text-white/70 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/cookie-policy" className="text-white/70 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/safety-guidelines" className="text-white/70 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">
                  Safety Guidelines
                </Link>
              </li>
              <li>
                <Link href="/legal/community-guidelines" className="text-white/70 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="/legal/accessibility" className="text-white/70 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">
                  Accessibility
                </Link>
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
                <a href="mailto:contact@flin.college" className="text-white/70 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">
                  contact@flin.college
                </a>
              </li>
              <li>
                <a href="tel:+19165980203" className="text-white/70 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">
                  +1 (916) 598-0203
                </a>
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
        
        
      </div>
    </footer>
  );
}

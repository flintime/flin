'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function VendorLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setMessage({ type: 'error', text: 'Please enter both email and password' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/vendor/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store session data
        localStorage.setItem('vendor_session', JSON.stringify(data.data));
        
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/vendor/dashboard');
        }, 1000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Login failed' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-6 px-4 sm:py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20"></div>
      
      {/* Floating Geometric Elements - Hidden on mobile for cleaner look */}
      <div className="hidden sm:block absolute top-20 left-10 w-16 h-16 border border-black/20 rounded-lg animate-float"></div>
      <div className="hidden sm:block absolute top-40 right-20 w-8 h-8 border border-black/30 rotate-45 animate-float-delay"></div>
      <div className="hidden sm:block absolute bottom-40 left-20 w-12 h-12 border border-black/20 rounded-full animate-float"></div>
      <div className="hidden sm:block absolute bottom-20 right-10 w-4 h-4 bg-black animate-float-delay"></div>
      
      <div className="mx-auto w-full max-w-md relative z-10">
        <div className="flex justify-center mb-6 sm:mb-8">
          <Link href="/">
            <Image
              src="/Flinlogo.png"
              alt="Flin Logo"
              width={64}
              height={64}
              className="sm:w-20 sm:h-20 rounded-xl"
            />
          </Link>
        </div>
        <h2 className="text-center text-2xl sm:text-4xl font-bold text-black mb-3 sm:mb-4 tracking-tight">
          Vendor Login
        </h2>
        <p className="text-center text-base sm:text-lg text-black/70 px-2">
          Or{' '}
          <Link
            href="/vendor/signup"
            className="font-medium text-black hover:text-black/80 underline decoration-2 underline-offset-4 transition-all duration-300"
          >
            create a new vendor account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mt-12 mx-auto w-full max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-sm py-6 px-4 sm:py-12 sm:px-8 border border-black/10 rounded-2xl glass-effect hover-lift">
          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg text-sm ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}
          
          <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black mb-2 sm:mb-3">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 sm:px-4 sm:py-4 border border-black/20 rounded-xl placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-300 bg-white/50 backdrop-blur-sm text-base"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black mb-2 sm:mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 sm:px-4 sm:py-4 border border-black/20 rounded-xl placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-300 bg-white/50 backdrop-blur-sm text-base"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 sm:h-5 sm:w-5 text-black focus:ring-black/20 border-black/20 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 sm:ml-3 block text-sm text-black">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-black/70 hover:text-black transition-colors duration-300">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 sm:py-4 sm:px-6 border border-transparent text-base sm:text-lg font-medium rounded-xl text-white bg-black hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/20 transition-all duration-300 hover-lift animate-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <>
                    <span className="hidden sm:inline">Sign in to your vendor account</span>
                    <span className="sm:hidden">Sign in</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 sm:mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-black/70 font-medium">Vendor Benefits</span>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
              <div className="flex items-center text-sm text-black/70">
                <div className="w-2 h-2 bg-black rounded-full mr-4 animate-pulse"></div>
                Reach thousands of college students
              </div>
              <div className="flex items-center text-sm text-black/70">
                <div className="w-2 h-2 bg-black rounded-full mr-4 animate-pulse"></div>
                Manage your offers and promotions
              </div>
              <div className="flex items-center text-sm text-black/70">
                <div className="w-2 h-2 bg-black rounded-full mr-4 animate-pulse"></div>
                Analytics and insights dashboard
              </div>
              <div className="flex items-center text-sm text-black/70">
                <div className="w-2 h-2 bg-black rounded-full mr-4 animate-pulse"></div>
                Direct communication with students
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <Link
            href="/"
            className="text-black/70 hover:text-black font-medium transition-all duration-300 hover-lift"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

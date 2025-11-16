'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
 

export default function VendorOnboarding() {
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    contactName: '',
    phone: '',
    city: '',
    state: '',
     
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.businessName || !formData.email) {
      setMessage({ type: 'error', text: 'Please provide your business name and email.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/vendor/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName: formData.businessName,
          email: formData.email,
          contactName: formData.contactName || undefined,
          phone: formData.phone || undefined,
          city: formData.city || undefined,
          state: formData.state || undefined,
          
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Thank you! We received your interest and will reach out shortly.'
        });
        setFormData({
          businessName: '',
          email: '',
          contactName: '',
          phone: '',
          city: '',
          state: '',
          
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to submit your interest' });
      }
    } catch (error) {
      console.error('Interest submission error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
      <Head>
        <title>Vendor Onboarding - Flin</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Head>
      <main className="min-h-screen bg-white flex flex-col justify-center py-6 px-4 sm:py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="mx-auto w-full max-w-md relative z-10">
          <div className="flex justify-center mb-6 sm:mb-8">
            <Link href="/">
              <Image
                src="/Flinlogo.png"
                alt="Flin Logo"
                width={96}
                height={96}
              />
            </Link>
          </div>
          <h2 className="text-center text-2xl sm:text-4xl font-bold text-black mb-3 sm:mb-4 tracking-tight">
            Partner with Flin
          </h2>
        </div>

        <div className="mt-8 sm:mt-12 mx-auto w-full max-w-md relative z-10">
          <div className="bg-white/80 backdrop-blur-sm py-6 px-4 sm:py-12 sm:px-8 border border-black/10 rounded-2xl glass-effect hover-lift">
          {/* Interest Form */}
          <form
            className="space-y-4 sm:space-y-6"
            onSubmit={handleSubmit}
            aria-busy={isLoading}
          >
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-black mb-2">
                Business Name *
              </label>
              <div className="relative">
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 sm:px-4 sm:py-3 border border-black/20 rounded-lg placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-300 bg-white/50 backdrop-blur-sm text-base"
                  placeholder="Your business name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                Business Email *
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
                  className="appearance-none block w-full px-3 py-3 sm:px-4 sm:py-3 border border-black/20 rounded-lg placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-300 bg-white/50 backdrop-blur-sm text-base"
                  placeholder="business@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-black mb-2">
                Your Name
              </label>
              <div className="relative">
                <input
                  id="contactName"
                  name="contactName"
                  type="text"
                  value={formData.contactName}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 sm:px-4 sm:py-3 border border-black/20 rounded-lg placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-300 bg-white/50 backdrop-blur-sm text-base"
                  placeholder="Contact person"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-black mb-2">
                Phone
              </label>
              <div className="relative">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 sm:px-4 sm:py-3 border border-black/20 rounded-lg placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-300 bg-white/50 backdrop-blur-sm text-base"
                  placeholder="(555) 000-0000"
                />
              </div>
            </div>

            

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-black mb-2">
                  City
                </label>
                <div className="relative">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-3 sm:px-4 sm:py-3 border border-black/20 rounded-lg placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-300 bg-white/50 backdrop-blur-sm text-base"
                    placeholder="City"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-black mb-2">
                  State
                </label>
                <div className="relative">
                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-3 sm:px-4 sm:py-3 border border-black/20 rounded-lg placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-300 bg-white/50 backdrop-blur-sm text-base"
                    placeholder="State"
                  />
                </div>
              </div>
            </div>

            

            

            

            {/* Message Display */}
            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
                role="status"
                aria-live="polite"
              >
                {message.text}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 sm:py-4 sm:px-6 border border-transparent text-base sm:text-lg font-medium rounded-xl text-white bg-black hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/20 transition-all duration-300 hover-lift animate-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Submit Interest</span>
                    <span className="sm:hidden">Submit</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 sm:mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-black/70 font-medium">Why become a Flin vendor?</span>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
              <div className="flex items-center text-sm text-black/70">
                <div className="w-2 h-2 bg-black rounded-full mr-3 sm:mr-4 animate-pulse flex-shrink-0"></div>
                Target college students directly
              </div>
              <div className="flex items-center text-sm text-black/70">
                <div className="w-2 h-2 bg-black rounded-full mr-3 sm:mr-4 animate-pulse flex-shrink-0"></div>
                Increase foot traffic and sales
              </div>
              <div className="flex items-center text-sm text-black/70">
                <div className="w-2 h-2 bg-black rounded-full mr-3 sm:mr-4 animate-pulse flex-shrink-0"></div>
                Easy-to-use promotion tools
              </div>
              <div className="flex items-center text-sm text-black/70">
                <div className="w-2 h-2 bg-black rounded-full mr-3 sm:mr-4 animate-pulse flex-shrink-0"></div>
                Build lasting customer relationships
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
        <div className="mt-8 sm:mt-12 text-center">
          <Link
            href="/"
            className="text-black/70 hover:text-black font-medium transition-all duration-300 hover-lift"
          >
            ← Back to home
          </Link>
        </div>
      </main>
    </>
  );
}

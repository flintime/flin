'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

export default function VendorResetPassword() {
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const router = useRouter();

  // Get email from URL parameter if available
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get('email');
    if (emailFromUrl) {
      setFormData(prev => ({ ...prev, email: emailFromUrl }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check required fields (email is pre-filled from URL)
    if (!formData.email || !formData.otp || !formData.password || !formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    if (formData.otp.length !== 6) {
      setMessage({ type: 'error', text: 'Please enter a valid 6-digit OTP code' });
      return;
    }

    if (formData.password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/vendor/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Password updated successfully! Redirecting to login...'
        });

        // After reset, go to vendor onboarding page
        setTimeout(() => {
          router.push('/vendor/signup');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to reset password' });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <>
      <Head>
        <title>Reset Password - Flin</title>
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
                width={80}
                height={80}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl"
              />
            </Link>
          </div>
          <h2 className="text-center text-2xl sm:text-4xl font-bold text-black mb-3 sm:mb-4 tracking-tight">
            Reset Your Password
          </h2>
          <p className="text-center text-base sm:text-lg text-black/70 px-2">
            Enter the OTP sent to your email and set your new password.
          </p>
        </div>

        <div className="mt-8 sm:mt-12 mx-auto w-full max-w-md relative z-10">
          <div className="bg-white/80 backdrop-blur-sm py-6 px-4 sm:py-12 sm:px-8 border border-black/10 rounded-2xl glass-effect hover-lift">
            {/* Message Display */}
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg text-sm ${
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

            {/* Reset Password Form */}
            <form
              className="space-y-6 sm:space-y-8"
              onSubmit={handleSubmit}
              aria-busy={isLoading}
            >
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-2 sm:mb-3">
                  Email Address *
                  {formData.email && (
                    <span className="text-xs text-black/60 ml-2">
                      (pre-filled from forgot password)
                    </span>
                  )}
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
                    readOnly={!!formData.email} // Make it read-only if pre-filled
                    className={`appearance-none block w-full px-3 py-3 sm:px-4 sm:py-4 border border-black/20 rounded-xl placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                      formData.email ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-black mb-2 sm:mb-3">
                  OTP Code *
                </label>
                <div className="relative">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={formData.otp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        otp: e.target.value.replace(/\D/g, '').slice(0, 6),
                      })
                    }
                    className="appearance-none block w-full px-3 py-3 sm:px-4 sm:py-4 border border-black/20 rounded-xl placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-300 bg-white/50 backdrop-blur-sm text-base text-center text-2xl font-mono tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
                <p className="mt-1 text-xs text-black/60">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-black mb-2 sm:mb-3">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-3 sm:px-4 sm:py-4 border border-black/20 rounded-xl placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-300 bg-white/50 backdrop-blur-sm text-base"
                    placeholder="Enter your new password"
                    minLength={8}
                  />
                </div>
                <p className="mt-1 text-xs text-black/60">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-black mb-2 sm:mb-3"
                >
                  Confirm New Password *
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-3 sm:px-4 sm:py-4 border border-black/20 rounded-xl placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-300 bg-white/50 backdrop-blur-sm text-base"
                    placeholder="Confirm your new password"
                    minLength={8}
                  />
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
                      Updating password...
                    </div>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Update Password</span>
                      <span className="sm:hidden">Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
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
      </main>
    </>
  );
}


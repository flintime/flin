'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

export default function VendorForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/vendor/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'OTP sent successfully! Redirecting to reset your password...'
        });

        // Redirect to reset password page after successful OTP sending
        // Pass the email as a URL parameter to avoid asking twice
        setTimeout(() => {
          router.push(`/vendor/reset-password?email=${encodeURIComponent(email)}`);
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send reset email' });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password - Flin</title>
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
            Enter your email address and we'll send you an OTP to reset your password.
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

            {/* Forgot Password Form */}
            <form
              className="space-y-6 sm:space-y-8"
              onSubmit={handleSubmit}
              aria-busy={isLoading}
            >
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-2 sm:mb-3">
                  Email address *
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-3 sm:px-4 sm:py-4 border border-black/20 rounded-xl placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-300 bg-white/50 backdrop-blur-sm text-base"
                    placeholder="Enter your email"
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
                      Sending OTP...
                    </div>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Send Password Reset OTP</span>
                      <span className="sm:hidden">Send OTP</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 sm:mt-8 text-center space-y-4">
              <div>
                <span className="text-sm text-black/60">Don't have an account? </span>
                <Link
                  href="/vendor/signup"
                  className="text-sm font-medium text-black hover:text-black/80 underline decoration-2 underline-offset-4 transition-all duration-300"
                >
                  Sign up
                </Link>
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
      </main>
    </>
  );
}

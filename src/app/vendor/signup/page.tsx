'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import type { VendorType } from '@/lib/supabase';
import { BUSINESS_TYPES } from '@/lib/supabase';

export default function VendorSignup() {
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessType: '' as VendorType | '',
    agreeToTerms: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [accountCreated, setAccountCreated] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match!' });
      return;
    }

    if (!formData.agreeToTerms) {
      setMessage({ type: 'error', text: 'Please agree to the terms and conditions.' });
      return;
    }

    if (!formData.businessType) {
      setMessage({ type: 'error', text: 'Please select a business type.' });
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
          password: formData.password,
          businessType: formData.businessType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAccountCreated(true);
        setShowOtpInput(true);
        setMessage({
          type: 'success',
          text: 'Account created successfully! Please check your email for the OTP verification code.'
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create vendor account' });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setMessage({ type: 'error', text: 'Please enter the OTP code.' });
      return;
    }

    setIsVerifying(true);
    setMessage(null);

    try {
      const response = await fetch('/api/vendor/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: otp.trim(),
          type: 'signup'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const pin = data.data?.vendor?.vendor_pin;
        setMessage({
          type: 'success',
          text: `Email verified successfully! Your unique vendor PIN is: ${pin}. Please save this PIN - you'll need it for business operations. You can now log in to your dashboard.`
        });

        // Reset form
        setFormData({
          businessName: '',
          email: '',
          password: '',
          confirmPassword: '',
          businessType: '',
          agreeToTerms: false,
        });
        setOtp('');
        setShowOtpInput(false);
        setAccountCreated(false);
      } else {
        setMessage({ type: 'error', text: data.error || 'OTP verification failed' });
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setMessage(null);

    try {
      const response = await fetch('/api/vendor/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'OTP code resent successfully! Please check your email.'
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to resend OTP' });
      }
    } catch (error) {
      console.error('OTP resend error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsResending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  return (
    <>
      <Head>
        <title>Vendor Signup - Flin</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Head>
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
              width={96}
              height={96}
            />
          </Link>
        </div>
        <h2 className="text-center text-2xl sm:text-4xl font-bold text-black mb-3 sm:mb-4 tracking-tight">
          Become a Flin Vendor
        </h2>
        <p className="text-center text-base sm:text-lg text-black/70 px-2">
          Already have an account?{' '}
          <Link
            href="/vendor/login"
            className="font-medium text-black hover:text-black/80 underline decoration-2 underline-offset-4 transition-all duration-300"
          >
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mt-12 mx-auto w-full max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-sm py-6 px-4 sm:py-12 sm:px-8 border border-black/10 rounded-2xl glass-effect hover-lift">
          {showOtpInput ? (
            /* OTP Verification Form */
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-black mb-2">
                  Verify Your Email
                </h3>
                <p className="text-sm text-black/70">
                  We've sent a 6-digit code to <strong>{formData.email}</strong>
                </p>
              </div>

              {/* Message Display */}
              {message && (
                <div className={`p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message.text}
                </div>
              )}

              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-black mb-2">
                  Enter Verification Code *
                </label>
                <div className="relative">
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="appearance-none block w-full px-3 py-3 sm:px-4 sm:py-3 border border-black/20 rounded-lg placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-300 bg-white/50 backdrop-blur-sm text-base text-center text-2xl font-mono tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleVerifyOtp}
                  disabled={isVerifying || otp.length !== 6}
                  className="flex-1 py-3 px-4 sm:py-4 sm:px-6 border border-transparent text-base sm:text-lg font-medium rounded-xl text-white bg-black hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/20 transition-all duration-300 hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </button>

                <button
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="px-4 py-3 sm:px-6 sm:py-4 border border-black/20 text-base sm:text-lg font-medium rounded-xl text-black hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/20 transition-all duration-300"
                >
                  {isResending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-black inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Resend Code'
                  )}
                </button>
              </div>

              <div className="text-center text-sm text-black/60">
                <p>Didn't receive the code? Check your spam folder or try resending.</p>
              </div>
            </div>
          ) : (
            /* Signup Form */
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
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
              <label htmlFor="businessType" className="block text-sm font-medium text-black mb-2">
                Business Type *
              </label>
              <div className="relative">
                <select
                  id="businessType"
                  name="businessType"
                  required
                  value={formData.businessType}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 sm:px-4 sm:py-3 border border-black/20 rounded-lg placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-300 bg-white/50 backdrop-blur-sm text-base"
                >
                  <option value="">Select business type</option>
                  {BUSINESS_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>







            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                Password *
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
                  className="appearance-none block w-full px-3 py-3 sm:px-4 sm:py-3 border border-black/20 rounded-lg placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-300 bg-white/50 backdrop-blur-sm text-base"
                  placeholder="Create a strong password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-2">
                Confirm Password *
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
                  className="appearance-none block w-full px-3 py-3 sm:px-4 sm:py-3 border border-black/20 rounded-lg placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all duration-300 bg-white/50 backdrop-blur-sm text-base"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div className="flex items-start">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                required
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="h-4 w-4 mt-0.5 text-black focus:ring-black/20 border-black/20 rounded"
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-black leading-relaxed">
                I agree to the{' '}
                <Link href="/legal" className="text-black hover:text-black/80 underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/legal" className="text-black hover:text-black/80 underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading || accountCreated}
                className="group relative w-full flex justify-center py-3 px-4 sm:py-4 sm:px-6 border border-transparent text-base sm:text-lg font-medium rounded-xl text-white bg-black hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/20 transition-all duration-300 hover-lift animate-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Create Vendor Account</span>
                    <span className="sm:hidden">Create Account</span>
                  </>
                )}
              </button>
            </div>
          </form>
          )}

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
      </div>
    </div>
    </>
  );
}

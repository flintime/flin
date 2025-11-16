import Link from 'next/link';

export default function Legal() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="bg-white/95 backdrop-blur-md border-b border-black/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-black/70 hover:text-black text-sm font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Legal & Policies
          </h1>
          <p className="text-xl text-black/70">
            Important legal information and policies for Flin users and vendors.
          </p>
        </div>

        {/* Legal Documents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <Link href="/legal/terms-of-service" className="block border border-black/10 rounded-lg p-5 hover:bg-gray-50">
            <h3 className="font-semibold text-black mb-1">Terms of Service</h3>
            <p className="text-sm text-black/60">Rules for using Flin.</p>
          </Link>
          <Link href="/legal/privacy-policy" className="block border border-black/10 rounded-lg p-5 hover:bg-gray-50">
            <h3 className="font-semibold text-black mb-1">Privacy Policy</h3>
            <p className="text-sm text-black/60">How we collect and use data.</p>
          </Link>
          <Link href="/legal/cookie-policy" className="block border border-black/10 rounded-lg p-5 hover:bg-gray-50">
            <h3 className="font-semibold text-black mb-1">Cookie Policy</h3>
            <p className="text-sm text-black/60">Cookies and tracking technologies.</p>
          </Link>
          <Link href="/legal/safety-guidelines" className="block border border-black/10 rounded-lg p-5 hover:bg-gray-50">
            <h3 className="font-semibold text-black mb-1">Safety Guidelines</h3>
            <p className="text-sm text-black/60">Staying safe on Flin.</p>
          </Link>
          <Link href="/legal/community-guidelines" className="block border border-black/10 rounded-lg p-5 hover:bg-gray-50">
            <h3 className="font-semibold text-black mb-1">Community Guidelines</h3>
            <p className="text-sm text-black/60">Expected behavior and content rules.</p>
          </Link>
          <Link href="/legal/accessibility" className="block border border-black/10 rounded-lg p-5 hover:bg-gray-50">
            <h3 className="font-semibold text-black mb-1">Accessibility</h3>
            <p className="text-sm text-black/60">Our commitment to accessibility.</p>
          </Link>
        </div>

        {/* Basic Legal Information */}
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Contact Information</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-black/70 mb-2"><strong>Flintime Inc.</strong></p>
              <p className="text-black/70 mb-2">254 Chapman Rd, Ste 208 #20381</p>
              <p className="text-black/70 mb-2">Newark, Delaware 19702, US</p>
              <p className="text-black/70">Email: <a href="mailto:contact@flin.college" className="text-blue-600 hover:text-blue-500">contact@flin.college</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Age Requirements</h2>
            <p className="text-black/70">
              Flin is exclusively designed for students aged 17 and older who are enrolled in or affiliated with accredited educational institutions.
            </p>
          </section>
        </div>

        {/* Back to Home */}
        <div className="border-t border-black/10 pt-8 mt-12">
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-black/80 transition-all duration-300"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
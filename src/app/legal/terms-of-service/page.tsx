import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Navigation */}
      <div className="bg-white/95 backdrop-blur-md border-b border-black/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/legal" className="text-black/70 hover:text-black text-sm font-medium">
              ← Back to Legal & Policies
            </Link>
            <Link href="/" className="text-black/70 hover:text-black text-sm font-medium">
              Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-black/70 mb-4">
            Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-black/60">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">1. Agreement to Terms</h2>
            <p className="text-black/70 mb-4">
              Welcome to Flin! These Terms of Service ("Terms") govern your use of the Flin mobile application and website (collectively, the "Service") operated by Flintime Inc. ("Company," "we," "our," or "us"). By accessing or using our Service, you agree to be bound by these Terms.
            </p>
            <p className="text-black/70 mb-4">
              <strong>IMPORTANT:</strong> If you do not agree to these Terms, you may not access or use our Service. These Terms constitute a legally binding agreement between you and Flintime Inc.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">2. Eligibility and Student Requirements</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">2.1 Age Requirement</h3>
            <p className="text-black/70 mb-4">
              You must be at least 17 years old to use Flin. By using our Service, you represent and warrant that you are at least 17 years of age.
            </p>

            <h3 className="text-xl font-semibold text-black mb-3">2.2 Student Status</h3>
            <p className="text-black/70 mb-4">
              Flin is exclusively designed for students. You must be:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Currently enrolled in an accredited college or university in the United States, OR</li>
              <li>A recent graduate (within 2 years) of an accredited US institution, OR</li>
              <li>Faculty, staff, or employees of an accredited educational institution</li>
            </ul>
            <p className="text-black/70 mb-4">
              You agree to provide accurate student verification information and understand that false information may result in immediate account termination.
            </p>

            <h3 className="text-xl font-semibold text-black mb-3">2.3 Age Rating Justification (Apple App Store Compliance)</h3>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-orange-900 mb-3">📱 17+ Age Rating Explanation</h4>
              <p className="text-orange-800 mb-3">
                Flin is rated 17+ in the App Store due to the following features that require mature judgment:
              </p>
              <ul className="text-orange-800 text-sm space-y-2">
                <li><strong>Financial transactions:</strong> Real money marketplace transactions requiring financial responsibility</li>
                <li><strong>Meeting strangers:</strong> In-person meetups for transactions pose safety considerations</li>
                <li><strong>Housing arrangements:</strong> Finding roommates and housing requires mature decision-making</li>
                <li><strong>User-generated content:</strong> Unfiltered communications between students</li>
                <li><strong>Location sharing:</strong> GPS-based features for meetups and local offers</li>
                <li><strong>Independent contracts:</strong> Legal agreements for housing and services</li>
                <li><strong>College-level content:</strong> Content and discussions appropriate for higher education</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">2.4 Geographic Restrictions</h3>
            <p className="text-black/70 mb-4">
              Our Service is currently available only to users in the United States. You may not use our Service if you are located outside the US or if such use would violate applicable laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">3. Account Registration and Security</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">3.1 Account Creation</h3>
            <p className="text-black/70 mb-4">
              To use certain features of Flin, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your account information</li>
              <li>Keep your login credentials secure and confidential</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">3.2 Student Verification</h3>
            <p className="text-black/70 mb-4">
              Student verification is simple and privacy-focused:
            </p>
            <div className="bg-green-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-green-900 mb-3">✅ Simple .edu Email Verification</h4>
              <ul className="text-green-800 text-sm space-y-2">
                <li><strong>Email verification only:</strong> Student status verified through valid .edu email address</li>
                <li><strong>No documents required:</strong> We do not collect or store identity documents</li>
                <li><strong>No third-party services:</strong> Verification handled directly by our system</li>
                <li><strong>Privacy-first approach:</strong> Minimal data collection for verification</li>
                <li><strong>Simple process:</strong> Register with .edu email and verify through email link</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">3.3 Account Termination</h3>
            <p className="text-black/70 mb-4">
              You may terminate your account at any time. We may suspend or terminate your account if you violate these Terms or our Community Guidelines.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">4. Platform Features and Services</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">4.1 Marketplace</h3>
            <p className="text-black/70 mb-4">
              Flin provides a marketplace where students can buy and sell items. You understand that:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>We are not a party to transactions between users</li>
              <li>We do not guarantee the quality, safety, or legality of items</li>
              <li>You are responsible for all aspects of your transactions</li>
              <li>Payments are processed through third-party providers</li>
              <li>We may charge fees for certain marketplace features</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">4.2 Housing Services</h3>
            <p className="text-black/70 mb-4">
              Our housing features help students find accommodation. You agree that:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>All housing arrangements are between you and property owners/managers</li>
              <li>We do not guarantee housing availability or quality</li>
              <li>You must comply with all applicable housing laws and regulations</li>
              <li>Rental disputes should be resolved directly with landlords</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">4.3 Local Offers</h3>
            <p className="text-black/70 mb-4">
              We connect students with local business offers and discounts. These offers:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Are provided by third-party merchants</li>
              <li>May have terms and conditions set by merchants</li>
              <li>Can expire or change without notice</li>
              <li>May not be combinable with other offers</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">4.4 Events</h3>
            <p className="text-black/70 mb-4">
              Campus and local events are posted by users and organizations. You understand:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Event information is provided by third parties</li>
              <li>We are not responsible for event quality or cancellations</li>
              <li>Age restrictions and other requirements apply to events</li>
              <li>You must comply with all event rules and regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">5. User Conduct and Prohibited Activities</h2>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-red-900 mb-3">🚨 Apple App Store Compliance Notice</h3>
              <p className="text-red-800 mb-3">
                In compliance with Apple App Store Review Guidelines, the following activities will result in immediate account termination and may lead to removal from the Apple Developer Program:
              </p>
              <ul className="text-red-800 text-sm space-y-2">
                <li><strong>Attempting to manipulate App Store rankings</strong> through fake reviews, ratings, or downloads</li>
                <li><strong>Submitting misleading app metadata</strong> or functionality descriptions</li>
                <li><strong>Creating spam accounts</strong> or engaging in fraudulent user behavior</li>
                <li><strong>Violating content guidelines</strong> that could affect app store status</li>
                <li><strong>Engaging in developer code of conduct violations</strong> as defined by Apple</li>
              </ul>
            </div>
            
            <h3 className="text-xl font-semibold text-black mb-3">5.1 General Conduct</h3>
            <p className="text-black/70 mb-4">You agree to use Flin responsibly and in accordance with all applicable laws. You will NOT:</p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Violate any local, state, federal, or international laws</li>
              <li>Infringe on intellectual property rights</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Post false, misleading, or deceptive information</li>
              <li>Engage in discriminatory behavior based on protected characteristics</li>
              <li>Use automated systems to access or use the Service</li>
              <li>Attempt to gain unauthorized access to our systems</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">5.2 Prohibited Items and Services</h3>
            <p className="text-black/70 mb-4">
              In compliance with Apple App Store Guidelines Section 1.1 (Objectionable Content), the following items and services are strictly prohibited on Flin:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Illegal Items:</strong> Drugs, weapons, stolen goods, counterfeit items</li>
              <li><strong>Academic Dishonesty:</strong> Test answers, completed assignments, thesis writing services</li>
              <li><strong>Adult Content:</strong> Sexually explicit materials, pornography, or services that facilitate prostitution</li>
              <li><strong>Dangerous Items:</strong> Hazardous chemicals, fireworks, weapons, or items that encourage violence</li>
              <li><strong>Prescription Items:</strong> Medications, medical devices, or controlled substances</li>
              <li><strong>Financial Services:</strong> Loans, credit services, cryptocurrency, or investment opportunities</li>
              <li><strong>Multi-level Marketing:</strong> Pyramid schemes, MLM recruitment, or get-rich-quick schemes</li>
              <li><strong>Alcohol and Tobacco:</strong> Even if legally purchased (due to student audience)</li>
              <li><strong>Defamatory Content:</strong> Discriminatory, mean-spirited, or harassment-related items/services</li>
              <li><strong>False Information:</strong> Fake documents, misleading services, or scam-related offerings</li>
              <li><strong>Privacy Violations:</strong> Items or services that compromise user privacy or data security</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">5.3 Academic Integrity</h3>
            <p className="text-black/70 mb-4">
              Flin supports academic integrity. You may not use our platform to:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Buy or sell completed academic work</li>
              <li>Share test answers or exam materials</li>
              <li>Facilitate cheating or plagiarism</li>
              <li>Circumvent academic policies or honor codes</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">5.4 Safety Requirements</h3>
            <p className="text-black/70 mb-4">For your safety and the safety of others:</p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Meet in public, well-lit locations for transactions</li>
              <li>Verify items before completing transactions</li>
              <li>Report suspicious or dangerous behavior immediately</li>
              <li>Do not share personal financial information</li>
              <li>Trust your instincts about unsafe situations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">6. User-Generated Content and Moderation</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">6.1 Content Moderation (Apple Guidelines 1.2 Compliance)</h3>
            <p className="text-black/70 mb-4">
              In compliance with Apple App Store Guidelines for user-generated content, Flin implements the following moderation systems:
            </p>
            
            <div className="bg-blue-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-blue-900 mb-3">🛡️ Required Moderation Features</h4>
              <ul className="text-blue-800 text-sm space-y-2">
                <li><strong>Blocking and reporting mechanisms:</strong> Easy-to-use tools to block users and report inappropriate content</li>
                <li><strong>Content filtering:</strong> Automated systems to detect and remove objectionable content</li>
                <li><strong>Human review process:</strong> Manual review of reported content within 24 hours</li>
                <li><strong>User identification:</strong> Student verification prevents anonymous abuse</li>
                <li><strong>Clear community guidelines:</strong> Comprehensive guidelines easily accessible to all users</li>
                <li><strong>Consequences for violations:</strong> Progressive enforcement including warnings, suspensions, and bans</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">6.2 Content Monitoring Systems</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>AI Content Scanning:</strong> Automated detection of prohibited content, hate speech, and harassment</li>
              <li><strong>Image Recognition:</strong> Scanning uploaded images for inappropriate, violent, or explicit content</li>
              <li><strong>Keyword Filtering:</strong> Real-time filtering of messages and posts for prohibited language</li>
              <li><strong>Pattern Recognition:</strong> Detection of spam, scam attempts, and fraudulent behavior</li>
              <li><strong>Community Reporting:</strong> User-driven reporting system with rapid response protocols</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">6.3 Age-Appropriate Content Standards</h3>
            <p className="text-black/70 mb-4">
              Given our 17+ user base and educational focus, all content must meet higher standards:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Educational appropriateness:</strong> Content should support academic and career goals</li>
              <li><strong>Professional language:</strong> Encouragement of respectful, professional communication</li>
              <li><strong>No exploitation:</strong> Zero tolerance for content that exploits or harms students</li>
              <li><strong>Mental health awareness:</strong> Proactive identification and response to content indicating distress</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">6.4 Appeals and Due Process</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Appeal process:</strong> Clear procedure for appealing content removal or account actions</li>
              <li><strong>Human review:</strong> Appeals reviewed by human moderators, not just automated systems</li>
              <li><strong>Timely response:</strong> Appeal decisions within 5 business days</li>
              <li><strong>Transparency:</strong> Clear explanation of policy violations and enforcement actions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">7. Content and Intellectual Property</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">7.1 User Content</h3>
            <p className="text-black/70 mb-4">
              You retain ownership of content you post on Flin but grant us a worldwide, royalty-free license to use, modify, and distribute your content for operating our Service. You represent that you have the right to post all content you submit.
            </p>

            <h3 className="text-xl font-semibold text-black mb-3">7.2 Platform Content</h3>
            <p className="text-black/70 mb-4">
              All Flin trademarks, logos, and proprietary content are owned by Flintime Inc. You may not use our intellectual property without written permission.
            </p>

            <h3 className="text-xl font-semibold text-black mb-3">7.3 Copyright Policy and DMCA Compliance</h3>
            <p className="text-black/70 mb-4">
              We respond to copyright infringement claims under the Digital Millennium Copyright Act (DMCA). If you believe your copyrighted work has been infringed, contact us with:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Description of the copyrighted work</li>
              <li>Location of the infringing material on our Service</li>
              <li>Your contact information and electronic signature</li>
              <li>Statement of good faith belief that use is unauthorized</li>
              <li>Statement that information is accurate and you're authorized to act</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">7.4 Third-Party Content Compliance (Apple Requirement)</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-yellow-900 mb-3">⚖️ Content Licensing Requirements</h4>
              <p className="text-yellow-800 mb-3">
                In compliance with Apple App Store Guidelines, all content must be properly licensed:
              </p>
              <ul className="text-yellow-800 text-sm space-y-2">
                <li><strong>Original content only:</strong> You may only upload content you own or have proper licensing for</li>
                <li><strong>No unauthorized materials:</strong> Copyrighted music, videos, images, or text require explicit permission</li>
                <li><strong>Brand protection:</strong> No unauthorized use of trademarks, logos, or brand identities</li>
                <li><strong>Academic content:</strong> Textbook pages, course materials, or assignments require permission</li>
                <li><strong>Immediate removal:</strong> Infringing content will be removed immediately upon discovery</li>
                <li><strong>Account penalties:</strong> Repeated violations may result in account termination</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">7.5 User Content Responsibility</h3>
            <p className="text-black/70 mb-4">
              By uploading content to Flin, you certify that:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Ownership or permission:</strong> You own the content or have explicit permission to use it</li>
              <li><strong>Rights to license:</strong> You have the right to grant us the license described in Section 7.1</li>
              <li><strong>No violations:</strong> Your content doesn't violate any copyright, trademark, or other IP rights</li>
              <li><strong>Accurate representations:</strong> All content descriptions and claims are truthful</li>
              <li><strong>Commercial use rights:</strong> If selling content, you have the right to do so commercially</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">8. Privacy and Data Protection</h2>
            <p className="text-black/70 mb-4">
              Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. Key points include:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>We collect information necessary to provide our Service</li>
              <li>Student verification data is processed securely and not retained long-term</li>
              <li>You control your privacy settings and data sharing preferences</li>
              <li>We implement security measures to protect your information</li>
              <li>We comply with applicable privacy laws including CCPA and FERPA guidelines</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">9. Payments and Fees</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">9.1 Service Fees and Business Model</h3>
            <p className="text-black/70 mb-4">
              Flin operates a freemium business model with the following fee structure:
            </p>
            
            <div className="bg-blue-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-blue-900 mb-3">📱 iOS App - Completely Free</h4>
              <ul className="text-blue-800 text-sm space-y-2">
                <li><strong>No transactions processed:</strong> The iOS app does not handle any payments or transactions</li>
                <li><strong>Free for students:</strong> All student features are completely free to use</li>
                <li><strong>Browse and connect:</strong> Students can browse offers, connect with others, and communicate</li>
                <li><strong>No in-app purchases:</strong> No digital content or services are sold within the app</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibant text-green-900 mb-3">🌐 Website - Vendor Subscriptions Only</h4>
              <ul className="text-green-800 text-sm space-y-2">
                <li><strong>Vendor subscription fees:</strong> Local businesses pay subscription fees through our website</li>
                <li><strong>Enhanced visibility:</strong> Paid subscriptions provide vendors with better placement and features</li>
                <li><strong>Web-based payments:</strong> All vendor payments are processed on flintime.com</li>
                <li><strong>No student fees:</strong> Students never pay fees for any services</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">9.2 Vendor Payment Processing (Website Only)</h3>
            <p className="text-black/70 mb-4">
              For vendors using our website subscription services, payments are processed through secure third-party providers. Vendors agree to:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Provide accurate payment information for subscription billing</li>
              <li>Pay all applicable subscription fees and taxes</li>
              <li>Resolve payment disputes directly with payment processors</li>
              <li>Accept responsibility for chargebacks and disputed transactions</li>
              <li>Maintain current payment methods for recurring subscriptions</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">9.3 Student Marketplace Transactions (External)</h3>
            <p className="text-black/70 mb-4">
              Student-to-student marketplace transactions are handled independently:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Direct transactions:</strong> Students arrange payments directly with each other</li>
              <li><strong>No Flin processing:</strong> We do not process, handle, or take fees from student transactions</li>
              <li><strong>Payment method choice:</strong> Students choose their own payment methods (cash, Venmo, etc.)</li>
              <li><strong>Transaction responsibility:</strong> Each party is responsible for their own payment arrangements</li>
              <li><strong>Dispute resolution:</strong> Payment disputes are resolved between the transacting parties</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">9.4 Apple App Store Compliance (Free App)</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-green-900 mb-3">✅ Free iOS App - No Payment Processing</h4>
              <p className="text-green-800 mb-3">
                Our iOS app is completely free and complies with Apple App Store Guidelines:
              </p>
              <ul className="text-green-800 text-sm space-y-2">
                <li><strong>No in-app purchases:</strong> The iOS app contains no purchasable content or services</li>
                <li><strong>No payment links:</strong> App does not direct to external payment pages</li>
                <li><strong>Free student platform:</strong> All student features are available without payment</li>
                <li><strong>Vendor subscriptions separate:</strong> Business subscriptions are handled entirely on website</li>
                <li><strong>Apple guidelines compliant:</strong> No violation of Section 3.1.1 payment requirements</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">9.5 Vendor Subscription Refunds</h3>
            <p className="text-black/70 mb-4">
              Vendor subscription refunds are handled as follows:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Monthly subscriptions:</strong> No refunds for partial months, cancel anytime for next billing cycle</li>
              <li><strong>Annual subscriptions:</strong> Pro-rated refunds available within first 30 days</li>
              <li><strong>Service errors:</strong> Full refunds provided for platform errors or service outages</li>
              <li><strong>Cancellation:</strong> Vendors can cancel subscriptions anytime through website account settings</li>
              <li><strong>Student transactions:</strong> No refunds applicable as Flin doesn't process student payments</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">10. Disclaimers and Limitation of Liability</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">10.1 Service Disclaimers</h3>
            <p className="text-black/70 mb-4">
              FLIN IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p className="text-black/70 mb-4">
              We do not warrant that:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>The Service will be uninterrupted or error-free</li>
              <li>Defects will be corrected</li>
              <li>The Service is free of viruses or harmful components</li>
              <li>User content is accurate or reliable</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">9.2 Third-Party Content</h3>
            <p className="text-black/70 mb-4">
              We are not responsible for content posted by users or third parties, including merchants, event organizers, or housing providers. User interactions and transactions occur at your own risk.
            </p>

            <h3 className="text-xl font-semibold text-black mb-3">9.3 Limitation of Liability</h3>
            <p className="text-black/70 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, FLINTIME INC. SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, DATA LOSS, OR BUSINESS INTERRUPTION.
            </p>
            <p className="text-black/70 mb-4">
              OUR TOTAL LIABILITY FOR ANY CLAIMS RELATED TO THE SERVICE SHALL NOT EXCEED $100 OR THE AMOUNT YOU PAID TO FLIN IN THE 12 MONTHS PRECEDING THE CLAIM, WHICHEVER IS GREATER.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">10. Indemnification</h2>
            <p className="text-black/70 mb-4">
              You agree to indemnify and hold Flintime Inc. harmless from any claims, damages, losses, or expenses (including attorney fees) arising from:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your transactions with other users</li>
              <li>Your content or activities on the platform</li>
              <li>Your violation of third-party rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">11. Dispute Resolution</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">11.1 Informal Resolution</h3>
            <p className="text-black/70 mb-4">
              Before filing any formal dispute, you agree to contact us at <a href="mailto:contact@flin.college" className="text-blue-600 hover:text-blue-500">contact@flin.college</a> to resolve the issue informally. We will work in good faith to resolve disputes within 30 days.
            </p>

            <h3 className="text-xl font-semibold text-black mb-3">11.2 Binding Arbitration</h3>
            <p className="text-black/70 mb-4">
              If informal resolution fails, disputes will be resolved through binding arbitration under the American Arbitration Association Consumer Arbitration Rules. Arbitration will be conducted in Delaware unless you qualify for telephonic or online arbitration.
            </p>

            <h3 className="text-xl font-semibold text-black mb-3">11.3 Class Action Waiver</h3>
            <p className="text-black/70 mb-4">
              You agree that disputes will be resolved individually and waive the right to participate in class actions or collective proceedings.
            </p>

            <h3 className="text-xl font-semibold text-black mb-3">11.4 Exceptions</h3>
            <p className="text-black/70 mb-4">
              Small claims court proceedings and injunctive relief for intellectual property violations are excluded from arbitration requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">12. Termination</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">12.1 Termination by You</h3>
            <p className="text-black/70 mb-4">
              You may terminate your account at any time through account settings or by contacting us. Upon termination, your access to the Service will be discontinued.
            </p>

            <h3 className="text-xl font-semibold text-black mb-3">12.2 Termination by Us</h3>
            <p className="text-black/70 mb-4">
              We may suspend or terminate your account immediately if you:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Violate these Terms or our policies</li>
              <li>Provide false information during registration or verification</li>
              <li>Engage in illegal or harmful activities</li>
              <li>Fail to maintain student status (with reasonable transition period)</li>
              <li>Create multiple accounts or circumvent suspensions</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">12.3 Account Deletion (Apple App Store Requirement)</h3>
            <p className="text-black/70 mb-4">
              In compliance with Apple App Store Guidelines, we provide the following account management options:
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-blue-900 mb-3">📱 Required Account Deletion Features</h4>
              <ul className="text-blue-800 text-sm space-y-2">
                <li><strong>In-app deletion:</strong> Delete your account directly within the Flin app</li>
                <li><strong>Data removal:</strong> All personal data is permanently deleted immediately</li>
                <li><strong>Confirmation process:</strong> Two-step verification to prevent accidental deletion</li>
                <li><strong>Download data:</strong> Export your data before deletion if desired</li>
                <li><strong>Immediate access revocation:</strong> Account access ends immediately upon deletion request</li>
                <li><strong>Transaction completion:</strong> Ongoing transactions must be completed before deletion</li>
              </ul>
            </div>

            <h4 className="text-lg font-semibold text-black mb-3">Account Deletion Process:</h4>
            <ol className="list-decimal pl-6 text-black/70 mb-4 space-y-2">
              <li>Go to Settings → Account → Delete Account</li>
              <li>Verify your identity with password or biometric authentication</li>
              <li>Complete or cancel any outstanding transactions</li>
              <li>Optionally download your account data</li>
              <li>Confirm deletion by typing "DELETE" and tapping the confirmation button</li>
              <li>Account and all associated data will be permanently deleted immediately</li>
            </ol>

            <h3 className="text-xl font-semibold text-black mb-3">12.4 Effect of Termination</h3>
            <p className="text-black/70 mb-4">
              Upon termination or account deletion:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Your access to the Service ends immediately</li>
              <li>Your profile and listings are permanently removed</li>
              <li>Outstanding transactions must be completed</li>
              <li>Personal data is deleted according to our data retention policy</li>
              <li>Certain provisions of these Terms survive termination</li>
              <li>You may create a new account after termination if desired</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">13. General Provisions</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">13.1 Governing Law</h3>
            <p className="text-black/70 mb-4">
              These Terms are governed by Delaware law without regard to conflict of law principles. Any legal proceedings must be brought in Delaware state or federal courts.
            </p>

            <h3 className="text-xl font-semibold text-black mb-3">13.2 Changes to Terms</h3>
            <p className="text-black/70 mb-4">
              We may modify these Terms at any time. Material changes will be communicated via email or in-app notification with 30 days' notice. Continued use after changes constitutes acceptance.
            </p>

            <h3 className="text-xl font-semibold text-black mb-3">13.3 Severability</h3>
            <p className="text-black/70 mb-4">
              If any provision of these Terms is found unenforceable, the remaining provisions will remain in full force and effect.
            </p>

            <h3 className="text-xl font-semibold text-black mb-3">13.4 Assignment</h3>
            <p className="text-black/70 mb-4">
              You may not assign your rights under these Terms. We may assign our rights to any affiliated company or successor entity.
            </p>

            <h3 className="text-xl font-semibold text-black mb-3">13.5 Force Majeure</h3>
            <p className="text-black/70 mb-4">
              We are not liable for delays or failures due to circumstances beyond our reasonable control, including natural disasters, government actions, or technical failures.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">14. Contact Information</h2>
            <p className="text-black/70 mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <p className="text-black/70 mb-2"><strong>Flintime Inc.</strong></p>
              <p className="text-black/70 mb-2">254 Chapman Rd, Ste 208 #20381</p>
              <p className="text-black/70 mb-2">Newark, Delaware 19702, US</p>
              <p className="text-black/70 mb-2">Email: <a href="mailto:contact@flin.college" className="text-blue-600 hover:text-blue-500">contact@flin.college</a></p>
              <p className="text-black/70">Subject Line: "Terms of Service Inquiry"</p>
            </div>
            <p className="text-black/70">
              We will respond to Terms-related inquiries within 30 days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">15. Apple App Store Additional Terms</h2>
            <p className="text-black/70 mb-4">
              If you access Flin through the Apple App Store, the following additional terms apply:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>These Terms are between you and Flintime Inc., not Apple</li>
              <li>Apple is not responsible for the Service or these Terms</li>
              <li>Apple has no obligation to provide support for the Service</li>
              <li>In case of app failure to conform to warranties, Apple may refund the purchase price</li>
              <li>Apple is not liable for any claims related to the Service</li>
              <li>You must comply with Apple's App Store Terms of Service</li>
              <li>Apple and its subsidiaries are third-party beneficiaries of these Terms</li>
            </ul>
          </section>
        </div>

        {/* Back to Legal Page */}
        <div className="border-t border-black/10 pt-8 mt-12">
          <Link 
            href="/legal" 
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-black/80 transition-all duration-300 hover-lift"
          >
            ← Back to Legal & Policies
          </Link>
        </div>
      </div>
    </div>
  );
}

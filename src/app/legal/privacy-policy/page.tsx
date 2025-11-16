import Link from 'next/link';

export default function PrivacyPolicy() {
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
            Privacy Policy
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
            <h2 className="text-2xl font-bold text-black mb-4">1. Introduction</h2>
            <p className="text-black/70 mb-4">
              Flintime Inc. ("we," "our," or "us") operates Flin, a student marketplace platform that connects college students across America with exclusive deals, housing opportunities, marketplace transactions, and campus events. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our mobile application and website (collectively, the "Service").
            </p>
            <p className="text-black/70 mb-4">
              <strong>Important:</strong> Our Service is designed exclusively for students aged 17 and older. By using Flin, you confirm that you are at least 17 years of age and enrolled in or affiliated with an accredited educational institution.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">2.1 Personal Information You Provide</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, phone number, date of birth, student status verification</li>
              <li><strong>Educational Information:</strong> College/university (from .edu email domain), graduation year, academic program (optional)</li>
              <li><strong>Profile Information:</strong> Profile picture, bio, interests, campus location</li>
              <li><strong>Communication Data:</strong> Messages, reviews, ratings, customer support communications</li>
              <li><strong>No verification documents:</strong> We do not collect student IDs or enrollment documents</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">2.2 Information We Collect Automatically</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Device Information:</strong> Device type, operating system, unique device identifiers, mobile network information</li>
              <li><strong>Usage Data:</strong> App usage patterns, features used, time spent on different sections</li>
              <li><strong>Location Data:</strong> Approximate location (city/campus level) to show relevant local offers and events</li>
              <li><strong>Log Data:</strong> IP address, access times, pages viewed, app crashes, system activity</li>
              <li><strong>Cookies and Tracking:</strong> Session cookies, analytics cookies, preference settings</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">2.3 Information from Third Parties</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Social Media:</strong> Profile information if you choose to link social accounts</li>
              <li><strong>Educational Institutions:</strong> Only .edu email domain verification (no direct institutional contact)</li>
              <li><strong>Payment Processors:</strong> No student payment data (vendor subscriptions only on website)</li>
              <li><strong>Analytics Services:</strong> Aggregated usage statistics and app performance data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">3. How We Use Your Information</h2>
            <p className="text-black/70 mb-4">We use your personal information for the following purposes:</p>
            
            <h3 className="text-xl font-semibold text-black mb-3">3.1 Core Service Functions</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Create and manage your student account</li>
              <li>Verify your student status through .edu email domain only</li>
              <li>Facilitate marketplace transactions between students</li>
              <li>Connect students with local offers and campus events</li>
              <li>Connect students for direct peer-to-peer transactions (no payment processing)</li>
              <li>Provide customer support and resolve disputes</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">3.2 Safety and Security</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Prevent fraud, spam, and abuse</li>
              <li>Protect student safety in transactions and meetups</li>
              <li>Monitor for prohibited content and activities</li>
              <li>Enforce our Terms of Service and Community Guidelines</li>
              <li>Comply with legal obligations and law enforcement requests</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">3.3 Platform Improvement</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Analyze usage patterns to improve app functionality</li>
              <li>Personalize content and recommendations</li>
              <li>Develop new features for the student community</li>
              <li>Conduct research on student marketplace trends</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">3.4 Communications</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Send transaction notifications and updates</li>
              <li>Share relevant local offers and events</li>
              <li>Provide important platform announcements</li>
              <li>Send marketing communications (with your consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-black/70 mb-4">We do not sell your personal information. We may share your information in the following circumstances:</p>
            
            <h3 className="text-xl font-semibold text-black mb-3">4.1 With Other Students</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Public profile information (name, photo, university, ratings)</li>
              <li>Marketplace listing details and transaction history</li>
              <li>Messages and communications related to transactions</li>
              <li>Reviews and ratings you provide or receive</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">4.2 With Service Providers</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Payment processing companies (Stripe, PayPal)</li>
              <li>Cloud hosting and data storage providers</li>
              <li>Customer support and communication platforms</li>
              <li>Analytics and app performance monitoring services</li>
              <li>Student verification services</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">4.3 Legal Requirements</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Comply with applicable laws, regulations, or legal processes</li>
              <li>Respond to lawful requests from public authorities</li>
              <li>Protect our rights, property, or safety</li>
              <li>Investigate and prevent illegal activities or policy violations</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">4.4 Business Transfers</h3>
            <p className="text-black/70 mb-4">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change in ownership or control.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">5. Data Security</h2>
            <p className="text-black/70 mb-4">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Encryption:</strong> All data transmission is encrypted using TLS/SSL protocols</li>
              <li><strong>Secure Storage:</strong> Personal data is stored in encrypted databases with restricted access</li>
              <li><strong>Access Controls:</strong> Employee access is limited and monitored based on job requirements</li>
              <li><strong>Regular Audits:</strong> Security practices are regularly reviewed and updated</li>
              <li><strong>Student ID Protection:</strong> Verification documents are processed securely and not retained</li>
            </ul>
            <p className="text-black/70 mb-4">
              However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">6. Data Retention and Deletion (Apple App Store Requirement)</h2>
            <p className="text-black/70 mb-4">
              In compliance with Apple App Store Guidelines, we provide clear data retention and deletion policies:
            </p>
            
            <h3 className="text-xl font-semibold text-black mb-3">6.1 Data Retention Periods</h3>
            <div className="bg-blue-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-blue-900 mb-3">📅 How Long We Keep Your Data</h4>
              <ul className="text-blue-800 text-sm space-y-2">
                <li><strong>Account data:</strong> Deleted immediately when you delete your account</li>
                <li><strong>Chat messages:</strong> Deleted immediately when you delete your account</li>
                <li><strong>Marketplace listings:</strong> Deleted immediately when you remove them or delete your account</li>
                <li><strong>Profile information:</strong> Deleted immediately when you delete your account</li>
                <li><strong>Usage analytics:</strong> Only anonymous, non-personal data retained for service improvement</li>
                <li><strong>Marketing preferences:</strong> Deleted immediately when you unsubscribe or delete account</li>
                <li><strong>No verification documents:</strong> We do not collect or store any identity documents</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">6.2 Immediate Account Deletion</h3>
            <p className="text-black/70 mb-4">
              When you delete your account, the following happens immediately:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Complete data removal:</strong> All personal data is permanently deleted from our systems</li>
              <li><strong>No recovery period:</strong> Deleted data cannot be recovered or restored</li>
              <li><strong>Anonymous data only:</strong> Only anonymized usage statistics remain for service improvement</li>
              <li><strong>Immediate effect:</strong> Account access is terminated and data deletion begins instantly</li>
              <li><strong>Clean slate:</strong> You can create a new account with the same email if desired</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">6.3 No Legal Retention Requirements</h3>
            <p className="text-black/70 mb-4">
              Unlike many platforms, we do not retain personal data for legal compliance because:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>No financial transactions:</strong> We don't process student payments, so no financial records to retain</li>
              <li><strong>No verification documents:</strong> We don't collect identity documents that would require retention</li>
              <li><strong>Simple verification:</strong> Student status is verified only through .edu email addresses</li>
              <li><strong>Anonymous safety data:</strong> Only anonymized incident data retained for platform safety</li>
              <li><strong>Clean deletion:</strong> Complete data removal is possible without legal complications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">7. Your Privacy Rights</h2>
            <p className="text-black/70 mb-4">You have the following rights regarding your personal information:</p>
            
            <h3 className="text-xl font-semibold text-black mb-3">7.1 Access and Control</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Account Settings:</strong> Update your profile and preferences at any time</li>
              <li><strong>Data Access:</strong> Request a copy of your personal information</li>
              <li><strong>Data Correction:</strong> Correct inaccurate or incomplete information</li>
              <li><strong>Data Deletion:</strong> Request deletion of your account and associated data</li>
              <li><strong>Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">6.2 Communication Preferences</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Opt out of marketing communications via email or app settings</li>
              <li>Control push notification preferences</li>
              <li>Manage email frequency and content preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">6.3 Location Data</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Control location sharing through device settings</li>
              <li>Opt out of location-based features and recommendations</li>
            </ul>

            <p className="text-black/70 mb-4">
              To exercise these rights, contact us at <a href="mailto:contact@flin.college" className="text-blue-600 hover:text-blue-500">contact@flin.college</a>. We will respond within 30 days of receiving your request.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">7. Student-Specific Privacy Protections</h2>
            <p className="text-black/70 mb-4">
              As a platform serving students, we implement additional privacy protections:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Educational Records:</strong> We do not access or store official educational records</li>
              <li><strong>Campus Privacy:</strong> Location data is limited to general campus/city level</li>
              <li><strong>Graduation Transition:</strong> Accounts remain active for 2 years post-graduation</li>
              <li><strong>Parent/Guardian Rights:</strong> For users under 18, parents may request account information</li>
              <li><strong>Academic Integrity:</strong> We do not facilitate academic dishonesty or share academic work</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">8. International Data Transfers</h2>
            <p className="text-black/70 mb-4">
              Flin operates primarily in the United States. Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for international transfers, including:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Standard contractual clauses with international service providers</li>
              <li>Adequacy decisions for data transfers to approved countries</li>
              <li>Binding corporate rules for intra-company transfers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">9. Children's Privacy</h2>
            <p className="text-black/70 mb-4">
              Flin is not intended for use by individuals under 17 years of age. We do not knowingly collect personal information from children under 17. If we become aware that we have collected personal information from a child under 17, we will take steps to delete such information promptly.
            </p>
            <p className="text-black/70 mb-4">
              If you are a parent or guardian and believe your child under 17 has provided us with personal information, please contact us at <a href="mailto:contact@flin.college" className="text-blue-600 hover:text-blue-500">contact@flin.college</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">10. State-Specific Privacy Rights</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">10.1 California Residents (CCPA)</h3>
            <p className="text-black/70 mb-4">California residents have additional rights under the California Consumer Privacy Act:</p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Right to know what personal information is collected and how it's used</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of the sale of personal information (we do not sell data)</li>
              <li>Right to non-discrimination for exercising privacy rights</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">10.2 Other State Laws</h3>
            <p className="text-black/70 mb-4">
              We comply with applicable state privacy laws, including Virginia's Consumer Data Protection Act (VCDPA) and Connecticut's Data Privacy Act (CTDPA). Contact us for information about your specific state rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-black/70 mb-4">
              We may update this Privacy Policy from time to time. When we make material changes, we will:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Post the updated policy on our website and app</li>
              <li>Send notification via email or in-app notification</li>
              <li>Update the "Last Updated" date</li>
              <li>For material changes, provide 30 days' notice before implementation</li>
            </ul>
            <p className="text-black/70 mb-4">
              Your continued use of Flin after the effective date constitutes acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">12. Apple App Store Privacy Requirements</h2>
            <p className="text-black/70 mb-4">
              In compliance with Apple App Store privacy requirements, we provide the following specific disclosures:
            </p>
            
            <h3 className="text-xl font-semibold text-black mb-3">12.1 App Privacy Report Transparency</h3>
            <p className="text-black/70 mb-4">
              The following data types are collected and their purposes as disclosed in our App Store listing:
            </p>
            <div className="bg-blue-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-blue-900 mb-3">Data Used to Track You</h4>
              <ul className="text-blue-800 text-sm space-y-2">
                <li><strong>Identifiers:</strong> Device ID for advertising and analytics (with explicit consent)</li>
                <li><strong>Usage Data:</strong> Product interaction for personalized advertising (with explicit consent)</li>
                <li><strong>Location:</strong> Coarse location for targeted local offers (with location permission)</li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-green-900 mb-3">Data Linked to You</h4>
              <ul className="text-green-800 text-sm space-y-2">
                <li><strong>Contact Info:</strong> Name, email, phone number for account creation and communication</li>
                <li><strong>User Content:</strong> Messages, photos, reviews, listings for marketplace functionality</li>
                <li><strong>Identifiers:</strong> User ID, device ID for account management and security</li>
                <li><strong>App Usage:</strong> Feature usage and interaction data for platform improvement</li>
                <li><strong>Location:</strong> Precise location for safety features and local offers (with permission)</li>
                <li><strong>Financial Info:</strong> No financial information collected in iOS app (vendor billing on website only)</li>
                <li><strong>Search History:</strong> Marketplace searches for improved recommendations</li>
                <li><strong>Usage Data:</strong> App interactions for feature improvement and support</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-gray-900 mb-3">Data Not Linked to You</h4>
              <ul className="text-gray-700 text-sm space-y-2">
                <li><strong>Diagnostics:</strong> Crash logs and performance data for app stability</li>
                <li><strong>Usage Data:</strong> Anonymous analytics for feature optimization</li>
                <li><strong>Performance Data:</strong> App loading times and technical metrics</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">12.2 iOS Permission Requests</h3>
            <p className="text-black/70 mb-4">
              We request the following iOS permissions with clear explanations:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Camera:</strong> "Take photos of items for marketplace listings"</li>
              <li><strong>Photo Library:</strong> "Select existing photos for your profile and marketplace listings"</li>
              <li><strong>Location Services:</strong> "Show nearby offers, events, and housing opportunities"</li>
              <li><strong>Push Notifications:</strong> "Receive alerts about messages, offers, and important updates"</li>
              <li><strong>Contacts:</strong> "Find friends who also use Flin (optional feature)"</li>
              <li><strong>Microphone:</strong> "Record voice messages in chat (optional feature)"</li>
              <li><strong>Face ID/Touch ID:</strong> "Secure and convenient app access"</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">12.3 Push Notification Privacy</h3>
            <p className="text-black/70 mb-4">
              Our push notification practices comply with Apple's privacy standards:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Device tokens only:</strong> We only receive device push tokens, not personal data</li>
              <li><strong>Message content:</strong> Sensitive message content is not included in notifications</li>
              <li><strong>User control:</strong> Full control over notification types and frequency</li>
              <li><strong>Opt-out anytime:</strong> Disable notifications in iOS Settings without losing app functionality</li>
              <li><strong>No tracking:</strong> Push tokens are not used for tracking across apps or websites</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">12.4 Third-Party SDK Disclosure</h3>
            <p className="text-black/70 mb-4">
              We use Apple-compliant third-party services that may collect data:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Analytics:</strong> Apple Analytics (no data shared), Firebase Analytics (anonymized only)</li>
              <li><strong>Payments:</strong> No payment processing in iOS app; website vendor billing uses Stripe</li>
              <li><strong>Crash Reporting:</strong> Apple Crash Reporting (automatic, no personal data)</li>
              <li><strong>Maps:</strong> Apple Maps (location queries only, no personal data stored)</li>
              <li><strong>Authentication:</strong> Sign in with Apple (minimal data sharing)</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">12.5 App Tracking Transparency (ATT) Compliance</h3>
            <p className="text-black/70 mb-4">
              We comply with iOS 14.5+ App Tracking Transparency requirements:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Explicit consent:</strong> We request permission before any cross-app tracking</li>
              <li><strong>Clear purpose:</strong> Explain exactly how tracking data will be used</li>
              <li><strong>No tracking default:</strong> If you decline, we don't track you across other apps</li>
              <li><strong>Functional without tracking:</strong> All core features work without tracking permission</li>
              <li><strong>Easy opt-out:</strong> Change tracking preferences anytime in iOS Settings</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">13. Contact Information</h2>
            <p className="text-black/70 mb-4">
              If you have questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <p className="text-black/70 mb-2"><strong>Flintime Inc.</strong></p>
              <p className="text-black/70 mb-2">254 Chapman Rd, Ste 208 #20381</p>
              <p className="text-black/70 mb-2">Newark, Delaware 19702, US</p>
              <p className="text-black/70 mb-2">Email: <a href="mailto:contact@flin.college" className="text-blue-600 hover:text-blue-500">contact@flin.college</a></p>
              <p className="text-black/70">Subject Line: "Privacy Policy Inquiry"</p>
            </div>
            <p className="text-black/70">
              We will respond to privacy-related inquiries within 30 days. For urgent privacy concerns, please include "URGENT" in your subject line.
            </p>
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

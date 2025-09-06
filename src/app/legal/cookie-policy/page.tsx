import Link from 'next/link';

export default function CookiePolicy() {
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
            Cookie Policy
          </h1>
          <p className="text-xl text-black/70 mb-4">
            Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-black/60 mb-6">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-lg text-black/70">
            Learn how Flin uses cookies and similar technologies to improve your experience
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">1. What Are Cookies?</h2>
            <p className="text-black/70 mb-4">
              Cookies are small text files that are stored on your device (computer, smartphone, or tablet) when you visit our website or use our mobile application. They help us remember your preferences, understand how you use our Service, and provide you with a better, more personalized experience.
            </p>
            
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">🍪 Cookie Basics</h3>
              <ul className="text-blue-800 text-sm space-y-2">
                <li><strong>Small data files:</strong> Cookies are typically only a few kilobytes in size</li>
                <li><strong>Device storage:</strong> Stored locally on your device, not on our servers</li>
                <li><strong>Automatic collection:</strong> Collected when you interact with our Service</li>
                <li><strong>Expiration dates:</strong> Some expire when you close your browser, others persist longer</li>
                <li><strong>No personal identification:</strong> Most cookies don't contain personally identifiable information</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">1.1 Similar Technologies</h3>
            <p className="text-black/70 mb-4">
              In addition to cookies, we use similar technologies including:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Web beacons:</strong> Tiny graphics that help us understand user behavior</li>
              <li><strong>Local storage:</strong> Browser storage for larger amounts of data</li>
              <li><strong>Session storage:</strong> Temporary storage that expires when you close your browser</li>
              <li><strong>Mobile identifiers:</strong> Device-specific identifiers for app functionality</li>
              <li><strong>Pixels:</strong> Code snippets that collect information about your visit</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">2. Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">2.1 Essential Cookies</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-green-900 mb-3">✅ Necessary for Basic Functionality</h4>
              <p className="text-green-800 mb-3">These cookies are essential for our Service to work properly. You cannot disable them through our settings, but you can block them through your browser settings (though this may affect functionality).</p>
              <ul className="text-green-800 text-sm space-y-2">
                <li><strong>Authentication:</strong> Keep you logged in to your account</li>
                <li><strong>Security:</strong> Protect against fraud and security threats</li>
                <li><strong>Session management:</strong> Maintain your session across page visits</li>
                <li><strong>Load balancing:</strong> Distribute traffic across our servers</li>
                <li><strong>Form data:</strong> Remember information you've entered in forms</li>
                <li><strong>Shopping cart:</strong> Keep track of items you're buying or selling</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">2.2 Performance and Analytics Cookies</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
              <h4 className="font-semibant text-blue-900 mb-3">📊 Understanding How You Use Flin</h4>
              <p className="text-blue-800 mb-3">These cookies help us analyze how students use our platform so we can improve our Service.</p>
              <ul className="text-blue-800 text-sm space-y-2">
                <li><strong>Usage analytics:</strong> Track which features are most popular</li>
                <li><strong>Performance monitoring:</strong> Identify and fix technical issues</li>
                <li><strong>Error tracking:</strong> Understand what causes app crashes or errors</li>
                <li><strong>Page load times:</strong> Monitor and improve site speed</li>
                <li><strong>User flows:</strong> See how students navigate through the app</li>
                <li><strong>A/B testing:</strong> Test different versions of features to improve user experience</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">2.3 Functionality Cookies</h3>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-purple-900 mb-3">⚙️ Enhancing Your Experience</h4>
              <p className="text-purple-800 mb-3">These cookies remember your preferences and choices to provide a personalized experience.</p>
              <ul className="text-purple-800 text-sm space-y-2">
                <li><strong>Language preferences:</strong> Remember your preferred language</li>
                <li><strong>Location settings:</strong> Remember your campus or city</li>
                <li><strong>Display preferences:</strong> Dark mode, font size, layout choices</li>
                <li><strong>Search filters:</strong> Remember your marketplace search preferences</li>
                <li><strong>Notification settings:</strong> Remember your communication preferences</li>
                <li><strong>Recently viewed:</strong> Show items or listings you've looked at</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">2.4 Targeting and Advertising Cookies</h3>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-orange-900 mb-3">🎯 Relevant Content and Offers</h4>
              <p className="text-orange-800 mb-3">These cookies help us show you relevant local offers and content that matches your interests as a student.</p>
              <ul className="text-orange-800 text-sm space-y-2">
                <li><strong>Interest-based content:</strong> Show relevant local offers and events</li>
                <li><strong>Campus-specific ads:</strong> Display promotions relevant to your school</li>
                <li><strong>Retargeting:</strong> Show ads for items you've viewed but not purchased</li>
                <li><strong>Frequency capping:</strong> Limit how often you see the same advertisement</li>
                <li><strong>Conversion tracking:</strong> Measure effectiveness of promotional campaigns</li>
                <li><strong>Social media integration:</strong> Enable sharing and social login features</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">3. First-Party vs. Third-Party Cookies</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">3.1 First-Party Cookies (Set by Flin)</h3>
            <p className="text-black/70 mb-4">
              These cookies are set directly by Flintime Inc. and are used to operate our Service:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>flin_session:</strong> Maintains your login session</li>
              <li><strong>flin_preferences:</strong> Stores your app settings and preferences</li>
              <li><strong>flin_cart:</strong> Remembers items in your shopping cart</li>
              <li><strong>flin_location:</strong> Stores your campus/city for local offers</li>
              <li><strong>flin_analytics:</strong> Tracks usage for app improvement</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">3.2 Third-Party Cookies</h3>
            <p className="text-black/70 mb-4">
              We work with trusted partners who may set their own cookies:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Analytics Partners</h4>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>Google Analytics (usage analysis)</li>
                  <li>Mixpanel (user behavior tracking)</li>
                  <li>Amplitude (product analytics)</li>
                  <li>Hotjar (user experience insights)</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Service Providers</h4>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>Stripe (payment processing)</li>
                  <li>SendGrid (email delivery)</li>
                  <li>Cloudflare (security and performance)</li>
                  <li>Facebook/Instagram (social integration)</li>
                </ul>
              </div>
            </div>

            <p className="text-black/70 mb-4">
              <strong>Important:</strong> Third-party cookies are governed by the privacy policies of these external companies. We encourage you to review their policies to understand how they handle your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">4. How We Use Cookie Information</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">4.1 Service Improvement</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Feature development:</strong> Understand which features students use most</li>
              <li><strong>Bug fixes:</strong> Identify and resolve technical issues</li>
              <li><strong>Performance optimization:</strong> Make the app faster and more reliable</li>
              <li><strong>User experience:</strong> Design more intuitive interfaces</li>
              <li><strong>Mobile optimization:</strong> Improve app performance on different devices</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">4.2 Personalization</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Content recommendations:</strong> Suggest relevant marketplace items</li>
              <li><strong>Local offers:</strong> Show deals and events near your campus</li>
              <li><strong>Search improvements:</strong> Better search results based on your interests</li>
              <li><strong>Housing matches:</strong> More relevant housing recommendations</li>
              <li><strong>Event suggestions:</strong> Campus events that match your interests</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">4.3 Security and Fraud Prevention</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Account protection:</strong> Detect unusual login patterns</li>
              <li><strong>Transaction security:</strong> Prevent fraudulent marketplace activities</li>
              <li><strong>Bot detection:</strong> Identify and block automated abuse</li>
              <li><strong>Spam prevention:</strong> Reduce fake listings and scam attempts</li>
              <li><strong>Student verification:</strong> Ensure platform integrity</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">4.4 Communication</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Notification preferences:</strong> Remember how you want to be contacted</li>
              <li><strong>Email customization:</strong> Send relevant updates and offers</li>
              <li><strong>Push notification targeting:</strong> Send timely, relevant app notifications</li>
              <li><strong>Marketing personalization:</strong> Share information about features you might like</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">5. Managing Your Cookie Preferences</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">5.1 Flin Cookie Settings</h3>
            <p className="text-black/70 mb-4">
              You can manage your cookie preferences through your Flin account settings:
            </p>
            <div className="bg-blue-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-blue-900 mb-3">How to Adjust Your Preferences</h4>
              <ol className="list-decimal pl-6 text-blue-800 text-sm space-y-2">
                <li>Log in to your Flin account</li>
                <li>Go to Settings → Privacy & Security</li>
                <li>Select "Cookie Preferences"</li>
                <li>Choose which types of cookies to allow</li>
                <li>Save your preferences</li>
              </ol>
              <p className="text-blue-800 text-sm mt-3">
                <strong>Note:</strong> Some essential cookies cannot be disabled as they're required for basic functionality.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">5.2 Browser Cookie Controls</h3>
            <p className="text-black/70 mb-4">
              You can also manage cookies through your web browser settings:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Desktop Browsers</h4>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li><strong>Chrome:</strong> Settings → Privacy → Cookies</li>
                  <li><strong>Firefox:</strong> Options → Privacy → Cookies</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                  <li><strong>Edge:</strong> Settings → Privacy → Cookies</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Mobile Browsers</h4>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li><strong>iOS Safari:</strong> Settings → Safari → Privacy</li>
                  <li><strong>Android Chrome:</strong> Menu → Settings → Privacy</li>
                  <li><strong>Mobile Firefox:</strong> Menu → Settings → Privacy</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">5.3 Mobile App Settings</h3>
            <p className="text-black/70 mb-4">
              For our mobile app, you can control data collection through:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>App permissions:</strong> Control access to location, contacts, and other data</li>
              <li><strong>Push notifications:</strong> Choose which notifications you receive</li>
              <li><strong>Analytics opt-out:</strong> Disable usage tracking in app settings</li>
              <li><strong>Advertising ID:</strong> Reset or opt out of targeted advertising</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">5.4 Third-Party Opt-Outs</h3>
            <p className="text-black/70 mb-4">
              You can opt out of third-party tracking through these resources:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:text-blue-500" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out</a></li>
              <li><strong>Facebook:</strong> <a href="https://www.facebook.com/help/568137493302217" className="text-blue-600 hover:text-blue-500" target="_blank" rel="noopener noreferrer">Facebook Ad Preferences</a></li>
              <li><strong>Digital Advertising Alliance:</strong> <a href="http://optout.aboutads.info/" className="text-blue-600 hover:text-blue-500" target="_blank" rel="noopener noreferrer">AdChoices Opt-out</a></li>
              <li><strong>Network Advertising Initiative:</strong> <a href="http://optout.networkadvertising.org/" className="text-blue-600 hover:text-blue-500" target="_blank" rel="noopener noreferrer">NAI Opt-out</a></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">6. Impact of Disabling Cookies</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">⚠️ What Happens When You Disable Cookies</h3>
              <p className="text-yellow-800 mb-3">
                While you have the right to control cookies, disabling them may affect your Flin experience:
              </p>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">6.1 Essential Functionality</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Login issues:</strong> You may need to log in repeatedly</li>
              <li><strong>Cart problems:</strong> Items may not stay in your shopping cart</li>
              <li><strong>Preference loss:</strong> Settings and preferences won't be saved</li>
              <li><strong>Security risks:</strong> Reduced protection against fraud and abuse</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">6.2 Reduced Personalization</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Generic content:</strong> Less relevant marketplace recommendations</li>
              <li><strong>Location issues:</strong> May not show local offers and events</li>
              <li><strong>Search problems:</strong> Less accurate search results</li>
              <li><strong>Repetitive ads:</strong> May see the same advertisements repeatedly</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">6.3 Performance Impact</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Slower loading:</strong> Pages may load more slowly</li>
              <li><strong>Technical issues:</strong> Some features may not work properly</li>
              <li><strong>Mobile problems:</strong> App performance may be affected</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">7. Student Privacy Protections</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">7.1 FERPA Compliance</h3>
            <p className="text-black/70 mb-4">
              As a platform serving students, we're mindful of educational privacy laws:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Educational records:</strong> We don't collect or store official academic records</li>
              <li><strong>Student verification:</strong> Verification data is processed securely and not retained</li>
              <li><strong>Campus information:</strong> General campus affiliation only, not specific academic details</li>
              <li><strong>Parent rights:</strong> For students under 18, parents may request information about cookie usage</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">7.2 Age-Appropriate Practices</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>17+ requirement:</strong> Our Service is designed for students 17 and older</li>
              <li><strong>Campus-appropriate content:</strong> Cookies help ensure age-appropriate advertising</li>
              <li><strong>Academic integrity:</strong> We don't use cookies to facilitate academic dishonesty</li>
              <li><strong>Student safety:</strong> Cookie data helps us identify and prevent harmful behavior</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">7.3 Graduation Transition</h3>
            <p className="text-black/70 mb-4">
              When students graduate, we handle cookie data appropriately:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Account transition:</strong> Cookies continue to work for 2 years post-graduation</li>
              <li><strong>Data retention:</strong> Cookie preferences are maintained during transition period</li>
              <li><strong>Content adjustment:</strong> Advertising gradually shifts from student-focused to general</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">8. International Considerations</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">8.1 Cross-Border Data Transfers</h3>
            <p className="text-black/70 mb-4">
              Cookie data may be transferred to and processed in countries other than the US:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Service providers:</strong> Some analytics and service providers are based internationally</li>
              <li><strong>Data protection:</strong> We ensure appropriate safeguards for international transfers</li>
              <li><strong>EU students:</strong> GDPR protections apply to EU students studying in the US</li>
              <li><strong>Standard clauses:</strong> We use standard contractual clauses for international transfers</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">8.2 State-Specific Rights</h3>
            <p className="text-black/70 mb-4">
              Depending on your state, you may have additional rights regarding cookies:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>California (CCPA):</strong> Right to know what information is collected via cookies</li>
              <li><strong>Virginia (VCDPA):</strong> Right to opt out of certain cookie-based processing</li>
              <li><strong>Connecticut (CTDPA):</strong> Similar rights to Virginia residents</li>
              <li><strong>Other states:</strong> Additional state privacy laws may apply</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">9. Cookie Security</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">9.1 Security Measures</h3>
            <p className="text-black/70 mb-4">
              We implement strong security measures to protect cookie data:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Encryption:</strong> Sensitive cookie data is encrypted during transmission</li>
              <li><strong>Secure flags:</strong> Cookies use secure transmission protocols</li>
              <li><strong>HTTPOnly:</strong> Many cookies are marked HTTPOnly to prevent JavaScript access</li>
              <li><strong>SameSite:</strong> Cookies include SameSite attributes for cross-site protection</li>
              <li><strong>Regular audits:</strong> We regularly review and update cookie security practices</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">9.2 Data Minimization</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Necessary data only:</strong> We only collect cookie data needed for specific purposes</li>
              <li><strong>Retention limits:</strong> Cookies expire based on their purpose and legal requirements</li>
              <li><strong>Regular cleanup:</strong> Unused or expired cookie data is automatically deleted</li>
              <li><strong>Purpose limitation:</strong> Cookie data is only used for stated purposes</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">9.3 Incident Response</h3>
            <p className="text-black/70 mb-4">
              In the unlikely event of a security incident involving cookie data:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Immediate response:</strong> We take immediate action to secure affected systems</li>
              <li><strong>User notification:</strong> Affected users are notified according to legal requirements</li>
              <li><strong>Regulatory reporting:</strong> We report incidents to relevant authorities as required</li>
              <li><strong>Preventive measures:</strong> We implement additional safeguards to prevent future incidents</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">10. Changes to This Cookie Policy</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">10.1 Policy Updates</h3>
            <p className="text-black/70 mb-4">
              We may update this Cookie Policy to reflect changes in our practices or legal requirements:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Regular reviews:</strong> We review this policy annually or when practices change</li>
              <li><strong>User notification:</strong> Material changes will be communicated via email or app notification</li>
              <li><strong>Effective dates:</strong> Changes take effect 30 days after notification</li>
              <li><strong>Consent updates:</strong> You may need to update your cookie preferences after major changes</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">10.2 Version History</h3>
            <p className="text-black/70 mb-4">
              We maintain a history of policy changes for transparency:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Current version:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</li>
              <li><strong>Previous versions:</strong> Available upon request</li>
              <li><strong>Change log:</strong> Summary of modifications provided with updates</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">11. Contact Us About Cookies</h2>
            <p className="text-black/70 mb-4">
              If you have questions about our use of cookies or want to exercise your rights:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <p className="text-black/70 mb-2"><strong>Flintime Inc. Privacy Team</strong></p>
              <p className="text-black/70 mb-2">254 Chapman Rd, Ste 208 #20381</p>
              <p className="text-black/70 mb-2">Newark, Delaware 19702, US</p>
              <p className="text-black/70 mb-2">Email: <a href="mailto:contact@flin.college" className="text-blue-600 hover:text-blue-500">contact@flin.college</a></p>
              <p className="text-black/70 mb-2">Subject Line Options:</p>
              <ul className="list-disc pl-6 text-black/70 text-sm space-y-1">
                <li>"Cookie Policy Question"</li>
                <li>"Cookie Preferences Update"</li>
                <li>"Third-Party Cookie Inquiry"</li>
                <li>"Data Subject Rights Request"</li>
              </ul>
            </div>
            <p className="text-black/70">
              We will respond to cookie-related inquiries within 30 days. For urgent privacy concerns, include "URGENT" in your subject line.
            </p>
          </section>

          <div className="bg-blue-50 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Your Choice, Your Control</h3>
            <p className="text-blue-800">
              We believe in transparency and user control when it comes to cookies and tracking technologies. While cookies help us provide a better, more personalized experience for students, you always have the choice to control how your data is collected and used. We're committed to using cookies responsibly and in ways that benefit the student community while respecting your privacy preferences.
            </p>
          </div>
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

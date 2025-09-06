import Link from 'next/link';

export default function Accessibility() {
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
            Accessibility Statement
          </h1>
          <p className="text-xl text-black/70 mb-4">
            Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-black/60 mb-6">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-lg text-black/70">
            Flin is committed to ensuring digital accessibility for all students, including those with disabilities
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">1. Our Accessibility Commitment</h2>
            <p className="text-black/70 mb-4">
              Flintime Inc. is dedicated to providing a student marketplace platform that is accessible to all users, including students with disabilities. We believe that every student should have equal access to the opportunities, connections, and resources that Flin provides, regardless of their abilities or the assistive technologies they use.
            </p>
            
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">♿ Our Vision</h3>
              <p className="text-blue-800 mb-3">
                We envision a digital campus community where accessibility is built in, not added on. Every student should be able to:
              </p>
              <ul className="text-blue-800 text-sm space-y-2">
                <li>Navigate our platform easily and independently</li>
                <li>Access all features and functionality</li>
                <li>Participate fully in the student marketplace</li>
                <li>Connect with fellow students without barriers</li>
                <li>Customize their experience to meet their needs</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">1.1 Legal Compliance</h3>
            <p className="text-black/70 mb-4">
              We strive to comply with applicable accessibility laws and standards, including:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Americans with Disabilities Act (ADA):</strong> Ensuring equal access to our digital services</li>
              <li><strong>Section 508:</strong> Following federal accessibility standards</li>
              <li><strong>WCAG 2.1 Level AA:</strong> Implementing Web Content Accessibility Guidelines</li>
              <li><strong>Section 504:</strong> Non-discrimination in federally funded programs</li>
              <li><strong>State accessibility laws:</strong> Compliance with applicable state requirements</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">1.2 Student-Centered Approach</h3>
            <p className="text-black/70 mb-4">
              As a platform serving the student community, we recognize the diverse needs of college students with disabilities and work to create inclusive experiences that support academic success and social connection.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">2. Accessibility Standards and Guidelines</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">2.1 WCAG 2.1 Level AA Compliance</h3>
            <p className="text-black/70 mb-4">
              We follow the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA as our primary standard. This includes:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-semibold text-green-900 mb-3">✅ Perceivable</h4>
                <ul className="text-green-800 text-sm space-y-2">
                  <li>Alt text for all images</li>
                  <li>Sufficient color contrast ratios</li>
                  <li>Resizable text up to 200%</li>
                  <li>Audio descriptions for videos</li>
                  <li>Non-color dependent information</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-3">⌨️ Operable</h4>
                <ul className="text-blue-800 text-sm space-y-2">
                  <li>Full keyboard navigation</li>
                  <li>No seizure-inducing content</li>
                  <li>Sufficient time for interactions</li>
                  <li>Clear navigation structure</li>
                  <li>Focus indicators</li>
                </ul>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h4 className="font-semibold text-purple-900 mb-3">💡 Understandable</h4>
                <ul className="text-purple-800 text-sm space-y-2">
                  <li>Clear, simple language</li>
                  <li>Consistent navigation</li>
                  <li>Error identification and suggestions</li>
                  <li>Predictable functionality</li>
                  <li>Input assistance</li>
                </ul>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h4 className="font-semibold text-orange-900 mb-3">🔧 Robust</h4>
                <ul className="text-orange-800 text-sm space-y-2">
                  <li>Compatible with assistive technologies</li>
                  <li>Valid, semantic HTML</li>
                  <li>Cross-platform functionality</li>
                  <li>Future-proof design</li>
                  <li>Progressive enhancement</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">2.2 Mobile Accessibility</h3>
            <p className="text-black/70 mb-4">
              Our mobile app includes accessibility features for iOS and Android:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>iOS:</strong> VoiceOver, Switch Control, Voice Control compatibility</li>
              <li><strong>Android:</strong> TalkBack, Select to Speak, Switch Access support</li>
              <li><strong>Dynamic text:</strong> Respects system font size preferences</li>
              <li><strong>High contrast:</strong> Adapts to system accessibility settings</li>
              <li><strong>Haptic feedback:</strong> Provides tactile responses for interactions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">3. Accessibility Features</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">3.1 Visual Accessibility</h3>
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-gray-900 mb-3">👁️ Supporting Visual Needs</h4>
              <ul className="text-gray-700 text-sm space-y-2">
                <li><strong>High contrast mode:</strong> Enhanced contrast for better visibility</li>
                <li><strong>Text scaling:</strong> Adjustable font sizes up to 200% without horizontal scrolling</li>
                <li><strong>Color accessibility:</strong> Information conveyed through multiple visual cues, not just color</li>
                <li><strong>Screen reader support:</strong> Full compatibility with NVDA, JAWS, VoiceOver, and TalkBack</li>
                <li><strong>Alternative text:</strong> Descriptive alt text for all informative images</li>
                <li><strong>Focus indicators:</strong> Clear visual indicators for keyboard navigation</li>
                <li><strong>Magnification support:</strong> Works well with screen magnification software</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">3.2 Motor and Mobility Accessibility</h3>
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-gray-900 mb-3">🖱️ Supporting Motor Needs</h4>
              <ul className="text-gray-700 text-sm space-y-2">
                <li><strong>Keyboard navigation:</strong> Full platform functionality available via keyboard</li>
                <li><strong>Large click targets:</strong> Touch targets meet minimum size requirements</li>
                <li><strong>Drag-and-drop alternatives:</strong> Alternative methods for drag-and-drop interactions</li>
                <li><strong>Timing adjustments:</strong> Extended time limits for form completion</li>
                <li><strong>Click alternatives:</strong> Hover actions have click equivalents</li>
                <li><strong>Voice control:</strong> Compatible with voice navigation software</li>
                <li><strong>Switch navigation:</strong> Support for switch-based navigation devices</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">3.3 Cognitive Accessibility</h3>
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-gray-900 mb-3">🧠 Supporting Cognitive Needs</h4>
              <ul className="text-gray-700 text-sm space-y-2">
                <li><strong>Simple language:</strong> Clear, concise instructions and content</li>
                <li><strong>Consistent layout:</strong> Predictable navigation and interface patterns</li>
                <li><strong>Error prevention:</strong> Clear form validation and error messages</li>
                <li><strong>Progress indicators:</strong> Visual feedback for multi-step processes</li>
                <li><strong>Help text:</strong> Contextual assistance and tooltips</li>
                <li><strong>Search functionality:</strong> Easy-to-use search with filters and suggestions</li>
                <li><strong>Bookmarking:</strong> Save and return to important content easily</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">3.4 Hearing Accessibility</h3>
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-gray-900 mb-3">👂 Supporting Hearing Needs</h4>
              <ul className="text-gray-700 text-sm space-y-2">
                <li><strong>Visual alerts:</strong> Visual notifications for audio alerts</li>
                <li><strong>Captions:</strong> Closed captions for all video content</li>
                <li><strong>Transcripts:</strong> Text alternatives for audio content</li>
                <li><strong>Sign language:</strong> Sign language interpretation for important announcements</li>
                <li><strong>Text communication:</strong> Chat and messaging features as alternatives to voice</li>
                <li><strong>Visual indicators:</strong> Visual cues for sound-based feedback</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">4. Assistive Technology Compatibility</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">4.1 Screen Readers</h3>
            <p className="text-black/70 mb-4">
              Flin is tested and optimized for compatibility with leading screen readers:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Desktop Screen Readers</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>NVDA (Windows) - Latest version</li>
                  <li>JAWS (Windows) - Version 2020+</li>
                  <li>VoiceOver (macOS) - Latest version</li>
                  <li>Dragon NaturallySpeaking</li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Mobile Screen Readers</h4>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>VoiceOver (iOS) - iOS 14+</li>
                  <li>TalkBack (Android) - Android 9+</li>
                  <li>Voice Assistant (Samsung)</li>
                  <li>Select to Speak (Android)</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">4.2 Other Assistive Technologies</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Voice recognition software:</strong> Dragon NaturallySpeaking, Windows Speech Recognition</li>
              <li><strong>Switch devices:</strong> Compatible with various switch navigation systems</li>
              <li><strong>Eye-tracking devices:</strong> Support for eye-gaze navigation systems</li>
              <li><strong>Magnification software:</strong> ZoomText, Windows Magnifier, macOS Zoom</li>
              <li><strong>Alternative keyboards:</strong> On-screen keyboards and specialized input devices</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">4.3 Browser Compatibility</h3>
            <p className="text-black/70 mb-4">
              Our accessibility features work across modern browsers:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Chrome:</strong> Version 90+ with full accessibility API support</li>
              <li><strong>Firefox:</strong> Version 88+ with accessibility features enabled</li>
              <li><strong>Safari:</strong> Version 14+ with VoiceOver integration</li>
              <li><strong>Edge:</strong> Version 90+ with accessibility tools</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">5. Platform-Specific Accessibility</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">5.1 Marketplace Accessibility</h3>
            <p className="text-black/70 mb-4">
              Our marketplace features are designed to be accessible to all students:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Product listings:</strong> Detailed descriptions and alt text for product images</li>
              <li><strong>Search filters:</strong> Keyboard-accessible filters with clear labels</li>
              <li><strong>Transaction process:</strong> Step-by-step guidance with progress indicators</li>
              <li><strong>Messaging system:</strong> Screen reader compatible with keyboard navigation</li>
              <li><strong>Reviews and ratings:</strong> Accessible rating systems and review forms</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">5.2 Housing Accessibility</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Housing listings:</strong> Detailed accessibility information for properties</li>
              <li><strong>Accessibility filters:</strong> Search specifically for accessible housing</li>
              <li><strong>Virtual tours:</strong> Descriptive audio for virtual property tours</li>
              <li><strong>Contact forms:</strong> Accessible application and inquiry forms</li>
              <li><strong>Accommodation requests:</strong> Easy process for requesting housing accommodations</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">5.3 Events Accessibility</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Event details:</strong> Comprehensive accessibility information for events</li>
              <li><strong>Accommodation requests:</strong> Process for requesting event accommodations</li>
              <li><strong>Virtual attendance:</strong> Remote participation options when available</li>
              <li><strong>Calendar integration:</strong> Accessible calendar interfaces and reminders</li>
              <li><strong>Location information:</strong> Detailed accessibility information for venues</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">5.4 Local Offers Accessibility</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Business information:</strong> Accessibility details for participating businesses</li>
              <li><strong>Location services:</strong> Accessible maps and directions</li>
              <li><strong>Offer details:</strong> Clear terms and conditions with simple language</li>
              <li><strong>Redemption process:</strong> Accessible methods for using offers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">6. Testing and Quality Assurance</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">6.1 Accessibility Testing Process</h3>
            <p className="text-black/70 mb-4">
              We employ comprehensive testing methods to ensure accessibility:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Automated testing:</strong> Regular scans using axe-core, WAVE, and other tools</li>
              <li><strong>Manual testing:</strong> Human evaluation of accessibility features</li>
              <li><strong>Assistive technology testing:</strong> Testing with real screen readers and other AT</li>
              <li><strong>User testing:</strong> Feedback from students with disabilities</li>
              <li><strong>Expert review:</strong> Third-party accessibility audits</li>
              <li><strong>Continuous monitoring:</strong> Ongoing assessment of accessibility compliance</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">6.2 Testing Frequency</h3>
            <div className="bg-green-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-green-900 mb-3">🔄 Regular Testing Schedule</h4>
              <ul className="text-green-800 text-sm space-y-2">
                <li><strong>Daily:</strong> Automated accessibility checks on all deployments</li>
                <li><strong>Weekly:</strong> Manual testing of new features and updates</li>
                <li><strong>Monthly:</strong> Comprehensive assistive technology testing</li>
                <li><strong>Quarterly:</strong> User testing sessions with students with disabilities</li>
                <li><strong>Annually:</strong> Third-party accessibility audit</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">6.3 User Feedback Integration</h3>
            <p className="text-black/70 mb-4">
              Student feedback is crucial to our accessibility efforts:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Accessibility feedback form:</strong> Dedicated form for accessibility issues</li>
              <li><strong>User testing panels:</strong> Regular sessions with students with disabilities</li>
              <li><strong>Campus partnerships:</strong> Collaboration with disability services offices</li>
              <li><strong>Rapid response:</strong> Quick fixes for critical accessibility barriers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">7. Known Limitations and Ongoing Improvements</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">7.1 Current Limitations</h3>
            <p className="text-black/70 mb-4">
              We are transparent about areas where we are still working to improve accessibility:
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-yellow-900 mb-3">⚠️ Areas Under Development</h4>
              <ul className="text-yellow-800 text-sm space-y-2">
                <li><strong>Complex interactions:</strong> Some advanced features may have limited keyboard navigation</li>
                <li><strong>Third-party content:</strong> External content may not always meet our accessibility standards</li>
                <li><strong>Mobile app parity:</strong> Some web accessibility features are still being implemented in mobile</li>
                <li><strong>Real-time features:</strong> Live chat and notifications may have accessibility gaps</li>
                <li><strong>Legacy content:</strong> Older content may not meet current accessibility standards</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">7.2 Improvement Roadmap</h3>
            <p className="text-black/70 mb-4">
              Our accessibility improvement plan includes:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Q1 2024:</strong> Enhanced mobile app accessibility features</li>
              <li><strong>Q2 2024:</strong> Improved keyboard navigation for complex interactions</li>
              <li><strong>Q3 2024:</strong> Better real-time feature accessibility</li>
              <li><strong>Q4 2024:</strong> Advanced voice control integration</li>
              <li><strong>Ongoing:</strong> Regular content audits and updates</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">7.3 Alternative Access</h3>
            <p className="text-black/70 mb-4">
              When accessibility barriers exist, we provide alternative access methods:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Customer support:</strong> Phone and email assistance for inaccessible features</li>
              <li><strong>Alternative formats:</strong> Information provided in accessible formats upon request</li>
              <li><strong>Workarounds:</strong> Temporary solutions while permanent fixes are developed</li>
              <li><strong>Priority support:</strong> Expedited assistance for accessibility-related issues</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">8. Getting Help and Support</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">8.1 Accessibility Support Team</h3>
            <p className="text-black/70 mb-4">
              Our dedicated accessibility support team is here to help:
            </p>
            <div className="bg-blue-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-blue-900 mb-3">📞 Contact Information</h4>
              <ul className="text-blue-800 text-sm space-y-2">
                <li><strong>Email:</strong> <a href="mailto:accessibility@flin.college" className="underline">accessibility@flin.college</a></li>
                <li><strong>Phone:</strong> 1-800-FLIN-ACCESS (1-800-354-6222)</li>
                <li><strong>Text/SMS:</strong> Available upon request</li>
                <li><strong>Video relay:</strong> VRS-compatible phone support</li>
                <li><strong>Response time:</strong> Within 24 hours for accessibility issues</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">8.2 How We Can Help</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Technical assistance:</strong> Help using Flin with assistive technologies</li>
              <li><strong>Feature guidance:</strong> Explaining how to access specific functionality</li>
              <li><strong>Alternative formats:</strong> Providing information in accessible formats</li>
              <li><strong>Accommodation requests:</strong> Arranging reasonable accommodations</li>
              <li><strong>Issue reporting:</strong> Logging and tracking accessibility problems</li>
              <li><strong>Feature requests:</strong> Considering accessibility improvements</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">8.3 Campus Disability Services</h3>
            <p className="text-black/70 mb-4">
              We encourage collaboration with your campus disability services office:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Accommodation letters:</strong> We work with official accommodation requests</li>
              <li><strong>Technology support:</strong> Coordinating with campus AT support</li>
              <li><strong>Training resources:</strong> Providing accessibility training materials</li>
              <li><strong>Feedback partnership:</strong> Collaborating on accessibility improvements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">9. Reporting Accessibility Issues</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">9.1 How to Report Issues</h3>
            <p className="text-black/70 mb-4">
              If you encounter accessibility barriers while using Flin, please report them:
            </p>
            <div className="bg-green-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-green-900 mb-3">📝 Reporting Process</h4>
              <ol className="list-decimal pl-6 text-green-800 text-sm space-y-2">
                <li>Email us at <a href="mailto:accessibility@flin.college" className="underline">accessibility@flin.college</a></li>
                <li>Include "Accessibility Issue" in the subject line</li>
                <li>Describe the problem you encountered</li>
                <li>Tell us what you were trying to accomplish</li>
                <li>Include your device/browser information</li>
                <li>Mention any assistive technology you use</li>
                <li>Provide screenshots if helpful</li>
              </ol>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">9.2 What to Include in Reports</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Specific location:</strong> Which page or feature had the issue</li>
              <li><strong>Expected behavior:</strong> What you expected to happen</li>
              <li><strong>Actual behavior:</strong> What actually happened</li>
              <li><strong>Impact level:</strong> How this affects your ability to use Flin</li>
              <li><strong>Workaround needed:</strong> Whether you need immediate assistance</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">9.3 Our Response Process</h3>
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-gray-900 mb-3">⏱️ Response Timeline</h4>
              <ul className="text-gray-700 text-sm space-y-2">
                <li><strong>Acknowledgment:</strong> Within 24 hours</li>
                <li><strong>Initial assessment:</strong> Within 3 business days</li>
                <li><strong>Workaround (if needed):</strong> Within 5 business days</li>
                <li><strong>Resolution target:</strong> Based on severity and complexity</li>
                <li><strong>Follow-up:</strong> We'll keep you updated on progress</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">10. Training and Awareness</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">10.1 Staff Training</h3>
            <p className="text-black/70 mb-4">
              Our team receives regular accessibility training:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>New employee orientation:</strong> Accessibility awareness for all staff</li>
              <li><strong>Developer training:</strong> Coding for accessibility best practices</li>
              <li><strong>Design training:</strong> Inclusive design principles and methods</li>
              <li><strong>Customer service:</strong> Interacting respectfully with users with disabilities</li>
              <li><strong>Legal requirements:</strong> Understanding accessibility laws and compliance</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">10.2 Student Education</h3>
            <p className="text-black/70 mb-4">
              We provide resources to help students understand and use accessibility features:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Help documentation:</strong> Guides for using Flin with assistive technology</li>
              <li><strong>Video tutorials:</strong> Accessible tutorials with captions and descriptions</li>
              <li><strong>Webinars:</strong> Regular sessions on accessibility features</li>
              <li><strong>Campus outreach:</strong> Presentations at disability services offices</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">10.3 Community Building</h3>
            <p className="text-black/70 mb-4">
              We foster an inclusive community that values accessibility:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Student advisory board:</strong> Including students with disabilities in platform decisions</li>
              <li><strong>Accessibility champions:</strong> Student ambassadors who promote inclusive practices</li>
              <li><strong>Awareness campaigns:</strong> Education about disability and accessibility</li>
              <li><strong>Partnership programs:</strong> Collaboration with disability organizations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">11. Legal and Compliance Information</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">11.1 Regulatory Compliance</h3>
            <p className="text-black/70 mb-4">
              Flin complies with applicable accessibility regulations:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>ADA Title III:</strong> Public accommodations in digital spaces</li>
              <li><strong>Section 508:</strong> Federal accessibility standards</li>
              <li><strong>State laws:</strong> Applicable state accessibility requirements</li>
              <li><strong>WCAG 2.1 AA:</strong> International accessibility guidelines</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">11.2 Accommodation Process</h3>
            <p className="text-black/70 mb-4">
              We provide reasonable accommodations for students with disabilities:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Request process:</strong> Simple process for requesting accommodations</li>
              <li><strong>Documentation:</strong> Working with official accommodation letters</li>
              <li><strong>Timely response:</strong> Prompt evaluation and implementation</li>
              <li><strong>Interactive process:</strong> Collaborative approach to finding solutions</li>
              <li><strong>No additional cost:</strong> Accommodations provided at no extra charge</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">11.3 Grievance Procedure</h3>
            <p className="text-black/70 mb-4">
              If you believe you have experienced discrimination based on disability:
            </p>
            <ol className="list-decimal pl-6 text-black/70 mb-4 space-y-2">
              <li>Contact our accessibility team to attempt informal resolution</li>
              <li>If unresolved, file a formal complaint with our legal department</li>
              <li>You may also file complaints with relevant regulatory agencies</li>
              <li>We prohibit retaliation for good faith accessibility complaints</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">12. Contact Information</h2>
            <p className="text-black/70 mb-4">
              For accessibility questions, support, or feedback:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <p className="text-black/70 mb-2"><strong>Flintime Inc. Accessibility Team</strong></p>
              <p className="text-black/70 mb-2">254 Chapman Rd, Ste 208 #20381</p>
              <p className="text-black/70 mb-2">Newark, Delaware 19702, US</p>
              <p className="text-black/70 mb-2">Email: <a href="mailto:accessibility@flin.college" className="text-blue-600 hover:text-blue-500">accessibility@flin.college</a></p>
              <p className="text-black/70 mb-2">Phone: 1-800-FLIN-ACCESS (1-800-354-6222)</p>
              <p className="text-black/70 mb-2">General Contact: <a href="mailto:contact@flin.college" className="text-blue-600 hover:text-blue-500">contact@flin.college</a></p>
              <p className="text-black/70 mb-2">Subject Line Options:</p>
              <ul className="list-disc pl-6 text-black/70 text-sm space-y-1">
                <li>"Accessibility Issue"</li>
                <li>"Accommodation Request"</li>
                <li>"Accessibility Feedback"</li>
                <li>"Technical Support"</li>
              </ul>
            </div>
            <p className="text-black/70">
              We respond to accessibility inquiries within 24 hours and work diligently to resolve issues promptly.
            </p>
          </section>

          <div className="bg-purple-50 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">Our Ongoing Commitment</h3>
            <p className="text-purple-800">
              Accessibility is not a destination but a journey. We are committed to continuously improving our platform to ensure that every student can participate fully in the Flin community. Your feedback, experiences, and suggestions are invaluable in helping us create a more inclusive digital environment. Together, we can build a platform that truly serves all students, regardless of their abilities.
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

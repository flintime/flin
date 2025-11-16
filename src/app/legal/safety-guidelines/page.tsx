import Link from 'next/link';

export default function SafetyGuidelines() {
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
            Safety Guidelines
          </h1>
          <p className="text-xl text-black/70 mb-4">
            Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-black/60 mb-6">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-lg text-black/70">
            Your safety is our top priority. These guidelines help you stay safe while using Flin's marketplace, housing, and community features.
          </p>
        </div>

        {/* Emergency Banner */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-red-900 mb-2">🚨 Emergency Situations</h2>
          <p className="text-red-800 mb-3">
            If you're in immediate danger or experiencing an emergency, contact local authorities first:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded p-3">
              <p className="font-semibold text-red-900">Emergency Services</p>
              <p className="text-red-800">Call 911</p>
            </div>
            <div className="bg-white rounded p-3">
              <p className="font-semibold text-red-900">Campus Security</p>
              <p className="text-red-800">Check your campus directory</p>
            </div>
            <div className="bg-white rounded p-3">
              <p className="font-semibold text-red-900">Crisis Hotline</p>
              <p className="text-red-800">988 (Suicide & Crisis Lifeline)</p>
            </div>
          </div>
          <p className="text-red-800 mt-3 text-sm">
            After ensuring your safety, please report the incident to Flin at <a href="mailto:contact@flin.college" className="underline">contact@flin.college</a> with "URGENT SAFETY ISSUE" in the subject line.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">1. General Safety Principles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">🛡️ Trust Your Instincts</h3>
                <ul className="text-green-800 text-sm space-y-2">
                  <li>If something feels wrong, it probably is</li>
                  <li>Don't ignore red flags or gut feelings</li>
                  <li>It's okay to cancel or leave if you feel unsafe</li>
                  <li>Your safety is more important than any transaction</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">👥 Stay Connected</h3>
                <ul className="text-blue-800 text-sm space-y-2">
                  <li>Tell someone where you're going and when</li>
                  <li>Share location with a trusted friend during meetups</li>
                  <li>Keep your phone charged and accessible</li>
                  <li>Have a check-in plan with friends or family</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">1.1 Core Safety Rules</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Meet in public places:</strong> Always choose well-lit, populated areas for initial meetings</li>
              <li><strong>Bring a friend:</strong> Consider bringing someone with you, especially for higher-value transactions</li>
              <li><strong>Verify identity:</strong> Confirm the person is a legitimate student before meeting</li>
              <li><strong>Use secure payment methods:</strong> Avoid cash for large amounts; use traceable payment methods</li>
              <li><strong>Keep personal information private:</strong> Don't share your address, financial details, or other sensitive information</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">1.2 Red Flags to Watch For</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Pressure tactics:</strong> Rushing you to make quick decisions</li>
              <li><strong>Too good to be true:</strong> Prices significantly below market value</li>
              <li><strong>Poor communication:</strong> Evasive answers, poor grammar, or generic responses</li>
              <li><strong>Unusual payment requests:</strong> Gift cards, wire transfers, or cryptocurrency</li>
              <li><strong>Meeting location changes:</strong> Last-minute requests to meet in private or isolated areas</li>
              <li><strong>No student verification:</strong> Inability or unwillingness to verify student status</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">2. Marketplace Transaction Safety</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">2.1 Before the Transaction</h3>
            <p className="text-black/70 mb-4">Preparation is key to safe transactions:</p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Research the seller/buyer:</strong> Check their profile, reviews, and ratings</li>
              <li><strong>Ask detailed questions:</strong> Get specifics about condition, age, and any issues</li>
              <li><strong>Request additional photos:</strong> Ask for more angles or specific details</li>
              <li><strong>Verify functionality:</strong> For electronics, ask for proof that items work</li>
              <li><strong>Agree on meeting details:</strong> Time, location, payment method, and what to bring</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">2.2 Safe Meeting Locations</h3>
            <div className="bg-green-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-green-900 mb-2">✅ Recommended Meeting Spots</h4>
              <ul className="text-green-800 text-sm space-y-1">
                <li>Campus library or student center</li>
                <li>Coffee shops or restaurants</li>
                <li>Campus security office area</li>
                <li>Busy campus quad or common areas</li>
                <li>Local police station parking lots (many have designated safe exchange zones)</li>
                <li>Well-lit parking lots with security cameras</li>
              </ul>
            </div>
            <div className="bg-red-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-red-900 mb-2">❌ Avoid These Locations</h4>
              <ul className="text-red-800 text-sm space-y-1">
                <li>Private residences (yours or theirs)</li>
                <li>Isolated areas or empty buildings</li>
                <li>Parking garages (especially at night)</li>
                <li>Secluded parts of campus</li>
                <li>Areas without cell phone coverage</li>
                <li>Locations far from help or witnesses</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">2.3 During the Transaction</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Arrive on time:</strong> Don't keep others waiting in public spaces</li>
              <li><strong>Inspect thoroughly:</strong> Check condition, functionality, and authenticity</li>
              <li><strong>Test electronics:</strong> Make sure devices turn on and work properly</li>
              <li><strong>Count money carefully:</strong> Verify all bills are genuine if using cash</li>
              <li><strong>Get a receipt:</strong> Write down transaction details and both parties' information</li>
              <li><strong>Trust your instincts:</strong> If something feels wrong, politely end the transaction</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">2.4 Payment Safety</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Safe Payment Methods</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>PayPal Goods & Services</li>
                  <li>Venmo (for people you know)</li>
                  <li>Cash (for smaller amounts)</li>
                  <li>Campus payment systems</li>
                  <li>Bank transfers (with protection)</li>
                </ul>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-2">Avoid These Payments</h4>
                <ul className="text-red-800 text-sm space-y-1">
                  <li>Gift cards or prepaid cards</li>
                  <li>Wire transfers or Western Union</li>
                  <li>Cryptocurrency</li>
                  <li>Checks from unknown people</li>
                  <li>Payment apps without protection</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">3. Housing Safety</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">3.1 Finding Safe Housing</h3>
            <p className="text-black/70 mb-4">Whether you're looking for housing or offering a room, prioritize safety:</p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Verify legitimacy:</strong> Confirm the person has authority to rent or sublet</li>
              <li><strong>Research the area:</strong> Check neighborhood safety ratings and campus proximity</li>
              <li><strong>Visit in person:</strong> Never rent sight unseen or based only on photos</li>
              <li><strong>Bring a friend:</strong> Have someone accompany you to viewings</li>
              <li><strong>Check references:</strong> Ask for previous landlord or roommate references</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">3.2 Roommate Safety</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Meet in public first:</strong> Get to know potential roommates before committing</li>
              <li><strong>Check social media:</strong> Look for red flags or concerning behavior</li>
              <li><strong>Ask the right questions:</strong> Lifestyle habits, cleanliness, guests, and boundaries</li>
              <li><strong>Get everything in writing:</strong> Rules, expenses, and expectations</li>
              <li><strong>Emergency contacts:</strong> Exchange emergency contact information</li>
              <li><strong>Trial period:</strong> Consider a short-term arrangement first</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">3.3 Housing Scam Warning Signs</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-yellow-900 mb-3">🚨 Common Housing Scams</h4>
              <ul className="text-yellow-800 text-sm space-y-2">
                <li><strong>Upfront payment demands:</strong> Requiring full payment before viewing</li>
                <li><strong>Too cheap rent:</strong> Prices significantly below market rate</li>
                <li><strong>Overseas landlords:</strong> Cannot meet in person or show property</li>
                <li><strong>Fake photos:</strong> Stock photos or images from other listings</li>
                <li><strong>Urgency pressure:</strong> Must decide immediately or "others are interested"</li>
                <li><strong>Wire transfer requests:</strong> Asking for money via untraceable methods</li>
                <li><strong>No lease agreement:</strong> Unwilling to provide proper rental documents</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">3.4 Legal Protection</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Read lease agreements:</strong> Understand all terms and conditions</li>
              <li><strong>Know tenant rights:</strong> Research local and state tenant protection laws</li>
              <li><strong>Document everything:</strong> Keep records of payments, communications, and issues</li>
              <li><strong>Security deposits:</strong> Understand when and how deposits will be returned</li>
              <li><strong>Insurance needs:</strong> Consider renter's insurance for personal belongings</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">4. Event Safety</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">4.1 Before Attending Events</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Research the organizer:</strong> Verify they're legitimate and have a good reputation</li>
              <li><strong>Check event details:</strong> Location, time, capacity, and safety measures</li>
              <li><strong>Tell someone your plans:</strong> Share event details and expected return time</li>
              <li><strong>Plan transportation:</strong> Know how you'll get there and back safely</li>
              <li><strong>Bring a friend:</strong> Attend with people you trust when possible</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">4.2 During Events</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Stay aware:</strong> Keep your phone charged and stay alert to your surroundings</li>
              <li><strong>Stick together:</strong> Don't leave friends behind or go off alone</li>
              <li><strong>Watch your drinks:</strong> Never leave drinks unattended or accept drinks from strangers</li>
              <li><strong>Know the exits:</strong> Identify exit routes in case of emergency</li>
              <li><strong>Trust your instincts:</strong> Leave if you feel uncomfortable or unsafe</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">4.3 Alcohol and Party Safety</h3>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-orange-900 mb-3">Important Reminders</h4>
              <ul className="text-orange-800 text-sm space-y-2">
                <li><strong>Legal drinking age:</strong> Must be 21+ to consume alcohol in the US</li>
                <li><strong>Know your limits:</strong> Drink responsibly and pace yourself</li>
                <li><strong>Never drink and drive:</strong> Plan safe transportation in advance</li>
                <li><strong>Consent matters:</strong> Alcohol cannot give or receive consent</li>
                <li><strong>Look out for others:</strong> Help friends stay safe and get help if needed</li>
                <li><strong>Campus policies:</strong> Follow your school's alcohol and party policies</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">5. Online Safety and Privacy</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">5.1 Protecting Personal Information</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Limit what you share:</strong> Don't post your full address, schedule, or financial information</li>
              <li><strong>Use Flin messaging:</strong> Keep initial conversations on platform before sharing phone numbers</li>
              <li><strong>Be careful with photos:</strong> Avoid images that reveal personal information or location</li>
              <li><strong>Privacy settings:</strong> Review and adjust your profile visibility settings</li>
              <li><strong>Social media caution:</strong> Be mindful of what you share on linked accounts</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">5.2 Recognizing Scams</h3>
            <div className="bg-red-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-red-900 mb-3">🚨 Common Online Scams</h4>
              <ul className="text-red-800 text-sm space-y-2">
                <li><strong>Fake payment confirmations:</strong> Screenshots that can be easily faked</li>
                <li><strong>Overpayment scams:</strong> Sending too much money and asking for refund</li>
                <li><strong>Shipping scams:</strong> Fake shipping labels or tracking numbers</li>
                <li><strong>Identity theft:</strong> Requests for Social Security or banking information</li>
                <li><strong>Romance scams:</strong> Building fake relationships to get money</li>
                <li><strong>Investment scams:</strong> Get-rich-quick schemes or cryptocurrency cons</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">5.3 Account Security</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Strong passwords:</strong> Use unique, complex passwords for all accounts</li>
              <li><strong>Two-factor authentication:</strong> Enable 2FA when available</li>
              <li><strong>Regular updates:</strong> Keep your app and device software updated</li>
              <li><strong>Secure networks:</strong> Avoid public Wi-Fi for sensitive transactions</li>
              <li><strong>Log out properly:</strong> Sign out of accounts on shared devices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">6. Mental Health and Wellbeing</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">6.1 Recognizing Stress and Burnout</h3>
            <p className="text-black/70 mb-4">College can be stressful. Watch for signs you need support:</p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Academic pressure:</strong> Overwhelming workload or performance anxiety</li>
              <li><strong>Financial stress:</strong> Struggling to afford necessities or education costs</li>
              <li><strong>Social isolation:</strong> Feeling disconnected from peers or support systems</li>
              <li><strong>Sleep disruption:</strong> Trouble sleeping or constant fatigue</li>
              <li><strong>Mood changes:</strong> Persistent sadness, anxiety, or irritability</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">6.2 Campus Resources</h3>
            <div className="bg-blue-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-blue-900 mb-3">Available Support Services</h4>
              <ul className="text-blue-800 text-sm space-y-2">
                <li><strong>Counseling centers:</strong> Free or low-cost mental health support</li>
                <li><strong>Academic advisors:</strong> Help with course planning and academic stress</li>
                <li><strong>Financial aid offices:</strong> Assistance with tuition and living expenses</li>
                <li><strong>Health centers:</strong> Medical care and health education</li>
                <li><strong>Campus security:</strong> 24/7 support for safety concerns</li>
                <li><strong>Peer support groups:</strong> Connect with students facing similar challenges</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">6.3 Crisis Resources</h3>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-purple-900 mb-3">24/7 Crisis Support</h4>
              <ul className="text-purple-800 text-sm space-y-2">
                <li><strong>National Suicide Prevention Lifeline:</strong> 988</li>
                <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
                <li><strong>National Sexual Assault Hotline:</strong> 1-800-656-HOPE (4673)</li>
                <li><strong>National Domestic Violence Hotline:</strong> 1-800-799-7233</li>
                <li><strong>SAMHSA Helpline:</strong> 1-800-662-4357 (mental health/substance abuse)</li>
                <li><strong>Campus emergency line:</strong> Check your student handbook</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">7. Financial Safety</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">7.1 Protecting Your Finances</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Budget wisely:</strong> Track income and expenses to avoid overspending</li>
              <li><strong>Monitor accounts:</strong> Check bank and credit card statements regularly</li>
              <li><strong>Avoid debt traps:</strong> Be cautious with credit cards and high-interest loans</li>
              <li><strong>Emergency fund:</strong> Save money for unexpected expenses</li>
              <li><strong>Identity protection:</strong> Safeguard Social Security number and financial information</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">7.2 Common Financial Scams Targeting Students</h3>
            <div className="bg-yellow-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-yellow-900 mb-3">⚠️ Beware of These Scams</h4>
              <ul className="text-yellow-800 text-sm space-y-2">
                <li><strong>Student loan forgiveness scams:</strong> Fake programs requiring upfront fees</li>
                <li><strong>Scholarship scams:</strong> "Guaranteed" scholarships that require payment</li>
                <li><strong>Credit card offers:</strong> High-interest cards targeting young adults</li>
                <li><strong>Work-from-home schemes:</strong> MLMs or fake job opportunities</li>
                <li><strong>Fake financial aid:</strong> Phishing emails about FAFSA or aid applications</li>
                <li><strong>Investment scams:</strong> Cryptocurrency or stock "opportunities"</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">7.3 Smart Money Habits</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Use Flin wisely:</strong> Buy/sell to save money, but don't overspend</li>
              <li><strong>Compare prices:</strong> Research market values before buying or selling</li>
              <li><strong>Keep receipts:</strong> Document transactions for warranty or dispute purposes</li>
              <li><strong>Plan major purchases:</strong> Sleep on big decisions and research thoroughly</li>
              <li><strong>Build credit responsibly:</strong> Pay bills on time and keep balances low</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">8. Reporting Safety Issues</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">8.1 When to Report</h3>
            <p className="text-black/70 mb-4">Report safety concerns immediately when you experience or witness:</p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Threats or harassment from other users</li>
              <li>Suspicious or fraudulent activity</li>
              <li>Safety issues during transactions or meetups</li>
              <li>Inappropriate behavior at events</li>
              <li>Violations of community guidelines</li>
              <li>Technical issues that could compromise safety</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">8.2 How to Report</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Through Flin</h4>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>Use in-app report buttons</li>
                  <li>Screenshot evidence if possible</li>
                  <li>Email contact@flin.college</li>
                  <li>Include "SAFETY ISSUE" in subject</li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">External Authorities</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>Campus security for on-campus issues</li>
                  <li>Local police for criminal activity</li>
                  <li>Title IX office for harassment</li>
                  <li>FTC for consumer fraud</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">8.3 What to Include in Reports</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Detailed description:</strong> What happened, when, and where</li>
              <li><strong>User information:</strong> Profile names, usernames, or contact details</li>
              <li><strong>Evidence:</strong> Screenshots, photos, or messages</li>
              <li><strong>Impact:</strong> How the incident affected you or others</li>
              <li><strong>Immediate needs:</strong> Whether you need urgent assistance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">9. Safety Resources and Support</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">9.1 Emergency Contacts</h3>
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-gray-900 mb-3">Keep These Numbers Handy</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-800">Emergency Services: 911</p>
                  <p className="font-semibold text-gray-800">Campus Security: [Your campus number]</p>
                  <p className="font-semibold text-gray-800">Campus Health Center: [Your campus number]</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Trusted Friend/Family: [Personal contact]</p>
                  <p className="font-semibold text-gray-800">Academic Advisor: [Your advisor]</p>
                  <p className="font-semibold text-gray-800">Flin Support: contact@flin.college</p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">9.2 Safety Apps and Tools</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Campus safety apps:</strong> Many schools have their own safety apps</li>
              <li><strong>Location sharing:</strong> Share your location with trusted contacts</li>
              <li><strong>Emergency alerts:</strong> Sign up for campus and local emergency notifications</li>
              <li><strong>Transportation apps:</strong> Use reputable rideshare or public transit apps</li>
              <li><strong>Personal safety devices:</strong> Consider safety whistles or personal alarms</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">9.3 Building Your Safety Network</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Stay connected:</strong> Maintain relationships with family and friends</li>
              <li><strong>Join communities:</strong> Participate in clubs, organizations, or study groups</li>
              <li><strong>Know your neighbors:</strong> Build relationships with dorm or apartment neighbors</li>
              <li><strong>Find mentors:</strong> Connect with upperclassmen, faculty, or staff</li>
              <li><strong>Be a good friend:</strong> Look out for others and ask for help when needed</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">10. Staying Safe Year-Round</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">10.1 Seasonal Safety Considerations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Fall/Winter</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>Earlier darkness affects meetup timing</li>
                  <li>Weather impacts transportation safety</li>
                  <li>Holiday scams increase</li>
                  <li>Seasonal depression awareness</li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Spring/Summer</h4>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>More outdoor events and activities</li>
                  <li>Housing searches for next year</li>
                  <li>Internship and job search safety</li>
                  <li>Travel and moving considerations</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-black mb-3">10.2 Academic Year Transitions</h3>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>New student orientation:</strong> Extra vigilance during adjustment periods</li>
              <li><strong>Finals stress:</strong> Increased vulnerability to scams and poor decisions</li>
              <li><strong>Move-in/move-out:</strong> Busy times with increased theft and scam risks</li>
              <li><strong>Study abroad:</strong> Additional safety considerations for international travel</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">11. Contact and Support</h2>
            <p className="text-black/70 mb-4">
              Your safety is our highest priority. If you have questions about these guidelines or need to report a safety issue:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <p className="text-black/70 mb-2"><strong>Flintime Inc. Safety Team</strong></p>
              <p className="text-black/70 mb-2">254 Chapman Rd, Ste 208 #20381</p>
              <p className="text-black/70 mb-2">Newark, Delaware 19702, US</p>
              <p className="text-black/70 mb-2">Email: <a href="mailto:contact@flin.college" className="text-blue-600 hover:text-blue-500">contact@flin.college</a></p>
              <p className="text-black/70 mb-2">For safety issues, use these subject lines:</p>
              <ul className="list-disc pl-6 text-black/70 text-sm space-y-1">
                <li>"URGENT SAFETY ISSUE" - for immediate concerns</li>
                <li>"Safety Report" - for non-urgent safety violations</li>
                <li>"Safety Question" - for guideline clarifications</li>
                <li>"Safety Feedback" - for suggestions and improvements</li>
              </ul>
            </div>
            <p className="text-black/70">
              We respond to safety reports within 2-4 hours during business hours and monitor urgent reports 24/7. For immediate emergencies, always contact local authorities first.
            </p>
          </section>

          <div className="bg-green-50 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Remember: Safety is a Community Effort</h3>
            <p className="text-green-800">
              Every member of the Flin community plays a role in keeping everyone safe. By following these guidelines, looking out for each other, and reporting concerns when they arise, we create an environment where all students can thrive. Stay alert, trust your instincts, and don't hesitate to ask for help when you need it. Together, we can make Flin a safe and supportive space for every student.
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

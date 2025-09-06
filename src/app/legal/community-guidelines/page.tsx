import Link from 'next/link';

export default function CommunityGuidelines() {
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
            Community Guidelines
          </h1>
          <p className="text-xl text-black/70 mb-4">
            Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-black/60 mb-6">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-lg text-black/70">
            Building a safe, respectful, and supportive community for all students
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">1. Our Community Values</h2>
            <p className="text-black/70 mb-4">
              Flin is more than a marketplace—it's a community of students supporting each other's college journey. Our guidelines are built on core values that make Flin a positive space for everyone:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">🤝 Respect</h3>
                <p className="text-blue-800 text-sm">Treat every member with dignity and courtesy, regardless of background or beliefs.</p>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2">🛡️ Safety</h3>
                <p className="text-green-800 text-sm">Prioritize the physical and emotional well-being of all community members.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">📚 Academic Integrity</h3>
                <p className="text-purple-800 text-sm">Support honest academic achievement and uphold educational values.</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-900 mb-2">🎓 Student Success</h3>
                <p className="text-orange-800 text-sm">Help fellow students thrive academically, socially, and financially.</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">2. Respectful Communication</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">2.1 Be Kind and Constructive</h3>
            <p className="text-black/70 mb-4">
              Remember there's a real person behind every profile. Communicate with empathy and understanding.
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>✅ Do:</strong> Use respectful language, give constructive feedback, and be patient with new users</li>
              <li><strong>❌ Don't:</strong> Use offensive language, personal attacks, or deliberately hurtful comments</li>
              <li><strong>✅ Do:</strong> Disagree respectfully and focus on ideas, not individuals</li>
              <li><strong>❌ Don't:</strong> Engage in name-calling, bullying, or harassment</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">2.2 No Discrimination or Hate Speech</h3>
            <p className="text-black/70 mb-4">
              Flin welcomes students from all backgrounds. We have zero tolerance for discrimination based on:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>Race, ethnicity, or national origin</li>
              <li>Religion or beliefs</li>
              <li>Sexual orientation or gender identity</li>
              <li>Disability or medical conditions</li>
              <li>Socioeconomic status</li>
              <li>Academic performance or major</li>
              <li>Physical appearance</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">2.3 Appropriate Content</h3>
            <p className="text-black/70 mb-4">Keep all content appropriate for a diverse student community:</p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>No explicit content:</strong> Sexual, violent, or graphic material</li>
              <li><strong>No illegal activities:</strong> Drug use, underage drinking, or illegal services</li>
              <li><strong>No spam:</strong> Repetitive posting or irrelevant content</li>
              <li><strong>No scams:</strong> Fraudulent schemes or deceptive practices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">3. Academic Integrity Standards</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">3.1 Prohibited Academic Activities</h3>
            <p className="text-black/70 mb-4">
              Flin supports honest academic achievement. The following activities are strictly forbidden:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Selling completed assignments:</strong> Essays, homework, projects, or lab reports</li>
              <li><strong>Test materials:</strong> Exam questions, answer keys, or test banks</li>
              <li><strong>Academic services:</strong> Writing services, test-taking services, or project completion</li>
              <li><strong>Plagiarism tools:</strong> Software or services that facilitate academic dishonesty</li>
              <li><strong>Grade manipulation:</strong> Hacking systems or falsifying academic records</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">3.2 Allowed Academic Support</h3>
            <p className="text-black/70 mb-4">We encourage legitimate academic collaboration and support:</p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>✅ Tutoring services:</strong> Teaching concepts and study strategies</li>
              <li><strong>✅ Study groups:</strong> Collaborative learning and discussion</li>
              <li><strong>✅ Educational materials:</strong> Textbooks, study guides, and legitimate resources</li>
              <li><strong>✅ Academic tools:</strong> Calculators, software licenses, and productivity apps</li>
              <li><strong>✅ Peer support:</strong> Study tips, time management advice, and motivation</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">3.3 Honor Code Compliance</h3>
            <p className="text-black/70 mb-4">
              Respect your institution's honor code and academic policies. When in doubt about what's allowed, check with your professors or academic integrity office.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">4. Marketplace Standards</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">4.1 Honest Listings</h3>
            <p className="text-black/70 mb-4">Create accurate, detailed listings that represent items fairly:</p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Accurate descriptions:</strong> Include condition, size, age, and any defects</li>
              <li><strong>Real photos:</strong> Use actual photos of the item you're selling</li>
              <li><strong>Fair pricing:</strong> Price items reasonably based on condition and market value</li>
              <li><strong>Clear terms:</strong> Specify pickup/delivery options, payment methods, and return policies</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">4.2 Reliable Transactions</h3>
            <p className="text-black/70 mb-4">Be a trustworthy buyer and seller:</p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Follow through:</strong> Complete transactions as agreed</li>
              <li><strong>Communicate clearly:</strong> Respond promptly and honestly to messages</li>
              <li><strong>Be punctual:</strong> Arrive on time for scheduled meetups</li>
              <li><strong>Handle disputes fairly:</strong> Work together to resolve issues before involving Flin support</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">4.3 Prohibited Items</h3>
            <p className="text-black/70 mb-4">Certain items cannot be sold on Flin for safety and legal reasons:</p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Illegal substances:</strong> Drugs, alcohol (for underage users), tobacco products</li>
              <li><strong>Weapons:</strong> Firearms, knives, pepper spray, or other weapons</li>
              <li><strong>Dangerous items:</strong> Chemicals, fireworks, or hazardous materials</li>
              <li><strong>Stolen goods:</strong> Items that don't belong to you</li>
              <li><strong>Counterfeit items:</strong> Fake designer goods or unauthorized replicas</li>
              <li><strong>Adult content:</strong> Sexually explicit materials or services</li>
              <li><strong>Live animals:</strong> Pets or other animals</li>
              <li><strong>Prescription items:</strong> Medications or medical devices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">5. Housing Guidelines</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">5.1 Legitimate Housing Offers</h3>
            <p className="text-black/70 mb-4">When posting housing opportunities:</p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Verify authority:</strong> Ensure you have the right to sublet or offer the space</li>
              <li><strong>Accurate information:</strong> Provide truthful details about location, price, and amenities</li>
              <li><strong>Real photos:</strong> Use current, accurate photos of the actual space</li>
              <li><strong>Clear terms:</strong> Specify lease length, utilities, rules, and requirements</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">5.2 Housing Safety</h3>
            <p className="text-black/70 mb-4">Prioritize safety in housing arrangements:</p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Meet in public first:</strong> Meet potential roommates in safe, public locations</li>
              <li><strong>Verify identity:</strong> Confirm the person is a legitimate student</li>
              <li><strong>Visit in person:</strong> See the property before committing</li>
              <li><strong>Read contracts:</strong> Understand all lease terms and legal obligations</li>
              <li><strong>Trust your instincts:</strong> Don't proceed if something feels wrong</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">5.3 Fair Housing Practices</h3>
            <p className="text-black/70 mb-4">
              Follow fair housing laws and practices. Do not discriminate based on protected characteristics when selecting roommates or tenants.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">6. Event Guidelines</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">6.1 Appropriate Events</h3>
            <p className="text-black/70 mb-4">Events should be suitable for the student community:</p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Student-focused:</strong> Academic, social, career, or recreational events</li>
              <li><strong>Safe environments:</strong> Well-organized events with appropriate supervision</li>
              <li><strong>Legal activities:</strong> Events that comply with campus and local laws</li>
              <li><strong>Inclusive:</strong> Events open to all students or clearly defined groups</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">6.2 Event Posting Standards</h3>
            <p className="text-black/70 mb-4">When promoting events:</p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Complete information:</strong> Date, time, location, cost, and contact details</li>
              <li><strong>Age requirements:</strong> Clearly state any age restrictions</li>
              <li><strong>Safety measures:</strong> Include relevant safety information or precautions</li>
              <li><strong>Cancellation policy:</strong> How attendees will be notified of changes</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">6.3 Prohibited Events</h3>
            <p className="text-black/70 mb-4">Certain types of events are not allowed on Flin:</p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Illegal activities:</strong> Events involving underage drinking, drug use, or other illegal activities</li>
              <li><strong>Dangerous gatherings:</strong> Events with significant safety risks</li>
              <li><strong>Discriminatory events:</strong> Events that exclude based on protected characteristics</li>
              <li><strong>Commercial scams:</strong> MLM presentations or fraudulent business opportunities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">7. Privacy and Personal Information</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">7.1 Protect Personal Information</h3>
            <p className="text-black/70 mb-4">Keep yourself and others safe by protecting personal information:</p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Don't share:</strong> Social Security numbers, bank details, or passwords</li>
              <li><strong>Limit location sharing:</strong> Use general campus areas instead of specific addresses</li>
              <li><strong>Be cautious with contact info:</strong> Consider using Flin's messaging system initially</li>
              <li><strong>Protect others:</strong> Don't post photos or information about others without permission</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">7.2 Report Privacy Violations</h3>
            <p className="text-black/70 mb-4">
              If someone shares your personal information without permission or you see privacy violations, report them immediately to Flin support.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">8. Reporting and Enforcement</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">8.1 How to Report Violations</h3>
            <p className="text-black/70 mb-4">Help keep Flin safe by reporting guideline violations:</p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>In-app reporting:</strong> Use the report button on posts, messages, or profiles</li>
              <li><strong>Email support:</strong> Contact <a href="mailto:contact@flin.college" className="text-blue-600 hover:text-blue-500">contact@flin.college</a> with "Community Guidelines Violation" in the subject</li>
              <li><strong>Emergency situations:</strong> Contact local authorities first, then notify Flin</li>
              <li><strong>Provide details:</strong> Include screenshots, timestamps, and description of the violation</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">8.2 Our Response Process</h3>
            <p className="text-black/70 mb-4">When violations are reported, we:</p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Review promptly:</strong> Investigate reports within 24-48 hours</li>
              <li><strong>Take appropriate action:</strong> Remove content, warn users, or suspend accounts</li>
              <li><strong>Protect reporters:</strong> Keep reporter identities confidential when possible</li>
              <li><strong>Follow up:</strong> Notify reporters about actions taken (within privacy constraints)</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">8.3 Consequences for Violations</h3>
            <p className="text-black/70 mb-4">Depending on the severity and frequency of violations:</p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Content removal:</strong> Posts, listings, or messages that violate guidelines</li>
              <li><strong>Warnings:</strong> Formal notices about policy violations</li>
              <li><strong>Feature restrictions:</strong> Temporary loss of posting or messaging privileges</li>
              <li><strong>Account suspension:</strong> Temporary removal from the platform</li>
              <li><strong>Permanent ban:</strong> Complete removal for serious or repeated violations</li>
              <li><strong>Legal action:</strong> Referral to authorities for illegal activities</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">8.4 Appeal Process</h3>
            <p className="text-black/70 mb-4">
              If you believe enforcement action was taken in error, you can appeal by contacting <a href="mailto:contact@flin.college" className="text-blue-600 hover:text-blue-500">contact@flin.college</a> with "Appeal" in the subject line. Include your account information and explanation of why you believe the action was incorrect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">9. Building a Positive Community</h2>
            
            <h3 className="text-xl font-semibold text-black mb-3">9.1 Ways to Contribute</h3>
            <p className="text-black/70 mb-4">Help make Flin an amazing place for all students:</p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li><strong>Welcome new members:</strong> Help new students learn how to use Flin effectively</li>
              <li><strong>Share knowledge:</strong> Offer helpful tips and advice to fellow students</li>
              <li><strong>Give honest feedback:</strong> Leave fair reviews and ratings for transactions</li>
              <li><strong>Report issues:</strong> Help maintain community standards by reporting violations</li>
              <li><strong>Spread positivity:</strong> Celebrate successes and support struggling students</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-3">9.2 Student Success Stories</h3>
            <p className="text-black/70 mb-4">
              We love celebrating when students help each other succeed. Share your positive Flin experiences to inspire others and show the power of our community.
            </p>

            <h3 className="text-xl font-semibold text-black mb-3">9.3 Feedback and Suggestions</h3>
            <p className="text-black/70 mb-4">
              Your input helps us improve Flin. Share suggestions for new features, policy improvements, or community initiatives at <a href="mailto:contact@flin.college" className="text-blue-600 hover:text-blue-500">contact@flin.college</a> with "Community Feedback" in the subject.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">10. Staying Updated</h2>
            <p className="text-black/70 mb-4">
              These Community Guidelines may be updated to reflect new features, legal requirements, or community needs. We will notify users of material changes through:
            </p>
            <ul className="list-disc pl-6 text-black/70 mb-4 space-y-2">
              <li>In-app notifications</li>
              <li>Email announcements</li>
              <li>Updates on our website</li>
              <li>Social media posts</li>
            </ul>
            <p className="text-black/70 mb-4">
              Continue using Flin after guideline updates indicates your acceptance of the new guidelines.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">11. Contact and Support</h2>
            <p className="text-black/70 mb-4">
              Questions about these Community Guidelines? Need help with a community issue? We're here to help:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <p className="text-black/70 mb-2"><strong>Flintime Inc. Community Support</strong></p>
              <p className="text-black/70 mb-2">254 Chapman Rd, Ste 208 #20381</p>
              <p className="text-black/70 mb-2">Newark, Delaware 19702, US</p>
              <p className="text-black/70 mb-2">Email: <a href="mailto:contact@flin.college" className="text-blue-600 hover:text-blue-500">contact@flin.college</a></p>
              <p className="text-black/70 mb-2">Subject Line Options:</p>
              <ul className="list-disc pl-6 text-black/70 text-sm space-y-1">
                <li>"Community Guidelines Question"</li>
                <li>"Report Violation"</li>
                <li>"Appeal Request"</li>
                <li>"Community Feedback"</li>
              </ul>
            </div>
            <p className="text-black/70">
              We typically respond within 24-48 hours. For urgent safety issues, include "URGENT" in your subject line.
            </p>
          </section>

          <div className="bg-blue-50 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Remember: We're All Students</h3>
            <p className="text-blue-800">
              Whether you're a freshman navigating your first semester or a graduate student finishing your degree, we're all part of the same student journey. Let's support each other, celebrate our successes, and build a community that makes college life better for everyone. Together, we can make Flin a place where every student feels welcome, safe, and empowered to succeed.
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

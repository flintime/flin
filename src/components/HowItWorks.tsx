import Image from 'next/image';

export default function HowItWorks() {
  const steps = [
    {
      title: 'Verify Your Student Status',
      imageSrc: '/icons/1.png',
      color: '#fb541c',
      bg: 'from-[#fb541c]/20 to-[#fb541c]/10',
      subtitle: "Confirm you're a student in seconds."
    },
    {
      title: 'Unlock Local & Brand Deals',
      imageSrc: '/icons/2.png',
      color: '#fb541c',
      bg: 'from-[#fb541c]/20 to-[#fb541c]/10',
      subtitle: 'Browse local & brand discounts.'
    },
    {
      title: 'Marketplace with Verified Students',
      imageSrc: '/icons/3.png',
      color: '#fb541c',
      bg: 'from-[#fb541c]/20 to-[#fb541c]/10',
      subtitle: 'Buy & sell with verified peers.'
    },
    {
      title: 'Explore Events & Activities',
      imageSrc: '/icons/4.png',
      color: '#fb541c',
      bg: 'from-[#fb541c]/20 to-[#fb541c]/10',
      subtitle: 'See campus events & RSVP.'
    }
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-6 tracking-tight">
            Your Campus Life, <span className="text-[#fb541c]">Simplified</span>
          </h2>
          <p className="text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Your one-stop app for student discounts, deals, marketplace and campus events
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.title} className="">
              <div className={`relative p-8 flex flex-col items-center text-center`}>
                {/* 3D Icon (brand color, soft gradients, inner shadow) */}
                <Image src={step.imageSrc} alt={step.title} width={96} height={96} className="object-contain mb-6" />

                <h3 className="text-xl font-semibold text-black mb-2">
                  {step.title}
                </h3>
                {step.subtitle && (
                  <p className="text-sm text-black/60 max-w-xs">
                    {step.subtitle}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



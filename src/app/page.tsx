import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Partners from '@/components/Partners';
import Features from '@/components/Features';
import AppDownload from '@/components/AppDownload';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <HowItWorks />
      <Partners />
      <Features />
      <AppDownload />
      <Footer />
    </div>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://flin.college'),
  title: {
    default: "Flin - The Ultimate Student App for College Life",
    template: "%s | Flin - Student Community App"
  },
  description: "Discover exclusive student deals, local offers, affordable housing, campus events, and marketplace opportunities. Join 100,000+ college students saving money and building connections on Flin.",
  keywords: [
    "college students",
    "student deals",
    "campus marketplace",
    "student housing",
    "college events",
    "student discounts",
    "university marketplace",
    "college community",
    "student app",
    "campus life",
    "student savings",
    "college marketplace",
    "student offers",
    "university events",
    "student marketplace"
  ],
  authors: [{ name: "Flin Team" }],
  creator: "Flin",
  publisher: "Flin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://flin.college',
    title: 'Flin - The Ultimate Student App for College Life',
    description: 'Discover exclusive student deals, local offers, affordable housing, campus events, and marketplace opportunities. Join 100,000+ college students saving money and building connections.',
    siteName: 'Flin',
    images: [
      {
        url: '/flin.png',
        width: 1200,
        height: 630,
        alt: 'Flin - Student Community App',
      },
      {
        url: '/flin.png',
        width: 600,
        height: 315,
        alt: 'Flin - Student Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flin - The Ultimate Student App for College Life',
    description: 'Discover exclusive student deals, local offers, affordable housing, campus events, and marketplace opportunities.',
    creator: '@flinapp',
    images: ['/flin.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  category: 'education',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Flin",
    "description": "The ultimate student app for college life - discover deals, housing, events, and marketplace opportunities",
    "url": "https://flin.college",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "Flin Team"
    },
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student"
    },
    "featureList": [
      "Local student deals and offers",
      "Campus marketplace for buying/selling",
      "Student housing listings",
      "College events and activities",
      "Community networking"
    ],
    "screenshot": "/flin.png"
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}

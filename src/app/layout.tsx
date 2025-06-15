
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Playfair_Display, PT_Sans } from 'next/font/google';
import Script from 'next/script'; // Import Script

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-playfair-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Logbook Loan Compass',
  description: 'Compare offers from top MFIs in Kenya. Fast approval, competitive rates, and transparent terms.',
  manifest: '/manifest.json', 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ptSans.variable} ${playfairDisplay.variable}`}>
      <head>
        <meta name="application-name" content="MicroFasta" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MicroFasta" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" /> {/* Ensure browserconfig.xml exists if you use this */}
        <meta name="msapplication-TileColor" content="#2E86AB" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#2E86AB" />

        <link rel="apple-touch-icon" href="https://placehold.co/180x180.png" data-ai-hint="app icon" />
        <link rel="apple-touch-icon" sizes="152x152" href="https://placehold.co/152x152.png" data-ai-hint="app icon" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://placehold.co/180x180.png" data-ai-hint="app icon" />
        <link rel="apple-touch-icon" sizes="167x167" href="https://placehold.co/167x167.png" data-ai-hint="app icon" />

        <link rel="icon" type="image/png" sizes="32x32" href="https://placehold.co/32x32.png" data-ai-hint="favicon" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://placehold.co/16x16.png" data-ai-hint="favicon" />
        
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background">
        <AuthProvider>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
          <Toaster />
        </AuthProvider>
        <Script id="service-worker-registration">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then(registration => {
                    console.log('SW registered: ', registration);
                  })
                  .catch(error => {
                    console.error('SW registration failed. Details:', error);
                    if (error instanceof Event) {
                      console.error('The caught error during SW registration is an Event object. Type: ' + error.type);
                    } else if (error instanceof Error) {
                      console.error('SW Registration Error Name: ' + error.name + ', Message: ' + error.message + ', Stack: ' + (error.stack ? error.stack.substring(0, 300) : 'N/A'));
                    } else {
                      console.error('SW Registration failed with a non-Error, non-Event object:', error);
                    }
                  });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}


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
  applicationName: 'MicroFasta',
  appleWebApp: {
    capable: true,
    title: 'MicroFasta',
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2E86AB' },
    { media: '(prefers-color-scheme: dark)', color: '#2E86AB' },
  ],
  icons: {
    icon: [
      { url: 'https://placehold.co/16x16.png', sizes: '16x16', type: 'image/png', attributes: {'data-ai-hint': 'favicon'} },
      { url: 'https://placehold.co/32x32.png', sizes: '32x32', type: 'image/png', attributes: {'data-ai-hint': 'favicon'} },
    ],
    apple: [
      { url: 'https://placehold.co/180x180.png', sizes: '180x180', attributes: {'data-ai-hint': 'app icon'} },
      { url: 'https://placehold.co/152x152.png', sizes: '152x152', attributes: {'data-ai-hint': 'app icon'} },
      { url: 'https://placehold.co/167x167.png', sizes: '167x167', attributes: {'data-ai-hint': 'app icon'} },
    ],
  },
  other: {
    'msapplication-TileColor': '#2E86AB',
    'msapplication-config': '/icons/browserconfig.xml', // Ensure this file exists if you use this meta tag
    'mobile-web-app-capable': 'yes',
    'msapplication-tap-highlight': 'no',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ptSans.variable} ${playfairDisplay.variable}`}>
      {/* The manual <head> tag has been removed. Next.js will generate it from the metadata object. */}
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

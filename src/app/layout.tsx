
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Imported Playfair and PT Sans from Google Fonts
import { Playfair_Display, PT_Sans } from 'next/font/google';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
  display: 'swap', // Added display: 'swap'
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-playfair-display',
  display: 'swap', // Added display: 'swap'
});

export const metadata: Metadata = {
  title: 'Logbook Loan Compass', // Updated title
  description: 'Compare offers from top MFIs in Kenya. Fast approval, competitive rates, and transparent terms.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ptSans.variable} ${playfairDisplay.variable}`}>
      <head>
        {/*
          The Google Fonts <link> tags were removed because next/font automatically
          optimizes and includes the fonts. Adding them here would be redundant
          and could potentially lead to conflicts or double-loading.
          next/font handles inlining font CSS and serving fonts efficiently.
        */}
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
      </body>
    </html>
  );
}

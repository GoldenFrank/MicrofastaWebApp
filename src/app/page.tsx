
'use client'; // Added to enable client-side interactivity

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Clock, Shield, Smartphone, Eye, Rocket, GitCompareArrows, FileText as FileTextIcon, BarChartBig as AssessmentIcon, Banknote as GetFundedIcon, Phone, Mail } from "lucide-react";


export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-400 to-cyan-600 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 items-center"> {/* Removed lg:grid-cols-2 as image is removed */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 font-headline">
                Get your Logbook Loan approved in{" "}
                <span className="text-yellow-300 inline-block">
                  3 Hours
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-teal-100 mb-8 leading-relaxed max-w-lg">
                Compare offers from top MFIs in Kenya. Fast approval, competitive rates, and transparent terms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  asChild
                  size="lg"
                  className="bg-yellow-300 text-teal-900 hover:bg-yellow-400 hover:text-teal-950 text-lg font-semibold px-8 py-4 h-auto transform hover:scale-105 transition-all duration-200"
                >
                  <Link href="/apply">
                    <Car className="mr-2 h-5 w-5" />
                    Start Application
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-yellow-300 text-yellow-300 hover:bg-yellow-300 hover:text-teal-900 text-lg font-semibold px-8 py-4 h-auto transition-all duration-200"
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Clock className="mr-2 h-5 w-5" />
                  How It Works
                </Button>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-4 text-teal-100 max-w-md">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-yellow-300" />
                  <span>No Hidden Fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-yellow-300" />
                  <span>Secure Process</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-yellow-300" />
                  <span>Fast Approval</span>
                </div>
              </div>
            </div>
            {/* Removed Image Section */}
          </div>
        </div>
      </section>

      {/* How It Works / Simple Process Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-teal-700 mb-4 font-headline">
              Simple Process, Fast Results
            </h2>
            <p className="text-xl text-teal-600 max-w-2xl mx-auto">
              Our streamlined process gets you from application to approved in just 3 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1: Apply Online */}
            <Card className="text-center group hover:transform hover:scale-105 transition-all duration-300 border-0 shadow-lg rounded-xl">
              <CardContent className="p-8">
                <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-300 transition-all duration-300">
                  <FileTextIcon className="h-10 w-10 text-yellow-500 group-hover:text-yellow-700" />
                </div>
                <h3 className="text-xl font-semibold text-teal-800 mb-2">Apply Online</h3>
                <p className="text-teal-700 text-sm">
                  Fill out our simple form with your details and vehicle information.
                </p>
              </CardContent>
            </Card>

            {/* Step 2: Assessment */}
            <Card className="text-center group hover:transform hover:scale-105 transition-all duration-300 border-0 shadow-lg rounded-xl">
              <CardContent className="p-8">
                <div className="bg-cyan-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-cyan-300 transition-all duration-300">
                  <AssessmentIcon className="h-10 w-10 text-cyan-500 group-hover:text-cyan-700" />
                </div>
                <h3 className="text-xl font-semibold text-teal-800 mb-2">Assessment</h3>
                <p className="text-teal-700 text-sm">
                  We evaluate your affordability and vehicle value automatically.
                </p>
              </CardContent>
            </Card>

            {/* Step 3: MFI Matching */}
            <Card className="text-center group hover:transform hover:scale-105 transition-all duration-300 border-0 shadow-lg rounded-xl">
              <CardContent className="p-8">
                <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-300 transition-all duration-300">
                  <GitCompareArrows className="h-10 w-10 text-indigo-500 group-hover:text-indigo-700" />
                </div>
                <h3 className="text-xl font-semibold text-teal-800 mb-2">MFI Matching</h3>
                <p className="text-teal-700 text-sm">
                  Our AI-powered system helps you find suitable MFI partners and choose the best one.
                </p>
              </CardContent>
            </Card>

            {/* Step 4: Get Funded */}
            <Card className="text-center group hover:transform hover:scale-105 transition-all duration-300 border-0 shadow-lg rounded-xl">
              <CardContent className="p-8">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-300 transition-all duration-300">
                  <GetFundedIcon className="h-10 w-10 text-green-500 group-hover:text-green-700" />
                </div>
                <h3 className="text-xl font-semibold text-teal-800 mb-2">Get Funded</h3>
                <p className="text-teal-700 text-sm">
                  Receive funds directly to your M-Pesa or bank account.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose MicroFasta Section */}
      <section className="py-16 md:py-24 bg-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-teal-700 mb-12 text-center font-headline">
            Why Choose MicroFasta?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Rocket className="h-10 w-10 text-accent" />}
              title="Lightning Fast"
              description="Logbook loans approved in as little as 3 hours."
            />
            <FeatureCard
              icon={<Smartphone className="h-10 w-10 text-accent" />}
              title="Fully Digital"
              description="Apply and manage your loan entirely online, anytime, anywhere."
            />
            <FeatureCard
              icon={<GitCompareArrows className="h-10 w-10 text-accent" />}
              title="Compare & Choose"
              description="Get matched with multiple MFIs and pick the best rates and terms for you."
            />
            <FeatureCard
              icon={<Eye className="h-10 w-10 text-accent" />}
              title="Transparent"
              description="No hidden fees or surprises. See all terms clearly before you commit."
            />
          </div>
        </div>
      </section>
      
      {/* Removed Contact Us Section */}

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-cyan-600 to-teal-700 text-yellow-50 py-16 md:py-20 text-center">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 max-w-3xl mx-auto font-headline">
            Ready, to get your loan approved in 3 hours?
          </h2>
          <p className="text-lg text-teal-100 mb-8">
            Take the first step towards securing your funds quickly and easily.
          </p>
          <Button asChild
            size="lg"
            className="bg-yellow-300 text-teal-900 hover:bg-yellow-400 hover:text-teal-950 px-10 py-4 text-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            <Link href="/apply">Apply Now</Link>
          </Button>
          <p className="text-lg text-teal-100 mt-8 mb-4">
            Have questions or need assistance? Our team is ready to help you.
          </p>
          <div className="mt-4 text-teal-100 space-y-2 md:space-y-0 md:flex md:justify-center md:items-center md:gap-6"> {/* Adjusted margin from mt-8 to mt-4 */}
            <a href="tel:0742241585" className="flex items-center justify-center hover:text-yellow-300 transition-colors">
              <Phone className="mr-2 h-5 w-5"/> Call us: 0742241585
            </a>
            <a href="mailto:Info@microfasta.co.ke" className="flex items-center justify-center hover:text-yellow-300 transition-colors">
              <Mail className="mr-2 h-5 w-5"/> Email: Info@microfasta.co.ke
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
    <CardContent className="flex flex-col items-center text-center p-8">
      <div className="p-4 bg-teal-100 rounded-full mb-4 inline-block">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-teal-800 mb-2">{title}</h3>
      <p className="text-teal-700">{description}</p>
    </CardContent>
  </Card>
);


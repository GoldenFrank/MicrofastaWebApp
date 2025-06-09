
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Clock, Shield, Scale3d, Smartphone, Eye } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-400 to-cyan-600 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Get Your Logbook Loan in{" "}
                <span className="text-yellow-300 animate-bounce-subtle inline-block">
                  3 Hours
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-teal-100 mb-8 leading-relaxed max-w-lg">
                Compare offers from top MFIs in Kenya. Fast approval, competitive rates, and transparent terms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/apply">
                  <Button
                    size="lg"
                    className="bg-yellow-300 text-teal-900 hover:bg-yellow-400 hover:text-teal-950 text-lg font-semibold px-8 py-4 h-auto transform hover:scale-105 transition-all duration-200"
                  >
                    <Car className="mr-2 h-5 w-5" />
                    Start Application
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-yellow-300 text-yellow-300 hover:bg-yellow-300 hover:text-teal-900 text-lg font-semibold px-8 py-4 h-auto transition-all duration-200"
                >
                  <Clock className="mr-2 h-5 w-5" />
                  How It Works
                </Button>
              </div>
              <div className="flex flex-wrap gap-8 text-teal-100 max-w-md">
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
                  <span>3-Hour Approval</span>
                </div>
              </div>
            </div>
            <div className="lg:pl-8">
              <div className="relative mx-auto w-72 h-96 bg-teal-900 rounded-3xl p-2 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="w-full h-full bg-yellow-50 rounded-2xl overflow-hidden relative">
                  <div className="bg-cyan-600 h-20 flex items-center justify-center">
                    <span className="text-yellow-50 font-bold text-lg">MicroFasta</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="bg-yellow-200 rounded-lg h-8"></div>
                    <div className="bg-yellow-200 rounded-lg h-6 w-3/4"></div>
                    <div className="bg-yellow-200 rounded-lg h-6 w-1/2"></div>
                    <div className="bg-yellow-300 rounded-lg h-12 flex items-center justify-center mt-6">
                      <span className="text-teal-900 font-semibold">Apply Now</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-teal-900 mb-4">
              Simple Process, Fast Results
            </h2>
            <p className="text-xl text-teal-700 max-w-2xl mx-auto">
              Our streamlined process gets you from application to cash in just 3 hours
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center group hover:transform hover:scale-105 transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="bg-yellow-300 bg-opacity-20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-300 group-hover:text-teal-900 transition-all duration-300">
                  <Car className="h-8 w-8 text-yellow-300 group-hover:text-teal-900" />
                </div>
                <h3 className="text-lg font-semibold text-teal-900 mb-2">Apply Online</h3>
                <p className="text-teal-700 text-sm">
                  Fill out our simple form with your details and vehicle information
                </p>
                <div className="text-xs text-yellow-300 font-semibold mt-2">~10 minutes</div>
              </CardContent>
            </Card>

            <Card className="text-center group hover:transform hover:scale-105 transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="bg-cyan-400 bg-opacity-20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-cyan-400 group-hover:text-yellow-50 transition-all duration-300">
                  <Scale3d className="h-8 w-8 text-cyan-400 group-hover:text-yellow-50" />
                </div>
                <h3 className="text-lg font-semibold text-teal-900 mb-2">Assessment</h3>
                <p className="text-teal-700 text-sm">
                  We evaluate your affordability and vehicle value automatically
                </p>
                <div className="text-xs text-yellow-300 font-semibold mt-2">~45 minutes</div>
              </CardContent>
            </Card>

            <Card className="text-center group hover:transform hover:scale-105 transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="bg-yellow-300 bg-opacity-20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-300 group-hover:text-teal-900 transition-all duration-300">
                  <Shield className="h-8 w-8 text-yellow-300 group-hover:text-teal-900" />
                </div>
                <h3 className="text-lg font-semibold text-teal-900 mb-2">MFI Matching</h3>
                <p className="text-teal-700 text-sm">
                  Compare offers from our partner MFIs and choose the best one
                </p>
                <div className="text-xs text-yellow-300 font-semibold mt-2">~30 minutes</div>
              </CardContent>
            </Card>

            <Card className="text-center group hover:transform hover:scale-105 transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="bg-teal-500 bg-opacity-20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-500 group-hover:text-yellow-50 transition-all duration-300">
                  <Clock className="h-8 w-8 text-teal-500 group-hover:text-yellow-50" />
                </div>
                <h3 className="text-lg font-semibold text-teal-900 mb-2">Get Funded</h3>
                <p className="text-teal-700 text-sm">
                  Receive funds directly to your M-Pesa or bank account
                </p>
                <div className="text-xs text-yellow-300 font-semibold mt-2">~10 minutes</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-teal-900 mb-12 text-center">
            Why Choose MicroFasta?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="flex flex-col items-center text-center p-8">
                <Smartphone className="h-12 w-12 text-cyan-600 mb-4" />
                <h3 className="font-semibold text-teal-900 mb-2">Fully Digital</h3>
                <p className="text-teal-700">
                  Apply and manage your loan entirely online from any device.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="flex flex-col items-center text-center p-8">
                <Eye className="h-12 w-12 text-yellow-400 mb-4" />
                <h3 className="font-semibold text-teal-900 mb-2">Transparent</h3>
                <p className="text-teal-700">
                  No hidden fees or surprises. See all terms clearly before you commit.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="flex flex-col items-center text-center p-8">
                <Shield className="h-12 w-12 text-teal-600 mb-4" />
                <h3 className="font-semibold text-teal-900 mb-2">Secure</h3>
                <p className="text-teal-700">
                  We use top-tier encryption and security protocols to protect your data.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-cyan-600 to-teal-700 text-yellow-50 py-16 md:py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 max-w-3xl mx-auto">
          Ready to get your loan in just 3 hours?
        </h2>
        <Link href="/apply">
          <Button
            size="lg"
            className="bg-yellow-300 text-teal-900 hover:bg-yellow-400 hover:text-teal-950 px-10 py-4 font-semibold transition-all duration-200 transform hover:scale-105"
          >
            Apply Now
          </Button>
        </Link>
      </section>
    </div>
  );
}

    

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, TrendingUp, ShieldCheck, Clock, Zap, Users, FileText, BarChartBig, Banknote, Phone, Mail, Rocket, Smartphone, GitCompareArrows, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center space-y-12 md:space-y-20">
      <section className="text-center py-12 md:py-20">
        <Image
          src="/microfasta-app-icon.png"
          alt="MicroFasta App Icon"
          width={128}
          height={128}
          className="mx-auto mb-6 rounded-full shadow-lg"
          data-ai-hint="mobile finance app logo"
        />
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Get your Logbook loan approved in <span className="text-warning">3 Hours</span>
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
          Compare offers from top MFIs in Kenya. Fast approval, competitive rates, and transparent terms.
        </p>
        <div className="space-x-4">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/apply">Apply Now</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/#learn-more">Learn More</Link>
          </Button>
        </div>
      </section>

      <section className="w-full max-w-5xl grid md:grid-cols-3 gap-8" id="learn-more">
        <FeatureCard
          icon={<Clock className="w-10 h-10 text-accent" />}
          title="Fast Approval"
          description="Loan applications processed swiftly, aiming for approval within 3 hours."
        />
        <FeatureCard
          icon={<TrendingUp className="w-10 h-10 text-accent" />}
          title="Top MFI Comparison"
          description="Our AI connects you with suitable Microfinance Institutions based on your profile."
        />
        <FeatureCard
          icon={<ShieldCheck className="w-10 h-10 text-accent" />}
          title="Secure & Transparent"
          description="We prioritize your data security and ensure a transparent loan process."
        />
      </section>

      <section className="w-full max-w-5xl py-12 md:py-16">
        <Card className="shadow-xl bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl">Why Choose MicroFasta?</CardTitle>
            <CardDescription className="text-lg text-foreground/70">
              Experience the smarter way to get a logbook loan.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8 pt-6">
            <BenefitItem
              icon={<Rocket className="w-8 h-8 text-primary" />}
              title="Unmatched Speed"
              description="From application to approval in as little as 3 hours. We value your time."
            />
            <BenefitItem
              icon={<Smartphone className="w-8 h-8 text-primary" />}
              title="Ultimate Convenience"
              description="Apply anytime, anywhere from your device. No lengthy paperwork or branch visits."
            />
            <BenefitItem
              icon={<GitCompareArrows className="w-8 h-8 text-primary" />}
              title="Best MFI Offers"
              description="Our AI matches you with multiple MFI offers, so you can pick the best terms."
            />
            <BenefitItem
              icon={<Eye className="w-8 h-8 text-primary" />}
              title="Full Transparency"
              description="No hidden fees. Understand all terms and conditions upfront before you commit."
            />
          </CardContent>
        </Card>
      </section>

      <section className="w-full max-w-5xl py-12 md:py-16">
         <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <Image 
                src="https://placehold.co/600x400.png" 
                alt="MicroFasta Loan Application Process Visual" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-md w-full md:w-1/2 object-cover"
                data-ai-hint="app interface"
              />
              <ol className="list-decimal list-inside space-y-4 text-foreground/90 md:w-1/2 text-lg">
                <li>
                  <span className="font-semibold">Register:</span> Create your secure account in minutes.
                </li>
                <li>
                  <span className="font-semibold">Apply:</span> Fill out our simple loan application form.
                </li>
                <li>
                  <span className="font-semibold">Get Matched:</span> Our AI finds the best MFIs for you.
                </li>
                <li>
                  <span className="font-semibold">Track:</span> Monitor your application status on your dashboard.
                </li>
                <li>
                  <span className="font-semibold">Receive Funds:</span> Get your loan disbursed quickly upon approval.
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="w-full max-w-5xl py-12 md:py-16">
        <Card className="shadow-xl bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl">Simple Process, Fast Results</CardTitle>
            <CardDescription className="text-lg text-foreground/70">
              Our streamlined process gets you from application to approved in just 3 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
            <ProcessStep
              icon={<FileText className="w-10 h-10 text-accent" />}
              title="Apply Online"
              duration="~10 minutes"
              description="Fill out our simple form with your details and vehicle information."
            />
            <ProcessStep
              icon={<BarChartBig className="w-10 h-10 text-accent" />}
              title="Assessment"
              duration="~45 minutes"
              description="We evaluate your affordability and vehicle value automatically."
            />
            <ProcessStep
              icon={<Users className="w-10 h-10 text-accent" />}
              title="MFI Matching"
              duration="~30 minutes"
              description="Compare offers from our partner MFIs and choose the best one."
            />
            <ProcessStep
              icon={<Banknote className="w-10 h-10 text-accent" />}
              title="Get Funded"
              description="Receive funds directly to your M-Pesa or bank account upon approval."
            />
          </CardContent>
        </Card>
      </section>

      <section className="w-full max-w-3xl py-12 md:py-16 text-center">
        <Card className="shadow-lg bg-secondary/30">
          <CardHeader>
            <CardTitle className="text-3xl">Contact Us</CardTitle>
            <CardDescription className="text-lg text-secondary-foreground/90">
              Have questions? We&apos;re here to help!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center space-x-3 text-lg">
              <Phone className="w-6 h-6 text-primary" />
              <a href="tel:0742241585" className="hover:underline text-foreground">0742241585</a>
            </div>
            <div className="flex items-center justify-center space-x-3 text-lg">
              <Mail className="w-6 h-6 text-primary" />
              <a href="mailto:info@Microfasta.co.ke" className="hover:underline text-foreground">info@Microfasta.co.ke</a>
            </div>
            <div className="pt-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/apply">Get Started Now</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="items-center">
        {icon}
        <CardTitle className="mt-4">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

interface BenefitItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function BenefitItem({ icon, title, description }: BenefitItemProps) {
  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <p className="text-foreground/80">{description}</p>
      </div>
    </div>
  );
}

interface ProcessStepProps {
  icon: React.ReactNode;
  title: string;
  duration?: string;
  description: string;
}

function ProcessStep({ icon, title, duration, description }: ProcessStepProps) {
  return (
    <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="mx-auto mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      {duration && <p className="text-sm text-primary font-medium mb-2">{duration}</p>}
      <p className="text-foreground/70 text-sm flex-grow">{description}</p>
    </Card>
  );
}

    

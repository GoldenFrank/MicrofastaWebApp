import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, TrendingUp, ShieldCheck, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center space-y-12">
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
          Get Your Logbook Loan in 3 Hours
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

      <section className="w-full max-w-5xl py-12 md:py-20">
         <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <Image 
                src="https://placehold.co/600x400.png" 
                alt="Loan Application Process" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-md w-full md:w-1/2 object-cover"
                data-ai-hint="financial process"
              />
              <ol className="list-decimal list-inside space-y-4 text-foreground/90 md:w-1/2">
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

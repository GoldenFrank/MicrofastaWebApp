import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function AppLogo() {
  return (
    <Link href="/" className="flex items-center space-x-2 text-primary hover:text-accent transition-colors">
      <Compass className="w-8 h-8" />
      <span className="font-headline text-2xl font-semibold">
        Logbook Loan Compass
      </span>
    </Link>
  );
}

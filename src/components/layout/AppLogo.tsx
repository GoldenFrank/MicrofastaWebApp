import Link from 'next/link';
import { Compass } from 'lucide-react'; // Consider changing icon if Compass doesn't fit MicroFasta

export default function AppLogo() {
  return (
    <Link href="/" className="flex items-center space-x-2 text-foreground hover:text-accent transition-colors">
      <Compass className="w-8 h-8" />
      <span className="font-headline text-2xl font-semibold">
        MicroFasta
      </span>
    </Link>
  );
}


'use client';

import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export default function HowItWorksClientButton() {
  return (
    <Button
      variant="outline"
      size="lg"
      className="border-2 border-yellow-300 text-yellow-300 hover:bg-yellow-300 hover:text-teal-900 text-lg font-semibold px-8 py-4 h-auto transition-all duration-200"
      onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
    >
      <Clock className="mr-2 h-5 w-5" />
      How It Works
    </Button>
  );
}

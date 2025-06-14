
'use client';

import React, { useState, useEffect } from 'react';

export default function Footer() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const date = new Date();
    setCurrentDate(date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));
  }, []);

  return (
    <footer className="bg-muted text-muted-foreground py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        {currentDate && <p className="text-sm mb-1">{currentDate}</p>}
        <p>&copy; {new Date().getFullYear()} MicroFasta. All rights reserved.</p>
        <p className="text-sm">Fast Logbook Loans, Simplified.</p>
      </div>
    </footer>
  );
}

export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} MicroFasta. All rights reserved.</p>
        <p className="text-sm">Fast Logbook Loans, Simplified.</p>
      </div>
    </footer>
  );
}

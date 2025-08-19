import Calculator from "@/components/calculator";

const Footer = () => (
  <footer className="mt-12 text-slate-500 text-sm z-10 text-center">
      <p>Calculations are an approximation based on the speed of sound.</p>
  </footer>
);

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 text-white overflow-hidden relative">
      <div className="storm-bg"></div>
      <div className="animated-gradient-overlay"></div>
      <Calculator />
      <Footer />
    </main>
  );
}
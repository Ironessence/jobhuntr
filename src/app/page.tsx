import Navbar from "@/components/navbar/Navbar";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl font-bold mb-4">App headline, says something meaningful.</h2>
        <p className="text-xl mb-8">App subtitle, this says something meaningful.</p>
      </main>
    </div>
  );
}

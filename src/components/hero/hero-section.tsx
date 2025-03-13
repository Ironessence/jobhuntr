import heroImage from "@/assets/images/hero-img.png";
import Image from "next/image";

export default function HeroSection() {
  return (
    <>
      <main className="overflow-x-hidden">
        <section className="relative text-white overflow-hidden py-6">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left content */}
              <div className="z-10">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                  Ship 10x
                  <br />
                  Faster with ApplyNinja
                </h1>
                <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-lg">
                  Highly customizable AI tools for optimizing your job applications and landing your
                  dream role faster than ever before.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors">
                    Try for free
                  </button>
                </div>
              </div>

              {/* Right image with overflow effect */}
              <div className="relative md:block h-full">
                <div className="absolute -right-1/3 top-0 w-full h-full">
                  <Image
                    src={heroImage}
                    alt="Ninja Hero"
                    width={2000}
                    height={2000}
                    className="w-[250%] h-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

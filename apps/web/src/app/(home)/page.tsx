import Link from "next/link";

import { GridBackground } from "@/components/grid-background";

export default function Page() {
  return (
    <div className="flex flex-1">
      <div className="relative min-h-screen w-full overflow-hidden">
        <GridBackground gridSize="6:6">
          <div className="mx-auto flex h-full max-w-4xl flex-col items-center justify-center space-y-10 px-8">
            {/* Main heading */}
            <h1 className="animate-fade-in bg-linear-to-r from-white via-purple-200 to-fuchsia-400 bg-clip-text text-center font-bold text-3xl text-transparent md:text-4xl">
              Pelatform
              <span className="ms-3 bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Toolkits
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-2xl animate-fade-in text-center text-white text-xl">
              Complete documentation for Pelatform toolkits. Build modern applications faster with
              our comprehensive suite of developer tools.
            </p>

            {/* CTA buttons */}
            <div className="flex animate-fade-in flex-col justify-center">
              <button
                type="button"
                className="w-40 rounded-base rounded-full bg-linear-to-br from-green-400 to-blue-600 px-4 py-2.5 text-center font-medium text-sm text-white uppercase leading-5 hover:bg-linear-to-bl hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-200 dark:focus:ring-green-800"
              >
                <Link href="/docs">Get Started</Link>
              </button>
            </div>
          </div>
        </GridBackground>
      </div>
    </div>
  );
}

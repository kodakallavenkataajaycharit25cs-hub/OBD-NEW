import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <section className="bg-white font-sans min-h-screen w-full flex items-center justify-center m-0 p-0 absolute inset-0 z-[100]">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full sm:w-10/12 md:w-8/12 text-center">
            <div
              className="bg-[url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')] h-[300px] sm:h-[400px] md:h-[500px] bg-center bg-no-repeat bg-contain"
              aria-hidden="true"
            >
              <h1 className="text-center text-black font-black text-6xl sm:text-7xl md:text-8xl pt-6 sm:pt-8 drop-shadow-sm">
                404
              </h1>
            </div>

            <div className="mt-[-20px] md:mt-[-50px] relative z-20">
              <h3 className="text-2xl text-black sm:text-3xl font-black tracking-tighter uppercase mb-4">
                Looks like you're lost
              </h3>
              <p className="mb-6 text-gray-500 font-bold uppercase tracking-widest text-xs sm:mb-5">
                The node you are looking for is offline or unavailable.
              </p>

              <Button
                variant="default"
                onClick={() => navigate("/")}
                className="my-5 bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] text-xs font-black uppercase tracking-widest px-8 py-6 rounded-2xl transition-all hover:scale-[1.02]"
              >
                Return to Base
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

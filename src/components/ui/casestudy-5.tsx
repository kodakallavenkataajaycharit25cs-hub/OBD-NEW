import { MoveRight, Truck, Shield, Route } from "lucide-react";
import React, { ReactNode } from "react";

export interface CasestudyItem {
  logo: ReactNode;
  company: string;
  tags: string;
  title: string;
  subtitle: string;
  image: string;
  link?: string;
}

interface Casestudy5Props {
  featuredCasestudy: CasestudyItem;
  casestudies: CasestudyItem[];
}

const defaultFeaturedCasestudy: CasestudyItem = {
  logo: <Truck className="h-8 w-8 text-blue-500" />,
  company: "Sukrutha Logistics",
  tags: "SUPPLY CHAIN / AI AUTOMATION",
  title: "Slashing fuel costs by 15% with AI.",
  subtitle: "How Sukrutha Logistics transformed their fleet efficiency.",
  image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&q=80",
  link: "#",
};

const defaultCasestudies: CasestudyItem[] = [
  {
    logo: <Shield className="h-8 w-8 text-purple-500" />,
    company: "Apex Transport",
    tags: "SAFETY / TELEMATICS",
    title: "Zero critical incidents in 2025.",
    subtitle: "A safety-first approach using predictive behavior analytics.",
    image: "",
    link: "#",
  },
  {
    logo: <Route className="h-8 w-8 text-green-500" />,
    company: "Rapid Freight",
    tags: "NEURAL ROUTING / LOGISTICS",
    title: "Cutting delivery times by 30%.",
    subtitle: "Mastering neural routing for more efficient dispatch operations.",
    image: "",
    link: "#",
  },
];

export const Casestudy5 = ({
  featuredCasestudy = defaultFeaturedCasestudy,
  casestudies = defaultCasestudies,
}: Casestudy5Props) => {
  return (
    <section className="py-32">
      <div className="container mx-auto">
        <div className="border border-white/10 rounded-xl overflow-hidden">
          <a
            href={featuredCasestudy.link || "#"}
            className="group grid gap-4 overflow-hidden px-6 transition-colors duration-500 ease-out hover:bg-white/5 lg:grid-cols-2 xl:px-28"
          >
            <div className="flex flex-col justify-between gap-4 pt-8 md:pt-16 lg:pb-16">
              <div className="flex items-center gap-3 text-2xl font-medium text-white">
                {featuredCasestudy.logo}
                {featuredCasestudy.company}
              </div>
              <div>
                <span className="text-xs text-blue-400 font-bold tracking-widest uppercase sm:text-sm">
                  {featuredCasestudy.tags}
                </span>
                <h2 className="mt-4 mb-5 text-2xl font-black text-white text-balance sm:text-4xl sm:leading-[1.2]">
                  {featuredCasestudy.title}
                  <span className="font-medium text-gray-400 transition-colors duration-500 ease-out group-hover:text-gray-300">
                    {" "}
                    {featuredCasestudy.subtitle}
                  </span>
                </h2>
              </div>
            </div>
            <div className="relative isolate py-16">
              <div className="relative isolate h-full border border-white/10 bg-white/5 p-2 rounded-xl">
                <div className="h-full overflow-hidden rounded-lg">
                  <img
                    src={featuredCasestudy.image}
                    alt="placeholder"
                    className="aspect-[14/9] h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </a>
          <div className="flex border-t border-white/10">
            <div className="hidden w-28 shrink-0 bg-[radial-gradient(var(--muted-foreground)_1px,transparent_1px)] [background-size:10px_10px] opacity-15 xl:block"></div>
            <div className="grid lg:grid-cols-2 w-full">
              {casestudies.map((item, idx) => (
                <a
                  key={item.company}
                  href={item.link || "#"}
                  className={`group flex flex-col justify-between gap-12 border-white/10 bg-transparent px-6 py-8 transition-colors duration-500 ease-out hover:bg-white/5 md:py-16 lg:pb-16 xl:gap-16 ${
                    idx === 0
                      ? "xl:border-l xl:pl-8"
                      : "border-t lg:border-t-0 lg:border-l xl:border-r xl:pl-8"
                  }`}
                >
                  <div className="flex items-center gap-3 text-2xl font-medium text-white">
                    {item.logo}
                    {item.company}
                  </div>
                  <div>
                    <span className="text-xs text-blue-400 font-bold tracking-widest uppercase sm:text-sm">
                      {item.tags}
                    </span>
                    <h2 className="mt-4 mb-5 text-2xl font-bold text-white text-balance sm:text-3xl sm:leading-[1.2]">
                      {item.title}
                      <span className="font-medium text-gray-400 transition-colors duration-500 ease-out group-hover:text-gray-300">
                        {" "}
                        {item.subtitle}
                      </span>
                    </h2>
                  </div>
                </a>
              ))}
            </div>
            <div className="hidden w-28 shrink-0 bg-[radial-gradient(var(--muted-foreground)_1px,transparent_1px)] [background-size:10px_10px] opacity-15 xl:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

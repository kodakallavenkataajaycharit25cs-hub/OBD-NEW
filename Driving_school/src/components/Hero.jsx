import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="relative min-h-[500px] flex items-start overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Modern Bangalore skyline"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwinAbvXn9R02dbgsqpnG6CyNK_k8W-MUMlwohe-rMwpkHZU0PYHJT-CpCJgqmqN9DTtaynqFLdgK19PwzotmWr7hvZ2msTFrRuoW9FcBEU2BggMoao60B7xcZ118V9YW5aLOoQ3RyWF2knTS0wEL_mk3Mm8rrqXpmNGnqfgzqskJdMehyLJEfGQN-H_0f_uyGhm8CcY1iVvOmD3gASXuzUM2e1vGQvqmM7unGrSkYAUi-lRrMjAOPzO9abLgxP7MA-knT6aUbMmQ"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent dark:from-slate-950 dark:via-slate-950/70 dark:to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1.5 rounded-full bg-primary/10 dark:bg-blue-500/20 text-primary dark:text-blue-300 font-bold text-[10px] tracking-widest uppercase mb-5 clay-btn">
            Bangalore&apos;s Elite Driving Academy
          </span>

          <h1 className="text-5xl md:text-7xl font-moho tracking-tighter text-blue-900 dark:text-blue-100 leading-[0.9] mb-6">
            Navigate the <br />
            <span className="text-secondary dark:text-orange-400">Urban Jungle</span> <br />
            with Clarity.
          </h1>

          <p className="text-lg text-on-surface-variant dark:text-slate-400 max-w-lg mb-8 leading-relaxed">
            Experience precision-led driving instruction tailored for the high-tech pulse of modern
            Bangalore. Mastery behind the wheel starts with lucid confidence.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/booking"
              className="text-white px-8 py-3.5 rounded-full font-bold text-[11px] tracking-widest uppercase clay-btn skeu-btn-primary flex items-center justify-center underline-none"
              id="hero-book-slot"
            >
              Book a slot
            </Link>
            <Link
              to="/curriculums"
              className="text-primary dark:text-blue-300 px-8 py-3.5 rounded-full font-bold text-[11px] tracking-widest uppercase clay-btn skeu-btn-glass flex items-center justify-center underline-none"
              id="hero-view-curriculums"
            >
              View Curriculums
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

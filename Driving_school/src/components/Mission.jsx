function Mission() {
  return (
    <section className="py-24 hero-gradient">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-56 h-56 bg-primary/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
            <img
              alt="Professional driving instructor"
              className="rounded-[2rem] shadow-2xl relative z-10 w-full aspect-[4/5] object-cover"
              src="https://images.pexels.com/photos/4391487/pexels-photo-4391487.jpeg"
            />
            <div className="absolute -bottom-5 -right-5 clay-float p-6 z-20 max-w-[240px]">
              <h4 className="text-xl font-moho text-primary dark:text-blue-400 mb-1">15+ Years</h4>
              <p className="text-[12px] text-on-surface-variant dark:text-slate-400">
                Defining safety standards in Karnataka&apos;s driving landscape.
              </p>
            </div>
          </div>

          {/* Text Side */}
          <div className="lg:pl-8">
            <h2 className="text-3xl font-moho tracking-tight text-blue-900 dark:text-blue-200 mb-6 uppercase italic">
              Our Mission: Transparency
            </h2>
            <p className="text-base text-on-surface-variant dark:text-slate-400 leading-relaxed mb-5">
              At Lucid Navigator, we believe driving isn&apos;t just a skill—it&apos;s a form of
              urban communication. In the heart of Bangalore, where every lane change matters, we
              provide the technical mastery and psychological readiness needed to thrive.
            </p>
            <p className="text-base text-on-surface-variant dark:text-slate-400 leading-relaxed mb-8">
              Our methodology moves away from rote learning. We use tech-enabled tracking and
              glass-clear feedback loops to ensure you don&apos;t just pass a test, but command the
              road.
            </p>

            {/* Feature Badges */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 dark:bg-blue-500/20 flex items-center justify-center text-primary dark:text-blue-300 neu-icon">
                  <span
                    className="material-symbols-outlined !text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified_user
                  </span>
                </div>
                <span className="font-bold text-[13px] text-blue-900 dark:text-blue-200">
                  RTO Certified Excellence
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 dark:bg-orange-500/20 flex items-center justify-center text-secondary dark:text-orange-400 neu-icon">
                  <span
                    className="material-symbols-outlined !text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    monitoring
                  </span>
                </div>
                <span className="font-bold text-[13px] text-blue-900 dark:text-blue-200">
                  Real-time Performance Analytics
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Mission

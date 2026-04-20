const curricula = [
  {
    name: 'Intro / Demo',
    price: '₹0',
    subtitle: 'See how we teach',
    features: ['1 Theory session', 'Basic vehicle overview', 'Instructor evaluation', 'Free driving guide PDF'],
    buttonText: 'Try for Free',
    isPopular: false,
    color: 'text-on-surface-variant',
  },
  {
    name: 'Basic Navigator',
    price: '₹8,500',
    subtitle: 'Perfect for beginners',
    features: ['15 Driving sessions', 'Basic traffic rules', 'Parking mastery', 'Documentation help'],
    buttonText: 'Enroll in Basic',
    isPopular: false,
    color: 'text-blue-900 dark:text-blue-200',
  },
  {
    name: 'Urban Mastery',
    price: '₹12,000',
    subtitle: 'Master the city',
    features: [
      '25 Driving sessions',
      'Advanced city maneuvers',
      'Highway driving basics',
      'Night driving sessions',
      'Priority scheduling',
    ],
    buttonText: 'Upgrade to Mastery',
    isPopular: true,
    color: 'text-primary dark:text-blue-400',
  },
  {
    name: 'Highway Elite',
    price: '₹18,500',
    subtitle: 'The ultimate skill set',
    features: [
      'Unlimited sessions*',
      'High-speed control',
      'Interstate driving',
      'Emergency maneuvers',
      'Mechanical basics',
      'Lifetime support',
    ],
    buttonText: 'Join the Elite',
    isPopular: false,
    color: 'text-secondary dark:text-orange-400',
  },
]

function Curriculums() {
  return (
    <div className="py-24 container mx-auto px-8 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-moho text-blue-900 dark:text-blue-100 mb-4 uppercase tracking-tighter">
          Our Curriculums
        </h1>
        <p className="text-lg text-on-surface-variant dark:text-slate-400 max-w-2xl mx-auto">
          Choose the path that fits your current skill level and goals. High-precision driving starts here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {curricula.map((plan) => (
          <div
            key={plan.name}
            className={`clay-card p-10 flex flex-col relative overflow-hidden transition-all duration-500 hover:-translate-y-4 ${
              plan.isPopular ? 'border-2 border-primary/50 dark:border-blue-500/50 bg-blue-50/10 dark:bg-blue-900/10' : ''
            }`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0">
                <span className="bg-primary dark:bg-blue-600 text-white text-[9px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-bl-xl shadow-lg">
                  Most Popular
                </span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-moho text-blue-900 dark:text-blue-100 mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-4xl font-extrabold text-blue-900 dark:text-white">{plan.price}</span>
                <span className="text-[11px] text-on-surface-variant dark:text-slate-400 uppercase tracking-widest font-medium">
                  {plan.price === '₹0' ? '' : '/ full course'}
                </span>
              </div>
              <p className="text-[13px] text-on-surface-variant dark:text-slate-400 mt-2 italic font-medium">
                {plan.subtitle}
              </p>
            </div>

            <div className="flex-1 space-y-4 mb-10">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 dark:bg-blue-500/20 flex items-center justify-center text-primary dark:text-blue-300">
                    <span className="material-symbols-outlined !text-[14px]">auto_awesome</span>
                  </div>
                  <span className="text-[13px] text-on-surface-variant dark:text-slate-200 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <button
              className={`w-full py-4 rounded-full font-bold text-[11px] tracking-widest uppercase clay-btn transition-all ${
                plan.isPopular
                  ? 'skeu-btn-primary text-white'
                  : 'skeu-btn-glass text-primary dark:text-blue-300'
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Curriculums

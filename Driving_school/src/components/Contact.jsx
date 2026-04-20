import { useState } from 'react'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    course: 'Basic Navigator',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <section className="py-24 relative" id="contact">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Form */}
          <div className="lg:col-span-5 clay-card p-10 relative z-10">
            <h2 className="text-2xl font-moho text-blue-900 dark:text-blue-100 mb-1 uppercase italic">
              Get in Touch
            </h2>
            <p className="text-[13px] text-on-surface-variant dark:text-slate-400 mb-8">
              Ready to start? Send us a signal.
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-primary dark:text-blue-400">
                  Full Name
                </label>
                <input
                  className="w-full bg-surface-container-low dark:bg-slate-900 p-3.5 placeholder:text-outline-variant dark:text-slate-200 text-sm neu-input"
                  placeholder="Aravind Kumar"
                  type="text"
                  name="name"
                  id="contact-name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-primary dark:text-blue-400">
                  WhatsApp Number
                </label>
                <input
                  className="w-full bg-surface-container-low dark:bg-slate-900 p-3.5 placeholder:text-outline-variant dark:text-slate-200 text-sm neu-input"
                  placeholder="+91 98765 43210"
                  type="tel"
                  name="phone"
                  id="contact-phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-primary dark:text-blue-400">
                  Select Course
                </label>
                <select
                  className="w-full bg-surface-container-low dark:bg-slate-900 p-3.5 text-on-surface-variant dark:text-slate-400 text-sm neu-input"
                  name="course"
                  id="contact-course"
                  value={formData.course}
                  onChange={handleChange}
                >
                  <option>Basic Navigator</option>
                  <option>Urban Mastery</option>
                  <option>License Fast-Track</option>
                </select>
              </div>
              <button
                className="w-full text-white py-3.5 rounded-full font-bold text-[11px] tracking-widest uppercase clay-btn skeu-btn-primary mt-2"
                type="submit"
                id="contact-submit"
              >
                Send Signal
              </button>
            </form>

            {/* Contact Info */}
            <div className="mt-10 pt-7 border-t border-primary/5 dark:border-white/5 space-y-3">
              <div className="flex items-center gap-3 text-on-surface-variant dark:text-slate-400 text-[13px]">
                <span className="material-symbols-outlined !text-[18px] text-primary dark:text-blue-400">
                  call
                </span>
                <span className="font-medium">+91 80 4123 5678</span>
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant dark:text-slate-400 text-[13px]">
                <span className="material-symbols-outlined !text-[18px] text-primary dark:text-blue-400">
                  mail
                </span>
                <span className="font-medium">hello@lucidnavigator.in</span>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="lg:col-span-7 h-[500px] lg:h-auto rounded-[2rem] overflow-hidden shadow-2xl relative border-4 border-white/50 dark:border-slate-800/50">
            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-900">
              <img
                alt="Map of Indiranagar, Bangalore"
                className="w-full h-full object-cover grayscale opacity-80 dark:invert dark:opacity-90 dark:brightness-150 dark:contrast-125"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzQm8mK6okw9DuBqFQ7w_z-BC7F1qjWwNhbBR6L5ylTuNqEt0CJuPrYnx2jNevsY4IZC3rfnRrz91xonXBGcjQcTLvlsgyV07A_1WxEte2tRu0kKinvWyH1gyOzKmBq4QhEgiaCXuq45Vbm_0XUO3vXlMjVAqryh_07Amx61d_6tsgNhWQ663sv1keN9E4eVj3Q3LNahSrIRUXxV8CFdfUNgDZv79PiXoSYigBgP5OrGqBSNQg6SzpzmzCfxqB40ZZTHMHQflin34"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-10 h-10 bg-primary dark:bg-blue-500 rounded-full animate-ping absolute opacity-20" />
                  <div className="w-10 h-10 bg-primary dark:bg-blue-500 rounded-full flex items-center justify-center relative shadow-2xl">
                    <span className="material-symbols-outlined !text-[20px] text-white">
                      location_on
                    </span>
                  </div>
                  <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 glass-panel px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl border border-white/40 dark:border-white/10">
                    <span className="text-[10px] font-bold text-blue-900 dark:text-blue-200 uppercase tracking-widest">
                      Main Hub: Indiranagar
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact

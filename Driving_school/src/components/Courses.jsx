import { Link } from 'react-router-dom'

const courses = [
  {
    icon: "commute",
    title: "Basic Navigator",
    description:
      "20 Sessions. The perfect foundation for absolute beginners looking to master the basics of manual or auto transmission.",
    price: "₹8,500",
    iconBg: "bg-primary/5 dark:bg-blue-500/10",
    iconBgHover: "group-hover:bg-primary dark:group-hover:bg-blue-600",
    iconColor: "text-primary dark:text-blue-400",
  },
  {
    icon: "speed",
    title: "Urban Mastery",
    description:
      "Advanced maneuvers, highway driving, and peak-hour Bangalore traffic navigation strategies.",
    price: "₹12,000",
    iconBg: "bg-secondary/5 dark:bg-orange-500/10",
    iconBgHover: "group-hover:bg-secondary dark:group-hover:bg-orange-600",
    iconColor: "text-secondary dark:text-orange-400",
  },
  {
    icon: "license",
    title: "License Fast-Track",
    description:
      "Comprehensive prep including RTO documentation, mock tests, and a dedicated day-of assistant.",
    price: "₹5,000",
    iconBg: "bg-primary/5 dark:bg-blue-500/10",
    iconBgHover: "group-hover:bg-primary dark:group-hover:bg-blue-600",
    iconColor: "text-primary dark:text-blue-400",
  },
]

function CourseCard({ icon, title, description, price, iconBg, iconBgHover, iconColor }) {
  return (
    <Link
      to="/booking"
      className="clay-card p-7 hover:-translate-y-2 transition-all duration-500 group block cursor-pointer no-underline"
    >
      <div
        className={`w-14 h-14 ${iconBg} ${iconBgHover} flex items-center justify-center mb-6 transition-colors duration-500 neu-icon`}
      >
        <span
          className={`material-symbols-outlined !text-[24px] ${iconColor} group-hover:text-white transition-colors`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      </div>
      <h3 className="text-xl font-moho text-blue-900 dark:text-blue-200 mb-3">{title}</h3>
      <p className="text-[13px] text-on-surface-variant dark:text-slate-400 mb-6 leading-relaxed">
        {description}
      </p>
      <div className="flex items-center justify-between pt-5 border-t border-primary/10 dark:border-white/5">
        <span className="text-primary dark:text-blue-400 font-bold text-sm">{price}</span>
        <span className="material-symbols-outlined !text-[18px] text-outline dark:text-slate-500">
          arrow_forward
        </span>
      </div>
    </Link>
  )
}

function Courses() {
  return (
    <section className="py-24 bg-surface-container-low dark:bg-slate-900/50" id="courses">
      <div className="container mx-auto px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl font-moho tracking-tighter text-blue-900 dark:text-blue-100 mb-3 uppercase">
              The Curriculums
            </h2>
            <p className="text-on-surface-variant dark:text-slate-400 text-base">
              Honed programs designed for every stage of your driving journey.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="h-1 w-20 bg-primary dark:bg-blue-600 rounded-full" />
            <div className="h-1 w-10 bg-outline-variant dark:bg-slate-700 rounded-full" />
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.title} {...course} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Courses

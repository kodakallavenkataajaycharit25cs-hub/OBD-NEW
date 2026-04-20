import { Link } from 'react-router-dom'

function Header({ toggleDarkMode, isDark }) {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/10 dark:border-slate-800/50 shadow-[0_20px_40px_rgba(25,27,35,0.06)]">
      <nav className="flex justify-between items-center px-8 py-3 max-w-full mx-auto">
        {/* Logo */}
        <Link to="/" className="text-xl font-moho tracking-tighter text-blue-900 dark:text-blue-300">
          Lucid Navigator
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            className="font-sans tracking-tight text-[11px] font-medium uppercase text-slate-600 dark:text-slate-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            to="/"
          >
            About Us
          </Link>
          <Link
            className="font-sans tracking-tight text-[11px] font-medium uppercase text-slate-600 dark:text-slate-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            to="/curriculums"
          >
            Courses
          </Link>
          <Link
            className="font-sans tracking-tight text-[11px] font-medium uppercase text-slate-600 dark:text-slate-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            to="/"
          >
            Login
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all flex items-center justify-center text-slate-600 dark:text-slate-400 neu-icon"
            onClick={toggleDarkMode}
            title="Toggle Theme"
            id="theme-toggle"
          >
            {isDark ? (
              <span className="material-symbols-outlined !text-[20px]">light_mode</span>
            ) : (
              <span className="material-symbols-outlined !text-[20px]">dark_mode</span>
            )}
          </button>
          <a
            href="/#contact"
            className="hidden lg:block font-sans tracking-tight text-[11px] font-medium uppercase text-slate-600 dark:text-slate-400 hover:text-blue-800 dark:hover:text-blue-300 transition-all"
          >
            Register
          </a>
          <Link
            to="/booking"
            className="px-5 py-2 rounded-full text-white font-sans tracking-tight text-[11px] font-medium uppercase clay-btn skeu-btn-primary flex items-center justify-center"
            id="header-book-slot"
          >
            Book a slot
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Header

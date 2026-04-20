import { useState } from 'react'

function TimePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState('hours') // 'hours' or 'minutes'
  
  const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
  
  const [h, mAndPeriod] = value.split(':')
  const [m, period] = mAndPeriod ? mAndPeriod.split(' ') : ['00', 'AM']

  const handleHourClick = (hour) => {
    onChange(`${hour}:${m} ${period}`)
    setView('minutes')
  }

  const handleMinClick = (min) => {
    onChange(`${h}:${min} ${period}`)
    setIsOpen(false)
    setView('hours')
  }

  const togglePeriod = () => {
    onChange(`${h}:${m} ${period === 'AM' ? 'PM' : 'AM'}`)
  }

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-surface-container-low dark:bg-slate-900 p-3.5 text-on-surface-variant dark:text-slate-400 text-sm neu-input flex justify-between items-center cursor-pointer"
      >
        <span>{value || '12:00 PM'}</span>
        <span className="material-symbols-outlined !text-[20px] dark:text-white">schedule</span>
      </div>

      {isOpen && (
        <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 clay-card p-6 w-[280px] z-50 animate-in fade-in zoom-in duration-300">
          {/* Header Display */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <div 
                onClick={() => setView('hours')}
                className={`text-4xl font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer ${view === 'hours' ? 'bg-primary/20 text-primary dark:text-blue-300' : 'text-slate-400'}`}
              >
                {h.padStart(2, '0')}
              </div>
              <span className="text-3xl font-bold text-slate-400">:</span>
              <div 
                onClick={() => setView('minutes')}
                className={`text-4xl font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer ${view === 'minutes' ? 'bg-primary/20 text-primary dark:text-blue-300' : 'text-slate-400'}`}
              >
                {m}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <button 
                onClick={togglePeriod}
                className={`text-[10px] font-bold px-2 py-1 rounded border transition-all ${period === 'AM' ? 'bg-primary text-white border-primary clay-btn' : 'border-slate-300 dark:border-slate-700 text-slate-400'}`}
              >
                AM
              </button>
              <button 
                onClick={togglePeriod}
                className={`text-[10px] font-bold px-2 py-1 rounded border transition-all ${period === 'PM' ? 'bg-primary text-white border-primary clay-btn' : 'border-slate-300 dark:border-slate-700 text-slate-400'}`}
              >
                PM
              </button>
            </div>
          </div>

          {/* Clock Face */}
          <div className="relative w-48 h-48 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center shadow-inner">
            <div className="w-1.5 h-1.5 bg-primary dark:bg-blue-400 rounded-full z-20" />
            
            {/* Hour/Minute Hand */}
            {view === 'hours' ? (
              <div 
                className="absolute w-1 h-20 bg-primary/40 dark:bg-blue-400/40 origin-bottom bottom-1/2 transition-all duration-300 rounded-full"
                style={{ transform: `rotate(${(parseInt(h) % 12) * 30}deg)` }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary dark:bg-blue-500 rounded-full shadow-lg" />
              </div>
            ) : (
              <div 
                className="absolute w-1 h-20 bg-primary/40 dark:bg-blue-400/40 origin-bottom bottom-1/2 transition-all duration-300 rounded-full"
                style={{ transform: `rotate(${parseInt(m) * 6}deg)` }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary dark:bg-blue-500 rounded-full shadow-lg" />
              </div>
            )}

            {/* Numbers */}
            {view === 'hours' ? hours.map((hour, i) => {
              const angle = (i * 30) - 90
              const x = Math.cos(angle * (Math.PI / 180)) * 72
              const y = Math.sin(angle * (Math.PI / 180)) * 72
              return (
                <button
                  key={hour}
                  type="button"
                  onClick={() => handleHourClick(hour)}
                  className={`absolute text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition-colors z-30 hover:bg-primary/10 ${parseInt(h) === hour ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                >
                  {hour}
                </button>
              )
            }) : minutes.map((min, i) => {
              const angle = (min * 6) - 90
              const x = Math.cos(angle * (Math.PI / 180)) * 72
              const y = Math.sin(angle * (Math.PI / 180)) * 72
              return (
                <button
                  key={min}
                  type="button"
                  onClick={() => handleMinClick(min.toString().padStart(2, '0'))}
                  className={`absolute text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition-colors z-30 hover:bg-primary/10 ${parseInt(m) === min ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                >
                  {min.toString().padStart(2, '0')}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function Booking() {
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '12:00 PM',
    carType: 'MANUAL',
  })

  const handleChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Slot booked successfully for ${bookingData.name} at ${bookingData.time}!`)
    console.log('Booking submitted:', bookingData)
  }

  return (
    <div className="py-24 container mx-auto px-8 min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="clay-card p-10 max-w-lg w-full relative z-10">
        <h1 className="text-3xl font-moho text-blue-900 dark:text-blue-100 mb-2 uppercase italic text-center">
          Book Your Slot
        </h1>
        <p className="text-[13px] text-on-surface-variant dark:text-slate-400 mb-8 text-center">
          Fill in your details to secure your driving session.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase text-primary dark:text-blue-400 pl-1">
                Full Name
              </label>
              <input
                className="w-full bg-surface-container-low dark:bg-slate-900 p-3.5 placeholder:text-outline-variant dark:text-slate-200 text-sm neu-input"
                placeholder="Ex: John Doe"
                type="text"
                name="name"
                required
                value={bookingData.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase text-primary dark:text-blue-400 pl-1">
                Phone Number
              </label>
              <input
                className="w-full bg-surface-container-low dark:bg-slate-900 p-3.5 placeholder:text-outline-variant dark:text-slate-200 text-sm neu-input"
                placeholder="+91 XXXXX XXXXX"
                type="tel"
                name="phone"
                required
                value={bookingData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest uppercase text-primary dark:text-blue-400 pl-1">
              Email Address
            </label>
            <input
              className="w-full bg-surface-container-low dark:bg-slate-900 p-3.5 placeholder:text-outline-variant dark:text-slate-200 text-sm neu-input"
              placeholder="john@example.com"
              type="email"
              name="email"
              required
              value={bookingData.email}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase text-primary dark:text-blue-400 pl-1">
                Select Date
              </label>
              <input
                className="w-full bg-surface-container-low dark:bg-slate-900 p-3.5 text-on-surface-variant dark:text-slate-400 text-sm neu-input uppercase"
                type="date"
                name="date"
                required
                value={bookingData.date}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase text-primary dark:text-blue-400 pl-1">
                Select Time
              </label>
              <TimePicker 
                value={bookingData.time} 
                onChange={(newTime) => setBookingData({ ...bookingData, time: newTime })} 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest uppercase text-primary dark:text-blue-400 pl-1">
              Car / Transmission Type
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setBookingData({ ...bookingData, carType: 'MANUAL' })}
                className={`flex-1 py-3.5 rounded-xl font-bold text-[11px] tracking-widest uppercase transition-all ${
                  bookingData.carType === 'MANUAL'
                    ? 'skeu-btn-primary text-white clay-btn'
                    : 'neu-input text-on-surface-variant dark:text-slate-400'
                }`}
              >
                Manual
              </button>
              <button
                type="button"
                onClick={() => setBookingData({ ...bookingData, carType: 'AUTOMATIC' })}
                className={`flex-1 py-3.5 rounded-xl font-bold text-[11px] tracking-widest uppercase transition-all ${
                  bookingData.carType === 'AUTOMATIC'
                    ? 'skeu-btn-primary text-white clay-btn'
                    : 'neu-input text-on-surface-variant dark:text-slate-400'
                }`}
              >
                Automatic
              </button>
            </div>
          </div>

          <button
            className="w-full text-white py-4 rounded-full font-bold text-[12px] tracking-widest uppercase clay-btn skeu-btn-primary mt-4"
            type="submit"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  )
}

export default Booking

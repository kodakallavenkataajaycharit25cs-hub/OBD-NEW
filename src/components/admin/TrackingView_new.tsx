// Real-time Live Monitoring Map stable component
const TrackingView = () => {
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>('O1');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<'k' | 'm' | 'p'>('k');
  const [zoomLevel, setZoomLevel] = useState<number>(12);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fleet owners with their vehicles/drivers currently on routes
  const fleetOwners = [
    {
      id: 'O1',
      name: 'Alpha Logistics',
      hq: 'Pune, Maharashtra, India',
      hqCoords: '18.5204° N, 73.8567° E',
      activeVehicles: 3,
      totalFleet: 45,
      vehicles: [
        { id: 'V-101', plate: 'MH-12-PQ-8890', driver: 'Rohan Sharma', speed: 75, route: 'Pune → Mumbai', location: 'Pune, Maharashtra, India', status: 'IN TRANSIT', eta: '2h 15m' },
        { id: 'V-102', plate: 'MH-14-AB-3321', driver: 'Amit Patil', speed: 58, route: 'Pune → Nashik', location: 'Pune, Maharashtra, India', status: 'IN TRANSIT', eta: '3h 40m' },
        { id: 'V-103', plate: 'MH-12-CD-7764', driver: 'Sanjay Desai', speed: 0, route: 'Depot Idle', location: 'Pune, Maharashtra, India', status: 'AT DEPOT', eta: '—' }
      ]
    },
    {
      id: 'O2',
      name: 'Giga Mobility Corp',
      hq: 'Bangalore, Karnataka, India',
      hqCoords: '12.9716° N, 77.5946° E',
      activeVehicles: 2,
      totalFleet: 32,
      vehicles: [
        { id: 'V-201', plate: 'KA-03-MN-4421', driver: 'Aditya Hegde', speed: 62, route: 'Bangalore → Mysore', location: 'Bangalore, Karnataka, India', status: 'IN TRANSIT', eta: '1h 50m' },
        { id: 'V-202', plate: 'KA-05-XY-9918', driver: 'Pradeep Rao', speed: 44, route: 'Bangalore → Hosur', location: 'Bangalore, Karnataka, India', status: 'LOADING', eta: '45m' }
      ]
    },
    {
      id: 'O3',
      name: 'Matrix Transit Systems',
      hq: 'New Delhi, Delhi, India',
      hqCoords: '28.6139° N, 77.2090° E',
      activeVehicles: 4,
      totalFleet: 24,
      vehicles: [
        { id: 'V-301', plate: 'DL-01-AB-1092', driver: 'Vikram Singh', speed: 80, route: 'Delhi → Jaipur', location: 'New Delhi, Delhi, India', status: 'EXPRESS', eta: '4h 10m' },
        { id: 'V-302', plate: 'DL-02-GH-5567', driver: 'Manoj Kumar', speed: 55, route: 'Delhi → Agra', location: 'New Delhi, Delhi, India', status: 'IN TRANSIT', eta: '2h 30m' },
        { id: 'V-303', plate: 'DL-08-JK-2290', driver: 'Ravi Teja', speed: 68, route: 'Delhi → Chandigarh', location: 'New Delhi, Delhi, India', status: 'IN TRANSIT', eta: '3h 20m' },
        { id: 'V-304', plate: 'DL-03-LM-8841', driver: 'Sunil Verma', speed: 0, route: 'Maintenance Bay', location: 'New Delhi, Delhi, India', status: 'SERVICING', eta: '—' }
      ]
    },
    {
      id: 'O5',
      name: 'Hyperion Fleet Alliance',
      hq: 'Mumbai, Maharashtra, India',
      hqCoords: '19.0760° N, 72.8777° E',
      activeVehicles: 3,
      totalFleet: 52,
      vehicles: [
        { id: 'V-501', plate: 'MH-01-CX-1190', driver: 'Rahul Joshi', speed: 42, route: 'Mumbai → Thane', location: 'Mumbai, Maharashtra, India', status: 'IN TRANSIT', eta: '35m' },
        { id: 'V-502', plate: 'MH-04-DZ-6673', driver: 'Kiran Sawant', speed: 71, route: 'Mumbai → Pune', location: 'Mumbai, Maharashtra, India', status: 'EXPRESS', eta: '2h 50m' },
        { id: 'V-503', plate: 'MH-02-EF-3347', driver: 'Deepak More', speed: 0, route: 'Depot Idle', location: 'Mumbai, Maharashtra, India', status: 'AT DEPOT', eta: '—' }
      ]
    }
  ];

  const activeOwner = fleetOwners.find(o => o.id === selectedOwnerId) || fleetOwners[0];
  const activeVehicle = selectedVehicleId
    ? activeOwner.vehicles.find(v => v.id === selectedVehicleId) || activeOwner.vehicles[0]
    : activeOwner.vehicles[0];
  const mapTarget = searchQuery || activeOwner.hq;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapTarget)}&t=${mapMode}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`;

  const inTransitCount = activeOwner.vehicles.filter(v => v.speed > 0).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Active Real Google Map Workspace */}
        <div className="lg:col-span-3 bg-[#120F17]/80 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-xl flex flex-col relative overflow-hidden min-h-[580px]">

          {/* Control Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 z-20">
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              <span className="text-[10px] text-white font-black uppercase tracking-[0.25em]">FLEET TRACKING — {activeOwner.name.toUpperCase()}</span>
              <span className="text-[8px] font-black text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-lg">{inTransitCount} ACTIVE</span>
            </div>

            {/* Dynamic Map HUD Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search location..."
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-[10px] text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors w-44"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[9px] font-bold text-gray-400 hover:text-white transition-colors"
                >
                  Reset
                </button>
              )}

              <div className="bg-white/5 p-0.5 border border-white/5 rounded-xl flex">
                <button
                  onClick={() => setMapMode('k')}
                  className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${mapMode === 'k' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'
                    }`}
                >
                  Satellite
                </button>
                <button
                  onClick={() => setMapMode('m')}
                  className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${mapMode === 'm' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'
                    }`}
                >
                  Street
                </button>
                <button
                  onClick={() => setMapMode('p')}
                  className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${mapMode === 'p' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'
                    }`}
                >
                  Terrain
                </button>
              </div>

              <div className="flex items-center space-x-1 bg-white/5 p-0.5 border border-white/5 rounded-xl">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(9, prev - 1))}
                  className="w-6 h-6 flex items-center justify-center text-[10px] font-black text-gray-500 hover:text-white transition-all"
                >
                  -
                </button>
                <span className="text-[8px] font-black text-blue-400 px-1.5 uppercase">Zoom {zoomLevel}</span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(19, prev + 1))}
                  className="w-6 h-6 flex items-center justify-center text-[10px] font-black text-gray-500 hover:text-white transition-all"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Real Google Maps iframe embed */}
          <div className="flex-1 min-h-[440px] bg-zinc-950 rounded-2xl border border-white/5 overflow-hidden relative group shadow-2xl">
            <iframe
              title="Fleet Tracking Map"
              src={embedUrl}
              className="w-full h-full border-0 absolute inset-0 transition-opacity duration-300"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{
                filter: mapMode === 'm'
                  ? 'invert(90%) hue-rotate(180deg) brightness(85%) contrast(120%) saturate(80%)'
                  : mapMode === 'p'
                    ? 'invert(90%) hue-rotate(170deg) brightness(85%) contrast(110%) saturate(70%)'
                    : 'brightness(80%) contrast(110%) saturate(90%)'
              }}
            />

            {/* HUD Overlay */}
            <div className="absolute bottom-4 right-4 scifi-hud-overlay bg-black/90 backdrop-blur-md border border-white/5 p-4 rounded-2xl text-[9px] pointer-events-none text-left min-w-[220px] shadow-[0_4px_24px_rgba(0,0,0,0.85)] z-10">
              <div className="text-gray-500 font-black tracking-widest uppercase text-[7px] mb-1">FLEET HQ LOCATION</div>
              <div className="text-white font-black text-[12px] mb-0.5 truncate">{activeOwner.name.toUpperCase()}</div>
              <div className="text-blue-400 font-bold text-[8px] mb-2">{activeOwner.hqCoords}</div>

              <div className="grid grid-cols-3 gap-x-2 gap-y-2 pt-2 border-t border-white/5">
                <div>
                  <span className="text-gray-600 text-[6px] font-black uppercase tracking-wider block">FLEET</span>
                  <span className="text-white font-bold">{activeOwner.totalFleet} UNITS</span>
                </div>
                <div>
                  <span className="text-gray-600 text-[6px] font-black uppercase tracking-wider block">ON ROUTE</span>
                  <span className="text-green-400 font-bold">{inTransitCount} ACTIVE</span>
                </div>
                <div>
                  <span className="text-gray-600 text-[6px] font-black uppercase tracking-wider block">MODE</span>
                  <span className="text-white font-bold">
                    {mapMode === 'k' ? 'SAT' : mapMode === 'm' ? 'STREET' : 'TERRAIN'}
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 pointer-events-none border border-blue-500/10 rounded-2xl shadow-[inset_0_0_40px_rgba(59,130,246,0.15)]" />
          </div>

          {/* Vehicle Routes Table */}
          <div className="mt-5 bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <span className="text-[9px] font-black text-white uppercase tracking-widest">Active Vehicle Routes — {activeOwner.name}</span>
              <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{activeOwner.vehicles.length} vehicles tracked</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[8px] text-gray-500 uppercase tracking-widest font-black border-b border-white/5">
                    <th className="px-4 py-3">Plate</th>
                    <th className="px-4 py-3">Driver</th>
                    <th className="px-4 py-3">Route</th>
                    <th className="px-4 py-3">Speed</th>
                    <th className="px-4 py-3">ETA</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {activeOwner.vehicles.map(veh => (
                    <tr
                      key={veh.id}
                      onClick={() => setSelectedVehicleId(veh.id)}
                      className={`text-xs cursor-pointer transition-all ${selectedVehicleId === veh.id ? 'bg-blue-500/10' : 'hover:bg-white/[0.03]'}`}
                    >
                      <td className="px-4 py-3 font-black text-white uppercase tracking-wider font-sans">{veh.plate}</td>
                      <td className="px-4 py-3 text-gray-300 font-bold">{veh.driver}</td>
                      <td className="px-4 py-3 text-blue-400 font-bold">{veh.route}</td>
                      <td className="px-4 py-3">
                        <span className={`font-black ${veh.speed > 0 ? 'text-green-400' : 'text-gray-600'}`}>
                          {veh.speed > 0 ? `${veh.speed} km/h` : 'Idle'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 font-bold">{veh.eta}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border ${
                          veh.status === 'IN TRANSIT' || veh.status === 'EXPRESS'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : veh.status === 'LOADING'
                              ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                              : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                        }`}>
                          {veh.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Fleet Owners Sidebar */}
        <div className="bg-[#120F17]/80 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-xl flex flex-col justify-between overflow-y-auto custom-scrollbar">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 font-['Syne']">Fleet Owners</h3>

            <div className="space-y-4">
              {fleetOwners.map(owner => {
                const isSelected = owner.id === selectedOwnerId;
                const ownerActiveCount = owner.vehicles.filter(v => v.speed > 0).length;
                return (
                  <div
                    key={owner.id}
                    onClick={() => {
                      setSelectedOwnerId(owner.id);
                      setSelectedVehicleId(null);
                      setSearchQuery('');
                    }}
                    className={`p-4 border transition-all cursor-pointer rounded-2xl ${isSelected
                        ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                      }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-xs font-black uppercase tracking-wider ${isSelected ? 'text-blue-400' : 'text-white'}`}>{owner.name}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[7px] text-gray-500 uppercase tracking-widest font-black">HQ Region</span>
                        <span className="text-[9px] font-bold text-gray-300">{owner.hq.split(',')[0]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[7px] text-gray-500 uppercase tracking-widest font-black">Total Fleet</span>
                        <span className="text-[9px] font-bold text-white">{owner.totalFleet} Units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[7px] text-gray-500 uppercase tracking-widest font-black">On Route Now</span>
                        <span className={`text-[9px] font-bold ${ownerActiveCount > 0 ? 'text-green-400' : 'text-gray-500'}`}>{ownerActiveCount} Vehicles</span>
                      </div>
                      <div className="flex justify-between items-center pt-1.5 border-t border-white/5">
                        <span className="text-[7px] text-gray-500 uppercase tracking-widest font-black">Tracking</span>
                        <span className={`text-[8px] font-bold ${isSelected ? 'text-blue-400' : 'text-green-400'}`}>
                          {isSelected ? 'FLEET FOCUSED' : 'STANDBY'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 mt-6">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
              <h4 className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">FLEET OVERVIEW</h4>
              <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                Tracking {fleetOwners.reduce((acc, o) => acc + o.vehicles.filter(v => v.speed > 0).length, 0)} active vehicles across {fleetOwners.length} fleet owners. All satellite feeds secure.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

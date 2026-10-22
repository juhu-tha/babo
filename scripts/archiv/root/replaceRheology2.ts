import fs from 'fs';

const filePath = 'src/modules/Materialmodelle.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const startHooke = 'function RheologySection() {';
const endHooke = 'export default function Materialmodelle() {';

const startIndex = content.indexOf(startHooke);
const endIndex = content.indexOf(endHooke);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find bounds");
  process.exit(1);
}

const newRheology = `function RheologySection() {
  const [model, setModel] = React.useState<'hooke'|'newton'|'st_venant'|'prandtl'|'maxwell'|'kelvin'>('hooke');
  const [E, setE] = React.useState(10);
  const [eta, setEta] = React.useState(20);
  const [fy, setFy] = React.useState(5);
  const [sigma0, setSigma0] = React.useState(8);
  const [stressProfile, setStressProfile] = React.useState<'kriechen'|'dreieck'|'sinus'>('kriechen');

  const { t_labels, sigData, epsData, sigEpsData } = React.useMemo(() => {
    const dt = 0.05;
    const t_vals: number[] = [];
    const _tLabels: string[] = [];
    
    for (let t = 0; t <= 10; t += dt) {
      t_vals.push(t);
      if (Math.abs(t % 1) < 0.01) {
          _tLabels.push(t.toFixed(1));
      } else {
          _tLabels.push('');
      }
    }

    const get_sigma = (time: number) => {
      if (stressProfile === 'kriechen') {
        return (time >= 4 && time < 8) ? sigma0 : (time >= 1 && time < 4 ? sigma0 : 0);
      } else if (stressProfile === 'dreieck') {
        if (time < 1) return 0;
        if (time < 3) return sigma0 * (time - 1) / 2;
        if (time < 5) return sigma0 * (1 - (time - 3) / 2);
        return 0;
      } else if (stressProfile === 'sinus') {
        if (time < 1) return 0;
        if (time < 9) return (sigma0) * Math.sin((time - 1) * Math.PI / 2);
        return 0;
      }
      return 0;
    };

    const sig_vals = t_vals.map(get_sigma);
    if (stressProfile === 'kriechen') {
        // Fix for kriechen profile: exactly rectangular
        for (let i = 0; i < t_vals.length; i++) {
           if (t_vals[i] >= 1 && t_vals[i] <= 5) sig_vals[i] = sigma0;
           else sig_vals[i] = 0;
        }
    }

    const eps_vals = new Array(t_vals.length).fill(0);

    let eps = 0;
    let eps_p = 0; 

    for (let i = 0; i < t_vals.length; i++) {
      const sig = sig_vals[i];
      const sig_next = i < t_vals.length - 1 ? sig_vals[i+1] : sig;
      
      if (model === 'hooke') {
        eps = sig / E;
      } else if (model === 'newton') {
        eps += (sig / eta) * dt;
      } else if (model === 'st_venant') {
        if (Math.abs(sig) > fy) {
          eps += Math.sign(sig) * 5 * dt;
        }
      } else if (model === 'prandtl') {
        let e_el = sig / E;
        if (Math.abs(sig) > fy) {
          eps_p += Math.sign(sig) * 5 * dt;
        }
        eps = e_el + eps_p;
      } else if (model === 'maxwell') {
        let dsig = sig_next - sig;
        eps += dsig / E + (sig / eta) * dt;
      } else if (model === 'kelvin') {
        eps += ((sig - E * eps) / eta) * dt;
      }
      
      eps_vals[i] = eps;
    }

    return {
      t_labels: _tLabels,
      sigData: sig_vals,
      epsData: eps_vals,
      sigEpsData: eps_vals.map((e, i) => ({ x: e, y: sig_vals[i] }))
    };
  }, [model, E, eta, fy, sigma0, stressProfile]);

  const sharedOptions = {
    responsive: true, 
    maintainAspectRatio: false,
    elements: {
      line: { borderWidth: 2, tension: 0.1 },
      point: { radius: 0 }
    },
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { color: 'rgba(0,0,0,0.05)' } },
      y: { grid: { color: 'rgba(0,0,0,0.05)' } }
    }
  };

  const sigChartData = {
    labels: t_labels,
    datasets: [{
      label: 'Spannung (MPa)',
      data: sigData,
      borderColor: '#A3113E',
      backgroundColor: 'rgba(163, 17, 62, 0.1)',
      fill: true
    }]
  };

  const epsChartData = {
    labels: t_labels,
    datasets: [{
      label: 'Dehnung',
      data: epsData,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true
    }]
  };

  const sigEpsChartData = {
    datasets: [{
        label: 'σ-ε',
        data: sigEpsData,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)'
    }]
  };

  const infos = {
    hooke: { name: 'Hooke', desc: 'Reinelastisch' },
    newton: { name: 'Newton', desc: 'Flüssig' },
    st_venant: { name: 'St. Venant', desc: 'Plastisch' },
    prandtl: { name: 'Prandtl', desc: 'Elasto-Plastisch' },
    maxwell: { name: 'Maxwell', desc: 'Visko-Elastisch' },
    kelvin: { name: 'Kelvin', desc: 'Verzögert Elastisch' },
  };

  return (
    <div className="bg-white border-y border-home-grau/20 -mx-4 sm:mx-0 sm:rounded-3xl sm:border flex flex-col pt-8 mt-12 mb-8 relative overflow-hidden shadow-sm">
      
      {/* Background Decorator */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#A3113E]/5 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/4"></div>

      <div className="px-4 md:px-8 flex flex-col gap-8 pb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text-main">Simulation Rheologischer Modelle</h2>
          <p className="text-text-main/60 text-sm mt-1">Stelle Belastungen ein und beobachte das Materialverhalten interaktiv.</p>
        </div>
        
        {/* Model Selector */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(infos) as Array<keyof typeof infos>).map(m => (
            <button
              key={m}
              onClick={() => setModel(m)}
              className={\`px-5 py-3 rounded-2xl text-left transition-all duration-300 \${
                model === m 
                  ? 'bg-text-main text-white shadow-md scale-105' 
                  : 'bg-off-white text-text-main border border-home-grau/20 hover:border-text-main hover:bg-white'
              }\`}
            >
              <div className="text-sm font-bold">{infos[m].name}</div>
              <div className={\`text-[11px] mt-0.5 \${model === m ? 'text-white/70' : 'text-text-main/50'}\`}>{infos[m].desc}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 mt-4">
          
          <div className="xl:col-span-4 flex flex-col gap-6">
            <h3 className="font-bold text-text-main uppercase tracking-widest text-xs flex items-center gap-2">
              Einwirkungen
            </h3>
            
            {/* Diagram Inputs */}
            <div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <button 
                  onClick={() => setStressProfile('kriechen')} 
                  className={\`flex flex-col items-center justify-center py-4 border rounded-2xl transition-all \${stressProfile === 'kriechen' ? 'border-shiraz bg-shiraz/5 text-shiraz font-bold shadow-sm' : 'border-home-grau/20 text-text-main/60 bg-off-white hover:bg-white'}\`}
                >
                  <div className="w-8 h-4 border-t-2 border-r-2 border-l-2 border-b-0 mb-2 border-current"></div>
                  <span className="text-[10px] uppercase tracking-wider">Kriechen</span>
                </button>
                <button 
                  onClick={() => setStressProfile('dreieck')} 
                  className={\`flex flex-col items-center justify-center py-4 border rounded-2xl transition-all \${stressProfile === 'dreieck' ? 'border-shiraz bg-shiraz/5 text-shiraz font-bold shadow-sm' : 'border-home-grau/20 text-text-main/60 bg-off-white hover:bg-white'}\`}
                >
                  <svg width="32" height="16" viewBox="0 0 32 16" className="mb-2 fill-none stroke-current" strokeWidth="2" strokeLinejoin="round"><path d="M 0 16 L 16 2 L 32 16" /></svg>
                  <span className="text-[10px] uppercase tracking-wider">Dreieck</span>
                </button>
                <button 
                  onClick={() => setStressProfile('sinus')} 
                  className={\`flex flex-col items-center justify-center py-4 border rounded-2xl transition-all \${stressProfile === 'sinus' ? 'border-shiraz bg-shiraz/5 text-shiraz font-bold shadow-sm' : 'border-home-grau/20 text-text-main/60 bg-off-white hover:bg-white'}\`}
                >
                  <svg width="32" height="16" viewBox="0 0 32 16" className="mb-2 fill-none stroke-current" strokeWidth="2"><path d="M 0 16 Q 8 2 16 9 T 32 0" /></svg>
                  <span className="text-[10px] uppercase tracking-wider">Zyklisch</span>
                </button>
              </div>

              <div className="space-y-5 bg-white p-6 rounded-3xl border border-home-grau/20 shadow-sm">
                <Slider label={<FormulaText text="Spannung \\sigma_0" />} min={1} max={20} step={1} value={sigma0} unit="MPa" onChange={e => setSigma0(Number(e.target.value))} />
                
                {(model === 'hooke' || model === 'prandtl' || model === 'maxwell' || model === 'kelvin') && (
                  <Slider label={<FormulaText text="E-Modul E" />} min={1} max={50} step={1} value={E} unit="MPa" onChange={e => setE(Number(e.target.value))} />
                )}
                {(model === 'newton' || model === 'maxwell' || model === 'kelvin') && (
                  <Slider label={<FormulaText text="Viskosität \\eta" />} min={5} max={100} step={5} value={eta} unit="MPa·s" onChange={e => setEta(Number(e.target.value))} />
                )}
                {(model === 'st_venant' || model === 'prandtl') && (
                  <Slider label={<FormulaText text="Fließgrenze f_y" />} min={1} max={20} step={1} value={fy} unit="MPa" onChange={e => setFy(Number(e.target.value))} />
                )}
              </div>
            </div>

            <div className="mt-4 p-8 bg-text-main text-white rounded-3xl flex flex-col justify-center items-center shadow-md relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -z-0 -translate-y-1/2 translate-x-1/2"></div>
              <h4 className="text-[10px] uppercase tracking-widest leading-none text-white/50 mb-6 font-bold z-10">Struktur</h4>
              <div className="text-[#ffb5c6] scale-[1.3] origin-center z-10">
                {model === 'hooke' && <svg width="100" height="40" viewBox="0 0 100 40"><HookeShape x={0} y={0} /></svg>}
                {model === 'newton' && <svg width="100" height="40" viewBox="0 0 100 40"><NewtonShape x={0} y={0} /></svg>}
                {model === 'st_venant' && <svg width="100" height="40" viewBox="0 0 100 40"><StVenantShape x={0} y={0} /></svg>}
                {model === 'prandtl' && <svg width="200" height="40" viewBox="0 0 200 40"><HookeShape x={0} y={0} /><StVenantShape x={100} y={0} /></svg>}
                {model === 'maxwell' && <svg width="200" height="40" viewBox="0 0 200 40"><HookeShape x={0} y={0} /><NewtonShape x={100} y={0} /></svg>}
                {model === 'kelvin' && (
                  <svg width="160" height="90" viewBox="0 0 160 90">
                    <path d="M 0 45 L 30 45 M 30 15 L 30 75 M 130 15 L 130 75 M 130 45 L 160 45" className="stroke-current" strokeWidth="2" fill="none" />
                    <HookeShape x={30} y={-5} /> 
                    <NewtonShape x={30} y={55} />
                  </svg>
                )}
              </div>
            </div>
          </div>


          <div className="xl:col-span-8 flex flex-col gap-6">
            <h3 className="font-bold text-text-main uppercase tracking-widest text-xs flex items-center gap-2">
              Ergebnisse
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="h-[280px] bg-white border border-home-grau/20 shadow-sm rounded-3xl p-5 flex flex-col group transition-shadow hover:shadow-md">
                <div className="text-xs font-bold text-shiraz uppercase tracking-wider mb-4 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-shiraz"></div> Spannung &sigma;(t) / Zeit
                </div>
                <div className="grow w-full relative">
                  <Line 
                    data={sigChartData} 
                    options={{
                      ...sharedOptions,
                      scales: {
                        x: { display: false, min: 0, max: 10 },
                        y: { ...sharedOptions.scales.y, min: -20, max: 20 }
                      }
                    }} 
                  />
                </div>
              </div>

              <div className="h-[280px] bg-white border border-home-grau/20 shadow-sm rounded-3xl p-5 flex flex-col group transition-shadow hover:shadow-md">
                <div className="text-xs font-bold text-green-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500"></div> Dehnung &epsilon;(t) / Zeit
                </div>
                <div className="grow w-full relative">
                  <Line 
                    data={epsChartData} 
                    options={{
                      ...sharedOptions,
                      scales: {
                        x: { display: false, min: 0, max: 10 },
                        y: { ...sharedOptions.scales.y, min: -10, max: 10 }
                      }
                    }} 
                  />
                </div>
              </div>
            </div>

            <div className="h-[360px] bg-white border border-home-grau/20 shadow-sm rounded-3xl p-5 flex flex-col mt-2 hover:shadow-md transition-shadow">
              <div className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-blue-500"></div> Spannung &sigma; / Dehnung &epsilon; (Hysterese)
              </div>
              <div className="grow w-full relative">
                <Line 
                  data={sigEpsChartData} 
                  options={{
                    ...sharedOptions,
                    scales: {
                      x: { type: 'linear', position: 'bottom', title: { display: true, text: 'Dehnung ε' }, min: -10, max: 10 },
                      y: { title: { display: true, text: 'Spannung σ (MPa)' }, min: -20, max: 20 }
                    }
                  }} 
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
`

const updatedContent = content.substring(0, startIndex) + newRheology + content.substring(endIndex);
fs.writeFileSync(filePath, updatedContent);
console.log("Replaced RheologySection successfully");

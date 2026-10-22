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
        return (time >= 1 && time < 5) ? sigma0 : 0;
      } else if (stressProfile === 'dreieck') {
        if (time < 1) return 0;
        if (time < 3) return sigma0 * (time - 1) / 2;
        if (time < 5) return sigma0 * (1 - (time - 3) / 2);
        return 0;
      } else if (stressProfile === 'sinus') {
        if (time < 1) return 0;
        if (time < 9) return (sigma0 / 2) * (1 - Math.cos((time - 1) * Math.PI));
        return 0;
      }
      return 0;
    };

    const sig_vals = t_vals.map(get_sigma);
    const eps_vals = new Array(t_vals.length).fill(0);

    let eps = 0;
    let eps_p = 0; // Für elastoplastisch

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

  const sigChartData = {
    labels: t_labels,
    datasets: [{
      label: 'Spannung σ (MPa)',
      data: sigData,
      borderColor: '#A3113E',
      backgroundColor: 'rgba(163, 17, 62, 0.1)',
      fill: true,
      tension: 0.1,
      pointRadius: 0
    }]
  };

  const epsChartData = {
    labels: t_labels,
    datasets: [{
      label: 'Dehnung ε',
      data: epsData,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.1,
      pointRadius: 0
    }]
  };

  const sigEpsChartData = {
    datasets: [{
        label: 'Spannung-Dehnung (σ-ε)',
        data: sigEpsData,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: false,
        tension: 0.1,
        pointRadius: 0
    }]
  };

  const infos = {
    hooke: { name: 'Hooke (Elastisch)', desc: 'Reine Elastizität. Keine bleibenden Verformungen. Dehnung tritt instantan auf.', stoffe: 'Stahl (elastischer Bereich), Glas, trockenes Holz' },
    newton: { name: 'Newton (Viskos)', desc: 'Ideale Flüssigkeit. Verformt sich kontinuierlich unter Last (irreversibel). Keine elastische Rückstellung.', stoffe: 'Wasser, flüssiges Bitumen, Motoröl' },
    st_venant: { name: 'St. Venant (Plastisch)', desc: 'Starr-plastisch. Keine Verformung, bis die Fließgrenze f_y erreicht ist. Dann ungehemmtes Fließen.', stoffe: 'Idealisierter Konstruktionsstahl (Fließplateau), feuchter Ton' },
    prandtl: { name: 'Prandtl (Elasto-Plastisch)', desc: 'Reihenschaltung aus Hooke und St. Venant. Elastisch bis zur Fließgrenze, danach plastisches Fließen.', stoffe: 'Baustahl (S235, S355), Aluminiumlegierungen (Näherung)' },
    maxwell: { name: 'Maxwell (Visko-Elastisch)', desc: 'Reihenschaltung aus Hooke und Newton. Zeigt spontane elastische Dehnung und zeitabhängiges, irreversibles Kriechen.', stoffe: 'Frischbeton, Asphalt (kurze harte Stöße elastisch, lange Dauerlast fließend)' },
    kelvin: { name: 'Kelvin-Voigt (Kriechen)', desc: 'Parallelschaltung aus Hooke und Newton. Asymptotisches Kriechen (verzögerte Elastizität). Komplette Rückstellung nach Entlastung.', stoffe: 'Festbeton (Kriechen unter Dauerlast), Holz, Kunststoffe/Polymere' },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 mt-8">
      <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
        <Timer className="text-shiraz" /> Rheologische Modelle
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">
        {(Object.keys(infos) as Array<keyof typeof infos>).map(m => (
          <button
            key={m}
            className={\`px-3 py-2 text-sm rounded-xl font-medium transition-colors \${model === m ? 'bg-shiraz text-white' : 'bg-off-white text-text-main hover:bg-home-grau/10 border border-home-grau/20'}\`}
            onClick={() => setModel(m)}
          >
            {infos[m as keyof typeof infos].name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/20">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-2">Struktur & Beschrieb</h3>
            <div className="flex justify-center items-center h-24 bg-white rounded-lg border border-home-grau/20 overflow-hidden text-shiraz mb-4">
              {model === 'hooke' && <svg width="100" height="40" viewBox="0 0 100 40"><HookeShape x={0} y={0} /></svg>}
              {model === 'newton' && <svg width="100" height="40" viewBox="0 0 100 40"><NewtonShape x={0} y={0} /></svg>}
              {model === 'st_venant' && <svg width="100" height="40" viewBox="0 0 100 40"><StVenantShape x={0} y={0} /></svg>}
              {model === 'prandtl' && <svg width="200" height="40" viewBox="0 0 200 40"><HookeShape x={0} y={0} /><StVenantShape x={100} y={0} /></svg>}
              {model === 'maxwell' && <svg width="200" height="40" viewBox="0 0 200 40"><HookeShape x={0} y={0} /><NewtonShape x={100} y={0} /></svg>}
              {model === 'kelvin' && (
                <svg width="160" height="90" viewBox="0 0 160 90">
                  <path d="M 0 45 L 30 45 M 30 15 L 30 75 M 130 15 L 130 75 M 130 45 L 160 45" className="stroke-shiraz" strokeWidth="2" fill="none" />
                  <HookeShape x={30} y={-5} /> 
                  <NewtonShape x={30} y={55} />
                </svg>
              )}
            </div>
            <p className="text-sm text-text-main/80 mb-3">{infos[model].desc}</p>
            <p className="text-[11px] text-home-grau">Typisch: {infos[model].stoffe}</p>
          </div>
          
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/20 flex flex-col gap-4">
             <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Belastung <FormulaText text="\\sigma(t)" /></h3>
             <div className="grid grid-cols-3 gap-2">
               <button onClick={() => setStressProfile('kriechen')} className={\`px-2 py-1.5 text-xs rounded font-medium \${stressProfile === 'kriechen' ? 'bg-shiraz text-white' : 'bg-white border border-home-grau/20 text-home-grau hover:bg-home-grau/10'}\`}>Kriechen</button>
               <button onClick={() => setStressProfile('dreieck')} className={\`px-2 py-1.5 text-xs rounded font-medium \${stressProfile === 'dreieck' ? 'bg-shiraz text-white' : 'bg-white border border-home-grau/20 text-home-grau hover:bg-home-grau/10'}\`}>Dreieck</button>
               <button onClick={() => setStressProfile('sinus')} className={\`px-2 py-1.5 text-xs rounded font-medium \${stressProfile === 'sinus' ? 'bg-shiraz text-white' : 'bg-white border border-home-grau/20 text-home-grau hover:bg-home-grau/10'}\`}>Zyklisch</button>
             </div>
             <Slider label={<FormulaText text="\\sigma_0" />} min={1} max={20} step={1} value={sigma0} unit="MPa" onChange={e => setSigma0(Number(e.target.value))} />
             
             <div className="border-t border-home-grau/20 pt-4 mt-2 grid grid-cols-1 gap-4">
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
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-sm flex flex-col">
              <h3 className="text-sm font-bold text-text-main mb-2">Spannung-Zeit</h3>
              <div className="flex-1 w-full min-h-[220px]">
                <Line 
                  data={sigChartData} 
                  options={{
                    responsive: true, maintainAspectRatio: false,
                    scales: {
                      y: { title: { display: true, text: 'Spannung σ (MPa)' }, beginAtZero: true, suggestedMax: 20 },
                      x: { title: { display: true, text: 'Zeit t (s)' }, min: 0, max: 10 }
                    },
                    plugins: { legend: { display: false } }
                  }} 
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-sm flex flex-col">
              <h3 className="text-sm font-bold text-text-main mb-2">Dehnung-Zeit</h3>
              <div className="flex-1 w-full min-h-[220px]">
                <Line 
                  data={epsChartData} 
                  options={{
                    responsive: true, maintainAspectRatio: false,
                    scales: {
                      y: { title: { display: true, text: 'Dehnung ε' }, beginAtZero: true, suggestedMax: 5 },
                      x: { title: { display: true, text: 'Zeit t (s)' }, min: 0, max: 10 }
                    },
                    plugins: { legend: { display: false } }
                  }} 
                />
              </div>
            </div>

            <div className="md:col-span-2 bg-white p-4 rounded-xl border border-home-grau/20 shadow-sm flex flex-col">
              <h3 className="text-sm font-bold text-text-main mb-2">Kombiniert: Spannung-Dehnung (σ-ε)</h3>
              <div className="flex-1 w-full min-h-[300px]">
                <Line 
                  data={sigEpsChartData} 
                  options={{
                    responsive: true, maintainAspectRatio: false,
                    scales: {
                      y: { title: { display: true, text: 'Spannung σ (MPa)' }, beginAtZero: true, suggestedMax: 20 },
                      x: { type: 'linear', title: { display: true, text: 'Dehnung ε' }, beginAtZero: true, suggestedMax: 5 }
                    },
                    plugins: { legend: { display: false } }
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
`;

const updatedContent = content.substring(0, startIndex) + newRheology + content.substring(endIndex);
fs.writeFileSync(filePath, updatedContent);
console.log("Replaced RheologySection successfully");

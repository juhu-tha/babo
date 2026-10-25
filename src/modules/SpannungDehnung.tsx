import { formatDeZahl } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import '@/src/lib/chartSetup';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { EC2_NA_DE } from '@/src/data/normParams';
import inhalt from '@/content/spannungdehnung/SpannungDehnung.json';
import { MdText } from '@/src/components/inhalt/MdText';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend
);

export default function SpannungDehnung() {
  const [fck, setFck] = useState(30);
  const [stahlSorte, setStahlSorte] = useState<'B500A' | 'B500B'>('B500B');

  // --- BETON BERECHNUNGEN ---
  const betonProps = useMemo(() => {
    // Parabel-Rechteck-Diagramm (Bemessung)
    const fcd = (EC2_NA_DE.alphaCC * fck) / EC2_NA_DE.gammaC; // α_cc = 0,85 (NA DE)
    const fcm = fck + 8;
    const Ecm = 22000 * Math.pow(fcm / 10, 0.3); // MPa
    
    let ec2, ecu2, n;
    if (fck <= 50) {
      ec2 = 2.0;
      ecu2 = 3.5;
      n = 2.0;
    } else {
      ec2 = 2.0 + 0.085 * Math.pow(fck - 50, 0.53);
      ecu2 = 2.6 + 35 * Math.pow((90 - fck) / 100, 4);
      n = 1.4 + 23.4 * Math.pow((90 - fck) / 100, 4);
    }

    // Nichtlineare Berechnung (Wirklichkeit / Verformungsberechnung)
    const ec1 = Math.min(2.8, 0.7 * Math.pow(fcm, 0.31));
    let ecu1 = 3.5;
    if (fck > 50) {
      ecu1 = 2.8 + 27 * Math.pow((90 - fck) / 100, 4);
    }
    const k = 1.05 * Ecm * (ec1 / 1000) / fcm;

    return { fcd, fcm, Ecm, ec2, ecu2, n, ec1, ecu1, k };
  }, [fck]);

  const betonData = useMemo(() => {
    const { fcd, fcm, ec2, ecu2, n, ec1, ecu1, k } = betonProps;
    const step = 0.1;
    const labels = [];
    const dataDesign = [];
    const dataReal = [];
    
    for (let e = 0; e <= 5.0; e += step) {
      labels.push(e.toFixed(1));
      
      // 1. Bemessungsdiagramm (Parabel-Rechteck)
      if (e <= ec2) {
        dataDesign.push(fcd * (1 - Math.pow(1 - e / ec2, n)));
      } else if (e <= ecu2) {
        dataDesign.push(fcd);
      } else {
        dataDesign.push(null);
      }

      // 2. Wirkliches Verhalten (Nichtlinear nach EC2)
      if (e <= ecu1) {
        const eta = e / ec1;
        const num = k * eta - Math.pow(eta, 2);
        const den = 1 + (k - 2) * eta;
        dataReal.push(fcm * (num / den));
      } else {
        dataReal.push(null);
      }
    }

    return {
      labels,
      datasets: [
        {
          type: 'line' as const,
          label: `Bemessung (fcd = ${formatDeZahl(fcd, 1)} MPa)`,
          data: dataDesign,
          borderColor: '#A3113E',
          backgroundColor: '#A3113E',
          borderWidth: 3,
          pointRadius: 0,
          tension: 0.1,
        },
        {
          type: 'line' as const,
          label: `Realverhalten (fcm = ${formatDeZahl(fcm, 1)} MPa)`,
          data: dataReal,
          borderColor: '#10b981', // Emerald 500
          backgroundColor: '#10b981',
          borderWidth: 3,
          borderDash: [5, 5],
          pointRadius: 0,
          tension: 0.1,
        }
      ]
    };
  }, [fck, betonProps]);

  // --- STAHL BERECHNUNGEN ---
  // Betonstahl B500 nach DIN 488-1 / EC2 3.2.7 (idealisiert, bilinear)
  const stahlProps = useMemo(() => {
    const E = 200000; // E_s in MPa
    const fy = 500; // f_yk in MPa
    const k = stahlSorte === 'B500A' ? 1.05 : 1.08; // (f_t/f_y)_k
    const fu = k * fy; // f_tk
    const eu = stahlSorte === 'B500A' ? 25 : 50; // ε_uk in ‰
    const ey = (fy / E) * 1000; // ε_yk in ‰
    const fyd = fy / EC2_NA_DE.gammaS; // 435 MPa
    const eyd = (fyd / E) * 1000; // 2,17 ‰
    const eud = 25; // ε_ud nach NA DE in ‰
    return { E, fy, fu, eu, ey, k, fyd, eyd, eud };
  }, [stahlSorte]);

  const stahlData = useMemo(() => {
    const { E, fy, fu, eu, ey, fyd, eyd, eud } = stahlProps;
    const step = 0.5;
    const labels: string[] = [];
    const dataChar: (number | null)[] = [];
    const dataDesign: (number | null)[] = [];
    for (let e = 0; e <= 55 + 1e-9; e += step) {
      labels.push(formatDeZahl(e, 1));
      // charakteristische Linie: elastisch bis ε_yk, dann linear bis (ε_uk; k·f_yk)
      if (e <= ey) dataChar.push(E * (e / 1000));
      else if (e <= eu) dataChar.push(fy + (fu - fy) * (e - ey) / (eu - ey));
      else dataChar.push(null);
      // Bemessungslinie: elastisch bis ε_yd, dann horizontal f_yd bis ε_ud
      if (e <= eyd) dataDesign.push(E * (e / 1000));
      else if (e <= eud) dataDesign.push(fyd);
      else dataDesign.push(null);
    }
    return {
      labels,
      datasets: [
        {
          type: 'line' as const,
          label: `${stahlSorte} charakteristisch (k = ${formatDeZahl(stahlProps.k, 2)})`,
          data: dataChar,
          borderColor: '#0e558c',
          backgroundColor: '#0e558c',
          borderWidth: 3,
          pointRadius: 0,
          tension: 0,
        },
        {
          type: 'line' as const,
          label: `Bemessung (f_yd = ${formatDeZahl(fyd, 0)} MPa)`,
          data: dataDesign,
          borderColor: '#a3123a',
          backgroundColor: '#a3123a',
          borderWidth: 2,
          borderDash: [6, 4],
          pointRadius: 0,
          tension: 0,
        }
      ]
    };
  }, [stahlSorte, stahlProps]);

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, position: 'top' as const } },
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main">Spannungs-Dehnungs-Diagramme</h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.dasSpannungsDehnungsDiagramm} /><FormulaText text="\sigma-\varepsilon" /><MdText text={inhalt.texte.diagrammBeschreibtDasMechanische} /></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* BETON SECTION */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
          <h3 className="text-lg font-bold text-shiraz flex items-center gap-2">
            <FormulaText text={inhalt.werte.betonDruck} />
            <InfoTooltip text={inhalt.werte.vergleichZwischenDerBemessung} />
          </h3>
          
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
            <Slider 
              label={<FormulaText text={inhalt.werte.charaktDruckfestigkeitFCk} />}
              info={inhalt.werte.zylinderdruckfestigkeitNach28Tagen}
              min={12} max={90} step={1} 
              value={fck} unit="MPa" 
              onChange={(e) => setFck(Number(e.target.value))} 
            />
            <p className="text-[11px] text-slate-500 mt-2"><MdText text={inhalt.texte.hinweisDieFormelnDer} /></p>
            
            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-home-grau/30">
              <div>
                <div className="text-xs text-home-grau font-bold uppercase"><FormulaText text={inhalt.werte.bemessungswertFCd} /></div>
                <div className="text-lg font-bold text-text-main">{formatDeZahl(betonProps.fcd, 1)} MPa</div>
              </div>
              <div>
                <div className="text-xs text-home-grau font-bold uppercase"><FormulaText text={inhalt.werte.mittlereFestigkeitFCm} /></div>
                <div className="text-lg font-bold text-text-main">{formatDeZahl(betonProps.fcm, 1)} MPa</div>
              </div>
              <div>
                <div className="text-xs text-home-grau font-bold uppercase"><FormulaText text={inhalt.werte.eModulECm} /></div>
                <div className="text-lg font-bold text-text-main">{formatDeZahl((betonProps.Ecm / 1000), 1)} GPa</div>
              </div>
              <div>
                <div className="text-xs text-home-grau font-bold uppercase"><FormulaText text="Stauchung \varepsilon_{c2}" /></div>
                <div className="text-lg font-bold text-text-main">{formatDeZahl(betonProps.ec2, 2)} ‰</div>
              </div>
            </div>
          </div>

          <div className="relative w-full" style={{ height: "600px" }}>
            <Chart type="line"
              data={betonData} 
              options={{
                ...commonOptions, 
                scales: { 
                  x: { title: { display: true, text: inhalt.werte.dehnung }, min: 0, max: 5 },
                  y: { title: { display: true, text: inhalt.werte.spannungCMpa }, min: 0, max: 120 } 
                } 
              }} 
            />
          </div>
        </div>

        {/* STAHL SECTION */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
          <h3 className="text-lg font-bold text-middle-blue flex items-center gap-2">
            <FormulaText text="Stahl (Zug)" />
            <InfoTooltip text={inhalt.werte.betonstahlB500NachDin} />
          </h3>
          
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
            <div className="flex gap-2" role="group" aria-label="Betonstahlsorte">
              {(['B500A', 'B500B'] as const).map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStahlSorte(st)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold border cursor-pointer ${stahlSorte === st ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'}`}
                >
                  {st} {st === 'B500A' ? inhalt.werte.normaleDuktilität : inhalt.werte.hoheDuktilität}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-home-grau/30">
              <div>
                <div className="text-xs text-home-grau font-bold uppercase"><FormulaText text={inhalt.werte.streckgrenzeFYk} /></div>
                <div className="text-lg font-bold text-text-main">{formatDeZahl(stahlProps.fy, 0)} MPa</div>
              </div>
              <div>
                <div className="text-xs text-home-grau font-bold uppercase"><FormulaText text={inhalt.werte.zugfestigkeitFTk} /></div>
                <div className="text-lg font-bold text-text-main">{formatDeZahl(stahlProps.fu, 0)} MPa</div>
              </div>
              <div>
                <div className="text-xs text-home-grau font-bold uppercase"><FormulaText text="Fließdehnung \varepsilon_{yk}" /></div>
                <div className="text-lg font-bold text-text-main">{formatDeZahl(stahlProps.ey, 2)} ‰</div>
              </div>
              <div>
                <div className="text-xs text-home-grau font-bold uppercase"><FormulaText text="Dehnung \varepsilon_{uk}" /></div>
                <div className="text-lg font-bold text-text-main">{formatDeZahl(stahlProps.eu, 0)} ‰</div>
              </div>
            </div>
          </div>

          <div className="relative w-full" style={{ height: "600px" }}>
            <Chart type="line" 
              data={stahlData} 
              options={{
                ...commonOptions, 
                scales: { 
                  x: { title: { display: true, text: inhalt.werte.dehnung2 } },
                  y: { title: { display: true, text: inhalt.werte.spannungSMpa }, min: 0, max: 600 } 
                } 
              }} 
            />
          </div>
        </div>
      </div>

    </div>
  );
}

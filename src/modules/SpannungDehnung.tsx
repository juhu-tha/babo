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
import { Slider } from '@/src/components/ui/Slider';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';

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
  const [carbon, setCarbon] = useState(0.2);

  // --- BETON BERECHNUNGEN ---
  const betonProps = useMemo(() => {
    // Parabel-Rechteck-Diagramm (Bemessung)
    const fcd = fck / 1.5;
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
          label: `Bemessung (fcd = ${fcd.toFixed(1)} MPa)`,
          data: dataDesign,
          borderColor: '#A3113E',
          backgroundColor: '#A3113E',
          borderWidth: 3,
          pointRadius: 0,
          tension: 0.1,
        },
        {
          type: 'line' as const,
          label: `Realverhalten (fcm = ${fcm.toFixed(1)} MPa)`,
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
  const stahlProps = useMemo(() => {
    const E = 210000; // MPa
    const fy = 200 + 500 * carbon; // MPa
    const fu = fy * (1.5 - 0.5 * carbon); // MPa
    const eu = 250 - 200 * carbon; // ‰
    const ey = (fy / E) * 1000; // ‰
    const plateauEnd = ey + Math.max(0, (0.4 - carbon) * 50); // Yield plateau length

    return { E, fy, fu, eu, ey, plateauEnd };
  }, [carbon]);

  const stahlData = useMemo(() => {
    const { E, fy, fu, eu, ey, plateauEnd } = stahlProps;
    const step = 2.0; // Größere Schritte wegen großem Dehnungsbereich
    const labels = [];
    const data = [];
    
    for (let e = 0; e <= 250; e += step) {
      labels.push(e.toFixed(0));
      if (e <= ey) {
        // Hookesches Gesetz (linear-elastisch)
        data.push(E * (e / 1000));
      } else if (e <= eu) {
        if (e <= plateauEnd) {
          // Fließbereich (Yield plateau)
          data.push(fy);
        } else {
          // Verfestigungsbereich (Strain hardening)
          const hardeningStrain = e - plateauEnd;
          const hardeningRange = eu - plateauEnd;
          const ratio = hardeningStrain / hardeningRange;
          // Parabel für Verfestigung
          data.push(fy + (fu - fy) * (1 - Math.pow(1 - ratio, 2)));
        }
      } else {
        data.push(null); // Bruch
      }
    }

    return {
      labels,
      datasets: [
        {
          type: 'line' as const,
          label: `Stahl (C = ${carbon.toFixed(2)} %)`,
          data,
          borderColor: '#0e558c',
          backgroundColor: '#0e558c',
          borderWidth: 3,
          pointRadius: 0,
          tension: 0.1,
        }
      ]
    };
  }, [carbon, stahlProps]);

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
          <p>
            Das Spannungs-Dehnungs-Diagramm (<FormulaText text="\sigma-\varepsilon" />-Diagramm) beschreibt das mechanische Verhalten von Baustoffen unter Last. 
            Hier können Sie interaktiv erforschen, wie sich Materialparameter auf das Tragverhalten auswirken.
            Beim Beton wird der Unterschied zwischen dem <strong>Mittelwert-Realverhalten</strong> (für Verformungen) und der abgesicherten <strong>Bemessungskurve</strong> (Parabel-Rechteck) deutlich. 
            Stahl verhält sich zunächst linear-elastisch, beginnt dann zu fließen und verfestigt sich bis zur Bruchdehnung.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* BETON SECTION */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
          <h3 className="text-lg font-bold text-shiraz flex items-center gap-2">
            <FormulaText text="Beton (Druck)" />
            <InfoTooltip text="Vergleich zwischen der Bemessung nach EC2 (Parabel-Rechteck) und dem physikalischen Realverhalten (Nichtlinear)." />
          </h3>
          
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
            <Slider 
              label={<FormulaText text="Charakt. Druckfestigkeit (f_{ck})" />}
              info="Zylinderdruckfestigkeit nach 28 Tagen. Höhere Festigkeit führt zu spröderem Versagen."
              min={12} max={100} step={1} 
              value={fck} unit="MPa" 
              onChange={(e) => setFck(Number(e.target.value))} 
            />
            
            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-home-grau/30">
              <div>
                <div className="text-xs text-home-grau font-bold uppercase"><FormulaText text="Bemessungswert f_{cd}" /></div>
                <div className="text-lg font-bold text-text-main">{betonProps.fcd.toFixed(1)} MPa</div>
              </div>
              <div>
                <div className="text-xs text-home-grau font-bold uppercase"><FormulaText text="Mittlere Festigkeit f_{cm}" /></div>
                <div className="text-lg font-bold text-text-main">{betonProps.fcm.toFixed(1)} MPa</div>
              </div>
              <div>
                <div className="text-xs text-home-grau font-bold uppercase"><FormulaText text="E-Modul E_{cm}" /></div>
                <div className="text-lg font-bold text-text-main">{(betonProps.Ecm / 1000).toFixed(1)} GPa</div>
              </div>
              <div>
                <div className="text-xs text-home-grau font-bold uppercase"><FormulaText text="Stauchung \varepsilon_{c2}" /></div>
                <div className="text-lg font-bold text-text-main">{betonProps.ec2.toFixed(2)} ‰</div>
              </div>
            </div>
          </div>

          <div className="relative w-full" style={{ height: "600px" }}>
            <Chart type="line"
              data={betonData} 
              options={{
                ...commonOptions, 
                scales: { 
                  x: { title: { display: true, text: 'Dehnung ε (‰)' }, min: 0, max: 5 },
                  y: { title: { display: true, text: 'Spannung σ_c (MPa)' }, min: 0, max: 120 } 
                } 
              }} 
            />
          </div>
        </div>

        {/* STAHL SECTION */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
          <h3 className="text-lg font-bold text-middle-blue flex items-center gap-2">
            <FormulaText text="Stahl (Zug)" />
            <InfoTooltip text="Idealisiertes Verhalten in Abhängigkeit vom Kohlenstoffgehalt." />
          </h3>
          
          <div className="bg-off-white p-5 rounded-xl border border-home-grau/30">
            <Slider 
              label="Kohlenstoffgehalt (C)" 
              info="Mehr Kohlenstoff erhöht die Festigkeit (Streckgrenze, Zugfestigkeit), verringert aber die Duktilität (Bruchdehnung)."
              min={0.05} max={0.80} step={0.01} 
              value={carbon} unit="%" 
              onChange={(e) => setCarbon(Number(e.target.value))} 
            />
            
            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-home-grau/30">
              <div>
                <div className="text-xs text-home-grau font-bold uppercase"><FormulaText text="Streckgrenze f_y" /></div>
                <div className="text-lg font-bold text-text-main">{stahlProps.fy.toFixed(0)} MPa</div>
              </div>
              <div>
                <div className="text-xs text-home-grau font-bold uppercase"><FormulaText text="Zugfestigkeit f_u" /></div>
                <div className="text-lg font-bold text-text-main">{stahlProps.fu.toFixed(0)} MPa</div>
              </div>
              <div>
                <div className="text-xs text-home-grau font-bold uppercase"><FormulaText text="Fließdehnung \varepsilon_y" /></div>
                <div className="text-lg font-bold text-text-main">{stahlProps.ey.toFixed(2)} ‰</div>
              </div>
              <div>
                <div className="text-xs text-home-grau font-bold uppercase"><FormulaText text="Bruchdehnung \varepsilon_u" /></div>
                <div className="text-lg font-bold text-text-main">{stahlProps.eu.toFixed(0)} ‰</div>
              </div>
            </div>
          </div>

          <div className="relative w-full" style={{ height: "600px" }}>
            <Chart type="line" 
              data={stahlData} 
              options={{
                ...commonOptions, 
                scales: { 
                  x: { title: { display: true, text: 'Dehnung ε (‰)' }, min: 0, max: 250 },
                  y: { title: { display: true, text: 'Spannung σ_s (MPa)' }, min: 0, max: 1000 } 
                } 
              }} 
            />
          </div>
        </div>
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Spannungs-Dehnungs-Diagramm', url: 'https://de.wikipedia.org/wiki/Spannungs-Dehnungs-Diagramm' }
        ]}
        regelwerke={[
          { title: 'DIN EN 1992-1-1:2023-08 (Eurocode 2: Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken - Allgemeine Regeln)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1992-1-1' },
          { title: 'DIN EN 1992-1-1:2023-08 Abschnitt 5.1.5 (Parabel-Rechteck-Diagramm für Querschnittsbemessung)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1992-1-1' },
          { title: 'DIN EN 1992-1-1:2023-08 Abschnitt 5.1.4 (Nichtlineare Spannungs-Dehnungs-Beziehung des Betons)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1992-1-1' },
          { title: 'DIN 488-1:2009-08 / DIN EN 1992-1-1:2023-08 Abschnitt 5.2 (Betonstahl - Eigenschaften und Kennwerte)', url: 'https://www.dinmedia.de/de/suche?q=DIN+488-1' }
        ]}
        literatur={[
          'Zilch, K.; Zehetmaier, G. (2010): Bemessung im Konstruktiven Betonbau (Springer-Verlag)',
          'Bargel, H. J.; Schulze, G. (2012): Werkstoffkunde (Springer Vieweg)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        formeln={[
          {
            formel: '\\sigma_c = f_{cd} \\cdot \\left[ 1 - \\left(1 - \\frac{\\varepsilon_c}{\\varepsilon_{c2}}\\right)^n \\right]',
            erklaerung: 'Bemessungsmodell Beton (Parabel-Rechteck-Diagramm nach Eurocode 2): σc ist die Betonspannung, fcd der Bemessungswert der Betondruckfestigkeit, εc2 die Dehnung bei Höchstspannung (2.0 ‰ für fck ≤ 50 MPa) und n der Exponent (2.0 für fck ≤ 50 MPa).',
            quelle: 'DIN EN 1992-1-1 Abs. 3.1.5'
          },
          {
            formel: '\\frac{\\sigma_c}{f_{cm}} = \\frac{k \\cdot \\eta - \\eta^2}{1 + (k - 2)\\eta}',
            erklaerung: 'Nichtlineares Spannungs-Dehnungs-Modell für Verformungsberechnungen nach EC2: η = εc / εc1, k = 1.05 · Ecm · |εc1| / fcm mit Sekantenmodul Ecm.',
            quelle: 'DIN EN 1992-1-1 Gl. (3.14)'
          },
          {
            formel: '\\sigma_s = E_s \\cdot \\varepsilon_s \\quad (\\varepsilon_s \\le \\varepsilon_{yd})',
            erklaerung: 'Hookesches Gesetz für Betonstahl im linear-elastischen Bereich mit Es = 200.000 MPa bzw. 210.000 MPa (Praxiswert für Baustahl) bis zur Streckgrenze fyd.',
            quelle: 'DIN EN 1992-1-1 Abs. 3.2'
          }
        ]}
      />
    </div>
  );
}

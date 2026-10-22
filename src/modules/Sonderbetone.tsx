import React, { useState } from 'react';
import { Layers, Droplets, Droplet, Recycle, ShieldAlert, Waves, Box, Target, Zap, Circle, Weight, Package, ArrowDown, Construction, MoveDown } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import Leichtbeton from './Leichtbeton';
import Sichtbeton from './Sichtbeton';
import Spritzbeton from './Spritzbeton';
import Recyclingbeton from './Recyclingbeton';
import UHPC from './UHPC';
import Draenbeton from './Draenbeton';
import Faserbeton from './Faserbeton';
import Schleuderbeton from './Schleuderbeton';
import UwBeton from './UwBeton';
import Infraleichtbeton from './Infraleichtbeton';
import SVB from './SVB';
import Schwerbeton from './Schwerbeton';
import Massenbeton from './Massenbeton';
import Pumpbeton from './Pumpbeton';
import Bohrpfahlbeton from './Bohrpfahlbeton';

export default function Sonderbetone() {
  const [activeTab, setActiveTab] = useState<'Leichtbeton' | 'Sichtbeton' | 'Spritzbeton' | 'Recyclingbeton' | 'UHPC' | 'Draenbeton' | 'Faserbeton' | 'Schleuderbeton' | 'UwBeton' | 'Infraleichtbeton' | 'SVB' | 'Schwerbeton' | 'Massenbeton' | 'Pumpbeton' | 'Bohrpfahlbeton'>('Leichtbeton');

  const options = [
    { value: 'Leichtbeton', label: 'Leichtbeton', icon: Box },
    { value: 'Infraleichtbeton', label: 'Infraleichtbeton', icon: Package },
    { value: 'Sichtbeton', label: 'Sichtbeton', icon: Layers },
    { value: 'Spritzbeton', label: 'Spritzbeton', icon: Droplet },
    { value: 'Recyclingbeton', label: 'RC-Beton', icon: Recycle },
    { value: 'UHPC', label: 'UHPC', icon: Target },
    { value: 'Draenbeton', label: 'Dränbeton', icon: Droplets },
    { value: 'Faserbeton', label: 'Faserbeton', icon: ShieldAlert },
    { value: 'Schleuderbeton', label: 'Schleuderbeton', icon: Zap },
    { value: 'UwBeton', label: 'Unterwasserbeton', icon: Waves },
    { value: 'SVB', label: 'SVB (Selbstverdichtend)', icon: MoveDown },
    { value: 'Schwerbeton', label: 'Schwerbeton', icon: Weight },
    { value: 'Massenbeton', label: 'Massenbeton', icon: Box },
    { value: 'Pumpbeton', label: 'Pumpbeton', icon: Circle },
    { value: 'Bohrpfahlbeton', label: 'Bohrpfahlbeton', icon: Construction }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /> Sonderbetone &amp; Spezialanwendungen
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 mb-6 leading-relaxed">
          <p>
            Systematische Werkstoffanalyse für 15 spezielle Betonsorten: Von gefügeoptimiertem Leicht- und Schwerbeton über Sichtbetonklassen (SB 1–4) und Spritzbeton bis hin zu Ultra-Hochleistungsbeton (UHPC) und kreislaufgerechtem RC-Beton.
          </p>
        </div>

        <h3 className="block text-xs font-bold text-text-main/70 mb-3 uppercase tracking-wider">
          Sonderbeton-Verfahren auswählen
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {options.map((opt) => {
            const Icon = (opt as any).icon;
            const isActive = activeTab === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setActiveTab(opt.value as any)}
                className={"flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-xs text-center gap-2 cursor-pointer " + (
                  isActive 
                    ? "border-shiraz bg-shiraz text-white shadow-md scale-[1.02]" 
                    : "border-home-grau/30 bg-off-white text-text-main hover:border-shiraz/50 hover:bg-shiraz/5 hover:scale-[1.01]"
                )}
              >
                <Icon size={22} className={isActive ? "text-white" : "text-shiraz/80"} strokeWidth={isActive ? 2.5 : 2} />
                <span className="font-semibold leading-tight">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
      {activeTab === 'Leichtbeton' && (
        <Leichtbeton />
      )}
      {activeTab === 'Sichtbeton' && (
        <Sichtbeton />
      )}
      {activeTab === 'Spritzbeton' && (
        <Spritzbeton />
      )}
      {activeTab === 'Recyclingbeton' && (
        <Recyclingbeton />
      )}
      {activeTab === 'UHPC' && (
        <UHPC />
      )}
      {activeTab === 'Draenbeton' && (
        <Draenbeton />
      )}
      {activeTab === 'Faserbeton' && (
        <Faserbeton />
      )}
      {activeTab === 'Schleuderbeton' && (
        <Schleuderbeton />
      )}
      {activeTab === 'UwBeton' && (
        <UwBeton />
      )}
      {activeTab === 'Infraleichtbeton' && (
        <Infraleichtbeton />
      )}
      {activeTab === 'SVB' && (
        <SVB />
      )}
      {activeTab === 'Schwerbeton' && (
        <Schwerbeton />
      )}
      {activeTab === 'Massenbeton' && (
        <Massenbeton />
      )}
      {activeTab === 'Pumpbeton' && (
        <Pumpbeton />
      )}
      {activeTab === 'Bohrpfahlbeton' && (
        <Bohrpfahlbeton />
      )}
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Sonderbeton' },
          { title: 'Leichtbeton', url: 'https://de.wikipedia.org/wiki/Leichtbeton' },
          { title: 'Selbstverdichtender Beton', url: 'https://de.wikipedia.org/wiki/Selbstverdichtender_Beton' },
          { title: 'Faserbeton', url: 'https://de.wikipedia.org/wiki/Faserbeton' }
        ]}
        literatur={[
          'Grübl, P.; Weigler, H.; Siebel, E.: Beton: Arten, Herstellung und Eigenschaften (Ernst & Sohn)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton: Festlegung, Eigenschaften, Herstellung und Konformität)' },
          { title: 'DAfStb-Richtlinie Selbstverdichtender Beton (SVB):2012-11', url: 'https://www.dafstb.de/' },
          { title: 'DAfStb-Richtlinie Stahlfaserbeton:2021-06', url: 'https://www.dafstb.de/' },
          { title: 'DBV-Merkblatt Sichtbeton:2015-06', url: 'https://www.betonverein.de/' }
        ]}
        formeln={[
          {
            formel: '\\rho_{\\text{dry}} = \\frac{m_{\\text{dry}}}{V} \\le 2000 \\quad [\\text{kg/m}^3] \\quad (\\text{Leichtbeton})',
            erklaerung: 'Trockenrohdichtekriterium für Leichtbeton nach DIN EN 206 (Rohdichteklassen D1,0 bis D2,0) unter Verwendung poröser Gesteinskörnungen (Blähton, Bims).',
            quelle: 'DIN EN 206 Abs. 4.3'
          },
          {
            formel: 'f_{ctk,fl} = \\alpha_{fl} \\cdot f_{ctk,ax} \\quad [\\text{N/mm}^2], \\quad f_{R,1k} \\dots f_{R,4k}',
            erklaerung: 'Charakteristische Biegezug- und Nachrisszugfestigkeiten (Residual Flexural Strengths) von Stahlfaserbeton zur Bemessung tragender Bauteile.',
            quelle: 'DAfStb-Richtlinie Stahlfaserbeton'
          }
        ]}
      />
    </div>
  );
}

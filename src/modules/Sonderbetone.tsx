import type { LucideIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Layers, Droplets, Droplet, Recycle, ShieldAlert, Waves, Box, Target, Zap, Circle, Weight, Package, Construction, MoveDown } from 'lucide-react';
import { GruppierteModuleTabs, type ModulTabGruppe } from '@/src/components/ui/GruppierteModuleTabs';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import Leichtbeton from './Leichtbeton';
import { Querverweis } from '@/src/components/ui/Querverweis';
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
import inhalt from '@/content/sonderbetone/Sonderbetone.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function Sonderbetone() {
  const [activeTab, setActiveTab] = useState<'Leichtbeton' | 'Sichtbeton' | 'Spritzbeton' | 'Recyclingbeton' | 'UHPC' | 'Draenbeton' | 'Faserbeton' | 'Schleuderbeton' | 'UwBeton' | 'Infraleichtbeton' | 'SVB' | 'Schwerbeton' | 'Massenbeton' | 'Pumpbeton' | 'Bohrpfahlbeton'>('Leichtbeton');

  const options: { value: typeof activeTab; label: string; icon: LucideIcon }[] = [
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
    { value: 'SVB', label: inhalt.werte.svbSelbstverdichtend, icon: MoveDown },
    { value: 'Schwerbeton', label: 'Schwerbeton', icon: Weight },
    { value: 'Massenbeton', label: 'Massenbeton', icon: Box },
    { value: 'Pumpbeton', label: 'Pumpbeton', icon: Circle },
    { value: 'Bohrpfahlbeton', label: 'Bohrpfahlbeton', icon: Construction }
  ];

  const GRUPPEN = [
    { titel: 'Rohdichte', werte: ['Leichtbeton', 'Infraleichtbeton', 'Schwerbeton'] },
    { titel: 'Verarbeitung', werte: ['SVB', 'Pumpbeton', 'Spritzbeton', 'UwBeton', 'Schleuderbeton'] },
    { titel: 'Leistungsbeton', werte: ['UHPC', 'Faserbeton'] },
    { titel: 'Bauteile', werte: ['Massenbeton', 'Bohrpfahlbeton', 'Draenbeton'] },
    { titel: inhalt.werte.nachhaltigkeitOptik, werte: ['Recyclingbeton', 'Sichtbeton'] },
  ];

  // AP 2.8/3.8: 15 Verfahren in 5 Themengruppen (zweistufige Reiter statt Kachelraster)
  const REITER_GRUPPEN: ModulTabGruppe<typeof activeTab>[] = GRUPPEN.map(g => ({
    id: g.titel,
    label: g.titel,
    mitglieder: options.filter(o => g.werte.includes(o.value)).map(o => ({ id: o.value, label: o.label, icon: o.icon })),
  }));

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /><MdText text={inhalt.texte.sonderbetoneSpezialanwendungen} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p><MdText text={inhalt.texte.systematischeWerkstoffanalyseFür15} /></p>
        </div>
      </div>

      <GruppierteModuleTabs label={inhalt.texte.sonderbetonVerfahrenAuswählen} gruppen={REITER_GRUPPEN} aktiv={activeTab} onWechsel={setActiveTab} className="[&_[role=tabpanel]_[role=tabpanel]]:mt-6">
      {activeTab === 'Leichtbeton' && (
        <Leichtbeton />
      )}
      {activeTab === 'Sichtbeton' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <Querverweis ebene={3} ziel="sichtbeton" titel={inhalt.werte.sichtbetonEigenesModul} linkText={inhalt.werte.zumModulSichtbetonSb}>
            <p><MdText text={inhalt.texte.sichtbetonIstKeinEigener} /></p>
            <p><MdText text={inhalt.texte.maßgebendSindSchalungUnd} /></p>
          </Querverweis>
        </div>
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
      </GruppierteModuleTabs>

      <FormulaDerivationBox
        title={inhalt.werte.anwendungsbeispielEModulVon}
        zielGleichung="E_{lcm} = \eta_E \cdot E_{cm}, \quad \eta_E = (\rho / 2200)^2"
        normQuelle={inhalt.werte.dinEn19921}
        schritte={inhalt.daten["Sonderbetone.schritte"]}
        ergebnisHinweis={inhalt.werte.e053E}
      />

      <FormulaDerivationBox
        title={inhalt.werte.anwendungsbeispielMehrwasserBeiRc}
        zielGleichung="\Delta w = a_{RC} \cdot m_g \cdot WA_{24}"
        normQuelle={inhalt.werte.lehrwerteZulässigeAnteileNach}
        schritte={inhalt.daten["Sonderbetone.schritte_2"]}
        ergebnisHinweis={inhalt.werte.rund225Kg}
      />

      <FormulaDerivationBox
        title={inhalt.werte.anwendungsbeispielHohlraumgehaltVonDränb}
        zielGleichung="V_{Hohlraum} = 1000 - \frac{z}{\rho_z} - \frac{w}{\rho_w} - \frac{g}{\rho_g}"
        normQuelle={inhalt.werte.stoffraumrechnungLehrwerte}
        schritte={inhalt.daten["Sonderbetone.schritte_3"]}
        ergebnisHinweis={inhalt.werte.rund24HohlraumVoraussetzung}
      />

      <FormulaDerivationBox
        title={inhalt.werte.anwendungsbeispielSvbMitFlugasche}
        zielGleichung="(w/z)_{eq} = \frac{w}{z + 0{,}4 \cdot f_{anr}}, \quad f_{anr} \le 0{,}33 \cdot z"
        normQuelle={inhalt.werte.din10452Anrechnung}
        schritte={inhalt.daten["Sonderbetone.schritte_4"]}
        ergebnisHinweis={inhalt.werte.wZEq0}
      />

      <FormulaDerivationBox
        title={inhalt.werte.anwendungsbeispielIstEsSchwerbeton}
        zielGleichung="\rho = \frac{m_z + m_w + m_g}{V} > 2600\,\text{kg/m}^3"
        normQuelle={inhalt.werte.dinEn206Schwerbeton}
        schritte={inhalt.daten["Sonderbetone.schritte_5"]}
        ergebnisHinweis={inhalt.werte.rund3300Kg}
      />

      <ModulTest moduleId="sonderbetone" />

      <ModuleFooter
        weblinks={[
          { title: inhalt.werte.betonWikiLeichtbeton, url: 'https://beton.wiki/index.php?title=Leichtbeton' },
          { title: inhalt.werte.betonWikiInfraleichtbeton, url: 'https://beton.wiki/index.php?title=Infraleichtbeton' },
          { title: inhalt.werte.vereinDeutscherZementwerkeVdz, url: 'https://www.vdz-online.de/wissensportal/publikationen/zement-taschenbuch-2008' },
          { title: inhalt.werte.betonWikiSpritzbeton, url: 'https://beton.wiki/index.php?title=Spritzbeton' },
          { title: inhalt.werte.betonWikiUhpc, url: 'https://beton.wiki/index.php?title=UHPC' },
          { title: inhalt.werte.betonWikiDränbeton, url: 'https://beton.wiki/index.php?title=Dr%C3%A4nbeton' },
          { title: inhalt.werte.betonWikiFaserbeton, url: 'https://beton.wiki/index.php?title=Faserbeton' },
          { title: inhalt.werte.betonWikiSchleuderbeton, url: 'https://beton.wiki/index.php?title=Schleuderbeton' },
          { title: inhalt.werte.betonWikiUnterwasserbeton, url: 'https://beton.wiki/index.php?title=Unterwasserbeton' },
          { title: inhalt.werte.betonWikiSvb, url: 'https://beton.wiki/index.php?title=Selbstverdichtender_Beton' },
          { title: inhalt.werte.betonWikiSchwerbeton, url: 'https://beton.wiki/index.php?title=Schwerbeton' },
          { title: inhalt.werte.betonWikiMassigeBauteile, url: 'https://beton.wiki/index.php?title=Massige_Bauteile' },
          { title: inhalt.werte.betonWikiPumpbeton, url: 'https://beton.wiki/index.php?title=Pumpbeton' }
        ]}
        wikipedia={[
          { title: 'Leichtbeton', url: 'https://de.wikipedia.org/wiki/Leichtbeton' },
          { title: 'Porenbeton', url: 'https://de.wikipedia.org/wiki/Porenbeton' },
          { title: 'Spritzbeton', url: 'https://de.wikipedia.org/wiki/Spritzbeton' },
          { title: inhalt.werte.neueÖsterreichischeTunnelbaumethode, url: 'https://de.wikipedia.org/wiki/Neue_%C3%96sterreichische_Tunnelbaumethode' },
          { title: 'Recyclingbeton', url: 'https://de.wikipedia.org/wiki/Recyclingbeton' },
          { title: 'Bauschutt', url: 'https://de.wikipedia.org/wiki/Bauschutt' },
          { title: inhalt.werte.ultrahochfesterBeton, url: 'https://de.wikipedia.org/wiki/Ultrahochfester_Beton' },
          { title: 'Silikastaub', url: 'https://de.wikipedia.org/wiki/Silikastaub' },
          { title: 'Dränbeton', url: 'https://de.wikipedia.org/wiki/Dr%C3%A4nbeton' },
          { title: 'Versickerung', url: 'https://de.wikipedia.org/wiki/Versickerung' },
          { title: 'Faserbeton', url: 'https://de.wikipedia.org/wiki/Faserbeton' },
          { title: 'Stahlfaserbeton', url: 'https://de.wikipedia.org/wiki/Stahlfaserbeton' },
          { title: 'Schleuderbeton', url: 'https://de.wikipedia.org/wiki/Schleuderbeton' },
          { title: 'Zentrifugalkraft', url: 'https://de.wikipedia.org/wiki/Zentrifugalkraft' },
          { title: 'Unterwasserbeton', url: 'https://de.wikipedia.org/wiki/Unterwasserbeton' },
          { title: inhalt.werte.hydrostatischerDruck, url: 'https://de.wikipedia.org/wiki/Hydrostatischer_Druck' },
          { title: inhalt.werte.selbstverdichtenderBeton, url: 'https://de.wikipedia.org/wiki/Selbstverdichtender_Beton' },
          { title: 'Rheologie', url: 'https://de.wikipedia.org/wiki/Rheologie' },
          { title: 'Schwerbeton', url: 'https://de.wikipedia.org/wiki/Schwerbeton' },
          { title: 'Strahlenschutz', url: 'https://de.wikipedia.org/wiki/Strahlenschutz' },
          { title: 'Walzbeton', url: 'https://de.wikipedia.org/wiki/Walzbeton' },
          { title: 'Betonpumpe', url: 'https://de.wikipedia.org/wiki/Betonpumpe' },
          { title: 'Hagen-Poiseuille-Gesetz', url: 'https://de.wikipedia.org/wiki/Gesetz_von_Hagen-Poiseuille' },
          { title: 'Bohrpfahl', url: 'https://de.wikipedia.org/wiki/Bohrpfahl' },
          { title: 'Spezialtiefbau', url: 'https://de.wikipedia.org/wiki/Spezialtiefbau' }
        ]}
        regelwerke={inhalt.daten["Sonderbetone.regelwerke"]}
        literatur={inhalt.daten["Sonderbetone.literatur"]}
        formeln={inhalt.daten["Sonderbetone.formeln"]}
      />
    </div>
  );
}

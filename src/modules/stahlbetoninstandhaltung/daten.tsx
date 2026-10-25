// Ausgelagert aus src/modules/Stahlbetoninstandhaltung.tsx (AP 5.2)
import { Shield, Wrench, Droplets, Activity } from 'lucide-react';
import { erf } from './hilfen';
import inhalt from '@/content/stahlbetoninstandhaltung/daten.json';

export const szenarien = inhalt.daten.szenarien;

export const riliSibPrinzipien = [
  {
    id: 'W',
    title: inhalt.werte.prinzipWWassergehalt,
    desc: inhalt.werte.absenkungDesWassergehaltsIm,
    details: inhalt.werte.wirdOftDurchOberflächenschutzsysteme,
    icon: <Droplets className="text-blue-500" size={24} />
  },
  {
    id: 'C',
    title: inhalt.werte.prinzipCCoating,
    desc: inhalt.werte.beschichtungDerBewehrungCoating,
    details: inhalt.werte.verhindertDenDirektenKontakt,
    icon: <Shield className="text-shiraz" size={24} />
  },
  {
    id: 'R',
    title: inhalt.werte.prinzipRRepassivierung,
    desc: inhalt.werte.repassivierungWiederherstellungDesAlkali,
    details: inhalt.werte.derCarbonatisierteOderChloridbelastete,
    icon: <Wrench className="text-amber-600" size={24} />
  },
  {
    id: 'K',
    title: inhalt.werte.prinzipKKathodischerKorrosionsschutz,
    desc: inhalt.werte.kathodischerKorrosionsschutzDurchAnlegen,
    details: inhalt.werte.dieBewehrungWirdKathodisch,
    icon: <Activity className="text-emerald-600" size={24} />
  }
];

export const osSysteme = inhalt.daten.osSysteme;

export const en1504Prinzipien = inhalt.daten.en1504Prinzipien;

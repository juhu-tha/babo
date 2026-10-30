// Erweiterte Nachprüfung 29.10.2026: 15 weitere freigegebene Fachmodule, Schwerpunkt Bezugsgrößen, Normzuordnungen und
// modulübergreifende Kennwerte (Befundliste docs/pruefung/nachpruefung2-2026-10-29.md). Die Sollwerte stammen aus einem
// eigenen Prüfskript (Python, eigene Umsetzung der Gleichungen), nicht aus den Kernen. Zusätzlich sichert der Test die
// Korrekturen NP2-* gegen ein Zurückfallen.
import { sonneneintrag } from '../src/calc/sommerWaermeschutz';
import { biokohleBilanz, PK_LEHRWERT, PK_NETTO_SENKE_KG } from '../src/calc/biokohlebeton';
import { creep, shrinkage } from '../src/utils/ec2Spannbeton';
import { fkMasonry } from '../src/utils/bestandKern';
import { erfc } from '../src/calc/lebensdauer';
import { GWP_LEHRWERTE } from '../src/data/gwpLehrwerte';
import farben from '../content/bpfarbenlacke/BpFarbenLacke.json';
import farbenDaten from '../content/bpfarbenlacke/daten.json';
import stahlDaten from '../content/stahl/daten.json';
import stahlKurven from '../content/stahl/SpannungsDehnung.json';
import beiwerte from '../content/spannbeton/BeiwerteKatalog.json';
import mischEingaben from '../content/mischungsberechnung/MischungEingaben.json';
import laborTab from '../content/historischematerialkennwerte/RechnerLaborTab.json';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };

console.log('--- Test: Erweiterte Nachprüfung 29.10.2026 (Nachrechnungen und Korrekturen) ---');

// sommerlicher_waermeschutz: Beispiele 1 und 2 (DIN 4108-2:2013-02, Tab. 7 und 8)
const raum1 = (bauart: 'mittel' | 'schwer', schutz: string) => sonneneintrag({
  nutzung: 'wohn', region: 'B', bauart, nachtlueftung: 'erhoeht', passiveKuehlung: false, AG: 25,
  fenster: [{ A: 11, g: 0.59, scheiben: 2, orientierung: 'S', neigung: 90, schutz }],
});
const b1 = raum1('mittel', 'rollladen_34');
pruefe('SW1 S_vorh', b1.Svorh, 0.07788);
pruefe('SW1 S_zul', b1.Szul, 0.06136);
gilt(!b1.erfuellt, 'SW1 Beispiel 1 nicht erfüllt');
const b1v = raum1('schwer', 'raffstore_45');
pruefe('SW1 S_vorh Raffstore', b1v.Svorh, 0.0649);
pruefe('SW1 S_zul schwer', b1v.Szul, 0.07136);
gilt(b1v.erfuellt, 'SW1 Verbesserung erfüllt');
const b2 = sonneneintrag({
  nutzung: 'wohn', region: 'B', bauart: 'leicht', nachtlueftung: 'erhoeht', passiveKuehlung: false, AG: 14,
  fenster: [
    { A: 1.5, g: 0.50, scheiben: 3, orientierung: 'S', neigung: 45, schutz: 'rollladen_34' },
    { A: 1.2, g: 0.50, scheiben: 3, orientierung: 'W', neigung: 90, schutz: 'ohne' },
  ],
});
pruefe('SW2 S_vorh', b2.Svorh, 0.0589286);
pruefe('SW2 S_zul', b2.Szul, 0.0840056);
gilt(b2.verzicht.grenzeTab6 === 0.07 && !b2.verzicht.entbehrlich, 'SW2 Grenze Tab. 6 mit Dachflächenfenster 7 %, kein Verzicht');

// historisch: Ziegelwand 1920 (EC6-Grundformel) und lognormaler Bemessungswert
pruefe('HI f_k Ziegelwand', fkMasonry(12.3, 2.5), 4.19448);
pruefe('HI f_d lognormal', 25 * Math.exp(-0.8 * 3.8 * 0.15 - 0.5 * 0.15 ** 2), 15.6681);

// lebensdauerbemessung: Mittelwertrechnung Beispiel 2
const D = Math.exp(4800 * (1 / 293 - 1 / 283.15)) * 1.9 * 31.536 * (0.0767 / 50) ** 0.45;
pruefe('LD D_app', D, 1.83519);
pruefe('LD C(55, 50)', 0.1 + 2.9 * erfc((55 - 8.9) / (2 * Math.sqrt(D * 50))), 0.101933, 2e-3);

// spannbeton_kennwerte: β(t₀) nach Gl. (B.5), autogenes Schwinden nach Gl. (3.12) (NP2-SB-1)
pruefe('SB φ(t₀ = 3 d)/φ(t₀ = 28 d), Zement N', creep(30, 3, 'N', 300, 50) / creep(30, 28, 'N', 300, 50), 1.52133);
pruefe('SB ε_ca C60/75', shrinkage(60, 'N', 300, 50).eps_ca, 0.125);
pruefe('SB ε_ca C35/45', shrinkage(35, 'N', 300, 50).eps_ca, 0.0625);
gilt(/~0,74/.test(beiwerte.werte.t3D0) && !/0,85/.test(beiwerte.werte.t3D0), 'NP2-SB-1: β(t₀ = 3 d) ≈ 0,74 im Beiwerte-Katalog');
gilt(!/verdoppelt/.test(beiwerte.werte.belastungsalterTFrühesBelasten), 'NP2-SB-1: frühes Belasten verdoppelt φ nicht (≈ +50 %)');
gilt(/C60\/75: -0,125/.test(beiwerte.werte.t003Bis0), 'NP2-SB-2: ε_ca C60/75 = −0,125 ‰');
gilt(/C30\/37/.test(beiwerte.werte.fürStandardzementeCemI), 'NP2-SB-3: ε_cd,0 = 0,48 ‰ gehört zu C30/37 (Zement N, RH 50 %)');

// mischungsberechnung: Netto-Senke Pflanzenkohle wie Modul Biokohlebeton (NP2-MB-1)
pruefe('MB Netto-Senke je kg', PK_NETTO_SENKE_KG, 2.04667);
const bk = biokohleBilanz({ mPK: 1, ...PK_LEHRWERT, zRef: 320, deltaZ: 0, gwpZ: 0.665, w: 175, wAufnahme: 150 });
pruefe('MB Netto-Senke = Kern Biokohlebeton', bk.nettoPK, PK_NETTO_SENKE_KG, 1e-9);
gilt(!/-2,5 kg/.test(mischEingaben.werte.biocharBindetDauerhaftCo2) && /Biokohlebeton/.test(mischEingaben.werte.biocharBindetDauerhaftCo2), 'NP2-MB-1: Info-Text mit der Netto-Senke des Moduls Biokohlebeton');

// lca_rechner: Minderung CEM III/A aus den Lehrwerten (Frage NP2-LC-1, Wert dokumentiert)
// Umsetzung 29.10. (NP2-LC-1): CEM-III/A-Lehrbeton aus 300 kg · 0,40 + 45 = 165 kg/m³ → Minderung (245 − 165)/245 = 32,7 % (vorher 135 kg/m³, 44,9 %)
pruefe('LC Minderung CEM III/A (Lehrwerte)', 1 - GWP_LEHRWERTE.betonCemIIIA.gwp / GWP_LEHRWERTE.betonC2530CemI.gwp, 0.32653);

// Korrekturen
gilt(!/DIN 1045-3/.test(farben.texte.ausführungskriterienBetonvorbereitungDin) && /TR Instandhaltung/.test(farben.texte.ausführungskriterienBetonvorbereitungDin), 'NP2-FL-1: Untergrundvorbereitung nach TR Instandhaltung, nicht DIN 1045-3');
gilt(/OS 8, OS 11/.test(farben.texte.untergrundfestigkeitDieHaftzugfestigkeit), 'NP2-FL-1: Haftzug 1,5/1,0 N/mm² nur für befahrbare Systeme');
const os = farbenDaten.daten.OS_SYSTEMS as { id: string; consumption: string }[];
const def = farben.daten['BpFarbenLacke.materialDefinitions'] as Record<string, { rate: number }[]>;
for (const id of ['os8', 'os11a', 'os11b']) {
  const karte = os.find(o => o.id === id)?.consumption ?? '';
  const zahlen = [...karte.matchAll(/(\d+(?:,\d+)?) kg\/m²/g)].map(m => Number(m[1].replace(',', '.')));
  const rechner = (def?.[id] ?? []).map(z => z.rate);
  gilt(rechner.length > 0 && JSON.stringify(zahlen) === JSON.stringify(rechner), `NP2-FL-2: Verbrauch ${id} in der Systemkarte wie im Materialrechner (${zahlen} / ${rechner})`);
}
gilt(!/Y1050/.test(stahlDaten.werte.sas670Y1050Spannstab) && !/Y1050/.test(stahlDaten.werte.warmgewalzterGewindespannstahlY1050), 'NP2-ST-1: SAS 670/800 nicht als Y1050 bezeichnet');
gilt(!/Spannstahl \(Y1860 S7 \/ SAS 670\)/.test(stahlKurven.texte.spannstahlY1860S7Sas), 'NP2-ST-1: Gewindestab 670/800 nicht als Spannstahl');
gilt(/vorläufig, Normprüfung ausstehend/.test(laborTab.texte.t1ProbenFormbeiwertD), 'NP2-HI-1: Formbeiwert d als Näherung gekennzeichnet');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Erweiterte Nachprüfung 29.10.2026');

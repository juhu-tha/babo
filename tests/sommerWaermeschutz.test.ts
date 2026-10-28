// Rechenkern Sommerlicher Wärmeschutz (AP 3.13): Sonneneintragskennwert-Verfahren nach DIN 4108-2:2013-02
import { bauartAusCwirk, fcAusTabelle, S1_TABELLE, sonneneintrag, type Fenster, type Raum } from '../src/calc/sommerWaermeschutz';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Sommerlicher Wärmeschutz ---');

const fenster = (A: number, g: number, o: Fenster['orientierung'], schutz: string, x: Partial<Fenster> = {}): Fenster =>
  ({ A, g, scheiben: 2, orientierung: o, neigung: 90, schutz, ...x });

// 1. Unabhängiger Referenzwert: TR Sonnenschutz (BVRS, Ausg. April 2024), Beispiel 3.5.2 „Wohnzimmer mit Rollladen“:
//    A_G = 25 m², f_WG = 0,44, g = 0,59, Rollladen ¾ geschlossen F_C = 0,3, mittlere Bauart, erhöhte Nachtlüftung, Region B
//    → S_vorh = 0,078; S1 = 0,103; S2 = −0,042; S_zul = 0,061 → nicht erfüllt
const wohnzimmer: Raum = { nutzung: 'wohn', region: 'B', bauart: 'mittel', nachtlueftung: 'erhoeht', passiveKuehlung: false, AG: 25,
  fenster: [fenster(11, 0.59, 'S', 'rollladen_34')] };
const w = sonneneintrag(wohnzimmer);
pruefe(w.gueltig && nahe(w.Svorh, 0.078, 0.0005) && nahe(w.S1, 0.103, 1e-12) && nahe(w.S2, -0.042, 0.0005) && nahe(w.Szul, 0.061, 0.0005) && !w.erfuellt, `Wohnzimmer ${w.Svorh} ${w.Szul}`);
// Handrechnung: g_tot = 0,59 · 0,30 = 0,177; S_vorh = 11 · 0,177 / 25 = 0,07788; S2 = 0,060 − 0,231 · 0,44 = −0,04164; S_zul = 0,06136
pruefe(nahe(w.Svorh, 0.07788, 1e-12) && nahe(w.S2, -0.04164, 1e-12) && nahe(w.Szul, 0.06136, 1e-12), 'Wohnzimmer Handrechnung');
pruefe(!w.verzicht.tab6 && !w.verzicht.wohn35 && nahe(w.verzicht.grenzeTab6, 0.10, 1e-12), 'Wohnzimmer: Nachweis erforderlich (f_WG > 35 %)');
// Beispiel 3.5.3 Eckraum: ⅓ der Fensterfläche nach Norden → S5 = 0,10 · 0,33 = 0,033, S_zul = 0,094 (Fenster-g und F_C wie zuvor)
const eck = sonneneintrag({ ...wohnzimmer, fenster: [fenster(11 * 2 / 3, 0.59, 'S', 'rollladen_34'), fenster(11 / 3, 0.59, 'N', 'rollladen_34')] });
pruefe(nahe(eck.S5, 0.0333, 0.0001) && nahe(eck.Szul, 0.094, 0.001), `Eckraum ${eck.S5} ${eck.Szul}`);

// 2. Referenz BVRS 3.5.1 „Büroraum, Südfenster, Außenjalousie 45°“ (Nichtwohngebäude, Region C, leicht, ohne Nachtlüftung):
//    A_G = 19,8 m², A_W = 3,5 m², Sonnenschutzglas g = 0,35 → F_C = 0,30, g_tot ≈ 0,10, S_vorh ≈ 0,018, S1 = 0,000, S2 = 0,010, S3 = 0,030, S_zul = 0,040 → erfüllt
const buero: Raum = { nutzung: 'nichtwohn', region: 'C', bauart: 'leicht', nachtlueftung: 'ohne', passiveKuehlung: false, AG: 19.8,
  fenster: [fenster(3.5, 0.35, 'S', 'raffstore_45')] };
const b = sonneneintrag(buero);
pruefe(nahe(b.fenster[0].fc, 0.30, 1e-12) && nahe(b.Svorh, 0.0186, 0.0005) && nahe(b.S2, 0.010, 0.0005) && nahe(b.S3, 0.03, 1e-12) && nahe(b.Szul, 0.040, 0.0005) && b.erfuellt, `Büro ${b.Svorh} ${b.Szul}`);
//    Mit Wärmeschutzglas g = 0,59 statt Sonnenschutzglas: F_C = 0,25, g_tot = 0,15, S_vorh = 0,026, S3 = 0, S_zul = 0,010 → nicht erfüllt
const b2 = sonneneintrag({ ...buero, fenster: [fenster(3.5, 0.59, 'S', 'raffstore_45')] });
pruefe(nahe(b2.fenster[0].fc, 0.25, 1e-12) && nahe(b2.Svorh, 0.026, 0.0005) && b2.S3 === 0 && nahe(b2.Szul, 0.010, 0.0005) && !b2.erfuellt, `Büro g 0,59 ${b2.Svorh} ${b2.Szul}`);

// 3. Tabellenwerte (KALKSANDSTEIN-Planungshandbuch Kap. 11, Tafel 3; BVRS Tabelle 3): Stichproben und Monotonie
pruefe(S1_TABELLE.wohn.A.ohne.leicht === 0.071 && S1_TABELLE.wohn.C.hoch.schwer === 0.160 && S1_TABELLE.nichtwohn.C.ohne.leicht === 0 && S1_TABELLE.nichtwohn.A.hoch.schwer === 0.170, 'S1-Stichproben');
for (const n of ['wohn', 'nichtwohn'] as const) for (const r of ['A', 'B', 'C'] as const) for (const l of ['ohne', 'erhoeht', 'hoch'] as const) {
  const t = S1_TABELLE[n][r][l];
  pruefe(t.leicht <= t.mittel && t.mittel <= t.schwer, `S1 Bauart-Monotonie ${n}/${r}/${l}`);
}
for (const n of ['wohn', 'nichtwohn'] as const) for (const ba of ['leicht', 'mittel', 'schwer'] as const) {
  pruefe(S1_TABELLE[n].A.ohne[ba] >= S1_TABELLE[n].B.ohne[ba] && S1_TABELLE[n].B.ohne[ba] >= S1_TABELLE[n].C.ohne[ba], `S1 Region-Monotonie ${n}/${ba}`);
  pruefe(S1_TABELLE[n].A.ohne[ba] < S1_TABELLE[n].A.erhoeht[ba] && S1_TABELLE[n].A.erhoeht[ba] < S1_TABELLE[n].A.hoch[ba], `S1 Nachtlüftung ${n}/${ba}`);
}
// F_C-Spalten (Tab. 7): Sonnenschutzglas, dreifach, zweifach
pruefe(fcAusTabelle('rollladen_34', 0.35, 2) === 0.35 && fcAusTabelle('rollladen_34', 0.5, 3) === 0.30 && fcAusTabelle('ohne', 0.6, 2) === 1 && Number.isNaN(fcAusTabelle('xyz', 0.6, 2)), 'F_C-Spalten');
pruefe(bauartAusCwirk(49.9) === 'leicht' && bauartAusCwirk(50) === 'mittel' && bauartAusCwirk(130) === 'mittel' && bauartAusCwirk(130.1) === 'schwer', 'Bauart aus C_wirk/A_G');

// 4. Dachgeschoss (Beispiel 2 im Modul): Dachflächenfenster Süd 1,5 m² (45°, g 0,50, dreifach, Rollladen ¾) + Giebelfenster West 1,2 m² ohne Sonnenschutz
//    A_G = 14 m², Region B, leicht, erhöhte Nachtlüftung: S_vorh = (1,5·0,15 + 1,2·0,50)/14 = 0,058929; f_WG = 0,192857;
//    S2 = 0,060 − 0,231·0,192857 = 0,015450; f_neig = 1,5/2,7; S4 = −0,019444; S_zul = 0,088 + 0,015450 − 0,019444 = 0,084006
const dg = sonneneintrag({ nutzung: 'wohn', region: 'B', bauart: 'leicht', nachtlueftung: 'erhoeht', passiveKuehlung: false, AG: 14,
  fenster: [fenster(1.5, 0.5, 'S', 'rollladen_34', { neigung: 45, scheiben: 3 }), fenster(1.2, 0.5, 'W', 'ohne', { scheiben: 3 })] });
pruefe(nahe(dg.Svorh, 0.825 / 14, 1e-12) && nahe(dg.S4, -0.035 * 1.5 / 2.7, 1e-12) && nahe(dg.Szul, 0.084006, 1e-6) && dg.erfuellt, `Dachgeschoss ${dg.Svorh} ${dg.Szul}`);
pruefe(nahe(dg.verzicht.grenzeTab6, 0.07, 1e-12) && !dg.verzicht.tab6 && !dg.verzicht.wohn35, 'Dachgeschoss: Tab. 6 → 7 %, Westfenster ohne Außenschutz');

// 5. Verzichtsregeln 8.2.2: kleines Nordfenster (Tab. 6, 15 %) und Wohnraum mit Rollläden (35 %-Regel)
const nordklein = sonneneintrag({ ...wohnzimmer, fenster: [fenster(3.5, 0.6, 'N', 'ohne')] });
pruefe(nordklein.verzicht.tab6 && nahe(nordklein.verzicht.grenzeTab6, 0.15, 1e-12), 'Nordfenster 14 % ≤ 15 %');
const r35 = sonneneintrag({ ...wohnzimmer, fenster: [fenster(5, 0.6, 'S', 'rollladen_34'), fenster(3, 0.6, 'W', 'raffstore_45'), fenster(0.5, 0.6, 'N', 'ohne')] });
pruefe(r35.verzicht.wohn35 && !r35.verzicht.tab6 && r35.verzicht.entbehrlich, '35-%-Regel mit Rollläden');
const r35nwg = sonneneintrag({ ...wohnzimmer, nutzung: 'nichtwohn', fenster: [fenster(5, 0.6, 'S', 'rollladen_34')] });
pruefe(!r35nwg.verzicht.wohn35, '35-%-Regel nur für Wohnnutzung');
// Passive Kühlung S6 und Sonnenschutzglas flächenanteilig
const pk = sonneneintrag({ ...wohnzimmer, bauart: 'schwer', passiveKuehlung: true, fenster: [fenster(5, 0.35, 'S', 'ohne'), fenster(5, 0.6, 'S', 'ohne')] });
pruefe(pk.S6 === 0.06 && nahe(pk.S3, 0.015, 1e-12), `S6/S3 ${pk.S6} ${pk.S3}`);
// Verschattete Fenster zählen zu f_nord; geneigte Nordfenster nicht
const vs = sonneneintrag({ ...wohnzimmer, fenster: [fenster(2, 0.6, 'S', 'ohne', { verschattet: true }), fenster(2, 0.6, 'N', 'ohne', { neigung: 30 })] });
pruefe(nahe(vs.fNord, 0.5, 1e-12) && nahe(vs.fNeig, 0.5, 1e-12), 'f_nord/f_neig');

// 6. Unsinnige Eingaben → Fehler, kein Ergebnis
for (const r of [
  { ...wohnzimmer, AG: 0 }, { ...wohnzimmer, AG: NaN }, { ...wohnzimmer, fenster: [] },
  { ...wohnzimmer, fenster: [fenster(-1, 0.6, 'S', 'ohne')] }, { ...wohnzimmer, fenster: [fenster(2, 0, 'S', 'ohne')] },
  { ...wohnzimmer, fenster: [fenster(2, 1.2, 'S', 'ohne')] }, { ...wohnzimmer, fenster: [fenster(2, 0.6, 'S', 'ohne', { neigung: 120 })] },
  { ...wohnzimmer, fenster: [fenster(2, 0.6, 'S', 'ohne', { fcEigen: 0 })] }, { ...wohnzimmer, fenster: [fenster(2, 0.6, 'S', 'gibtsnicht')] },
] as Raum[]) {
  const e = sonneneintrag(r);
  pruefe(!e.gueltig && e.hinweise.some(x => x.stufe === 'fehler') && Number.isNaN(e.Svorh), `Fehlerfall ${JSON.stringify(r).slice(0, 80)}`);
}
pruefe(sonneneintrag({ ...wohnzimmer, fenster: [fenster(2, 0.6, 'S', 'rollladen_zu')] }).hinweise.some(x => x.stufe === 'warnung' && x.feld === 'fenster0'), 'Warnung geschlossener Sonnenschutz');
// Runde 28.10.: Hinweis auf DIN 4108-2:2026-05 bei jedem gültigen Ergebnis, Rechenweg bleibt 2013-02
pruefe(sonneneintrag(wohnzimmer).hinweise.some(x => x.feld === 'normstand' && x.text.includes('2026-05') && x.text.includes('2013-02')), 'Hinweis Normenstand 2026-05');

// 7. Fuzz-Test: 1000 Zufallsräume → gültige Ergebnisse sind endlich, S_vorh ≥ 0
let seed = 4108;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
const wahl = <T,>(xs: readonly T[]) => xs[Math.floor(z(0, xs.length - 1e-9))];
const ORI = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'] as const;
const SCH = ['ohne', 'innen_weiss', 'innen_hell', 'innen_dunkel', 'rollladen_34', 'rollladen_zu', 'raffstore_45', 'raffstore_10', 'markise_parallel', 'vordach'];
let gueltig = 0;
for (let i = 0; i < 1000; i++) {
  const r: Raum = {
    nutzung: wahl(['wohn', 'nichtwohn'] as const), region: wahl(['A', 'B', 'C'] as const), bauart: wahl(['leicht', 'mittel', 'schwer'] as const),
    nachtlueftung: wahl(['ohne', 'erhoeht', 'hoch'] as const), passiveKuehlung: z(0, 1) > 0.5, AG: z(-5, 120),
    fenster: Array.from({ length: Math.floor(z(0, 5)) }, () => ({
      A: z(-1, 15), g: z(-0.1, 1.1), scheiben: (z(0, 1) > 0.5 ? 3 : 2) as 2 | 3, orientierung: wahl(ORI), neigung: z(-10, 100),
      schutz: wahl(SCH), fcEigen: z(0, 1) > 0.8 ? z(-0.2, 1.2) : undefined, verschattet: z(0, 1) > 0.9,
    })),
  };
  const e = sonneneintrag(r);
  if (!e.gueltig) continue;
  gueltig++;
  if (![e.Svorh, e.Szul, e.fWG, e.S1, e.S2, e.S3, e.S4, e.S5, e.S6].every(Number.isFinite) || e.Svorh < 0) { pruefe(false, `Fuzz ${JSON.stringify(r)}`); break; }
}
pruefe(gueltig > 100, `Fuzz: nur ${gueltig} gültige Fälle`);

// Runde 5 (Z33): öffentlich prüfbare Teile der Verzichtsregeln (8.2.2) nach der Wiedergabe baunetzwissen.de
// („Sommerlicher Wärmeschutz: Nachweis und Berechnung“): Dachfenster 0–60° < 7 %, nordorientierte Fenster > 60° < 15 %,
// Nordwest über Süd bis Nordost < 10 % der Grundfläche; Wohngebäude bis 35 % mit außenliegendem Sonnenschutz F_C ≤ 0,30.
{
  const raum = (o: Fenster['orientierung'], A: number, neigung = 90, schutz = 'ohne', g = 0.6): Raum => ({ ...wohnzimmer, AG: 100, fenster: [fenster(A, g, o, schutz, { neigung })] });
  pruefe(sonneneintrag(raum('N', 15)).verzicht.grenzeTab6 === 0.15 && sonneneintrag(raum('N', 15)).verzicht.tab6, 'Nord 15 %');
  pruefe(sonneneintrag(raum('NO', 10)).verzicht.grenzeTab6 === 0.10 && sonneneintrag(raum('NW', 10)).verzicht.grenzeTab6 === 0.10 && !sonneneintrag(raum('NW', 11)).verzicht.tab6, 'NO/NW 10 %');
  pruefe(sonneneintrag(raum('S', 7, 30)).verzicht.grenzeTab6 === 0.07 && !sonneneintrag(raum('S', 7.5, 30)).verzicht.tab6, 'geneigt 7 %');
  pruefe(sonneneintrag(raum('S', 30, 90, 'rollladen_34')).verzicht.wohn35 && !sonneneintrag(raum('S', 30, 90, 'innen_weiss')).verzicht.wohn35 && !sonneneintrag(raum('S', 36, 90, 'rollladen_34')).verzicht.wohn35, '35-%-Regel mit außenliegendem F_C ≤ 0,30');
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log(`OK: Sommerlicher Wärmeschutz (${gueltig} gültige Fuzz-Fälle)`);

// Rechenkern Schwingung Brettsperrholzdecke (Umsetzungsplan Phase 4, AP 4.6)
import { bspSchwingung, BSP_AUFBAUTEN, ORIENTIERUNG, type BspSchwingungEingabe } from '../src/calc/bspSchwingung';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: BSP-Deckenschwingung ---');

// 1. Regressionstest gegen das veröffentlichte Beispiel (±5 %):
//    proHolz Austria (Hrsg.), Wallner-Novak/Augustin/Koppelhuber/Pock: Bemessung Brettsperrholz, Band II –
//    Anwendungsfälle, 1. Aufl. 2018, ISBN 978-3-902320-96-4, Beispiel 4.1 „Schwingungsnachweis einer
//    Wohnungsdecke“, S. 19–23 (öffentlich als PDF, u. a. bei proHolz und Herstellern).
//    BSP 150-L5s (30l-30w-30l-30w-30l), ℓ = 4,6 m, b_D = 5,0 m, E_0,mean = 11 550 N/mm², γ = 5,5 kN/m³,
//    g₁,k = 0,825 kN/m², g₂,k = 2,0 kN/m², Zementestrich 50 mm mit E = 25 000 N/mm² angesetzt, zweiseitig gelagert.
//    Ergebnisse im Beispiel: (EI)_ℓ = 2,83·10⁶ Nm²/m, (EI)_b = 9,36·10⁵ Nm²/m, f₁ = 7,36 Hz, b_F = 3,17 m, w(1 kN) = 0,23 mm.
//    Das Beispiel rechnet mit Netto-Querschnitt (Längslagen, starrer Verbund) – daher verfahren: 'netto'.
const beispiel: BspSchwingungEingabe = {
  spannweite: 4.6, lagen: [30, 30, 30, 30, 30], deckenbreite: 5.0, zusatzmasse: 2000 / 9.81,
  estrichDicke: 50, estrichArt: 'zement', verfahren: 'netto',
};
const b = bspSchwingung(beispiel);
pruefe(nahe(b.masse, 2825 / 9.81, 1e-9), `m ${b.masse}`);
pruefe(nahe(b.EI_l, 2.83e6, 0.05), `(EI)_l ${b.EI_l}`);
pruefe(nahe(b.EI_b_ges, 9.36e5, 0.05), `(EI)_b ${b.EI_b_ges}`);
pruefe(nahe(b.f1, 7.36, 0.05), `f1 ${b.f1}`);
pruefe(nahe(b.b_F, 3.17, 0.05), `b_F ${b.b_F}`);
pruefe(nahe(b.w1kN, 0.23, 0.05), `w ${b.w1kN}`);
pruefe(!b.f1UeberAnwendungsgrenze && b.wUnterOrientierungI && b.hinweise.some(h => /7\.3\.3/.test(h.text)), 'Einordnung wie im Beispiel (f₁ < 8 Hz, w < 0,25 mm)');
// Handrechnung Netto-BSP: I = 3·0,03³/12 + 2·0,03·0,06² = 2,2275·10⁻⁴ m⁴/m → EI = 2,5728·10⁶ Nm²/m (Beispiel: 2,57·10⁶)
pruefe(nahe(b.EI_l_netto, 11550e6 * 2.2275e-4, 1e-9), `EI netto ${b.EI_l_netto}`);

// 2. γ-Verfahren (DIN EN 1995-1-1 Anhang B), Handrechnung 150 L5s, ℓ = 4,6 m, G_R = 65 N/mm²:
//    γ₁ = 1/(1 + π²·11 550·10⁶·0,03·0,03/(65·10⁶·4,6²)) = 1/(1 + 0,074594) = 0,93058
//    I_ef = 3·0,03³/12 + 2·0,93058·0,03·0,06² = 2,0773·10⁻⁴ m⁴/m → EI_ef = 2,3993·10⁶ Nm²/m
const g = bspSchwingung({ ...beispiel, estrichDicke: 0, verfahren: 'gamma' });
pruefe(g.gamma_aussen !== null && nahe(g.gamma_aussen, 0.93058, 1e-4), `γ ${g.gamma_aussen}`);
pruefe(g.EI_l_gamma !== null && nahe(g.EI_l_gamma, 2.3993e6, 1e-3), `EI_ef ${g.EI_l_gamma}`);
pruefe(g.verfahrenAngesetzt === 'gamma' && g.EI_l < g.EI_l_netto && g.f1 < bspSchwingung({ ...beispiel, estrichDicke: 0 }).f1, 'γ-Verfahren abmindernd');
// γ → 1 für sehr große Spannweite (Schubverformung vernachlässigbar)
const lang = bspSchwingung({ ...beispiel, spannweite: 200, verfahren: 'gamma' });
pruefe(lang.gamma_aussen !== null && lang.gamma_aussen > 0.999, 'γ → 1 für ℓ → ∞');
// 3-lagig: Zwei-Gurt-Form; Handrechnung 100 L3s (30-40-30), ℓ = 4 m:
//    γ = 1/(1 + π²·11 550·10⁶·0,03·0,04/(2·65·10⁶·16)) = 1/(1 + 0,065766) = 0,93829
const l3 = bspSchwingung({ ...beispiel, lagen: [30, 40, 30], spannweite: 4, estrichDicke: 0, verfahren: 'gamma' });
pruefe(l3.gamma_aussen !== null && nahe(l3.gamma_aussen, 0.93829, 1e-4), `γ 3-lagig ${l3.gamma_aussen}`);
// 7-lagig: γ-Verfahren nicht umgesetzt → Warnung, Netto angesetzt
const l7 = bspSchwingung({ ...beispiel, lagen: BSP_AUFBAUTEN.l7_200.lagen, verfahren: 'gamma' });
pruefe(l7.verfahrenAngesetzt === 'netto' && l7.EI_l_gamma === null && l7.hinweise.some(h => /Schubanalogie/.test(h.text)), '7-lagig Hinweis');

// 3. Grenzen und Zusammenhänge
// f₁ ∝ 1/ℓ² bei gleicher Masse
const f2 = bspSchwingung({ ...beispiel, spannweite: 2.3 });
pruefe(nahe(f2.f1 / b.f1, 4, 1e-9), 'f₁ ∝ 1/ℓ²');
// b_F > b_D → b_ef = b_D mit Hinweis
const schmal = bspSchwingung({ ...beispiel, deckenbreite: 1.0 });
pruefe(schmal.b_ef === 1.0 && schmal.hinweise.some(h => h.feld === 'deckenbreite'), 'b_ef = b_D');
// Kein Estrich, keine Zusatzmasse: nur Eigenmasse 0,15·5,5/9,81 kN → 84,1 kg/m²
const nackt = bspSchwingung({ ...beispiel, zusatzmasse: 0, estrichDicke: 0 });
pruefe(nahe(nackt.masse, 825 / 9.81, 1e-9) && nackt.EI_estrich === 0, 'nur Eigenmasse');
pruefe(ORIENTIERUNG.wKlasseI === 0.25 && ORIENTIERUNG.f1KlasseI === 8, 'Orientierungswerte');

// 4. Unsinnige Eingaben
for (const u of [{ spannweite: 0 }, { lagen: [30, 30] }, { lagen: [30, 0, 30] }, { zusatzmasse: -1 }, { deckenbreite: NaN }, { estrichDicke: -5 }, { GR: 0 }] as Partial<BspSchwingungEingabe>[]) {
  const r = bspSchwingung({ ...beispiel, ...u });
  pruefe([r.f1, r.w1kN, r.EI_l].every(Number.isFinite) && r.hinweise.some(h => h.stufe === 'fehler'), JSON.stringify(u));
}

// 5. Fuzz: 1 000 Zufallseingaben ohne NaN/∞
let seed = 46;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
for (let i = 0; i < 1000; i++) {
  const n = [2, 3, 5, 7, 9][i % 5];
  const lagen = Array.from({ length: n }, () => z(-5, 60));
  const r = bspSchwingung({
    spannweite: z(-1, 15), lagen, deckenbreite: z(-1, 12), zusatzmasse: z(-20, 400), estrichDicke: z(-10, 100),
    estrichArt: (['zement', 'anhydrit', 'gussasphalt'] as const)[i % 3], verfahren: i % 2 ? 'gamma' : 'netto',
  });
  if (![r.f1, r.w1kN, r.EI_l, r.b_F, r.b_ef, r.masse].every(Number.isFinite)) { pruefe(false, `Fuzz ${i}: ${JSON.stringify(r)}`); break; }
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: BSP-Deckenschwingung');

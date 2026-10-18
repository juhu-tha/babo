import fs from 'fs';

const dict: Record<string, string> = {
  'Zementgehalt': 'Menge an Zement im Beton.',
  'Alkaligehalt Zement (Na_2O-Äq.)': 'Alkaligehalt des Zements, wichtig für AKR.',
  'Temperatur T_i': 'Innentemperatur.',
  'Luftfeuchte RH_i': 'Relative Luftfeuchtigkeit innen.',
  'Temperatur T_e': 'Außentemperatur.',
  'Luftfeuchte RH_e': 'Relative Luftfeuchtigkeit außen.',
  'Breite b': 'Breite des Bauteils.',
  'Höhe h': 'Höhe des Bauteils.',
  'Randabstand d_1': 'Abstand vom Rand zur Bewehrung.',
  'Biegemoment M_{Ed}': 'Einwirkendes Biegemoment.',
  'Natürlicher Wassergehalt (w)': 'Wassergehalt des Bodens.',
  'Fließgrenze (w_L)': 'Wassergehalt an der Fließgrenze.',
  'Ausrollgrenze (w_P)': 'Wassergehalt an der Ausrollgrenze.',
  'Kohäsion (c)': 'Kohäsion des Bodens.',
  'Reibungswinkel (\\varphi)': 'Reibungswinkel des Bodens.',
  'Vorhandene Normalspannung (\\sigma)': 'Vorhandene Normalspannung im Boden.',
  'Wandhöhe (h)': 'Höhe der Wand.',
  'Wichte (\\gamma)': 'Wichte des Bodens.',
  'Schichtdicke (h)': 'Dicke der Bodenschicht.',
  'Zusatzspannung (\\Delta\\sigma)': 'Zusätzliche Spannung.',
  'Steifemodul (E_s)': 'Steifemodul des Bodens.',
  'Konsolidierungsbeiwert (c_v)': 'Konsolidierungsbeiwert des Bodens.',
  'Nennspannung (\\sigma)': 'Nennspannung im Bauteil.',
  'Risslänge (a)': 'Länge des Risses.',
  'Geometriefaktor (Y)': 'Geometriefaktor für die Rissberechnung.',
  'Risszähigkeit (K_{Ic})': 'Risszähigkeit des Materials.',
  'Betonfestigkeit (f_{ck})': 'Charakteristische Druckfestigkeit des Betons.',
  'Querschnittsfläche (a_{tex})': 'Querschnittsfläche der textilen Bewehrung.',
  'Zugfestigkeit (f_{tk})': 'Zugfestigkeit der textilen Bewehrung.',
  'E-Modul (E_{tex})': 'Elastizitätsmodul der textilen Bewehrung.',
  'Temperatur Innen T_{innen}': 'Temperatur an der Innenseite.',
  'Temperatur Mitte T_{mitte}': 'Temperatur in der Mitte des Bauteils.',
  'Temperatur Außen T_{aussen}': 'Temperatur an der Außenseite.',
  'Effektiver E-Modul E_{c,eff}(t)': 'Effektiver Elastizitätsmodul zum Zeitpunkt t.',
  'Zugfestigkeit f_{ctm}(t)': 'Mittlere Zugfestigkeit zum Zeitpunkt t.',
  'Schwinddehnung (Rand) \\varepsilon_{cs}': 'Schwinddehnung am Rand.',
  'Mittlere Festigkeit (f_{cm,cyl})': 'Mittlere Zylinderdruckfestigkeit.',
  'Standardabweichung (σ_{cyl})': 'Standardabweichung der Druckfestigkeit.',
  'Beiwert (α_{cc})': 'Beiwert zur Berücksichtigung von Langzeitwirkungen.',
  'Teilsicherheitsbeiwert (γ_c)': 'Teilsicherheitsbeiwert für Beton.',
  'Charakt. Zylinderdruckfestigkeit (f_{ck})': 'Charakteristische Zylinderdruckfestigkeit.',
  'Temperatur (T_z)': 'Temperatur des Zements.',
  'Scherbeneis (m_eis)': 'Masse des zugegebenen Eises zur Kühlung.',
  'Temperatur (T_g)': 'Temperatur der Gesteinskörnung.',
  'Vorhandene Spannung σ': 'Vorhandene Spannung im Glas.',
  'Stablänge l': 'Länge des Stabs.',
  'E-Modul E': 'Elastizitätsmodul des Materials.',
  'Flächenträgheitsmoment I': 'Flächenträgheitsmoment des Querschnitts.',
  'Betondeckung (c_{nom})': 'Nennmaß der Betondeckung.',
  'Diffusionskoeffizient (D_{app})': 'Apparenter Diffusionskoeffizient.',
  'Oberflächenkonzentration (C_s)': 'Chloridkonzentration an der Oberfläche.',
  'Karbonatisierungsgeschwindigkeit (K_schnell)': 'Geschwindigkeit der Karbonatisierung.',
  'Relative Luftfeuchtigkeit (RH)': 'Relative Luftfeuchtigkeit der Umgebung.',
  'Wirksame Bauteildicke (h_0)': 'Wirksame Dicke des Bauteils für Kriechen und Schwinden.',
  'Belastungsalter (t_0)': 'Alter des Betons bei Belastungsbeginn.',
  'Feuchteänderung (\\Delta u)': 'Änderung des Feuchtegehalts.',
  'Spannungsniveau (\\sigma_{pi} / f_{pk})': 'Verhältnis der vorhandenen Spannung zur Festigkeit.',
  'Steinfestigkeit f_b': 'Druckfestigkeit des Mauersteins.',
  'Mörtelfestigkeit f_m': 'Druckfestigkeit des Mauermörtels.',
  'Wandhöhe h_{ef}': 'Effektive Wandhöhe.',
  'Wanddicke t': 'Dicke der Wand.',
  'Exzentrizität e': 'Exzentrizität der Lasteinleitung.',
  'Vorhandene Druckspannung σ_d': 'Vorhandene Druckspannung im Mauerwerk.',
  'Steinlänge l_u': 'Länge des Mauersteins.',
  'Steinhöhe h_u': 'Höhe des Mauersteins.',
  'Feststoffvolumen im Beton': 'Volumenanteil aller festen Bestandteile im Beton.',
  'Verteilungsmodul (q)': 'Verteilungsmodul der Packungsdichte.',
  'Reindichte ρ_t': 'Reindichte des Materials.',
  'Rohdichte ρ_b': 'Rohdichte des Materials.',
  'Massenbezogener Feuchtegehalt u_m': 'Massenbezogener Feuchtegehalt.',
  'Bauteildicke h': 'Dicke des Bauteils.',
  'Behinderungsgrad R': 'Grad der Behinderung der Verformung.',
  'Querkraft V_{Ed}': 'Einwirkende Querkraft.',
  'Druckstrebenneigung \\theta': 'Neigung der Druckstrebe.',
  'Wasseraufnahme WA_{24}': 'Wasseraufnahme nach 24 Stunden.',
  'Viskosität \\eta': 'Viskosität des Materials.',
  'Fließgrenze \\sigma_y / \\tau_0': 'Fließgrenze des Materials.',
  'Minimale Viskosität \\eta_{inf}': 'Minimale Viskosität bei hohen Scherraten.',
  'Erholungszeit t_{rec}': 'Zeit für die Erholung der Struktur.',
  'Stabdurchmesser (Ø_s)': 'Durchmesser der Bewehrungsstäbe.',
  'Stahlspannung (σ_s)': 'Spannung im Bewehrungsstahl.',
  'Bewehrungsquerschnitt (A_s)': 'Querschnittsfläche der Bewehrung.',
  'Betonzugfestigkeit (f_{ct,eff})': 'Effektive Zugfestigkeit des Betons.',
  'Vorspannkraft (P_0)': 'Initiale Vorspannkraft.',
  'Exzentrizität (e_p)': 'Exzentrizität der Vorspannung.',
  'Globale Dehnung (ε)': 'Globale Dehnung des Bauteils.',
  'Spannungsschwingbreite \\Delta\\sigma': 'Schwingbreite der Spannung für Ermüdung.',
  'w/z-Wert': 'Wasser-Zement-Wert.',
  '(w/z)eq-Wert': 'Äquivalenter Wasser-Zement-Wert.',
  'Fraktion 0/4': 'Anteil der Gesteinskörnung 0/4.',
  'Fraktion 4/8': 'Anteil der Gesteinskörnung 4/8.',
  'Fraktion 2/8': 'Anteil der Gesteinskörnung 2/8.',
  'Wärmeleitfähigkeit (\\lambda)': 'Wärmeleitfähigkeit des Materials.',
  'Rohdichte (\\rho)': 'Rohdichte des Materials.',
  'Spez. Wärmekapazität (c)': 'Spezifische Wärmekapazität.',
  'Ziel-U-Wert (U_{req})': 'Geforderter U-Wert.',
  'Wärmeleitfähigkeit (\\lambda_{Base})': 'Basis-Wärmeleitfähigkeit.',
  'Calciumoxid (CaO)': 'Anteil an Calciumoxid.',
  'Siliciumdioxid (SiO_2)': 'Anteil an Siliciumdioxid.',
  'Aluminiumoxid (Al_2O_3)': 'Anteil an Aluminiumoxid.',
  'Eisen(III)-oxid (Fe_2O_3)': 'Anteil an Eisen(III)-oxid.',
  'Schwefeltrioxid (SO_3)': 'Anteil an Schwefeltrioxid.',
  'Rückprallzahl R': 'Rückprallzahl aus der Schmidt-Hammer-Prüfung.',
  'Ultraschallgeschwindigkeit v': 'Geschwindigkeit der Ultraschallwellen.',
  'Dielektrizitätszahl (\\varepsilon_r)': 'Relative Permittivität.',
  'Temperaturdifferenz (\\Delta T)': 'Temperaturdifferenz.',
  'Bauteildicke (d)': 'Dicke des Bauteils.',
  'Temperaturabfluss \\Delta T': 'Temperaturabfluss durch Hydratation.',
  'Schwindmaß \\varepsilon_{cs}': 'Schwindmaß des Betons.',
  'E-Modul E_c': 'Elastizitätsmodul des Betons.',
  'Zugfestigkeit f_{ct}': 'Zugfestigkeit des Betons.'
};

const files = fs.readdirSync('src/modules').filter(f => f.endsWith('.tsx'));

files.forEach(f => {
  let content = fs.readFileSync('src/modules/' + f, 'utf-8');
  let changed = false;

  // Fix the "undefined label=" issue first
  content = content.replace(/undefined label=/g, '<Slider label=');

  const regex = /<Slider[^>]*label=\{<FormulaText text=\"([^\"]+)\" \/>\}[^>]*>/g;
  content = content.replace(regex, (match, text) => {
    if (!match.includes('info=')) {
      const info = dict[text] || 'Parameter zur Anpassung der Berechnung.';
      changed = true;
      return match.replace('<Slider', `<Slider info="${info}"`);
    }
    return match;
  });

  const regex2 = /<Slider[^>]*label=\"([^\"]+)\"[^>]*>/g;
  content = content.replace(regex2, (match, text) => {
    if (!match.includes('info=')) {
      const info = dict[text] || 'Parameter zur Anpassung der Berechnung.';
      changed = true;
      return match.replace('<Slider', `<Slider info="${info}"`);
    }
    return match;
  });

  const regex3 = /<Slider[^>]*label=\{([^}]+)\}[^>]*>/g;
  content = content.replace(regex3, (match, text) => {
    if (!match.includes('info=') && !match.includes('<FormulaText')) {
      const info = 'Parameter zur Anpassung der Berechnung.';
      changed = true;
      return match.replace('<Slider', `<Slider info="${info}"`);
    }
    return match;
  });

  if (changed || content !== fs.readFileSync('src/modules/' + f, 'utf-8')) {
    fs.writeFileSync('src/modules/' + f, content, 'utf-8');
    console.log('Updated', f);
  }
});

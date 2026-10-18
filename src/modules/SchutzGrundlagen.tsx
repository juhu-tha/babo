import React, { useState } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  Layers, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Zap, 
  Droplets, 
  TrendingUp, 
  ArrowRight, 
  FileText, 
  Settings, 
  Compass, 
  Scale
} from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

export default function SchutzGrundlagen() {
  const [activeTab, setActiveTab] = useState<'prinzipien' | 'mechanismen' | 'lebensdauer' | 'verfahrenswahl'>('prinzipien');
  const [deSitterInitialCost, setDeSitterInitialCost] = useState<number>(1000);
  const [selectedDamageSource, setSelectedDamageSource] = useState<'carbonatisierung' | 'chloride' | 'feuchte' | 'risse' | 'verschleiss'>('carbonatisierung');

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 py-4 animate-in fade-in duration-300">
      {/* Header Container */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-home-grau/20 pb-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <ShieldCheck className="text-shiraz" size={24} /> Schutz: Grundlagen &amp; Instandsetzungsprinzipien
            </h2>
            <p className="text-xs text-text-main/70 mt-1">
              Systematik des Bauwerksschutzes, normative Instandsetzungsprinzipien nach DIN EN 1504 / TR Instandhaltung und physiko-chemische Schutzmechanismen
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-shiraz/10 text-shiraz border border-shiraz/20 self-start md:self-auto">
            DIN EN 1504-9 • TR Instandhaltung (DIBt) • DIN 31051
          </span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
          <p>
            Der Schutz und die Instandsetzung von Tragwerken und Bauteilen erfordert ein fundiertes Verständnis der Degradationsprozesse und der physikalisch-chemischen Schutzmechanismen. 
            Während <strong>passive Schutzsysteme</strong> durch Barrierewirkung das Vordringen von Schadstoffen (Wasser, CO₂, Chloride) unterbinden, greifen <strong>aktive Schutzverfahren</strong> (z. B. kathodischer Korrosionsschutz oder Realkalisierung) direkt in elektrochemische Reaktionsketten ein. 
            Grundlage jeder qualifizierten Planung ist die Zuordnung zu den europaweit harmonisierten Instandsetzungsprinzipien nach <strong>DIN EN 1504-9</strong> sowie den nationalen baurechtlichen Anforderungen der <strong>TR Instandhaltung</strong> des DIBt.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-home-grau/20 mt-4">
          <button
            onClick={() => setActiveTab('prinzipien')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'prinzipien'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Layers size={16} /> 1. Instandsetzungsprinzipien (DIN EN 1504 / TR)
          </button>
          <button
            onClick={() => setActiveTab('mechanismen')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'mechanismen'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Shield size={16} /> 2. Schutzmechanismen (Passiv vs. Aktiv)
          </button>
          <button
            onClick={() => setActiveTab('lebensdauer')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'lebensdauer'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <TrendingUp size={16} /> 3. Lebenszyklus &amp; Degradation (Tuutti / De Sitter)
          </button>
          <button
            onClick={() => setActiveTab('verfahrenswahl')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'verfahrenswahl'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Compass size={16} /> 4. Verfahrenswahl-Matrix
          </button>
        </div>
      </div>

      {/* Tab 1: Instandsetzungsprinzipien nach DIN EN 1504-9 & TR Instandhaltung */}
      {activeTab === 'prinzipien' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Normativer Kontext */}
          <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-home-grau/30 pb-2 mb-3">
              <FileText className="text-shiraz shrink-0" size={18} />
              Harmonisiertes europäisches Prinzipiensystem (DIN EN 1504-9)
            </h3>
            <p className="text-sm text-slate-800 leading-relaxed">
              Die europäische Norm <strong>DIN EN 1504 Teil 9</strong> definiert elf Grundprinzipien für den Schutz und die Instandsetzung von Betontragwerken. 
              Sie gliedern sich in <strong>Prinzipien 1 bis 6 für Betonschäden</strong> (Defekte im Zementsteingefüge) und <strong>Prinzipien 7 bis 11 für Bewehrungskorrosion</strong>. 
              Im deutschen Baurecht werden diese Prinzipien durch die <strong>Technische Regel Instandhaltung von Betonbauwerken (TR Instandhaltung, DIBt)</strong> für standsicherheitsrelevante Bauteile verbindlich konkretisiert (Prinzipien und Verfahren nach DIN EN 1504-9 / TR Instandhaltung Teil 1 Tab. 1 &amp; 2).
            </p>
          </div>

          {/* Übersicht Prinzipien 1 bis 6: Betonschutz */}
          <div className="bg-white border border-home-grau/30 p-5 rounded-xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-home-grau/20 pb-2">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-shiraz/10 text-shiraz flex items-center justify-center text-xs font-bold">A</span>
                Prinzipien für Betonschäden (Gefügeschutz &amp; Reprofilierung)
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">Prinzip 1 bis 6</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                <div className="font-bold text-shiraz mb-1 flex items-center justify-between">
                  <span>Prinzip 1 (PI): Schutz gegen Eindringen</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-home-grau/30 text-slate-600">Protection against Ingress</span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-2">
                  Reduzierung oder Verhinderung des Eindringens aggressiver Stoffe (Wasser, Gase, Ionen) durch Beschichtung, Hydrophobierung oder Rissschließung.
                </p>
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-home-grau/20">
                  <strong>Verfahren:</strong> Hydrophobierende Imprägnierung, Versiegelung, rissüberbrückende Beschichtung (z. B. OS 5a/5b, OS 11).
                </div>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                <div className="font-bold text-shiraz mb-1 flex items-center justify-between">
                  <span>Prinzip 2 (MC): Feuchtegehalt regulieren</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-home-grau/30 text-slate-600">Moisture Control</span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-2">
                  Einstellen und Halten des Feuchtegehalts im Beton auf ein unkritisches Niveau, sodass korrosive Reaktionen mangels Elektrolyt erliegen.
                </p>
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-home-grau/20">
                  <strong>Verfahren:</strong> Wasserableitende Beschichtungen, Schutzdächer, diffusionsoffene Versiegelungen, Klimasteuerung.
                </div>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                <div className="font-bold text-shiraz mb-1 flex items-center justify-between">
                  <span>Prinzip 3 (CR): Betonersatz</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-home-grau/30 text-slate-600">Concrete Restoration</span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-2">
                  Wiederherstellung des ursprünglichen Bauteilquerschnitts und der Betondeckung durch Abtragen von Schadstellen und Reprofilierung.
                </p>
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-home-grau/20">
                  <strong>Verfahren:</strong> Manueller Mörtelauftrag (PCC), Spritzmörtel/Spritzbeton (SPCC), Vergussmörtel.
                </div>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                <div className="font-bold text-shiraz mb-1 flex items-center justify-between">
                  <span>Prinzip 4 (SS): Tragwerksverstärkung</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-home-grau/30 text-slate-600">Structural Strengthening</span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-2">
                  Erhöhung oder Wiederherstellung der statischen Tragfähigkeit von Bauteilen bei Querschnittsverlust oder Laststeigerung.
                </p>
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-home-grau/20">
                  <strong>Verfahren:</strong> Aufgeklebte CFK-Lamellen, Stahlbandagen, Aufbeton, externe Vorspannung, Verpressanker.
                </div>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                <div className="font-bold text-shiraz mb-1 flex items-center justify-between">
                  <span>Prinzip 5 (PR): Physikalische Beständigkeit</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-home-grau/30 text-slate-600">Physical Resistance</span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-2">
                  Erhöhung des Widerstandes gegen mechanischen Abrieb, Stoß, Verschleiß oder Frost-Tausalz-Angriff.
                </p>
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-home-grau/20">
                  <strong>Verfahren:</strong> Hartstoffestriche, Verschleißschichten (OS 8), Reaktionsharzversiegelungen.
                </div>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                <div className="font-bold text-shiraz mb-1 flex items-center justify-between">
                  <span>Prinzip 6 (RC): Chemische Beständigkeit</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-home-grau/30 text-slate-600">Resistance to Chemicals</span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-2">
                  Schutz gegen zersetzende Chemikalien, Säuren, biogene Schwefelsäure (Kanalsanierung) oder Silagesäfte.
                </p>
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-home-grau/20">
                  <strong>Verfahren:</strong> Epoxidharz- und Vinylesterbeschichtungen, säurefeste Klinkerauskleidungen.
                </div>
              </div>
            </div>
          </div>

          {/* Übersicht Prinzipien 7 bis 11: Bewehrungskorrosionsschutz */}
          <div className="bg-white border border-home-grau/30 p-5 rounded-xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-home-grau/20 pb-2">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-shiraz/10 text-shiraz flex items-center justify-center text-xs font-bold">B</span>
                Prinzipien für Bewehrungskorrosion (Elektrochemischer Schutz &amp; Passivierung)
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">Prinzip 7 bis 11</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                <div className="font-bold text-shiraz mb-1 flex items-center justify-between">
                  <span>Prinzip 7 (RP): Erhalt/Wiederherstellung Passivität</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-home-grau/30 text-slate-600">Restoring Passivity</span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-2">
                  Schaffung von chemischen Bedingungen, unter denen sich die natürliche Passivschicht auf dem Stahl spontan neu bildet (pH-Wert &gt; 12,5).
                </p>
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-home-grau/20">
                  <strong>Verfahren:</strong> Erhöhung der Betondeckung mit hochalkalischem Mörtel, elektrochemische Realkalisierung (ER).
                </div>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                <div className="font-bold text-shiraz mb-1 flex items-center justify-between">
                  <span>Prinzip 8 (IR): Erhöhung spezifischer Widerstand</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-home-grau/30 text-slate-600">Increasing Resistivity</span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-2">
                  Steigerung des elektrischen Widerstands des Betongefüges zur Drosselung des Korrosionsstroms zwischen Anode und Kathode.
                </p>
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-home-grau/20">
                  <strong>Verfahren:</strong> Wasserentzug, Hydrophobierung, dichte Oberflächenbeschichtungen (Verfahren W nach DAfStb).
                </div>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                <div className="font-bold text-shiraz mb-1 flex items-center justify-between">
                  <span>Prinzip 9 (CC): Kathodische Kontrolle</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-home-grau/30 text-slate-600">Cathodic Control</span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-2">
                  Behinderung des kathodischen Teilprozesses (Sauerstoffreduktion) durch diffusionsdichte Beschichtungen.
                </p>
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-home-grau/20">
                  <strong>Verfahren:</strong> Sauerstoffbremsende Beschichtungen auf Bewehrungsstäben oder Betonoberflächen.
                </div>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                <div className="font-bold text-shiraz mb-1 flex items-center justify-between">
                  <span>Prinzip 10 (CP): Kathodischer Korrosionsschutz (KKS)</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-home-grau/30 text-slate-600">Cathodic Protection</span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-2">
                  Verschiebung des Stahlpotentials in den thermodynamisch immunen oder passiven Bereich mittels Fremdstrom oder galvanischen Opferanoden.
                </p>
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-home-grau/20">
                  <strong>Verfahren:</strong> Titan-Mischoxid-Anodenbänder (MMO) mit Gleichstromquelle (ICCP), Zinkanoden.
                </div>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                <div className="font-bold text-shiraz mb-1 flex items-center justify-between">
                  <span>Prinzip 11 (CA): Anodenkontrolle</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-home-grau/30 text-slate-600">Anodic Control</span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-2">
                  Behinderung des anodischen Metallauflösungsprozesses an freigelegtem oder geschädigtem Bewehrungsstahl.
                </p>
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-home-grau/20">
                  <strong>Verfahren:</strong> Auftrag aktiver Korrosionsschutzanstriche (mineralische Zementschlämmen oder zinkstaubhaltige EP-Primer).
                </div>
              </div>

              <div className="p-3 bg-rose-50/50 rounded-lg border border-shiraz/20 flex flex-col justify-between">
                <div>
                  <span className="font-bold text-shiraz block mb-1">Historisch: Instandsetzungsprinzipien der DAfStb-Rili-SIB (2001)</span>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    Nationale Definitionen der historischen DAfStb-Richtlinie:
                  </p>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-slate-700">
                    <li><strong>Prinzip W:</strong> Absenkung des Wassergehalts im Beton</li>
                    <li><strong>Prinzip C:</strong> Beschichtung der Bewehrung (Coating)</li>
                    <li><strong>Prinzip R:</strong> Repassivierung (Wiederherstellung des alkalischen Milieus)</li>
                    <li><strong>Prinzip K:</strong> Kathodischer Korrosionsschutz</li>
                  </ul>
                </div>
                <span className="text-[10px] text-slate-500 mt-2 block border-t border-shiraz/10 pt-1">
                  TR Instandhaltung Teil 1: Prinzipien und Verfahren nach DIN EN 1504-9 Tab. 1 &amp; 2
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Schutzmechanismen (Passiv vs. Aktiv) */}
      {activeTab === 'mechanismen' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Einleitende didaktische Gegenüberstellung */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs">
            <h3 className="font-bold text-base text-slate-900 mb-2 flex items-center gap-2">
              <Shield className="text-shiraz" size={20} /> Grundprinzipien: Physikalischer Barriereschutz vs. Elektrochemische Steuerung
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              In der Baustoffkunde und Bauwerkserhaltung unterscheidet man fundamental zwischen <strong>passiven Schutzmaßnahmen</strong> (die das Eindringen korrosiver Medien rein physikalisch blockieren oder verzögern) und <strong>aktiven Schutzmaßnahmen</strong> (die thermodynamisch oder kinetisch direkt in die elektrochemischen und biochemischen Reaktionspfade eingreifen). Während passive Systeme bei mechanischer Beschädigung oder Unterwanderung ihre Schutzwirkung lokal komplett verlieren, vermögen aktive Systeme das Bauteil selbst bei voller Elektrolyt- und Chloridanwesenheit dauerhaft vor Zerstörung zu bewahren.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Passive Schutzmaßnahmen */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-home-grau/20 pb-3">
                <Shield className="text-blue-600 shrink-0" size={20} />
                <div>
                  <h3 className="font-bold text-base text-slate-900">Passive Schutzmaßnahmen (Barriereschutz)</h3>
                  <span className="text-xs text-slate-500">Physikalische Trennung &amp; Diffusionshemmung</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                Passive Schutzsysteme errichten eine geometrisch-stoffliche Barriere zwischen dem empfindlichen Werkstoff (z. B. Bewehrungsstahl, Holz, Fassadenmetall) und der angreifenden Umgebung (Wasser, Sauerstoff, Kohlendioxid, Chloride, Säuren).
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1">1. Primärer Baustoffschutz: Alkalische Selbstpassivierung</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Im intakten Beton liegt der pH-Wert der Porenlösung durch gelöstes Calciumhydroxid (<InlineMath math="\text{Ca(OH)}_2" />) und Alkalien bei <InlineMath math="\text{pH} \ge 12{,}5 \dots 13{,}5" />. Unter diesen stark alkalischen Bedingungen bildet sich auf der Stahloberfläche spontan eine wenige Nanometer dichte, porenfreie Oxidhaut (<InlineMath math="\gamma\text{-Fe}_2\text{O}_3 / \text{Fe}_3\text{O}_4" />). Die Korrosionsgeschwindigkeit sinkt auf vernachlässigbare Werte (<InlineMath math="v_{\text{korr}} < 1\,\mu\text{m/Jahr}" />).
                  </p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1">2. Hydrophobierung (Tiefenimprägnierung nach DIN EN 1504-2)</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Niedermolekulare Silane oder Siloxane penetrieren <InlineMath math="2\text{ bis }8\text{ mm}" /> tief in die Kapillarporen und binden kovalent an die Silikatmatrix an. Ihre unpolaren organischen Alkylketten richten sich in den Porenraum aus. Der Benetzungswinkel steigt von <InlineMath math="\theta \approx 30^\circ" /> auf <InlineMath math="\theta > 90^\circ" />: Der Kapillarsog wird in einen Kapillardruck umgekehrt. Flüssiges Wasser perlt ab, während Wasserdampfdiffusion (<InlineMath math="s_d < 0{,}1\text{ m}" />) voll erhalten bleibt.
                  </p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1">3. Filmbildende Beschichtungen (OS 1 bis OS 11 / DIN V 18026)</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Synthetische Polymerfilme (Epoxidharz, Polyurethan, Polyharnstoff, Acrylat) schließen die Betonoberfläche porenfrei ab. Sie fungieren als Diffusionsbremse gegen saures Kohlendioxid (<InlineMath math="s_{d,\text{CO}_2} \ge 50\text{ m}" />) und sperren flüssige Chloridlösungen ab. Rissüberbrückende Systeme (OS 10, OS 11a/b) nehmen thermische und dynamische Rissbreitenänderungen bis <InlineMath math="0{,}3\text{ mm}" /> rissfrei auf.
                  </p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1">4. Konstruktiv-geometrischer Schutz</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Vermeidung von Wasserstau und Schmutznestern durch Mindestgefälle (<InlineMath math="\ge 2\,\%" />), großzügige Tropfkanten, Entwässerungsrinnen, ausreichende Betondeckung (<InlineMath math="c_{\text{nom}} \ge 40\dots 55\text{ mm}" /> bei XD/XS) sowie dauerelastische Fugenprofile.
                  </p>
                </div>
              </div>
            </div>

            {/* Aktive Schutzmaßnahmen */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-home-grau/20 pb-3">
                <Zap className="text-amber-600 shrink-0" size={20} />
                <div>
                  <h3 className="font-bold text-base text-slate-900">Aktive Schutzmaßnahmen (Elektrochemisch &amp; Chemisch)</h3>
                  <span className="text-xs text-slate-500">Thermodynamische oder kinetische Steuerung</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                Aktive Systeme greifen direkt in das elektrochemische Korrosionspotenzial oder die chemische Reaktionskinetik ein. Sie verhindern den Metallabtrag selbst in nasser und hochgradig chloridkontaminierter Umgebung.
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1">1. Kathodischer Korrosionsschutz (KKS nach DIN EN ISO 12696:2022-09)</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Der Bewehrungsstahl wird durch ein Gleichstromfeld zur Kathode polarisiert. Anode ist ein edles Titan-Mischoxid-Gitter (MMO) oder eine thermisch aufgespritzte Zinkschicht. 
                    <br />
                    Reaktion an der Kathode (Stahl): <InlineMath math="\text{O}_2 + 2\text{H}_2\text{O} + 4e^- \rightarrow 4\text{OH}^-" /> (Hydroxidbildung verhindert Säurefraß).
                    <br />
                    Reaktion an der Anode: <InlineMath math="2\text{H}_2\text{O} \rightarrow \text{O}_2 + 4\text{H}^+ + 4e^-" />.
                    <br />
                    Der anodische Eisenabtrag (<InlineMath math="\text{Fe} \rightarrow \text{Fe}^{2+} + 2e^-" />) wird thermodynamisch unterdrückt. Schutzkriterium: <InlineMath math="E_{\text{off}} \le -720\text{ mV}_{\text{Ag/AgCl}}" /> oder <InlineMath math="\Delta E_{\text{depol}} \ge 100\text{ mV}" /> innerhalb von 24 bis 72 h.
                  </p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1">2. Galvanischer Opferschutz (Feuerverzinkung DIN EN ISO 1461:2022-12)</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Zink besitzt ein negativeres Normalpotenzial (<InlineMath math="E^\circ = -0{,}76\text{ V}" />) als Eisen (<InlineMath math="E^\circ = -0{,}44\text{ V}" />). Bei Verletzung der Zinkschicht (Kratzer, Schnittkanten bis ca. <InlineMath math="1{,}5\text{ bis }2{,}0\text{ mm}" />) bildet sich ein Lokalelement: Das unedlere Zink geht anodisch in Lösung (<InlineMath math="\text{Zn} \rightarrow \text{Zn}^{2+} + 2e^-" />) und schützt den freiliegenden Stahl kathodisch vor Rost.
                  </p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1">3. Elektrochemische Chloridextraktion (ECE nach DIN EN 14038-1:2021-03)</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Temporäre Gleichstrombehandlung (<InlineMath math="1\text{ bis }2\text{ A/m}^2" /> Stahloberfläche über mehrere Wochen). Die negativ geladenen Chloridionen (<InlineMath math="\text{Cl}^-" />) wandern durch Elektromigration von der negativ geladenen Bewehrung (Kathode) weg zur temporären Außenanode in den getränkten Zellstoffwickel.
                  </p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1">4. Elektrochemische Realkalisierung (ER nach DIN EN 14038-2:2020-09)</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Temporärer Gleichstromeinsatz an karbonatisiertem Beton. Durch Kathodenreaktionen (<InlineMath math="2\text{H}_2\text{O} + 2e^- \rightarrow \text{H}_2 \uparrow + 2\text{OH}^-" />) sowie elektrosmotischen Transport von Natrium- und Kaliumcarbonatlösungen wird der pH-Wert in der Bewehrungszone wieder von <InlineMath math="\approx 8{,}5" /> auf über <InlineMath math="12{,}5" /> angehoben, sodass sich die Passivschicht regeneriert.
                  </p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1">5. Wandernde Korrosionsinhibitoren (MCI)</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Organische Alkanolamine mit hohem Dampfdruck diffundieren über die Gas- und Porenphase zur Bewehrung und bilden dort einen monomolekularen Adsorptionsfilm, der anodische und kathodische Teilreaktionen kinetisch blockiert.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Detaillierte Systemvergleichs-Tabelle */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs">
            <h4 className="font-bold text-sm text-text-main mb-3">Ausführliche Matrix: Passiver vs. Aktiver Schutz im Ingenieurbau</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-off-white border-b border-home-grau/30 text-slate-800">
                    <th className="p-2.5 font-bold w-1/4">Merkmal / Kriterium</th>
                    <th className="p-2.5 font-bold text-blue-700 w-3/8">Passiver Schutz (Barriere / OS-Systeme)</th>
                    <th className="p-2.5 font-bold text-amber-700 w-3/8">Aktiver Schutz (KKS / Opferschutz / ECE)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-slate-700">
                  <tr>
                    <td className="p-2.5 font-semibold">Triebkraft der Schutzwirkung</td>
                    <td className="p-2.5">Mechanische Barriere behindert Diffusions- und Kapillartransport</td>
                    <td className="p-2.5">Elektrische Potenzialverschiebung in die Immunitätszone (Pourbaix-Diagramm)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">Verhalten bei Beschädigung / Fehlstellen</td>
                    <td className="p-2.5 text-rose-700 font-medium">Katastrophal: Konzentrierte Lochkorrosion an Rissen, Poren und Fehlstellen</td>
                    <td className="p-2.5 text-emerald-700 font-medium">Robust: Fernschutzwirkung schützt Fehlstellen und Kratzer vollumfänglich weiter</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">Umgang mit vorhandener Chloridlast</td>
                    <td className="p-2.5 text-rose-700">Chloridhaltiger Beton muss zwingend bis hinter die Bewehrung gestemmt werden</td>
                    <td className="p-2.5 text-emerald-700">Chloridbelasteter Beton kann im Bauteil verbleiben; spart Lärm, Statikabstützung und Kosten</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">Anlagen- und Installationsaufwand</td>
                    <td className="p-2.5">Gering bis mittel (Kugelstrahlen, Grundierung, Schichtauftrag)</td>
                    <td className="p-2.5">Hoch (Gleichrichter, Kabelverbindungen, Anodengitter, Referenzelektroden)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">Monitoring &amp; Dauerüberwachung</td>
                    <td className="p-2.5">Visuelle Inspektion auf Blasen, Risse, Abplatzungen (DIN 1076 / VDI 6200)</td>
                    <td className="p-2.5">Kontinuierliche Fernüberwachung: Schutzstromdichte, Ausschaltpotenzial, 100-mV-Depolarisation</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">Einsatzgrenzen &amp; Risiken</td>
                    <td className="p-2.5">Osmotische Blasenbildung bei rückseitiger Durchfeuchtung; UV-Alterung</td>
                    <td className="p-2.5">Gefahr von Wasserstoffversprödung bei hochfesten Spannstählen (<InlineMath math="R_m > 1.000\text{ N/mm}^2" />)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">Hauptanwendungsgebiete</td>
                    <td className="p-2.5">Neubauten, Parkdecks (OS 8/11), Tunnelwände, Balkone, Fassaden</td>
                    <td className="p-2.5">Salzbelastete Brückenpfeiler, Tiefgaragenstützen, Hafenkaimauern, historische Baudenkmäler</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Fachübergreifende Analogien in anderen Disziplinen */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs">
            <h4 className="font-bold text-sm text-text-main mb-3">Analogie: Aktive und passive Schutzkonzepte in weiteren Baustoffdisziplinen</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                <span className="font-bold text-slate-900 block border-b border-home-grau/20 pb-1">Holzschutz (DIN 68800:2019-06)</span>
                <div>
                  <strong className="text-blue-700">Passiv (Baulich-konstruktiv, Teil 2):</strong>
                  <p className="text-slate-600">Dachüberstände, Tropfkanten, Sockelabstand <InlineMath math="\ge 30\text{ cm}" />, Hinterlüftung. Hält die Holzfeuchte sicher unter <InlineMath math="u < 20\,\%" /> (Pilzbefall biologisch unmöglich).</p>
                </div>
                <div>
                  <strong className="text-amber-700">Aktiv (Chemisch, Teil 3):</strong>
                  <p className="text-slate-600">Kesseldruckimprägnierung mit Bioziden (Borate, Kupferverbindungen). Vergiftet die Nährstoffquelle für holzzerstörende Pilze und Insekten bei ständiger Nässe (GK 3/4).</p>
                </div>
              </div>

              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                <span className="font-bold text-slate-900 block border-b border-home-grau/20 pb-1">Brandschutz (DIN 4102 / DIN EN 13501)</span>
                <div>
                  <strong className="text-blue-700">Passiv (Baulich-konstruktiv):</strong>
                  <p className="text-slate-600">Feuerwiderstandsfähige Bauteile (REI 30 bis REI 120), Brandwände, Feuerschutztüren, Gipskartonbekleidungen, intumeszierende Dämmschichtbildner (schäumen bei Hitze zu Isolierschaum auf).</p>
                </div>
                <div>
                  <strong className="text-amber-700">Aktiv (Anlagentechnisch &amp; abwehrend):</strong>
                  <p className="text-slate-600">Automatische Sprinkleranlagen, Gaslöschanlagen, Brandmeldeanlagen (BMA), Rauch-Wärme-Abzugsanlagen (RWA), Druckbelüftungsanlagen in Sicherheitstreppenräumen.</p>
                </div>
              </div>

              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                <span className="font-bold text-slate-900 block border-b border-home-grau/20 pb-1">Metallbau (DIN EN ISO 12944:2018-06)</span>
                <div>
                  <strong className="text-blue-700">Passiv (Barriereüberzüge):</strong>
                  <p className="text-slate-600">Pulverbeschichtungen, Epoxidharz-Zwischenschichten mit Eisenglimmer (Schuppenpanzer-Effekt bremst Diffusionswege), Eloxalschicht auf Aluminium (<InlineMath math="15\dots 25\,\mu\text{m}" /> dichtes <InlineMath math="\text{Al}_2\text{O}_3" />).</p>
                </div>
                <div>
                  <strong className="text-amber-700">Aktiv (Galvanischer Opferschutz):</strong>
                  <p className="text-slate-600">Zinkstaubgrundierungen und Feuerverzinkung (Schutzstrom zum Stahl bei Schnittkanten). Duplex-Systeme (Zink + Beschichtung) vereinen aktive Opferwirkung mit passivem Barriereschutz.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Lebenszyklus & Degradation (Tuutti / De Sitter) */}
      {activeTab === 'lebensdauer' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Das Tuutti-Modell */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Das Tuutti-Modell der Bewehrungskorrosion (1982)</h3>
                <span className="text-xs text-slate-500">Klassische Phaseneinteilung der Bauwerksalterung</span>
              </div>
              <span className="text-xs font-mono bg-off-white px-2 py-1 rounded border border-home-grau/30 text-slate-600">
                t_service = t_initiation + t_propagation
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Nach dem Modell von <em>Kyösti Tuutti</em> verläuft die Lebensdauer eines bewehrten Betonbauteils in zwei klar getrennten Phasen:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-off-white rounded-lg border border-home-grau/20">
                <span className="font-bold text-blue-700 block mb-1">1. Initiierungsphase (t₀)</span>
                <p className="text-slate-700 leading-relaxed mb-2">
                  Dauer vom Neubau bis zum Erreichen der Depassivierungsfront am Bewehrungsstahl. Schadstoffe dringen diffusiv durch die Betondeckung ein (Carbonatisierungsfront oder kritischer Chloridgehalt <InlineMath math="C_{\text{krit}} \approx 0{,}4\text{ bis }0{,}5\text{ M.-\% / Zement}" />). Am Bauteil sind noch keinerlei Schäden sichtbar!
                </p>
                <div className="p-2 bg-white rounded border border-home-grau/30 text-[11px] font-mono text-slate-600">
                  <InlineMath math="x(t) = k \cdot \sqrt{t} \quad \rightarrow \quad t_0 = \left(\frac{c}{k}\right)^2" />
                </div>
              </div>

              <div className="p-4 bg-off-white rounded-lg border border-home-grau/20">
                <span className="font-bold text-rose-700 block mb-1">2. Propagationsphase (t₁)</span>
                <p className="text-slate-700 leading-relaxed mb-2">
                  Nach Zerstörung der Passivschicht setzt bei Vorhandensein von Feuchte und Sauerstoff aktiver Rostabtrag ein. Durch die Volumenexpansion der Eisenkorrosionsprodukte (<InlineMath math="\text{Faktor }2\text{ bis }6" />) entstehen Gefügespannungen, Risse parallel zur Bewehrung, Hohlstellen und schließlich Betonabplatzungen bis hin zum Einsturz.
                </p>
                <div className="p-2 bg-white rounded border border-home-grau/30 text-[11px] font-mono text-slate-600">
                  <InlineMath math="\Delta d(t) = v_{\text{korr}} \cdot (t - t_0)" />
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-xs text-amber-900">
              <strong>Ingenieurmäßige Konsequenz:</strong> Präventive Instandhaltung muss in der <em>Initiierungsphase</em> stattfinden! Sobald die Propagationsphase beginnt, steigen die Sanierungskosten exponentiell an, da geschädigter Beton aufwendig gestemmt und Bewehrungsquerschnitte statisch nachgewiesen werden müssen.
            </div>
          </div>

          {/* De-Sitter-Regel ("Law of Fives") Interaktiver Rechner */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-home-grau/20 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">De-Sitter-Gesetz: Die Kosten-Regel der Fünf ("Law of Fives")</h3>
                <span className="text-xs text-slate-500">Exponentieller Kostenanstieg bei verzögerter Instandhaltung</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600">Basisinvestition:</span>
                <input
                  type="number"
                  value={deSitterInitialCost}
                  onChange={(e) => setDeSitterInitialCost(Math.max(100, Number(e.target.value)))}
                  className="w-24 px-2 py-1 text-xs border border-home-grau/30 rounded font-bold text-right"
                  step="500"
                />
                <span className="text-xs font-semibold text-slate-700">€</span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Die von <em>De Sitter (1984)</em> formulierte Regel besagt: 1 Euro, der in der Entwurfs- und Planungsphase für dauerhaften Schutz eingespart wird, verursacht in den Folgephasen um den Faktor 5 höhere Instandhaltungskosten:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-center">
                <span className="text-slate-500 font-bold block mb-1">Entwurf und Bau (1)</span>
                <span className="text-lg font-bold text-slate-800 block">
                  {deSitterInitialCost.toLocaleString('de-DE')} €
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Qualitätszement, Betondeckung +15 mm, Gefälleausbildung &amp; OS-System
                </span>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-center">
                <span className="text-slate-500 font-bold block mb-1">vor Schadensbeginn (5)</span>
                <span className="text-lg font-bold text-blue-700 block">
                  {(deSitterInitialCost * 5).toLocaleString('de-DE')} €
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Präventive Hydrophobierung vor Beginn der Karbonatisierungsfront
                </span>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-center">
                <span className="text-slate-500 font-bold block mb-1">Schadensfortschritt lokal (25)</span>
                <span className="text-lg font-bold text-amber-700 block">
                  {(deSitterInitialCost * 25).toLocaleString('de-DE')} €
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Lokale Betoninstandsetzung bei ersten sichtbaren Rissen und Abplatzungen
                </span>
              </div>

              <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 text-center">
                <span className="text-rose-800 font-bold block mb-1">umfassende Instandsetzung (125)</span>
                <span className="text-lg font-bold text-rose-700 block">
                  {(deSitterInitialCost * 125).toLocaleString('de-DE')} €
                </span>
                <span className="text-[11px] text-rose-700 block mt-1">
                  Umfassende Betonsanierung, Querschnittsverlust, Bauwerksstillstand
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Verfahrenswahl-Matrix */}
      {activeTab === 'verfahrenswahl' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-home-grau/30 pb-2 mb-3">
              <Compass className="text-shiraz shrink-0" size={18} />
              Entscheidungsmatrix: Welches Schutz- und Instandsetzungsverfahren ist indiziert?
            </h3>
            <p className="text-sm text-slate-800 leading-relaxed mb-4">
              Wählen Sie die primäre Schadensursache aus, um die bauaufsichtlich anerkannten Instandsetzungsprinzipien nach DIN EN 1504-9 und TR Instandhaltung aufzurufen:
            </p>

            {/* Selector Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { id: 'carbonatisierung', label: 'Carbonatisierung (pH < 9)' },
                { id: 'chloride', label: 'Chloridbelastung (Tausalze / Meerwasser)' },
                { id: 'feuchte', label: 'Durchfeuchtung & drückendes Wasser' },
                { id: 'risse', label: 'Trennrisse & Fugenbewegungen' },
                { id: 'verschleiss', label: 'Mechanischer Verschleiß & Abrieb' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedDamageSource(item.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    selectedDamageSource === item.id
                      ? 'bg-shiraz text-white border-shiraz'
                      : 'bg-white text-slate-700 border-home-grau/30 hover:bg-off-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Result Box */}
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs space-y-3 text-xs">
              {selectedDamageSource === 'carbonatisierung' && (
                <div>
                  <div className="flex items-center gap-2 text-shiraz font-bold text-sm border-b border-home-grau/20 pb-2 mb-2">
                    <CheckCircle2 size={16} /> Empfohlene Prinzipien bei Carbonatisierungsschäden
                  </div>
                  <ul className="space-y-2 text-slate-700">
                    <li>
                      <strong>Prinzip 3 (CR) / DAfStb Prinzip R:</strong> Vollständiger Abtrag des carbonatisierten Betons bis 15 mm hinter die Bewehrung. Reprofilierung mit hochalkalischem PCC- oder SPCC-Mörtel zur Repassivierung.
                    </li>
                    <li>
                      <strong>Prinzip 1 (PI) + Prinzip 2 (MC) / DAfStb Prinzip W:</strong> Bei noch intaktem Beton oder beginnender Carbonatisierung: Aufbringen einer carbonatisierungsbremsenden Beschichtung (<InlineMath math="s_{d,\text{CO}_2} \ge 50\text{ m}" />) zur Austrocknung.
                    </li>
                    <li>
                      <strong>Prinzip 7 (RP):</strong> Elektrochemische Realkalisierung (ER) bei denkmalgeschützten Sichtbetonflächen ohne Substanzverlust.
                    </li>
                  </ul>
                </div>
              )}

              {selectedDamageSource === 'chloride' && (
                <div>
                  <div className="flex items-center gap-2 text-shiraz font-bold text-sm border-b border-home-grau/20 pb-2 mb-2">
                    <CheckCircle2 size={16} /> Empfohlene Prinzipien bei Tausalz- &amp; Chloridschäden
                  </div>
                  <ul className="space-y-2 text-slate-700">
                    <li>
                      <strong>Prinzip 3 (CR) konventionell:</strong> Vollständiger HDW-Abtrag allen Betons mit Chloridgehalten <InlineMath math="> 0{,}5\text{ M.-\% / Zement}" />. Hoher Substanzverlust und Notwendigkeit statischer Abstützungen!
                    </li>
                    <li>
                      <strong>Prinzip 10 (CP) / DAfStb Prinzip K (KKS):</strong> Kathodischer Korrosionsschutz mittels Fremdstromanoden. Der chloridverseuchte Beton kann im Bauteil verbleiben, da der Korrosionsstrom die Lochfraßkorrosion stoppt.
                    </li>
                    <li>
                      <strong>Präventiv:</strong> Oberflächenschutzsystem OS 8 (starre Parkhausbeschichtung) oder OS 11 (rissüberbrückende Membran) vor Erstbeaufschlagung.
                    </li>
                  </ul>
                </div>
              )}

              {selectedDamageSource === 'feuchte' && (
                <div>
                  <div className="flex items-center gap-2 text-shiraz font-bold text-sm border-b border-home-grau/20 pb-2 mb-2">
                    <CheckCircle2 size={16} /> Empfohlene Prinzipien bei Durchfeuchtung &amp; drückendem Wasser
                  </div>
                  <ul className="space-y-2 text-slate-700">
                    <li>
                      <strong>Prinzip 2 (MC):</strong> Wasserhaltung, Drainageertüchtigung nach DIN 4095 und Trockenlegung.
                    </li>
                    <li>
                      <strong>Injektionsverfahren nach DIN EN 1504-5:</strong> Druckinjektion mit quellfähigen Polyurethanharzen (PUR) zum temporären Stoppen von Wassereinbrüchen, gefolgt von dauerelastischem Acrylatgel (Schleierinjektion) oder Epoxidharz.
                    </li>
                    <li>
                      <strong>Nachträgliche Innenabdichtung (Kellersanierung):</strong> Dichtschlämmen nach WTA-Merkblatt 4-6 in Kombination mit Sanierputzsystemen.
                    </li>
                  </ul>
                </div>
              )}

              {selectedDamageSource === 'risse' && (
                <div>
                  <div className="flex items-center gap-2 text-shiraz font-bold text-sm border-b border-home-grau/20 pb-2 mb-2">
                    <CheckCircle2 size={16} /> Empfohlene Prinzipien bei Rissbildung &amp; Fugenbewegungen
                  </div>
                  <ul className="space-y-2 text-slate-700">
                    <li>
                      <strong>Füllen von Rissen (DIN EN 1504-5):</strong> 
                      <br />• <em>Kraftschlüssiges Schließen (F):</em> Epoxidharz (EP) bei ruhenden Rissen zur Wiederherstellung der Zug- und Druckfestigkeit.
                      <br />• <em>Dehnfähiges Schließen (D):</em> Polyurethanharz (PUR) bei dynamisch bewegten Rissen zur dauerhaften Abdichtung.
                    </li>
                    <li>
                      <strong>Prinzip 1 (PI):</strong> Rissüberbrückende Oberflächenschutzsysteme Klasse OS 4 oder OS 5a/b (DIN V 18026).
                    </li>
                    <li>
                      <strong>Fugensanierung:</strong> Heraustrennen gealterter Fugenmassen, Einlegen von PE-Rundschnur (Zweiflankenhaftung!) und Neuverfugung nach DIN 18540.
                    </li>
                  </ul>
                </div>
              )}

              {selectedDamageSource === 'verschleiss' && (
                <div>
                  <div className="flex items-center gap-2 text-shiraz font-bold text-sm border-b border-home-grau/20 pb-2 mb-2">
                    <CheckCircle2 size={16} /> Empfohlene Prinzipien bei mechanischem Verschleiß &amp; Abrieb
                  </div>
                  <ul className="space-y-2 text-slate-700">
                    <li>
                      <strong>Prinzip 5 (PR):</strong> Applikation von verschleißfesten Hartstoffestrichen nach DIN 18560 oder Reaktionsharzmörtelbelägen.
                    </li>
                    <li>
                      <strong>Oberflächenschutzsystem OS 8:</strong> Starre Epoxidharzbeschichtung mit dichter Quarzsandabstreuung (0,4–0,8 mm) und Kopfversiegelung für befahrbare Industrieböden und Rampen.
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ModuleFooter */}
      <ModuleFooter
        weblinks={[
          { title: "DIBt - Deutsches Institut für Bautechnik (TR Instandhaltung)", url: "https://www.dibt.de" },
          { title: "DAfStb - Deutscher Ausschuss für Stahlbeton", url: "https://www.dafstb.de" },
          { title: "Bundesgütegemeinschaft Instandsetzung von Betonbauwerken e.V.", url: "https://www.betoninstandsetzer.de" }
        ]}
        wikipedia={[
          { title: "Betoninstandsetzung", url: "https://de.wikipedia.org/wiki/Betoninstandsetzung" },
          { title: "Kathodischer Korrosionsschutz", url: "https://de.wikipedia.org/wiki/Kathodischer_Korrosionsschutz" },
          { title: "Oberflächenschutzsystem", url: "https://de.wikipedia.org/wiki/Oberfl%C3%A4chenschutzsystem" }
        ]}
        literatur={[
          'Raupach, M.; Orlowsky, J. (2015): Schutz und Instandsetzung von Stahlbetonbauten (Bauwerk Verlag)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Tuutti, K. (1982): Corrosion of steel in concrete. Swedish Cement and Concrete Research Institute'
        ]}
        regelwerke={[
          { title: 'DIN EN 1504-9:2008-11 (Produkte und Systeme für den Schutz und die Instandsetzung von Betontragwerken - Allgemeine Grundsätze für die Anwendung von Produkten und Systemen)', url: 'https://www.dinmedia.de/' },
          { title: 'TR Instandhaltung:2020-05 (DIBt: Technische Regel Instandhaltung von Betonbauwerken)', url: 'https://www.dibt.de/' },
          { title: 'DIN 31051:2019-06 (Grundlagen der Instandhaltung)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN ISO 12696:2022-09 (Kathodischer Korrosionsschutz von Stahl in Beton)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 14038-1:2021-03 (Elektrochemische Realkalisierung und Chloridextraktionsbehandlungen für bewehrten Beton - Teil 1: Chloridextraktion)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 14038-2:2020-09 (Elektrochemische Realkalisierung und Chloridextraktionsbehandlungen für bewehrten Beton - Teil 2: Realkalisierung)', url: 'https://www.dinmedia.de/' }
        ]}
        formeln={[
          {
            formel: 't_{\\text{service}} = t_0 + t_1 = \\left(\\frac{c}{k}\\right)^2 + \\frac{\\Delta d_{\\text{krit}}}{v_{\\text{korr}}}',
            erklaerung: 'Tuutti-Degradationsmodell der Lebensdauer: Summe aus Initiierungszeit t₀ (Diffusionsdauer bis zum Erreichen der kritischen Depassivierungstiefe bei Betondeckung c und Diffusionskoeffizient k) und Propagationszeit t₁ (aktive Korrosionsphase bis zum kritischen Querschnittsverlust).',
            quelle: 'Tuutti (1982) / Dauerhaftigkeitsbemessung'
          },
          {
            formel: 'K_n = K_0 \\cdot 5^n',
            erklaerung: 'De-Sitter-Regel ("Law of Fives"): Phasen: Entwurf und Bau (1) – vor Schadensbeginn (5) – Schadensfortschritt lokal (25) – umfassende Instandsetzung (125). Jeder Euro im Entwurf spart exponentielle Folgekosten.',
            quelle: 'De Sitter (1984)'
          },
          {
            formel: 'E_{\\text{off}} \\le -720\\,\\text{mV}_{\\text{Ag/AgCl/0.5M KCl}} \\quad \\text{oder} \\quad \\Delta E_{\\text{depol}} \\ge 100\\,\\text{mV}',
            erklaerung: 'KKS-Schutzkriterien (DIN EN ISO 12696): Ausschaltpotential negativer als −720 mV gegen Ag/AgCl/0,5 M KCl ODER Depolarisation ≥ 100 mV innerhalb von 24 h bis 72 h (-850 mV gegen CSE gilt für erdberührte Stähle).',
            quelle: 'DIN EN ISO 12696'
          }
        ]}
      />
    </div>
  );
}

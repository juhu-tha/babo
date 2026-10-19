import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  PhoneCall,
  CheckCircle2,
  HardHat,
  Eye,
  Ear,
  Wind,
  Flame,
  Zap,
  Ban,
  FileText,
  Printer,
  BookOpen,
  Box
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { BlockMath, InlineMath } from 'react-katex';

export type LaborTab = 'uebersicht' | 'regeln' | 'psa' | 'maschinen' | 'gefahrstoffe' | 'notfall';

export default function LaborSicherheit() {
  const [activeTab, setActiveTab] = useState<LaborTab>('uebersicht');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* 1. Header & Quick Info Container */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-home-grau/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-shiraz/10 text-shiraz rounded-xl">
              <ShieldAlert size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-shiraz text-white">
                  Cluster VI · Studium &amp; Lehre: Baustofflabor
                </span>
                <span className="text-xs text-text-main/60 font-semibold">
                  Gebäude G2 · TH Augsburg
                </span>
              </div>
              <h2 className="text-2xl font-bold text-text-main mt-0.5">
                SICHERHEIT IM BAUSTOFFLABOR
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-text-main bg-off-white hover:bg-home-grau/20 border border-home-grau/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Sicherheitsordnung ausdrucken"
            >
              <Printer size={15} /> Aushang drucken
            </button>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              Gültig ab WS 2026/27
            </span>
          </div>
        </div>

        {/* Institution & Laborleitung Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs">
          <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
            <span className="text-text-main/60 block font-medium">Einrichtung &amp; Fakultät</span>
            <strong className="text-text-main text-sm block">Labor für Baustofftechnologie, Umwelt und Chemie</strong>
            <span className="text-text-main/80 text-[11px]">Fakultät für Architektur und Bauwesen · TH Augsburg</span>
          </div>
          <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
            <span className="text-text-main/60 block font-medium">Laborleitung</span>
            <strong className="text-shiraz text-sm block">Prof. Dr.-Ing. Jürgen Huber</strong>
            <span className="text-text-main/80 text-[11px]">Raum C2.10 / G2-1.21 · Tel. (0821) 5586-3710</span>
          </div>
          <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 text-rose-950">
            <span className="text-rose-700 block font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
              <PhoneCall size={12} /> Notruf &amp; Ersthelfer G2
            </span>
            <strong className="text-rose-900 text-sm block">Notruf 112 (Festnetz: 0-112)</strong>
            <span className="text-rose-800 text-[11px]">Ersthelferin: Silvia Lechner (-3220) | Sedlmeier (-3127)</span>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-home-grau/20">
          {[
            { id: 'uebersicht', label: 'Übersicht & Laborordnung', icon: FileText },
            { id: 'regeln', label: 'Die 8 Sicherheitsregeln', icon: ShieldAlert },
            { id: 'psa', label: 'PSA & Einzugsgefahr', icon: HardHat },
            { id: 'maschinen', label: 'Sperrgeräte & Maschinen', icon: Zap },
            { id: 'gefahrstoffe', label: 'Gefahrstoffe (Zement/Staub)', icon: Flame },
            { id: 'notfall', label: 'Notfallmaßnahmen (Gebäude G2)', icon: AlertTriangle, badge: '112' }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as LaborTab)}
                className={`px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
                }`}
              >
                <Icon size={14} className={activeTab === tab.id ? 'text-white' : 'text-shiraz'} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800 font-bold'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: ÜBERSICHT */}
      {activeTab === 'uebersicht' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <BookOpen className="text-shiraz" size={20} />
                Präambel: Sicherheitsphilosophie im Baustofflabor
              </h3>
              <span className="text-xs text-text-main/60">DGUV Information 213-850 &amp; DGUV Vorschrift 1</span>
            </div>

            <p className="text-sm text-text-main/80 leading-relaxed">
              Das <strong>Baustofflabor der Technischen Hochschule Augsburg</strong> ist eine forschungs- und prüfintensive Arbeitsumgebung. Hier wirken schwere mechanische Kräfte (Großprüfpressen bis 5.000 kN), rotierende Werkzeuge (Steinsägen, Kernbohrer, Zwangsmischer), schwebende Lasten (Brückenkrane, Flurförderzeuge) und chemische Einwirkungen (stark ätzender Zementleim pH &gt; 12, lungengängiger krebserzeugender Quarzfeinstaub, Epoxidharz-Systeme).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-950 flex flex-col gap-2">
                <strong className="text-amber-900 flex items-center gap-1.5 text-sm">
                  <AlertTriangle size={16} className="text-amber-700" /> Wichtigste Grundregel: Aufsicht &amp; Stopp-Gebot
                </strong>
                <p className="text-xs leading-relaxed text-amber-900/90">
                  Mitarbeitende haben im Labor die <strong>volle Aufsichts- und Eingriffspflicht</strong> gegenüber Studierenden. Werden Sicherheitsregeln missachtet, fehlt die vorgeschriebene PSA oder wird unsicher gearbeitet, ist der Versuch <strong>sofort zu stoppen!</strong>
                </p>
              </div>

              <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl text-rose-950 flex flex-col gap-2">
                <strong className="text-rose-900 flex items-center gap-1.5 text-sm">
                  <Ban size={16} className="text-rose-700" /> Striktes Alleinarbeitsverbot
                </strong>
                <p className="text-xs leading-relaxed text-rose-900/90">
                  Striktes Alleinarbeitsverbot bei allen Arbeiten an Maschinen (Prüfpressen, Sägen, Bohrer, Mischer, Brecher) sowie beim Umgang mit Kran und Stapler/Ameise. <strong>Es muss immer eine zweite Person in Ruf- und Sichtweite sein!</strong>
                </p>
              </div>
            </div>

            {/* Quick Overview Table of the 8 Rules */}
            <div className="mt-2 overflow-x-auto">
              <h4 className="text-sm font-bold text-text-main mb-2">Die 8 Säulen der Laborsicherheit auf einen Blick</h4>
              <table className="w-full text-left text-xs border border-home-grau/25 rounded-xl overflow-hidden min-w-[600px]">
                <thead className="bg-off-white text-text-main border-b border-home-grau/20">
                  <tr>
                    <th className="py-2.5 px-3 font-bold w-12">Nr.</th>
                    <th className="py-2.5 px-4 font-bold">Sicherheitsbereich</th>
                    <th className="py-2.5 px-4 font-bold">Verbindliche Kernanforderung</th>
                    <th className="py-2.5 px-3 font-bold">Zuständigkeit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/15">
                  <tr className="hover:bg-home-grau/5">
                    <td className="py-2.5 px-3 font-bold text-shiraz">1</td>
                    <td className="py-2.5 px-4 font-bold">Aufsichtspflicht &amp; Stopp-Gebot</td>
                    <td className="py-2.5 px-4 text-text-main/80">Volle Aufsichtspflicht; sofortiger Abbruch bei Sicherheitsverstößen</td>
                    <td className="py-2.5 px-3 font-mono">Dozierende / Betreuer</td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="py-2.5 px-3 font-bold text-shiraz">2</td>
                    <td className="py-2.5 px-4 font-bold">Zutritt &amp; Alleinarbeitsverbot</td>
                    <td className="py-2.5 px-4 text-text-main/80">Kein Zutritt für Unbefugte; 2. Person bei Maschinen &amp; Hebezeugen zwingend</td>
                    <td className="py-2.5 px-3 font-mono">Alle Personen</td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="py-2.5 px-3 font-bold text-shiraz">3</td>
                    <td className="py-2.5 px-4 font-bold">Geräteberechtigung (Sperrgeräte)</td>
                    <td className="py-2.5 px-4 text-text-main/80">Bedienung von Großgeräten nur durch namentlich berechtigtes Personal</td>
                    <td className="py-2.5 px-3 font-mono">Fachpersonal</td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="py-2.5 px-3 font-bold text-shiraz">4</td>
                    <td className="py-2.5 px-4 font-bold">Persönliche Schutzausrüstung (PSA)</td>
                    <td className="py-2.5 px-4 text-text-main/80">S3-Schuhe, Brille, Gehör-, Atem- &amp; Handschutz; <strong>Handschuhverbot an rotierenden Teilen!</strong></td>
                    <td className="py-2.5 px-3 font-mono">Alle im Labor</td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="py-2.5 px-3 font-bold text-shiraz">5</td>
                    <td className="py-2.5 px-4 font-bold">Prüfpressen, Sägen &amp; Mischer</td>
                    <td className="py-2.5 px-4 text-text-main/80">Splitterschutz schließen, Nassschnitt (Quarz!), Schutzgitter nicht überbrücken</td>
                    <td className="py-2.5 px-3 font-mono">Bedienende</td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="py-2.5 px-3 font-bold text-shiraz">6</td>
                    <td className="py-2.5 px-4 font-bold">Kran, Hebezeuge &amp; Flurförderzeuge</td>
                    <td className="py-2.5 px-4 text-text-main/80">Nie unter schwebende Lasten treten, Gurte vorab prüfen, Schrittgeschwindigkeit</td>
                    <td className="py-2.5 px-3 font-mono">Kran-/Staplerschein</td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="py-2.5 px-3 font-bold text-shiraz">7</td>
                    <td className="py-2.5 px-4 font-bold">Gefahrstoffe (Zement &amp; Quarzstaub)</td>
                    <td className="py-2.5 px-4 text-text-main/80">Zement pH &gt; 12 ätzend (Augendusche 15 min), striktes Trockenkehrverbot, keine Schadstoffproben</td>
                    <td className="py-2.5 px-3 font-mono">Alle Personen</td>
                  </tr>
                  <tr className="hover:bg-home-grau/5">
                    <td className="py-2.5 px-3 font-bold text-shiraz">8</td>
                    <td className="py-2.5 px-4 font-bold">Ordnung, Hygiene &amp; Elektrik</td>
                    <td className="py-2.5 px-4 text-text-main/80">Absolutes Ess-, Trink- und Rauchverbot; Fluchtwege freihalten; defekte Kabel melden</td>
                    <td className="py-2.5 px-3 font-mono">Alle Personen</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIE 8 SICHERHEITSREGELN (VOLLSTÄNDIGER TEXT) */}
      {activeTab === 'regeln' && (
        <div className="flex flex-col gap-5 animate-in fade-in duration-200">
          
          {/* Regel 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5 border-b border-home-grau/20 pb-2">
              <span className="w-7 h-7 rounded-lg bg-shiraz text-white font-bold text-sm flex items-center justify-center">1</span>
              <h3 className="text-base font-bold text-text-main">
                Volle Aufsichtspflicht &amp; Stopp-Gebot bei Praktika
              </h3>
            </div>
            <p className="text-sm text-text-main/85 leading-relaxed bg-off-white p-4 rounded-xl border border-home-grau/20">
              Mitarbeitende haben im Labor die <strong>volle Aufsichts- und Eingriffspflicht</strong> gegenüber Studierenden. Werden Sicherheitsregeln missachtet, fehlt die vorgeschriebene PSA oder wird unsicher gearbeitet, ist der <strong>Versuch sofort zu stoppen!</strong>
            </p>
            <div className="text-xs text-text-main/70 flex items-center gap-2 mt-1">
              <span className="font-semibold text-shiraz">Konsequenz:</span>
              <span>Wiederaufnahme der Versuche erst nach vollständiger Behebung des Sicherheitsmangels und ausdrücklicher Freigabe durch das Laborpersonal.</span>
            </div>
          </div>

          {/* Regel 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5 border-b border-home-grau/20 pb-2">
              <span className="w-7 h-7 rounded-lg bg-shiraz text-white font-bold text-sm flex items-center justify-center">2</span>
              <h3 className="text-base font-bold text-text-main">
                Zutrittskontrolle &amp; Striktes Alleinarbeitsverbot
              </h3>
            </div>
            <p className="text-sm text-text-main/85 leading-relaxed bg-off-white p-4 rounded-xl border border-home-grau/20">
              Zutritt zum Labor nur für <strong>Befugte und unterwiesene Personen</strong>. Türen bei Abwesenheit stets verschließen.<br />
              <strong>Striktes Alleinarbeitsverbot</strong> bei allen Arbeiten an Maschinen (Prüfpressen, Sägen, Bohrer, Mischer, Brecher) sowie beim Umgang mit Kran und Stapler/Ameise. Es muss <strong>immer eine zweite Person in Ruf-/Sichtweite</strong> sein!
            </p>
          </div>

          {/* Regel 3 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5 border-b border-home-grau/20 pb-2">
              <span className="w-7 h-7 rounded-lg bg-shiraz text-white font-bold text-sm flex items-center justify-center">3</span>
              <h3 className="text-base font-bold text-text-main">
                Geräteberechtigung beachten (Sperrgeräte)
              </h3>
            </div>
            <p className="text-sm text-text-main/85 leading-relaxed bg-off-white p-4 rounded-xl border border-home-grau/20">
              Steinsägen, Kernbohrgeräte, Großprüfpressen, Brecher, Krananlagen und Flurförderzeuge (Stapler/Ameise) dürfen nur von <strong>namentlich berechtigten und eingewiesenen Personen</strong> bedient werden! <strong>Keine selbstständige Nutzung durch Studierende!</strong>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1 text-xs">
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-medium border border-slate-200">⛔ Steinsägen (Nassschnitt)</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-medium border border-slate-200">⛔ Kernbohrgeräte</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-medium border border-slate-200">⛔ Großprüfpressen</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-medium border border-slate-200">⛔ Backenbrecher</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-medium border border-slate-200">⛔ Brückenkran</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-medium border border-slate-200">⛔ Stapler &amp; E-Ameise</span>
            </div>
          </div>

          {/* Regel 4 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3">
            <div className="flex items-center gap-2.5 border-b border-home-grau/20 pb-2">
              <span className="w-7 h-7 rounded-lg bg-shiraz text-white font-bold text-sm flex items-center justify-center">4</span>
              <h3 className="text-base font-bold text-text-main">
                Persönliche Schutzausrüstung (PSA) konsequent tragen
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-2.5">
                <HardHat className="text-shiraz shrink-0 mt-0.5" size={18} />
                <div>
                  <strong className="text-text-main block">Sicherheitsschuhe (S3):</strong>
                  <span className="text-text-main/80">Pflicht in der gesamten Prüfhalle und beim Material-/Probentransport. Stahlkappe &amp; Durchtrittschutz zwingend.</span>
                </div>
              </div>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-2.5">
                <Eye className="text-shiraz shrink-0 mt-0.5" size={18} />
                <div>
                  <strong className="text-text-main block">Schutzbrille:</strong>
                  <span className="text-text-main/80">Pflicht beim Mischen, Umgang mit Zement/Harzen, Sägen, Bohren und an Prüfpressen (Splitterschutz).</span>
                </div>
              </div>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-2.5">
                <Ear className="text-shiraz shrink-0 mt-0.5" size={18} />
                <div>
                  <strong className="text-text-main block">Gehörschutz:</strong>
                  <span className="text-text-main/80">Pflicht beim Sägen, Rütteln (Rütteltisch), Brechen, Sieben und bei lauten Bruchprüfungen (&gt; 85 dB(A)).</span>
                </div>
              </div>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-2.5">
                <Wind className="text-shiraz shrink-0 mt-0.5" size={18} />
                <div>
                  <strong className="text-text-main block">Atemschutz (FFP2/FFP3):</strong>
                  <span className="text-text-main/80">Pflicht beim Abwiegen/Umfüllen von Zement, Zusatzstoffen (z. B. Pflanzenkohle, Silikastaub) und Gesteinskörnung.</span>
                </div>
              </div>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex items-start gap-2.5 md:col-span-2">
                <ShieldCheck className="text-shiraz shrink-0 mt-0.5" size={18} />
                <div>
                  <strong className="text-text-main block">Handschuhe:</strong>
                  <span className="text-text-main/80">Wasserdichte Nitrilhandschuhe bei Frischbeton/Zement und Epoxidharzen (Chemikalien- und Alkalischutz).</span>
                </div>
              </div>
            </div>

            {/* Rot-markierte Alarm-Box zur Einzugsgefahr */}
            <div className="p-4 bg-rose-50 border-2 border-rose-400 rounded-xl text-rose-950 flex flex-col gap-1.5 mt-1">
              <strong className="text-rose-900 font-extrabold text-sm flex items-center gap-2">
                <Ban size={18} className="text-rose-700" />
                ACHTUNG: Absolutes Handschuh-, Ring- und Uhrenverbot an rotierenden Maschinen!
              </strong>
              <p className="text-xs leading-relaxed text-rose-900 font-medium">
                An rotierenden Maschinen (Steinsäge, Kernbohrer, Zwangsmischer, Dreh- und Bohrmaschinen) gilt ein <strong>striktes Verbot von Handschuhen, Ringen, Uhren und Armbändern</strong> wegen akuter Einzugs- und Amputationsgefahr! <strong>Lange Haare sind zwingend mit einem Haargummi zusammenzubinden</strong> oder unter einer Mütze zu verstauen!
              </p>
            </div>
          </div>

          {/* Regel 5 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5 border-b border-home-grau/20 pb-2">
              <span className="w-7 h-7 rounded-lg bg-shiraz text-white font-bold text-sm flex items-center justify-center">5</span>
              <h3 className="text-base font-bold text-text-main">
                Sicherheit an Prüfpressen, Sägen &amp; Mischern
              </h3>
            </div>
            <div className="space-y-2 text-xs leading-relaxed">
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                <strong className="text-text-main block mb-0.5">Prüfpressen:</strong>
                Prüfkörper zentrisch einbauen. Vor Lastaufbringung <strong>Splitterschutz vollständig schließen!</strong> Niemals bei laufender Maschine zwischen die Druckplatten greifen (extreme Quetschgefahr &amp; Explosionsbruch bei hochfesten Betonen!).
              </div>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                <strong className="text-text-main block mb-0.5">Steinsägen:</strong>
                Nur im <strong>Nassschnitt</strong> arbeiten (Vermeidung krebserzeugenden Quarzfeinstaubs!). Werkstücke fest einspannen, <strong>niemals freihändig führen</strong>. Elektrischer Betrieb nur über FI-Schutzschalter (PRCD-S).
              </div>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                <strong className="text-text-main block mb-0.5">Mischer &amp; Brecher:</strong>
                Schutzgitter niemals überbrücken. Vor dem Reinigen <strong>Netzstecker ziehen / Hauptschalter aus!</strong>
              </div>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                <strong className="text-text-main block mb-0.5">Trockenschränke:</strong>
                Niemals brennbare Flüssigkeiten oder Lösemittel im Wärmeschrank trocknen (akute <strong>Explosionsgefahr!</strong>).
              </div>
            </div>
          </div>

          {/* Regel 6 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5 border-b border-home-grau/20 pb-2">
              <span className="w-7 h-7 rounded-lg bg-shiraz text-white font-bold text-sm flex items-center justify-center">6</span>
              <h3 className="text-base font-bold text-text-main">
                Kran, Hebezeuge &amp; Flurförderzeuge (Stapler / Ameise)
              </h3>
            </div>
            <div className="space-y-2 text-xs leading-relaxed">
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                <strong className="text-text-main block mb-0.5">Sichtprüfung vor Arbeitsbeginn:</strong>
                Vor Gebrauch Kran, Lasthaken und Anschlagmittel (Schlingen/Gurte) auf Risse, Einschnitte oder Verschleiß prüfen. Beschädigte Gurte sofort aussortieren und unbrauchbar machen!
              </div>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                <strong className="text-shiraz block mb-0.5">Gefahrenbereich:</strong>
                <strong>Niemals unter schwebende Lasten treten!</strong> Studierende sofort aus dem Schwenk- und Gefahrenbereich verweisen.
              </div>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                <strong className="text-text-main block mb-0.5">Stapler &amp; E-Ameise:</strong>
                Nur mit gültiger Berechtigung fahren. Gabeln beim Fahren stets bodennah absenken (ca. 10–20 cm), Schrittgeschwindigkeit einhalten, beim Verlassen Schlüssel abziehen. <strong>Keine Personen auf Gabeln oder Paletten anheben!</strong>
              </div>
            </div>
          </div>

          {/* Regel 7 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5 border-b border-home-grau/20 pb-2">
              <span className="w-7 h-7 rounded-lg bg-shiraz text-white font-bold text-sm flex items-center justify-center">7</span>
              <h3 className="text-base font-bold text-text-main">
                Gefahrstoffe: Zement, Quarzstaub &amp; Epoxidharze
              </h3>
            </div>
            <div className="space-y-2 text-xs leading-relaxed">
              <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-200">
                <strong className="text-rose-900 block mb-0.5">Zement / Frischbeton ist stark ätzend (pH &gt; 12):</strong>
                Verursacht schwere Augenschäden und Hautverätzungen (Zementdermatitis / Zementbrand). Spritzer sofort mit viel Wasser abwaschen; bei Augenkontakt <strong>sofort 10–15 Minuten mit der Augendusche spülen</strong> und umgehend zum Augenarzt!
              </div>
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200">
                <strong className="text-amber-900 block mb-0.5">Quarzfeinstaub ist krebserzeugend (Alveolengängige Fraktion A-Staub):</strong>
                Immer Punktabsaugung nutzen. <strong>Absolutes Trockenkehrverbot (kein Besen!) und Abblasverbot mit Druckluft!</strong> Boden und Maschinen nur nass reinigen oder mit zugelassenem Industriestaubsauger (Staubklasse M oder H) absaugen.
              </div>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                <strong className="text-text-main block mb-0.5">Keine Schadstoffproben im Baustofflabor:</strong>
                Kontaminierte Verdachtsproben (z. B. Asbest, Teer/PAK, PCB, toxischer Schimmel) <strong>dürfen im Labor nicht mechanisch bearbeitet werden!</strong> (Zerkleinern, Sägen oder Brechen verboten!).
              </div>
            </div>
          </div>

          {/* Regel 8 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5 border-b border-home-grau/20 pb-2">
              <span className="w-7 h-7 rounded-lg bg-shiraz text-white font-bold text-sm flex items-center justify-center">8</span>
              <h3 className="text-base font-bold text-text-main">
                Ordnung, Hygiene &amp; Elektrik
              </h3>
            </div>
            <div className="space-y-2 text-xs leading-relaxed">
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                <strong className="text-text-main block mb-0.5">Nahrungs- &amp; Genussmittelverbot:</strong>
                <strong>Kein Essen, Trinken oder Rauchen im Labor!</strong> Keine Lebensmittel in Laborkühlschränken oder Laborgefäßen lagern! Vor Pausen Hände gründlich waschen.
              </div>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                <strong className="text-text-main block mb-0.5">Fluchtwege &amp; Rettungseinrichtungen:</strong>
                Fluchtwege, Feuerlöscher, Notduschen und Not-Aus-Taster stets vollständig freihalten. Wasser- und Öllachen sofort aufwischen (Rutsch- und Sturzgefahr).
              </div>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20">
                <strong className="text-text-main block mb-0.5">Elektrische Sicherheit:</strong>
                Elektrische Geräte vor Gebrauch auf Kabelschäden oder lose Gehäuse prüfen. Defekte Geräte sofort ausstecken, gut sichtbar als <strong>„DEFEKT“</strong> markieren und dem Laborpersonal melden.
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: PSA & EINZUGSGEFAHR */}
      {activeTab === 'psa' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2 border-b border-home-grau/20 pb-3">
              <HardHat className="text-shiraz" size={20} />
              Persönliche Schutzausrüstung (PSA) – Ausstattungsleitfaden
            </h3>

            {/* Alarm Box */}
            <div className="p-5 bg-rose-50 border-2 border-rose-400 rounded-2xl text-rose-950 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-base">
                <Ban size={22} className="text-rose-700" />
                HÖCHSTE VORSICHT: Rotierende Wellen &amp; Spindeln
              </div>
              <p className="text-xs leading-relaxed text-rose-950">
                <strong>An allen rotierenden Maschinen</strong> (Steintrennsägen, Kernbohrgeräten, Bohrmaschinen, Rührwerken, Trommel- und Zwangsmischern) gilt ein <strong>absolutes Verbot für Handschuhe, Ringe, Ketten, Armbanduhren und lose Kleidung</strong>! Der Stoff oder Handschuh kann sich in Sekundenschnelle um die Welle wickeln und die Hand oder Finger einziehen.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-rose-200 text-xs">
                <span className="flex items-center gap-1.5 font-bold text-rose-900">
                  <CheckCircle2 size={14} className="text-rose-700" /> Haare fest zusammenbinden
                </span>
                <span className="flex items-center gap-1.5 font-bold text-rose-900">
                  <CheckCircle2 size={14} className="text-rose-700" /> Ärmel nach innen umschlagen
                </span>
              </div>
            </div>

            {/* PSA Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-text-main flex items-center gap-2">
                    <Box size={16} className="text-shiraz" /> Sicherheitsschuhe S3
                  </strong>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-home-grau/30">Dauerpflicht</span>
                </div>
                <p className="text-xs text-text-main/80">
                  Ausstattung mit Zehenschutzkappe (200 J) und durchtrittsicherer Sohle. Pflicht in der gesamten Prüfhalle und im Außenlager sowie beim Transport von Betonprobekörpern (Würfel 15 cm ≈ 8 kg).
                </p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-text-main flex items-center gap-2">
                    <Eye size={16} className="text-shiraz" /> Schutzbrille mit Seitenschutz
                  </strong>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-home-grau/30">EN 166</span>
                </div>
                <p className="text-xs text-text-main/80">
                  Schützt gegen Zementspritzer, Harze und umherfliegende Betonsplitter bei Druck- und Biegeversuchen sowie beim Zuschneiden von Probekörpern.
                </p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-text-main flex items-center gap-2">
                    <Ear size={16} className="text-shiraz" /> Kapsel- oder Stöpsel-Gehörschutz
                  </strong>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-home-grau/30">Ab 85 dB(A)</span>
                </div>
                <p className="text-xs text-text-main/80">
                  Pflicht beim Betrieb von Steintrennsägen, Rütteltischen, Siebmaschinen, Brechern sowie bei Bruchprüfungen hochfester Betone.
                </p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-text-main flex items-center gap-2">
                    <Wind size={16} className="text-shiraz" /> Atemschutzmaske FFP2 / FFP3
                  </strong>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-home-grau/30">Partikelfilter</span>
                </div>
                <p className="text-xs text-text-main/80">
                  Zwingend beim Einwiegen und Umfüllen von Zementen, Bindemitteln, Flugaschen, Quarzmehl, Silikastaub und Pflanzenkohle.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SPERRGERÄTE & MASCHINEN */}
      {activeTab === 'maschinen' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Zap className="text-shiraz" size={20} />
                Sperrgeräte &amp; Maschinenrichtlinien
              </h3>
              <span className="text-xs text-shiraz font-bold bg-shiraz/10 px-2.5 py-1 rounded-lg">
                Keine selbstständige Nutzung durch Studierende!
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Prüfpressen */}
              <div className="p-5 bg-off-white rounded-xl border border-home-grau/20 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-text-main text-sm">Großprüfpressen (Druck &amp; Biegung)</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">5.000 kN</span>
                </div>
                <ul className="text-xs text-text-main/80 space-y-1.5 list-disc pl-4 mt-1">
                  <li><strong>Zentrischer Einbau:</strong> Probekörper exakt auf der Markierung mittig ausrichten. Exzentrizität führt zu schlagartigem Kantenbruch und Pressenschäden.</li>
                  <li><strong>Splitterschutz:</strong> Schutzgitter / Schutzhaube vor Start des Druckaufbaus <strong>vollständig verriegeln!</strong></li>
                  <li><strong>Quetschgefahr:</strong> Niemals während der Annäherung oder des Versuchs mit Händen oder Werkzeugen zwischen die Druckplatten fassen.</li>
                  <li><strong>Explosionsbruch:</strong> Hochfeste Betone (ab C50/60) und UHPC brechen schlagartig unter Freisetzung enormer Verformungsenergie.</li>
                </ul>
              </div>

              {/* Steinsägen */}
              <div className="p-5 bg-off-white rounded-xl border border-home-grau/20 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-text-main text-sm">Steintrennsägen &amp; Bohrer</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">Diamantwerkzeuge</span>
                </div>
                <ul className="text-xs text-text-main/80 space-y-1.5 list-disc pl-4 mt-1">
                  <li><strong>Ausschließlich Nassschnitt:</strong> Kühlwasserzufuhr vor Schnittbeginn aktivieren. Trockenschnitt ist wegen massiver Quarzstaubfreisetzung strengstens verboten.</li>
                  <li><strong>Werkstückspannung:</strong> Betonwürfel, Bohrkerne oder Ziegel zwingend mit der Spannvorrichtung fest fixieren. <strong>Freihändiges Führen ist verboten!</strong></li>
                  <li><strong>FI-Schutz (PRCD-S):</strong> Elektrischer Anschluss nur über personengeschützte Fehlerstrom-Schutzeinrichtungen.</li>
                  <li><strong>Handschuhverbot:</strong> Niemals mit Handschuhen an die Trennscheibe herantreten.</li>
                </ul>
              </div>

              {/* Mischer & Brecher */}
              <div className="p-5 bg-off-white rounded-xl border border-home-grau/20 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-text-main text-sm">Betonmischer &amp; Backenbrecher</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Zwangsmischer</span>
                </div>
                <ul className="text-xs text-text-main/80 space-y-1.5 list-disc pl-4 mt-1">
                  <li><strong>Schutzgitter-Überbrückung verboten:</strong> Der Sicherheitsschalter am Deckel/Gitter darf unter keinen Umständen manipuliert oder überbrückt werden.</li>
                  <li><strong>Reinigung &amp; Wartung:</strong> Vor dem Auskratzen oder Reinigen der Mischwerkzeuge zwingend den <strong>Netzstecker ziehen</strong> bzw. den Reparaturschalter auf „0“ sichern.</li>
                  <li><strong>Zuschläge einfüllen:</strong> Gesteinskörnungen vorsichtig einfüllen, keine Schaufeln oder Kellen in die laufende Mischtrommel halten!</li>
                </ul>
              </div>

              {/* Kran & Flurförderzeuge */}
              <div className="p-5 bg-off-white rounded-xl border border-home-grau/20 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-text-main text-sm">Brückenkran &amp; Flurförderzeuge</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">Hebezeuge</span>
                </div>
                <ul className="text-xs text-text-main/80 space-y-1.5 list-disc pl-4 mt-1">
                  <li><strong>Anschlagmittel-Check:</strong> Hebebänder, Rundschlingen und Ketten vor jeder Benutzung visuell auf Einrisse oder Knoten prüfen.</li>
                  <li><strong>Absturzbereich meiden:</strong> Niemals unter gehobene Lasten treten. Schwenkradius stets freihalten.</li>
                  <li><strong>Stapler / Elektro-Ameise:</strong> Bedienung nur durch eingewiesene Personen mit Fahrausweis. Transport immer mit bodennaher Gabelstellung. Keine Personenbeförderung!</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GEFAHRSTOFFE */}
      {activeTab === 'gefahrstoffe' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Flame className="text-shiraz" size={20} />
                Gefahrstoffe im Baustofflabor: Toxikologie &amp; Schutz
              </h3>
              <span className="text-xs text-text-main/60">GefStoffV &amp; TRGS 559</span>
            </div>

            <div className="space-y-4">
              
              {/* Zement */}
              <div className="p-5 bg-off-white rounded-xl border border-home-grau/20 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-text-main">1. Zement, Kalk &amp; Frischbeton (pH &gt; 12)</strong>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">Ätzend (GHS05)</span>
                </div>
                <div className="text-xs text-text-main/80 leading-relaxed space-y-2">
                  <p>
                    Bei Kontakt mit Wasser bildet Zement Calciumhydroxid <InlineMath math="Ca(OH)_2" />, wodurch der pH-Wert auf über 12 bis 13 ansteigt. Diese starke Alkalität führt zu tiefgreifenden Gewebsnekrosen auf Haut und Hornhaut.
                  </p>
                  <BlockMath math="\text{pH} = -\log_{10}[H^+] \approx 12{,}5 - 13{,}5 \quad (\text{stark alkalisch / ätzend})" />
                  <div className="p-3 bg-white rounded-lg border border-rose-200 text-rose-950">
                    <strong>Sofortmaßnahme bei Augenkontakt:</strong> Das Auge unverzüglich <strong>10 bis 15 Minuten unter der Augendusche spülen</strong> (Lider mit den Fingern spreizen!). Danach sofort Augenarzt oder Notaufnahme konsultieren!
                  </div>
                </div>
              </div>

              {/* Quarzfeinstaub */}
              <div className="p-5 bg-off-white rounded-xl border border-home-grau/20 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-text-main">2. Quarzfeinstaub (alveolengängige Fraktion A-Staub)</strong>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Krebserzeugend (Kat. 1A)</span>
                </div>
                <div className="text-xs text-text-main/80 leading-relaxed space-y-2">
                  <p>
                    Kristallines Siliciumdioxid (<InlineMath math="\text{SiO}_2" />) in quarzhaltigen Sanden, Betonen und Ziegeln dringt beim Einatmen tief in die Lungenbläschen ein und verursacht Silikose (Quarzstaublunge) sowie Lungenkrebs.
                  </p>
                  <div className="p-3 bg-white rounded-lg border border-amber-200 text-amber-950 font-medium">
                    ⛔ <strong>Striktes Trockenkehrverbot:</strong> Niemals trockenen Staub mit dem Besen kehren oder mit Druckluft abblasen! Reinigung ausschließlich nass oder mit Industriestaubsaugern der Staubklasse M oder H nach TRGS 559.
                  </div>
                </div>
              </div>

              {/* Epoxidharze */}
              <div className="p-5 bg-off-white rounded-xl border border-home-grau/20 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-text-main">3. Reaktionsharze &amp; Epoxidharze (EP / PUR)</strong>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">Sensibilisierend (GHS07/08)</span>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Harz- und Härterkomponenten können schwere Kontaktekzeme und dauerhafte Sensibilisierungen der Atemwege und Haut hervorrufen. Verarbeitung nur unter der Abzugshaube oder bei wirksamer Raumlüftung mit chemikalienbeständigen Einweghandschuhen (Nitril, Dicke beachten).
                </p>
              </div>

              {/* Schadstoffproben */}
              <div className="p-5 bg-rose-50/60 rounded-xl border border-rose-300 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-rose-950">4. Keine Schadstoffproben im Baustofflabor!</strong>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-200 text-rose-900 font-bold">STRIKTES VERBOT</span>
                </div>
                <p className="text-xs text-rose-900 leading-relaxed">
                  Proben mit Verdacht auf <strong>Asbest, PAK (Teerbeläge), PCB (Dichtstoffe), KMF (alte Mineralwolle) oder Schimmelpilzbefall</strong> dürfen im Baustofflabor unter keinen Umständen gesägt, gebohrt, zerkleinert oder erhitzt werden! Die Probenahme und Analytik unterliegt der Gefahrstoffverordnung (TRGS 519 / TRGS 521) und erfordert Speziallabore.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 6: NOTFALLMASSNAHMEN (GEBÄUDE G2) */}
      {activeTab === 'notfall' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-home-grau/20 pb-3">
              <div>
                <h3 className="text-lg font-bold text-rose-900 flex items-center gap-2">
                  <AlertTriangle className="text-shiraz" size={22} />
                  NOTFALL- UND SOFORTMASSNAHMEN (GEBÄUDE G2)
                </h3>
                <span className="text-xs text-text-main/70">
                  Standort: TH Augsburg · Campus am Brunnenlech · An der Hochschule 1 · Gebäude G2 (Erdgeschoss)
                </span>
              </div>
              <div className="px-4 py-2 bg-shiraz text-white font-mono font-bold text-base rounded-xl shadow-xs">
                NOTRUF: 112
              </div>
            </div>

            {/* 5-Schritte Notfall-Kette */}
            <div className="grid grid-cols-1 gap-3.5">
              
              {/* Schritt 1 */}
              <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-600 text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <strong className="text-rose-950 text-sm block">NOT-HALT drücken &amp; Gefahrenbereich sichern</strong>
                  <p className="text-xs text-rose-900 mt-0.5 leading-relaxed">
                    Maschine sofort durch Schlag auf den roten NOT-AUS-Pilztaster stillsetzen! Eigenschutz beachten (keine stromführenden Teile berühren, bei Brandgefahr Raum verlassen).
                  </p>
                </div>
              </div>

              {/* Schritt 2 */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-shiraz text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div className="flex-1">
                  <strong className="text-text-main text-sm block">ERSTE HILFE leisten &amp; Ersthelfer rufen</strong>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-xs">
                    <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                      <span className="text-text-main/60 block text-[10px] font-bold uppercase">Ersthelferin im Labor</span>
                      <strong className="text-text-main block">Silvia Lechner</strong>
                      <span className="text-shiraz font-mono font-bold block">Tel. 0821 5586-3220 (intern -3220)</span>
                      <span className="text-text-main/70 text-[11px]">Raum G2-1.22</span>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                      <span className="text-text-main/60 block text-[10px] font-bold uppercase">Ersthelfer im G2-Bau</span>
                      <strong className="text-text-main block">Michael Sedlmeier</strong>
                      <span className="text-shiraz font-mono font-bold block">Tel. 0821 5586-3127 (intern -3127)</span>
                      <span className="text-text-main/70 text-[11px]">Raum G2-2.22</span>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                      <span className="text-text-main/60 block text-[10px] font-bold uppercase">Laborpersonal</span>
                      <strong className="text-text-main block">Siegfried Hager</strong>
                      <span className="text-shiraz font-mono font-bold block">Tel. -3121</span>
                      <span className="text-text-main/70 text-[11px]">Baustofflabor EG</span>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-home-grau/20">
                      <span className="text-text-main/60 block text-[10px] font-bold uppercase">Laborleitung</span>
                      <strong className="text-text-main block">Prof. Dr.-Ing. Jürgen Huber</strong>
                      <span className="text-shiraz font-mono font-bold block">Tel. -3710</span>
                      <span className="text-text-main/70 text-[11px]">Raum G2-1.21 / C2.10</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schritt 3 */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-shiraz text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div className="flex-1">
                  <strong className="text-text-main text-sm block">NOTRUF 112 wählen (Vom Festnetz ggf. 0-112)</strong>
                  <div className="mt-2 p-3 bg-white rounded-lg border border-home-grau/20 text-xs text-text-main/90 space-y-1">
                    <p><strong>Genaue Ortsangabe für die Leitstelle:</strong></p>
                    <p className="font-mono bg-off-white p-2 rounded text-shiraz font-bold">
                      „Technische Hochschule Augsburg, Campus am Brunnenlech, An der Hochschule 1, Gebäude G2 (Erdgeschoss, Baustofflabor)“
                    </p>
                    <p className="text-[11px] text-text-main/70 pt-1">
                      Die 5 W-Fragen beantworten: <strong>Wo</strong> ist es passiert? <strong>Was</strong> ist geschehen? <strong>Wie viele</strong> Verletzte? <strong>Welche</strong> Verletzungen? <strong>Warten</strong> auf Rückfragen!
                    </p>
                  </div>
                </div>
              </div>

              {/* Schritt 4 */}
              <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-300 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <strong className="text-amber-950 text-sm block">EINWEISER SCHICKEN &amp; Hausservice informieren</strong>
                  <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                    <strong>Zwingend eine Person an die Campuseinfahrt und den Gebäudeeingang G2 stellen</strong>, um den Rettungsdienst oder die Feuerwehr direkt zur Unfallstelle im Erdgeschoss einzuweisen!
                  </p>
                  <div className="mt-2 text-xs text-amber-950 font-medium">
                    Hausservice informieren: <strong>Kai Bolten</strong> (Raum B 0.03a), Tel. <strong>-3720</strong>
                  </div>
                </div>
              </div>

              {/* Schritt 5 */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-700 text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  5
                </div>
                <div>
                  <strong className="text-text-main text-sm block">Dokumentation &amp; D-Arzt (Durchgangsarzt)</strong>
                  <p className="text-xs text-text-main/80 mt-1 leading-relaxed">
                    Jede noch so kleine Verletzung (Schnittwunden, Zementspritzer, Prellungen) muss zwingend in das <strong>Verbandbuch</strong> im Erste-Hilfe-Kasten eingetragen werden (Versicherungsschutz über die Landesunfallkasse / Bayerische Unfallkasse).
                  </p>
                  <p className="text-xs text-shiraz font-bold mt-1">
                    Bei jedem Arztbesuch nach einem Arbeits- oder Praktikumsunfall ist zwingend ein Durchgangsarzt (D-Arzt) aufzusuchen und als Träger die Unfallkasse anzugeben!
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Module Footer with standard DIN/DGUV references */}
      <ModuleFooter
        wikipedia={[
          { title: 'Laborsicherheit', url: 'https://de.wikipedia.org/wiki/Laborsicherheit' },
          { title: 'Persönliche Schutzausrüstung', url: 'https://de.wikipedia.org/wiki/Pers%C3%B6nliche_Schutzausr%C3%BCstung' },
          { title: 'Durchgangsarzt', url: 'https://de.wikipedia.org/wiki/Durchgangsarzt' }
        ]}
        literatur={[
          'DGUV Information 213-850: Sicheres Arbeiten in Laboratorien (Grundlagen und Handlungshilfen). Berlin: Deutsche Gesetzliche Unfallversicherung',
          'DGUV Vorschrift 1: Grundsätze der Prävention. Berlin: Deutsche Gesetzliche Unfallversicherung',
          'Labor- und Betriebsanweisung des Baustofflabors der Technischen Hochschule Augsburg, Gebäude G2, Stand 2026',
          'Gefahrstoffverordnung (GefStoffV) und Betriebssicherheitsverordnung (BetrSichV)'
        ]}
        regelwerke={[
          { title: 'DGUV Information 213-850 (Sicheres Arbeiten in Laboratorien)', url: 'https://publikationen.dguv.de/' },
          { title: 'TRGS 559 (Quarzhaltiger Staub)', url: 'https://www.baua.de/DE/Angebote/Rechtstexte-und-Technische-Regeln/Regelwerk/TRGS/TRGS-559.html' },
          { title: 'DIN EN 166 (Persönlicher Augenschutz – Anforderungen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+166' },
          { title: 'DIN EN ISO 20345 (Sicherheitsschuhe – Kategorie S3)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+20345' },
          { title: 'DGUV Regel 109-009 (Fahrzeuginstandhaltung / Hebebühnen und Krane)', url: 'https://publikationen.dguv.de/' }
        ]}
        formeln={[
          {
            formel: '\\text{pH} = -\\log_{10}[H_3O^+] \\ge 12{,}5 \\quad \\implies \\quad [OH^-] \\ge 0{,}03\\,\\text{mol/l}',
            erklaerung: 'Starke Alkalität des Porenwassers von frischem Zementleim durch gelöstes Calciumhydroxid Ca(OH)₂ und Alkalihydroxide KOH/NaOH; verursacht schwere Ätzschäden an Augen und Haut.',
            quelle: 'DIN EN 197-1 / TRGS 613'
          },
          {
            formel: 'L_{\\text{EX},8h} \\ge 85\\,\\text{dB(A)} \\quad \\implies \\quad \\text{Tragepflicht für Gehörschutz}',
            erklaerung: 'Oberer Auslösewert nach Lärm- und Vibrations-Arbeitsschutzverordnung; wird an Steinsägen, Rütteltischen und Brechern im Baustofflabor regelmäßig überschritten.',
            quelle: 'LärmVibrationsArbSchV § 6'
          }
        ]}
        lastReviewed="Oktober 2026 (Laborordnung & Notfallplan Baustofflabor Gebäude G2, TH Augsburg; geprüft durch Laborleitung Prof. Dr.-Ing. Jürgen Huber)"
      />

    </div>
  );
}

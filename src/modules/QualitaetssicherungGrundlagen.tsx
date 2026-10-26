import React from 'react';
import { ClipboardCheck, FileText, Beaker, Truck, ShieldCheck, UserCheck, Eye } from 'lucide-react';
import inhalt from '@/content/qualitaetssicherunggrundlagen/QualitaetssicherungGrundlagen.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function QualitaetssicherungGrundlagen() {
  return (
    <div className="flex flex-col gap-8">
      

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
          <ClipboardCheck className="text-shiraz" /><MdText text={inhalt.texte.qualitätssicherungAufDerBaustelle} /></h2>
        
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30">
            <p><MdText text={inhalt.texte.eineUmfassendeQualitätssicherungAuf} /></p>
          </div>

          <section>
            <h3 className="text-lg font-bold text-home-prim mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-shiraz" /> Wareneingangskontrolle
            </h3>
            <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 text-sm text-text-main/80">
              <p className="mb-2"><MdText text={inhalt.texte.beiDerAnkunftDes} /></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><MdText text={inhalt.texte.stimmenDieExpositionsklassenAuf} /></li>
                <li><MdText text={inhalt.texte.istDieKorrekteDruckfestigkeitsklasse} /></li>
                <li><MdText text={inhalt.texte.entsprechenKonsistenzklasseZB} /></li>
                <li><MdText text={inhalt.texte.kannDerFahrmischerSpätestens} /></li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-home-prim mb-4 flex items-center gap-2">
              <Beaker className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.bauwerksprüfungenVorOrt} /></h3>
            <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 text-sm text-text-main/80">
              <p className="mb-2"><MdText text={inhalt.texte.vorUndWährendDes} /></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><MdText text={inhalt.texte.ausbreitmaßÜberprüfungDerKonsistenz} /></li>
                <li><MdText text={inhalt.texte.lufttopfMessungDesLuftgehalts} /></li>
                <li><MdText text={inhalt.texte.temperaturmessungKontrolleDerFrischbeton} /></li>
                <li><MdText text={inhalt.texte.probekörperherstellungHerstellenVonPrüfw} /></li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-home-prim mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.protokollierungDokumentation} /></h3>
            <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 text-sm text-text-main/80">
              <p className="mb-2"><MdText text={inhalt.texte.dieVollständigeUndKorrekte} /></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><MdText text={inhalt.texte.betonierprotokolleDokumentierenDieGenaue} /></li>
                <li><MdText text={inhalt.texte.nachbehandlungstagebücherErfassenDieDurc} /></li>
              </ul>
            </div>
          </section>

          {/* New Section: Fremdüberwachung und deren Aufgaben */}
          <section className="mt-4 border-t border-home-grau/20 pt-6">
            <h3 className="text-lg font-bold text-home-prim mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.fremdüberwachungAufDerBaustelle} /></h3>
            
            <div className="bg-emerald-50/40 p-5 rounded-xl border border-emerald-500/20 text-sm text-emerald-950 mb-6 leading-relaxed">
              <p className="mb-2"><MdText text={inhalt.texte.währendDieEigenüberwachungSelbstkontroll} /></p>
              <p className="text-xs text-opacity-90"><MdText text={inhalt.texte.dieseAnerkannteFremdüberwachungsstelleZ} /></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-main/80">
              <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/25 space-y-2">
                <h4 className="font-bold text-shiraz uppercase tracking-wide flex items-center gap-1.5 text-[11px]">
                  <Eye className="w-3.5 h-3.5" /><MdText text={inhalt.texte.t1UnangekündigteBaustellenbegehungen} /></h4>
                <p className="leading-relaxed"><MdText text={inhalt.texte.dieFremdüberwachungFührtIn} /></p>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/25 space-y-2">
                <h4 className="font-bold text-shiraz uppercase tracking-wide flex items-center gap-1.5 text-[11px]">
                  <Beaker className="w-3.5 h-3.5" /><MdText text={inhalt.texte.t2UnabhängigeProbennahmeLabormessung} /></h4>
                <p className="leading-relaxed"><MdText text={inhalt.texte.zusätzlichZuDenProben} /></p>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/25 space-y-2">
                <h4 className="font-bold text-shiraz uppercase tracking-wide flex items-center gap-1.5 text-[11px]">
                  <ClipboardCheck className="w-3.5 h-3.5" /><MdText text={inhalt.texte.t3AuditierungDerEigenbewertungs} /></h4>
                <p className="leading-relaxed"><MdText text={inhalt.texte.konsequentePrüfungDesVollständigen} /></p>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/25 space-y-2">
                <h4 className="font-bold text-shiraz uppercase tracking-wide flex items-center gap-1.5 text-[11px]">
                  <UserCheck className="w-3.5 h-3.5" /><MdText text={inhalt.texte.t4ÜberprüfungDesPersonals} /></h4>
                <p className="leading-relaxed"><MdText text={inhalt.texte.kontrolleObDerVerantwortliche} /></p>
              </div>
            </div>

            <div className="mt-4 bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs space-y-1.5">
              <strong className="text-amber-800 flex items-center gap-1.5"><MdText text={inhalt.texte.konsequenzBeiFestgestelltenMängeln} /></strong>
              <p className="text-stone-700 leading-relaxed"><MdText text={inhalt.texte.stelltDieFremdüberwachungsstelleGraviere} /></p>
            </div>
          </section>
        </div>
      </div>

    </div>
  );
}

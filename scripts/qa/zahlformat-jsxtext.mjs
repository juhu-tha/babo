// AP 2: Dezimalpunkt in reinem JSX-Text (ohne Einheit) → Komma; Versionen/Gliederungsnummern bleiben
import ts from 'typescript'; import fs from 'node:fs'; import path from 'node:path'; import { inhaltsDateien, inhaltsTexte, ohneFormeln, relativ } from './inhaltDateien.mjs';
const ROOT=path.resolve(path.dirname(new URL(import.meta.url).pathname),'../../src'); const files=[];
(function w(d){for(const f of fs.readdirSync(d)){const p=path.join(d,f);fs.statSync(p).isDirectory()?w(p):/\.tsx$/.test(f)&&files.push(p);}})(ROOT);
const PRE=/(Industrie|Web|Version|Vers\.|v|V|BIM|Bau|Level|LOD|Release|HTML|IFC|Python|GPT|Claude|Gemini|Llama|Kap\.|Kapitel|Abschnitt|Abschn\.|Abs\.|Tab\.|Tabelle|Bild|Abb\.|Gl\.|Gleichung|Nr\.|Ziffer|Anhang|Teil|Punkt|§|Schritt|Phase|Stufe|Klasse|LP|Lph\.|Leistungsphase|Kat\.|Typ|Ausgabe|Stand|Formel|Schema|SDG|DIN|EN|ISO|Modul|Lektion|Folie|Seite|S\.)\s*$/;
const RE=/(?<![\d.,\w/:-])(~|≈|ca\. |< ?|> ?|≤ ?|≥ ?|= ?|\(|\s|^)(-?\d+)\.(\d{1,2}|(?<=\b0\.)\d{3,4})(?![\d.]|\.\d|[a-zA-Z]{1,3}\d)/g;
const fixJsx=(t)=>t.replace(RE,(m,pre,a,b,off,str)=>{ const before=str.slice(Math.max(0,off-22),off)+pre; if(PRE.test(before.trimEnd()+' ')||PRE.test(before)) return m; if(/\d\.\d+\.\d/.test(str.slice(off,off+12))) return m;
          { const c=str.slice(Math.max(0,off-40),off)+pre; const k=c.search(/(Gl\.|Gleichung|Kap\.|Kapitel|Abschn|Abschnitt|EC\s?\d|DIN|EN\s?\d|ISO|NA\s?\(DE\)|Anhang|Tab\.|Tabelle|Bild|Abs\.|Ziff)(?![\s\S]*(Gl\.|Kap\.|EC\s?\d|DIN))/); if(k>=0&&!/[=≈]/.test(c.slice(k))) return m; }
          if(/^\(\d+\)/.test(str.slice(off+m.length))) return m; if(/^\d+[a-z]{1,3}\b/.test(str.slice(off+m.length))) return m; if(/^\s*$/.test(str.slice(0,off)+(pre.trim()?'x':''))&&/^\s+[A-ZÄÖÜ]/.test(str.slice(off+m.length))) return m; if(b.length===1&&/^\s[A-ZÄÖÜ][a-zäöü]/.test(str.slice(off+m.length))&&!/[=≈~<>≤≥]\s*$/.test(pre)) return m; if(pre==='('&&/^\d\.\d\)/.test(m.slice(1)+str.slice(off+m.length,off+m.length+1))&&b.length===1) return m; return `${pre}${a},${b}`; });
const MODE=process.argv[2]; let cnt=0;
for(const f of files){ const src=fs.readFileSync(f,'utf8'); const sf=ts.createSourceFile(f,src,99,true,4); const edits=[];
  const v=(n)=>{ if(ts.isJsxText(n)){ const p=n.parent; const tag=ts.isJsxElement(p)?p.openingElement.tagName.getText():'';
      if(!/InlineMath|BlockMath|code|pre|kbd|style|script/.test(tag)){ const t=src.slice(n.getStart(),n.getEnd());
        const o=fixJsx(t);
        if(o!==t){ cnt++; edits.push([n.getStart(),n.getEnd(),o]); if(MODE==='--show') console.log(path.relative(ROOT,f)+':'+(sf.getLineAndCharacterOfPosition(n.getStart()).line+1),'|',t.trim().replace(/\s+/g,' ').slice(0,110),' ⇒ ',o.trim().replace(/\s+/g,' ').slice(0,110)); } } }
    ts.forEachChild(n,v)}; v(sf);
  if(MODE==='--apply'&&edits.length){ let s=src; edits.sort((a,b)=>b[0]-a[0]); for(const [a,b,t] of edits) s=s.slice(0,a)+t+s.slice(b); fs.writeFileSync(f,s);} }
// Ausgelagerte Fachtexte (AP 5.3): „texte“ in content/**/*.json stammen aus JSX-Text → gleiche Regel (ohne $…$-Formeln, nur Prüfung)
for(const datei of inhaltsDateien()) for(const t of inhaltsTexte(datei)){ if(t.gruppe!=='texte') continue;
  const s=ohneFormeln(t.text).replace(/`[^`]*`/g,' '); if(fixJsx(s)!==s){ cnt++; if(MODE==='--show'||MODE==='--check') console.log(relativ(datei),'['+t.schluessel+'] |',s.slice(0,110)); } }
console.log('JSX-Texte mit Dezimalpunkt:',cnt); if(MODE==='--check') process.exit(cnt?1:0);

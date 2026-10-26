// AP 2: Dezimalpunkt → Dezimalkomma in Anzeige-Texten (nur Zahl+Einheit, keine 3er-Gruppen)
import ts from 'typescript'; import fs from 'fs'; import path from 'path'; import { inhaltsDateien, inhaltsTexte, relativ } from './inhaltDateien.mjs';
const ROOT=path.resolve(path.dirname(new URL(import.meta.url).pathname),'../../src'); const files=[];
(function w(d){for(const f of fs.readdirSync(d)){const p=path.join(d,f);fs.statSync(p).isDirectory()?w(p):/\.tsx?$/.test(f)&&files.push(p);}})(ROOT);
const UNIT='(?:MPa|GPa|N\\/mm|kN|MN|mm|cm|dm|µm|μm|nm|m²|m³|m\\/s|m\\b|kg|g\\/|t\\b|%|‰|°C|K\\b|W\\/|kWh|kJ|dB|Hz|kHz|M\\.-%|Vol\\.-%|M\\.-|d\\b|h\\b|min\\b|l\\/|bar\\b|Pa\\b)';
const RE=new RegExp('(?<![\\d.,/\\w])(\\d+)\\.(\\d{1,2}|\\d{4,}|(?<=\\b0\\.)\\d{3})(?![\\d.])(\\s?)(?=(?:±\\s?\\d+(?:\\.\\d+)?\\s?)?'+UNIT+')','g');
const RANGE=new RegExp('(?<![\\d.,/\\w])(\\d+)\\.(\\d{1,2}|\\d{4,}|(?<=\\b0\\.)\\d{3})(?=\\s?(?:[–-]|bis|und|\\/|…)\\s?[<>≤≥~]?\\s?\\d+(?:[.,]\\d+)?\\s?'+UNIT+')','g');
const APPLY=process.argv[2]==='--apply'; let n=0; const amb=[];
for(const f of files){ if(/numberFormat|labExportUtils|BimBaustoffe/.test(f)) continue;
  const src=fs.readFileSync(f,'utf8'); const sf=ts.createSourceFile(f,src,ts.ScriptTarget.Latest,true,f.endsWith('x')?ts.ScriptKind.TSX:ts.ScriptKind.TS); const edits=[];
  const skipCtx=(node)=>{ let p=node.parent; for(let i=0;i<4&&p;i++,p=p.parent){
      if(ts.isJsxAttribute(p)&&/^(className|style|d|points|href|src|key|id|value|defaultValue|viewBox|transform)$/.test(p.name.getText())) return true;
      if(ts.isCallExpression(p)&&/parseFloat|Number|parseInt|querySelector|fetch|URL/.test(p.expression.getText())) return true;
      if(ts.isPropertyAssignment(p)&&/^(url|href|id|key|className|value|unitKey)$/.test(p.name.getText())) return true;
      if(ts.isImportDeclaration(p)) return true; } return false; };
  const visit=(node)=>{
    const isStr=ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node)||ts.isTemplateHead(node)||ts.isTemplateMiddle(node)||ts.isTemplateTail(node)||ts.isJsxText(node);
    if(isStr&&!skipCtx(node)){ const st=node.getStart(), txt=src.slice(st,node.getEnd());
      if(!/https?:|www\.|\.(png|jpg|svg|pdf|tsx?|json)/.test(txt)){
        const texCtx=(()=>{let p=node.parent;for(let i=0;i<4&&p;i++,p=p.parent){if(ts.isJsxAttribute(p)&&/^(math|formel)$/.test(p.name.getText()))return true;if(ts.isPropertyAssignment(p)&&/^(formel|formula|math|latex|tex)$/.test(p.name.getText()))return true;if(ts.isJsxElement(p)&&/InlineMath|BlockMath/.test(p.openingElement.tagName.getText()))return true;}return false;})();
        const TEXNUM=/(?<![\d.,\w\\]|Gl\.\s?\(?|Tab\.\s?|Abs\.\s?|Kap\.\s?|Abschn\.\s?|Abschnitt\s|Bild\s|\()(\d+)\.(\d{1,2}|\d{4,}|(?<=\b0\.)\d{3})(?![\d.])/g;
        const convTex=(seg)=>conv(seg,'{,}').replace(TEXNUM,(m,a,b)=>`${a}{,}${b}`).replace(/(?<![\d,])(\d+),(\d+)(?!\d|,\d)/g,(m,a,b)=>`${a}{,}${b}`);
        const conv=(seg,sep)=>{ let o=seg.replace(RE,(m,a,b,s)=>`${a}${sep}${b}${s}`); for(let k=0;k<3;k++) o=o.replace(RANGE,(m,a,b)=>`${a}${sep}${b}`); return o; };
        let out;
        if(texCtx) out=convTex(txt);
        else out=txt.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$|\\\\\([\s\S]*?\\\\\))/).map((seg,i)=>i%2?convTex(seg):conv(seg,',')).join('');
        out=out.replace(/(?<![\d.])([1-9]\d?)\.(\d{3})(?![\d.])\s?(mm|N\/mm|kg|kN)/g,(m)=>{amb.push(path.relative(ROOT,f)+': '+m);return m;});
        if(out!==txt){ n++; edits.push([st,node.getEnd(),out]); if(!APPLY&&process.argv[2]==='--show') console.log(path.relative(ROOT,f)+':'+(sf.getLineAndCharacterOfPosition(st).line+1),'|',txt.trim().slice(0,90).replace(/\n/g,' '),'→',out.trim().slice(0,90).replace(/\n/g,' ')); } } }
    ts.forEachChild(node,visit); };
  visit(sf);
  if(APPLY&&edits.length){ let s=src; edits.sort((a,b)=>b[0]-a[0]); for(const [a,b,t] of edits) s=s.slice(0,a)+t+s.slice(b); fs.writeFileSync(f,s); }
}
// Ausgelagerte Fachtexte (AP 5.3): dieselben Regeln für Zeichenketten in content/**/*.json (nur Prüfung)
{ const conv=(seg,sep)=>{ let o=seg.replace(RE,(m,a,b,s)=>`${a}${sep}${b}${s}`); for(let k=0;k<3;k++) o=o.replace(RANGE,(m,a,b)=>`${a}${sep}${b}`); return o; };
  const TEXNUM=/(?<![\d.,\w\\]|Gl\.\s?\(?|Tab\.\s?|Abs\.\s?|Kap\.\s?|Abschn\.\s?|Abschnitt\s|Bild\s|\()(\d+)\.(\d{1,2}|\d{4,}|(?<=\b0\.)\d{3})(?![\d.])/g;
  const convTex=(seg)=>conv(seg,'{,}').replace(TEXNUM,(m,a,b)=>`${a}{,}${b}`).replace(/(?<![\d,])(\d+),(\d+)(?!\d|,\d)/g,(m,a,b)=>`${a}{,}${b}`);
  for(const datei of inhaltsDateien()) for(const t of inhaltsTexte(datei)){
    if(t.eigenschaft&&/^(url|href|id|key|className|value|unitKey)$/.test(t.eigenschaft)) continue;
    if(/https?:|www\.|\.(png|jpg|svg|pdf|tsx?|json)/.test(t.text)) continue;
    const out=t.eigenschaft&&/^(formel|formula|math|latex|tex)$/.test(t.eigenschaft)?convTex(t.text):t.text.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$|\\\\\([\s\S]*?\\\\\))/).map((seg,i)=>i%2?convTex(seg):conv(seg,',')).join('');
    if(out!==t.text){ n++; console.log(`${relativ(datei)} [${t.gruppe}.${t.schluessel}] |`,t.text.slice(0,90),'→',out.slice(0,90)); } } }
console.log(APPLY?'Literale geändert:':'Literale mit Dezimalpunkt+Einheit:',n); if(process.argv[2]==='--check') process.exit(n?1:0); if(process.argv[3]==='--amb') console.log(amb.join('\n'));

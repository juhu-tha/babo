// AP 2: rohe number-Ausdrücke als JSX-Kind → formatDeWert(...) (Typprüfung über den TS-Compiler)
import ts from 'typescript'; import fs from 'node:fs'; import path from 'node:path';
const REPO=path.resolve(path.dirname(new URL(import.meta.url).pathname),'../..');
const cfg=ts.getParsedCommandLineOfConfigFile(path.join(REPO,'tsconfig.json'),{},{...ts.sys,onUnRecoverableConfigFileDiagnostic:()=>{}});
const prog=ts.createProgram(cfg.fileNames.filter(f=>f.includes('/src/')),cfg.options); const tc=prog.getTypeChecker();
const MODE=process.argv[2]; let cnt=0; const byFile={};
for(const sf of prog.getSourceFiles()){ const f=sf.fileName; if(!f.includes('/src/')||f.includes('node_modules')||!f.endsWith('.tsx')) continue;
  const edits=[]; let needT=false, needW=false;
  const numOk=(t)=>{ if(t.isUnion&&t.isUnion()) return t.types.every(x=>x.flags&ts.TypeFlags.NumberLike)&&t.types.some(x=>!(x.flags&ts.TypeFlags.NumberLiteral&&Number.isInteger(x.value)&&Math.abs(x.value)<10000)); return (t.flags&ts.TypeFlags.NumberLike)&&!(t.flags&ts.TypeFlags.NumberLiteral&&Number.isInteger(t.value)&&Math.abs(t.value)<10000); };
  const isTexTemplate=(tpl)=>{ // template expression used for KaTeX?
    const raw=tpl.getText(); if(/\\\\[a-zA-Z]|\\[a-zA-Z]{2,}|\^\{|_\{/.test(raw)) return true;
    let p=tpl.parent; for(let i=0;i<4&&p;i++,p=p.parent){ if(ts.isJsxAttribute(p)&&/^(math|formel|formula|latex|tex)$/.test(p.name.getText())) return true;
      if(ts.isPropertyAssignment(p)&&/^(formel|formula|math|latex)$/.test(p.name.getText())) return true; if(ts.isJsxElement(p)&&/InlineMath|BlockMath/.test(p.openingElement.tagName.getText())) return true;}
    return false; };
  const STYLE=/^(style|className|d|points|transform|x|y|x1|x2|y1|y2|cx|cy|r|width|height|left|top|right|bottom|viewBox|strokeDasharray|stroke-dasharray|fill|stroke|path|href|src|key|id|backgroundSize|backgroundPosition|clipPath|gridTemplateColumns|flexBasis|opacity|data-[a-z]+)$/;
  const inStyle=(tpl)=>{ const raw=tpl.getText();
    const stripped=raw.slice(1,-1).replace(/\$\{(?:[^{}]|\{[^{}]*\})*\}/g,'');
    if(/^[\s,;()]*$/.test(stripped.replace(/px|%|deg|rem|em|vh|vw|ms/g,''))) return true; // nur Zahlen/Trenner/Einheiten → CSS/SVG
    if(/IFC[A-Z]+\(|#\d+ = |Date\.now|\|\$\{|^`M |[MLHVCQ]\s*\$\{/.test(raw)) return true;
    let p=tpl.parent; for(let i=0;i<6&&p;i++,p=p.parent){
      if(ts.isJsxAttribute(p)) return STYLE.test(p.name.getText());
      if(ts.isPropertyAssignment(p)&&STYLE.test(p.name.getText())) return true;
      if(ts.isCallExpression(p)&&/setAttribute|translate|rotate|scale|rgba|hsl|calc|moveTo|lineTo|querySelector/.test(p.expression.getText())) return true;
      if(ts.isJsxElement(p)||ts.isFunctionDeclaration(p)||ts.isArrowFunction(p)) return false; }
    return false; };
  const SKIPNAME=/year|jahr|Jahr|Year|index|idx|Idx|count|Count|length|\bi\b|\bj\b|\bk\b|\bn\b|num|Nr|nummer|Nummer|step|Step|page|Page|seconds|minutes|id\b|Id\b|key|Key|width|Width|height|Height|size|Size|offset|Offset|angle|rot|pos|Pos|left|top|delay|Delay|duration|opacity|zoom|scale/;
  const isNumT=(e)=>numOk(tc.getTypeAtLocation(e));
  const v=(n)=>{
    if(ts.isTemplateSpan(n)&&isNumT(n.expression)&&!SKIPNAME.test(n.expression.getText())&&!/^formatDe/.test(n.expression.getText())){ const tpl=n.parent; const e=n.expression; const et=e.getText();
      const raw=tpl.getText(); const urlish=/https?:|(?<!\{)#|\/[a-z]|\?|=\$\{|\.(png|svg|jpg|pdf|json)|\bwidth\b|translate|rgba?\(|hsla?\(|calc\(/.test(raw);
      if(!urlish&&!inStyle(tpl)){ const isT=isTexTemplate(tpl); cnt++; byFile[path.relative(REPO,f)]=(byFile[path.relative(REPO,f)]||0)+1;
        if(MODE==='--show') console.log((isT?'X ':'T ')+path.relative(REPO,f)+':'+(sf.getLineAndCharacterOfPosition(e.getStart()).line+1),'|',raw.replace(/\s+/g,' ').slice(0,110));
        edits.push([e.getStart(),e.getEnd(),isT?`formatDeTeXWert(${et})`:`formatDeWert(${et})`]); if(isT) needT=true; else needW=true; } } if(ts.isJsxExpression(n)&&n.expression&&(ts.isJsxElement(n.parent)||ts.isJsxFragment(n.parent))){
      const e=n.expression; const tag=ts.isJsxElement(n.parent)?n.parent.openingElement.tagName.getText():'';
      const isNum=numOk(tc.getTypeAtLocation(e));
      const et=e.getText();
      if(isNum&&!/InlineMath|BlockMath|title/.test(tag)&&!/year|jahr|Jahr|Year|index|idx|count|Count|length|\bi\b|\bn\b|num|Nr|nummer|Nummer|step|Step|page|Page|seconds|minutes/.test(et)&&!/^formatDe/.test(et)){
        cnt++; byFile[path.relative(REPO,f)]=(byFile[path.relative(REPO,f)]||0)+1;
        if(MODE==='--show') console.log(path.relative(REPO,f)+':'+(sf.getLineAndCharacterOfPosition(e.getStart()).line+1),'|',et.slice(0,70));
        edits.push([e.getStart(),e.getEnd(),`formatDeWert(${et})`]); needW=true; } }
    ts.forEachChild(n,v)}; v(sf);
  if(MODE==='--apply'&&edits.length){ let s=fs.readFileSync(f,'utf8'); edits.sort((a,b)=>b[0]-a[0]); for(const [a,b,t] of edits) s=s.slice(0,a)+t+s.slice(b);
    const need=[needW&&'formatDeWert',needT&&'formatDeTeXWert'].filter(Boolean);
    const m=s.match(/import\s*\{([^}]*)\}\s*from\s*['"]((?:@\/src\/utils|[./]+utils)\/numberFormat)['"];?/);
    if(m){ s=s.replace(m[0],`import { ${[...new Set(m[1].split(',').map(x=>x.trim()).filter(Boolean).concat(need))].join(', ')} } from '${m[2]}';`); }
    else s=`import { ${need.join(', ')} } from '@/src/utils/numberFormat';\n`+s;
    fs.writeFileSync(f,s); } }
console.log(MODE==='--apply'?'umgestellt:':'rohe Zahl-Ausdrücke in Anzeige:',cnt); if(MODE==='--check') process.exit(cnt?1:0);

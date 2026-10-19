import ts from 'typescript'; import fs from 'node:fs'; import path from 'node:path';
const ROOT=path.resolve(path.dirname(new URL(import.meta.url).pathname),'../../src'); const files=[];
(function w(d){for(const f of fs.readdirSync(d)){const p=path.join(d,f);fs.statSync(p).isDirectory()?w(p):/\.tsx?$/.test(f)&&files.push(p);}})(ROOT);
const APPLY=process.argv[2]==='--apply'; const stat={jsx:0,tplText:0,tplTex:0,skip:0}; const skipKinds={};
for(const f of files){ if(/labExportUtils|numberFormat|scripts\//.test(f)) continue;
  const src=fs.readFileSync(f,'utf8'); const sf=ts.createSourceFile(f,src,ts.ScriptTarget.Latest,true,f.endsWith('x')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
  const edits=[]; let needDe=false, needTex=false;
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
  const visit=(n)=>{
    if(ts.isCallExpression(n)&&ts.isPropertyAccessExpression(n.expression)&&n.expression.name.text==='toFixed'){
      const expr=n.expression.expression; const arg=n.arguments[0]?n.arguments[0].getText():'0';
      const et=expr.getText(); const p=n.parent;
      if(/year|jahr|Jahr|Year|index|idx/.test(et)) {stat.skip++; skipKinds.year=(skipKinds.year||0)+1;}
      else if(ts.isJsxExpression(p)&&(ts.isJsxElement(p.parent)||ts.isJsxFragment(p.parent))) {
        const tag=ts.isJsxElement(p.parent)?p.parent.openingElement.tagName.getText():'';
        if(/InlineMath|BlockMath/.test(tag)){ stat.tplTex++; edits.push([n.getStart(),n.getEnd(),`formatDeTeX(${et}, ${arg})`]); needTex=true; }
        else { stat.jsx++; edits.push([n.getStart(),n.getEnd(),`formatDeZahl(${et}, ${arg})`]); needDe=true; } }
      else if(ts.isJsxExpression(p)&&ts.isJsxAttribute(p.parent)&&/^(title|alt|aria-label|placeholder|label|text|value)$/.test(p.parent.name.getText())&&p.parent.name.getText()!=='value') { stat.jsx++; edits.push([n.getStart(),n.getEnd(),`formatDeZahl(${et}, ${arg})`]); needDe=true; }
      else if(ts.isTemplateSpan(p)&&p.expression===n&&!inStyle(p.parent)){ const tpl=p.parent;
        if(isTexTemplate(tpl)){ stat.tplTex++; if(process.argv[2]==='--show') console.log('X',path.relative(ROOT,f)+':'+(sf.getLineAndCharacterOfPosition(n.getStart()).line+1), tpl.getText().slice(0,120).replace(/\n/g,' ')); edits.push([n.getStart(),n.getEnd(),`formatDeTeX(${et}, ${arg})`]); needTex=true; }
        else { stat.tplText++; if(process.argv[2]==='--show') console.log('T',path.relative(ROOT,f)+':'+(sf.getLineAndCharacterOfPosition(n.getStart()).line+1), tpl.getText().slice(0,120).replace(/\n/g,' ')); edits.push([n.getStart(),n.getEnd(),`formatDeZahl(${et}, ${arg})`]); needDe=true; } }
      else { stat.skip++; const k=ts.SyntaxKind[p.kind]; skipKinds[k]=(skipKinds[k]||0)+1; }
    }
    ts.forEachChild(n,visit);
  }; visit(sf);
  if(APPLY&&edits.length){ let s=src; edits.sort((a,b)=>b[0]-a[0]); for(const [a,b,t] of edits) s=s.slice(0,a)+t+s.slice(b);
    const imp=[]; if(needDe&&!/\bformatDeZahl\b[^(]/.test(src.split('\n').filter(l=>l.startsWith('import')).join('\n'))) imp.push('formatDeZahl');
    if(needTex&&!/import[^;]*formatDeTeX/.test(src)) imp.push('formatDeTeX');
    if(imp.length){ const m=s.match(/import\s*\{([^}]*)\}\s*from\s*['"](@\/src\/utils\/numberFormat|[./]+utils\/numberFormat)['"];?/);
      if(m){ const names=new Set(m[1].split(',').map(x=>x.trim()).filter(Boolean).concat(imp)); s=s.replace(m[0],`import { ${[...names].join(', ')} } from '${m[2]}';`);}
      else { const rel = f.includes('/src/utils/') ? './numberFormat' : '@/src/utils/numberFormat'; s=`import { ${imp.join(', ')} } from '${rel}';\n`+s; } }
    fs.writeFileSync(f,s); }
}
console.log(JSON.stringify(stat), JSON.stringify(skipKinds));
if(process.argv[2]==='--check'){ const offen=stat.jsx+stat.tplText+stat.tplTex; console.log(offen? `${offen} Anzeige-Stellen mit .toFixed() ohne formatDeZahl/formatDeTeX.` : 'Zahlformat (.toFixed in Anzeige): 0 Verstöße.'); process.exit(offen?1:0); }

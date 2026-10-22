"""Einmal-Skript (AP 1): generische DIN-Media-/Beuth-Links durch stabile Suchlinks ersetzen.
Aus dem Titel wird die Normbezeichnung (ohne Ausgabedatum) extrahiert; Suche: https://www.dinmedia.de/de/suche?q=…"""
import re, sys, pathlib, urllib.parse, json
ROOT = pathlib.Path(__file__).resolve().parents[2] / 'src'
GEN = r"https?://(?:www\.)?(?:dinmedia\.de|beuth\.de)/?"
NORM = re.compile(r"\b((?:DIN SPEC|DIN CEN/TS|DIN CEN ISO/TS|DIN EN ISO/IEC|DIN EN ISO|DIN EN IEC|DIN ISO/IEC|DIN ISO|DIN IEC|DIN EN|DIN V ENV|DIN V|DIN|EN ISO|ISO/IEC|ISO|EN|VDI/VDE|VDI)\s?(?:\d[\d\-\.]*\d|\d))(?:\s?(?:Blatt|Teil)\s?(\d[\d\.]*))?")
def query(title):
    m = NORM.search(title)
    if m:
        q = m.group(1)
        if m.group(2): q += ' Blatt ' + m.group(2)
        return q, True
    t = re.sub(r"\(.*?\)", "", title)
    t = re.sub(r"[:–\-].*$", "", t).strip()
    return ' '.join(t.split()[:6]), False
def url_for(q): return "https://www.dinmedia.de/de/suche?q=" + urllib.parse.quote_plus(q)
stats = {'norm':0,'titel':0,'ohne_titel':[]}
# Objekte { title: '...', url: '<generisch>' } (Reihenfolge title→url, auch name/label)
OBJ = re.compile(r"((?:title|name|label)\s*:\s*(['\"])((?:(?!\2).)*)\2\s*,\s*url\s*:\s*)(['\"])" + GEN + r"\4")
for p in ROOT.rglob('*.ts*'):
    s = p.read_text(); orig = s
    def rep(m):
        q, isnorm = query(m.group(3))
        stats['norm' if isnorm else 'titel'] += 1
        return f"{m.group(1)}{m.group(4)}{url_for(q)}{m.group(4)}"
    s = OBJ.sub(rep, s)
    # verbleibende generische Links melden
    for m in re.finditer(r"(['\"])" + GEN + r"\1", s):
        line = s[:m.start()].count('\n') + 1
        stats['ohne_titel'].append(f"{p.relative_to(ROOT.parent)}:{line}")
    if s != orig: p.write_text(s)
print(json.dumps({k:(v if not isinstance(v,list) else len(v)) for k,v in stats.items()}))
print('\n'.join(stats['ohne_titel'][:40]))

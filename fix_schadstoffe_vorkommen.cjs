const fs = require('fs');
let content = fs.readFileSync('src/modules/Schadstoffe.tsx', 'utf-8');

// Replacement logic
content = content.replace(
  /'Teerprodukte: Teerhaltige Klebstoffe \(z\.B\. Parkettkleber\), Teerpappe, teerhaltige Anstriche\.',/g,
  `'Teerprodukte: Teerhaltige Klebstoffe (z.B. Parkettkleber), Teerpappe, teerhaltige Anstriche.',\n      'Einsatz bis Verbot: Teerprodukte wurden bis in die 1990er eingesetzt (Carbolineum-Verbot in DE 1991).',`
);

content = content.replace(
  /'Kondensatoren: In älteren Leuchtstoffröhren-Vorschaltgeräten\.'/g,
  `'Kondensatoren: In älteren Leuchtstoffröhren-Vorschaltgeräten.',\n      'Einsatz bis Verbot: Hauptsächlich von 1950 bis 1989 (generelles PCB-Verbot in DE).' `
);

content = content.replace(
  /'Stichtag: Seit 2000 \(bzw\. freiwillig ab 1996\) gibt es in DE das RAL-Gütezeichen für "neue", unbedenkliche Wolle\.'/g,
  `'Stichtag: Seit 2000 (bzw. freiwillig ab 1996) gibt es in DE das RAL-Gütezeichen für "neue", unbedenkliche Wolle.',\n      'Einsatz bis Verbot: Alte, potenziell krebserregende KMF wurden ab den 1950ern eingesetzt (Verbot in DE zur Jahrtausendwende).'`
);

content = content.replace(
  /'Cadmium: Oft als Verunreinigung in alten Zinkbeschichtungen oder PVC-Stabilisatoren\.'/g,
  `'Cadmium: Oft als Verunreinigung in alten Zinkbeschichtungen oder PVC-Stabilisatoren.',\n      'Einsatz bis Verbot: Schwer zu generalisieren, Bleifarben (Bleiweiß/Mennige) wurden jedoch meist im 20. Jahrhundert sukzessive verboten (z.B. Bleirohre ab 1973).'`
);

content = content.replace(
  /'Verwendung: Insektizide \(Lindan\) und Fungizide \(PCP\) in Holzschutzmitteln für Dachstühle, Fachwerk, Paneele\.',\n      'Zeitraum: Häufig eingesetzt in den 1960er bis 1980er Jahren\.'/g,
  `'Verwendung: Insektizide (Lindan) und Fungizide (PCP) in Holzschutzmitteln für Dachstühle, Fachwerk, Paneele.',\n      'Einsatz bis Verbot: Häufig eingesetzt ab den 1950ern bis in die 1980er Jahre (PCP-Verbotsverordnung in DE 1989).'`
);

content = content.replace(
  /'Erkennung: Im Labor \(Röntgenfluoreszenzanalyse - RFA\) oder per Schnelltest\. Optisch nicht von reinem EPS zu unterscheiden\.'/g,
  `'Erkennung: Im Labor (Röntgenfluoreszenzanalyse - RFA) oder per Schnelltest. Optisch nicht von reinem EPS zu unterscheiden.',\n      'Einsatz bis Verbot: Flächendeckend eingesetzt zumeist bis 2014/2015 (Herstellungs- und Verwendungsverbot in DE seit 2016).'`
);


fs.writeFileSync('src/modules/Schadstoffe.tsx', content, 'utf-8');

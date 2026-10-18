import * as B from '../src/utils/bestandKern';
let f=0; const chk=(n:string,g:number,e:number,t=0.01)=>{const ok=Math.abs(g-e)<=t*Math.abs(e)+1e-9; if(!ok)f++; console.log(`${ok?'OK  ':'FAIL'} ${n}: ${g.toPrecision(5)} (soll ${e.toPrecision(5)})`);};
// U-Wert: Seite: 1/1.4 + 0.14/0.035 → 0,212
chk('U Kellerdecke 140 mm λ0,035', B.uRetrofit(1.4,0.14,0.035), 1/(1/1.4+4), 1e-9);
chk('Steildach-Grenzwert GModG', B.GMODG_ANLAGE7.steildach_oGD, 0.24, 0);
chk('Seite: Steildach U=0,192 ist GModG-konform', B.checkGModG('steildach_oGD',0.192).ok?1:0, 1, 0);
chk('d_erf Steildach U 1,2→0,24 λ0,035', B.dRequired(1.2,0.24,0.035)*1000, 0.035*(1/0.24-1/1.2)*1000, 1e-9);
// Einsparung Kellerdecke: Seite 10.097 kWh/a (Fx=1, η=1, 85 kKh) → mit Fx 0,6 und η 0,9
const s=B.savings({uOld:1.4,uNew:B.uRetrofit(1.4,0.14,0.035),A:100,bauteil:'kellerdecke_erdreich',Gt:3542,etaSys:1,price:0.11,co2:0.22,invest:12000});
chk('Seitenwert ohne Fx ×0,6', s.qNutz, 10097*0.6, 0.01);
// EN 1990 Anh. D: kn
chk('kn(n=3, V unbekannt)', B.kn(3,false), 3.37, 0);
chk('kn(n=10, V bekannt)', B.kn(10,true), 1.72, 0);
// Einzelner Bohrkern → kein charakteristischer Wert bei V unbekannt
chk('n=1, V unbekannt → ungültig', B.charValue([31.8]).valid?1:0, 0, 0);
// mit V bekannt (0,15): n=1
const c1=B.charValue([26.1],0.15); chk('Xk(n=1,V=0,15)', c1.Xk, 26.1*Math.exp(-2.31*Math.sqrt(Math.log(1+0.0225))), 1e-6);
// Lognormal-Bemessungswert: Seite (Stahl fm 260, V 8 %, β 3,8, αR 0,8) ohne γRd → 203,2
chk('Seite: prob. Stahl ohne γRd', B.designLognormal(260,0.08,3.8,0.8,1.0), 203.2, 0.003);
console.log('mit γRd=1,1:', B.designLognormal(260,0.08,3.8,0.8,1.1).toFixed(1), 'MPa (vs. EC3 fy,k/γM0 = 225,8/1,0)');
// Mauerwerk: Seite Bsp. 3: 0,55·12,3^0,7·2,5^0,3 = 4,19; fd mit ζ=0,85/γM 1,5 = 2,37 (Seite 2,79)
const fk=B.fkMasonry(12.3,2.5); chk('fk Bsp. 3', fk, 4.19, 0.005); chk('fd mit ζ', B.fdMasonry(fk), 0.85*4.19/1.5, 0.005);
// Beton: f_ck,is 24,8 → f_ck 29,2 → C25/30
console.log('f_ck,is 24,8 →', B.fckFromInSitu(24.8).toFixed(1), B.classFor(B.fckFromInSitu(24.8)));
// Holz: 20 % Höhenverlust → 36 % Tragfähigkeitsverlust
chk('W bei 0,8 h', B.bendingRatio(1,1,1,0.8), 0.64, 1e-9);
console.log(f?`\n${f} FEHLER`:"\nALLE TESTS BESTANDEN"); process.exit(f?1:0);

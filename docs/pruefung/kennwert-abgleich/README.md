# Kennwert-Abgleich – Übersicht

Maschinelle Vorarbeit für die vollständige gezielte Durchsicht (Entscheidung 29.10.2026; Vorschlag in `docs/pruefung/nachpruefung2-2026-10-29.md`). Erzeugt mit:

```
node scripts/qa/kennwert-abgleich.mjs
```

Das Ergebnis ist eine heuristische Prüfliste (Zuordnung über Schlüsselwörter in der Umgebung einer Zahl) – jede gemeldete Stelle ist ein Prüfauftrag, kein Befund. Methode und Grenzen im Kopf von `scripts/qa/kennwert-abgleich.mjs`; Test `tests/kennwertAbgleich.test.ts`.

## Summen

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 13 |
| (1) Kennwerte übereinstimmend | 133 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 93 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 335 (278) |
| (3) Normverweise | 7247 |
| (3) Normen mit uneinheitlicher Ausgabe (app-weit) | 19 |
| (3) Verweise abweichend von der Normen-Registry | 52 |
| (3) Tabellen unter verschiedenen Normteilen | 2 |

## Zentrale Konstanten im Abgleich

`ZEMENT_GWP_KG`, `GWP_LEHRWERTE`, `PK_NETTO_SENKE_KG`, `PK_LEHRWERT`, `A4_FAKTOR_EINZEL`, `QNG_WG`, `FAKTOREN`, `FP_STROM`, `SCHWINDBEIWERTE`, `CONCRETE`, `BAUSTAHL_EC3`, `BETONSTAHL`, `E_BETONSTAHL`, `HOLZ_EN338`, `BSH_EN14080`

## Module

| Bericht | Modul-IDs | Gruppe | Status | (1) abw. | (1) ohne Zuordn. | (2) Faktoren | (3) Hinweise |
|---|---|---|---|---|---|---|---|
| [abfaelle](abfaelle.md) | `abfaelle` | Rückbau & Schadstoffe | geprueft | 0 | 0 | 0 | 0 |
| [altholz_urban_mining](altholz_urban_mining.md) | `altholz_urban_mining` | Rückbau & Schadstoffe | geprueft | 0 | 0 | 0 | 0 |
| [analytik](analytik.md) | `analytik` | Labor & Auswertung | geprueft | 0 | 0 | 1 | 0 |
| [asphalt](asphalt.md) | `asphalt` | Baustoffe | offen | 0 | 0 | 0 | 0 |
| [ausbau](ausbau.md) | `ausbau` | Baustoffe | geprueft | 0 | 0 | 0 | 0 |
| [bauphysik](bauphysik.md) | `bauphysik` | Bauphysik | offen | 0 | 0 | 6 | 2 |
| [bauphysik_info](bauphysik_info.md) | `bauphysik_info`, `bauprodukte_info`, `baustoffe_info`, `bestand_info`, `dauerhaftigkeit_info`, `digitales_info`, `grundlagen_info`, `instandsetzung_info`, `labor_info`, `mechanik_info`, `nachhaltigkeit_info`, `praxiswissen_info`, `rueckbau_info`, `schaeden_info`, `stahlbeton_info` | Bauphysik, Bauprodukte, Baustoffe, Bauen im Bestand, Dauerhaftigkeit, Digitales, Grundlagen, Schutz & Instandsetzung, Labor & Auswertung, Mechanik, Nachhaltigkeit, Praxiswissen, Rückbau & Schadstoffe, Mängel & Schäden, Massivbau | offen | 0 | 0 | 0 | 9 |
| [bauschaeden](bauschaeden.md) | `bauschaeden` | Mängel & Schäden | geprueft | 0 | 0 | 0 | 0 |
| [baustatik](baustatik.md) | `baustatik` | Mechanik | geprueft | 0 | 0 | 2 | 2 |
| [baustoffkenngroessen](baustoffkenngroessen.md) | `baustoffkenngroessen` | Grundlagen | geprueft | 0 | 0 | 5 | 0 |
| [baustoffkunde](baustoffkunde.md) | `baustoffkunde` | Grundlagen | geprueft | 0 | 0 | 0 | 0 |
| [bauwerksdiagnose](bauwerksdiagnose.md) | `bauwerksdiagnose`, `pruefverfahren_katalog`, `zfp` | Bauen im Bestand | geprueft, offen | 1 | 0 | 0 | 1 |
| [bauwerkserfassung](bauwerkserfassung.md) | `bauwerkserfassung` | Bauen im Bestand | geprueft | 0 | 0 | 0 | 1 |
| [bauwerksunters_monitoring](bauwerksunters_monitoring.md) | `bauwerksunters_monitoring` | Mängel & Schäden | offen | 0 | 0 | 4 | 1 |
| [bestand](bestand.md) | `bestand` | Bauen im Bestand | geprueft | 0 | 1 | 0 | 3 |
| [bestand_checklisten](bestand_checklisten.md) | `bestand_checklisten` | Bauen im Bestand | offen | 0 | 0 | 0 | 0 |
| [beton_a_z](beton_a_z.md) | `beton_a_z` | Betontechnologie | geprueft | 0 | 0 | 0 | 1 |
| [beton_info](beton_info.md) | `beton_info` | Betontechnologie | offen | 0 | 0 | 0 | 6 |
| [betonkennwerte](betonkennwerte.md) | `betonkennwerte` | Betontechnologie | geprueft | 0 | 0 | 0 | 3 |
| [betonpraxis](betonpraxis.md) | `betonpraxis` | Betontechnologie | geprueft | 0 | 0 | 8 | 1 |
| [biegebemessung](biegebemessung.md) | `biegebemessung`, `durchstanzen`, `querkraftbemessung`, `rissbreite`, `spannung`, `stahlbeton_bemessung`, `stuetzenbemessung`, `verankerungslaenge` | –, Massivbau | offen | 0 | 0 | 12 | 1 |
| [bim_baustoffe](bim_baustoffe.md) | `bim_baustoffe` | Digitales | geprueft | 0 | 6 | 0 | 2 |
| [bindemittel](bindemittel.md) | `bindemittel` | Betontechnologie | offen | 0 | 0 | 20 | 1 |
| [biokohlebeton](biokohlebeton.md) | `biokohlebeton` | Betontechnologie | geprueft | 0 | 4 | 0 | 0 |
| [boden_materialaufbereitung](boden_materialaufbereitung.md) | `boden_materialaufbereitung` | Rückbau & Schadstoffe | geprueft | 0 | 12 | 0 | 0 |
| [bodenmechanik](bodenmechanik.md) | `bodenmechanik` | Mechanik | geprueft | 0 | 0 | 2 | 0 |
| [bp_abdichtung](bp_abdichtung.md) | `bp_abdichtung` | Bauprodukte | offen | 0 | 0 | 0 | 0 |
| [bp_baustoffindustrie](bp_baustoffindustrie.md) | `bp_baustoffindustrie` | Bauprodukte | offen | 0 | 0 | 0 | 0 |
| [bp_befestigung](bp_befestigung.md) | `bp_befestigung` | Bauprodukte | geprueft | 0 | 0 | 0 | 0 |
| [bp_beton](bp_beton.md) | `bp_beton` | Bauprodukte | geprueft | 0 | 0 | 0 | 0 |
| [bp_betonfertigteile](bp_betonfertigteile.md) | `bp_betonfertigteile` | Bauprodukte | geprueft | 0 | 0 | 2 | 0 |
| [bp_betonwaren](bp_betonwaren.md) | `bp_betonwaren` | Bauprodukte | offen | 0 | 0 | 0 | 0 |
| [bp_betonzusatzmittel](bp_betonzusatzmittel.md) | `bp_betonzusatzmittel` | Bauprodukte | geprueft | 0 | 0 | 0 | 1 |
| [bp_dach_fassade](bp_dach_fassade.md) | `bp_dach_fassade` | Bauprodukte | geprueft | 0 | 0 | 0 | 0 |
| [bp_daemmung](bp_daemmung.md) | `bp_daemmung` | Bauprodukte | geprueft | 0 | 0 | 0 | 0 |
| [bp_farben_lacke](bp_farben_lacke.md) | `bp_farben_lacke` | Bauprodukte | geprueft | 0 | 0 | 1 | 0 |
| [bp_glaeser](bp_glaeser.md) | `bp_glaeser` | Bauprodukte | geprueft | 0 | 1 | 0 | 0 |
| [bp_holzprodukte](bp_holzprodukte.md) | `bp_holzprodukte` | Bauprodukte | geprueft | 0 | 0 | 0 | 1 |
| [bp_innovationen](bp_innovationen.md) | `bp_innovationen` | Bauprodukte | geprueft | 0 | 0 | 1 | 0 |
| [bp_klebstoffe](bp_klebstoffe.md) | `bp_klebstoffe` | Bauprodukte | offen | 0 | 0 | 0 | 0 |
| [bp_kunststoffe](bp_kunststoffe.md) | `bp_kunststoffe` | Bauprodukte | geprueft | 0 | 0 | 0 | 0 |
| [bp_lehmbauprodukte](bp_lehmbauprodukte.md) | `bp_lehmbauprodukte` | Bauprodukte | offen | 0 | 0 | 0 | 4 |
| [bp_mauerwerk](bp_mauerwerk.md) | `bp_mauerwerk` | Bauprodukte | offen | 0 | 0 | 0 | 0 |
| [bp_metallisch](bp_metallisch.md) | `bp_metallisch` | Bauprodukte | geprueft | 0 | 0 | 0 | 0 |
| [bp_mineralisch](bp_mineralisch.md) | `bp_mineralisch` | Bauprodukte | geprueft | 0 | 0 | 0 | 0 |
| [bp_putz_estrich](bp_putz_estrich.md) | `bp_putz_estrich` | Bauprodukte | geprueft | 0 | 0 | 0 | 0 |
| [bp_recht_avcp](bp_recht_avcp.md) | `bp_recht_avcp`, `bp_recht_grundlagen`, `bp_recht_konformitaet`, `bp_recht_normen`, `bp_rechtliches` | Bauprodukte, – | geprueft, offen | 0 | 0 | 0 | 0 |
| [bp_stahlbauprofile](bp_stahlbauprofile.md) | `bp_stahlbauprofile` | Bauprodukte | geprueft | 0 | 0 | 1 | 0 |
| [bp_trockenbau](bp_trockenbau.md) | `bp_trockenbau` | Bauprodukte | geprueft | 0 | 0 | 0 | 0 |
| [bp_verkehr_asphalt](bp_verkehr_asphalt.md) | `bp_verkehr_asphalt`, `bp_verkehr_bahn`, `bp_verkehr_betondecken`, `bp_verkehr_bitumen`, `bp_verkehr_pruefung`, `bp_verkehr_rsto`, `bp_verkehr_tiefbau`, `bp_verkehr_tunnel`, `bp_verkehrswegebau` | Bauprodukte, – | geprueft, offen | 0 | 0 | 1 | 0 |
| [brandschutz](brandschutz.md) | `brandschutz` | Bauphysik | offen | 0 | 0 | 2 | 1 |
| [bruchmechanik](bruchmechanik.md) | `bruchmechanik` | Mechanik | geprueft | 0 | 0 | 0 | 0 |
| [carbonbeton](carbonbeton.md) | `carbonbeton` | Massivbau | geprueft | 0 | 0 | 7 | 2 |
| [daemmstoffe](daemmstoffe.md) | `daemmstoffe` | Baustoffe | geprueft | 0 | 0 | 0 | 0 |
| [daemmung_vergleich](daemmung_vergleich.md) | `daemmung_vergleich` | Bauphysik | geprueft | 0 | 0 | 0 | 2 |
| [dauerhaftigkeit](dauerhaftigkeit.md) | `dauerhaftigkeit` | Dauerhaftigkeit | geprueft | 0 | 0 | 0 | 2 |
| [dauerhaftigkeit_checklisten](dauerhaftigkeit_checklisten.md) | `dauerhaftigkeit_checklisten` | Dauerhaftigkeit | offen | 0 | 0 | 0 | 2 |
| [denkmalpflege](denkmalpflege.md) | `denkmalpflege` | Bauen im Bestand | geprueft | 0 | 0 | 0 | 0 |
| [dpp](dpp.md) | `dpp` | Digitales | geprueft | 0 | 0 | 0 | 1 |
| [einheiten](einheiten.md) | `einheiten` | Grundlagen | geprueft | 0 | 0 | 0 | 0 |
| [emodul](emodul.md) | `emodul` | Mechanik | geprueft | 1 | 0 | 0 | 1 |
| [energieausweis](energieausweis.md) | `energieausweis` | Bauphysik | offen | 0 | 1 | 1 | 1 |
| [erdbau](erdbau.md) | `erdbau` | Baustoffe | geprueft | 0 | 0 | 0 | 0 |
| [expositionsklassen](expositionsklassen.md) | `expositionsklassen` | Betontechnologie | offen | 0 | 0 | 1 | 2 |
| [faserverbund](faserverbund.md) | `faserverbund`, `kombinationen` | –, Baustoffe | offen, geprueft | 0 | 0 | 0 | 2 |
| [festbeton](festbeton.md) | `festbeton` | Betontechnologie | geprueft | 0 | 0 | 5 | 2 |
| [festbeton_statistik](festbeton_statistik.md) | `festbeton_statistik` | Labor & Auswertung | geprueft | 0 | 0 | 0 | 2 |
| [festigkeit](festigkeit.md) | `festigkeit` | Mechanik | geprueft | 0 | 0 | 0 | 0 |
| [feuchteschutz](feuchteschutz.md) | `feuchteschutz` | Bauphysik | offen | 0 | 0 | 4 | 6 |
| [formaenderungen](formaenderungen.md) | `formaenderungen` | Mechanik | geprueft | 0 | 0 | 0 | 1 |
| [forschung_transfer](forschung_transfer.md) | `forschung_transfer` | Thesen & Projekte | offen | 0 | 0 | 0 | 0 |
| [fortbildungen](fortbildungen.md) | `fortbildungen` | Infos & Quellen | offen | 0 | 0 | 0 | 0 |
| [frischbeton](frischbeton.md) | `frischbeton` | Betontechnologie | offen | 0 | 0 | 16 | 1 |
| [gesteine](gesteine.md) | `gesteine` | Baustoffe | geprueft | 0 | 0 | 0 | 1 |
| [gips](gips.md) | `gips` | Baustoffe | geprueft | 0 | 0 | 0 | 0 |
| [glas](glas.md) | `glas` | Baustoffe | geprueft | 0 | 0 | 0 | 0 |
| [glossar](glossar.md) | `glossar` | Infos & Quellen | offen | 0 | 0 | 0 | 0 |
| [grundlagen](grundlagen.md) | `grundlagen` | Betontechnologie | offen | 0 | 0 | 0 | 3 |
| [herstellung_einbau](herstellung_einbau.md) | `herstellung_einbau` | Betontechnologie | geprueft | 0 | 0 | 0 | 1 |
| [historisch](historisch.md) | `historisch` | Bauen im Bestand | geprueft | 1 | 0 | 5 | 2 |
| [historische_bauprodukte](historische_bauprodukte.md) | `historische_bauprodukte` | Bauen im Bestand | geprueft | 0 | 0 | 0 | 0 |
| [historische_bauweisen](historische_bauweisen.md) | `historische_bauweisen` | Bauen im Bestand | geprueft | 0 | 0 | 0 | 1 |
| [holz](holz.md) | `holz` | Baustoffe | geprueft | 0 | 0 | 0 | 2 |
| [holzbau_bauphysik](holzbau_bauphysik.md) | `holzbau_bauphysik`, `holzbau_bemessung`, `holzbau_info`, `holzbau_konstruktion`, `holzbau_verbindung`, `holzbau_werkstoffe` | Holzbau | geprueft, offen | 0 | 0 | 1 | 7 |
| [holzkorrosion](holzkorrosion.md) | `holzkorrosion` | Dauerhaftigkeit | offen | 0 | 0 | 3 | 0 |
| [holzwerkstoffe](holzwerkstoffe.md) | `holzwerkstoffe` | Baustoffe | geprueft | 0 | 0 | 0 | 0 |
| [hydratation_folgen](hydratation_folgen.md) | `hydratation_folgen` | Betontechnologie | offen | 0 | 0 | 12 | 2 |
| [informationsquellen](informationsquellen.md) | `informationsquellen` | Infos & Quellen | offen | 0 | 0 | 0 | 0 |
| [innenausbau](innenausbau.md) | `innenausbau` | Innenausbau | offen | 0 | 0 | 0 | 0 |
| [innovative_werkstoffe](innovative_werkstoffe.md) | `innovative_werkstoffe` | Betontechnologie | geprueft | 0 | 0 | 3 | 0 |
| [instandsetzung_asphalt](instandsetzung_asphalt.md) | `instandsetzung_asphalt`, `instandsetzung_holz`, `instandsetzung_kunststoffe`, `instandsetzung_materialien`, `instandsetzung_mauerwerk`, `instandsetzung_metalle` | –, Schutz & Instandsetzung | offen | 0 | 0 | 0 | 0 |
| [instandsetzung_checklisten](instandsetzung_checklisten.md) | `instandsetzung_checklisten` | Schutz & Instandsetzung | offen | 0 | 0 | 0 | 0 |
| [kalk](kalk.md) | `kalk` | Baustoffe | geprueft | 0 | 0 | 0 | 0 |
| [keramik_ziegel](keramik_ziegel.md) | `keramik_ziegel` | Baustoffe | geprueft | 0 | 1 | 0 | 0 |
| [ki_baustoffe](ki_baustoffe.md) | `ki_baustoffe`, `ki_llmpraxis`, `ki_lokal`, `ki_onlinekurse`, `ki_prompting`, `ki_recht_ethik`, `ki_ressourcen`, `ki_system`, `ki_thesen`, `ki_ueberblick` | –, KI im Bauwesen | offen, geprueft | 0 | 3 | 1 | 3 |
| [ki_uebungen](ki_uebungen.md) | `ki_uebungen` | KI im Bauwesen | geprueft | 0 | 0 | 0 | 2 |
| [knicken](knicken.md) | `knicken` | Mechanik | geprueft | 0 | 0 | 10 | 3 |
| [korrosion](korrosion.md) | `korrosion` | Dauerhaftigkeit | geprueft | 0 | 0 | 4 | 2 |
| [korrosionsschutz_beschichtungen](korrosionsschutz_beschichtungen.md) | `korrosionsschutz_beschichtungen` | Dauerhaftigkeit | geprueft | 0 | 0 | 0 | 0 |
| [kreislauf_dpp](kreislauf_dpp.md) | `kreislauf_dpp` | Nachhaltigkeit | geprueft | 0 | 0 | 2 | 0 |
| [kunststoffe](kunststoffe.md) | `kunststoffe` | Baustoffe | geprueft | 0 | 0 | 0 | 0 |
| [kuriositaeten](kuriositaeten.md) | `kuriositaeten` | Kuriositäten | offen | 0 | 0 | 0 | 0 |
| [labor](labor.md) | `labor` | Labor & Auswertung | offen | 0 | 0 | 2 | 0 |
| [labor_auslagerung](labor_auslagerung.md) | `labor_auslagerung` | Labor & Auswertung | geprueft | 0 | 0 | 0 | 0 |
| [labor_druckfestigkeit](labor_druckfestigkeit.md) | `labor_druckfestigkeit` | Labor & Auswertung | geprueft | 0 | 0 | 0 | 0 |
| [labor_frischbeton](labor_frischbeton.md) | `labor_frischbeton` | Labor & Auswertung | geprueft | 0 | 0 | 0 | 0 |
| [labor_moertelprismen](labor_moertelprismen.md) | `labor_moertelprismen` | Labor & Auswertung | geprueft | 0 | 0 | 0 | 0 |
| [labor_potentialmessung](labor_potentialmessung.md) | `labor_potentialmessung` | Labor & Auswertung | geprueft | 0 | 0 | 1 | 0 |
| [labor_sicherheit](labor_sicherheit.md) | `labor_sicherheit` | Baustofflabor | geprueft | 0 | 0 | 0 | 0 |
| [lca_ingenieurbau](lca_ingenieurbau.md) | `lca_ingenieurbau`, `lca_rechner`, `lca_regulatorik`, `oekobilanz_lca` | Nachhaltigkeit | geprueft | 5 | 29 | 40 | 9 |
| [lebensdauerbemessung](lebensdauerbemessung.md) | `lebensdauerbemessung` | Dauerhaftigkeit | geprueft | 0 | 0 | 0 | 3 |
| [lebenszyklus_kosten](lebenszyklus_kosten.md) | `lebenszyklus_kosten` | Nachhaltigkeit | geprueft | 0 | 0 | 0 | 0 |
| [lehm](lehm.md) | `lehm` | Baustoffe | offen | 0 | 0 | 0 | 4 |
| [lehrveranstaltungen](lehrveranstaltungen.md) | `lehrveranstaltungen`, `lv_aryc`, `lv_bauen_im_bestand`, `lv_baustoffkunde`, `lv_ki_master`, `lv_vnhb`, `lv_wpf_nachhaltiges_bauen`, `lv_zert_ausbau_bestand` | Lehrveranstaltungen | offen | 0 | 0 | 0 | 2 |
| [literatur](literatur.md) | `literatur` | Infos & Quellen | offen | 0 | 0 | 0 | 0 |
| [material_schaeden_gross](material_schaeden_gross.md) | `material_schaeden_gross` | Mängel & Schäden | geprueft | 0 | 0 | 0 | 1 |
| [materialdatenbanken](materialdatenbanken.md) | `materialdatenbanken` | Digitales | geprueft | 0 | 8 | 0 | 2 |
| [materialitaet_architektur](materialitaet_architektur.md) | `materialitaet_architektur` | Baustoffe | geprueft | 0 | 0 | 0 | 0 |
| [materialkennwerte](materialkennwerte.md) | `materialkennwerte` | Grundlagen | geprueft | 0 | 0 | 1 | 0 |
| [materialmodelle](materialmodelle.md) | `materialmodelle` | Mechanik | geprueft | 0 | 0 | 0 | 3 |
| [materialoptimierung](materialoptimierung.md) | `materialoptimierung` | Nachhaltigkeit | offen | 2 | 0 | 0 | 2 |
| [materialpaesse](materialpaesse.md) | `materialpaesse` | Digitales | geprueft | 0 | 0 | 0 | 0 |
| [mauerwerk](mauerwerk.md) | `mauerwerk` | Baustoffe | offen | 0 | 0 | 4 | 0 |
| [mechanische_kenngroessen](mechanische_kenngroessen.md) | `mechanische_kenngroessen` | Mechanik | offen | 0 | 0 | 3 | 4 |
| [mechanische_pruefungen](mechanische_pruefungen.md) | `mechanische_pruefungen` | Labor & Auswertung | geprueft | 0 | 0 | 0 | 0 |
| [membranen_etfe](membranen_etfe.md) | `membranen_etfe` | Baustoffe | geprueft | 0 | 0 | 1 | 0 |
| [messen_pruefen](messen_pruefen.md) | `messen_pruefen` | Labor & Auswertung | geprueft | 0 | 0 | 4 | 0 |
| [metalle](metalle.md) | `metalle` | Baustoffe | geprueft | 0 | 0 | 0 | 0 |
| [metallkorrosion](metallkorrosion.md) | `metallkorrosion` | Dauerhaftigkeit | geprueft | 0 | 0 | 1 | 0 |
| [mischungsberechnung](mischungsberechnung.md) | `mischungsberechnung` | Betontechnologie | geprueft | 0 | 0 | 18 | 2 |
| [modernisierung](modernisierung.md) | `modernisierung` | Bauen im Bestand | geprueft | 0 | 0 | 1 | 2 |
| [nachbehandlung](nachbehandlung.md) | `nachbehandlung` | Betontechnologie | offen | 0 | 0 | 0 | 1 |
| [nachhaltigkeit_daten_regeln](nachhaltigkeit_daten_regeln.md) | `nachhaltigkeit_daten_regeln` | Nachhaltigkeit | geprueft | 0 | 0 | 2 | 2 |
| [nawaro](nawaro.md) | `nawaro` | Baustoffe | geprueft | 0 | 2 | 0 | 1 |
| [normen_ausblick](normen_ausblick.md) | `normen_ausblick` | Grundlagen | geprueft | 0 | 0 | 0 | 11 |
| [online_tools](online_tools.md) | `online_tools` | Digitales | geprueft | 0 | 0 | 0 | 1 |
| [pfas_baustoffe](pfas_baustoffe.md) | `pfas_baustoffe` | Rückbau & Schadstoffe | geprueft | 0 | 0 | 0 | 0 |
| [probenahme](probenahme.md) | `probenahme` | Labor & Auswertung | offen | 0 | 0 | 0 | 0 |
| [putzemoertel](putzemoertel.md) | `putzemoertel` | Baustoffe | geprueft | 0 | 0 | 0 | 1 |
| [px_bauleitung](px_bauleitung.md) | `px_bauleitung`, `px_karriere`, `px_planung`, `px_produktion` | Praxiswissen | geprueft, offen | 0 | 0 | 0 | 4 |
| [px_bautagebuch](px_bautagebuch.md) | `px_bautagebuch` | Praxiswissen | geprueft | 0 | 0 | 0 | 0 |
| [qualitaetssicherung](qualitaetssicherung.md) | `qualitaetssicherung` | Betontechnologie | geprueft | 0 | 0 | 4 | 2 |
| [rechnung_bestand](rechnung_bestand.md) | `rechnung_bestand`, `rechnung_beton`, `rechnung_brandschutz`, `rechnung_holzbau`, `rechnung_mauerwerk`, `rechnung_nachhaltigkeit`, `rechnung_schallschutz`, `rechnung_stahlbeton`, `rechnung_u_wert` | Beispielrechnungen | offen, geprueft | 0 | 0 | 5 | 4 |
| [regularien](regularien.md) | `regularien` | Grundlagen | geprueft | 0 | 0 | 0 | 0 |
| [ressourcen_umwelt](ressourcen_umwelt.md) | `ressourcen_umwelt` | Nachhaltigkeit | geprueft | 0 | 2 | 0 | 2 |
| [ressourceneffizienz](ressourceneffizienz.md) | `ressourceneffizienz` | Rückbau & Schadstoffe | offen | 0 | 1 | 16 | 1 |
| [rueckbau](rueckbau.md) | `rueckbau` | Rückbau & Schadstoffe | geprueft | 0 | 0 | 0 | 0 |
| [rueckbau_checklisten](rueckbau_checklisten.md) | `rueckbau_checklisten` | Rückbau & Schadstoffe | offen | 0 | 0 | 0 | 0 |
| [schadensbilder](schadensbilder.md) | `schadensbilder` | Mängel & Schäden | offen | 0 | 0 | 0 | 0 |
| [schadreaktionen_beton](schadreaktionen_beton.md) | `schadreaktionen_beton` | Dauerhaftigkeit | offen | 0 | 0 | 5 | 1 |
| [schadstoffe](schadstoffe.md) | `schadstoffe` | Rückbau & Schadstoffe | geprueft | 0 | 12 | 0 | 0 |
| [schaeden_checklisten](schaeden_checklisten.md) | `schaeden_checklisten` | Mängel & Schäden | offen | 0 | 0 | 0 | 0 |
| [schallschutz](schallschutz.md) | `schallschutz` | Bauphysik | offen | 0 | 0 | 0 | 1 |
| [schnellkarbonatisierung](schnellkarbonatisierung.md) | `schnellkarbonatisierung` | Dauerhaftigkeit | geprueft | 0 | 0 | 1 | 2 |
| [schutz_grundlagen](schutz_grundlagen.md) | `schutz_grundlagen` | Schutz & Instandsetzung | offen | 0 | 0 | 0 | 0 |
| [sicherheitskonzept](sicherheitskonzept.md) | `sicherheitskonzept` | Grundlagen | geprueft | 0 | 0 | 0 | 4 |
| [sichtbeton](sichtbeton.md) | `sichtbeton` | Betontechnologie | geprueft | 0 | 0 | 0 | 0 |
| [software](software.md) | `software` | Infos & Quellen | offen | 0 | 0 | 0 | 0 |
| [sommerlicher_waermeschutz](sommerlicher_waermeschutz.md) | `sommerlicher_waermeschutz` | Bauphysik | geprueft | 0 | 0 | 0 | 11 |
| [sonderbetone](sonderbetone.md) | `sonderbetone` | Betontechnologie | geprueft | 0 | 0 | 10 | 2 |
| [sonstiges](sonstiges.md) | `sonstiges` | Baustoffe | geprueft | 0 | 0 | 0 | 0 |
| [spannbeton_grundlagen](spannbeton_grundlagen.md) | `spannbeton_grundlagen`, `spannbeton_kennwerte` | Massivbau | geprueft | 0 | 0 | 49 | 3 |
| [stahl](stahl.md) | `stahl` | Baustoffe | geprueft | 0 | 0 | 0 | 3 |
| [stahlbau_ec3](stahlbau_ec3.md) | `stahlbau_ec3` | Mechanik | geprueft | 1 | 0 | 0 | 3 |
| [statistik](statistik.md) | `statistik` | Labor & Auswertung | geprueft | 0 | 0 | 3 | 1 |
| [studium_tha](studium_tha.md) | `studium_tha` | Studium THA | offen | 0 | 0 | 0 | 0 |
| [thesen_projekte](thesen_projekte.md) | `thesen_projekte` | Thesen & Projekte | offen | 0 | 0 | 0 | 0 |
| [ttz_weiterbildung](ttz_weiterbildung.md) | `ttz_weiterbildung` | Weiter@THA | offen | 0 | 0 | 0 | 0 |
| [vdi6200](vdi6200.md) | `vdi6200` | Mängel & Schäden | geprueft | 0 | 0 | 0 | 0 |
| [vl_bauen_im_bestand](vl_bauen_im_bestand.md) | `vl_bauen_im_bestand`, `vl_bauschaeden`, `vl_baustoffkunde`, `vl_instandhaltung`, `vl_nachhaltiges_bauen`, `vl_ueberblick` | Vorlesungen, – | offen | 0 | 0 | 2 | 0 |
| [waermeeigenschaften](waermeeigenschaften.md) | `waermeeigenschaften` | Bauphysik | geprueft | 0 | 0 | 0 | 0 |
| [weiter_ausbau](weiter_ausbau.md) | `weiter_ausbau`, `weiter_bauing`, `weiter_fassade`, `weiter_holzbau`, `weiter_mapr`, `weiter_pm`, `weiter_tha`, `weiter_ttz` | Weiter@THA | offen | 0 | 0 | 0 | 0 |
| [weitere_organik](weitere_organik.md) | `weitere_organik` | Dauerhaftigkeit | geprueft | 0 | 0 | 3 | 0 |
| [wta](wta.md) | `wta` | Schutz & Instandsetzung | offen | 0 | 0 | 0 | 1 |
| [wu-bauwerke](wu-bauwerke.md) | `wu-bauwerke` | Massivbau | geprueft | 0 | 0 | 0 | 3 |
| [zertifizierung_siegel](zertifizierung_siegel.md) | `zertifizierung_siegel` | Nachhaltigkeit | offen | 0 | 0 | 0 | 0 |
| [_gemeinsam](_gemeinsam.md) | – | – | – | 2 | 10 | 16 | 12 |

## Normen mit uneinheitlicher Ausgabe

| Norm | Ausgaben (Anzahl Verweise) | Registry |
|---|---|---|
| DIN 1045 | 1937 (2), 1959 (1, nur mit Hinweis), 1972 (4), 1978 (2), 1988 (1), 2023 (1, nur mit Hinweis), 2023-08 (1) | – |
| DIN 1045-2 | 2008 (2), 2008-08 (5), 2023 (6), 2023-08 (139) | 2023-08 |
| DIN 4108-2 | 2013-02 (25), 2026-05 (10) | 2026-05 |
| DIN 4108-3 | 2018-10 (3), 2024-03 (17) | 2024-03 |
| DIN 4109 | 1989 (3), 1989-11 (1, nur mit Hinweis), 2018 (2) | – |
| DIN 18533-1 | 2017-07 (2), 2026-06 (4) | – |
| DIN 18945 | 2018-12 (1), 2024-03 (4) | – |
| DIN 18946 | 2018-12 (1), 2024-03 (3) | – |
| DIN 18947 | 2018-12 (1), 2024-03 (2) | – |
| DIN 18948 | 2018-12 (1), 2024-03 (2) | – |
| EN 206-1 | 2001 (6), 2026 (4), 2026-07 (5) | 2026-07 |
| EN 1990 | 2010-12 (2, nur mit Hinweis), 2021-10 (9), 2023 (6) | – |
| EN 1990/NA | 2010-12 (2), 2012-08 (1) | – |
| EN 1992-1-1 | 2011 (7), 2011-01 (49), 2023 (23), 2025-09 (25) | 2011-01 |
| EN 1993-1-1 | 2010-12 (9), 2022 (1, nur mit Hinweis), 2025-04 (12) | 2010-12 |
| EN 1995-1-1 | 2010-12 (13), 2025 (3, nur mit Hinweis), 2026-09 (6) | 2010-12 |
| EN 10025-2 | 2004 (1), 2019-10 (2) | – |
| EN 15804 | 2012 (6), 2022-03 (14) | 2022-03 |
| EN 17472 | 2022 (1), 2024-06 (6) | 2024-06 |

## Dieselbe Tabelle unter verschiedenen Normteilen

| Norm, Tabelle | Teile (Anzahl, Berichte) |
|---|---|
| EN 1993 Tab. 3.1 | -1-1 (5: mechanische_kenngroessen, stahl); -1-2 (2: stahl) |
| EN 1995 Tab. 3.1 | -1-2 (5: brandschutz, holz, holzbau_bauphysik, rechnung_bestand); -1-1 (2: holzbau_bauphysik, rechnung_bestand) |


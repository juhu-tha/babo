# Quiz-Vorprüfung Cluster IV–VI (Stand 25.10.2026)

Technische Vorprüfung als zweites Augenpaar vor der fachlichen Freigabe durch Prof. Dr.-Ing. Jürgen Huber.
`verified` wurde nicht verändert; jede vorgeprüfte Frage trägt `vorpruefung: { am, ergebnis, hinweis? }`.

**Hinweis zum Umfang:** Die Cluster-Registry (src/data/metaClusters.ts, `ClusterNummer` in src/data/quizZuordnung.ts) kennt nur die Cluster I–VI.
Einen Cluster VII gibt es nicht; geprüft wurden daher alle Fragen der Cluster IV (Bestand & Nachhaltigkeit), V (Digitales & Infos) und VI (Studium & Lehre).

## Zahlen

| | Anzahl |
|---|---|
| Fragen in Cluster IV / V / VI | 227 / 100 / 54 (gesamt 381) |
| davon bereits freigegeben (unverändert) | 9 |
| vorgeprüft | 372 |
| ok | 363 |
| korrigiert | 8 |
| fraglich | 1 |

Prüfumfang je Frage: Richtigkeit und Eindeutigkeit der Lösung (Gesetzes- und Normenstand Oktober 2026), Plausibilität der Distraktoren,
Übereinstimmung von Erklärung, Rückmeldungen und Wissenslücken-Text, Zahlen und Einheiten (alle Rechenfragen samt Distraktorwerten nachgerechnet),
normRef gegen src/data/centralNormenRegistry.ts, Bloom-Stufe und Niveau.
Zweifelhafte Rechtsstände wurden per Websuche geprüft (GModG §§ 35, 36, 69, 105; AI-Omnibus; GefStoffV §§ 5a, 11a; PFAS-Beschränkung RAC 03/2026; DIN SPEC 91525; DIN 1076 Neuausgabe 2026; Gebäudetyp E).

## Ratschen (tests/quiz.test.ts)

| Ratsche | vorher | nachher | Beitrag Cluster IV–VI |
|---|---|---|---|
| Verhältnis > 1,2 | 26 | 26 | 9 – ausschließlich freigegebene Fragen |
| Absolutwörter in Distraktoren | 10 | 10 | 3 – ausschließlich freigegebene Fragen |

Alle Fragen der Cluster IV–VI, die zu den Ratschen beitragen, sind bereits von Prof. Huber freigegeben (Kommentar Z23d an `GRENZE`).
Sie wurden bewusst nicht umgeschrieben, damit keine freigegebene Fassung ohne erneute Freigabe verändert wird. Vorschläge zur Freigabe:

- q_zfp_1 (1,58), q_dauer_1 (2,94), q_vdi_1 (3,66), q_schadstoff_1 (3,07), q_lca_1 (1,88), q_lca_2 (2,81): richtige Antwort auf Distraktorlänge kürzen (Begründung in die Erklärung verschieben) oder Distraktoren gleich lang ausformulieren.
- q_dauer_2 (2,52; „ausschließlich“), q_circular_1 (1,76; „ausschließlich“), q_dpp_1 (2,82; „ausschließlich“): zusätzlich „ausschließlich“ im Distraktor durch „nur“ bzw. eine konkrete Bedingung ersetzen.

Werden diese neun Fragen nach Freigabe angepasst, sinken die Ratschen um bis zu 9 (Verhältnis) bzw. 3 (Absolutwörter).

## Fraglich – bitte entscheiden (Prof. Huber)

- **q_ndr_2** (Daten & Regeln): Eckpunkte BMJV/BMWSB vom 20.11.2025 bestätigt; laut BAK sollte ein Referentenentwurf nach dem Sommer 2026 folgen (Kabinett Ende 2026). Ob er im Oktober 2026 vorliegt, war nicht feststellbar – ggf. richtige Antwort aktualisieren.

## Einzelergebnisse

| id | Ergebnis | was geändert | Begründung/Quelle |
|---|---|---|---|
| q_zfp_1 | – (freigegeben) | – | bereits von Prof. Huber freigegeben; nicht vorgeprüft, nicht geändert |
| q_dauer_1 | – (freigegeben) | – | bereits von Prof. Huber freigegeben; nicht vorgeprüft, nicht geändert |
| q_dauer_2 | – (freigegeben) | – | bereits von Prof. Huber freigegeben; nicht vorgeprüft, nicht geändert |
| q_vdi_1 | – (freigegeben) | – | bereits von Prof. Huber freigegeben; nicht vorgeprüft, nicht geändert |
| q_schadstoff_1 | – (freigegeben) | – | bereits von Prof. Huber freigegeben; nicht vorgeprüft, nicht geändert |
| q_lca_1 | – (freigegeben) | – | bereits von Prof. Huber freigegeben; nicht vorgeprüft, nicht geändert |
| q_lca_2 | – (freigegeben) | – | bereits von Prof. Huber freigegeben; nicht vorgeprüft, nicht geändert |
| q_circular_1 | – (freigegeben) | – | bereits von Prof. Huber freigegeben; nicht vorgeprüft, nicht geändert |
| q_dpp_1 | – (freigegeben) | – | bereits von Prof. Huber freigegeben; nicht vorgeprüft, nicht geändert |
| q_ndr_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ndr_2 | fraglich | Eckpunkte BMJV/BMWSB vom 20.11.2025 bestätigt; laut BAK sollte ein Referentenentwurf nach dem Sommer 2026 folgen (Kabinett Ende 2026). Ob er im Oktober 2026 vorliegt, war nicht feststellbar – ggf. richtige Antwort aktualisieren. | BAK-Pressemitteilungen 20.11.2025 (Eckpunkte, RefE nach Sommer 2026 geplant) und 17.04.2026; Lobbyregister RV0026020 |
| q_mo_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_mo_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_oe_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_oe_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_zs_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_zs_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_kw_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_kw_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ru_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_ru_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_lk_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_lk_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_bst_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_bst_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_bwe_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_bwe_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_dp_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_dp_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_mod_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_mod_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_bwu_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_bwu_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_hk_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_hk_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_hb_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_hb_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_hp_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_hp_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_cl_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_cl_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_rb_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_rb_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_bm_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_bm_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ab_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_ab_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_sch_1 | ok | – | § 5a Abs. 2 GefStoffV (gesetze-im-internet.de): Baujahr 1993–1996 → Datum des Baubeginns, sonst Baujahr |
| q_sch_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_altholz_urban_mining_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_altholz_urban_mining_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_altholz_urban_mining_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_altholz_urban_mining_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_altholz_urban_mining_5 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_altholz_urban_mining_6 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_altholz_urban_mining_7 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_pfas_baustoffe_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_pfas_baustoffe_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_pfas_baustoffe_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_pfas_baustoffe_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_pfas_baustoffe_5 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_pfas_baustoffe_6 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_pfas_baustoffe_7 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_re_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_re_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_rc_1 | korrigiert | Antwort bestätigt (§ 11a Abs. 4 GefStoffV: spätestens eine Woche vor Beginn). Erklärung korrigiert: keine „Genehmigung“ für niedriges/mittleres Risiko, sondern risikoabhängige Anzeige; Zulassung bei hohem Risiko max. 6 Jahre (§ 11a Abs. 3). | § 11a Abs. 3 und 4 GefStoffV (gesetze.legal): Anzeige spätestens eine Woche vor Beginn, Art/Umfang je Risikobereich; Zulassung max. 6 Jahre |
| q_rc_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_dh_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_dh_3 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_ko_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ko_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_sb_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_sb_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_ho_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ho_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_me_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_me_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_wo_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_wo_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_dc_1 | korrigiert | Rückmeldung zu Option 2: 0,45 gilt für XD3/XS3, nicht für XF4 (dort 0,50 mit LP, DIN 1045-2 Tab. F.2.1). | DIN 1045-2:2023-08, Tab. F.2.1 (XD3/XS3 0,45; XF4 0,50 mit LP) |
| q_dc_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ms_bs_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ms_bs_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ms_tb_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ms_tb_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ms_mo_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ms_mo_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ms_zb_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ms_zb_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ms_mg_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ms_mg_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ms_sc_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_ms_sc_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_is_sg_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_is_sg_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_is_sb_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_is_sb_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_is_im_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_is_im_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_is_wta_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_is_wta_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_is_cl_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_is_cl_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_dg_bim_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_dg_bim_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_dg_db_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_dg_db_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_dg_mp_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_dg_mp_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_dg_dpp_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_dg_dpp_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_dg_ot_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_dg_ot_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ki_ub_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_ki_ub_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_ki_sy_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ki_sy_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_ki_pr_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ki_pr_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_ki_lp_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_ki_lp_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ki_th_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_ki_th_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ki_re_1 | korrigiert | Antwort bestätigt; Fundstelle VO (EU) 2026/1744 (ABl. 24.07.2026, in Kraft 27.07.2026) in der Erklärung ergänzt. | VO (EU) 2026/1744 (AI-Omnibus), ABl. 24.07.2026, in Kraft 27.07.2026: Anhang III 02.12.2027, Anhang I 02.08.2028, Art. 50 ab 02.08.2026 (natlawreview.com) |
| q_ki_re_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ki_lk_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_ki_lk_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ki_rs_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ki_rs_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_ki_ok_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_ki_ok_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ki_bs_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_ki_bs_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_px_pl_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_px_pl_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_px_bl_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_px_bl_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_px_pr_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_px_pr_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_px_ka_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_px_ka_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_px_bt_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| q_px_bt_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_ku_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| q_ku_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_lca_rechner_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_lca_rechner_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_lca_rechner_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_lca_rechner_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_lca_rechner_5 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_lca_ingenieurbau_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_lca_ingenieurbau_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_lca_ingenieurbau_3 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_lca_ingenieurbau_4 | korrigiert | Erklärung: Kennwert 863 t/(1 500 m² · 100 a) = 5,75 statt 5,76; Nettovorteil 38 t (inkl. Modul C) ergänzt. | Nachrechnung 863 000/150 000 = 5,753; 825 − 863 = −38 t |
| qn_lca_ingenieurbau_5 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_lca_ingenieurbau_6 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_lca_regulatorik_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_lca_regulatorik_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_lca_regulatorik_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_lca_regulatorik_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_lca_regulatorik_5 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_lca_regulatorik_6 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_materialoptimierung_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_materialoptimierung_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_materialoptimierung_3 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_materialoptimierung_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_lca_rechner_x_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_lca_ingenieurbau_x_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_kreislauf_dpp_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_kreislauf_dpp_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_kreislauf_dpp_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_ressourcen_umwelt_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_ressourcen_umwelt_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_ressourcen_umwelt_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_ressourcen_umwelt_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_lebenszyklus_kosten_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_lebenszyklus_kosten_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_lebenszyklus_kosten_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_lebenszyklus_kosten_4 | korrigiert | Distraktor 115 000 € → 108 000 €, damit Wert und Rückmeldung (35 % Aufschlag) übereinstimmen. | Nachrechnung 80 000 · 1,35 = 108 000 € |
| qn_bauwerkserfassung_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_bauwerkserfassung_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_bauwerkserfassung_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_bauwerkserfassung_4 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_denkmalpflege_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_denkmalpflege_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_denkmalpflege_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_denkmalpflege_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_modernisierung_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_modernisierung_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_modernisierung_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_modernisierung_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_bauwerksuntersuchung_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_bauwerksuntersuchung_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_bauwerksuntersuchung_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_historische_bauweisen_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_historische_bauweisen_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_historische_bauweisen_3 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_historische_bauweisen_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_historische_bauprodukte_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_historische_bauprodukte_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_historische_bauprodukte_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_historische_bauprodukte_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rueckbau_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rueckbau_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rueckbau_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rueckbau_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_boden_materialaufbereitung_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_boden_materialaufbereitung_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_boden_materialaufbereitung_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_boden_materialaufbereitung_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_ressourceneffizienz_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_ressourceneffizienz_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_ressourceneffizienz_3 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_ressourceneffizienz_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_dauerhaftigkeit_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_dauerhaftigkeit_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_dauerhaftigkeit_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_korrosion_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_korrosion_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_korrosion_3 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_korrosion_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_schadreaktionen_beton_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_schadreaktionen_beton_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_schadreaktionen_beton_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_schadreaktionen_beton_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_holzkorrosion_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_holzkorrosion_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_holzkorrosion_3 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_holzkorrosion_4 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_metallkorrosion_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_metallkorrosion_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_metallkorrosion_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_metallkorrosion_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_weitere_organik_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_weitere_organik_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_weitere_organik_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_weitere_organik_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_bauwerksunters_monitoring_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_bauwerksunters_monitoring_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_bauwerksunters_monitoring_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_bauwerksunters_monitoring_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_vdi6200_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_vdi6200_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_vdi6200_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_instandsetzung_materialien_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_instandsetzung_materialien_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_instandsetzung_materialien_3 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_instandsetzung_materialien_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_instandhaltung_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_instandhaltung_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_instandhaltung_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_instandhaltung_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rechnung_u_wert_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rechnung_u_wert_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_u_wert_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rechnung_u_wert_4 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_u_wert_5 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rechnung_u_wert_6 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rechnung_beton_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_beton_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_beton_3 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_beton_4 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_beton_5 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rechnung_beton_6 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rechnung_stahlbeton_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_stahlbeton_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_stahlbeton_3 | korrigiert | Nachgerechnet: 0,120/(434,8 · 0,422) = 6,54 cm² (vorher 6,55). | Nachrechnung 0,120/(434,8 · 0,422) = 6,540 · 10⁻⁴ m² |
| qn_rechnung_stahlbeton_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rechnung_stahlbeton_5 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_stahlbeton_6 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rechnung_holzbau_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_holzbau_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_holzbau_3 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_holzbau_4 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_holzbau_5 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_holzbau_6 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rechnung_mauerwerk_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_mauerwerk_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_mauerwerk_3 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_mauerwerk_4 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_mauerwerk_5 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rechnung_mauerwerk_6 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rechnung_nachhaltigkeit_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_nachhaltigkeit_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_nachhaltigkeit_3 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_nachhaltigkeit_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rechnung_nachhaltigkeit_5 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rechnung_nachhaltigkeit_6 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rechnung_bestand_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_bestand_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_bestand_3 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_bestand_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rechnung_bestand_5 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rechnung_bestand_6 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rechnung_schallschutz_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_schallschutz_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_schallschutz_3 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_schallschutz_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rechnung_schallschutz_5 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rechnung_schallschutz_6 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rechnung_brandschutz_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_brandschutz_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_brandschutz_3 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_rechnung_brandschutz_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rechnung_brandschutz_5 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_rechnung_brandschutz_6 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_online_tools_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_online_tools_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_online_tools_3 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_online_tools_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_bim_baustoffe_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_bim_baustoffe_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_bim_baustoffe_3 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_bim_baustoffe_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_materialpaesse_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_materialpaesse_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_materialpaesse_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_materialpaesse_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_dpp_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_dpp_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_dpp_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_ki_system_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_ki_system_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_ki_system_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_ki_system_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_ki_prompting_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_ki_prompting_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_ki_prompting_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_ki_prompting_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_ki_llmpraxis_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_ki_llmpraxis_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_ki_llmpraxis_3 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_ki_llmpraxis_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_ki_thesen_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_ki_thesen_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_ki_thesen_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_ki_thesen_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_ki_lokal_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_ki_lokal_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_ki_lokal_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_ki_lokal_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_ki_ueb_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_ki_ueb_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_ki_ueb_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_ki_ueb_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_ki_ueb_5 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_ki_ueb_6 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_px_bauleitung_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_px_bauleitung_2 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_px_bauleitung_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_px_bauleitung_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_px_bautagebuch_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_px_bautagebuch_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_px_bautagebuch_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_px_bautagebuch_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_px_produktion_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_px_produktion_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_px_produktion_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_px_produktion_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_px_karriere_1 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_px_karriere_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_px_karriere_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_px_karriere_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_oekobilanz_lca_g1 | korrigiert | Distraktor 48 % → 50 %: der beschriebene Fehler ergibt (286 − 144)/286 ≈ 50 %. | Nachrechnung (286 − 144)/286 = 49,7 % |
| qn_oekobilanz_lca_g2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_oekobilanz_lca_g3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_korrosionsschutz_beschichtungen_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_korrosionsschutz_beschichtungen_2 | korrigiert | Distraktor 30 → 27 Jahre: 85 µm/3,15 µm/a ≈ 27 a entspricht dem beschriebenen Fehler. | Nachrechnung 85/3,15 = 27,0 a; DIN EN ISO 9223 C4 2,1–4,2 µm/a |
| qn_korrosionsschutz_beschichtungen_3 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_korrosionsschutz_beschichtungen_4 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_korrosionsschutz_beschichtungen_5 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_korrosionsschutz_beschichtungen_6 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_korrosionsschutz_beschichtungen_7 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_korrosionsschutz_beschichtungen_8 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_schnellkarbonatisierung_1 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_schnellkarbonatisierung_2 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_schnellkarbonatisierung_3 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_schnellkarbonatisierung_4 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_schnellkarbonatisierung_5 | ok | – | Rechenweg und alle Distraktorwerte nachgerechnet; Feedback konsistent |
| qn_schnellkarbonatisierung_6 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |
| qn_schnellkarbonatisierung_7 | ok | – | Lösung, Distraktoren, Rückmeldungen und Erklärung fachlich konsistent |

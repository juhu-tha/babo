import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { Layers, Calculator, Play, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { InnovationPraxisSection } from '@/src/components/ui/InnovationPraxisSection';

interface ProfileData {
  name: string;
  h: number; // Höhe in mm
  b: number; // Breite in mm
  tw: number; // Stegdicke in mm
  tf: number; // Flanschdicke in mm
  A: number; // Querschnittsfläche in cm²
  Iy: number; // Trägheitsmoment um y-Achse in cm⁴
  Iz: number; // Trägheitsmoment um z-Achse in cm⁴
  Wy: number; // Elastisches Widerstandsmoment um y-Achse in cm³
  Wz: number; // Elastisches Widerstandsmoment um z-Achse in cm³
  iy: number; // Trägheitsradius um y-Achse in cm
  iz: number; // Trägheitsradius um z-Achse in cm
}

const IPE_PROFILES: ProfileData[] = [
  { name: 'IPE 80', h: 80, b: 46, tw: 3.8, tf: 5.2, A: 7.64, Iy: 80.1, Iz: 8.49, Wy: 20.0, Wz: 3.69, iy: 3.24, iz: 1.05 },
  { name: 'IPE 100', h: 100, b: 55, tw: 4.1, tf: 5.7, A: 10.3, Iy: 171, Iz: 15.9, Wy: 34.2, Wz: 5.79, iy: 4.07, iz: 1.24 },
  { name: 'IPE 120', h: 120, b: 64, tw: 4.4, tf: 6.3, A: 13.2, Iy: 318, Iz: 27.7, Wy: 53.0, Wz: 8.65, iy: 4.90, iz: 1.45 },
  { name: 'IPE 140', h: 140, b: 73, tw: 4.7, tf: 6.9, A: 16.4, Iy: 541, Iz: 44.9, Wy: 77.3, Wz: 12.3, iy: 5.74, iz: 1.65 },
  { name: 'IPE 160', h: 160, b: 82, tw: 5.0, tf: 7.4, A: 20.1, Iy: 869, Iz: 68.3, Wy: 109, Wz: 16.7, iy: 6.58, iz: 1.84 },
  { name: 'IPE 180', h: 180, b: 91, tw: 5.3, tf: 8.0, A: 23.9, Iy: 1317, Iz: 101, Wy: 146, Wz: 22.2, iy: 7.42, iz: 2.05 },
  { name: 'IPE 200', h: 200, b: 100, tw: 5.6, tf: 8.5, A: 28.5, Iy: 1943, Iz: 142, Wy: 194, Wz: 28.5, iy: 8.26, iz: 2.24 },
  { name: 'IPE 220', h: 220, b: 110, tw: 5.9, tf: 9.2, A: 33.4, Iy: 2772, Iz: 205, Wy: 252, Wz: 37.3, iy: 9.11, iz: 2.48 },
  { name: 'IPE 240', h: 240, b: 120, tw: 6.2, tf: 9.8, A: 39.1, Iy: 3892, Iz: 284, Wy: 324, Wz: 47.3, iy: 9.97, iz: 2.69 },
  { name: 'IPE 270', h: 270, b: 135, tw: 6.6, tf: 10.2, A: 45.9, Iy: 5790, Iz: 420, Wy: 429, Wz: 62.2, iy: 11.2, iz: 3.02 },
  { name: 'IPE 300', h: 300, b: 150, tw: 7.1, tf: 10.7, A: 53.8, Iy: 8356, Iz: 604, Wy: 557, Wz: 80.5, iy: 12.5, iz: 3.35 },
  { name: 'IPE 330', h: 330, b: 160, tw: 7.5, tf: 11.5, A: 62.6, Iy: 11770, Iz: 788, Wy: 713, Wz: 98.5, iy: 13.7, iz: 3.55 },
  { name: 'IPE 360', h: 360, b: 170, tw: 8.0, tf: 12.7, A: 72.7, Iy: 16270, Iz: 1043, Wy: 904, Wz: 123, iy: 15.0, iz: 3.79 },
  { name: 'IPE 400', h: 400, b: 180, tw: 8.6, tf: 13.5, A: 84.5, Iy: 23130, Iz: 1318, Wy: 1160, Wz: 146, iy: 16.5, iz: 3.95 },
  { name: 'IPE 450', h: 450, b: 190, tw: 9.4, tf: 14.6, A: 98.8, Iy: 33740, Iz: 1676, Wy: 1500, Wz: 176, iy: 18.5, iz: 4.12 },
  { name: 'IPE 500', h: 500, b: 200, tw: 10.2, tf: 16.0, A: 116, Iy: 48200, Iz: 2140, Wy: 1930, Wz: 214, iy: 20.4, iz: 4.31 },
  { name: 'IPE 550', h: 550, b: 210, tw: 11.1, tf: 17.2, A: 134, Iy: 67120, Iz: 2668, Wy: 2440, Wz: 254, iy: 22.3, iz: 4.45 },
  { name: 'IPE 600', h: 600, b: 220, tw: 12.0, tf: 19.0, A: 156, Iy: 92080, Iz: 3387, Wy: 3070, Wz: 308, iy: 24.3, iz: 4.66 },
];

const HEA_PROFILES: ProfileData[] = [
  { name: 'HEA 100', h: 96, b: 100, tw: 5.0, tf: 8.0, A: 21.2, Iy: 349, Iz: 134, Wy: 72.8, Wz: 26.8, iy: 4.06, iz: 2.51 },
  { name: 'HEA 120', h: 114, b: 120, tw: 5.0, tf: 8.0, A: 25.3, Iy: 606, Iz: 231, Wy: 106, Wz: 38.5, iy: 4.89, iz: 3.02 },
  { name: 'HEA 140', h: 133, b: 140, tw: 5.5, tf: 8.5, A: 31.4, Iy: 1033, Iz: 389, Wy: 155, Wz: 55.6, iy: 5.73, iz: 3.52 },
  { name: 'HEA 160', h: 152, b: 160, tw: 6.0, tf: 9.0, A: 38.8, Iy: 1673, Iz: 616, Wy: 220, Wz: 76.9, iy: 6.57, iz: 3.98 },
  { name: 'HEA 180', h: 171, b: 180, tw: 6.0, tf: 9.5, A: 45.3, Iy: 2510, Iz: 925, Wy: 294, Wz: 103, iy: 7.45, iz: 4.52 },
  { name: 'HEA 200', h: 190, b: 200, tw: 6.5, tf: 10.0, A: 53.8, Iy: 3692, Iz: 1336, Wy: 389, Wz: 134, iy: 8.28, iz: 4.98 },
  { name: 'HEA 220', h: 210, b: 220, tw: 7.0, tf: 11.0, A: 64.3, Iy: 5410, Iz: 1955, Wy: 515, Wz: 178, iy: 9.17, iz: 5.51 },
  { name: 'HEA 240', h: 230, b: 240, tw: 7.5, tf: 12.0, A: 76.8, Iy: 7763, Iz: 2769, Wy: 675, Wz: 231, iy: 10.1, iz: 6.00 },
  { name: 'HEA 260', h: 250, b: 260, tw: 7.5, tf: 12.5, A: 86.8, Iy: 10455, Iz: 3668, Wy: 836, Wz: 282, iy: 11.0, iz: 6.50 },
  { name: 'HEA 280', h: 270, b: 280, tw: 8.0, tf: 13.0, A: 97.3, Iy: 13670, Iz: 4760, Wy: 1010, Wz: 340, iy: 11.8, iz: 7.00 },
  { name: 'HEA 300', h: 290, b: 300, tw: 8.5, tf: 14.0, A: 112.5, Iy: 18260, Iz: 6310, Wy: 1260, Wz: 421, iy: 12.7, iz: 7.49 },
  { name: 'HEA 320', h: 310, b: 300, tw: 9.0, tf: 15.5, A: 124.0, Iy: 22930, Iz: 6990, Wy: 1480, Wz: 466, iy: 13.6, iz: 7.49 },
  { name: 'HEA 340', h: 330, b: 300, tw: 9.5, tf: 16.5, A: 133.0, Iy: 27690, Iz: 7440, Wy: 1680, Wz: 496, iy: 14.4, iz: 7.46 },
  { name: 'HEA 360', h: 350, b: 300, tw: 10.0, tf: 17.5, A: 143.0, Iy: 33090, Iz: 7890, Wy: 1890, Wz: 526, iy: 15.2, iz: 7.43 },
  { name: 'HEA 400', h: 390, b: 300, tw: 11.0, tf: 19.0, A: 159.0, Iy: 45070, Iz: 8560, Wy: 2310, Wz: 571, iy: 16.8, iz: 7.34 },
  { name: 'HEA 450', h: 440, b: 300, tw: 11.5, tf: 21.0, A: 178.0, Iy: 63720, Iz: 9470, Wy: 2900, Wz: 631, iy: 18.9, iz: 7.29 },
  { name: 'HEA 500', h: 490, b: 300, tw: 12.0, tf: 23.0, A: 198.0, Iy: 86970, Iz: 10370, Wy: 3550, Wz: 691, iy: 21.0, iz: 7.24 },
  { name: 'HEA 550', h: 540, b: 300, tw: 12.5, tf: 24.0, A: 212.0, Iy: 111900, Iz: 10820, Wy: 4150, Wz: 721, iy: 23.0, iz: 7.15 },
  { name: 'HEA 600', h: 590, b: 300, tw: 13.0, tf: 25.0, A: 226.0, Iy: 141200, Iz: 11270, Wy: 4790, Wz: 751, iy: 25.0, iz: 7.05 },
];

const HEB_PROFILES: ProfileData[] = [
  { name: 'HEB 100', h: 100, b: 100, tw: 6.0, tf: 10.0, A: 26.0, Iy: 450, Iz: 167, Wy: 89.9, Wz: 33.5, iy: 4.16, iz: 2.53 },
  { name: 'HEB 120', h: 120, b: 120, tw: 6.5, tf: 11.0, A: 34.0, Iy: 864, Iz: 318, Wy: 144, Wz: 52.9, iy: 5.04, iz: 3.06 },
  { name: 'HEB 140', h: 140, b: 140, tw: 7.0, tf: 12.0, A: 43.0, Iy: 1510, Iz: 550, Wy: 216, Wz: 78.5, iy: 5.93, iz: 3.58 },
  { name: 'HEB 160', h: 160, b: 160, tw: 8.0, tf: 13.0, A: 54.3, Iy: 2490, Iz: 882, Wy: 311, Wz: 110, iy: 6.78, iz: 4.03 },
  { name: 'HEB 180', h: 180, b: 180, tw: 8.5, tf: 14.0, A: 65.3, Iy: 3830, Iz: 1360, Wy: 426, Wz: 151, iy: 7.66, iz: 4.57 },
  { name: 'HEB 200', h: 200, b: 200, tw: 9.0, tf: 15.0, A: 78.1, Iy: 5696, Iz: 2003, Wy: 570, Wz: 200, iy: 8.54, iz: 5.07 },
  { name: 'HEB 220', h: 220, b: 220, tw: 9.5, tf: 16.0, A: 91.0, Iy: 8090, Iz: 2840, Wy: 736, Wz: 258, iy: 9.43, iz: 5.59 },
  { name: 'HEB 240', h: 240, b: 240, tw: 10.0, tf: 17.0, A: 106.0, Iy: 11260, Iz: 3923, Wy: 938, Wz: 327, iy: 10.3, iz: 6.08 },
  { name: 'HEB 260', h: 260, b: 260, tw: 10.0, tf: 17.5, A: 118.0, Iy: 14920, Iz: 5130, Wy: 1150, Wz: 395, iy: 11.2, iz: 6.58 },
  { name: 'HEB 280', h: 280, b: 280, tw: 10.5, tf: 18.0, A: 131.0, Iy: 19270, Iz: 6590, Wy: 1380, Wz: 471, iy: 12.1, iz: 7.09 },
  { name: 'HEB 300', h: 300, b: 300, tw: 11.0, tf: 19.0, A: 149.0, Iy: 25170, Iz: 8560, Wy: 1680, Wz: 571, iy: 13.0, iz: 7.58 },
  { name: 'HEB 320', h: 320, b: 300, tw: 11.5, tf: 20.5, A: 161.0, Iy: 30820, Iz: 9240, Wy: 1930, Wz: 616, iy: 13.8, iz: 7.57 },
  { name: 'HEB 340', h: 340, b: 300, tw: 12.0, tf: 21.5, A: 171.0, Iy: 36660, Iz: 9690, Wy: 2160, Wz: 646, iy: 14.6, iz: 7.53 },
  { name: 'HEB 360', h: 360, b: 300, tw: 12.5, tf: 22.5, A: 181.0, Iy: 43190, Iz: 10140, Wy: 2400, Wz: 676, iy: 15.4, iz: 7.49 },
  { name: 'HEB 400', h: 400, b: 300, tw: 13.5, tf: 24.0, A: 198.0, Iy: 57680, Iz: 10820, Wy: 2880, Wz: 721, iy: 17.1, iz: 7.40 },
  { name: 'HEB 450', h: 450, b: 300, tw: 14.0, tf: 26.0, A: 218.0, Iy: 79890, Iz: 11720, Wy: 3550, Wz: 781, iy: 19.1, iz: 7.33 },
  { name: 'HEB 500', h: 500, b: 300, tw: 14.5, tf: 28.0, A: 238.0, Iy: 107200, Iz: 12620, Wy: 4290, Wz: 841, iy: 21.2, iz: 7.27 },
  { name: 'HEB 550', h: 550, b: 300, tw: 15.0, tf: 29.0, A: 254.0, Iy: 136700, Iz: 13080, Wy: 4970, Wz: 872, iy: 23.2, iz: 7.17 },
  { name: 'HEB 600', h: 600, b: 300, tw: 15.5, tf: 30.0, A: 270.0, Iy: 171000, Iz: 13530, Wy: 5700, Wz: 902, iy: 25.2, iz: 7.08 },
];

const HEM_PROFILES: ProfileData[] = [
  { name: 'HEM 100', h: 120, b: 106, tw: 12.0, tf: 20.0, A: 53.2, Iy: 1140, Iz: 399, Wy: 190, Wz: 75.3, iy: 4.63, iz: 2.74 },
  { name: 'HEM 120', h: 140, b: 126, tw: 12.5, tf: 21.0, A: 66.4, Iy: 2020, Iz: 702, Wy: 288, Wz: 111, iy: 5.51, iz: 3.25 },
  { name: 'HEM 140', h: 160, b: 146, tw: 13.0, tf: 22.0, A: 80.6, Iy: 3290, Iz: 1140, Wy: 411, Wz: 157, iy: 6.39, iz: 3.77 },
  { name: 'HEM 160', h: 180, b: 166, tw: 14.0, tf: 23.0, A: 97.1, Iy: 5098, Iz: 1759, Wy: 566, Wz: 212, iy: 7.25, iz: 4.26 },
  { name: 'HEM 180', h: 200, b: 186, tw: 14.5, tf: 24.0, A: 113.0, Iy: 7480, Iz: 2580, Wy: 748, Wz: 277, iy: 8.13, iz: 4.77 },
  { name: 'HEM 200', h: 220, b: 206, tw: 15.0, tf: 25.0, A: 131.0, Iy: 10640, Iz: 3651, Wy: 967, Wz: 354, iy: 9.02, iz: 5.27 },
  { name: 'HEM 220', h: 240, b: 226, tw: 15.5, tf: 26.0, A: 149.0, Iy: 14610, Iz: 5030, Wy: 1220, Wz: 445, iy: 9.90, iz: 5.81 },
  { name: 'HEM 240', h: 270, b: 248, tw: 18.0, tf: 32.0, A: 199.0, Iy: 24290, Iz: 8150, Wy: 1800, Wz: 657, iy: 11.1, iz: 6.40 },
  { name: 'HEM 260', h: 290, b: 268, tw: 18.0, tf: 32.5, A: 220.0, Iy: 31310, Iz: 10410, Wy: 2160, Wz: 777, iy: 11.9, iz: 6.88 },
  { name: 'HEM 280', h: 310, b: 288, tw: 18.5, tf: 33.0, A: 240.0, Iy: 39550, Iz: 13160, Wy: 2550, Wz: 914, iy: 12.8, iz: 7.40 },
  { name: 'HEM 300', h: 340, b: 310, tw: 21.0, tf: 39.0, A: 303.0, Iy: 59200, Iz: 19400, Wy: 3480, Wz: 1250, iy: 14.0, iz: 8.00 },
  { name: 'HEM 400', h: 432, b: 307, tw: 21.0, tf: 40.0, A: 285.0, Iy: 104100, Iz: 19340, Wy: 4820, Wz: 1260, iy: 19.1, iz: 8.24 },
  { name: 'HEM 500', h: 534, b: 310, tw: 21.0, tf: 40.0, A: 307.0, Iy: 161900, Iz: 20080, Wy: 6060, Wz: 1300, iy: 22.9, iz: 8.09 },
  { name: 'HEM 600', h: 634, b: 312, tw: 22.0, tf: 40.0, A: 332.0, Iy: 237400, Iz: 20740, Wy: 7490, Wz: 1330, iy: 26.7, iz: 7.91 },
];

const UPN_PROFILES: ProfileData[] = [
  { name: 'UPN 80', h: 80, b: 45, tw: 6.0, tf: 8.0, A: 11.0, Iy: 106, Iz: 19.4, Wy: 26.5, Wz: 6.36, iy: 3.10, iz: 1.33 },
  { name: 'UPN 100', h: 100, b: 50, tw: 6.0, tf: 8.5, A: 13.5, Iy: 206, Iz: 29.3, Wy: 41.2, Wz: 8.49, iy: 3.91, iz: 1.47 },
  { name: 'UPN 120', h: 120, b: 55, tw: 7.0, tf: 9.0, A: 17.0, Iy: 364, Iz: 43.2, Wy: 60.7, Wz: 11.1, iy: 4.62, iz: 1.59 },
  { name: 'UPN 140', h: 140, b: 60, tw: 7.0, tf: 10.0, A: 20.4, Iy: 605, Iz: 62.7, Wy: 86.4, Wz: 14.8, iy: 5.45, iz: 1.75 },
  { name: 'UPN 160', h: 160, b: 65, tw: 7.5, tf: 10.5, A: 24.0, Iy: 925, Iz: 85.3, Wy: 116, Wz: 18.3, iy: 6.21, iz: 1.89 },
  { name: 'UPN 180', h: 180, b: 70, tw: 8.0, tf: 11.0, A: 28.0, Iy: 1350, Iz: 114, Wy: 150, Wz: 22.4, iy: 6.95, iz: 2.02 },
  { name: 'UPN 200', h: 200, b: 75, tw: 8.5, tf: 11.5, A: 32.2, Iy: 1910, Iz: 148, Wy: 191, Wz: 27.0, iy: 7.70, iz: 2.14 },
  { name: 'UPN 220', h: 220, b: 80, tw: 9.0, tf: 12.5, A: 37.4, Iy: 2690, Iz: 197, Wy: 245, Wz: 33.6, iy: 8.48, iz: 2.30 },
  { name: 'UPN 240', h: 240, b: 85, tw: 9.5, tf: 13.0, A: 42.3, Iy: 3600, Iz: 248, Wy: 300, Wz: 39.6, iy: 9.22, iz: 2.42 },
  { name: 'UPN 260', h: 260, b: 90, tw: 10.0, tf: 13.7, A: 48.3, Iy: 4820, Iz: 317, Wy: 371, Wz: 47.7, iy: 10.0, iz: 2.56 },
  { name: 'UPN 280', h: 280, b: 95, tw: 10.0, tf: 15.2, A: 53.3, Iy: 6280, Iz: 399, Wy: 448, Wz: 57.2, iy: 10.9, iz: 2.74 },
  { name: 'UPN 300', h: 300, b: 100, tw: 10.0, tf: 16.0, A: 58.8, Iy: 8030, Iz: 495, Wy: 535, Wz: 67.8, iy: 11.7, iz: 2.90 },
  { name: 'UPN 320', h: 320, b: 100, tw: 14.0, tf: 17.5, A: 75.8, Iy: 10870, Iz: 597, Wy: 679, Wz: 80.6, iy: 12.0, iz: 2.81 },
  { name: 'UPN 350', h: 350, b: 100, tw: 14.0, tf: 16.0, A: 77.3, Iy: 12840, Iz: 570, Wy: 734, Wz: 75.0, iy: 12.9, iz: 2.72 },
  { name: 'UPN 380', h: 380, b: 102, tw: 13.5, tf: 16.0, A: 80.4, Iy: 15760, Iz: 615, Wy: 829, Wz: 78.1, iy: 14.0, iz: 2.77 },
  { name: 'UPN 400', h: 400, b: 110, tw: 14.0, tf: 18.0, A: 91.5, Iy: 20350, Iz: 846, Wy: 1020, Wz: 102, iy: 14.9, iz: 3.04 },
];

const steelGrades = {
  'S235': { fy: 235 },
  'S275': { fy: 275 },
  'S355': { fy: 355 },
  'S460': { fy: 460 },
};

export default function BpStahlbauprofile() {
  const [profileSeries, setProfileSeries] = useState<'IPE' | 'HEA' | 'HEB' | 'HEM' | 'UPN'>('IPE');
  const [selectedIx, setSelectedIx] = useState<number>(2); // Default to third profile in selected list

  // Calculator states
  const [ned, setNed] = useState<number>(150); // kN
  const [myed, setMyed] = useState<number>(45); // kNm
  const [selectedGrade, setSelectedGrade] = useState<keyof typeof steelGrades>('S355');
  const [safetyFactor, setSafetyFactor] = useState<number>(1.0); // gamma_M0

  const activeProfileList = useMemo(() => {
    switch (profileSeries) {
      case 'IPE': return IPE_PROFILES;
      case 'HEA': return HEA_PROFILES;
      case 'HEB': return HEB_PROFILES;
      case 'HEM': return HEM_PROFILES;
      case 'UPN': return UPN_PROFILES;
    }
  }, [profileSeries]);

  const activeProfileIndex = Math.min(selectedIx, activeProfileList.length - 1);
  const activeProfile = activeProfileList[activeProfileIndex];

  // Stress calculation
  // sigma = N / A + M / W
  // area is in cm2 -> * 10^2 -> mm²
  // W is in cm³ -> * 10^3 -> mm³
  // N is in kN -> * 10^3 -> N
  // M is in kNm -> * 10^6 -> Nmm
  const stressN = useMemo(() => {
    if (!activeProfile || activeProfile.A <= 0) return 0;
    return (ned * 1000) / (activeProfile.A * 100);
  }, [ned, activeProfile]);

  const stressM = useMemo(() => {
    if (!activeProfile || activeProfile.Wy <= 0) return 0;
    return (myed * 1e6) / (activeProfile.Wy * 1000);
  }, [myed, activeProfile]);

  const totalStress = useMemo(() => {
    return stressN + stressM;
  }, [stressN, stressM]);

  const fy = steelGrades[selectedGrade].fy;
  const fyd = fy / safetyFactor;
  const utilization = useMemo(() => {
    if (fyd <= 0) return 0;
    return (totalStress / fyd) * 100;
  }, [totalStress, fyd]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center gap-3 mb-6">
          <Layers className="text-shiraz" size={28} />
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              Stahlbauprofile (Profile &amp; Querschnittswerte)
            </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Interaktive Bibliothek und statischer Querschnittrechner für europäische Normprofile im Stahlbau
          </p>
        </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: SELECTOR & INFORMATIONAL TABS */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 space-y-4">
              <span className="text-xs font-bold text-shiraz block uppercase tracking-wide">Profilreihe wählen</span>
              
              <div className="grid grid-cols-3 gap-1.5">
                {(['IPE', 'HEA', 'HEB', 'HEM', 'UPN'] as const).map((series) => (
                  <button
                    key={series}
                    type="button"
                    onClick={() => {
                      setProfileSeries(series);
                      setSelectedIx(1); // Default to second index on switch
                    }}
                    className={`py-2 px-1 rounded-md text-xs font-bold transition-all border text-center ${
                      profileSeries === series
                        ? 'bg-shiraz text-white border-shiraz shadow-xs scale-102 font-black'
                        : 'bg-white border-home-grau/25 text-text-main hover:bg-home-grau/5'
                    }`}
                  >
                    {series}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-text-main">Profil-Größe (Schieberegler)</label>
                  <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/5 px-2 py-0.5 rounded">
                    {formatDeWert(activeProfileIndex + 1)} / {activeProfileList.length}
                  </span>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max={activeProfileList.length - 1}
                  step="1"
                  value={activeProfileIndex}
                  onChange={(e) => setSelectedIx(Number(e.target.value))}
                  className="w-full h-1.5 bg-home-grau/25 rounded-lg appearance-none cursor-pointer accent-shiraz"
                />

                <select
                  value={activeProfileIndex}
                  onChange={(e) => setSelectedIx(Number(e.target.value))}
                  className="w-full p-2 text-sm border border-home-grau rounded-md bg-white focus:outline-none focus:border-shiraz font-medium"
                >
                  {activeProfileList.map((prof, idx) => (
                    <option key={prof.name} value={idx}>
                      {prof.name} ({formatDeWert(prof.h)}x{formatDeWert(prof.b)} mm)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Profile Series info */}
            <div className="bg-shiraz/5 border border-shiraz/10 p-4 rounded-xl text-xs text-text-main/80 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-shiraz">
                <Info size={14} />
                Typische Profilanwendungen:
              </div>
              {profileSeries === 'IPE' && (
                <p>
                  <strong>IPE-Träger (Mittelbreite I-Träger):</strong> Ideal auf reine Biegung um die starke y-y Achse dimensioniert. Finden breiten Einsatz als Deckenträger, Riegel oder Hallenrahmen, wenn Knicken quer zum Träger konstruktiv verhindert wird.
                </p>
              )}
              {profileSeries === 'HEA' && (
                <p>
                  <strong>HEA-Träger (Leichtes Breitflanschprofil):</strong> Besitzen im Verhältnis zum Bauteileigengewicht sehr günstige Tragfähigkeiten. Werden häufig bei Platzersparnis oder moderaten Knicklasten als Stützen und Riegel verwendet.
                </p>
              )}
              {profileSeries === 'HEB' && (
                <p>
                  <strong>HEB-Träger (Normales Breitflanschprofil):</strong> Der absolute Standard-Stützenquerschnitt im Hochbau. Durch breite Flanges haben HEB-Profile deutlich größere Trägheitsmomente um die schwache z-z Achse im Vergleich zu IPE.
                </p>
              )}
              {profileSeries === 'HEM' && (
                <p>
                  <strong>HEM-Träger (Verstärktes Breitflanschprofil):</strong> Höchstbelastbare Stützen oder schwere Abfangträger. Verfügen über extrem dicke Flansche und Stege, perfekt gewappnet gegen hohe Punktlasten und große Stützlasten.
                </p>
              )}
              {profileSeries === 'UPN' && (
                <p>
                  <strong>UPN-Träger (U-Stahl Standard):</strong> Asymmetrischer Querschnitt. Oft paarweise zusammengeschweißt ("gekuppelt") für Stützen oder eingesetzt bei Treppenwangen, Randeinfassungen und Schlosserarbeiten.
                </p>
              )}
            </div>

            {/* Math Box */}
            <div className="bg-stone-50/70 p-4 rounded-xl border border-home-grau/30 text-xs text-text-main/70 space-y-2 leading-relaxed font-normal">
              <span className="font-bold text-text-main block">Berechnungsformeln für Normalspannung:</span>
              <p>
                Die Überlagerung von Normalkraft und Biegung (Navier) führt zur elastischen Randspannung:
              </p>
              <div className="bg-white p-2.5 rounded border border-home-grau/10 font-mono text-center text-[11px] text-text-main w-full overflow-x-auto">
                <FormulaText text="\sigma_{Ed} = \frac{N_{Ed}}{A} \pm \frac{M_{Ed}}{W_y}" />
              </div>
              <p>
                Der Tragfähigkeitsnachweis (GZT) verlangt, dass die maximale kombinierte Randspannung unter der bemessenen Grenzkraft liegt:
              </p>
              <div className="bg-white p-2 text-center text-[10px] border border-home-grau/10 rounded font-bold text-shiraz">
                &eta; = σ_Ed / f_yd ≤ 100%
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN: TECHNICAL PROPERTIES AND DYNAMIC DIAGRAM */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Technical Property Database fields */}
              <div className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-xs space-y-4">
                <div className="border-b border-home-grau/10 pb-2">
                  <span className="text-sm font-bold text-text-main">
                    Querschnittskennwerte: <span className="text-shiraz font-mono font-black">{activeProfile.name}</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3.5 text-xs">
                  <div className="p-2 bg-off-white rounded border border-home-grau/15">
                    <span className="text-[10px] text-text-main/50 block font-bold">Fläche A</span>
                    <span className="text-sm font-black text-text-main font-mono">{formatDeZahl(activeProfile.A, 1)} cm²</span>
                  </div>
                  <div className="p-2 bg-off-white rounded border border-home-grau/15">
                    <span className="text-[10px] text-text-main/50 block font-bold">Trägheit I_y</span>
                    <span className="text-sm font-black text-text-main font-mono">{formatDeZahl(activeProfile.Iy, 0)} cm⁴</span>
                  </div>
                  <div className="p-2 bg-off-white rounded border border-home-grau/15">
                    <span className="text-[10px] text-text-main/50 block font-bold">Widerstand W_y</span>
                    <span className="text-sm font-black text-text-main font-mono">{formatDeZahl(activeProfile.Wy, 1)} cm³</span>
                  </div>
                  <div className="p-2 bg-off-white rounded border border-home-grau/15">
                    <span className="text-[10px] text-text-main/50 block font-bold">Radius i_y</span>
                    <span className="text-sm font-black text-text-main font-mono">{formatDeZahl(activeProfile.iy, 2)} cm</span>
                  </div>
                  <div className="p-2 bg-off-white rounded border border-home-grau/15">
                    <span className="text-[10px] text-text-main/50 block font-bold">Trägheit I_z</span>
                    <span className="text-sm font-black text-text-main font-mono">{formatDeZahl(activeProfile.Iz, 0)} cm⁴</span>
                  </div>
                  <div className="p-2 bg-off-white rounded border border-home-grau/15">
                    <span className="text-[10px] text-text-main/50 block font-bold">Widerstand W_z</span>
                    <span className="text-sm font-black text-text-main font-mono">{formatDeZahl(activeProfile.Wz, 1)} cm³</span>
                  </div>
                  <div className="p-2 bg-off-white rounded border border-home-grau/15">
                    <span className="text-[10px] text-text-main/50 block font-bold">Radius i_z</span>
                    <span className="text-sm font-black text-text-main font-mono">{formatDeZahl(activeProfile.iz, 2)} cm</span>
                  </div>
                  <div className="p-2 bg-off-white rounded border border-home-grau/15">
                    <span className="text-[10px] text-text-main/50 block font-bold">Gewicht (G)</span>
                    <span className="text-sm font-black text-text-main font-mono">{formatDeZahl((activeProfile.A * 0.785), 1)} kg/m</span>
                  </div>
                </div>

                <div className="bg-stone-50 p-2.5 rounded border border-home-grau/15 text-[11px] text-text-main/60 leading-tight">
                  <div className="font-bold text-text-main mb-0.5">Geometrieabmessungen:</div>
                  Höhe <strong className="text-text-main font-bold">h = {formatDeWert(activeProfile.h)} mm</strong> &bull; Breite <strong className="text-text-main font-bold">b = {formatDeWert(activeProfile.b)} mm</strong> &bull; Steg <strong className="text-text-main font-bold">t_w = {formatDeWert(activeProfile.tw)} mm</strong> &bull; Flansch <strong className="text-text-main font-bold">t_f = {formatDeWert(activeProfile.tf)} mm</strong>
                </div>
              </div>

              {/* Dynamic SVG Visual Profile Rendering */}
              <div className="bg-white p-4 rounded-xl border border-home-grau/25 shadow-xs flex flex-col items-center justify-between">
                <span className="text-[10px] font-bold text-text-main/40 uppercase tracking-wider block mb-2 w-full text-left">
                  Profilgeometrie &amp; Hauptachsen (Skaliert)
                </span>
                
                <div className="flex-1 flex items-center justify-center p-2 min-h-[170px]">
                  {(() => {
                    // Normalize dimensions to view box 160x160
                    const maxDim = Math.max(activeProfile.h, activeProfile.b);
                    const scale = 110 / maxDim;
                    
                    const h_sc = activeProfile.h * scale;
                    const b_sc = activeProfile.b * scale;
                    const tw_sc = Math.max(2.5, activeProfile.tw * scale);
                    const tf_sc = Math.max(3.5, activeProfile.tf * scale);

                    if (profileSeries === 'UPN') {
                      // Draw UPN profile shape
                      return (
                        <svg width="170" height="170" viewBox="0 0 170 170" className="overflow-visible">
                          {/* Profile boundary path */}
                          <path
                            d={`
                              M ${85 - b_sc/2} ${85 - h_sc/2}
                              L ${85 + b_sc/2} ${85 - h_sc/2}
                              L ${85 + b_sc/2} ${85 - h_sc/2 + tf_sc}
                              L ${85 - b_sc/2 + tw_sc} ${85 - h_sc/2 + tf_sc}
                              L ${85 - b_sc/2 + tw_sc} ${85 + h_sc/2 - tf_sc}
                              L ${85 + b_sc/2} ${85 + h_sc/2 - tf_sc}
                              L ${85 + b_sc/2} ${85 + h_sc/2}
                              L ${85 - b_sc/2} ${85 + h_sc/2}
                              Z
                            `}
                            fill="#cbd5e1"
                            stroke="#475569"
                            strokeWidth="1.5"
                          />
                          {/* Center of gravity marker & axes */}
                          <line x1="15" y1="85" x2="155" y2="85" stroke="#A3113E" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1="85" y1="15" x2="85" y2="155" stroke="#A3113E" strokeWidth="1" strokeDasharray="3 3" />
                          <text x="160" y="89" fontSize="11" fill="#A3113E" fontWeight="bold">y</text>
                          <text x="82" y="10" fontSize="11" fill="#A3113E" fontWeight="bold">z</text>
                        </svg>
                      );
                    } else {
                      // Draw I-Profile (IPE, HEA, HEB, HEM)
                      return (
                        <svg width="170" height="170" viewBox="0 0 170 170" className="overflow-visible">
                          {/* Upper Flange */}
                          <rect
                            x={85 - b_sc/2}
                            y={85 - h_sc/2}
                            width={b_sc}
                            height={tf_sc}
                            fill="#cbd5e1"
                            stroke="#475569"
                            strokeWidth="1.5"
                          />
                          {/* Web */}
                          <rect
                            x={85 - tw_sc/2}
                            y={85 - h_sc/2 + tf_sc - 0.5}
                            width={tw_sc}
                            height={h_sc - 2*tf_sc + 1}
                            fill="#cbd5e1"
                            stroke="#475569"
                            strokeWidth="1.5"
                          />
                          {/* Lower Flange */}
                          <rect
                            x={85 - b_sc/2}
                            y={85 + h_sc/2 - tf_sc}
                            width={b_sc}
                            height={tf_sc}
                            fill="#cbd5e1"
                            stroke="#475569"
                            strokeWidth="1.5"
                          />
                          {/* Extra web-drawn lines cleanup */}
                          <line x1={85 - tw_sc/2} y1={85 - h_sc/2 + tf_sc} x2={85 + tw_sc/2} y2={85 - h_sc/2 + tf_sc} stroke="#cbd5e1" strokeWidth="1.5" />
                          <line x1={85 - tw_sc/2} y1={85 + h_sc/2 - tf_sc} x2={85 + tw_sc/2} y2={85 + h_sc/2 - tf_sc} stroke="#cbd5e1" strokeWidth="1.5" />
                          
                          {/* Center of gravity axes */}
                          <line x1="15" y1="85" x2="155" y2="85" stroke="#A3113E" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1="85" y1="15" x2="85" y2="155" stroke="#A3113E" strokeWidth="1" strokeDasharray="3 3" />
                          <text x="160" y="89" fontSize="11" fill="#A3113E" fontWeight="bold">y</text>
                          <text x="82" y="10" fontSize="11" fill="#A3113E" fontWeight="bold">z</text>
                        </svg>
                      );
                    }
                  })()}
                </div>
                
                <span className="text-[10px] text-text-main/50 text-center uppercase tracking-normal">
                  Starke Biegeachse = <strong>y-y</strong> &bull; Schwache Achse = <strong>z-z</strong>
                </span>
              </div>

            </div>

            {/* INTERACTIVE COMPLIANCE STRESS DESIGN WORKING SPACE */}
            <div className="bg-stone-50 border border-home-grau/25 rounded-xl p-5 space-y-5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-home-grau/30">
                <Calculator className="text-shiraz" size={20} />
                <span className="text-sm font-bold text-text-main">Interaktive Spannungsüberlagerung &amp; Tragfähigkeit</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-text-main/60 block uppercase">Normalkraft N_Ed</label>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={ned}
                      onChange={(e) => setNed(Number(e.target.value))}
                      className="w-full p-2 border border-home-grau rounded-md bg-white text-sm font-semibold text-text-main pr-7"
                    />
                    <span className="absolute right-2 top-2.5 text-xs text-text-main/30 font-bold">kN</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="10"
                    value={ned}
                    onChange={(e) => setNed(Number(e.target.value))}
                    className="w-full h-1.5 bg-home-grau/25 rounded-lg appearance-none cursor-pointer accent-shiraz"
                  />
                </div>
 
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-text-main/60 block uppercase">Biegung M_y,Ed</label>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={myed}
                      onChange={(e) => setMyed(Number(e.target.value))}
                      className="w-full p-2 border border-home-grau rounded-md bg-white text-sm font-semibold text-text-main pr-9"
                    />
                    <span className="absolute right-2 top-2.5 text-xs text-text-main/30 font-bold">kNm</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="5"
                    value={myed}
                    onChange={(e) => setMyed(Number(e.target.value))}
                    className="w-full h-1.5 bg-home-grau/25 rounded-lg appearance-none cursor-pointer accent-shiraz"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-text-main/60 block uppercase">Stahlsorte</label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value as keyof typeof steelGrades)}
                    className="w-full p-2 text-sm border border-home-grau rounded-md bg-white focus:outline-none focus:border-shiraz font-medium"
                  >
                    {Object.keys(steelGrades).map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-text-main/60 block uppercase">Beiwert γ_M0</label>
                  <select
                    value={safetyFactor}
                    onChange={(e) => setSafetyFactor(Number(e.target.value))}
                    className="w-full p-2 text-sm border border-home-grau rounded-md bg-white focus:outline-none"
                  >
                    <option value={1.0}>1,00 (Empfohlen EC3)</option>
                    <option value={1.1}>1,10 (Nationaler Anhang)</option>
                  </select>
                </div>
              </div>

              {/* Stress Results Box */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-3 border-t border-home-grau/10">
                <div className="md:col-span-7 space-y-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-main/40 block">Spannungsaufteilung am Rand:</span>
                  
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-normal text-text-main/80">
                      <span>Anteil Normalspannung (σ_N):</span>
                      <span className="font-mono font-bold">{formatDeZahl(stressN, 1)} N/mm²</span>
                    </div>
                    <div className="flex justify-between font-normal text-text-main/80">
                      <span>Anteil Biegespannung (σ_My):</span>
                      <span className="font-mono font-bold">{formatDeZahl(stressM, 1)} N/mm²</span>
                    </div>
                    <div className="flex justify-between text-text-main font-bold pt-1.5 border-t border-home-grau/10">
                      <span>Gesamt Randspannung (σ_Ed,max):</span>
                      <span className="font-mono text-shiraz">{formatDeZahl(totalStress, 1)} N/mm²</span>
                    </div>
                  </div>

                  {/* Verbal verification result indicator */}
                  <div className={`p-3 rounded-lg flex items-start gap-2.5 text-xs leading-snug ${
                    utilization <= 100
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {utilization <= 100 ? (
                      <>
                        <CheckCircle className="text-emerald-600 mt-0.5" size={16} />
                        <div>
                          <strong>Nachweis erfüllt!</strong> Die maximale Randspannung σ_Ed ({formatDeZahl(totalStress, 1)} N/mm²) liegt unter der zulässigen Festigkeit f_yd ({formatDeZahl(fyd, 0)} N/mm²).
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="text-red-600 mt-0.5 flex-none" size={16} />
                        <div>
                          <strong>Tragfähigkeit überschritten!</strong> Die Streckgrenze des Stahls ist überschritten. Wählen Sie eine stärkere Trägergröße, eine höhere Stahlgüte oder reduzieren Sie die Beanspruchungsgrößen!
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="md:col-span-5 flex flex-col justify-center items-center bg-white border border-home-grau/15 rounded-xl p-4 text-center">
                  <span className="text-[10px] text-text-main/40 uppercase font-bold tracking-wider">Querschnittsausnutzung</span>
                  <div className={`text-3xl font-black font-mono mt-1 ${
                    utilization <= 100 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {formatDeZahl(utilization, 1)}%
                  </div>
                  
                  {/* Gauge bar representation */}
                  <div className="w-full bg-home-grau/15 h-2 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        utilization <= 70
                          ? 'bg-emerald-500'
                          : utilization <= 100
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, utilization)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <InnovationPraxisSection moduleKey="bp_stahlbauprofile" />

      <ModuleFooter
        wikipedia={[
          { title: 'Baustahl', url: 'https://de.wikipedia.org/wiki/Baustahl' },
          { title: 'Profilstahl', url: 'https://de.wikipedia.org/wiki/Profilstahl' },
          { title: 'Widerstandsmoment', url: 'https://de.wikipedia.org/wiki/Widerstandsmoment' },
          { title: 'Biegesteifigkeit', url: 'https://de.wikipedia.org/wiki/Biegesteifigkeit' }
        ]}
        literatur={[
          'Wagenknecht, G. (2020): Stahlbau-Praxis nach Eurocode 3 (Bauwerk-Verlag)',
          'Kuhlmann, U. et al.: Stahlbau-Kalender (Ernst & Sohn, jährlich aktualisiert)'
        ]}
        regelwerke={[
          { title: 'DIN EN 10025 (Warmgewalzte Erzeugnisse aus Baustählen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+10025' },
          { title: 'DIN EN 1993-1-1 / NA (Eurocode 3: Bemessung und Konstruktion von Stahlbauten)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1993-1-1' }
        ]}
        formeln={[
          {
            formel: '\\sigma = \\frac{M_{y,Ed}}{W_{el,y}} \\le f_{y,d} = \\frac{f_y}{\\gamma_{M0}}',
            erklaerung: 'Elastischer Biegespannungsnachweis für einfach-symmetrische oder doppeltsymmetrische I-Profile nach EC3 (gamma_M0 = 1.00).',
            quelle: 'DIN EN 1993-1-1 Abs. 6.2.5'
          },
          {
            formel: '\\tau = \\frac{V_{z,Ed} \\cdot S_y}{I_y \\cdot t_w} \\le \\frac{f_y}{\\sqrt{3} \\cdot \\gamma_{M0}}',
            erklaerung: 'Schubspannungsnachweis im Steg des I-Profils unter Querkraftbeanspruchung V_z,Ed.',
            quelle: 'DIN EN 1993-1-1 Abs. 6.2.6'
          },
          {
            formel: 'w = \\frac{5 \\cdot q \\cdot L^4}{384 \\cdot E \\cdot I_y} \\le \\frac{L}{300}',
            erklaerung: 'Maximale Mittendurchbiegung des Einfeldträgers zur Einhaltung der Gebrauchstauglichkeitsgrenzen (SLS).',
            quelle: 'DIN EN 1993-1-1'
          }
        ]}
      />
    </div>
  );
}

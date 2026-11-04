// 3D-Darstellung des Mauerwerksverbands (Modul Mauerwerk).
// Ausgelagert und per React.lazy geladen, damit three.js/@react-three nur bei Bedarf lädt (Phase 5, AP 5.4).
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Edges } from '@react-three/drei';
import * as THREE from 'three';

export interface MauerwerkVerband3DProps {
  bond: string;
  stoneLength: number;
  stoneHeight: number;
  thickness: number;
  /** Drehung der Wand um die Hochachse in Grad (Tastaturbedienung im Modul) */
  drehung?: number;
}

export default function MauerwerkVerband3D({ bond, stoneLength, stoneHeight, thickness, drehung = 0 }: MauerwerkVerband3DProps) {
  const BrickWall = () => {
    const bricks = [];
    const rows = 8;
    const l = stoneLength / 1000;
    const h = stoneHeight / 1000;
    const t = thickness;
    const joint = 0.012; // 12mm Fuge
    // Header (Binder) width is typically around half a stretcher minus half a joint
    const w = Math.max(0.04, (l - joint) / 2);

    const xMin = -1.2;
    const xMax = 1.2;

    for (let r = 0; r < rows; r++) {
      const y = r * (h + joint) - (rows * h) / 2 + h / 2;

      if (bond === 'laeufer') {
        // Stretcher bond (Läuferverband): offset alternates between 0 and half a full stretcher
        const isShifted = (r % 2) === 1;
        const offset = isShifted ? (l + joint) / 2 : 0;
        const startX = xMin - offset - l;
        
        let c = 0;
        for (let x = startX; x < xMax + l; x += l + joint) {
          const brickX = x + l / 2;
          
          // Seeded/hashed random value so color remains consistent and doesn't flicker
          const hash = Math.abs(Math.sin(r * 12.9898 + c * 78.233) * 43758.5453) % 1;
          const color = new THREE.Color('#94a3b8').offsetHSL(0.02 * (hash - 0.5), 0, (hash - 0.5) * 0.08);

          bricks.push(
            <Box key={`l-${r}-${c}`} args={[l, h, t]} position={[brickX, y, 0]}>
              <meshStandardMaterial color={color} roughness={0.8} />
              <Edges scale={1.01} threshold={15} color="#1e293b" />
            </Box>
          );
          c++;
        }
      } else if (bond === 'block') {
        // Block bond (Blockverband): alternating stretcher (even rows) and header (odd rows) courses
        const isHeaderRow = (r % 2) === 1;
        
        if (!isHeaderRow) {
          // Stretcher row
          const startX = xMin - l;
          let c = 0;
          for (let x = startX; x < xMax + l; x += l + joint) {
            const brickX = x + l / 2;
            const hash = Math.abs(Math.sin(r * 12.9898 + c * 78.233) * 43758.5453) % 1;
            const color = new THREE.Color('#94a3b8').offsetHSL(0.02 * (hash - 0.5), 0, (hash - 0.5) * 0.08);

            bricks.push(
              <Box key={`b-s-${r}-${c}`} args={[l, h, t]} position={[brickX, y, 0]}>
                <meshStandardMaterial color={color} roughness={0.8} />
                <Edges scale={1.01} threshold={15} color="#1e293b" />
              </Box>
            );
            c++;
          }
        } else {
          // Header row with 1/4 brick offset relative to stretcher course
          const offset = l / 4;
          const startX = xMin - offset - w;
          let c = 0;
          for (let x = startX; x < xMax + w; x += w + joint) {
            const brickX = x + w / 2;
            const hash = Math.abs(Math.sin(r * 12.9898 + c * 78.233) * 43758.5453) % 1;
            const color = new THREE.Color('#94a3b8').offsetHSL(0.02 * (hash - 0.5), 0, (hash - 0.5) * 0.08);

            bricks.push(
              <Box key={`b-h-${r}-${c}`} args={[w, h, t]} position={[brickX, y, 0]}>
                <meshStandardMaterial color={color} roughness={0.85} />
                <Edges scale={1.01} threshold={15} color="#1e293b" />
              </Box>
            );
            c++;
          }
        }
      } else if (bond === 'kreuz') {
        // Cross bond (Kreuzverband): alternating stretcher and header courses, but stretcher courses are offset relative to each other by half a brick (l/2)
        const isHeaderRow = (r % 2) === 1;
        
        if (!isHeaderRow) {
          // Stretcher row: alternate offset of 0 (r % 4 === 0) or l / 2 (r % 4 === 2)
          const isShifted = (r % 4) === 2;
          const offset = isShifted ? (l + joint) / 2 : 0;
          const startX = xMin - offset - l;
          let c = 0;
          for (let x = startX; x < xMax + l; x += l + joint) {
            const brickX = x + l / 2;
            const hash = Math.abs(Math.sin(r * 12.9898 + c * 78.233) * 43758.5453) % 1;
            const color = new THREE.Color('#94a3b8').offsetHSL(0.02 * (hash - 0.5), 0, (hash - 0.5) * 0.08);

            bricks.push(
              <Box key={`k-s-${r}-${c}`} args={[l, h, t]} position={[brickX, y, 0]}>
                <meshStandardMaterial color={color} roughness={0.8} />
                <Edges scale={1.01} threshold={15} color="#1e293b" />
              </Box>
            );
            c++;
          }
        } else {
          // Header row is shifted by l/4
          const offset = l / 4;
          const startX = xMin - offset - w;
          let c = 0;
          for (let x = startX; x < xMax + w; x += w + joint) {
            const brickX = x + w / 2;
            const hash = Math.abs(Math.sin(r * 12.9898 + c * 78.233) * 43758.5453) % 1;
            const color = new THREE.Color('#94a3b8').offsetHSL(0.02 * (hash - 0.5), 0, (hash - 0.5) * 0.08);

            bricks.push(
              <Box key={`k-h-${r}-${c}`} args={[w, h, t]} position={[brickX, y, 0]}>
                <meshStandardMaterial color={color} roughness={0.85} />
                <Edges scale={1.01} threshold={15} color="#1e293b" />
              </Box>
            );
            c++;
          }
        }
      }
    }

    return <group>{bricks}</group>;
  };

  return (
  <Canvas gl={{ preserveDrawingBuffer: true }} camera={{ position: [0, 0, 2], fov: 45 }} aria-hidden="true">
    <ambientLight intensity={0.8} />
    <directionalLight position={[5, 5, 5]} intensity={1.2} />
    <OrbitControls makeDefault enableZoom={true} />
    <group rotation={[0, (drehung * Math.PI) / 180, 0]}>
      <BrickWall />
    </group>
  </Canvas>
  );
}

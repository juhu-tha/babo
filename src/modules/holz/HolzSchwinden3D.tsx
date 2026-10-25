// 3D-Darstellung der Schwindverformung (Modul Holz, Reiter „Schwinden“).
// Ausgelagert und per React.lazy geladen, damit three.js/@react-three nur bei Bedarf lädt (Phase 5, AP 5.4).
import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Edges, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

export interface HolzSchwinden3DProps {
  querschnitt: string;
  breite: number;
  dicke: number;
  laenge: number;
  exzentrizitaetX: number;
  exzentrizitaetY: number;
  visualShrinkT: number;
  visualShrinkR: number;
  visualScaleX: number;
  visualScaleY: number;
  visualScaleZ: number;
}

export default function HolzSchwinden3D({
  querschnitt, breite, dicke, laenge, exzentrizitaetX, exzentrizitaetY,
  visualShrinkT, visualShrinkR, visualScaleX, visualScaleY, visualScaleZ,
}: HolzSchwinden3DProps) {
  const viewScale = 0.02;

  const woodCrossTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = '#cbd5e1';
      context.fillRect(0, 0, 1024, 1024);

      // BoxGeometry streckt die 1024x1024 Textur auf die Bauteilabmessungen (breite x dicke).
      // Damit die Jahresringe auch auf dem 3D-Modell kreisförmig aussehen, rufen 
      // wir scale() auf, um die Verzerrung auszugleichen. Wir zeichnen dann im "mm"-Maßstab.
      const scaleX = Math.max(breite, 1);
      const scaleY = Math.max(dicke, 1);
      
      const centerPhysX = scaleX / 2 + exzentrizitaetX;
      const centerPhysY = scaleY / 2 + exzentrizitaetY;

      context.save();
      // Streckung umkehren und in mm-Koordinaten wechseln:
      context.scale(1024 / scaleX, 1024 / scaleY);

      // Max Radius bestimmen (größte Distanz von der Markröhre zu den Ecken des Bretts)
      const maxR = Math.sqrt(Math.pow(Math.max(centerPhysX, scaleX - centerPhysX), 2) + Math.pow(Math.max(centerPhysY, scaleY - centerPhysY), 2)) + 50;

      for (let r = 2; r <= maxR; r += 4) { // Jahresringe ca. alle 4mm
        context.beginPath();
        for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
          const noise = (Math.sin(angle * 8) * 0.5 + Math.cos(angle * 3) * 0.2) * (r / 50); // Leichte Abweichung vom perfekten Kreis
          const x = centerPhysX + (r + noise) * Math.cos(angle);
          const y = centerPhysY + (r + noise) * Math.sin(angle);
          if (angle === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.closePath();
        
        // Linienstärke dynamisch anpassen. context.scale verformt auch die Linienstärke! 
        // Um eine halbwegs gleichmäßige Stärke zu haben, nehmen wir einen Mittelwert der Skalierung.
        const meanScale = (1024 / scaleX + 1024 / scaleY) / 2;
        context.lineWidth = Math.max(0.2, (3 - r * 0.005)) / meanScale * 2;
        
        context.strokeStyle = `rgba(30, 15, 0, 0.95)`;
        context.stroke();
      }
      context.restore();
      
      // Leichtes Rauschen für eine natürliche Textur
      const imageData = context.getImageData(0, 0, 1024, 1024);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 15;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise));
        data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise));
      }
      context.putImageData(imageData, 0, 0);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, [exzentrizitaetX, exzentrizitaetY, breite, dicke]);

  const woodSideTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = '#cbd5e1';
      context.fillRect(0, 0, 1024, 1024);

      for (let x = 0; x < 1024; x += 15) {
        context.beginPath();
        context.moveTo(x, 0);
        for (let y = 0; y <= 1024; y += 50) {
          const noise = Math.sin(y * 0.05) * 5 + Math.cos(y * 0.01) * 3;
          context.lineTo(x + noise, y);
        }
        context.lineWidth = 4;
        context.strokeStyle = `rgba(40, 20, 0, 0.8)`;
        context.stroke();
      }
      
      const imageData = context.getImageData(0, 0, 1024, 1024);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 15;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise));
        data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise));
      }
      context.putImageData(imageData, 0, 0);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.rotation = Math.PI / 2;
    return texture;
  }, []);

  const materials = useMemo(() => {
    const crossMat = new THREE.MeshStandardMaterial({ map: woodCrossTexture, roughness: 0.9 });
    const sideMat = new THREE.MeshStandardMaterial({ map: woodSideTexture, roughness: 0.9 });
    return [sideMat, sideMat, sideMat, sideMat, crossMat, crossMat];
  }, [woodCrossTexture, woodSideTexture]);

  const cylinderMaterials = useMemo(() => {
    const crossMat = new THREE.MeshStandardMaterial({ map: woodCrossTexture, roughness: 0.9 });
    const sideMat = new THREE.MeshStandardMaterial({ map: woodSideTexture, roughness: 0.9 });
    return [sideMat, crossMat, crossMat];
  }, [woodCrossTexture, woodSideTexture]);

  const cuppingFactorX = (visualShrinkT - visualShrinkR) * (exzentrizitaetY / 100);
  const cuppingFactorY = (visualShrinkT - visualShrinkR) * (exzentrizitaetX / 100);
  
  const DeformedBox = () => {
    const geom = useMemo(() => {
      const g = new THREE.BoxGeometry(breite * viewScale, dicke * viewScale, laenge * viewScale, 32, 2, 2);
      const pos = g.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        
        // yOffset depends on x distance from center
        const yOffset = x * x * cuppingFactorX * 2;
        
        // xOffset depends on y distance from center
        const xOffset = y * y * cuppingFactorY * 2;
        
        pos.setY(i, y + yOffset);
        pos.setX(i, x + xOffset);
      }
      g.computeVertexNormals();
      return g;
    }, [breite, dicke, laenge, viewScale, cuppingFactorX, cuppingFactorY]);

    return (
      <mesh geometry={geom} scale={[visualScaleX, visualScaleY, visualScaleZ]} material={materials}>
        <Edges scale={1} threshold={15} color="#334155" />
      </mesh>
    );
  };

  return (
    <Canvas gl={{ preserveDrawingBuffer: true }} camera={{ position: [5, 5, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <OrbitControls makeDefault />
      
      {querschnitt !== 'rund' ? (
        <Box args={[breite * viewScale, dicke * viewScale, laenge * viewScale]}>
          <meshBasicMaterial color="#A3113E" wireframe={false} visible={false} />
          <Edges scale={1} threshold={15} color="#A3113E" renderOrder={1000}>
            <lineBasicMaterial color="#A3113E" linewidth={3} depthTest={false} />
          </Edges>
        </Box>
      ) : (
        <Cylinder args={[(breite / 2) * viewScale, (breite / 2) * viewScale, laenge * viewScale, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#A3113E" wireframe={false} visible={false} />
          <Edges scale={1} threshold={15} color="#A3113E" renderOrder={1000}>
            <lineBasicMaterial color="#A3113E" linewidth={3} depthTest={false} />
          </Edges>
        </Cylinder>
      )}

      {querschnitt !== 'rund' ? (
        <DeformedBox />
      ) : (
        <Cylinder 
          args={[(breite / 2) * viewScale, (breite / 2) * viewScale, laenge * viewScale, 32]} 
          scale={[visualScaleX, visualScaleY, visualScaleZ]}
          rotation={[Math.PI / 2, 0, 0]}
          material={cylinderMaterials}
        >
        </Cylinder>
      )}
      
      <axesHelper args={[5]} />
    </Canvas>
  );
}

'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import { Group, Mesh } from 'three';
import Scene3D from './Scene3D';

/**
 * Individual architecture layer component
 */
function ArchitectureLayer({
  position,
  color,
  label,
  description,
  index,
}: {
  position: [number, number, number];
  color: string;
  label: string;
  description: string;
  index: number;
}) {
  const meshRef = useRef<Mesh>(null);

  // Subtle floating animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime + index) * 0.05;
    }
  });

  return (
    <group position={position}>
      <RoundedBox
        ref={meshRef}
        args={[4, 0.5, 3]}
        radius={0.05}
        smoothness={4}
      >
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.4}
          transparent
          opacity={0.9}
        />
      </RoundedBox>

      {/* Layer label */}
      <Text
        position={[0, 0, 1.6]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {label}
      </Text>

      {/* Layer description */}
      <Text
        position={[0, -0.2, 1.6]}
        fontSize={0.12}
        color="#e0e0e0"
        anchorX="center"
        anchorY="middle"
        maxWidth={3.5}
        font="/fonts/inter-regular.woff"
      >
        {description}
      </Text>
    </group>
  );
}

/**
 * Connection lines between layers
 */
function ConnectionLines() {
  const positions = [
    [0, 1.5, 0],
    [0, 0.5, 0],
    [0, -0.5, 0],
    [0, -1.5, 0],
    [0, -2.5, 0],
  ];

  return (
    <group>
      {positions.slice(0, -1).map((pos, i) => {
        const nextPos = positions[i + 1];
        const midY = (pos[1] + nextPos[1]) / 2;
        const height = Math.abs(pos[1] - nextPos[1]);

        return (
          <mesh key={i} position={[0, midY, 0]}>
            <cylinderGeometry args={[0.02, 0.02, height, 8]} />
            <meshStandardMaterial color="#4a9eff" opacity={0.5} transparent />
          </mesh>
        );
      })}
    </group>
  );
}

/**
 * Main 3D NetSuite Architecture visualization
 * Shows the layered architecture with interactive 3D elements
 */
export default function NetSuiteArchitecture3D() {
  const layers = [
    {
      position: [0, 1.5, 0] as [number, number, number],
      color: '#6366f1',
      label: 'Presentation Layer',
      description: 'User Interface & UIF Framework',
    },
    {
      position: [0, 0.5, 0] as [number, number, number],
      color: '#8b5cf6',
      label: 'Application Layer',
      description: 'SuiteScript Runtime Environment',
    },
    {
      position: [0, -0.5, 0] as [number, number, number],
      color: '#a855f7',
      label: 'Business Logic Layer',
      description: 'Custom Scripts & Workflows',
    },
    {
      position: [0, -1.5, 0] as [number, number, number],
      color: '#c026d3',
      label: 'Integration Layer',
      description: 'REST, SOAP & SuiteQL APIs',
    },
    {
      position: [0, -2.5, 0] as [number, number, number],
      color: '#db2777',
      label: 'Database Layer',
      description: 'Oracle Database with Custom Schema',
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-4 text-center">
        <h3 className="text-xl font-bold text-foreground mb-2">
          NetSuite Multi-Layered Architecture
        </h3>
        <p className="text-sm text-muted-foreground">
          Interactive 3D visualization - Drag to rotate, scroll to zoom
        </p>
      </div>

      <Scene3D cameraPosition={[0, 0, 8]}>
        {/* Architecture layers */}
        {layers.map((layer, index) => (
          <ArchitectureLayer key={index} {...layer} index={index} />
        ))}

        {/* Connection lines */}
        <ConnectionLines />
      </Scene3D>
    </div>
  );
}

'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Trail } from '@react-three/drei';
import { Group, Vector3 } from 'three';
import Scene3D from './Scene3D';

/**
 * Animated data particle that travels along a path
 */
function DataParticle({
  path,
  speed = 1,
  color = '#4a9eff',
  delay = 0,
}: {
  path: Vector3[];
  speed?: number;
  color?: string;
  delay?: number;
}) {
  const particleRef = useRef<Group>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useFrame((state) => {
    if (!particleRef.current || path.length < 2) return;

    const time = (state.clock.elapsedTime * speed + delay) % (path.length - 1);
    const index = Math.floor(time);
    const nextIndex = (index + 1) % path.length;
    const t = time - index;

    if (index !== currentIndex) {
      setCurrentIndex(index);
    }

    const current = path[index];
    const next = path[nextIndex];

    particleRef.current.position.lerpVectors(current, next, t);
  });

  return (
    <group ref={particleRef}>
      <Trail
        width={2}
        length={8}
        color={color}
        attenuation={(width) => width}
      >
        <Sphere args={[0.08, 16, 16]}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
            metalness={0.8}
            roughness={0.2}
          />
        </Sphere>
      </Trail>
    </group>
  );
}

/**
 * Node in the data flow (endpoint, database, or service)
 */
function FlowNode({
  position,
  label,
  color,
}: {
  position: [number, number, number];
  label: string;
  color: string;
}) {
  const meshRef = useRef<Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <Sphere args={[0.3, 32, 32]}>
        <meshStandardMaterial
          color={color}
          metalness={0.6}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </Sphere>
    </group>
  );
}

/**
 * 3D Data Flow Visualization
 * Shows how data flows through NetSuite architecture
 */
export default function DataFlow3D() {
  // Define flow nodes
  const nodes = [
    { position: [-3, 2, 0] as [number, number, number], label: 'User Interface', color: '#6366f1' },
    { position: [0, 1, 0] as [number, number, number], label: 'SuiteScript', color: '#8b5cf6' },
    { position: [3, 0, 0] as [number, number, number], label: 'API Layer', color: '#a855f7' },
    { position: [0, -1, 0] as [number, number, number], label: 'Database', color: '#db2777' },
    { position: [-3, 0, 0] as [number, number, number], label: 'Integration', color: '#ec4899' },
  ];

  // Define data flow paths
  const paths = [
    // UI to SuiteScript
    [
      new Vector3(-3, 2, 0),
      new Vector3(-1.5, 1.5, 0),
      new Vector3(0, 1, 0),
    ],
    // SuiteScript to API
    [
      new Vector3(0, 1, 0),
      new Vector3(1.5, 0.5, 0),
      new Vector3(3, 0, 0),
    ],
    // API to Database
    [
      new Vector3(3, 0, 0),
      new Vector3(1.5, -0.5, 0),
      new Vector3(0, -1, 0),
    ],
    // Database to Integration
    [
      new Vector3(0, -1, 0),
      new Vector3(-1.5, -0.5, 0),
      new Vector3(-3, 0, 0),
    ],
    // Integration back to UI
    [
      new Vector3(-3, 0, 0),
      new Vector3(-3, 1, 0),
      new Vector3(-3, 2, 0),
    ],
  ];

  return (
    <div className="w-full">
      <div className="mb-4 text-center">
        <h3 className="text-xl font-bold text-foreground mb-2">
          Data Flow Through NetSuite
        </h3>
        <p className="text-sm text-muted-foreground">
          Watch how data moves through different layers of the architecture
        </p>
      </div>

      <Scene3D cameraPosition={[0, 0, 8]}>
        {/* Flow nodes */}
        {nodes.map((node, i) => (
          <FlowNode key={i} {...node} />
        ))}

        {/* Data particles */}
        {paths.map((path, i) => (
          <DataParticle
            key={i}
            path={path}
            speed={0.3}
            color={['#4a9eff', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'][i]}
            delay={i * 2}
          />
        ))}
      </Scene3D>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
        {nodes.map((node, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: node.color }}
            />
            <span className="text-muted-foreground">{node.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

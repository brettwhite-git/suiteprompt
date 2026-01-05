'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { ReactNode, Suspense } from 'react';

interface Scene3DProps {
  children: ReactNode;
  cameraPosition?: [number, number, number];
  enableControls?: boolean;
  className?: string;
}

/**
 * Base 3D scene component wrapper using React Three Fiber
 * Provides consistent canvas setup with camera, controls, and lighting
 */
export default function Scene3D({
  children,
  cameraPosition = [0, 0, 5],
  enableControls = true,
  className = 'w-full h-[500px]',
}: Scene3DProps) {
  return (
    <div className={className}>
      <Canvas>
        <PerspectiveCamera makeDefault position={cameraPosition} />

        {/* Lighting setup */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        {/* Scene content */}
        <Suspense fallback={null}>
          {children}
        </Suspense>

        {/* Controls */}
        {enableControls && (
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
        )}
      </Canvas>
    </div>
  );
}

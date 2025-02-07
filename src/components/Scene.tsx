import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Points } from '@react-three/drei';
import * as THREE from 'three';
import { Camera } from '@mediapipe/camera_utils';
import { Hands } from '@mediapipe/hands';

function generateSandParticles(count: number) {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const originalPositions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const radius = Math.random() * 3.5;
    const height = Math.random() * Math.exp(-radius * 0.5);
    
    const x = Math.cos(theta) * radius;
    const y = height - 1;
    const z = Math.sin(theta) * radius;
    
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    
    originalPositions[i * 3] = x;
    originalPositions[i * 3 + 1] = y;
    originalPositions[i * 3 + 2] = z;
    
    velocities[i * 3] = (Math.random() - 0.5) * 0.01;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
  }
  
  return { positions, velocities, originalPositions };
}

interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

interface SceneProps {
  color: string;
}

export function Scene({ color }: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const [handLandmarks, setHandLandmarks] = useState<HandLandmark[]>([]);
  const [hasCamera, setHasCamera] = useState(false);
  
  const { camera, mouse } = useThree();
  const targetZoom = useRef(15);
  const currentZoom = useRef(15);
  const targetRotation = useRef({ x: 0, y: 0 });
  const time = useRef(0);
  
  useEffect(() => {
    camera.position.z = 15;
  }, [camera]);
  
  const particleCount = 50000;
  const { positions, velocities, originalPositions } = useMemo(() => generateSandParticles(particleCount), []);
  const positionsArray = useRef(positions);
  const velocitiesArray = useRef(velocities);
  const originalPositionsArray = useRef(originalPositions);

  // Create material with the current color
  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 0.01,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [color]); // Recreate material when color changes

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const hasVideoInput = devices.some(device => device.kind === 'videoinput');
        if (hasVideoInput) {
          setHasCamera(true);
          initializeHandTracking();
        }
      })
      .catch(() => {
        setHasCamera(false);
      });
  }, []);

  const initializeHandTracking = async () => {
    try {
      const video = document.createElement('video');
      video.style.display = 'none';
      document.body.appendChild(video);

      const hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      hands.onResults((results) => {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const landmarks = results.multiHandLandmarks[0].map(landmark => ({
            x: -(landmark.x * 2 - 1) * 8,
            y: -(landmark.y * 2 - 1) * 8,
            z: landmark.z * 8
          }));
          setHandLandmarks(landmarks);
        } else {
          setHandLandmarks([]);
        }
      });

      const camera = new Camera(video, {
        onFrame: async () => {
          await hands.send({ image: video });
        },
        width: 640,
        height: 480,
        mirrored: true
      });

      await camera.start();

      return () => {
        video.remove();
        hands.close();
      };
    } catch (error) {
      console.log('Hand tracking initialization failed, falling back to mouse control');
      setHasCamera(false);
    }
  };

  const handleWheel = (event: WheelEvent) => {
    targetZoom.current = Math.max(8, Math.min(30, targetZoom.current + event.deltaY * 0.01));
  };

  const handleMouseMove = () => {
    targetRotation.current = {
      x: mouse.y * 0.4,
      y: mouse.x * 0.4
    };
  };

  React.useEffect(() => {
    window.addEventListener('wheel', handleWheel);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useFrame((state) => {
    if (!group.current || !pointsRef.current) return;
    
    time.current += 0.02;
    
    currentZoom.current = THREE.MathUtils.lerp(currentZoom.current, targetZoom.current, 0.1);
    camera.position.z = currentZoom.current;
    
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetRotation.current.x,
      0.15
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetRotation.current.y,
      0.15
    );
    
    const positions = positionsArray.current;
    const velocities = velocitiesArray.current;
    
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      
      let closestLandmark = null;
      let minDistance = Infinity;
      
      if (handLandmarks.length > 0) {
        for (const landmark of handLandmarks) {
          const dx = positions[idx] - landmark.x;
          const dy = positions[idx + 1] - landmark.y;
          const dz = positions[idx + 2] - landmark.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (distance < minDistance) {
            minDistance = distance;
            closestLandmark = landmark;
          }
        }
      }
      
      if (closestLandmark && minDistance < 10) {
        const dx = closestLandmark.x - positions[idx];
        const dy = closestLandmark.y - positions[idx + 1];
        const dz = closestLandmark.z - positions[idx + 2];
        
        const attractionStrength = 0.2 / (1 + minDistance);
        velocities[idx] += dx * attractionStrength;
        velocities[idx + 1] += dy * attractionStrength;
        velocities[idx + 2] += dz * attractionStrength;
      } else {
        const dx = originalPositionsArray.current[idx] - positions[idx];
        const dy = originalPositionsArray.current[idx + 1] - positions[idx + 1];
        const dz = originalPositionsArray.current[idx + 2] - positions[idx + 2];
        
        velocities[idx] += dx * 0.01;
        velocities[idx + 1] += dy * 0.01;
        velocities[idx + 2] += dz * 0.01;
        
        velocities[idx] += (Math.random() - 0.5) * 0.02;
        velocities[idx + 1] += (Math.random() - 0.5) * 0.02;
        velocities[idx + 2] += (Math.random() - 0.5) * 0.02;
        
        const wave = Math.sin(time.current + positions[idx] * 0.5) * 0.002;
        velocities[idx + 1] += wave;
      }
      
      velocities[idx] *= 0.98;
      velocities[idx + 1] *= 0.98;
      velocities[idx + 2] *= 0.98;
      
      positions[idx] += velocities[idx];
      positions[idx + 1] += velocities[idx + 1];
      positions[idx + 2] += velocities[idx + 2];
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <pointLight position={[-5, -5, -5]} intensity={0.4} color="#1a1a1a" />

      <group ref={group}>
        <Points ref={pointsRef} positions={positionsArray.current} stride={3} material={material} />
      </group>
    </>
  );
}
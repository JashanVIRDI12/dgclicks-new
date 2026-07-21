"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrambleText from "./scramble-text";

function ShoppingBagIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden
    >
      <path d="M216,36H40A20,20,0,0,0,20,56V200a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V56A20,20,0,0,0,216,36Zm-4,160H44V60H212ZM76,88a12,12,0,0,1,24,0,28,28,0,0,0,56,0,12,12,0,0,1,24,0A52,52,0,0,1,76,88Z" />
    </svg>
  );
}

class HeartCurve extends THREE.Curve<THREE.Vector3> {
  constructor() {
    super();
  }
  getPoint(t: number, optionalTarget = new THREE.Vector3()) {
    t = t * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

    return optionalTarget.set(x * 0.002, (y + 6) * 0.002, 0);
  }
}

const sharedHeartCurve = new HeartCurve();

function ResponsiveGroup({ children }: { children: React.ReactNode }) {
  const { viewport } = useThree();
  const scale = Math.min(1.1, viewport.width / 3.5);
  return <group scale={scale}>{children}</group>;
}

function GlassCapsule({ color, power, intensity }: { color: string, power: number, intensity: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    color: { value: new THREE.Color('#ffffff') },
    power: { value: 2.5 },
    intensity: { value: 0.6 },
  }), []);

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.color.value.set(color);
      materialRef.current.uniforms.power.value = power;
      materialRef.current.uniforms.intensity.value = intensity;
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[0.30, 64, 64, 0, Math.PI * 2, 0, Math.PI]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 color;
          uniform float power;
          uniform float intensity;
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPosition);
            float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
            fresnel = pow(fresnel, power);
            gl_FragColor = vec4(color, fresnel * intensity);
          }
        `}
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

const earBaseMat = new THREE.MeshStandardMaterial({ color: '#f0f0f0', roughness: 0.5 });
const earRingMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3 });
const earCenterMat = new THREE.MeshStandardMaterial({ color: '#cccccc', roughness: 0.8 });
const antennaBaseMat = new THREE.MeshStandardMaterial({ color: '#999999', roughness: 0.4, metalness: 0.5 });
const antennaStickMat = new THREE.MeshStandardMaterial({ color: '#d0d0d0', roughness: 0.4, metalness: 0.2 });
const antennaTipMat = new THREE.MeshStandardMaterial({ color: '#ff3366', roughness: 0.2, toneMapped: false });

function RobotEar({ position, scale = 1, isLeft = false }: { position: [number, number, number], scale?: number, isLeft?: boolean }) {
  const dir = isLeft ? -1 : 1;

  return (
    <group position={position} scale={scale}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow material={earBaseMat}>
        <cylinderGeometry args={[0.04, 0.04, 0.025, 32]} />
      </mesh>

      <mesh position={[dir * 0.012, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow material={earRingMat}>
        <torusGeometry args={[0.032, 0.008, 16, 32]} />
      </mesh>

      <mesh position={[dir * 0.012, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow material={earCenterMat}>
        <cylinderGeometry args={[0.03, 0.03, 0.005, 32]} />
      </mesh>

      <group position={[dir * 0.015, 0.035, 0]} rotation={[-0.4, 0, 0]}>
        <mesh position={[0, 0.01, 0]} castShadow receiveShadow material={antennaBaseMat}>
           <cylinderGeometry args={[0.006, 0.008, 0.02, 16]} />
        </mesh>
        <mesh position={[0, 0.06, 0]} castShadow receiveShadow material={antennaStickMat}>
          <cylinderGeometry args={[0.003, 0.003, 0.1, 8]} />
        </mesh>
        <mesh position={[0, 0.11, 0]} castShadow receiveShadow material={antennaTipMat}>
          <sphereGeometry args={[0.006, 16, 16]} />
        </mesh>
      </group>
    </group>
  );
}

const eyeMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(2, 2, 2), toneMapped: false, transparent: true });
const heartMat = new THREE.MeshBasicMaterial({ color: '#ff3366', toneMapped: false });

function RobotEye({ position, rotation, scale = 1, blinkDuration = 0.15, blinkCycle = 3.0, isLovedRef }: { position: [number, number, number], rotation: [number, number, number], scale?: number, blinkDuration?: number, blinkCycle?: number, isLovedRef: React.MutableRefObject<boolean> }) {
  const groupRef = useRef<THREE.Group>(null);
  const normalEyesRef = useRef<THREE.Group>(null);
  const heartEyeRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || !normalEyesRef.current || !heartEyeRef.current) return;

    const isHeart = isLovedRef.current;

    normalEyesRef.current.visible = !isHeart;
    heartEyeRef.current.visible = isHeart;

    const cycle = clock.getElapsedTime() % blinkCycle;

    let targetScaleY = 1;

    if (cycle < blinkDuration && !isHeart) {

      const progress = cycle / blinkDuration;
      const blinkClose = Math.sin(progress * Math.PI);

      targetScaleY = Math.max(0.05, 1.0 - blinkClose);
    }

    groupRef.current.scale.set(scale, scale * targetScaleY, scale);
  });

  const { topPath, bottomPath } = useMemo(() => {
    const w = 0.025;
    const h = 0.035;
    const r = 0.02;
    const g = 0.005;

    const tPath = new THREE.CurvePath<THREE.Vector3>();
    tPath.add(new THREE.LineCurve3(new THREE.Vector3(-w, g, 0), new THREE.Vector3(-w, h - r, 0)));
    tPath.add(new THREE.QuadraticBezierCurve3(
       new THREE.Vector3(-w, h - r, 0),
       new THREE.Vector3(-w, h, 0),
       new THREE.Vector3(-w + r, h, 0)
    ));
    tPath.add(new THREE.LineCurve3(new THREE.Vector3(-w + r, h, 0), new THREE.Vector3(w - r, h, 0)));
    tPath.add(new THREE.QuadraticBezierCurve3(
       new THREE.Vector3(w - r, h, 0),
       new THREE.Vector3(w, h, 0),
       new THREE.Vector3(w, h - r, 0)
    ));
    tPath.add(new THREE.LineCurve3(new THREE.Vector3(w, h - r, 0), new THREE.Vector3(w, g, 0)));

    const bPath = new THREE.CurvePath<THREE.Vector3>();
    bPath.add(new THREE.LineCurve3(new THREE.Vector3(-w, -g, 0), new THREE.Vector3(-w, -(h - r), 0)));
    bPath.add(new THREE.QuadraticBezierCurve3(
       new THREE.Vector3(-w, -(h - r), 0),
       new THREE.Vector3(-w, -h, 0),
       new THREE.Vector3(-w + r, -h, 0)
    ));
    bPath.add(new THREE.LineCurve3(new THREE.Vector3(-w + r, -h, 0), new THREE.Vector3(w - r, -h, 0)));
    bPath.add(new THREE.QuadraticBezierCurve3(
       new THREE.Vector3(w - r, -h, 0),
       new THREE.Vector3(w, -h, 0),
       new THREE.Vector3(w, -(h - r), 0)
    ));
    bPath.add(new THREE.LineCurve3(new THREE.Vector3(w, -(h - r), 0), new THREE.Vector3(w, -g, 0)));

    return { topPath: tPath, bottomPath: bPath };
  }, []);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <mesh ref={heartEyeRef} visible={false} material={heartMat}>
        <tubeGeometry args={[sharedHeartCurve, 64, 0.0035, 8, true]} />
      </mesh>

      <group ref={normalEyesRef}>
        <mesh material={eyeMat}>
          <tubeGeometry args={[topPath, 20, 0.0035, 8, false]} />
        </mesh>
        <mesh material={eyeMat}>
          <tubeGeometry args={[bottomPath, 20, 0.0035, 8, false]} />
        </mesh>
      </group>
    </group>
  );
}

function generatePbrTexturesAsync(): Promise<{ colorMap: THREE.CanvasTexture, bumpMap: THREE.CanvasTexture }> {
  return new Promise((resolve) => {

    setTimeout(() => {

      const size = 512;
      const canvasC = document.createElement('canvas');
      const canvasB = document.createElement('canvas');
      canvasC.width = canvasB.width = size;
      canvasC.height = canvasB.height = size;
      const ctxC = canvasC.getContext('2d');
      const ctxB = canvasB.getContext('2d');

      if (ctxC && ctxB) {
        ctxC.fillStyle = '#dcdcdc';
        ctxC.fillRect(0, 0, size, size);
        ctxB.fillStyle = '#808080';
        ctxB.fillRect(0, 0, size, size);

        for (let i = 0; i < 10000; i++) {
          const x = Math.random() * size;
          const y = Math.random() * size;
          const r = 0.5 + Math.random() * 1.5;
          const isDark = Math.random() > 0.15;

          ctxC.beginPath();
          ctxC.arc(x, y, r, 0, Math.PI * 2);
          ctxC.fillStyle = isDark ? '#222222' : '#dddddd';
          ctxC.fill();

          ctxB.beginPath();
          ctxB.arc(x, y, r, 0, Math.PI * 2);
          ctxB.fillStyle = isDark ? '#000000' : '#ffffff';
          ctxB.fill();
        }
      }

      const texC = new THREE.CanvasTexture(canvasC);
      const texB = new THREE.CanvasTexture(canvasB);
      texC.wrapS = texB.wrapS = THREE.RepeatWrapping;
      texC.wrapT = texB.wrapT = THREE.RepeatWrapping;

      texC.repeat.set(6, 3);
      texB.repeat.set(6, 3);
      texC.needsUpdate = true;
      texB.needsUpdate = true;

      resolve({ colorMap: texC, bumpMap: texB });
    }, 0);
  });
}

function RobotPrototype({ accentColor = '#00ffc6', neckParams = { baseR: 0.25, baseH: -0.01, midR: 0.23, midH: 0.02, lipBottomR: 0.27, lipBottomH: 0.025, lipTopR: 0.28, lipTopH: 0.05, innerR: 0.24, innerDropH: 0.03 }, bodyParams = { bodyBevelR: 0.21, bodyBevelY: 0.38, bodyBevelT: 0.015 } }: { accentColor?: string, neckParams?: Record<string, number>, bodyParams?: Record<string, number> }) {
  const isLovedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  const [textures, setTextures] = useState<{ colorMap: THREE.CanvasTexture | null, bumpMap: THREE.CanvasTexture | null }>({ colorMap: null, bumpMap: null });

  const design = {
    pantallaColor: accentColor,
    pantallaGrosor: 3.8,
    pantallaBrillo: 1.2,
    separacionOjos: 0.07,
    tamañoOrejas: 1.3,
    escalaOjos: 1.1,
    parpadeoFrecuencia: 3.0,
    parpadeoDuracion: 0.45,
    colorChasis: '#c4c4c4',
    alturaCabeza: 0.60
  };

  const config = {
    moveSpeed: 0.35,
    bodyRotSpeed: 10.0,
    headRotSpeed: 20.0,
    bodyTiltX: 0.0,
    bodyTiltY: 0.95,
    headLookX: 0.30,
    headLookY: 1.80
  };

  useFrame((state, delta) => {
    if (!bodyRef.current || !headRef.current) return;

    const dt = Math.min(delta, 0.1);

    const tx = state.pointer.x;
    const ty = state.pointer.y;

    const maxMoveX = state.viewport.width / 3.5;
    const targetPosX = tx * maxMoveX;
    bodyRef.current.position.x = THREE.MathUtils.lerp(bodyRef.current.position.x, targetPosX, config.moveSpeed * dt);

    const relativeX = tx - (bodyRef.current.position.x / 2.5);

    const bodyTargetRotY = -relativeX * config.bodyTiltY;

    const bodyTargetRotX = (relativeX * relativeX * config.bodyTiltX) - (ty * 0.25);

    const bodyTargetRotZ = -relativeX * 0.15;

    bodyRef.current.rotation.y = THREE.MathUtils.lerp(bodyRef.current.rotation.y, bodyTargetRotY, config.bodyRotSpeed * dt);
    bodyRef.current.rotation.x = THREE.MathUtils.lerp(bodyRef.current.rotation.x, bodyTargetRotX, config.bodyRotSpeed * dt);
    bodyRef.current.rotation.z = THREE.MathUtils.lerp(bodyRef.current.rotation.z, bodyTargetRotZ, config.bodyRotSpeed * dt);

    const headTargetRotY = relativeX * config.headLookY;
    const headTargetRotX = -ty * config.headLookX;

    headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, headTargetRotY, config.headRotSpeed * dt);
    headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, headTargetRotX, config.headRotSpeed * dt);
  });

  useEffect(() => {
    let mounted = true;
    let generatedMaps: { colorMap: THREE.CanvasTexture, bumpMap: THREE.CanvasTexture } | null = null;

    generatePbrTexturesAsync().then((res) => {
      if (mounted) {
        generatedMaps = res;
        setTextures(res);
      } else {
        res.colorMap.dispose();
        res.bumpMap.dispose();
      }
    });

    return () => {
      mounted = false;

      if (generatedMaps) {
        generatedMaps.colorMap.dispose();
        generatedMaps.bumpMap.dispose();
      }
    };
  }, []);

  const handlePointerDown = (e: import('@react-three/fiber').ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    isLovedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      isLovedRef.current = false;
    }, 2000);
  };

  const neckProfile = useMemo(() => {
    const points = [];

    points.push(new THREE.Vector2(neckParams.innerR, neckParams.baseH));

    points.push(new THREE.Vector2(neckParams.baseR, neckParams.baseH));

    points.push(new THREE.Vector2(neckParams.midR, neckParams.midH));

    points.push(new THREE.Vector2(neckParams.lipBottomR, neckParams.lipBottomH));

    points.push(new THREE.Vector2(neckParams.lipTopR, neckParams.lipTopH));

    points.push(new THREE.Vector2(neckParams.innerR, neckParams.lipTopH));

    points.push(new THREE.Vector2(neckParams.innerR, neckParams.lipTopH - neckParams.innerDropH));
    return points;
  }, [neckParams]);

  const headMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#111111',
      roughness: 1.0,
      metalness: 0.0,
    });
  }, []);

  if (!textures.colorMap) return null;

  return (
    <group
      ref={bodyRef}
      position={[0, -0.3, 0]}
      onPointerDown={handlePointerDown}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.43, 64, 64, 0, Math.PI * 2, Math.PI * 0.15, Math.PI * 0.85]} />
        <meshStandardMaterial
          color={design.colorChasis}
          map={textures.colorMap || undefined}
          bumpMap={textures.bumpMap || undefined}
          bumpScale={0.005}
          roughness={1.0}
          metalness={0.0}
          envMapIntensity={0.0}
        />
      </mesh>

      {bodyParams.bodyBevelT > 0 && (
        <mesh position={[0, bodyParams.bodyBevelY, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <torusGeometry args={[bodyParams.bodyBevelR, bodyParams.bodyBevelT, 32, 64]} />
          <meshStandardMaterial
            color={design.colorChasis}
            map={textures.colorMap || undefined}
            bumpMap={textures.bumpMap || undefined}
            bumpScale={0.005}
            roughness={1.0}
            metalness={0.0}
            envMapIntensity={0.0}
          />
        </mesh>
      )}

      <mesh position={[0, 0.38, 0]} receiveShadow castShadow>
        <latheGeometry args={[neckProfile, 64]} />
        <meshStandardMaterial
          color={design.colorChasis}
          map={textures.colorMap || undefined}
          bumpMap={textures.bumpMap || undefined}
          bumpScale={0.005}
          roughness={1.0}
          metalness={0.0}
          envMapIntensity={0.0}
        />
      </mesh>

      <group ref={headRef} position={[0, design.alturaCabeza, 0]}>

        <mesh material={headMat} castShadow receiveShadow>
          <sphereGeometry args={[0.28, 64, 64, 0, Math.PI * 2, 0, Math.PI]} />
        </mesh>

        <GlassCapsule color={design.pantallaColor} power={design.pantallaGrosor} intensity={design.pantallaBrillo} />

        <group position={[0, -0.02, 0.29]}>
          <RobotEye position={[-design.separacionOjos, 0, 0]} rotation={[0, -0.2, 0]} scale={design.escalaOjos} blinkDuration={design.parpadeoDuracion} blinkCycle={design.parpadeoFrecuencia} isLovedRef={isLovedRef} />
          <RobotEye position={[design.separacionOjos, 0, 0]} rotation={[0, 0.2, 0]} scale={design.escalaOjos} blinkDuration={design.parpadeoDuracion} blinkCycle={design.parpadeoFrecuencia} isLovedRef={isLovedRef} />
        </group>

        <RobotEar position={[-0.29, 0, 0]} isLeft={true} scale={design.tamañoOrejas} />
        <RobotEar position={[0.29, 0, 0]} isLeft={false} scale={design.tamañoOrejas} />

      </group>
    </group>
  );
}

export interface NavItem {
  label: string;
  href: string;
  target?: string;
}

export interface RobotHeroProps {
  backgroundText?: string;
  navItemsLeft?: NavItem[];
  contactText?: string;
  contactHref?: string;
  contactTarget?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  /** Brand accent — drives the robot screen glow, antenna widget, and CTA */
  accentColor?: string;
  /** Hero background gradient stops */
  background?: { top: string; mid: string; bottom: string };
  /** Rendered in the bottom overlay band (headline, CTAs, etc.) */
  children?: React.ReactNode;
}

function AntennaNavbar({
  leftItems,
  contactText,
  contactHref,
  contactTarget,
  ctaText,
  onCtaClick,
  accentColor,
}: {
  leftItems: NavItem[],
  contactText: string,
  contactHref: string,
  contactTarget?: string,
  ctaText: string,
  onCtaClick?: () => void,
  accentColor: string,
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { scrollY } = useScroll();
  const lineOpacity = useTransform(scrollY, [0, 50], [1, 0]);

  return (
    <nav className="sticky top-0 z-50 w-full pt-8 px-8 pointer-events-none">
      <div className="w-full max-w-[1400px] mx-auto flex flex-col relative pointer-events-auto">

        <div className="flex flex-col lg:flex-row items-center justify-between relative gap-4 lg:gap-0">

          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 sm:gap-3 z-20">
            {leftItems.map((item, idx) => (
              <a
                key={item.label}
                href={item.href}
                target={item.target}
                rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative px-7 py-2.5 rounded-full bg-white text-black hover:bg-zinc-100 text-sm font-bold transition-all overflow-hidden shadow-[0_4px_14px_rgba(15,27,45,0.12)]"
              >
                {item.label}
                {hoveredIndex === idx && (
                  <motion.div
                    layoutId="navbar-indicator-left"
                    className="absolute inset-0 border-b-[3px] border-black"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center pointer-events-auto cursor-pointer group z-10">
            <div className="relative flex items-center justify-center h-12 w-16">
              <div className="absolute left-2 w-1.5 h-4 bg-zinc-400 rounded-l-md transition-transform duration-300 group-hover:-translate-x-1" />
              <div className="absolute right-2 w-1.5 h-4 bg-zinc-400 rounded-r-md transition-transform duration-300 group-hover:translate-x-1" />

              <div className="z-10 w-10 h-10 bg-white/60 border-2 border-black/10 backdrop-blur-md rounded-[12px] flex items-center justify-center shadow-[0_4px_20px_rgba(15,27,45,0.15)] transition-all duration-300 group-hover:bg-white/80 group-hover:shadow-[0_4px_25px_rgba(15,27,45,0.2)]">
                <div className="w-[70%] h-[60%] bg-[#0a0a0a] rounded-lg flex items-center justify-center gap-1.5 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
                  <div
                    className="w-1.5 h-3 rounded-[2px] transition-transform duration-200 group-hover:scale-y-[0.2]"
                    style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
                  />
                  <div
                    className="w-1.5 h-3 rounded-[2px] transition-transform duration-200 group-hover:scale-y-[0.2]"
                    style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-end items-center gap-2 sm:gap-3 w-full lg:w-auto mt-4 lg:mt-0 z-20">
            <a
              href={contactHref}
              target={contactTarget}
              rel={contactTarget === "_blank" ? "noopener noreferrer" : undefined}
              className="px-5 sm:px-7 py-2.5 rounded-full bg-white text-black hover:bg-zinc-100 text-xs sm:text-sm font-bold transition-all shadow-[0_4px_14px_rgba(15,27,45,0.12)]"
            >
              {contactText}
            </a>
            <button
              onClick={onCtaClick}
              className="px-5 sm:px-7 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all hover:brightness-95 flex items-center gap-2 cursor-pointer"
              style={{
                backgroundColor: accentColor,
                color: '#06101F',
                boxShadow: `0 0 20px ${accentColor}66`,
              }}
            >
              {ctaText}
              <ShoppingBagIcon size={18} />
            </button>
          </div>

        </div>

        <motion.div
          style={{ opacity: lineOpacity }}
          className="w-full mt-6 border-b-2 border-dotted border-black/20"
        />

      </div>
    </nav>
  );
}

export function RobotHero({
  backgroundText = 'UITHEFACTORY',
  navItemsLeft = [
    { label: 'Product', href: '#' },
    { label: 'About', href: '#' },
    { label: 'Specs', href: '#' },
    { label: 'Reviews', href: '#' },
  ],
  contactText = 'Contact',
  contactHref = '#',
  contactTarget,
  ctaText = 'Buy Now',
  onCtaClick,
  accentColor = '#00ffc6',
  background = { top: '#cecbcb', mid: '#9a9a9a', bottom: '#bebebe' },
  children,
}: RobotHeroProps = {}) {
  const containerRef = useRef<HTMLElement>(null);

  const entorno = {
    fondoArriba: background.top,
    fondoMedio: background.mid,
    fondoAbajo: background.bottom,
    luzAmbiente: 0.75,
    luzPrincipal: 0.0,
    luzPrincipalColor: '#00ffe2',
    luzRelleno: 0.0,
    luzRellenoColor: '#dbdbdb',
    sombraOpacidad: 0.85,
    sombraBlur: 1.7
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-dvh min-h-[600px] overflow-hidden"
      style={{ background: `linear-gradient(to bottom, ${entorno.fondoArriba} 0%, ${entorno.fondoArriba} 55%, ${entorno.fondoMedio} 65%, ${entorno.fondoAbajo} 100%)` }}
    >
      <div
        className="absolute inset-x-0 top-0 h-[46dvh] min-h-[300px] sm:inset-0 sm:h-auto sm:min-h-0 flex items-center justify-center pointer-events-none overflow-hidden"
        style={{
          zIndex: 0,
          // The word dissolves before the content band so the eyebrow and
          // headline never fight it for legibility.
          maskImage:
            "linear-gradient(180deg, black 0%, black 52%, rgba(0,0,0,0.35) 72%, transparent 88%)",
          WebkitMaskImage:
            "linear-gradient(180deg, black 0%, black 52%, rgba(0,0,0,0.35) 72%, transparent 88%)",
        }}
      >
        <ScrambleText
          text={backgroundText}
          ariaHidden
          chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ01<>/*+"
          duration={1.9}
          revealDelay={0.5}
          className="font-display font-black select-none whitespace-nowrap"
          style={{
            color: '#000000',
            opacity: 0.13,
            letterSpacing: '-0.05em',
            fontSize: 'clamp(4rem, 15vw, 14rem)',
            lineHeight: 1,
            transform: `translate(0px, 20px)`,
          }}
        />
      </div>

      {/*
        Below `sm` the canvas only owns the top band of the hero instead of
        the full section. On desktop the camera's default framing centres
        the robot at mid-viewport, which is fine because the text sits far
        below in the wide/short aspect — but on a narrow/tall phone screen
        that same centring puts the robot right on top of the headline.
        Giving the canvas a fixed, short height keeps the robot's whole
        scene (and the camera's default centring within it) confined above
        the text, so they can never overlap regardless of device height.
      */}
      <div className="absolute inset-x-0 top-0 z-10 h-[46dvh] min-h-[300px] sm:inset-0 sm:h-auto sm:min-h-0">
        <Canvas
          shadows
          camera={{ position: [0, 0.2, 6], fov: 40 }}
        >
          <ambientLight intensity={entorno.luzAmbiente} color="#ffffff" />

          <directionalLight
            position={[0, 6, 3]}
            intensity={entorno.luzPrincipal}
            color={entorno.luzPrincipalColor}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0005}
          >
            <orthographicCamera attach="shadow-camera" args={[-1.5, 1.5, 1.5, -1.5, 0.1, 20]} />
          </directionalLight>

          <directionalLight position={[-5, 2, -5]} intensity={entorno.luzRelleno} color={entorno.luzRellenoColor} />

          <Environment preset="studio" blur={0.5} />

          <ResponsiveGroup>
            <ContactShadows position={[0, -0.79, 0]} opacity={entorno.sombraOpacidad} scale={15} resolution={1024} blur={entorno.sombraBlur} far={2.5} color="#000000" />
            <RobotPrototype
              accentColor={accentColor}
              neckParams={{ baseR: 0.215, baseH: -0.050, midR: 0.280, midH: 0.020, lipBottomR: 0.295, lipBottomH: 0.045, lipTopR: 0.270, lipTopH: 0.055, innerR: 0.100, innerDropH: 0.000 }}
              bodyParams={{ bodyBevelR: 0.235, bodyBevelY: 0.340, bodyBevelT: 0.025 }}
            />
          </ResponsiveGroup>
        </Canvas>
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col">
        <div className="relative w-full max-w-[1400px] mx-auto px-8 flex-1 flex flex-col pt-28">

          <div className="mt-auto flex justify-between items-end pb-12 w-full">
            {children}
          </div>
        </div>
      </div>

    </section>
  );
}

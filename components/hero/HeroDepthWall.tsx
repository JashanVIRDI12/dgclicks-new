"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  type MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { gsap } from "@/lib/gsap";
import { HERO_PROOFS, type ProofPlane } from "./proofs";

export type HeroMotionState = {
  pointerX: number;
  pointerY: number;
  cameraX: number;
  cameraZ: number;
  rotationY: number;
  rotationZ: number;
  scrollProgress: number;
};

type HeroDepthWallProps = {
  isMobile: boolean;
  isVisible: boolean;
  lowQuality: boolean;
  motionRef: MutableRefObject<HeroMotionState>;
  onError: (message: string) => void;
  onLoadProgress: (progress: number) => void;
  onReady: () => void;
};

const NIGHT = "#0e1a28";
const DG_BLUE = "#2e6ba8";
const DG_SKY = "#4a89c8";
const SKY_CYAN = "#8ccfe2";
const QUIET_ZONE_SHADER = {
  uniforms: {
    tDiffuse: { value: null },
    uMobile: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uMobile;
    varying vec2 vUv;

    void main() {
      vec4 source = texture2D(tDiffuse, vUv);
      vec3 night = vec3(0.0549, 0.1020, 0.1569);

      vec2 desktopDelta = (vUv - vec2(0.285, 0.505)) * vec2(1.06, 0.82);
      float desktopQuiet = 1.0 - smoothstep(0.22, 0.63, length(desktopDelta));
      desktopQuiet *= 1.0 - smoothstep(0.52, 0.80, vUv.x);

      vec2 mobileDelta = (vUv - vec2(0.50, 0.54)) * vec2(0.78, 1.02);
      float mobileQuiet = 1.0 - smoothstep(0.20, 0.76, length(mobileDelta));
      float quiet = mix(desktopQuiet * 0.88, mobileQuiet * 0.82, uMobile);

      vec2 edge = abs(vUv - 0.5) * 2.0;
      float vignette = smoothstep(0.48, 1.08, max(edge.x, edge.y));
      vec3 graded = mix(source.rgb, night, quiet);
      graded = mix(graded, night, vignette * 0.24);
      graded *= vec3(0.96, 0.985, 1.02);

      gl_FragColor = vec4(graded, source.a);
    }
  `,
};

export default function HeroDepthWall({
  isMobile,
  isVisible,
  lowQuality,
  motionRef,
  onError,
  onLoadProgress,
  onReady,
}: HeroDepthWallProps) {
  const [loaded, setLoaded] = useState<{
    proofs: ProofPlane[];
    textures: THREE.Texture[];
    fontFamily: string;
  } | null>(null);
  const selectedProofs = useMemo(
    () =>
      lowQuality
        ? HERO_PROOFS.filter((proof) => !proof.ambient)
        : HERO_PROOFS.filter(
            (proof) =>
              !proof.ambient || proof.id === "dashboard" || proof.id === "team",
          ),
    [lowQuality],
  );
  const sources = useMemo(
    () => selectedProofs.map((proof) => (lowQuality ? proof.mobileSrc : proof.src)),
    [lowQuality, selectedProofs],
  );
  const sourceKey = sources.join("|");

  useEffect(() => {
    let cancelled = false;
    let ownedTextures: THREE.Texture[] = [];
    const manager = new THREE.LoadingManager();
    manager.onProgress = (_url, itemsLoaded, itemsTotal) => {
      if (!cancelled) onLoadProgress(itemsLoaded / Math.max(itemsTotal, 1));
    };
    const loader = new THREE.TextureLoader(manager);

    Promise.all([
      Promise.all(sources.map((source) => loader.loadAsync(source))),
      document.fonts?.ready ?? Promise.resolve(),
    ])
      .then(([textures]) => {
        ownedTextures = textures;
        if (cancelled) {
          textures.forEach((texture) => texture.dispose());
          return;
        }
        textures.forEach((texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = false;
          texture.needsUpdate = true;
        });
        setLoaded({
          proofs: selectedProofs,
          textures,
          fontFamily: getComputedStyle(document.body).fontFamily,
        });
        onLoadProgress(1);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        onError(error instanceof Error ? error.message : "The proof wall could not load.");
      });

    return () => {
      cancelled = true;
      ownedTextures.forEach((texture) => texture.dispose());
    };
    // sourceKey is the stable identity for the selected texture tier.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceKey, onError, onLoadProgress]);

  if (!loaded) return null;

  return (
    <Canvas
      dpr={lowQuality ? [1, 1] : [1, 1.25]}
      frameloop={isVisible ? "always" : "demand"}
      camera={{ position: [0, 0, 8.4], fov: isMobile ? 44 : 39, near: 0.1, far: 35 }}
      gl={{
        alpha: false,
        antialias: false,
        depth: true,
        powerPreference: "high-performance",
        stencil: false,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(NIGHT, 1);
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <Scene
        fontFamily={loaded.fontFamily}
        isMobile={isMobile}
        lowQuality={lowQuality}
        motionRef={motionRef}
        onReady={onReady}
        proofs={loaded.proofs}
        textures={loaded.textures}
      />
    </Canvas>
  );
}

function Scene({
  fontFamily,
  isMobile,
  lowQuality,
  motionRef,
  onReady,
  proofs,
  textures,
}: {
  fontFamily: string;
  isMobile: boolean;
  lowQuality: boolean;
  motionRef: MutableRefObject<HeroMotionState>;
  onReady: () => void;
  proofs: ProofPlane[];
  textures: THREE.Texture[];
}) {
  const backgroundTexture = useMemo(() => createHeroBackgroundTexture(), []);

  useEffect(() => () => backgroundTexture.dispose(), [backgroundTexture]);

  return (
    <>
      <primitive attach="background" object={backgroundTexture} />
      <CameraRig motionRef={motionRef}>
        {proofs.map((proof, index) => (
          <ProofImage
            key={proof.id}
            fontFamily={fontFamily}
            isMobile={isMobile}
            proof={proof}
            texture={textures[index]}
          />
        ))}
      </CameraRig>
      <DepthOfField isMobile={isMobile} lowQuality={lowQuality} />
      <FirstRenderedFrame onReady={onReady} />
    </>
  );
}

function CameraRig({
  children,
  motionRef,
}: {
  children: React.ReactNode;
  motionRef: MutableRefObject<HeroMotionState>;
}) {
  const { camera } = useThree();

  useFrame((_state, delta) => {
    const motion = motionRef.current;
    const targetX = motion.cameraX + motion.pointerX * 0.34;
    const targetY = motion.pointerY * 0.22 - motion.scrollProgress * 0.1;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 4.7, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 4.7, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, motion.cameraZ, 4.25, delta);
    camera.rotation.y = THREE.MathUtils.damp(camera.rotation.y, motion.rotationY, 4.2, delta);
    camera.rotation.z = THREE.MathUtils.damp(camera.rotation.z, motion.rotationZ, 4.2, delta);
  });

  return <group>{children}</group>;
}

function ProofImage({
  fontFamily,
  isMobile,
  proof,
  texture,
}: {
  fontFamily: string;
  isMobile: boolean;
  proof: ProofPlane;
  texture: THREE.Texture;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const placardMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const leaderMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const wasFocused = useRef(false);
  const position = isMobile ? proof.mobilePosition : proof.position;
  const size = isMobile ? proof.mobileSize : proof.size;
  const annotationOffset = isMobile
    ? proof.mobileAnnotationOffset
    : proof.annotationOffset;
  const placardTexture = useMemo(
    () =>
      proof.result && proof.client
        ? createPlacardTexture(proof.client, proof.result, fontFamily)
        : null,
    [fontFamily, proof.client, proof.result],
  );
  const leaderGeometry = useMemo(() => {
    if (!annotationOffset) return null;
    const directionX = Math.sign(annotationOffset[0]) || 1;
    const directionY = Math.sign(annotationOffset[1]) || -1;
    const labelWidth = isMobile ? 1.72 : 2.18;
    const anchor = new THREE.Vector3(
      directionX * size[0] * 0.34,
      directionY * size[1] * 0.47,
      0.045,
    );
    const elbow = anchor.clone().add(
      new THREE.Vector3(directionX * 0.25, directionY * 0.16, 0.035),
    );
    const end = new THREE.Vector3(
      annotationOffset[0] - directionX * labelWidth * 0.48,
      annotationOffset[1],
      annotationOffset[2] - 0.01,
    );
    return new THREE.BufferGeometry().setFromPoints([anchor, elbow, elbow, end]);
  }, [annotationOffset, isMobile, size]);
  const projected = useMemo(() => new THREE.Vector3(), []);
  const worldPosition = useMemo(() => new THREE.Vector3(), []);

  useEffect(
    () => () => {
      placardTexture?.dispose();
      leaderGeometry?.dispose();
    },
    [leaderGeometry, placardTexture],
  );

  useFrame(({ camera }) => {
    const group = groupRef.current;
    const placardMaterial = placardMaterialRef.current;
    const leaderMaterial = leaderMaterialRef.current;
    if (!group || !placardMaterial || !leaderMaterial) return;

    group.getWorldPosition(worldPosition);
    projected.copy(worldPosition).project(camera);
    const viewDistance = worldPosition.distanceTo(camera.position);
    const focused =
      viewDistance > 5.4 &&
      viewDistance < (isMobile ? 9.35 : 9.55) &&
      Math.abs(projected.x) < 0.9 &&
      Math.abs(projected.y) < 0.88;

    if (focused === wasFocused.current) return;
    wasFocused.current = focused;
    gsap.to([placardMaterial, leaderMaterial], {
      opacity: focused ? 1 : 0,
      duration: focused ? 0.52 : 0.36,
      ease: focused ? "power2.out" : "power2.in",
      overwrite: "auto",
    });
  });

  useEffect(
    () => () => {
      if (placardMaterialRef.current) gsap.killTweensOf(placardMaterialRef.current);
      if (leaderMaterialRef.current) gsap.killTweensOf(leaderMaterialRef.current);
    },
    [],
  );

  return (
    <group ref={groupRef} position={position} rotation={proof.rotation}>
      <mesh position={[0, 0, -0.018]} scale={[1.025, 1.04, 1]}>
        <planeGeometry args={size} />
        <meshBasicMaterial color="#a7bcd2" opacity={0.23} transparent />
      </mesh>
      <mesh>
        <planeGeometry args={size} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {placardTexture && annotationOffset && leaderGeometry ? (
        <>
          <lineSegments geometry={leaderGeometry}>
            <lineBasicMaterial
              ref={leaderMaterialRef}
              color="#cedb58"
              depthWrite={false}
              opacity={0}
              transparent
            />
          </lineSegments>
          <mesh position={annotationOffset} renderOrder={4}>
            <planeGeometry args={[isMobile ? 1.72 : 2.18, isMobile ? 0.32 : 0.4]} />
            <meshBasicMaterial
              ref={placardMaterialRef}
              alphaTest={0.02}
              depthWrite={false}
              map={placardTexture}
              opacity={0}
              toneMapped={false}
              transparent
            />
          </mesh>
        </>
      ) : null}
    </group>
  );
}

function DepthOfField({
  isMobile,
  lowQuality,
}: {
  isMobile: boolean;
  lowQuality: boolean;
}) {
  const { camera, gl, scene, size } = useThree();
  const passes = useMemo(() => {
    const target = new THREE.WebGLRenderTarget(1, 1, {
      depthBuffer: true,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      stencilBuffer: false,
      type: THREE.UnsignedByteType,
    });
    const composer = new EffectComposer(gl, target);
    const renderPass = new RenderPass(scene, camera);
    const bokehPass = lowQuality
      ? null
      : new BokehPass(scene, camera, {
          focus: 7.55,
          aperture: 0.00215,
          maxblur: 0.0068,
        });
    const quietPass = new ShaderPass(QUIET_ZONE_SHADER);
    const outputPass = new OutputPass();
    quietPass.uniforms.uMobile.value = isMobile ? 1 : 0;

    composer.addPass(renderPass);
    if (bokehPass) composer.addPass(bokehPass);
    composer.addPass(quietPass);
    composer.addPass(outputPass);
    return { bokehPass, composer, outputPass, quietPass, renderPass };
  }, [camera, gl, isMobile, lowQuality, scene]);

  useEffect(() => {
    passes.composer.setPixelRatio(
      Math.min(gl.getPixelRatio(), lowQuality ? 1 : 1.25),
    );
    passes.composer.setSize(size.width, size.height);
  }, [gl, lowQuality, passes, size.height, size.width]);

  useEffect(
    () => () => {
      passes.renderPass.dispose();
      passes.bokehPass?.dispose();
      passes.quietPass.dispose();
      passes.outputPass.dispose();
      passes.composer.dispose();
    },
    [passes],
  );

  useFrame(() => {
    passes.composer.render();
  }, 1);

  return null;
}

function FirstRenderedFrame({ onReady }: { onReady: () => void }) {
  const called = useRef(false);
  useFrame(() => {
    if (called.current) return;
    called.current = true;
    requestAnimationFrame(onReady);
  }, 2);
  return null;
}

/**
 * A small, screen-space background texture keeps the branded field inside the
 * WebGL render while costing only one texture lookup. The same color stops are
 * mirrored in Hero.module.css for the loading and static modes.
 */
function createHeroBackgroundTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);

  const { width, height } = canvas;
  const base = context.createLinearGradient(0, 0, width, 0);
  base.addColorStop(0, NIGHT);
  base.addColorStop(0.28, NIGHT);
  base.addColorStop(0.61, DG_BLUE);
  base.addColorStop(0.82, DG_SKY);
  base.addColorStop(1, SKY_CYAN);
  context.fillStyle = base;
  context.fillRect(0, 0, width, height);

  const daylight = context.createRadialGradient(
    width * 0.86,
    height * 0.18,
    0,
    width * 0.86,
    height * 0.18,
    width * 0.7,
  );
  daylight.addColorStop(0, "rgba(140, 207, 226, 0.78)");
  daylight.addColorStop(0.35, "rgba(74, 137, 200, 0.38)");
  daylight.addColorStop(1, "rgba(74, 137, 200, 0)");
  context.fillStyle = daylight;
  context.fillRect(0, 0, width, height);

  // Reserve a quiet navy field for the DOM headline without flattening the
  // brighter right-hand proof wall.
  const quietZone = context.createLinearGradient(0, 0, width * 0.72, 0);
  quietZone.addColorStop(0, "rgba(14, 26, 40, 0.94)");
  quietZone.addColorStop(0.4, "rgba(14, 26, 40, 0.76)");
  quietZone.addColorStop(0.72, "rgba(14, 26, 40, 0.28)");
  quietZone.addColorStop(1, "rgba(14, 26, 40, 0)");
  context.fillStyle = quietZone;
  context.fillRect(0, 0, width, height);

  const lowerDepth = context.createLinearGradient(0, 0, 0, height);
  lowerDepth.addColorStop(0.48, "rgba(14, 26, 40, 0)");
  lowerDepth.addColorStop(1, "rgba(14, 26, 40, 0.34)");
  context.fillStyle = lowerDepth;
  context.fillRect(0, 0, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

function createPlacardTexture(client: string, result: string, fontFamily: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 94;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);

  context.fillStyle = "rgba(14, 26, 40, 0.94)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "rgba(167, 188, 210, 0.72)";
  context.lineWidth = 2;
  context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
  context.fillStyle = "#cedb58";
  context.fillRect(21, 21, 5, 5);

  const mono = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  context.fillStyle = "#a7bcd2";
  context.font = `600 13px ${mono}`;
  context.textBaseline = "middle";
  context.fillText(client.toUpperCase(), 36, 25);
  context.fillStyle = "#ffffff";
  context.font = `700 22px ${fontFamily}`;
  context.fillText(result, 21, 62);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

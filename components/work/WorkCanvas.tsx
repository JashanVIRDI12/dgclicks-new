"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  type MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { caseStudies } from "@/lib/data";
import { gsap } from "@/lib/gsap";
import {
  CHROMATIC_SHADER,
  FILM_GRAIN_SHADER,
  IMAGE_FRAGMENT_SHADER,
  IMAGE_VERTEX_SHADER,
  PARTICLE_FRAGMENT_SHADER,
  PARTICLE_VERTEX_SHADER,
} from "./shaders";

export type WorkMotionState = {
  progress: number;
  pointerX: number;
  pointerY: number;
};

export type WorkCanvasProps = {
  activeIndex: number;
  isMobile: boolean;
  isVisible: boolean;
  motionRef: MutableRefObject<WorkMotionState>;
  onLoadProgress: (progress: number) => void;
  onReady: () => void;
  onError: (message: string) => void;
};

type LoadedTextures = {
  textures: THREE.Texture[];
  fontFamily: string;
};

const NIGHT = "#0e1a28";
const MINT = "#cedb58";
const FOG = "#a7bcd2";

export default function WorkCanvas({
  activeIndex,
  isMobile,
  isVisible,
  motionRef,
  onLoadProgress,
  onReady,
  onError,
}: WorkCanvasProps) {
  const [loaded, setLoaded] = useState<LoadedTextures | null>(null);
  // Pick the network tier once. Layout can still adapt across the breakpoint,
  // but a device rotation should not dispose and reload all four GPU textures.
  const mobileTextureTier = useRef(isMobile).current;

  const sources = useMemo(
    () =>
      caseStudies.map((study) =>
        mobileTextureTier ? study.webglImage.mobileSrc : study.webglImage.src,
      ),
    [mobileTextureTier],
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
          texture.generateMipmaps = false;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.needsUpdate = true;
        });

        const fontFamily = getComputedStyle(document.body).fontFamily;
        setLoaded({ textures, fontFamily });
        onLoadProgress(1);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const message =
          error instanceof Error ? error.message : "Case-study textures failed to load.";
        onError(message);
      });

    return () => {
      cancelled = true;
      ownedTextures.forEach((texture) => texture.dispose());
    };
    // sourceKey deliberately represents the selected responsive texture set.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceKey, onError, onLoadProgress]);

  if (!loaded) return null;

  return (
    <div aria-hidden="true" className="absolute inset-0">
      <Canvas
        dpr={isMobile ? [1, 1.25] : [1, 1.5]}
        frameloop={isVisible ? "always" : "demand"}
        camera={{ position: [0, 0, 5], fov: 40, near: 0.1, far: 30 }}
        gl={{
          alpha: false,
          antialias: false,
          depth: true,
          stencil: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(NIGHT, 1);
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <Scene
          activeIndex={activeIndex}
          fontFamily={loaded.fontFamily}
          isMobile={isMobile}
          motionRef={motionRef}
          onReady={onReady}
          textures={loaded.textures}
        />
      </Canvas>
    </div>
  );
}

type SceneProps = Pick<
  WorkCanvasProps,
  "activeIndex" | "isMobile" | "motionRef" | "onReady"
> & {
  textures: THREE.Texture[];
  fontFamily: string;
};

function Scene({
  activeIndex,
  fontFamily,
  isMobile,
  motionRef,
  onReady,
  textures,
}: SceneProps) {
  const noiseTexture = useMemo(() => createNoiseTexture(256), []);

  useEffect(() => () => noiseTexture.dispose(), [noiseTexture]);

  return (
    <>
      <color attach="background" args={[NIGHT]} />
      <CaseRig
        activeIndex={activeIndex}
        fontFamily={fontFamily}
        isMobile={isMobile}
        motionRef={motionRef}
        noiseTexture={noiseTexture}
        textures={textures}
      />
      <PostProcessing isMobile={isMobile} />
      <FirstRenderedFrame onReady={onReady} />
    </>
  );
}

type ImageUniforms = {
  uTextureFrom: { value: THREE.Texture };
  uTextureTo: { value: THREE.Texture };
  uNoiseTexture: { value: THREE.DataTexture };
  uPlaneSize: { value: THREE.Vector2 };
  uTextureFromSize: { value: THREE.Vector2 };
  uTextureToSize: { value: THREE.Vector2 };
  uTextureFromFocal: { value: THREE.Vector2 };
  uTextureToFocal: { value: THREE.Vector2 };
  uProgress: { value: number };
  uDisplacement: { value: number };
  uNoiseScale: { value: number };
  uEdgeSoftness: { value: number };
  uLeftShade: { value: number };
  uNavyTint: { value: number };
};

type CaseRigProps = Pick<WorkCanvasProps, "activeIndex" | "isMobile" | "motionRef"> & {
  textures: THREE.Texture[];
  noiseTexture: THREE.DataTexture;
  fontFamily: string;
};

function CaseRig({
  activeIndex,
  fontFamily,
  isMobile,
  motionRef,
  noiseTexture,
  textures,
}: CaseRigProps) {
  const rigRef = useRef<THREE.Group>(null);
  const materialRefs = useRef<Array<THREE.ShaderMaterial | null>>([]);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const runTransitionRef = useRef<(nextIndex: number) => void>(() => undefined);
  const transitionRef = useRef({
    current: 0,
    running: false,
    pending: null as number | null,
  });
  const [visibleIndex, setVisibleIndex] = useState(0);
  const { viewport } = useThree();

  const planeWidth = viewport.width * 1.12;
  const planeHeight = viewport.height * 1.12;

  const uniformSets = useMemo<ImageUniforms[]>(
    () =>
      textures.map((texture, index) => {
        const study = caseStudies[index];
        return {
          uTextureFrom: { value: texture },
          uTextureTo: { value: texture },
          uNoiseTexture: { value: noiseTexture },
          uPlaneSize: { value: new THREE.Vector2(1, 1) },
          uTextureFromSize: {
            value: new THREE.Vector2(study.image.width, study.image.height),
          },
          uTextureToSize: {
            value: new THREE.Vector2(study.image.width, study.image.height),
          },
          uTextureFromFocal: { value: toShaderFocal(study.webglImage.focal) },
          uTextureToFocal: { value: toShaderFocal(study.webglImage.focal) },
          uProgress: { value: 1 },
          uDisplacement: { value: isMobile ? 0.034 : 0.042 },
          uNoiseScale: { value: isMobile ? 3.8 : 3.25 },
          uEdgeSoftness: { value: 0.045 },
          uLeftShade: { value: isMobile ? 0.68 : 0.58 },
          uNavyTint: { value: 0.11 },
        };
      }),
    [isMobile, noiseTexture, textures],
  );

  useEffect(() => {
    uniformSets.forEach((uniforms) => {
      uniforms.uPlaneSize.value.set(planeWidth, planeHeight);
      uniforms.uLeftShade.value = isMobile ? 0.68 : 0.58;
    });
  }, [isMobile, planeHeight, planeWidth, uniformSets]);

  const runTransition = useCallback(
    (nextIndex: number) => {
      const state = transitionRef.current;
      const fromIndex = state.current;
      if (nextIndex === fromIndex) {
        state.running = false;
        return;
      }

      const uniforms = uniformSets[nextIndex];
      const fromStudy = caseStudies[fromIndex];
      const toStudy = caseStudies[nextIndex];

      uniforms.uTextureFrom.value = textures[fromIndex];
      uniforms.uTextureTo.value = textures[nextIndex];
      uniforms.uTextureFromSize.value.set(fromStudy.image.width, fromStudy.image.height);
      uniforms.uTextureToSize.value.set(toStudy.image.width, toStudy.image.height);
      uniforms.uTextureFromFocal.value.copy(toShaderFocal(fromStudy.webglImage.focal));
      uniforms.uTextureToFocal.value.copy(toShaderFocal(toStudy.webglImage.focal));
      uniforms.uProgress.value = 0;

      state.running = true;
      setVisibleIndex(nextIndex);
      tweenRef.current?.kill();
      tweenRef.current = gsap.to(uniforms.uProgress, {
        value: 1,
        duration: isMobile ? 1.05 : 1.22,
        ease: "power3.inOut",
        overwrite: "auto",
        onComplete: () => {
          state.current = nextIndex;
          state.running = false;
          const pending = state.pending;
          state.pending = null;
          if (pending !== null && pending !== nextIndex) {
            runTransitionRef.current(pending);
          }
        },
      });
    },
    [isMobile, textures, uniformSets],
  );

  runTransitionRef.current = runTransition;

  useEffect(() => {
    const state = transitionRef.current;
    if (state.running) {
      state.pending = activeIndex;
      return;
    }
    if (state.current !== activeIndex) runTransition(activeIndex);
  }, [activeIndex, runTransition]);

  useEffect(
    () => () => {
      tweenRef.current?.kill();
      transitionRef.current.running = false;
      transitionRef.current.pending = null;
    },
    [],
  );

  useFrame((_state, delta) => {
    const rig = rigRef.current;
    if (!rig) return;

    const maxY = THREE.MathUtils.degToRad(6);
    const maxX = THREE.MathUtils.degToRad(4.75);
    const targetY = motionRef.current.pointerX * maxY;
    const targetX = -motionRef.current.pointerY * maxX;

    rig.rotation.x = THREE.MathUtils.damp(rig.rotation.x, targetX, 5.2, delta);
    rig.rotation.y = THREE.MathUtils.damp(rig.rotation.y, targetY, 5.2, delta);

    const localTravel = motionRef.current.progress * (caseStudies.length - 1) - activeIndex;
    rig.position.x = THREE.MathUtils.damp(rig.position.x, localTravel * -0.055, 6, delta);
  });

  return (
    <group ref={rigRef}>
      {caseStudies.map((study, index) => (
        <mesh
          key={study.client}
          visible={index === visibleIndex}
          scale={[planeWidth, planeHeight, 1]}
        >
          <planeGeometry args={[1, 1, 1, 1]} />
          <shaderMaterial
            ref={(material) => {
              materialRefs.current[index] = material;
            }}
            fragmentShader={IMAGE_FRAGMENT_SHADER}
            uniforms={uniformSets[index]}
            vertexShader={IMAGE_VERTEX_SHADER}
            depthWrite
            toneMapped={false}
          />
        </mesh>
      ))}

      <StatBadge
        activeIndex={activeIndex}
        fontFamily={fontFamily}
        isMobile={isMobile}
        viewport={viewport}
      />
    </group>
  );
}

type StatBadgeProps = {
  activeIndex: number;
  fontFamily: string;
  isMobile: boolean;
  viewport: { width: number; height: number; aspect: number };
};

function StatBadge({ activeIndex, fontFamily, isMobile, viewport }: StatBadgeProps) {
  const badgeWidth = isMobile
    ? Math.min(viewport.width * 0.82, 3.7)
    : Math.min(viewport.width * 0.31, 3.8);
  const badgeHeight = badgeWidth * (isMobile ? 0.34 : 0.31);
  const badgeX = isMobile ? 0 : viewport.width * 0.28;
  const badgeY = isMobile ? -viewport.height * 0.25 : -viewport.height * 0.25;

  const labelTextures = useMemo(
    () =>
      caseStudies.map((study) =>
        createLabelTexture(study.metrics[0].label, fontFamily),
      ),
    [fontFamily],
  );

  useEffect(
    () => () => {
      labelTextures.forEach((texture) => texture.dispose());
    },
    [labelTextures],
  );

  return (
    <group position={[badgeX, badgeY, 0.24]}>
      <mesh renderOrder={2}>
        <planeGeometry args={[badgeWidth, badgeHeight]} />
        <meshBasicMaterial
          color="#09131f"
          opacity={0.9}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, badgeHeight * 0.49, 0.015]} renderOrder={3}>
        <planeGeometry args={[badgeWidth, Math.max(0.012, badgeHeight * 0.025)]} />
        <meshBasicMaterial color={MINT} depthWrite={false} toneMapped={false} />
      </mesh>

      {caseStudies.map((study, index) => (
        <ParticleStat
          key={study.client}
          active={index === activeIndex}
          badgeWidth={badgeWidth}
          count={isMobile ? 520 : 900}
          fontFamily={fontFamily}
          index={index}
          value={study.metrics[0].value}
        />
      ))}

      <mesh position={[0, -badgeHeight * 0.31, 0.045]} renderOrder={4}>
        <planeGeometry args={[badgeWidth * 0.82, badgeHeight * 0.2]} />
        <meshBasicMaterial
          alphaTest={0.01}
          depthWrite={false}
          map={labelTextures[activeIndex]}
          toneMapped={false}
          transparent
        />
      </mesh>
    </group>
  );
}

type ParticleStatProps = {
  active: boolean;
  badgeWidth: number;
  count: number;
  fontFamily: string;
  index: number;
  value: string;
};

function ParticleStat({
  active,
  badgeWidth,
  count,
  fontFamily,
  index,
  value,
}: ParticleStatProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(
    () => createParticleGeometry(value, count, fontFamily, index + 1),
    [count, fontFamily, index, value],
  );
  const uniforms = useMemo(
    () => ({
      uMorph: { value: index === 0 ? 1 : 0 },
      uPointSize: { value: count < 700 ? 2.35 : 2.7 },
      uTime: { value: 0 },
      uAlpha: { value: index === 0 ? 1 : 0 },
    }),
    [count, index],
  );

  useEffect(() => {
    const morphTween = gsap.to(uniforms.uMorph, {
      value: active ? 1 : 0,
      duration: active ? 1.05 : 0.68,
      delay: active ? 0.08 : 0,
      ease: active ? "power3.out" : "power2.in",
      overwrite: "auto",
    });
    const alphaTween = gsap.to(uniforms.uAlpha, {
      value: active ? 1 : 0,
      duration: active ? 0.34 : 0.55,
      delay: active ? 0 : 0.08,
      ease: "power2.out",
      overwrite: "auto",
    });
    return () => {
      morphTween.kill();
      alphaTween.kill();
    };
  }, [active, uniforms]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <points
      frustumCulled={false}
      position={[0, 0.055 * badgeWidth, 0.06]}
      renderOrder={5}
      scale={[badgeWidth * 0.78, badgeWidth * 0.78, 1]}
    >
      <primitive attach="geometry" object={geometry} />
      <shaderMaterial
        ref={materialRef}
        blending={THREE.AdditiveBlending}
        depthTest
        depthWrite={false}
        fragmentShader={PARTICLE_FRAGMENT_SHADER}
        transparent
        uniforms={uniforms}
        vertexShader={PARTICLE_VERTEX_SHADER}
      />
    </points>
  );
}

function PostProcessing({ isMobile }: { isMobile: boolean }) {
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
    const chromaticPass = new ShaderPass(CHROMATIC_SHADER);
    const grainPass = new ShaderPass(FILM_GRAIN_SHADER);
    const outputPass = new OutputPass();

    chromaticPass.uniforms.uAmount.value = isMobile ? 0.00045 : 0.00065;
    grainPass.uniforms.uIntensity.value = isMobile ? 0.013 : 0.018;

    composer.addPass(renderPass);
    if (!isMobile) composer.addPass(chromaticPass);
    composer.addPass(grainPass);
    composer.addPass(outputPass);

    return { composer, renderPass, chromaticPass, grainPass, outputPass };
  }, [camera, gl, isMobile, scene]);

  useEffect(() => {
    passes.composer.setPixelRatio(
      Math.min(gl.getPixelRatio(), isMobile ? 1.25 : 1.5),
    );
    passes.composer.setSize(size.width, size.height);
  }, [gl, isMobile, passes, size.height, size.width]);

  useEffect(
    () => () => {
      passes.renderPass.dispose();
      passes.chromaticPass.dispose();
      passes.grainPass.dispose();
      passes.outputPass.dispose();
      passes.composer.dispose();
    },
    [passes],
  );

  useFrame(({ clock }) => {
    passes.grainPass.uniforms.uTime.value = clock.elapsedTime;
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

function createNoiseTexture(size: number) {
  const data = new Uint8Array(size * size * 4);
  const random = seededRandom(0x41c6ce57);

  for (let index = 0; index < size * size; index += 1) {
    const value = Math.floor(random() * 256);
    const offset = index * 4;
    data[offset] = value;
    data[offset + 1] = value;
    data[offset + 2] = value;
    data[offset + 3] = 255;
  }

  const texture = new THREE.DataTexture(
    data,
    size,
    size,
    THREE.RGBAFormat,
    THREE.UnsignedByteType,
  );
  texture.colorSpace = THREE.NoColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function createParticleGeometry(
  value: string,
  count: number,
  fontFamily: string,
  seed: number,
) {
  const canvas = document.createElement("canvas");
  canvas.width = 720;
  canvas.height = 200;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return new THREE.BufferGeometry();

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#fff";
  context.textAlign = "center";
  context.textBaseline = "middle";

  let fontSize = 126;
  do {
    context.font = `800 ${fontSize}px ${fontFamily}`;
    if (context.measureText(value).width <= canvas.width - 48) break;
    fontSize -= 4;
  } while (fontSize > 58);

  context.fillText(value, canvas.width / 2, canvas.height / 2 + 4);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const candidates: Array<[number, number]> = [];
  const step = count < 700 ? 4 : 3;

  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      if (pixels[(y * canvas.width + x) * 4 + 3] > 100) candidates.push([x, y]);
    }
  }

  if (candidates.length === 0) candidates.push([canvas.width / 2, canvas.height / 2]);

  const random = seededRandom(seed * 0x9e3779b1);
  for (let index = candidates.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [candidates[index], candidates[swapIndex]] = [candidates[swapIndex], candidates[index]];
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  candidates.forEach(([x, y]) => {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  });

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const width = Math.max(maxX - minX, 1);
  const target = new Float32Array(count * 3);
  const scatter = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const candidate = candidates[index % candidates.length];
    const offset = index * 3;
    target[offset] = (candidate[0] - centerX) / width;
    target[offset + 1] = -(candidate[1] - centerY) / width;
    target[offset + 2] = (random() - 0.5) * 0.008;

    scatter[offset] = (random() - 0.5) * 1.35;
    scatter[offset + 1] = (random() - 0.5) * 0.48;
    scatter[offset + 2] = (random() - 0.5) * 0.2;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(target.slice(), 3));
  geometry.setAttribute("aTarget", new THREE.BufferAttribute(target, 3));
  geometry.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
  geometry.computeBoundingSphere();
  return geometry;
}

function createLabelTexture(label: string, fontFamily: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 384;
  canvas.height = 48;
  const context = canvas.getContext("2d");

  if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = FOG;
    context.font = `600 14px ${fontFamily}`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(label.toUpperCase(), canvas.width / 2, canvas.height / 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function toShaderFocal(focal: [number, number]) {
  return new THREE.Vector2((focal[0] - 0.5) * 2, (focal[1] - 0.5) * 2);
}

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

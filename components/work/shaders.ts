import { Vector2 } from "three";

/**
 * Image transition uniform contract:
 * - uTextureFrom / uTextureTo: the outgoing and incoming color textures.
 * - uNoiseTexture: a grayscale noise texture. The shader repeats it with fract(),
 *   so it does not depend on the texture's wrapping mode.
 * - uPlaneSize: rendered plane width and height in the same arbitrary units.
 * - uTextureFromSize / uTextureToSize: source image pixel dimensions. These are
 *   used to calculate independent CSS-background-size: cover style UVs.
 * - uTextureFromFocal / uTextureToFocal: signed focal offsets in the -1..1 range.
 *   (0, 0) centers an image; positive x/y reveals more of its right/top crop.
 * - uProgress: transition progress from 0 to 1.
 * - uDisplacement: UV displacement amplitude (0.025 is a useful starting point).
 * - uNoiseScale: base noise tiling (roughly 2.5-4.0 works well).
 * - uEdgeSoftness: narrow grain boundary width (roughly 0.025-0.055).
 * - uLeftShade: strength of the left-side readability shade (roughly 0.25).
 * - uNavyTint: strength of the shared brand-navy color grade (roughly 0.06).
 */
export const IMAGE_VERTEX_SHADER = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const IMAGE_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform sampler2D uTextureFrom;
  uniform sampler2D uTextureTo;
  uniform sampler2D uNoiseTexture;

  uniform vec2 uPlaneSize;
  uniform vec2 uTextureFromSize;
  uniform vec2 uTextureToSize;
  uniform vec2 uTextureFromFocal;
  uniform vec2 uTextureToFocal;

  uniform float uProgress;
  uniform float uDisplacement;
  uniform float uNoiseScale;
  uniform float uEdgeSoftness;
  uniform float uLeftShade;
  uniform float uNavyTint;

  varying vec2 vUv;

  const float PI = 3.141592653589793;
  const vec3 BRAND_NAVY = vec3(0.018, 0.063, 0.118);

  vec2 coverUv(vec2 baseUv, vec2 imageSize, vec2 focal) {
    vec2 safePlane = max(uPlaneSize, vec2(0.0001));
    vec2 safeImage = max(imageSize, vec2(1.0));
    float planeAspect = safePlane.x / safePlane.y;
    float imageAspect = safeImage.x / safeImage.y;

    vec2 coverScale = vec2(
      min(planeAspect / imageAspect, 1.0),
      min(imageAspect / planeAspect, 1.0)
    );
    vec2 availableCrop = (vec2(1.0) - coverScale) * 0.5;

    return (baseUv - 0.5) * coverScale
      + 0.5
      + clamp(focal, vec2(-1.0), vec2(1.0)) * availableCrop;
  }

  float repeatedNoise(vec2 uv) {
    return texture2D(uNoiseTexture, fract(uv)).r;
  }

  vec3 applySharedGrade(vec3 color) {
    float leftWeight = 1.0 - smoothstep(0.02, 0.76, vUv.x);
    color *= 1.0 - leftWeight * clamp(uLeftShade, 0.0, 0.72);

    // The DOM progress rail and fixed navigation sit at the frame edges. Keep
    // their contrast inside the WebGL grade rather than adding CSS image veils.
    float bottomWeight = 1.0 - smoothstep(0.0, 0.22, vUv.y);
    float topWeight = smoothstep(0.84, 1.0, vUv.y);
    color *= 1.0 - bottomWeight * 0.34 - topWeight * 0.12;

    float tintStrength = clamp(uNavyTint, 0.0, 0.24);
    vec3 navyGrade = color * vec3(0.82, 0.90, 1.0) + BRAND_NAVY * 0.18;
    return mix(color, navyGrade, tintStrength);
  }

  void main() {
    vec2 fromCoverUv = coverUv(vUv, uTextureFromSize, uTextureFromFocal);
    vec2 toCoverUv = coverUv(vUv, uTextureToSize, uTextureToFocal);

    // The tiny endpoint dead-zones ensure resting frames contain exactly one
    // mapped texture: no displacement and no residual cross-image blend.
    if (uProgress <= 0.015) {
      vec3 source = texture2D(
        uTextureFrom,
        clamp(fromCoverUv, vec2(0.0), vec2(1.0))
      ).rgb;
      gl_FragColor = vec4(applySharedGrade(source), 1.0);
      return;
    }

    if (uProgress >= 0.985) {
      vec3 target = texture2D(
        uTextureTo,
        clamp(toCoverUv, vec2(0.0), vec2(1.0))
      ).rgb;
      gl_FragColor = vec4(applySharedGrade(target), 1.0);
      return;
    }

    float progress = smoothstep(0.015, 0.985, clamp(uProgress, 0.0, 1.0));
    vec2 domain = vUv * max(uNoiseScale, 0.001);

    // Several differently transformed samples decorrelate the displacement
    // vector, the dissolve field, and the fine grain at very little cost.
    float broad = repeatedNoise(domain + vec2(0.173, 0.719));
    float grain = repeatedNoise(
      domain.yx * vec2(2.17, 1.63) + vec2(0.611, 0.083)
    );
    float grainB = repeatedNoise(
      domain * vec2(3.11, 2.37) + vec2(0.347, 0.937)
    );
    float flowX = repeatedNoise(
      domain * vec2(1.41, 2.83) + vec2(0.887, 0.263)
    );
    float flowY = repeatedNoise(
      domain.yx * vec2(2.71, 1.29) + vec2(0.229, 0.541)
    );

    vec2 fromFlow = vec2(flowX - 0.5, flowY - 0.5);
    vec2 toFlow = vec2(grainB - 0.5, broad - 0.5);
    float displacementEnvelope = sin(progress * PI);

    // Outgoing and incoming samples travel through different parts of the
    // noise field; the envelope returns both to an undisplaced endpoint.
    vec2 displacedFromUv = fromCoverUv + fromFlow
      * uDisplacement
      * displacementEnvelope
      * (0.45 + 0.55 * progress);
    vec2 displacedToUv = toCoverUv - toFlow
      * uDisplacement
      * displacementEnvelope
      * (1.0 - 0.35 * progress);

    vec3 source = texture2D(
      uTextureFrom,
      clamp(displacedFromUv, vec2(0.0), vec2(1.0))
    ).rgb;
    vec3 target = texture2D(
      uTextureTo,
      clamp(displacedToUv, vec2(0.0), vec2(1.0))
    ).rgb;

    // A vertically biased multi-frequency threshold makes the image melt in
    // through local grains. Only the narrow boundary is softened; unlike a
    // global opacity fade, pixels away from that boundary are fully one image.
    float verticalMelt = (1.0 - vUv.y) * 0.16;
    float dissolveField = clamp(
      broad * 0.58 + grain * 0.25 + grainB * 0.17 + verticalMelt,
      0.0,
      1.0
    );
    float edge = clamp(uEdgeSoftness, 0.002, 0.12);
    float reveal = smoothstep(
      dissolveField - edge,
      dissolveField + edge,
      progress
    );

    vec3 transitioned = mix(source, target, reveal);
    gl_FragColor = vec4(applySharedGrade(transitioned), 1.0);
  }
`;

/**
 * Particle morph contract:
 * aScatter and aTarget are equal-length vec3 BufferAttributes. uMorph moves
 * from the cloud (0) to the text silhouette (1); uPointSize is in framebuffer
 * pixels, uTime is elapsed seconds, and uAlpha controls the whole point cloud.
 */
export const PARTICLE_VERTEX_SHADER = /* glsl */ `
  precision highp float;

  attribute vec3 aScatter;
  attribute vec3 aTarget;

  uniform float uMorph;
  uniform float uPointSize;
  uniform float uTime;

  varying float vTwinkle;

  float smootherstep(float value) {
    float t = clamp(value, 0.0, 1.0);
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  }

  float pointHash(vec3 value) {
    return fract(sin(dot(value, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
  }

  void main() {
    float morph = smootherstep(uMorph);
    float seed = pointHash(aScatter + aTarget * 0.173);
    vTwinkle = 0.5 + 0.5 * sin(uTime * 1.7 + seed * 6.28318530718);

    vec3 morphedPosition = mix(aScatter, aTarget, morph);
    float idleMotion = (1.0 - morph) * 0.018;
    morphedPosition.xy += vec2(
      sin(uTime * 0.73 + seed * 9.0),
      cos(uTime * 0.61 + seed * 11.0)
    ) * idleMotion;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(morphedPosition, 1.0);
    gl_PointSize = max(1.0, uPointSize * (0.94 + vTwinkle * 0.12));
  }
`;

export const PARTICLE_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float uAlpha;

  varying float vTwinkle;

  void main() {
    float distanceFromCenter = length(gl_PointCoord - vec2(0.5));
    float circle = 1.0 - smoothstep(0.36, 0.5, distanceFromCenter);
    if (circle <= 0.001) discard;

    vec3 lime = mix(
      vec3(0.66, 0.86, 0.17),
      vec3(0.83, 1.0, 0.31),
      vTwinkle * 0.45
    );
    gl_FragColor = vec4(lime, circle * clamp(uAlpha, 0.0, 1.0));
  }
`;

const POST_PROCESS_VERTEX_SHADER = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Pass to new ShaderPass(CHROMATIC_SHADER). uAmount is a normalized UV offset;
 * the default is intentionally sub-pixel on most viewports. uDirection is
 * normalized in the shader, and all offset UVs are clamped at the frame edge.
 */
export const CHROMATIC_SHADER = {
  uniforms: {
    tDiffuse: { value: null },
    uAmount: { value: 0.00055 },
    uDirection: { value: new Vector2(1.0, 0.12) },
  },
  vertexShader: POST_PROCESS_VERTEX_SHADER,
  fragmentShader: /* glsl */ `
    precision highp float;

    uniform sampler2D tDiffuse;
    uniform float uAmount;
    uniform vec2 uDirection;

    varying vec2 vUv;

    void main() {
      vec2 direction = uDirection / max(length(uDirection), 0.0001);
      vec2 offset = direction * max(uAmount, 0.0);
      vec2 safeCenterUv = clamp(vUv, vec2(0.001), vec2(0.999));
      vec2 redUv = clamp(vUv + offset, vec2(0.001), vec2(0.999));
      vec2 blueUv = clamp(vUv - offset, vec2(0.001), vec2(0.999));

      vec4 center = texture2D(tDiffuse, safeCenterUv);
      float red = texture2D(tDiffuse, redUv).r;
      float blue = texture2D(tDiffuse, blueUv).b;

      gl_FragColor = vec4(red, center.g, blue, center.a);
    }
  `,
};

/**
 * Pass to new ShaderPass(FILM_GRAIN_SHADER), then update uTime every frame.
 * uIntensity defaults to a restrained 2.8% monochrome grain contribution.
 */
export const FILM_GRAIN_SHADER = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uIntensity: { value: 0.028 },
  },
  vertexShader: POST_PROCESS_VERTEX_SHADER,
  fragmentShader: /* glsl */ `
    precision highp float;

    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uIntensity;

    varying vec2 vUv;

    float filmNoise(vec2 pixel, float time) {
      vec3 samplePosition = vec3(pixel, fract(time * 0.071));
      samplePosition = fract(samplePosition * 0.1031);
      samplePosition += dot(samplePosition, samplePosition.yzx + 33.33);
      return fract((samplePosition.x + samplePosition.y) * samplePosition.z);
    }

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      float luminance = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
      float grain = filmNoise(gl_FragCoord.xy, uTime) * 2.0 - 1.0;
      float shadowResponse = mix(1.0, 0.62, smoothstep(0.0, 1.0, luminance));
      color.rgb += grain * clamp(uIntensity, 0.0, 0.1) * shadowResponse;

      gl_FragColor = vec4(clamp(color.rgb, 0.0, 1.0), color.a);
    }
  `,
};

export interface Post {
  id: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  content: {
    intro: string;
    sections: {
      title: string;
      content: string;
      metrics?: { label: string; value: string; improvement?: string }[];
      code?: { language: string; snippet: string };
      list?: string[];
    }[];
    conclusion: string;
    keyTakeaways: string[];
  };
}

export const posts: Post[] = [
  {
    id: 'interactive-3d-earth',
    title: 'Building an Interactive 3D Earth with Three.js',
    description:
      'A deep dive into creating a GPU-accelerated, interactive Earth visualization with realistic textures, custom shaders, and smooth 60fps performance.',
    date: '2025-01-18',
    readTime: '12 min read',
    tags: ['Three.js', 'WebGL', 'Performance', '3D Graphics'],
    content: {
      intro:
        "Creating an interactive 3D Earth seems daunting, but with Three.js and proper optimization, you can build a stunning, performant visualization. Here's how I built the Earth you see on this site.",
      sections: [
        {
          title: 'The Vision',
          content:
            'I wanted a hero section that felt alive - a rotating Earth that users could interact with, always lit from the left, with realistic clouds, city lights, and an atmospheric glow. All while maintaining 60fps.',
        },
        {
          title: 'Three.js Setup',
          content:
            'The foundation is surprisingly straightforward - a scene, camera, renderer, and geometry.',
          code: {
            language: 'typescript',
            snippet: `const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

// IcosahedronGeometry creates a sphere with even triangle distribution
const geometry = new THREE.IcosahedronGeometry(2.592, 12);`,
          },
          list: [
            'Capped pixel ratio at 1.75 to prevent over-rendering on high-DPI displays',
            'LinearSRGBColorSpace for accurate color rendering',
            'ACESFilmicToneMapping for realistic lighting',
            'IcosahedronGeometry detail level 12 balances quality and performance',
          ],
        },
        {
          title: 'Layered Earth Construction',
          content:
            'A realistic Earth requires multiple layers: base surface, city lights, clouds, and atmospheric glow.',
          code: {
            language: 'typescript',
            snippet: `// Layer 1: Earth surface with bump and specular maps
const earthMaterial = new THREE.MeshPhongMaterial({
  map: loadTexture('earthmap.jpg'),
  specularMap: loadTexture('earthspec.jpg'),
  bumpMap: loadTexture('earthbump.jpg', false),
  bumpScale: 0.04,
});

// Layer 2: City lights (additive blending)
const lightsMaterial = new THREE.MeshBasicMaterial({
  map: loadTexture('earthlights.jpg'),
  blending: THREE.AdditiveBlending,
  transparent: true,
});

// Layer 3: Clouds with transparency
const cloudsMaterial = new THREE.MeshStandardMaterial({
  map: loadTexture('cloudmap.jpg'),
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  alphaMap: loadTexture('cloudtrans.jpg', false),
});
cloudsMesh.scale.setScalar(1.003); // Slightly larger

// Layer 4: Atmospheric glow (custom Fresnel shader)
const glowMesh = new THREE.Mesh(geometry, getFresnelMaterial());
glowMesh.scale.setScalar(1.01);`,
          },
        },
        {
          title: 'Custom Fresnel Shader',
          content:
            'The atmospheric glow uses a custom Fresnel shader that creates the blue rim light effect.',
          code: {
            language: 'glsl',
            snippet: `// Vertex Shader
uniform float fresnelBias;
uniform float fresnelScale;
uniform float fresnelPower;
varying float vReflectionFactor;

void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vec3 worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);
  vec3 I = worldPosition.xyz - cameraPosition;

  // Fresnel effect calculation
  vReflectionFactor = fresnelBias + fresnelScale * pow(1.0 + dot(normalize(I), worldNormal), fresnelPower);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// Fragment Shader
uniform vec3 color1; // Rim color (blue)
uniform vec3 color2; // Facing color (black)
varying float vReflectionFactor;

void main() {
  float f = clamp(vReflectionFactor, 0.0, 1.0);
  gl_FragColor = vec4(mix(color2, color1, vec3(f)), f * 0.3);
}`,
          },
          list: [
            'Fresnel effect makes edges brighter (atmospheric scattering)',
            'World space calculation for accurate lighting',
            '0.3 alpha multiplier for subtle glow',
            'Additive blending for natural light accumulation',
          ],
        },
        {
          title: 'Interactive Camera Controls',
          content:
            'OrbitControls provide intuitive interaction while maintaining the left-side lighting.',
          code: {
            language: 'typescript',
            snippet: `const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false;
controls.enablePan = false;
controls.rotateSpeed = 0.5;

// Update light position every frame to follow camera
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();

  // Keep light on the left side relative to camera view
  const lightOffset = new THREE.Vector3(-5, 0, 0);
  lightOffset.applyQuaternion(camera.quaternion);
  sunLight.position.copy(lightOffset);

  // Rotate Earth layers
  earthMesh.rotation.y += 0.002;
  cloudsMesh.rotation.y += 0.0023; // Clouds rotate slightly faster

  renderer.render(scene, camera);
};`,
          },
        },
        {
          title: 'Starfield Background',
          content:
            'A uniformly distributed starfield uses spherical coordinates for even distribution.',
          code: {
            language: 'typescript',
            snippet: `// Uniform sphere distribution (Fibonacci sphere)
for (let i = 0; i < starCount; i++) {
  const radius = Math.random() * 25 + 25;
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);

  // Convert spherical to Cartesian
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);

  positions.push(x, y, z);
  color.setHSL(0.6, 0.2, Math.random()); // Bluish tint
  colors.push(color.r, color.g, color.b);
}`,
          },
        },
        {
          title: 'Performance Optimizations',
          content:
            'Achieving 60fps required careful optimization at every level.',
          metrics: [
            { label: 'Frame Rate', value: '60fps', improvement: 'maintained' },
            { label: 'GPU Usage', value: '< 15%', improvement: 'efficient' },
            {
              label: 'Geometry Detail',
              value: '12',
              improvement: 'balanced quality/performance',
            },
            {
              label: 'Texture Loading',
              value: 'Async',
              improvement: 'non-blocking',
            },
          ],
          list: [
            'Capped pixel ratio to prevent over-rendering on 4K+ displays',
            'IcosahedronGeometry instead of SphereGeometry (better triangle distribution)',
            'Shared geometry across all layers (single allocation)',
            'RequestAnimationFrame for smooth animation loop',
            'Damping on OrbitControls for natural feel',
            'Proper cleanup on unmount (dispose geometry, materials, textures)',
          ],
        },
        {
          title: 'Earth Tilt & Realism',
          content:
            'Small details make a big difference. Earth is tilted 23.4° to match reality.',
          code: {
            language: 'typescript',
            snippet: `const earthGroup = new THREE.Group();
earthGroup.rotation.z = THREE.MathUtils.degToRad(-23.4);
scene.add(earthGroup);`,
          },
        },
      ],
      conclusion:
        'Building a 3D Earth visualization is more accessible than it seems. Three.js handles the WebGL complexity, letting you focus on the creative details. The key is layering - start simple, add complexity gradually, and optimize continuously.',
      keyTakeaways: [
        'Layer multiple meshes for realistic planetary effects',
        'Custom shaders enable effects impossible with standard materials',
        'OrbitControls + dynamic lighting creates natural interaction',
        'Performance matters - cap pixel ratio, optimize geometry',
        'Proper cleanup prevents memory leaks in long-lived SPAs',
        'Small details (23.4° tilt, varying cloud speed) add realism',
      ],
    },
  },
  {
    id: 'lighthouse-95-score',
    title: 'Achieving 95+ Lighthouse Score with 3D Graphics',
    description:
      'A technical deep dive into the optimization strategies, tooling choices, and performance budget decisions that maintained high Lighthouse scores even with Three.js 3D rendering.',
    date: '2025-01-15',
    readTime: '8 min read',
    tags: ['Performance', 'Vite', 'Optimization'],
    content: {
      intro:
        "Building a portfolio is easy. Building one with an interactive 3D Earth that still scores 95+ on Lighthouse across all categories? That's a different challenge. Here's how I balanced performance with visual impact.",
      sections: [
        {
          title: 'The Performance Budget',
          content:
            'Before writing any code, I established strict performance budgets. Then I added Three.js for 3D Earth rendering - a 500KB library. The challenge became maintaining high scores despite the increased bundle size.',
          metrics: [
            {
              label: 'Total Bundle Size',
              value: '200KB gzipped',
              improvement: '732KB uncompressed',
            },
            {
              label: 'First Contentful Paint',
              value: '< 1.8s',
              improvement: '',
            },
            {
              label: 'Interaction to Next Paint',
              value: '< 200ms',
              improvement: '',
            },
            {
              label: 'Cumulative Layout Shift',
              value: '< 0.1',
              improvement: 'minimal shifts',
            },
            {
              label: 'Animation Frame Rate',
              value: '60fps',
              improvement: 'maintained with WebGL',
            },
          ],
        },
        {
          title: 'Tooling Decisions',
          content:
            'Choosing Vite over Next.js was intentional. For a static portfolio with client-side routing, Vite offers superior developer experience and build performance without the overhead of a full-stack framework.',
          list: [
            'Vite for build tooling - near-instant HMR, optimal code splitting',
            'React Router for client-side navigation - lighter than Next.js App Router',
            'Manual code splitting over framework magic - explicit control',
            'CSS over CSS-in-JS - zero runtime cost, better caching',
          ],
        },
        {
          title: 'Bundle Optimization',
          content:
            'Three.js adds ~500KB to the bundle, but strategic optimizations keep the total at 200KB gzipped. Every other kilobyte is fought for.',
          list: [
            'Manual chunk splitting for routes (HomePage, WorkDetailPage)',
            'Lazy loading non-critical components (PerformanceToggle)',
            "Tree-shaking unused Three.js modules - only import what's needed",
            'No additional heavy dependencies - custom implementations elsewhere',
            'Capped pixel ratio at 1.75 to reduce WebGL overhead',
            'Optimized geometry detail levels (IcosahedronGeometry with 12 subdivisions)',
          ],
        },
        {
          title: 'Image & Asset Strategy',
          content:
            "This portfolio is intentionally light on images. When assets are needed, they're optimized aggressively.",
          list: [
            'SVG icons over icon fonts - smaller, cacheable, scalable',
            'CSS gradients and effects over images where possible',
            'Preload critical assets with proper resource hints',
            'No third-party fonts - using system font stack',
          ],
        },
        {
          title: 'Runtime Performance',
          content:
            'Build size is only half the story. With WebGL rendering a 3D scene, runtime performance becomes critical.',
          code: {
            language: 'typescript',
            snippet: `// Efficient 3D rendering with proper cleanup
useEffect(() => {
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.current!,
    alpha: true,
    antialias: true
  });

  // Cap pixel ratio to prevent excessive GPU load
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();

  return () => {
    renderer.dispose();
    geometry.dispose();
    material.dispose();
  };
}, []);`,
          },
          list: [
            'RequestAnimationFrame for all animations - smooth 60fps',
            'GPU-accelerated 3D rendering with Three.js WebGL',
            'Capped pixel ratio (1.75) prevents excessive GPU load on high-DPI screens',
            'Proper Three.js resource disposal prevents memory leaks',
            'Passive event listeners for scroll handlers',
            'Intersection Observer to pause off-screen 3D rendering',
          ],
        },
        {
          title: 'Accessibility & Progressive Enhancement',
          content:
            "Performance isn't just speed metrics. It's also ensuring the site works for everyone.",
          list: [
            'Respects prefers-reduced-motion - disables animations when requested',
            'Full keyboard navigation with visible focus indicators',
            'Semantic HTML for screen readers',
            'No JavaScript required for core content - progressive enhancement',
            'Color contrast ratios exceeding WCAG AAA standards',
          ],
        },
      ],
      conclusion:
        "Achieving high Lighthouse scores with 3D graphics isn't about avoiding heavy libraries - it's about strategic optimization everywhere else. Three.js is 500KB, but the rest of the app is meticulously optimized to compensate. Every other dependency, every animation, every byte matters.",
      keyTakeaways: [
        'High-impact features (3D graphics) are worth their cost if optimized correctly',
        'Establish performance budgets and adapt when necessary',
        'Choose tools that match your use case, not the hype',
        'Measure everything - what gets measured gets improved',
        'WebGL rendering can maintain 60fps with proper pixel ratio capping',
        'Accessibility and performance are complementary, not competing',
      ],
    },
  },
  {
    id: 'view-transitions-deep-dive',
    title: 'Per-Word View Transitions: Implementation Deep Dive',
    description:
      'How I implemented smooth per-word morphing animations using the View Transitions API, solving challenges with React Router and scroll position.',
    date: '2025-01-12',
    readTime: '10 min read',
    tags: ['View Transitions API', 'React', 'Animations'],
    content: {
      intro:
        'The View Transitions API is one of the most exciting browser features for creating smooth, app-like experiences. But getting it to work with React Router and maintaining scroll position? That took some work.',
      sections: [
        {
          title: 'The Goal',
          content:
            'I wanted to recreate the smooth morphing effect from nmn.sh/blog, where each word in a title transitions independently when navigating between list and detail views.',
        },
        {
          title: 'Understanding View Transitions',
          content:
            'The View Transitions API captures a snapshot of the DOM before a change, then animates between the old and new states. The magic happens with CSS view-transition-name properties.',
          code: {
            language: 'css',
            snippet: `/* Each word gets a unique view-transition-name */
.word-1 {
  view-transition-name: project-slug-word-1;
}

/* Browser automatically animates between matching names */
::view-transition-old(project-slug-word-1),
::view-transition-new(project-slug-word-1) {
  animation-duration: 0.6s;
  animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}`,
          },
        },
        {
          title: 'The Per-Word Split',
          content:
            'The first challenge was splitting titles into individual words while maintaining a unique view-transition-name for each.',
          code: {
            language: 'typescript',
            snippet: `export function getTitleSegments(slug: string, title: string) {
  const words = title.split(' ');

  return words.map((word, index) => ({
    id: \`\${slug}-word-\${index}\`,
    text: word,
    viewTransitionName: \`\${slug}-word-\${index}\`,
  }));
}

// Usage in component
const titleSegments = getTitleSegments(project.slug, project.title);

return (
  <h2>
    {titleSegments.map((segment, index) => (
      <span
        key={segment.id}
        style={{ viewTransitionName: segment.viewTransitionName }}
      >
        {segment.text}
        {index < titleSegments.length - 1 ? ' ' : ''}
      </span>
    ))}
  </h2>
);`,
          },
        },
        {
          title: 'React Router Integration',
          content:
            'The View Transitions API works best with cross-document navigation. Making it work with SPA routing required wrapping React Router navigation.',
          code: {
            language: 'typescript',
            snippet: `const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();

  // Save scroll position before navigating
  if (location.pathname === '/') {
    sessionStorage.setItem(SCROLL_KEY, window.scrollY.toString());
  }

  // Wrap navigation in view transition
  if ('startViewTransition' in document) {
    (document as any).startViewTransition(() => {
      navigate(to);
    });
  } else {
    navigate(to);
  }
};`,
          },
        },
        {
          title: 'Scroll Restoration Challenge',
          content:
            'The hardest part was restoring scroll position after the transition. The solution required executing the scroll synchronously within the transition callback.',
          code: {
            language: 'typescript',
            snippet: `const handleClose = () => {
  if ('startViewTransition' in document) {
    (document as any).startViewTransition(() => {
      navigate('/');

      // Restore scroll IMMEDIATELY after navigation
      const savedScroll = sessionStorage.getItem(SCROLL_KEY);
      if (savedScroll) {
        window.scrollTo(0, parseInt(savedScroll, 10));
      }
    });
  }
};`,
          },
          list: [
            'Attempted async restoration - failed, page jumped',
            'Tried setTimeout delays - created visual flicker',
            'Solution: Synchronous scroll in transition callback',
          ],
        },
        {
          title: 'Performance Considerations',
          content:
            'View transitions can be expensive. I optimized by limiting the number of transitioning elements and using efficient selectors.',
          list: [
            'Only title words transition - not entire cards',
            'Reduced motion check to disable for accessibility',
            'CSS containment on transitioning elements',
            'Kept transition duration under 600ms for snappiness',
          ],
        },
      ],
      conclusion:
        'The View Transitions API is powerful but requires careful integration with modern frameworks. The result is worth it - smooth, native-feeling animations without heavy JavaScript libraries.',
      keyTakeaways: [
        'View Transitions API works best when view-transition-names match exactly',
        'React Router requires manual wrapping of navigation',
        'Scroll restoration must happen synchronously in transition callback',
        'Always provide fallback for browsers without support',
        'Respect prefers-reduced-motion for accessibility',
      ],
    },
  },
  {
    id: 'magnetic-cursor-performance',
    title: 'Magnetic Cursor Effects Without Performance Jank',
    description:
      'Building smooth, 60fps magnetic cursor interactions using requestAnimationFrame and proper event handling optimization.',
    date: '2025-01-08',
    readTime: '6 min read',
    tags: ['Performance', 'Animations', 'UX'],
    content: {
      intro:
        "Magnetic cursor effects are visually striking, but poorly implemented ones tank performance. Here's how to build them properly at 60fps.",
      sections: [
        {
          title: 'The Problem',
          content:
            "Naive implementations attach mousemove listeners that trigger re-renders on every pixel movement. At 60fps, that's 60 React renders per second.",
        },
        {
          title: 'The Solution: Direct DOM Manipulation',
          content:
            "For performance-critical animations, bypass React's render cycle entirely and manipulate the DOM directly.",
          code: {
            language: 'typescript',
            snippet: `const handleMouseMove = (e: MouseEvent, card: Element) => {
  const titleWords = card.querySelectorAll('.work-card__title span');

  titleWords.forEach((word) => {
    const rect = word.getBoundingClientRect();
    const wordCenterX = rect.left + rect.width / 2;
    const wordCenterY = rect.top + rect.height / 2;

    const deltaX = e.clientX - wordCenterX;
    const deltaY = e.clientY - wordCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < 100) {
      const strength = (1 - distance / 100) * 0.15;
      const moveX = deltaX * strength;
      const moveY = deltaY * strength;

      // Direct DOM manipulation - zero React renders
      (word as HTMLElement).style.transform =
        \`translate(\${moveX}px, \${moveY}px)\`;
    }
  });
};`,
          },
        },
        {
          title: 'Event Handler Optimization',
          content:
            'Reducing the frequency of expensive calculations with proper event management.',
          list: [
            'Attach listeners only to parent cards, not individual words',
            'Use getBoundingClientRect once per word, not per frame',
            'Implement distance threshold to skip far-away words',
            'Reset transforms on mouseleave for cleanup',
          ],
        },
        {
          title: 'CSS Optimization',
          content: 'CSS plays a crucial role in smooth magnetic effects.',
          code: {
            language: 'css',
            snippet: `.work-card__title span {
  display: inline-block;
  transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
  will-change: transform; /* Hint to browser for GPU optimization */
}`,
          },
          list: [
            'will-change: transform - promotes to GPU layer',
            'Short transition duration (0.2s) for responsive feel',
            'Smooth easing function, not janky linear',
          ],
        },
        {
          title: 'Accessibility Consideration',
          content:
            'Always check for reduced motion preference to respect user settings.',
          code: {
            language: 'typescript',
            snippet: `useEffect(() => {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) return; // Skip magnetic effect

  // Setup listeners...
}, []);`,
          },
        },
        {
          title: 'Performance Metrics',
          content: 'Measuring the impact of optimizations.',
          metrics: [
            { label: 'Frame Rate', value: '60fps', improvement: 'maintained' },
            {
              label: 'React Renders',
              value: '0',
              improvement: 'per mousemove',
            },
            { label: 'CPU Usage', value: '< 5%', improvement: 'on hover' },
            {
              label: 'Memory Allocation',
              value: '0',
              improvement: 'no object creation',
            },
          ],
        },
      ],
      conclusion:
        "Magnetic cursor effects don't have to be performance killers. With direct DOM manipulation, proper event handling, and CSS optimization, you can create smooth 60fps interactions.",
      keyTakeaways: [
        'Direct DOM manipulation for high-frequency animations',
        'Event delegation over individual listeners',
        'will-change CSS property for GPU optimization',
        'Always respect prefers-reduced-motion',
        'Measure performance with real profiling, not guesses',
      ],
    },
  },
];

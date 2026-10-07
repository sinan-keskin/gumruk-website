/* ==========================================================================
   ThreeUI Style Interactive 3D Logistics Experience (Three.js)
   - Procedural Ocean Waves & Stylized Cargo Container Vessel
   - High-Altitude Cargo Jet soaring through clouds
   - Global Trade Network Globe with illuminated routes
   - Scroll-triggered dynamic camera panning and interactive mouse parallax
   ========================================================================== */

(function () {
  'use strict';

  // Check if Three.js is loaded
  if (typeof THREE === 'undefined') {
    console.warn('Three.js is not loaded yet.');
    return;
  }

  const container = document.getElementById('threeHeroCanvasContainer');
  if (!container) return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xF0F9FF);
  scene.fog = new THREE.FogExp2(0xF0F9FF, 0.008);

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(25, 18, 45);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.85);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);
  sunLight.position.set(40, 60, 30);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  sunLight.shadow.camera.near = 10;
  sunLight.shadow.camera.far = 150;
  sunLight.shadow.camera.left = -40;
  sunLight.shadow.camera.right = 40;
  sunLight.shadow.camera.top = 40;
  sunLight.shadow.camera.bottom = -40;
  scene.add(sunLight);

  const blueFillLight = new THREE.DirectionalLight(0x38BDF8, 0.6);
  blueFillLight.position.set(-30, 20, -20);
  scene.add(blueFillLight);

  // 1. Procedural Ocean Mesh
  const oceanGeo = new THREE.PlaneGeometry(160, 160, 64, 64);
  oceanGeo.rotateX(-Math.PI / 2);

  const oceanMat = new THREE.MeshStandardMaterial({
    color: 0x0284C7,
    roughness: 0.15,
    metalness: 0.2,
    transparent: true,
    opacity: 0.88,
    flatShading: true
  });

  const ocean = new THREE.Mesh(oceanGeo, oceanMat);
  ocean.position.y = -2;
  ocean.receiveShadow = true;
  scene.add(ocean);

  // Save original vertex positions for sinusoidal wave deformation
  const oceanPos = oceanGeo.attributes.position;
  const initialY = new Float32Array(oceanPos.count);
  for (let i = 0; i < oceanPos.count; i++) {
    initialY[i] = oceanPos.getY(i);
  }

  // 2. Stylized 3D Cargo Container Vessel
  const shipGroup = new THREE.Group();

  // Ship Hull
  const hullMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.4 });
  const hullGeo = new THREE.BoxGeometry(18, 3.5, 6);
  const hull = new THREE.Mesh(hullGeo, hullMat);
  hull.castShadow = true;
  hull.receiveShadow = true;
  shipGroup.add(hull);

  // Bow (Front V-shape)
  const bowGeo = new THREE.ConeGeometry(3.5, 5, 4);
  bowGeo.rotateZ(Math.PI / 2);
  bowGeo.rotateY(Math.PI / 4);
  const bow = new THREE.Mesh(bowGeo, hullMat);
  bow.position.set(10.5, 0, 0);
  bow.castShadow = true;
  shipGroup.add(bow);

  // Superstructure / Bridge
  const bridgeMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.2 });
  const bridgeGeo = new THREE.BoxGeometry(4, 5, 4.8);
  const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
  bridge.position.set(-6, 3.5, 0);
  bridge.castShadow = true;
  shipGroup.add(bridge);

  // Bridge Windows Strip
  const windowMat = new THREE.MeshStandardMaterial({ color: 0x0EA5E9, roughness: 0.1, metalness: 0.8 });
  const windowGeo = new THREE.BoxGeometry(3.8, 0.7, 5);
  const windows = new THREE.Mesh(windowGeo, windowMat);
  windows.position.set(-5.9, 5, 0);
  shipGroup.add(windows);

  // Radar Mast & Smokestack
  const mastMat = new THREE.MeshStandardMaterial({ color: 0x0284C7 });
  const mastGeo = new THREE.CylinderGeometry(0.2, 0.2, 3);
  const mast = new THREE.Mesh(mastGeo, mastMat);
  mast.position.set(-6, 7.5, 0);
  shipGroup.add(mast);

  const stackMat = new THREE.MeshStandardMaterial({ color: 0xD97706 });
  const stackGeo = new THREE.CylinderGeometry(0.8, 0.8, 2.5);
  const stack = new THREE.Mesh(stackGeo, stackMat);
  stack.position.set(-8, 5, 0);
  shipGroup.add(stack);

  // Cargo Containers Stacks
  const containerColors = [0x0284C7, 0x0EA5E9, 0x06B6D4, 0x475569, 0xD97706, 0x10B981];
  const containerGeo = new THREE.BoxGeometry(2.4, 1.3, 1.2);

  for (let row = -1; row <= 2; row++) {
    for (let col = -1; col <= 1; col++) {
      for (let h = 0; h < 2; h++) {
        // Skip some randomly to create authentic varied cargo stacks
        if (Math.random() > 0.15) {
          const cColor = containerColors[Math.floor(Math.random() * containerColors.length)];
          const cMat = new THREE.MeshStandardMaterial({
            color: cColor,
            roughness: 0.5,
            metalness: 0.1
          });
          const cMesh = new THREE.Mesh(containerGeo, cMat);
          cMesh.position.set(row * 2.6 - 0.5, 2.4 + h * 1.35, col * 1.4);
          cMesh.castShadow = true;
          cMesh.receiveShadow = true;
          shipGroup.add(cMesh);
        }
      }
    }
  }

  shipGroup.position.set(0, -0.6, 0);
  scene.add(shipGroup);

  // 3. Stylized Cargo Aircraft
  const planeGroup = new THREE.Group();

  const planeMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.2 });
  const fuselageGeo = new THREE.CylinderGeometry(0.8, 0.8, 9, 16);
  fuselageGeo.rotateZ(Math.PI / 2);
  const fuselage = new THREE.Mesh(fuselageGeo, planeMat);
  fuselage.castShadow = true;
  planeGroup.add(fuselage);

  // Nose cone
  const noseGeo = new THREE.ConeGeometry(0.8, 2, 16);
  noseGeo.rotateZ(-Math.PI / 2);
  const nose = new THREE.Mesh(noseGeo, planeMat);
  nose.position.x = 5.5;
  planeGroup.add(nose);

  // Main Wings
  const wingGeo = new THREE.BoxGeometry(3, 0.15, 12);
  const wing = new THREE.Mesh(wingGeo, planeMat);
  wing.position.set(0.5, 0.2, 0);
  planeGroup.add(wing);

  // Tailfin
  const tailGeo = new THREE.BoxGeometry(1.5, 2.2, 0.2);
  tailGeo.rotateZ(-0.4);
  const tailMat = new THREE.MeshStandardMaterial({ color: 0x0284C7 });
  const tail = new THREE.Mesh(tailGeo, tailMat);
  tail.position.set(-4.2, 1.2, 0);
  planeGroup.add(tail);

  // Jet Engines
  const engineGeo = new THREE.CylinderGeometry(0.4, 0.4, 2, 12);
  engineGeo.rotateZ(Math.PI / 2);
  const engineMat = new THREE.MeshStandardMaterial({ color: 0x475569 });

  const engineL = new THREE.Mesh(engineGeo, engineMat);
  engineL.position.set(0.6, -0.4, 2.8);
  planeGroup.add(engineL);

  const engineR = new THREE.Mesh(engineGeo, engineMat);
  engineR.position.set(0.6, -0.4, -2.8);
  planeGroup.add(engineR);

  planeGroup.scale.set(0.8, 0.8, 0.8);
  planeGroup.position.set(-20, 24, -15);
  scene.add(planeGroup);

  // 4. Global Trade Wireframe Network Globe (In the distant horizon)
  const globeGroup = new THREE.Group();

  const globeGeo = new THREE.SphereGeometry(18, 24, 24);
  const globeMat = new THREE.MeshBasicMaterial({
    color: 0x38BDF8,
    wireframe: true,
    transparent: true,
    opacity: 0.12
  });
  const globe = new THREE.Mesh(globeGeo, globeMat);
  globeGroup.add(globe);

  // Glowing Hub Nodes
  const nodeGeo = new THREE.SphereGeometry(0.5, 12, 12);
  const nodeMat = new THREE.MeshBasicMaterial({ color: 0x0EA5E9 });

  for (let i = 0; i < 8; i++) {
    const node = new THREE.Mesh(nodeGeo, nodeMat);
    const phi = Math.acos(-1 + (2 * i) / 8);
    const theta = Math.sqrt(8 * Math.PI) * phi;
    node.position.setFromSphericalCoords(18, phi, theta);
    globeGroup.add(node);
  }

  globeGroup.position.set(-35, 12, -45);
  scene.add(globeGroup);

  // Mouse Parallax & Scroll Interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetCamX = 25;
  let targetCamY = 18;
  let targetCamZ = 45;

  let currentMode = 'sea'; // 'sea', 'air', 'grid'

  window.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX = (x / rect.width - 0.5) * 2;
    mouseY = (y / rect.height - 0.5) * 2;
  });

  // Scroll link
  let scrollProgress = 0;
  window.addEventListener('scroll', () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = window.scrollY / Math.max(maxScroll, 1);
  });

  // Mode buttons in UI
  const modeTabs = document.querySelectorAll('.mode-tab');
  modeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      modeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentMode = tab.getAttribute('data-mode');
    });
  });

  // Clock
  const clock = new THREE.Clock();

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // 1. Ocean Waves Sinusoidal Ripple
    for (let i = 0; i < oceanPos.count; i++) {
      const u = oceanPos.getX(i);
      const v = oceanPos.getZ(i);
      const wave = Math.sin(u * 0.15 + elapsedTime * 1.5) * 0.4 +
                   Math.cos(v * 0.12 + elapsedTime * 1.2) * 0.3;
      oceanPos.setY(i, initialY[i] + wave);
    }
    oceanPos.needsUpdate = true;

    // 2. Cargo Vessel Bobbing & Forward Motion Simulation
    shipGroup.position.y = -0.5 + Math.sin(elapsedTime * 1.6) * 0.25;
    shipGroup.rotation.z = Math.sin(elapsedTime * 1.4) * 0.025; // Roll
    shipGroup.rotation.x = Math.cos(elapsedTime * 1.2) * 0.015; // Pitch
    shipGroup.rotation.y = -Math.PI / 16 + Math.sin(elapsedTime * 0.5) * 0.03;

    // 3. Cargo Aircraft Circling Sky Trajectory
    const planeAngle = elapsedTime * 0.35;
    const planeRadius = 28;
    planeGroup.position.x = Math.cos(planeAngle) * planeRadius;
    planeGroup.position.z = Math.sin(planeAngle) * planeRadius;
    planeGroup.position.y = 20 + Math.sin(elapsedTime * 0.8) * 2.5;
    planeGroup.rotation.y = -planeAngle - Math.PI / 2;
    planeGroup.rotation.z = -0.15; // Bank angle

    // 4. Trade Network Globe Slow Rotation
    globeGroup.rotation.y += 0.002;
    globeGroup.rotation.x += 0.001;

    // 5. Camera positioning based on active mode & scroll
    if (currentMode === 'sea') {
      targetCamX = 22 + mouseX * 4;
      targetCamY = 12 - mouseY * 3 - scrollProgress * 10;
      targetCamZ = 36 + scrollProgress * 15;
    } else if (currentMode === 'air') {
      targetCamX = planeGroup.position.x * 0.6 + 15 + mouseX * 6;
      targetCamY = 26 - mouseY * 4;
      targetCamZ = planeGroup.position.z * 0.6 + 25;
    } else if (currentMode === 'grid') {
      targetCamX = -10 + mouseX * 5;
      targetCamY = 24 - mouseY * 4;
      targetCamZ = 15;
    }

    camera.position.x += (targetCamX - camera.position.x) * 0.05;
    camera.position.y += (targetCamY - camera.position.y) * 0.05;
    camera.position.z += (targetCamZ - camera.position.z) * 0.05;

    camera.lookAt(0, 3, 0);

    renderer.render(scene, camera);
  }

  animate();

  // Responsive resize
  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
})();

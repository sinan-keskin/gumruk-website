/* ==========================================================================
   Dedicated Service Page 3D Interactive Asset Viewer (Three.js)
   Renders custom 3D logistics & compliance models for each of the 15 services.
   Includes mouse drag orbit rotation, lighting, and ambient animation.
   ========================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const canvasWrap = document.querySelector('.service-3d-canvas-wrap');
    if (!canvasWrap || typeof THREE === 'undefined') return;

    const serviceType = canvasWrap.getAttribute('data-service-type') || 'import';

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFAFCFF);

    const camera = new THREE.PerspectiveCamera(
      45,
      canvasWrap.clientWidth / canvasWrap.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 3.5, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(canvasWrap.clientWidth, canvasWrap.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    canvasWrap.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 1.3);
    keyLight.position.set(8, 12, 10);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38BDF8, 0.7);
    fillLight.position.set(-8, -4, -6);
    scene.add(fillLight);

    // Subtle Ground Shadow Plane
    const groundGeo = new THREE.CylinderGeometry(4.2, 4.2, 0.15, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xF1F5F9,
      roughness: 0.8,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -1.8;
    ground.receiveShadow = true;
    scene.add(ground);

    // Main 3D Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Create 3D Asset Based on Service Type
    buildService3DModel(serviceType, modelGroup);

    // Orbit Drag Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    renderer.domElement.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      targetRotY += deltaX * 0.008;
      targetRotX += deltaY * 0.008;
      targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    // Touch Support for Mobile
    renderer.domElement.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    });

    window.addEventListener('touchend', () => { isDragging = false; });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      targetRotY += deltaX * 0.008;
      targetRotX += deltaY * 0.008;
      targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX));
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Ambient idle rotation when not dragging
      if (!isDragging) {
        targetRotY += 0.006;
      }

      modelGroup.rotation.y += (targetRotY - modelGroup.rotation.y) * 0.08;
      modelGroup.rotation.x += (targetRotX - modelGroup.rotation.x) * 0.08;

      // Gentle floating bob
      modelGroup.position.y = Math.sin(elapsed * 1.8) * 0.12;

      renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
      if (!canvasWrap) return;
      camera.aspect = canvasWrap.clientWidth / canvasWrap.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasWrap.clientWidth, canvasWrap.clientHeight);
    });
  });

  // Helper function to build distinct 3D visual models
  function buildService3DModel(type, group) {
    switch (type) {
      case 'import':
      case 'export': {
        // High-end 3D Shipping Container with Customs Seal
        const cMat = new THREE.MeshStandardMaterial({
          color: type === 'import' ? 0x0284C7 : 0x0EA5E9,
          roughness: 0.4,
          metalness: 0.3
        });
        const cGeo = new THREE.BoxGeometry(3.6, 2.0, 2.0);
        const container = new THREE.Mesh(cGeo, cMat);
        container.castShadow = true;
        group.add(container);

        // Corrugated Side Ribs
        const ribMat = new THREE.MeshStandardMaterial({ color: 0x0369A1, roughness: 0.5 });
        for (let i = -6; i <= 6; i++) {
          const ribGeo = new THREE.BoxGeometry(0.08, 1.9, 2.05);
          const rib = new THREE.Mesh(ribGeo, ribMat);
          rib.position.x = i * 0.25;
          group.add(rib);
        }

        // Gold Customs Security Seal
        const sealMat = new THREE.MeshStandardMaterial({ color: 0xD97706, metalness: 0.8, roughness: 0.2 });
        const sealGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.2, 16);
        const seal = new THREE.Mesh(sealGeo, sealMat);
        seal.position.set(1.85, 0, 0);
        seal.rotation.z = Math.PI / 2;
        group.add(seal);
        break;
      }

      case 'food':
      case 'agriculture': {
        // Laboratory / Phytosanitary Flask & Botanical Compliance Globe
        const glassMat = new THREE.MeshStandardMaterial({
          color: 0x14B8A6,
          roughness: 0.1,
          metalness: 0.1,
          transparent: true,
          opacity: 0.75
        });
        const flaskGeo = new THREE.SphereGeometry(1.6, 24, 24);
        const flask = new THREE.Mesh(flaskGeo, glassMat);
        group.add(flask);

        // Inner Leaf / Organic Biological Nucleus
        const bioMat = new THREE.MeshStandardMaterial({ color: 0x10B981, roughness: 0.3 });
        const bioGeo = new THREE.ConeGeometry(0.7, 1.8, 8);
        const bio = new THREE.Mesh(bioGeo, bioMat);
        group.add(bio);

        // Surrounding Regulatory Shield Ring
        const ringGeo = new THREE.TorusGeometry(2.3, 0.08, 16, 48);
        const ringMat = new THREE.MeshStandardMaterial({ color: 0x0284C7, metalness: 0.7 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 3;
        group.add(ring);
        break;
      }

      case 'cites': {
        // CITES Wildlife Protection & Diplomatic Treaty Emblem
        const shieldGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.3, 6);
        const shieldMat = new THREE.MeshStandardMaterial({ color: 0xD97706, metalness: 0.8, roughness: 0.2 });
        const shield = new THREE.Mesh(shieldGeo, shieldMat);
        shield.rotation.x = Math.PI / 2;
        group.add(shield);

        const hornGeo = new THREE.TorusGeometry(1.0, 0.18, 16, 32, Math.PI);
        const hornMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.3 });
        const horn = new THREE.Mesh(hornGeo, hornMat);
        horn.position.z = 0.25;
        group.add(horn);
        break;
      }

      case 'inward':
      case 'enduse': {
        // Precision Industrial Cog & Tariff Transformation Hub
        const gearGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.6, 12);
        const gearMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.25 });
        const gear = new THREE.Mesh(gearGeo, gearMat);
        group.add(gear);

        const innerGeo = new THREE.TorusGeometry(2.2, 0.15, 16, 48);
        const innerMat = new THREE.MeshStandardMaterial({ color: 0x0EA5E9, metalness: 0.9 });
        const inner = new THREE.Mesh(innerGeo, innerMat);
        inner.rotation.x = Math.PI / 4;
        group.add(inner);
        break;
      }

      case 'tareks': {
        // CE Conformity Seal & Laser Scanning Grid
        const badgeGeo = new THREE.CylinderGeometry(1.7, 1.7, 0.25, 32);
        const badgeMat = new THREE.MeshStandardMaterial({ color: 0x0284C7, metalness: 0.8, roughness: 0.2 });
        const badge = new THREE.Mesh(badgeGeo, badgeMat);
        badge.rotation.x = Math.PI / 2;
        group.add(badge);

        const ceGeo = new THREE.TorusGeometry(1.0, 0.2, 16, 32, Math.PI * 1.5);
        const ceMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.3 });
        const ce1 = new THREE.Mesh(ceGeo, ceMat);
        ce1.position.set(-0.5, 0, 0.2);
        group.add(ce1);
        break;
      }

      case 'machinery': {
        // Heavy Hydraulic Arm & Construction Machinery Boom
        const baseGeo = new THREE.BoxGeometry(2.4, 0.8, 2.0);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0xF59E0B, roughness: 0.4 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        group.add(base);

        const boomGeo = new THREE.CylinderGeometry(0.3, 0.3, 3.2, 16);
        const boomMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.8 });
        const boom = new THREE.Mesh(boomGeo, boomMat);
        boom.position.set(0.6, 1.4, 0);
        boom.rotation.z = -Math.PI / 4;
        group.add(boom);
        break;
      }

      case 'guarantee': {
        // Bank Treasury Vault & Released Collateral Lock
        const vaultGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.8, 32);
        const vaultMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.2 });
        const vault = new THREE.Mesh(vaultGeo, vaultMat);
        vault.rotation.x = Math.PI / 2;
        group.add(vault);

        const lockGeo = new THREE.TorusGeometry(0.8, 0.16, 16, 32);
        const lockMat = new THREE.MeshStandardMaterial({ color: 0xD97706, metalness: 0.9, roughness: 0.15 });
        const lock = new THREE.Mesh(lockGeo, lockMat);
        lock.position.z = 0.5;
        group.add(lock);
        break;
      }

      case 'attestation': {
        // Diplomatic Wax Seal & Certified Apostille Roll
        const scrollGeo = new THREE.CylinderGeometry(0.7, 0.7, 3.2, 24);
        const scrollMat = new THREE.MeshStandardMaterial({ color: 0xFEF3C7, roughness: 0.6 });
        const scroll = new THREE.Mesh(scrollGeo, scrollMat);
        scroll.rotation.z = Math.PI / 3;
        group.add(scroll);

        const waxGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.25, 24);
        const waxMat = new THREE.MeshStandardMaterial({ color: 0xDC2626, roughness: 0.3, metalness: 0.1 });
        const wax = new THREE.Mesh(waxGeo, waxMat);
        wax.position.set(0, 0, 0.8);
        wax.rotation.x = Math.PI / 2;
        group.add(wax);
        break;
      }

      default: {
        // General Logistics Sphere & Speed Cargo Capsule
        const capsuleGeo = new THREE.CylinderGeometry(1.0, 1.0, 2.6, 24);
        const capsuleMat = new THREE.MeshStandardMaterial({ color: 0x0284C7, metalness: 0.6, roughness: 0.3 });
        const capsule = new THREE.Mesh(capsuleGeo, capsuleMat);
        capsule.rotation.z = Math.PI / 2;
        group.add(capsule);

        const ringGeo = new THREE.TorusGeometry(2.0, 0.08, 16, 48);
        const ringMat = new THREE.MeshStandardMaterial({ color: 0x06B6D4 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 3;
        group.add(ring);
        break;
      }
    }
  }
})();

import * as THREE from "three";

const smooth = (a, b, x) => { const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

// A stylised, reversible formation story, not a physical simulation.
export function createFormationParticles({ scene, texture, mobile, bodies, sun, sunRadius = 3 }) {
  const count = mobile ? 6500 : 18000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const cloud = new Float32Array(count * 3);
  const disk = new Float32Array(count * 3);
  const shell = new Float32Array(count * 3);
  const groups = new Uint8Array(count);
  const targets = [{ holder: sun, radius: sunRadius }, ...bodies];
  const centers = targets.map(() => new THREE.Vector3());
  const palette = ["#ffd19a", "#c4b3a0", "#e6c08b", "#6abaff", "#ee8760", "#e2b78a", "#edcf9d", "#87dadd", "#718cfa"];
  let seed = 4731;
  const rand = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < count; i++) {
    const k = i * 3;
    const angle = rand() * Math.PI * 2;
    const radius = 4 + Math.sqrt(rand()) * 47;
    const vertical = rand() * 2 - 1;
    cloud[k] = Math.cos(angle) * radius;
    cloud[k + 1] = vertical * radius * 0.65;
    cloud[k + 2] = Math.sin(angle) * radius;
    const twist = angle + radius * 0.12;
    disk[k] = Math.cos(twist) * radius;
    disk[k + 1] = vertical * (0.35 + radius * 0.035);
    disk[k + 2] = Math.sin(twist) * radius;
    const group = rand() < 0.38 ? 0 : 1 + Math.floor(rand() * bodies.length);
    groups[i] = group;
    const phi = rand() * Math.PI * 2;
    const y = rand() * 2 - 1;
    const r = targets[group].radius * (0.85 + rand() * 0.25);
    shell[k] = Math.cos(phi) * Math.sqrt(1 - y * y) * r;
    shell[k + 1] = y * r;
    shell[k + 2] = Math.sin(phi) * Math.sqrt(1 - y * y) * r;
    const color = new THREE.Color(palette[group]);
    color.multiplyScalar(1.1 + rand() * 0.9).toArray(colors, k);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({ map: texture, size: mobile ? 1.1 : 0.85, vertexColors: true, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  scene.add(points);
  const seedGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, color: 0xffffff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  seedGlow.scale.setScalar(1.2);
  scene.add(seedGlow);
  return {
    update(progress) {
      seedGlow.visible = progress < 0.5;
      seedGlow.material.opacity = (1 - smooth(0.03,0.4,progress))*0.9;
      points.visible = progress < 1;
      if (!points.visible) return;
      const expand = smooth(0, 0.27, progress);
      const flatten = smooth(0.23, 0.53, progress);
      const gather = smooth(0.45, 0.82, progress);
      const reveal = smooth(0.66, 0.99, progress);
      targets.forEach((target, i) => target.holder.getWorldPosition(centers[i]));
      const spin = progress * Math.PI * 1.3;
      const c = Math.cos(spin), s = Math.sin(spin);
      for (let i = 0; i < count; i++) {
        const k = i * 3, center = centers[groups[i]];
        const spread = 0.005 + expand * 0.995;
        const x = THREE.MathUtils.lerp(cloud[k] * spread, disk[k], flatten);
        const y = THREE.MathUtils.lerp(cloud[k + 1] * spread, disk[k + 1], flatten);
        const z = THREE.MathUtils.lerp(cloud[k + 2] * spread, disk[k + 2], flatten);
        positions[k] = THREE.MathUtils.lerp(x * c - z * s, center.x + shell[k], gather);
        positions[k + 1] = THREE.MathUtils.lerp(y, center.y + shell[k + 1], gather);
        positions[k + 2] = THREE.MathUtils.lerp(x * s + z * c, center.z + shell[k + 2], gather);
      }
      const offset = 0;
      points.position.x = offset;
      seedGlow.position.x = 0;
      material.opacity = 1 - reveal;
      geometry.attributes.position.needsUpdate = true;
    },
  };
}

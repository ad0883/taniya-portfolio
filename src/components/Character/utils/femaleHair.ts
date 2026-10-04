import * as THREE from "three";

// Authored in the model's bind-pose coordinates, then attached to its head bone.
// This keeps the hairstyle attached during the existing intro and pointer motion.
export function addFemaleHair(character: THREE.Object3D) {
  const head = character.getObjectByName("spine006");
  if (!head) throw new Error("The avatar is missing its head bone.");

  const hair = new THREE.Group();
  hair.name = "FemaleHairstyle";
  const material = new THREE.MeshPhysicalMaterial({
    color: "#241719",
    roughness: 0.62,
    metalness: 0,
    sheen: 0.3,
    sheenColor: new THREE.Color("#704537"),
    sheenRoughness: 0.75,
    side: THREE.DoubleSide,
  });
  const highlightMaterial = material.clone();
  highlightMaterial.color.set("#332022");

  const positions: number[] = [];
  const indices: number[] = [];
  const rows = 42;
  const columns = 96;

  for (let row = 0; row <= rows; row++) {
    const t = row / rows;
    for (let column = 0; column <= columns; column++) {
      const angle = (column / columns) * Math.PI * 2;
      const frontAngle = Math.min(angle, Math.PI * 2 - angle);
      const curtain = THREE.MathUtils.smoothstep(frontAngle, 0.58, 1.35);
      const hairline = 13.84 - 0.20 * Math.sin(angle) - 0.04 * Math.cos(angle * 3);
      const bottom = THREE.MathUtils.lerp(hairline, 11.82, curtain);
      const y = THREE.MathUtils.lerp(14.46, bottom, t);
      const crown = Math.sqrt(Math.max(0, 1 - ((y - 13.5) / 0.96) ** 2));
      const radius = y > 13.5 ? crown : 1 + 0.035 * Math.sin((y - 11.8) * 4);
      const wave = Math.sin(angle * 12 + t * 4) * 0.012 * Math.sin(t * Math.PI);
      const taper = y < 12.25 ? THREE.MathUtils.lerp(0.85, 1, (y - 11.82) / 0.43) : 1;
      positions.push(
        Math.sin(angle) * (radius * 1.08 + wave) * taper,
        y + curtain * 0.07 * Math.sin(angle * 5) * t ** 8,
        Math.cos(angle) * (radius * 1.04 + wave) - 0.075
      );
      if (row < rows && column < columns) {
        const i = row * (columns + 1) + column;
        indices.push(i, i + columns + 1, i + 1, i + 1, i + columns + 1, i + columns + 2);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  hair.add(new THREE.Mesh(geometry, material));

  // Flattened, tapered locks give the side part and waves a sculpted silhouette.
  function lock(points: number[][], width: number, depth: number, accent = false) {
    const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
    const frames = curve.computeFrenetFrames(40, false);
    const vertices: number[] = [];
    const faces: number[] = [];
    for (let step = 0; step <= 40; step++) {
      const t = step / 40;
      const center = curve.getPointAt(t);
      const taper = 0.1 + 0.9 * Math.sin(Math.PI * t) ** 0.45;
      for (let side = 0; side <= 12; side++) {
        const angle = (side / 12) * Math.PI * 2;
        const point = center.clone()
          .addScaledVector(frames.normals[step], Math.cos(angle) * width * taper)
          .addScaledVector(frames.binormals[step], Math.sin(angle) * depth * taper);
        vertices.push(point.x, point.y, point.z);
        if (step < 40 && side < 12) {
          const i = step * 13 + side;
          faces.push(i, i + 13, i + 1, i + 1, i + 13, i + 14);
        }
      }
    }
    const strand = new THREE.BufferGeometry();
    strand.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    strand.setIndex(faces);
    strand.computeVertexNormals();
    hair.add(new THREE.Mesh(strand, accent ? highlightMaterial : material));
  }

  lock([[-0.25, 14.42, 0.12], [0.18, 14.28, 0.68], [0.63, 14.02, 0.91], [0.94, 13.61, 0.67], [1.02, 13.18, 0.46]], 0.19, 0.11);
  lock([[-0.29, 14.4, 0.12], [-0.65, 14.21, 0.62], [-0.96, 13.77, 0.63], [-1.07, 13.11, 0.42], [-1.05, 12.55, 0.43], [-0.92, 11.88, 0.40]], 0.19, 0.12);
  lock([[0.96, 13.62, 0.56], [1.12, 13.1, 0.44], [1.1, 12.67, 0.48], [0.99, 12.19, 0.48], [1.03, 11.73, 0.29]], 0.21, 0.14);
  lock([[-0.86, 13.69, 0.72], [-1.00, 13.16, 0.65], [-1.03, 12.73, 0.57], [-0.90, 12.2, 0.59], [-0.94, 11.83, 0.38]], 0.075, 0.05, true);
  lock([[0.41, 14.27, 0.61], [0.78, 13.99, 0.78], [1.06, 13.4, 0.46], [1.19, 12.78, 0.12], [1.12, 12.0, 0.03]], 0.075, 0.05, true);

  const gold = new THREE.MeshStandardMaterial({ color: "#d9b76f", metalness: 0.75, roughness: 0.25 });
  for (const side of [-1, 1]) {
    const earring = new THREE.Mesh(new THREE.TorusGeometry(0.10, 0.022, 8, 24), gold);
    earring.name = "GoldHoop";
    earring.position.set(side * 0.98, 12.78, 0.37);
    hair.add(earring);
  }

  hair.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
  character.add(hair);
  character.updateMatrixWorld(true);
  head.attach(hair);
}

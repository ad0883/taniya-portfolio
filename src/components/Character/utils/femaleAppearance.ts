import * as THREE from "three";

type ShapePoint = (point: THREE.Vector3) => void;

const skinColor = new THREE.Color("#d6a080");

/** Shape the mesh in its bind space without changing its animated skeleton. */
const reshapeMesh = (mesh: THREE.Mesh, shapePoint: ShapePoint) => {
  const geometry = mesh.geometry.clone();
  const position = geometry.getAttribute("position");
  const originalPosition = position.clone();
  const normal = geometry.getAttribute("normal");
  const originalNormal = normal?.clone();
  const original = new THREE.Vector3();
  const shaped = new THREE.Vector3();
  const target = new THREE.Vector3();
  const originalTarget = new THREE.Vector3();
  const sourceNormal = new THREE.Vector3();
  const shapedNormal = new THREE.Vector3();
  const targetNormal = new THREE.Vector3();
  const normalMatrix = new THREE.Matrix3();
  const center = new THREE.Vector3();
  const dx = new THREE.Vector3();
  const dy = new THREE.Vector3();
  const dz = new THREE.Vector3();

  const shapeNormal = (
    at: THREE.Vector3,
    source: THREE.Vector3,
    result: THREE.Vector3
  ) => {
    const epsilon = 0.001;
    center.copy(at);
    dx.copy(at).x += epsilon;
    dy.copy(at).y += epsilon;
    dz.copy(at).z += epsilon;
    shapePoint(center);
    shapePoint(dx);
    shapePoint(dy);
    shapePoint(dz);
    dx.sub(center).multiplyScalar(1 / epsilon);
    dy.sub(center).multiplyScalar(1 / epsilon);
    dz.sub(center).multiplyScalar(1 / epsilon);
    normalMatrix
      .set(dx.x, dy.x, dz.x, dx.y, dy.y, dz.y, dx.z, dy.z, dz.z)
      .invert()
      .transpose();
    result.copy(source).applyMatrix3(normalMatrix).normalize();
  };

  for (let index = 0; index < position.count; index += 1) {
    original.fromBufferAttribute(originalPosition, index);
    shaped.copy(original);
    shapePoint(shaped);
    position.setXYZ(index, shaped.x, shaped.y, shaped.z);

    // Keep the model's authored smooth normals across its UV seams. Rebuilding
    // normals from split vertices introduces visible ridges on the face.
    if (normal && originalNormal) {
      sourceNormal.fromBufferAttribute(originalNormal, index);
      shapeNormal(original, sourceNormal, shapedNormal);
      normal.setXYZ(index, shapedNormal.x, shapedNormal.y, shapedNormal.z);
    }

    const positionMorphs = geometry.morphAttributes.position ?? [];
    for (let morphIndex = 0; morphIndex < positionMorphs.length; morphIndex += 1) {
      const morph = positionMorphs[morphIndex];
      target.fromBufferAttribute(morph, index);
      if (geometry.morphTargetsRelative) target.add(original);
      originalTarget.copy(target);
      shapePoint(target);
      // Preserve blinking: a relative target is F(base + delta) - F(base).
      // Applying F directly to a delta would distort the eyelid animation.
      if (geometry.morphTargetsRelative) target.sub(shaped);
      morph.setXYZ(index, target.x, target.y, target.z);

      const morphNormal = geometry.morphAttributes.normal?.[morphIndex];
      if (morphNormal && originalNormal) {
        targetNormal.fromBufferAttribute(morphNormal, index);
        if (geometry.morphTargetsRelative) targetNormal.add(sourceNormal);
        shapeNormal(originalTarget, targetNormal, targetNormal);
        if (geometry.morphTargetsRelative) targetNormal.sub(shapedNormal);
        morphNormal.setXYZ(index, targetNormal.x, targetNormal.y, targetNormal.z);
      }
    }
  }

  position.needsUpdate = true;
  if (normal) normal.needsUpdate = true;
  for (const morph of geometry.morphAttributes.position ?? []) {
    morph.needsUpdate = true;
  }
  for (const morph of geometry.morphAttributes.normal ?? []) {
    morph.needsUpdate = true;
  }

  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  mesh.geometry = geometry;
};

const shapeFace: ShapePoint = (point) => {
  const y = point.y;
  const lowerFace = 1 - THREE.MathUtils.smoothstep(y, 12, 13.3);
  // Use broad, shared proportions rather than local changes around the eyes
  // or mouth, keeping all facial parts and their expressive topology aligned.
  point.x *= 0.91 * (1 - lowerFace * 0.05);
  point.y += (13.25 - y) * lowerFace * 0.1;
  point.z *= 0.98;
};

const makeSkinMaterial = () =>
  new THREE.MeshStandardMaterial({
    name: "Taniya skin",
    color: skinColor,
    roughness: 0.68,
    metalness: 0,
    side: THREE.DoubleSide,
  });

const colorFace = (mesh: THREE.Mesh) => {
  const position = mesh.geometry.getAttribute("position");
  const colors = new Float32Array(position.count * 3);
  const cheekColor = new THREE.Color("#c88373");
  const color = new THREE.Color();

  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const y = position.getY(index);
    const z = position.getZ(index);
    const cheek =
      Math.exp(
        -Math.pow((Math.abs(x) - 0.61) / 0.24, 2) -
          Math.pow((y - 12.95) / 0.22, 2)
      ) * THREE.MathUtils.smoothstep(z, 0.35, 0.75);
    color.copy(skinColor).lerp(cheekColor, cheek * 0.17);
    color.toArray(colors, index * 3);
  }

  // Replace the original painted facial shadows, including its vertex colors,
  // instead of carrying those baked features into the new appearance.
  mesh.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = makeSkinMaterial();
  material.color.set("#ffffff");
  material.vertexColors = true;
  mesh.material = material;
};

export const customizeFemaleAppearance = (character: THREE.Object3D): void => {
  for (const name of ["CAP001", "CAP002", "Hair"]) {
    const mesh = character.getObjectByName(name);
    if (mesh) mesh.visible = false;
  }

  const face = character.getObjectByName("Face002");
  if (face instanceof THREE.Mesh) {
    reshapeMesh(face, shapeFace);
    colorFace(face);
  }

  const teeth = character.getObjectByName("Teeth001");
  if (teeth instanceof THREE.Mesh) reshapeMesh(teeth, shapeFace);

  const eyes = character.getObjectByName("EYEs001");
  if (eyes instanceof THREE.Mesh) reshapeMesh(eyes, shapeFace);

  const eyebrows = character.getObjectByName("Eyebrow");
  if (eyebrows instanceof THREE.Mesh) {
    reshapeMesh(eyebrows, (point) => {
      const alongBrow = THREE.MathUtils.clamp(
        (Math.abs(point.x) - 0.15) / 0.59,
        0,
        1
      );
      point.y =
        13.64 +
        (point.y - 13.64) * 0.28 +
        0.085 * Math.sin(alongBrow * Math.PI) -
        alongBrow * 0.018;
      point.x *= 0.96;
      shapeFace(point);
    });
    eyebrows.material = new THREE.MeshStandardMaterial({
      name: "Taniya eyebrows",
      color: "#38251f",
      roughness: 0.83,
      metalness: 0,
      side: THREE.DoubleSide,
    });
  }

  const ears = character.getObjectByName("Ear001");
  if (ears instanceof THREE.Mesh) {
    reshapeMesh(ears, (point) => {
      point.x =
        Math.sign(point.x) * (1.01 + (Math.abs(point.x) - 1.03) * 0.35);
      point.y = 13.17 + (point.y - 13.17) * 0.72;
      point.z = 0.12 + (point.z - 0.12) * 0.9;
    });
    ears.material = makeSkinMaterial();
  }

  for (const name of ["Hand", "Neck"]) {
    const mesh = character.getObjectByName(name);
    if (mesh instanceof THREE.Mesh) mesh.material = makeSkinMaterial();
  }

  const shirt = character.getObjectByName("BODYSHIRT");
  shirt?.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.material = new THREE.MeshStandardMaterial({
      name: "Taniya teal shirt",
      color: "#376e73",
      roughness: 0.86,
      metalness: 0,
    });
  });

  const trousers = character.getObjectByName("Pant");
  if (trousers instanceof THREE.Mesh) {
    trousers.material = new THREE.MeshStandardMaterial({
      name: "Taniya charcoal trousers",
      color: "#242b35",
      roughness: 0.88,
      metalness: 0,
    });
  }
};

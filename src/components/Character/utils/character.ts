import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";
import { customizeFemaleAppearance } from "./femaleAppearance";
import { addFemaleHair } from "./femaleHair";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = async (): Promise<GLTF> => {
    const encryptedBlob = await decryptFile(
      "/models/character.enc?v=2",
      "MyCharacter12"
    );
    const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

    try {
      const gltf = await loader.loadAsync(blobUrl);
      const character = gltf.scene;
      customizeFemaleAppearance(character);
      addFemaleHair(character);
      character.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.frustumCulled = true;
        }
      });
      await renderer.compileAsync(character, camera, scene);
      setCharTimeline(character, camera);
      setAllTimeline();
      character.getObjectByName("footR")!.position.y = 3.36;
      character.getObjectByName("footL")!.position.y = 3.36;
      return gltf;
    } finally {
      URL.revokeObjectURL(blobUrl);
      dracoLoader.dispose();
    }
  };

  return { loadCharacter };
};

export default setCharacter;

import { ViewerApp, IMaterial, Mesh } from "webgi";

export function findFirstMaterial(viewer: ViewerApp): IMaterial | undefined {
  let found: IMaterial | undefined;

  viewer.scene.traverse((obj: any) => {
    if (found) return true;

    if (obj instanceof Mesh) {
      const mats: IMaterial[] = Array.isArray(obj.material) ? obj.material : [obj.material];
      if (mats.length > 0) {
        found = mats[0];
        console.log(`Found material: ${found.name}, Type: ${found.constructor.name}`);
        return true;
      }
    }
  });

  if (!found) console.warn("No material found in GLB");
  return found;
}

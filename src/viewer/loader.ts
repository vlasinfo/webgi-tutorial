import { AssetManagerPlugin, AssetImporter } from "webgi";
import gsap from "gsap";

export function setupLoader(
  manager: AssetManagerPlugin,
  onComplete: () => void
) {
  const importer = manager.importer as AssetImporter;

  importer.addEventListener("onProgress", (ev: any) => {
    const progressRatio = ev.total ? ev.loaded / ev.total : 0;
    document.querySelector(".progress")?.setAttribute(
      "style",
      `transform: scaleX(${progressRatio})`
    );
  });

  importer.addEventListener("onLoad", () => {
    gsap.to(".loader", {
      x: "100%",
      duration: 0.8,
      ease: "power4.inOut",
      delay: 1,
      onComplete,
    });
  });
}

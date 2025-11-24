import gsap from "gsap";
import { ctx } from "../core/context";
import { onUpdate } from "../utils/gsapHelpers";
import { stopLenis, startLenis } from "../utils/lenis";

export function setupCustomizer() {
  const { dom, position, target, camera } = ctx;
  if (!dom.sections || !dom.mainContainer || !dom.exitButton || !dom.customizerInterface || !position || !target || !camera) return;

  const customizeBtn = document.querySelector(".button--customize") as HTMLElement;

  customizeBtn?.addEventListener("click", () => {
    dom.sections!.style.display = "none";
    dom.mainContainer!.style.pointerEvents = "all";
    document.body.style.cursor = "grab";
    stopLenis();

    gsap.to(position!, { x: -2.6, y: 0.2, z: -9.6, duration: 2, ease: "power3.inOut", onUpdate });
    gsap.to(target!, {
      x: -0.15,
      y: 1.18,
      z: 0.12,
      duration: 2,
      ease: "power3.inOut",
      onUpdate,
      onComplete: enableControllers,
    });
  });

  function enableControllers() {
    dom.exitButton!.style.display = "block";
    dom.customizerInterface!.style.display = "block";
    camera!.setCameraOptions({ controlsEnabled: true });
  }

  dom.exitButton!.addEventListener("click", () => {
    gsap.to(position!, { x: -3.4, y: 9.6, z: 1.71, duration: 1, ease: "power3.inOut", onUpdate });
    gsap.to(target!, { x: -1.5, y: 2.13, z: -0.4, duration: 1, ease: "power3.inOut", onUpdate });

    camera!.setCameraOptions({ controlsEnabled: false });
    dom.sections!.style.display = "contents";
    dom.mainContainer!.style.pointerEvents = "none";
    document.body.style.cursor = "default";
    dom.exitButton!.style.display = "none";
    dom.customizerInterface!.style.display = "none";
    startLenis();
  });
}

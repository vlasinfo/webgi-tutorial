import gsap from "gsap";
import { ctx } from "../core/context";

export function onUpdate() {
  if (!ctx.viewer) return;
  ctx.needsUpdate = true;
  ctx.viewer.setDirty();
}

// Common ScrollTrigger config helper (optional to keep code DRY)
export function stConfig(trigger: string, start = "top bottom", end = "top top") {
  return {
    trigger,
    start,
    end,
    scrub: true,
    immediateRender: false,
  } as const;
}

// Utility to animate vectors with gsap and mark updates
export function animateVector(targetObj: any, to: Partial<{ x: number; y: number; z: number }>, config: gsap.TweenVars = {}) {
  return gsap.to(targetObj, { ...to, ...config, onUpdate });
}

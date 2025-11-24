import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ctx } from "../core/context";
import { onUpdate, stConfig } from "../utils/gsapHelpers";

gsap.registerPlugin(ScrollTrigger);

export function setupScrollAnimations() {
  if (!ctx.position || !ctx.target) return;

  const tl = gsap.timeline();

  // First section transition (to .second)
  tl.to(ctx.position, {
    x: ctx.isMobile ? -6 : 1.56,
    y: ctx.isMobile ? 5.5 : -2.26,
    z: ctx.isMobile ? -3.3 : -3.85,
    scrollTrigger: stConfig(".second"),
    onUpdate,
  })
    .to(".section--one--container", {
      xPercent: -150,
      opacity: 0,
      scrollTrigger: {
        ...stConfig(".second", "top bottom", "top 80%"),
        scrub: 1,
      },
    })
    .to(ctx.target, {
      x: ctx.isMobile ? -1.1 : -1.37,
      y: ctx.isMobile ? 1.0 : 1.99,
      z: ctx.isMobile ? -0.1 : -0.37,
      scrollTrigger: stConfig(".second"),
    })
    // Second section transition (to .third)
    .to(ctx.position, {
      x: -3.4,
      y: 9.6,
      z: 1.71,
      scrollTrigger: stConfig(".third"),
      onUpdate,
    })
    .to(ctx.target, {
      x: -1.5,
      y: 2.13,
      z: -0.4,
      scrollTrigger: stConfig(".third"),
    });
}

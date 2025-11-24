import { ctx } from "../core/context";

export function setupButtons() {
  // Hero button scroll to .second
  document.querySelector(".button--hero")?.addEventListener("click", () => {
    const element = document.querySelector(".second") as HTMLElement | null;
    const top = element ? element.getBoundingClientRect().top + window.scrollY : 0;
    window.scrollTo({ top, left: 0, behavior: "smooth" });
  });

  // Footer buttons scroll to top
  document.querySelectorAll(".button--footer")?.forEach((item) => {
    item.addEventListener("click", () => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    });
  });
}

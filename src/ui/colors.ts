import { Color } from "webgi";
import { ctx } from "../core/context";

function changeColor(_color: Color) {
  const mat = ctx.drillMaterial;
  if (!mat) return;

  // Kt material support
  if (typeof (mat as any).setValue === "function") {
    (mat as any).setValue("baseColor", _color);
  }
  // Other materials with color property
  else if ("color" in mat) {
    (mat as any).color = _color;
  }

  ctx.viewer?.scene.setDirty();
}

export function setupColors() {
  document.querySelector(".button--colors.black")?.addEventListener("click", () =>
    changeColor(new Color(0x383830).convertSRGBToLinear())
  );
  document.querySelector(".button--colors.red")?.addEventListener("click", () =>
    changeColor(new Color(0xfe2d2d).convertSRGBToLinear())
  );
  document.querySelector(".button--colors.yellow")?.addEventListener("click", () =>
    changeColor(new Color(0xffffff).convertSRGBToLinear())
  );
}

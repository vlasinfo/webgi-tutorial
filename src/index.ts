import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    BloomPlugin,
    GammaCorrectionPlugin,
    IMaterial,
    mobileAndTabletCheck,
    Vector3,
    Color,
    Mesh,
    AssetImporter
} from "webgi";

// import "./styles.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { AmbientLight, DirectionalLight } from "three";

gsap.registerPlugin(ScrollTrigger);

// -------------------------------------
// Lenis Smooth Scroll
// -------------------------------------
const lenis: Lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: "vertical",
  gestureDirection: "vertical",
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

lenis.stop();

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// -------------------------------------
// Setup Viewer
// -------------------------------------
async function setupViewer() {
  const canvas = document.getElementById("webgi-canvas") as HTMLCanvasElement;
  if (!canvas) throw new Error("Canvas #webgi-canvas not found");

  const viewer = new ViewerApp({ canvas });
  const isMobile = mobileAndTabletCheck();
  const manager = await viewer.addPlugin(AssetManagerPlugin);

  const camera = viewer.scene.activeCamera!;
  const position = camera.position;
  const target = camera.target;

  const exitButton = document.querySelector(".button--exit") as HTMLElement;
  const customizerInterface = document.querySelector(".customizer--container") as HTMLElement;

  // -------------------------------------
  // Plugins
  // -------------------------------------
  await viewer.addPlugin(GBufferPlugin);
  await viewer.addPlugin(new ProgressivePlugin(32));
  await viewer.addPlugin(TonemapPlugin, { exposure: 1 });
  await viewer.addPlugin(GammaCorrectionPlugin);
  await viewer.addPlugin(SSRPlugin);
  await viewer.addPlugin(SSAOPlugin);
  await viewer.addPlugin(BloomPlugin);
  viewer.renderer.refreshPipeline();

  // -------------------------------------
  // Add Lights
  // -------------------------------------
  const ambientLight = new AmbientLight(0xffffff, 0.5);
  viewer.scene.add(ambientLight);

  const directionalLight = new DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1000, 10, 10);
  viewer.scene.add(directionalLight);

  // Optional: Use HDRI environment if you have one
  // await viewer.scene.setEnvironment("./assets/env.hdr");

  // -------------------------------------
  // Loader
  // -------------------------------------
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
      onComplete: () => {
        document.body.style.overflowY = "auto";
        lenis.start();
      },
    });
  });

  // -------------------------------------
  // Load GLB
  // -------------------------------------
  await manager.addFromPath("./assets/drill3.glb");

  // -------------------------------------
  // Find first material in scene
  // -------------------------------------
  let drillMaterial: IMaterial | undefined;
  viewer.scene.traverse((obj: any) => {
    if (drillMaterial) return true;
    if (obj instanceof Mesh) {
      const mats: IMaterial[] = Array.isArray(obj.material) ? obj.material : [obj.material];
      if (mats.length > 0) {
        drillMaterial = mats[0];
        console.log(`Found material: ${drillMaterial.name}, Type: ${drillMaterial.constructor.name}`);
        return true;
      }
    }
  });

  if (!drillMaterial) console.warn("No material found in GLB");

  viewer.getPlugin(TonemapPlugin)!.config!.clipBackground = true;
  viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });

  if (!isMobile) {
    position.set(-3.5, -1.1, 5.5);
    target.set(-0.8, 1.55, -0.7);
    camera.setCameraOptions({ fov: 40 });
  }

  window.scrollTo(0, 0);

  // -------------------------------------
  // Scroll Animations
  // -------------------------------------
  let needsUpdate = true;
  function onUpdate() {
    needsUpdate = true;
    viewer.setDirty();
  }

  viewer.addEventListener("preFrame", () => {
    if (needsUpdate) {
      camera.positionTargetUpdated(true);
      needsUpdate = false;
    }
  });

  function setupScrollAnimation() {
    const tl = gsap.timeline();

    tl.to(position, {
      x: isMobile ? -6 : 1.56,
      y: isMobile ? 5.5 : -2.26,
      z: isMobile ? -3.3 : -3.85,
      scrollTrigger: {
        trigger: ".second",
        start: "top bottom",
        end: "top top",
        scrub: true,
        immediateRender: false,
      },
      onUpdate,
    })
      .to(
        ".section--one--container",
        {
          xPercent: "-150",
          opacity: 0,
          scrollTrigger: {
            trigger: ".second",
            start: "top bottom",
            end: "top 80%",
            scrub: 1,
            immediateRender: false,
          },
        }
      )
      .to(target, {
        x: isMobile ? -1.1 : -1.37,
        y: isMobile ? 1.0 : 1.99,
        z: isMobile ? -0.1 : -0.37,
        scrollTrigger: {
          trigger: ".second",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
        },
      })
      .to(position, {
        x: -3.4,
        y: 9.6,
        z: 1.71,
        scrollTrigger: {
          trigger: ".third",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
        },
        onUpdate,
      })
      .to(target, {
        x: -1.5,
        y: 2.13,
        z: -0.4,
        scrollTrigger: {
          trigger: ".third",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
        },
      });
  }

  setupScrollAnimation();

  // -------------------------------------
  // Buttons
  // -------------------------------------
  document.querySelector(".button--hero")?.addEventListener("click", () => {
    const element = document.querySelector(".second");
    window.scrollTo({
      top: element?.getBoundingClientRect().top ?? 0,
      left: 0,
      behavior: "smooth",
    });
  });

  document.querySelectorAll(".button--footer")?.forEach((item) => {
    item.addEventListener("click", () => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    });
  });

  // -------------------------------------
  // Customize Mode
  // -------------------------------------
  const sections = document.querySelector(".container") as HTMLElement;
  const mainContainer = document.getElementById("webgi-canvas-container") as HTMLElement;

  document.querySelector(".button--customize")?.addEventListener("click", () => {
    sections.style.display = "none";
    mainContainer.style.pointerEvents = "all";
    document.body.style.cursor = "grab";
    lenis.stop();

    gsap.to(position, { x: -2.6, y: 0.2, z: -9.6, duration: 2, ease: "power3.inOut", onUpdate });
    gsap.to(target, {
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
    exitButton.style.display = "block";
    customizerInterface.style.display = "block";
    viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: true });
  }

  exitButton.addEventListener("click", () => {
    gsap.to(position, { x: -3.4, y: 9.6, z: 1.71, duration: 1, ease: "power3.inOut", onUpdate });
    gsap.to(target, { x: -1.5, y: 2.13, z: -0.4, duration: 1, ease: "power3.inOut", onUpdate });

    viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });
    sections.style.display = "contents";
    mainContainer.style.pointerEvents = "none";
    document.body.style.cursor = "default";
    exitButton.style.display = "none";
    customizerInterface.style.display = "none";
    lenis.start();
  });

  // -------------------------------------
  // Color Buttons
  // -------------------------------------
  function changeColor(_color: Color) {
    if (!drillMaterial) return;

    // For Kt / PBR material
    if (typeof (drillMaterial as any).setValue === "function") {
        (drillMaterial as any).setValue("baseColor", _color);
    } 
    // Fallback for simple materials
    else if ("color" in drillMaterial) {
        (drillMaterial as any).color = _color;
    }

    viewer.scene.setDirty();
  }

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

setupViewer();

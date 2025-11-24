// viewer/plugins.ts
import {
  ViewerApp,
  GBufferPlugin,
  ProgressivePlugin,
  TonemapPlugin,
  GammaCorrectionPlugin,
  SSRPlugin,
  SSAOPlugin,
  BloomPlugin,
} from "webgi";

export async function setupPlugins(viewer: ViewerApp) {
  // Базові: завжди
  await viewer.addPlugin(GBufferPlugin);
  await viewer.addPlugin(new ProgressivePlugin(32));
  await viewer.addPlugin(TonemapPlugin, { exposure: 1 });
  await viewer.addPlugin(GammaCorrectionPlugin);
  await viewer.addPlugin(BloomPlugin);

  // Перевірка WebGL2 підтримки
  const supportsWebGL2 = !!(viewer.renderer as any).gl2;

  // Під’єднати SSR/SSAO тільки на WebGL2
  if (supportsWebGL2) {
    await viewer.addPlugin(SSRPlugin);
    await viewer.addPlugin(SSAOPlugin);
  }

  viewer.renderer.refreshPipeline();
}

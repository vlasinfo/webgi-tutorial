import {
  ViewerApp,
  AssetManagerPlugin,
  IMaterial,
  Camera
} from "webgi";

import { Vector3 } from "webgi";

type DOMRefs = {
  exitButton?: HTMLElement;
  customizerInterface?: HTMLElement;
  sections?: HTMLElement;
  mainContainer?: HTMLElement;
};

export const ctx: {
  viewer?: ViewerApp;
  manager?: AssetManagerPlugin;
  camera?: Camera;
  position?: Vector3;
  target?: Vector3;
  isMobile: boolean;
  needsUpdate: boolean;
  drillMaterial?: IMaterial;
  dom: DOMRefs;
} = {
  isMobile: false,
  needsUpdate: true,
  dom: {},
};

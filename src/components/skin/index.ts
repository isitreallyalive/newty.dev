import { CapeSource } from "$data";
import Skin from "./Skin.astro";

interface Player {
  uuid: string;
  cape?: CapeSource;
}

/**
 * Skin controls for the skin viewer
 */
export enum Controls {
  RotateVert = 1 << 0,
  RotateHori = 1 << 1,
  Zoom = 1 << 2,

  Rotate = RotateVert | RotateHori,
}

export function isControlEnabled(control: Controls, check?: Controls) {
  if (check === undefined) return true;
  return (check & control) === control;
}

export default Skin;

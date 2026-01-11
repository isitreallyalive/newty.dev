// stop complaining about importing .astro files
declare module "*.astro" {
  const Component: (props?: Record<string, any>) => any;
  export default Component;
}

declare module "*?uint8array" {
  const src: Uint8Array;
  export default src;
}

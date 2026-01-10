// stop complaining about importing .astro files
declare module "*.astro" {
  const Component: (props?: Record<string, any>) => any;
  export default Component;
}

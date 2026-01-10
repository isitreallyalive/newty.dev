# newty.dev

## development

until the [typography PR](https://github.com/catppuccin/tailwindcss/pull/45) is merged, you need to build the [@catppuccin/tailwindcss](https://github.com/catppuccin/tailwindcss) package locally. you can do so with the following commands:

```bash
cd ctp-tailwind/packages/catppuccin-tailwindcss
bun i
bun run build
```

then, in the root of this repo, reinstall dependencies to link the local package:

```bash
bun i
```

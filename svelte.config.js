import { vitePreprocess } from '@astrojs/svelte';

/**
 * @type {import('@sveltejs/vite-plugin-svelte').SvelteConfig}
 */
export default {
	preprocess: vitePreprocess({ script: true }),
	compilerOptions: {
		experimental: {
			async: true
		}
	}
};

import type { APIContext } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getContainerRenderer } from "@astrojs/mdx";
import { loadRenderers } from "astro:container";
import rss from "@astrojs/rss";
import { getPosts } from "$lib/helpers/blog";
import RSS from "$lib/components/RSS.astro";
import { render } from "astro:content";

export async function GET(context: APIContext) {
  const posts = await getPosts();
  const items = [];

  // mock Astro with MDX
  const container = await AstroContainer.create({
    renderers: await loadRenderers([getContainerRenderer()]),
  });

  for (const post of posts) {
    // render the content of the post with Astro
    const {
      data: { title, published },
      id,
    } = post;
    const html = await container.renderToString(RSS, { params: { id } });
    const {
      remarkPluginFrontmatter: { readingTime },
    } = await render(post);

    items.push({
      title,
      link: `/blog/${id}`,
      pubDate: published,
      content: html,
      customData: `
          <readingTime>${readingTime}</readingTime>
          ${published ? `<pubDateISO>${published.toISOString()}</pubDateISO>` : ""}
        `,
    });
  }

  const site = new URL(context.site ?? "https://newty.dev");

  return rss({
    title: site.hostname,
    description: "newt's personal blog",
    site,
    items,
    stylesheet: "/rss/feed.xsl",
  });
}

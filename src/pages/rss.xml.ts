import type { APIContext } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getContainerRenderer } from "@astrojs/mdx";
import { loadRenderers } from "astro:container";
import { getCollection } from "astro:content";
import rss from "@astrojs/rss";

export async function GET(context: APIContext) {
  const posts = await getCollection("blog");
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
    var formattedDate =
      (published?.toISOString() ?? "") +
      "+" +
      (published ? published.getTimezoneOffset() / 60 : "00") +
      ":00";

    items.push({
      title,
      link: `/blog/${id}`,
      pubDate: published,
      customData: `
        <pubDateISO>${published?.toISOString()}</pubDateISO>
      `,
      // description: post.data.description,
      // categories: data.tags,
      // content: html,
      // customData: `
      //     <minutesRead>${minutesRead}</minutesRead>
      //     ${data.published ? `<prettyPubDate>${formatDate(data.published)}</prettyPubDate>` : ""}
      //   `,
    });
  }

  return rss({
    title: "",
    description: "",
    site: context.site ?? "https://newty.dev",
    items,
    stylesheet: "/feed.xsl",
  });
}

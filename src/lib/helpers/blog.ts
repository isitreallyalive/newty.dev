import { getCollection } from "astro:content";

export async function getPosts(): Promise<ReturnType<typeof getCollection>> {
  const posts = await getCollection("blog");
  const now = Date.now();

  return posts
    .filter(({ data: { draft, published } }) => {
      if (draft !== undefined) return !draft; // draft takes precedence
      // hide future posts
      const publishedTime = published ? published.getTime() : 0;
      const isFuture = publishedTime > now;
      return !isFuture;
    })
    .sort((a, b) => {
      // sort by published date, most recent first
      const aTime = a.data.published ? a.data.published.getTime() : 0;
      const bTime = b.data.published ? b.data.published.getTime() : 0;
      return bTime - aTime;
    });
}

import type { RemarkPlugin } from "@astrojs/markdown-remark";
import { toString } from "mdast-util-to-string";
import getReadingTime from "reading-time";

const readingTime: RemarkPlugin =
  () =>
  (tree, { data }) => {
    const text = toString(tree);
    const time = getReadingTime(text);
    data!.astro!.frontmatter!.readingTime = time.text;
  };

export default readingTime;

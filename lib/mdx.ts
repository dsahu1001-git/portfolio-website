import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

export async function markdownToHtml(markdown: string) {
  const processed = await remark()
    .use(gfm)
    .use(html, { sanitize: false })
    .process(markdown);
  return processed.toString();
}

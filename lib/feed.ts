import type { Post } from "./content.ts"
import { escape } from "./html.ts"
import { site } from "./site.ts"

// 글 날짜는 한국 시간 자정으로 본다
const pubDate = (date: string) =>
  new Date(`${date}T00:00:00+09:00`).toUTCString()

const cdata = (value: string) =>
  `<![CDATA[${value.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`

export const rss = (posts: Post[]) => `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${escape(site.title)}</title>
<link>${site.url}/</link>
<description>${escape(site.description)}</description>
<language>${site.lang}</language>
<atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml"/>
${posts
  .map(post => {
    const url = `${site.url}/blog/${encodeURIComponent(post.slug)}/`
    return `<item>
<title>${escape(post.title)}</title>
<link>${url}</link>
<guid>${url}</guid>
<pubDate>${pubDate(post.date)}</pubDate>
${post.tags.map(tag => `<category>${escape(tag)}</category>`).join("")}
<description>${escape(post.description)}</description>
<content:encoded>${cdata(post.html)}</content:encoded>
</item>`
  })
  .join("\n")}
</channel>
</rss>
`

export const sitemap = (
  paths: string[],
) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map(p => `<url><loc>${escape(site.url + encodeURI(p))}</loc></url>`).join("\n")}
</urlset>
`

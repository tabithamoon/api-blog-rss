import { Hono } from 'hono'

const app = new Hono()

app.get('/', async (c) => {
  const posts = await c.env.DB.prepare(
    `
      SELECT *
      FROM Pages
      ORDER BY Serial DESC
      LIMIT 10
    `
  ).all()

  let rssBody =
`<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">  
  <channel>
    <title>Tabitha's Blog</title>
    <link>https://tabby.page</link>
    <description>The ramblings of a red panda on the internet</description>`
  
  posts.results.forEach(post => {
    rssBody = rssBody +  `
    <item>
      <title>${post.Title}</title>
      <link>https://tabby.page/posts/${post.Slug}</link>
    </item>`
  });

  rssBody = rssBody + `
  </channel>
</rss>`

  return c.text(rssBody, 200, {
    "Content-Type": "application/xml"
  })
})

export default app

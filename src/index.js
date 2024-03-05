import { Hono } from 'hono'

const app = new Hono()

app.get('/', async (c) => {
  let get = await fetch("https://posts.api.tabby.page/get/latest/10")
  const latestPosts = await get.json()

  let rssBody =
`<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">  
<channel>
  <title>Tabitha's Blog</title>
  <link>https://tabby.page</link>
  <description>The ramblings of a red panda on the internet</description>`
  
  latestPosts.forEach(post => {
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

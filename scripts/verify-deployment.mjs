import https from 'node:https';

const baseUrl = process.argv[2] || process.env.DEPLOYMENT_URL || 'https://premium-technology-news-magazine.8002salman.workers.dev';

function fetchUrl(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Testing live deployment at:', baseUrl);

  // 1. Article route
  const article = await fetchUrl('/ai/ai-power-bottleneck-data-centers');
  console.log('\n--- 1. Article Clean Route ---');
  console.log('Status:', article.statusCode);
  console.log('Has Title:', article.body.includes('<title>The new bottleneck in artificial intelligence'));
  console.log('Has Canonical:', article.body.includes('<link rel="canonical" href="https://premium-technology-news-magazine.8002salman.workers.dev/ai/ai-power-bottleneck-data-centers">'));
  console.log('Has NewsArticle schema:', article.body.includes('"@type":"NewsArticle"'));
  console.log('Has Pre-rendered Content:', article.body.includes('It is about electricity'));

  // 2. Real HTTP 404
  const notFound = await fetchUrl('/nonexistent-test-404-route');
  console.log('\n--- 2. Unmatched Route 404 ---');
  console.log('Status:', notFound.statusCode);
  console.log('X-Robots-Tag:', notFound.headers['x-robots-tag']);
  console.log('Has 404 page title:', notFound.body.includes('404 Not Found — Signal Desk'));

  // 3. Robots.txt
  const robots = await fetchUrl('/robots.txt');
  console.log('\n--- 3. robots.txt ---');
  console.log('Status:', robots.statusCode);
  console.log('Content-Type:', robots.headers['content-type']);
  console.log('Body:\n' + robots.body.trim());

  // 4. Sitemap.xml
  const sitemap = await fetchUrl('/sitemap.xml');
  console.log('\n--- 4. sitemap.xml ---');
  console.log('Status:', sitemap.statusCode);
  console.log('Has XML header:', sitemap.body.includes('<?xml version="1.0"'));
  console.log('Has clean article URLs:', sitemap.body.includes('/ai/ai-power-bottleneck-data-centers'));

  // 5. Sitemap-news.xml
  const newsMap = await fetchUrl('/sitemap-news.xml');
  console.log('\n--- 5. sitemap-news.xml ---');
  console.log('Status:', newsMap.statusCode);
  console.log('Has Google News schema:', newsMap.body.includes('xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"'));

  // 6. RSS feed
  const rss = await fetchUrl('/rss.xml');
  console.log('\n--- 6. rss.xml ---');
  console.log('Status:', rss.statusCode);
  console.log('Has RSS channel:', rss.body.includes('<rss version="2.0"'));
  console.log('Has items:', rss.body.includes('<item>') && rss.body.includes('The new bottleneck in artificial intelligence'));

  console.log('\nAll deployment endpoint verifications complete!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

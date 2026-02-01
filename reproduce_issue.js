const Parser = require('rss-parser');

const parser = new Parser();
const username = 'ivanxbt';
const url = `https://${username}.substack.com/feed`;

console.log(`Fetching from: ${url}`);

(async () => {
    try {
        const feed = await parser.parseURL(url);
        console.log(`Title: ${feed.title}`);
        console.log(`Items found: ${feed.items.length}`);
        if (feed.items.length > 0) {
            console.log('First item:', feed.items[0].title);
        }
    } catch (err) {
        console.error('Error fetching feed:', err);
    }
})();

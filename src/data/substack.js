import Parser from 'rss-parser';

const parser = new Parser();
const SUBSTACK_FEED = 'https://msmudassir.substack.com/feed';

export async function fetchSubstackPosts() {
  try {
    const feed = await parser.parseURL(SUBSTACK_FEED);
    return feed.items.map((item) => {
      // Estimate read time from content length
      const wordCount = (item['content:encoded'] || item.content || '').split(/\s+/).length;
      const readTime = Math.max(1, Math.round(wordCount / 250));

      // Extract first ~300 chars of text content for preview
      const textContent = (item['content:encoded'] || item.content || '')
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      const preview = textContent.substring(0, 280).trim() + (textContent.length > 280 ? '...' : '');

      // Format date
      const date = new Date(item.pubDate || item.isoDate || '');
      const formatted = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

      // Determine category from title/content keywords
      let category = 'Fintech';
      const title = (item.title || '').toLowerCase();
      const content = textContent.toLowerCase();
      if (title.includes('islamic') || title.includes('riba') || title.includes('riba') || content.includes('shariah')) {
        category = 'Islamic Finance';
      } else if (title.includes('payment') || title.includes('card') || content.includes('interchange')) {
        category = 'Payments';
      } else if (title.includes('review') || title.includes('gold card') || title.includes('arc')) {
        category = 'Product Review';
      }

      return {
        title: item.title || 'Untitled',
        url: item.link || '#',
        date: formatted,
        readTime: `${readTime} min`,
        preview,
        category,
        pubDate: date,
      };
    }).sort((a, b) => b.pubDate - a.pubDate);
  } catch (error) {
    console.error('Failed to fetch Substack RSS:', error);
    return [];
  }
}

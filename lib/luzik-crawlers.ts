// Preserve Next.js preview crawlers and send complete head metadata to search/AI bots.
// Regular browsers continue to receive streamed responses.
export const metadataCrawlerPattern = /bot|crawler|spider|[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|yandex|sogou|tumblr|vkShare|quora link preview|ia_archiver|facebookexternalhit|facebookcatalog|LinkedIn|Slack|Discord|WhatsApp|SkypeUriPreview|Yeti|googleweblight|ChatGPT-User|Claude-User|Perplexity-User/i;

const TOP50_NON_COUNTRY_DOMAINS = ['com', 'org', 'net', 'info', 'xyz', 'biz', 'club', 'online', 'pro', 'site', 'top', 'edu', 'shop', 'live', 'cat', 'gov', 'blog', 'asia', 'store', 'mobi', 'space', 'tech', 'website', 'app', 'news', 'life', 'fun', 'world', 'icu', 'vip', 'today', 'work', 'tokyo', 'media', 'one', 'travel', 'agency', 'guru', 'cloud', 'name', 'coop', 'xxx', 'design', 'win', 'global', 'link', 'nyc', 'digital', 'network', 'studio', 'chat'];

const TOP_TWO_LETTER_FILE_EXTENSIONS = ['js', 'db', 'cs', 'rm'];

const RE_FULL_URL = /\b_?(?:https?|ftp):\/\/[a-z0-9\-.]+\.([a-z]{2,10})(?::\d{4,5})?(?:\/[\wа-я\-/.?&%=#+;:,!~]*)?_?/gi;
const RE_LOCALHOST = /\b_?http:\/\/([a-z0-9\-]+)(?::\d{4,5})?(?:\/[\wа-я\-/.?&%=#+;:,!~]*)?_?/gi;
const RE_IP_ADDRESS = /\b_?https?:\/\/((?:\d{1,3}\.?){4})(?::\d{4,5})?(?:\/[\wа-я\-/.?&%=#+;:,!~]*)?_?/gi;
const RE_COUNTRY_DOMAIN = /\b_?[a-z0-9\-.]+\.([a-z]{2})(?::\d{4,5})?(?:\/[\wа-я\-/.?&%=#+;:,!~]*)?(?![a-z])_?/gi;
const RE_NON_COUNTRY_DOMAIN = /\b_?[a-z0-9\-.]+\.([a-z]{3,10})(?::\d{4,5})?(?:\/[\wа-я\-/.?&%=#+;:,!~]*)?_?/gi;
const RE_EMAIL_ADDRESS = /\b[\w.\-+]+@[a-z0-9.\-]+_?/gi;

let allExtractedUrls: string[] = [];
let allExtractedHtml: string[] = [];

function replaceLinksInText(text: string): string {
  const normalizedText = ` ${text || ''} `;

  const replacedText = normalizedText
    .replace(RE_FULL_URL, (match) => handleLinkReplacement(match))
    .replace(RE_IP_ADDRESS, (match) => handleLinkReplacement(match, ''))
    .replace(RE_LOCALHOST, (match) => handleLinkReplacement(match))
    .replace(RE_EMAIL_ADDRESS, (match) => handleLinkReplacement(match, 'mailto:'))
    .replace(RE_NON_COUNTRY_DOMAIN, (match, topLevelDomain) => {
      return TOP50_NON_COUNTRY_DOMAINS.includes(topLevelDomain.toLowerCase())
        ? handleLinkReplacement(match, 'http://')
        : match;
    })
    .replace(RE_COUNTRY_DOMAIN, (match, topLevelDomain) => {
      return !TOP_TWO_LETTER_FILE_EXTENSIONS.includes(topLevelDomain.toLowerCase())
        ? handleLinkReplacement(match, 'http://')
        : match;
    })
    .replace(/◆◆◆(\d+)\|([^◆]*)◆◆◆/g, (_match, index, urlPrefix) => {
      const currentUrl = allExtractedUrls[+index];
      return `<a href="${urlPrefix + currentUrl}" target="_blank" rel="noreferrer noopener">${currentUrl}</a>`;
    })
    .trim();

  allExtractedUrls = [];
  return replacedText;
}

function handleLinkReplacement(match: string, urlPrefix = ''): string {
  let normalizedMatch = match;
  let isWrappedWithUnderscore = false;
  if (normalizedMatch[0] === '_' && normalizedMatch[normalizedMatch.length - 1] === '_') {
    isWrappedWithUnderscore = true;
    normalizedMatch = normalizedMatch.replace(/^_/, '').replace(/_$/, '');
  }

  const [urlWithoutTrailingHtmlEntities, trailingHtmlEntities = ''] = normalizedMatch
    .replace(/(&quot;|&lt;|&gt;)/, '◆◆◆$1')
    .split('◆◆◆');
  const [urlWithoutTrailingSymbols, trailingSymbols = ''] = urlWithoutTrailingHtmlEntities
    .replace(/([^\wа-я\-/=]+)$/gi, '◆◆◆$1')
    .split('◆◆◆');

  allExtractedUrls.push(urlWithoutTrailingSymbols);
  const urlIndex = allExtractedUrls.length - 1;

  // Temporarily replace all URLs with placeholders surrounded by '◆◆◆'
  return `${isWrappedWithUnderscore ? '_' : ''
  }◆◆◆${urlIndex}|${urlPrefix}◆◆◆${
    trailingSymbols
  }${trailingHtmlEntities
  }${isWrappedWithUnderscore ? '_' : ''}`;
}

function replaceMarkdownWithHTML(markdown: string): string {
  const normalizedMarkdown = `\n\n${markdown || ''}\n\n`;

  const replacedMarkdown = normalizedMarkdown
    .replace(/<[a-z][^>]*>[^<]*<\/[a-z]+>/gi, (match) => handleHtmlReplacement(match))
    .replace(/★(?=[^ ])([^★\n]+)(?=[^ ])★/g, '<mark>$1</mark>')

  // Font formatting <b> & <i>
    .replace(/_(?=[^ ])([^_\n]+)(?=[^ ])_/g, '<i>$1</i>')
    .replace(/\*(?=[^ ])([^*\n]+)(?=[^ ])\*/g, '<b>$1</b>')

  // <ul> / <ol> - replacing leading spaces before list items
    .replace(/\n\s*\*/g, '\n*')
    .replace(/\n\s*(\d)\./g, '\n$1.')

  // Unordered list <ul>
    .replace(/^\*\s+([^\n]+)\n/gm, '<li>$1</li>')
    .replace(/([^>])<li>/g, '$1<ul><li>')
    .replace(/<\/li>([^<])/g, '</li></ul>$1')

  // Ordered list <ol>
    .replace(/^(\d{1,2})\.\s+([^\n]+)\n/gm, '<li data-markdown-counter="$1">$2</li>')
    .replace(/([^>])<li data-markdown-counter="(\d{1,2})">/g, '$1<ol><li data-markdown-counter="$2">')
    .replace(/<\/li>([^<])/g, '</li></ol>$1')

  // Paragraph <p>
    .replace(/^\s*(\n)?(.+)/gm, (match) => {
      return /<(\/)?(ul|ol|li|a)/.test(match) ? match : `<p>\n ${match.trim()} \n</p>`;
    })

  // Put back <a href...> HTML (that was extracted on the first step)
    .replace(/◆◆◆(\d+)◆◆◆/g, (_match, index) => {
      return allExtractedHtml[+index];
    })
    .trim();

  allExtractedHtml = [];
  return replacedMarkdown;
}

function handleHtmlReplacement(match: string): string {
  allExtractedHtml.push(match);
  const currentHtmlIndex = allExtractedHtml.length - 1;
  return `◆◆◆${currentHtmlIndex}◆◆◆`;
}

function sanitizeHTML(html: string): string {
  return (html || '')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function formatMarkdown(markdown: string): string {
  return replaceMarkdownWithHTML(
    replaceLinksInText(
      sanitizeHTML(markdown)
    )
  );
}

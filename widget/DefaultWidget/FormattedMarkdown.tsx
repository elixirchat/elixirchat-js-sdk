import React, { Component } from 'react';
import { cn } from '../../utilsCommon';


export class FormattedMarkdown extends Component {

  // For all existing non-country domain zones, see https://gist.github.com/egorvinogradov/d7d946a06e680d79723f12f4a1c697a7#file-all-non-country-domains-txt
  TOP50_NON_COUNTRY_DOMAINS = ['com', 'org', 'net', 'info', 'xyz', 'biz', 'club', 'online', 'pro', 'site', 'top', 'edu', 'shop', 'live', 'cat', 'gov', 'blog', 'asia', 'store', 'mobi', 'space', 'tech', 'website', 'app', 'news', 'life', 'fun', 'world', 'icu', 'vip', 'today', 'work', 'tokyo', 'media', 'one', 'travel', 'agency', 'guru', 'cloud', 'name', 'coop', 'xxx', 'design', 'win', 'global', 'link', 'nyc', 'digital', 'network', 'studio', 'chat'];
  TOP_TWO_LETTER_FILE_EXTENSIONS = ['js', 'db', 'cs', 'rm'];

  RE_FULL_URL = /\b_?(?:https?|ftp):\/\/[a-z0-9\-\.]+\.([a-z]{2,10})(?::[0-9]{4,5})?(?:\/[a-zа-я0-9\-_\/\.?&%=#+;:,!~]*)?_?/igm;
  RE_LOCALHOST = /\b_?(?:http):\/\/([a-z0-9\-]+)(?::[0-9]{4,5})?(?:\/[a-zа-я0-9\-_\/\.?&%=#+;:,!~]*)?_?/igm;
  RE_IP_ADDRESS = /\b_?(?:https?):\/\/((?:[0-9]{1,3}\.?){4})(?::[0-9]{4,5})?(?:\/[a-zа-я0-9\-_\/\.?&%=#+;:,!~]*)?_?/igm;
  RE_COUNTRY_DOMAIN = /\b_?[a-z0-9\-\.]+\.([a-z]{2})(?::[0-9]{4,5})?(?:\/[a-zа-я0-9\-_\/\.?&%=#+;:,!~]*)?(?![a-z])_?/igm;
  RE_NON_COUNTRY_DOMAIN = /\b_?[a-z0-9\-\.]+\.([a-z]{3,10})(?::[0-9]{4,5})?(?:\/[a-zа-я0-9\-_\/\.?&%=#+;:,!~]*)?_?/igm;
  RE_EMAIL_ADDRESS = /\b_?[a-z0-9\.\-_+]+@[a-z0-9\.\-]+_?/igm;

  allExtractedUrls = [];
  allExtractedHtml = [];

  shouldComponentUpdate(nextProps){
    return nextProps.markdown !== this.props.markdown;
  }

  replaceLinksInText = (text) => {
    text = ' ' + (text || '') + ' ';

    const replacedText = text
      .replace(this.RE_FULL_URL, (match, topLevelDomain, offset) => this.handleLinkReplacement(match, offset))
      .replace(this.RE_IP_ADDRESS, (match, topLevelDomain, offset) => this.handleLinkReplacement(match, offset, '', 1))
      .replace(this.RE_LOCALHOST, (match, topLevelDomain, offset) => this.handleLinkReplacement(match, offset))
      .replace(this.RE_EMAIL_ADDRESS, (match, topLevelDomain, offset) => this.handleLinkReplacement(match, offset, 'mailto:'))
      .replace(this.RE_NON_COUNTRY_DOMAIN, (match, topLevelDomain, offset) => {
        return this.TOP50_NON_COUNTRY_DOMAINS.includes(topLevelDomain.toLowerCase())
          ? this.handleLinkReplacement(match, offset, 'http://')
          : match;
      })
      .replace(this.RE_COUNTRY_DOMAIN, (match, topLevelDomain, offset) => {
        return !this.TOP_TWO_LETTER_FILE_EXTENSIONS.includes(topLevelDomain.toLowerCase())
          ? this.handleLinkReplacement(match, offset, 'http://')
          : match;
      })
      .replace(/◆◆◆([0-9]+)\|([^◆]*)◆◆◆/igm, (match, index, urlPrefix) => { // Put back URLs (that was extracted on the first step)
        const currentUrl = this.allExtractedUrls[+index];
        return `<a href="${urlPrefix + currentUrl}" target="_blank" rel="noreferrer noopener">${currentUrl}</a>`;
      })
      .trim();

    this.allExtractedUrls = [];
    return replacedText;
  };

  handleLinkReplacement = (match, offset, urlPrefix = '') => {
    let isWrappedWithUnderscore = false;
    if (match[0] === '_' && match[match.length - 1] === '_') {
      isWrappedWithUnderscore = true;
      match = match.replace(/^_/, '').replace(/_$/, '');
    }
    let [ urlWithoutTrailingHtmlEntities, trailingHtmlEntities = '' ] = match
      .replace(/(&quot;|&lt;|&gt;)/, '◆◆◆$1')
      .split('◆◆◆');
    let [ urlWithoutTrailingSymbols, trailingSymbols = '' ] = urlWithoutTrailingHtmlEntities
      .replace(/([^a-zа-я0-9\-_\/=]+)$/ig, '◆◆◆$1')
      .split('◆◆◆');

    this.allExtractedUrls.push(urlWithoutTrailingSymbols);
    const urlIndex = this.allExtractedUrls.length - 1;

    // Temporarily replace all URLs with placeholders surrounded by '◆◆◆'
    return (isWrappedWithUnderscore ? '_' : '')
      + `◆◆◆${urlIndex}|${urlPrefix}◆◆◆`
      + trailingSymbols
      + trailingHtmlEntities
      + (isWrappedWithUnderscore ? '_' : '');
  };

  replaceMarkdownWithHTML = (markdown) => {
    markdown = '\n\n' + (markdown || '') + '\n\n';

    const replacedMarkdown = markdown
    // Temporarily replace all HTML (e.g. links) with placeholders surrounded by '◆◆◆'
      .replace(/<[a-z]+[^>]*>[^<]*<\/[a-z]+>/igm, match => this.handleHtmlReplacement(match))

      // Замена спецсимвола, которым мы окружаем найденный текст
      .replace(/\★(?=[^ ])([^\★\n]+)(?=[^ ])\★/igm, '<mark>$1</mark>')

      // Font formatting <b> & <i>
      .replace(/_(?=[^ ])([^_\n]+)(?=[^ ])_/igm, '<i>$1</i>')
      .replace(/\*(?=[^ ])([^\*\n]+)(?=[^ ])\*/igm, '<b>$1</b>')

      // <ul> / <ol> - replacing leading spaces before list items
      .replace(/\n\s*\*/gm, '\n*')
      .replace(/\n\s*(\d)\./gm, '\n$1.')

      // Unordered list <ul>
      .replace(/^\*\s+([^\n]+)\n/gm, '<li>$1</li>')
      .replace(/([^>])<li>/gm, '$1<ul><li>')
      .replace(/<\/li>([^<])/gm, '</li></ul>$1')

      // Ordered list <ol>
      .replace(/^(\d{1,2})\.\s+([^\n]+)\n/gm, '<li data-markdown-counter="$1">$2</li>')
      .replace(/([^>])<li data-markdown-counter="(\d{1,2})">/gm, '$1<ol><li data-markdown-counter="$2">')
      .replace(/<\/li>([^<])/gm, '</li></ol>$1')

      // Paragraph <p>
      .replace(/^\s*(\n)?(.+)/igm, function(match){
        return  /<(\/)?(ul|ol|li|a)/.test(match) ? match : `<p>\n ${match.trim()} \n</p>`;
      })

      // Put back <a href...> HTML (that was extracted on the first step)
      .replace(/◆◆◆([0-9]+)◆◆◆/igm, (match, index) => {
        return this.allExtractedHtml[+index];
      })
      .trim();

    this.allExtractedHtml = [];
    return replacedMarkdown;
  };

  handleHtmlReplacement = (match) => {
    this.allExtractedHtml.push(match);
    const currentHtmlIndex = this.allExtractedHtml.length - 1;
    return `◆◆◆${currentHtmlIndex}◆◆◆`;
  };

  sanitizeHTML = (html) => {
    html = html || '';
    return html
      .replace(/</gm, '&lt;')
      .replace(/>/gm, '&gt;')
      .replace(/"/gm, '&quot;')
      .replace(/'/gm, '&apos;')
  };

  format = (markdown) => {
    return this.replaceMarkdownWithHTML(
      this.replaceLinksInText(
        this.sanitizeHTML(markdown)
      )
    )
  };

  render(){
    const { className, markdown, ...otherProps } = this.props;
    return (
      <span className={cn(className, 'elixirchat-formatted-markdown')} dangerouslySetInnerHTML={{
        __html: this.format(markdown)
      }} {...otherProps}/>
    );
  }
}

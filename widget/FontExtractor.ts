import { _flatten } from '../utilsCommon';

export interface IFontRule {
  fontFamily: string;
  fontWeight?: string;
  fontStyle?: string;
  src?: Array<IFontSrc>
}

export interface IFontSrc {
  format: string | null;
  url: string;
}

export class FontExtractor {

  public widgetConfigFonts: any = {};
  public parentWindow: Window = null;
  public serializedConfig: Array<IFontRule> = [];
  public parentFontFaceRules: Array<IFontRule> = [];

  constructor(widgetConfigFonts: any, parentWindow: Window){
    this.widgetConfigFonts = widgetConfigFonts;
    this.parentWindow = parentWindow;
  }

  public extract = (callback?: any) => {
    this.serializedConfig = (this.widgetConfigFonts || []).map(this.serializeFontRule);

    const fontsWithSrc = this.serializedConfig.filter(rule => rule.src?.length);
    const fontsWithoutSrc = this.serializedConfig.filter(rule => !rule.src?.length);

    if (!fontsWithoutSrc.length) {
      callback && callback(fontsWithSrc);
    }
    else {
      this.waitUntilWindowLoaded(this.parentWindow, () => {
        this.parentFontFaceRules = this.getParentFontFaceRules(this.parentWindow);
        const matchingParentFontRules = _flatten(
          fontsWithoutSrc.map(rule => {
            let lolo = this.findMatchingFontFaceRules(this.parentFontFaceRules, rule);
            // console.warn('__ lolo 2', { lolo, rule, fontsWithoutSrc });

            return lolo;
          })
        );
        callback && callback([ ...fontsWithSrc, ...matchingParentFontRules ]);
      });
    }
  };

  private serializeFontRule(rule: IFontRule) {
    const normalizeValue = (value) => {
      return (value || '').toString().trim().toLowerCase();
    };
    const fontFamily = normalizeValue(rule.fontFamily);
    const fontWeight = normalizeValue(rule.fontWeight);
    const fontStyle = normalizeValue(rule.fontStyle);
    const format = normalizeValue(rule.format) || 'woff';
    return {
      ...rule,
      fontFamily,
      fontWeight,
      fontStyle,
      format,
    };
  }

  private waitUntilWindowLoaded(targetWindow: Window, callback: (targetWindow: Window) => void): void {
    if (targetWindow.document.readyState === 'complete') {
      callback();
    }
    else {
      targetWindow.addEventListener('load', callback);
    }
  };

  private getParentFontFaceRules(targetWindow: Window): Array<IFontRule> {
    const fontFaceRules = [];

    for (let i = 0; i < targetWindow.document.styleSheets.length; i++) {
      const sheet = targetWindow.document.styleSheets[i];
      let rules;
      let linkHref;
      try {
        // Invoking properties on sheet sometimes causes an error
        rules = sheet.rules;
        linkHref = sheet.ownerNode.tagName === 'LINK' ? sheet.ownerNode.href : null;
      }
      catch (e) {}

      if (rules && linkHref) {
        for (let j = 0; j < rules.length; j++) {
          const rule = rules[j];
          if (rule instanceof CSSFontFaceRule) {
            const srcRelativePaths = this.parseFontSrc(rule.style.getPropertyValue('src'));
            const srcAbsolutePaths = this.convertSrcToAbsoluteUrls(srcRelativePaths, linkHref);

            fontFaceRules.push({
              fontFamily: rule.style.getPropertyValue('font-family').replace(/["']/ig, ''),
              fontWeight: rule.style.getPropertyValue('font-weight').toString(),
              fontStyle: rule.style.getPropertyValue('font-style'),
              src: srcAbsolutePaths,
              sheet,
            });
          }
        }
      }
    }
    return fontFaceRules;
  };

  private convertSrcToAbsoluteUrls(src: Array<IFontSrc>, baseUrl: string): Array<IFontSrc> {
    return src.map(srcItem => {
      let url = srcItem.url;
      if (!url.startsWith('data:') && !url.startsWith('blob:')) {
        url = new URL(srcItem.url, baseUrl).href;
      }
      return { ...srcItem, url };
    });
  };

  private parseFontSrc(srcStr: string): Array<IFontSrc> {
    const stripQuotes = str => {
      return str.replace(/^"?'?/i, '').replace(/"?'?$/i, '');
    };
    return srcStr
      .replace(/\)\s*,/igm, ')◆◆◆')
      .split('◆◆◆')
      .map(srcItem => srcItem.trim())
      .filter(srcItem => !srcItem.includes('local('))
      .map(srcItem => {
        let format = null;
        let url = '';
        if (srcItem.includes('format(')) {
          format = stripQuotes(srcItem.replace(/.*format\(([^)]+)\).*/i, '$1'));
        }
        if (srcItem.includes('url(')) {
          url = stripQuotes(srcItem.replace(/.*url\(([^)]+)\).*/i, '$1'));
        }
        return { format, url };
      });
  }

  private findMatchingFontFaceRules(fontList: Array<IFontRule>, params: IFontRule) :Array<IFontRule> {
    return fontList.filter(rawRule => {
      const rule = this.serializeFontRule(rawRule);
      const sameFamily = rule.fontFamily === params.fontFamily;
      const sameWeight = params.fontWeight ? rule.fontWeight === params.fontWeight : true;
      const sameStyle = params.fontStyle ? rule.fontStyle === params.fontStyle : true;

      // console.warn('__ ZZZ', { rawRule, params, sameFamily, sameWeight, sameStyle, rule });

      return sameFamily && sameWeight && sameStyle;
    });
  }
}


export function generateFontFaceCSS(rules: Array<IFontRule>){
  return (rules || [])
    .map(rule => {
      const srcString = (rule.src || '').map(srcItem => {
        return [
          `url("${srcItem.url}")`,
          srcItem.format ? `format("${srcItem.format}")` : '',
        ].join(' ');
      }).join(',\n');

      return `@font-face {
        font-family: "${rule.fontFamily}";
        ${rule.fontWeight ? `font-weight: ${rule.fontWeight};` : ''}
        ${rule.fontStyle ? `font-style: ${rule.fontStyle};` : ''}
        src: ${srcString};
      }`;
    }).join('\n');
}

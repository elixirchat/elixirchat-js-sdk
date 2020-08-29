import { ElixirChatWidget } from './ElixirChatWidget';
import { FONTS_EXTRACTED } from './ElixirChatWidgetEventTypes';
import {_flatten} from '../utilsCommon';

export interface IFontRule {
  fontFamily: string;
  fontWeight?: string;
  fontStyle?: string;
  src?: string;
  format?: string;
  cssText?: string;
}

export class FontExtractor {

  public serializedConfig: Array<IFontRule> = [];
  public parentFontFaceRules: Array<IFontRule> = [];

  constructor(elixirChatWidget: ElixirChatWidget, parentWindow: Window){
    const { widgetConfig, triggerEvent } = elixirChatWidget;
    this.serializedConfig = (widgetConfig.fonts || []).map(this.serializeFontRule);

    const fontsWithSrc = this.serializedConfig.filter(rule => rule.src);
    const fontsWithoutSrc = this.serializedConfig.filter(rule => !rule.src);
    const fontsWithSrcCSS = generateFontFaceCSS(fontsWithSrc);

    if (!fontsWithoutSrc.length) {
      triggerEvent(FONTS_EXTRACTED, fontsWithSrcCSS);
    }
    else {
      this.waitUntilWindowLoaded(() => {
        this.parentFontFaceRules = this.getParentFontFaceRules(parentWindow);
        const matchingParentFontFaceRules = _flatten(
          fontsWithoutSrc.map(rule => {
            return this.findMatchingFontFaceRules(this.parentFontFaceRules, rule);
          })
        );
        const matchingParentFontFaceCSS = matchingParentFontFaceRules.map(rule => rule.cssText).join('\n');
        triggerEvent(FONTS_EXTRACTED, fontsWithSrcCSS + '\n' + matchingParentFontFaceCSS);
      });
    }
  }

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

  private getParentFontFaceRules(parentDocument: Document): Array<IFontRule> {
    const fontFaceRules = [];

    for (let i = 0; i < parentDocument.styleSheets.length; i++) {
      const sheet = parentDocument.styleSheets[i];
      let rules;
      try {
        rules = sheet.rules;
      }
      catch (e) {}

      if (rules) {
        for (let j = 0; j < rules.length; j++) {
          const rule = rules[j];
          if (rule instanceof CSSFontFaceRule) {
            fontFaceRules.push({
              fontFamily: rule.style.getPropertyValue('font-family').replace(/["']/ig, ''),
              fontWeight: rule.style.getPropertyValue('font-weight').toString(),
              fontStyle: rule.style.getPropertyValue('font-style'),
              cssText: rule.cssText,
            });
          }
        }
      }
    }
    return fontFaceRules;
  };

  private findMatchingFontFaceRules(fontList: Array<IFontRule>, params: IFontRule) :Array<IFontRule> {
    return fontList.filter(font => {
      const sameFamily = font.fontFamily === params.fontFamily;
      const sameWeight = params.fontWeight ? font.fontWeight === params.fontWeight : true;
      const sameStyle = params.fontStyle ? font.fontStyle === params.fontStyle : true;
      return sameFamily && sameWeight && sameStyle;
    });
  }
}


export function generateFontFaceCSS(rules: Array<IFontRule>){
  return (rules || [])
    .map(rule => {
      // TODO: figure out base64/blob URLs etc
      //   const { contentType, data } = parseBase64DataUrl(fontUrl);
      //   const fontBlobUrl = base64toBlobUrl(data, contentType);

      return `@font-face {
        font-family: "${rule.fontFamily}";
        ${rule.fontWeight ? `font-weight: ${rule.fontWeight};` : ''}
        ${rule.fontStyle ? `font-style: ${rule.fontStyle};` : ''}
        src: url("${rule.src}") format("${rule.format}");
      }`;
    }).join('\n');
}

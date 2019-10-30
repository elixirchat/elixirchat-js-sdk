export interface IFontExtractorFont {
  cssText: string;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  src: Array<{ local: string } | { url: string, format: string }>;
}

export interface IFontExtractorExtractParams {
  fontFamily: string;
  fontWeight?: string;
  fontStyle?: string;
}

export class FontExtractor {

  public fonts: Array<IFontExtractorFont> = [];

  constructor(parentDocument: Document){
    this.fonts = this.getAllFontFaceRules(parentDocument);
  }

  public extract = (params: IFontExtractorExtractParams): Array<IFontExtractorExtractParams> => {
    return this.findMatchingFontFaceRules(this.fonts, params);
  };

  protected getAllFontFaceRules(parentDocument: Document): Array<IFontExtractorFont> {
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

  protected findMatchingFontFaceRules(fontList: Array<IFontExtractorFont>, params: IFontExtractorExtractParams) :Array<IFontExtractorFont> {
    return fontList.filter(font => {
      const sameFamily = font.fontFamily === params.fontFamily;
      const sameWeight = params.fontWeight ? font.fontWeight === params.fontWeight.toString() : true;
      const sameStyle = params.fontStyle ? font.fontStyle === params.fontStyle : true;
      return sameFamily && sameWeight && sameStyle;
    });
  }
}

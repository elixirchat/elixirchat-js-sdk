export function insertElement(tagName: string, attributes?: any, elementToAppendTo?: HTMLElement): HTMLElement {
  const element = document.createElement(tagName);
  if (typeof attributes === 'object') {
    for (let key in attributes) {
      element[key] = attributes[key];
    }
  }
  if (elementToAppendTo) {
    elementToAppendTo.appendChild(element);
  }
  return element;
}


export function inflect(locale: 'en-US' | 'ru-RU', number: number, endings: [string], hideNumber?: boolean): string {
  const getEnding = {};

  getEnding['en-US'] = (number, endings) => {
    return number === 1 ? endings[0] : endings[1];
  };

  getEnding['ru-RU'] = (number, endings) => {
    const cases = [2, 0, 1, 1, 1, 2];
    const endingIndex = (number % 100 > 4 && number % 100 < 20) ? 2 : cases[ Math.min(number % 10, 5) ];
    return endings[endingIndex];
  };

  const ending = getEnding[locale](number, endings) || endings[0];
  return hideNumber ? ending : number + ' ' + ending;
}


export function playNotificationSound(): void {
  const context = new AudioContext();
  const filter = context.createBiquadFilter();
  filter.type = 'notch';
  filter.frequency.value = 780;
  filter.Q.value = 1.5;
  filter.connect(context.destination);

  const gain1 = context.createGain();
  gain1.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1);
  gain1.connect(filter);

  const tone1 = context.createOscillator();
  tone1.frequency.value = 830.6;
  tone1.connect(gain1);
  tone1.start(0);
  tone1.stop(1.65);

  const gain2 = context.createGain();
  gain2.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1.5);
  gain2.connect(filter);

  const tone2 = context.createOscillator();
  tone2.frequency.value = 440;
  tone2.connect(gain2);
  tone2.start(0.15);
  tone2.stop(1.65);
}


export function generateFontFaceRule(fontFamily: string, fontWeight: string, fontUrl: string): string {
  return `@font-face {
    font-family: "${fontFamily}";
    font-weight: ${fontWeight};
    src: url("${fontUrl}") format("woff");
  }`;
}


export function replaceCssVariables(cssCode: string, variables: object): string {
  return cssCode.replace(/var\(--([a-z0-9_]+)\)/igm, (match, key) => {
    return variables[key];
  });
}


export function parseCssVariables(cssRuleCode: string): object {
  const cssVariables = {};
  cssRuleCode.trim()
    .replace(/^.*{/gm, '')
    .replace(/}$/, '')
    .split('--')
    .filter(line => /url\(/i.test(line))
    .forEach(line => {
      let [name, value] = line.trim().replace(/^([a-z0-9]+)\s*:\s*/i, '$1@@@').split('@@@');
      name = name.trim();
      value = value.trim().replace(/;$/, '');
      cssVariables[name] = value;
    });
  return cssVariables;
}


export function areCssVariablesSupported(): boolean {
  // Taken from Modernizr
  const supportsFn = (window.CSS && window.CSS.supports.bind(window.CSS)) || (window.supportsCSS);
  return !!supportsFn && (supportsFn('--f:0') || supportsFn('--f', 0));
}

// Localization — XML localization key-value pairs.
// Default XML embedded via Vite ?raw import, parsed at module scope.
// loadLocalizationFromUrl(url) available for runtime override via HabboRegistrationConfig.localization_url.

import defaultXml from './figure_editor.xml?raw';

let texts: Record<string, string> = {};

function parseXml(xml: string): void {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const keys = doc.getElementsByTagName("key");
  texts = {};
  for (let i = 0; i < keys.length; i++) {
    const name = keys[i].getAttribute("name");
    const value = keys[i].textContent;
    if (name && value) {
      texts[name] = value;
    }
  }
}

// Parse embedded default XML at module scope — strings available immediately
parseXml(defaultXml);

export async function loadLocalizationFromUrl(url: string): Promise<void> {
  const resp = await fetch(url);
  const xml = await resp.text();
  parseXml(xml);
}

export function getText(key: string): string {
  return texts[key] || key;
}

let texts: Record<string, string> = {};

export async function loadLocalization(url: string): Promise<void> {
  const resp = await fetch(url);
  const text = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/xml');
  const keys = doc.getElementsByTagName('key');
  texts = {};
  for (let i = 0; i < keys.length; i++) {
    const name = keys[i].getAttribute('name');
    const value = keys[i].textContent;
    if (name && value) {
      texts[name] = value;
    }
  }
}

export function getText(key: string): string {
  return texts[key] || key;
}

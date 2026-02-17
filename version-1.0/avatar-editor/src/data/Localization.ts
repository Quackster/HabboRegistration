let texts: Record<string, string> = {};

export async function loadLocalization(url: string): Promise<void> {
  const resp = await fetch(url);
  const xml = await resp.text();
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

export function getText(key: string): string {
  return texts[key] || key;
}

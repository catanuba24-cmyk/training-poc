const base = process.env.BASE_CONTENT_URL?.trim();

if (!base) {
  // Fail fast at build if not set on Vercel
  console.warn("⚠️ BASE_CONTENT_URL is not set. Set it in Vercel → Project → Settings → Environment Variables.");
}

export function contentURL(path: string) {
  if (!base) throw new Error("BASE_CONTENT_URL is missing");
  return `${base.replace(/\/+$/,"")}/${path.replace(/^\/+/,"")}`;
}

export async function fetchJSON<T>(url: string, revalidateSeconds = 60): Promise<T> {
  const r = await fetch(url, { next: { revalidate: revalidateSeconds } });
  if (!r.ok) throw new Error(`Fetch failed ${r.status} for ${url}`);
  return r.json() as Promise<T>;
}

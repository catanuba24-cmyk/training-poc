import Link from "next/link";
import { fetchJSON, contentURL } from "../lib/content";
import { getUserEntitlements } from "../lib/entitlements";

type Course = {
  id: string;
  slug: string;
  title: string;
  access_type: "free" | "paid" | "org";
  tags?: string[];
};

type IndexDoc = {
  courses: Course[];
  updated_at: string;
};

export default async function Page() {
  const { inOrg } = getUserEntitlements();
  const idx = await fetchJSON<IndexDoc>(contentURL("index.json"), 60);

  const visible = idx.courses.filter(c => c.access_type !== "org" || inOrg);

  return (
    <main>
      <h2>Catalog</h2>
      <ul>
        {visible.map(c => (
          <li key={c.slug} style={{ marginBottom: 12 }}>
            <b>{c.title}</b> — <i>{c.access_type}</i> — <Link href={`/course/${c.slug}`}>Open</Link>
          </li>
        ))}
      </ul>
      <hr />
      <p style={{opacity:.7}}>Index updated: {new Date(idx.updated_at).toLocaleString()}</p>
    </main>
  );
}

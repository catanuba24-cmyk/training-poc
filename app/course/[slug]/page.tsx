import { fetchJSON, contentURL } from "@/lib/content";
import { getUserEntitlements, canViewCourse } from "@/lib/entitlements";

type Manifest = {
  course_id: string;
  sections: { id: string; title: string; q_count: number; shards: { id: string; size: number }[] }[];
  content_version: string;
  updated_at: string;
};

type IndexDoc = {
  courses: {
    id: string;
    slug: string;
    title: string;
    access_type: "free" | "paid" | "org";
    preview_shards?: { section_id: string; shard_ids: string[] }[];
  }[];
};

async function getIndex() {
  return fetchJSON<IndexDoc>(contentURL("index.json"), 60);
}
async function getManifest(slug: string) {
  return fetchJSON<Manifest>(contentURL(`${slug}/manifest.json`), 60);
}
async function getShard(slug: string, sectionId: string, shardId: string) {
  const path = `${slug}/${sectionId}-${shardId}.json`;
  return fetchJSON<any>(contentURL(path), 60);
}

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const idx = await getIndex();
  const course = idx.courses.find(c => c.slug === params.slug);
  if (!course) return <div>Course not found.</div>;

  const { isPaid, inOrg } = getUserEntitlements();
  const allowed = canViewCourse(course.access_type, { isPaid, inOrg });

  const manifest = await getManifest(params.slug);

  if (!allowed) {
    if (course.access_type === "paid") {
      return (
        <div>
          <h2>{course.title}</h2>
          <p>This is a paid course. <a href="?pro=1">Simulate purchase</a></p>
          {course.preview_shards?.length ? (
            <>
              <h3>Preview</h3>
              {course.preview_shards.map(p => (
                <Shard key={p.section_id} slug={params.slug} sectionId={p.section_id} shardId={p.shard_ids[0]} />
              ))}
            </>
          ) : null}
        </div>
      );
    }
    if (course.access_type === "org") {
      return (
        <div>
          <h2>{course.title}</h2>
          <p>Organization access required. <a href="?org=acme">Simulate org sign-in</a></p>
        </div>
      );
    }
  }

  return (
    <div>
      <h2>{course.title}</h2>
      <p style={{opacity:.7}}>Updated: {new Date(manifest.updated_at).toLocaleString()}</p>

      {manifest.sections.map(sec => (
        <details key={sec.id} style={{ margin: "8px 0" }}>
          <summary>{sec.title} ({sec.q_count})</summary>
          {sec.shards.map(sh => (
            <div key={sh.id} style={{ margin: "8px 0", padding: "8px", border: "1px solid #eee" }}>
              <details>
                <summary>Load shard {sec.id}-{sh.id}</summary>
                {/* @ts-expect-error Async Server Component */}
                <Shard slug={params.slug} sectionId={sec.id} shardId={sh.id} />
              </details>
            </div>
          ))}
        </details>
      ))}
    </div>
  );
}

// Async Server Component: fetch shard server-side (keeps bundle tiny)
async function Shard({ slug, sectionId, shardId }: { slug: string; sectionId: string; shardId: string }) {
  const data = await getShard(slug, sectionId, shardId);
  if (!data?.items?.length) return <div>No items.</div>;

  return (
    <ul>
      {data.items.slice(0, 5).map((it: any) => (
        <li key={it.id}><b>{String(it.type).toUpperCase()}</b>: {it.stem}</li>
      ))}
      <li>…({data.items.length} in this shard)</li>
    </ul>
  );
}

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [result, setResult] = useState(null);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState(null);

  async function submit() {
    setError(null);
    setResult(null);
    setMeta(null);

    const payload = {
      content,
      ttl_seconds: ttl ? Number(ttl) : undefined,
      max_views: views ? Number(views) : undefined
    };

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
    } else {
      setResult(data.url);
      setMeta({
        ttl: ttl ? `${ttl} seconds` : "Unlimited",
        views: views ? views : "Unlimited"
      });
    }
  }

  return (
    <main style={{ padding: 20, maxWidth: 700 }}>
      <h1>Pastebin Lite</h1>

      <label><b>Paste Content</b></label>
      <textarea
        rows="8"
        style={{ width: "100%", marginTop: 5 }}
        placeholder="Paste content"
        value={content}
        onChange={e => setContent(e.target.value)}
      />

      <br /><br />

      <label><b>TTL (seconds)</b></label>
      <input
        type="number"
        min="1"
        placeholder="Optional"
        value={ttl}
        onChange={e => setTtl(e.target.value)}
        style={{ width: "100%" }}
      />

      <br /><br />

      <label><b>Max Views</b></label>
      <input
        type="number"
        min="1"
        placeholder="Optional"
        value={views}
        onChange={e => setViews(e.target.value)}
        style={{ width: "100%" }}
      />

      <br /><br />

      <button onClick={submit}>Create Paste</button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <p>
            <b>Paste URL:</b>{" "}
            <a href={result} target="_blank" rel="noreferrer">
              {result}
            </a>
          </p>
          <p><b>TTL:</b> {meta.ttl}</p>
          <p><b>Max Views:</b> {meta.views}</p>
        </div>
      )}

      {error && (
        <p style={{ color: "red", marginTop: 10 }}>
          {error}
        </p>
      )}
    </main>
  );
}

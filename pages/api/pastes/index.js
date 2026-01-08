import { createPaste } from "../../../lib/store";
import { now } from "../../../lib/time";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { content, ttl_seconds, max_views } = req.body || {};

  if (typeof content !== "string" || content.trim() === "") {
    return res.status(400).json({ error: "content must be non-empty string" });
  }

  if (
    ttl_seconds !== undefined &&
    (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
  ) {
    return res.status(400).json({ error: "ttl_seconds must be ≥ 1" });
  }

  if (
    max_views !== undefined &&
    (!Number.isInteger(max_views) || max_views < 1)
  ) {
    return res.status(400).json({ error: "max_views must be ≥ 1" });
  }

  const id = createPaste({
    content,
    ttlSeconds: ttl_seconds,
    maxViews: max_views,
    now: now(req)
  });

  res.status(201).json({
    id,
    url: `${req.headers.origin}/p/${id}`
  });
}

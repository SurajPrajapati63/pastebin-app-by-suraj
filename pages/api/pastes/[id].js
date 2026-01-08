import { getPaste } from "../../../lib/store";
import { now } from "../../../lib/time";

export default function handler(req, res) {
  // ✅ Allow only GET
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  // ✅ Validate ID
  if (!id || typeof id !== "string") {
    return res.status(404).json({ error: "Paste not found" });
  }

  // ✅ Count view ONLY for API fetch
  const paste = getPaste(id, now(req), true);

  if (!paste) {
    return res.status(404).json({ error: "Paste not found" });
  }

  return res.status(200).json({
    content: paste.content,
    remaining_views: paste.remainingViews,
    expires_at: paste.expiresAt
  });
}

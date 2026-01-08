import { v4 as uuid } from "uuid";

global.pastes = global.pastes || new Map();
const pastes = global.pastes;

export function healthCheck() {
  return true;
}

export function createPaste({ content, ttlSeconds, maxViews, now }) {
  const id = uuid();
  const expiresAt = ttlSeconds
    ? new Date(now.getTime() + ttlSeconds * 1000)
    : null;

  pastes.set(id, {
    id,
    content,
    createdAt: now,
    expiresAt,
    maxViews: maxViews ?? null,
    views: 0
  });

  return id;
}

export function getPaste(id, now, countView = true) {
  const paste = pastes.get(id);
  if (!paste) return null;

  if (paste.expiresAt && now >= paste.expiresAt) {
    pastes.delete(id);
    return null;
  }

  if (paste.maxViews !== null && paste.views >= paste.maxViews) {
    pastes.delete(id);
    return null;
  }

  if (countView) {
    paste.views += 1;
  }

  return {
    content: paste.content,
    remainingViews:
      paste.maxViews === null
        ? null
        : Math.max(paste.maxViews - paste.views, 0),
    expiresAt: paste.expiresAt
  };
}

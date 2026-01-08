import { getPaste } from "../../lib/store";
import { now } from "../../lib/time";

export async function getServerSideProps({ params, req, res }) {
  // ✅ Validate params
  if (!params || !params.id) {
    res.statusCode = 404;
    return { notFound: true };
  }

  // ❗ IMPORTANT: do NOT count views here
  const paste = getPaste(params.id, now(req), false);

  if (!paste) {
    res.statusCode = 404;
    return { notFound: true };
  }

  return {
    props: {
      content: paste.content
    }
  };
}

export default function PasteView({ content }) {
  return (
    <main style={{ padding: 20 }}>
      <pre style={{ whiteSpace: "pre-wrap" }}>
        {content}
      </pre>
    </main>
  );
}

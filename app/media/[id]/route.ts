import { isAuthed } from "@/lib/auth";
import { readUpload } from "@/lib/uploads";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return new Response("Sign in required.", { status: 401 });
  const { id } = await context.params;
  const file = await readUpload(id);
  if (!file) return new Response("Not found.", { status: 404 });
  return new Response(Buffer.from(file.bytes), {
    headers: {
      "Content-Type": file.contentType,
      "Cache-Control": "private, max-age=3600",
    },
  });
}

import { client } from "@/config/site";
import { isAuthed } from "@/lib/auth";
import { buildBooksCsv } from "@/lib/csv";
import { listClients, listExpenses, listJobs } from "@/lib/queries";
import { slugify } from "@/lib/utils";

export async function GET() {
  if (!(await isAuthed())) {
    return new Response("Sign in required.", { status: 401 });
  }
  const csv = buildBooksCsv(await listClients(), await listJobs(), await listExpenses());
  const filename = `${slugify(client.shortName)}-books.csv`;
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

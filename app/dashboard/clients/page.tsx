import { client } from "@/config/site";
import { setRecurring } from "@/lib/actions";
import { dashboardLevel } from "@/lib/catalog";
import { listClients, listQuotes } from "@/lib/queries";
import { ClientForm } from "@/components/client-form";

export default async function ClientsPage() {
  const level = dashboardLevel();
  const clients = await listClients();
  const quotes = await listQuotes();
  return (
    <div className="grid gap-4">
      <h1 className="font-display text-4xl font-bold">Clients</h1>
      <ClientForm level={level} />
      {clients.length === 0 ? (
        <p className="text-muted">No clients yet. Quote senders are added here automatically.</p>
      ) : (
        <ul className="grid gap-3">
          {clients.map((item) => {
            const count = quotes.filter((quote) => quote.client_id === item.id).length;
            return (
              <li key={item.id} className="rounded-lg border border-line bg-white p-4">
                <p className="text-lg font-semibold">
                  {item.name}
                  {item.business_name ? ` · ${item.business_name}` : ""}
                </p>
                <p className="text-sm text-muted">
                  {item.phone || "No phone"} · {item.email || "No email"} · {item.source === "quote" ? "From a quote" : "Added by hand"}
                  {count ? ` · ${count} quote${count === 1 ? "" : "s"}` : ""}
                </p>
                {item.notes ? <p className="mt-2 text-sm">{item.notes}</p> : null}
                {level === "B" ? (
                  <form action={setRecurring} className="mt-3 grid gap-2 rounded-md bg-paper p-3">
                    <input type="hidden" name="id" value={item.id} />
                    <label className="flex items-center gap-2 text-sm font-semibold">
                      <input type="checkbox" name="recurring" defaultChecked={item.recurring === 1} />
                      Recurring route
                    </label>
                    <input
                      name="schedule"
                      defaultValue={item.schedule}
                      placeholder="Standing schedule"
                      className="h-11 rounded-md border border-line bg-white px-3 text-base"
                    />
                    <button type="submit" className="h-10 rounded-md bg-brand px-3 text-sm font-semibold text-white">
                      Save route
                    </button>
                  </form>
                ) : item.recurring ? (
                  <p className="mt-2 text-sm">Recurring · {item.schedule}</p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
      <p className="text-xs text-muted">Books use the {client.timezone.replace("_", " ")} calendar.</p>
    </div>
  );
}

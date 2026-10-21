# Courier Websites — Template #1

Pre-built website and owner dashboard for a delivery business. The demo brand is **Summit Line Delivery LLC**: a 26-ft box truck with a liftgate and a high-roof Sprinter, working Southern California. A second sample, **Brightside Errands**, is a one-sedan business in Austin so you can see the small-vehicle site and the simpler dashboard.

Everything a client customizes lives in one config file. The public site and the dashboard both read that file. Nothing in the pages is hardcoded to Summit Line.

## Run it

Requires Node.js 22 or newer. With no database env vars, books are stored with Node’s built-in SQLite in `data/<client-id>.db`, and uploaded photos live in `data/uploads/`. Set the Postgres and Blob variables below to run the same app on Vercel.

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:4317](http://127.0.0.1:4317).

Production:

```bash
npm run build
npm start
```

`npm start` also listens on port 4317. Put a reverse proxy in front of it if you want port 80 or 443.

Set `SESSION_SECRET` before a public deploy. You can also set `DASHBOARD_EMAIL` and `DASHBOARD_PASSWORD` to override the login in the config file.

## Deploy on Vercel

Vercel serverless has no persistent disk, so SQLite files and `data/uploads/` do not survive there. The app switches storage from environment variables:

| Variable | When it is set |
| --- | --- |
| `DATABASE_URL` or `POSTGRES_URL` | Books go to Postgres. Leave both unset for local SQLite. Use the pooled connection string (Vercel Postgres `POSTGRES_URL`, or Neon’s pooled host). |
| `BLOB_READ_WRITE_TOKEN` | Quote photos, receipts, and delivery photos go to Vercel Blob, private, under `sites/<client-id>/`. Leave it unset to write `data/uploads/`. |
| `SESSION_SECRET` | Signs the dashboard cookie. Set a long random value in production. |
| `DASHBOARD_EMAIL` | Optional. Replaces the email in the client config. |
| `DASHBOARD_PASSWORD` | Optional. Replaces the password in the client config. |

Create a Postgres database (Vercel Postgres or Neon) and a Blob store, and add those variables to the Vercel project. Tables are created on boot. A fresh Postgres also gets Summit Line’s sample customer, quote, job, and fuel expense, so the Level B dashboard is not empty. Demo logins stay in the client config and keep working.

You can create the tables yourself before the first request:

```bash
DATABASE_URL="postgres://..." npm run db:setup
```

One Postgres database holds every brand. Each row has a `site_id` (the client config id, such as `summit-line` or `brightside-errands`). Queries only read the active site, so one brand’s customers never show up on another brand’s dashboard. Local SQLite still uses one file per client and stamps that same `site_id` on every row.

Photos are limited to 4 MB because Vercel’s request body cap is about 4.5 MB. A VPS with a real disk can keep using SQLite and `data/uploads/` by leaving `DATABASE_URL`, `POSTGRES_URL`, and `BLOB_READ_WRITE_TOKEN` unset. That disk has to survive restarts.

## Demo login

Summit Line (box truck + Sprinter, Level B):

- Email: `owner@summitlinedelivery.demo`
- Password: `summit-demo`
- Public phone: `(555) 013-2600`

Brightside Errands (sedan, Level A), after you switch the active client:

- Email: `owner@brightsideerrands.demo`
- Password: `brightside-demo`
- Public phone: `(555) 014-4188`

Both phones are obvious `(555)` placeholders. Change them before a real launch.

## Launch a new client

1. Duplicate `config/clients/summit-line.ts` (commercial) or `config/clients/brightside-errands.ts` (small vehicle). Name the file after the business.
2. Edit that file. It is the only place for:
   - business name, short name, owner line
   - logo path (optional — leave it off and the site draws a wordmark from the name)
   - two brand colors (`colors.primary` should be a dark color; `colors.accent` is the button color)
   - phone, email, domain, timezone
   - service area list and the paragraph for each area
   - vehicles, specs, photos, liftgate, pallet capacity, and renewal dates
   - services offered, in the order they should lead the site
   - gallery photos, reviews
   - insurance / DOT / MC, or `compliance: null` to hide that block
   - dashboard email and password
3. Point the site at the new file by changing the one export in `config/site.ts`:

```ts
export { client } from "./clients/your-client";
```

4. Restart `npm run dev` if the pages do not update on their own.
5. Search the running site for the previous business name. It should be gone.
6. Turn `showDemandNotes` off for a paying client. Demand badges and suggested rates are for the sales demo only. They are suggested starting points, not guaranteed pay. Do not add per-mile prices. This template does not invent them.

A filled intake form should be a pass through that one file. If you are still editing page components, the template is built wrong.

## Vehicle class and dashboard level

Each vehicle has a `class`:

`sedan` · `suv` · `minivan` · `pickup` · `cargo-van` · `sprinter` · `box-truck` · `hotshot`

The dashboard level is derived from those classes:

- **Level A** — one small vehicle (sedan, SUV, minivan, or a solo pickup) and no drivers listed. Quote requests, clients, a fast job log, expenses with a receipt photo, profit, and one-tap CSV.
- **Level B** — any cargo van, Sprinter, box truck, or hotshot, or two or more vehicles, or any driver on the roster. Everything in Level A, plus per-vehicle books, driver payouts, load details, proof-of-delivery photos, recurring route clients, a scale view, and insurance / registration / DOT / MC dates.

The site only shows services that at least one of the client’s vehicles can run, in the order of `servicesOffered`. A sedan config that lists pallets will still hide pallets. Lead with the services you want on the home page; the first four become the home cards.

Commercial home cards for this demo: Moving & Hauling, Furniture, Store Pickups, Pallets & Freight.

Small-vehicle home cards: Pharmacy / Medical, Grocery, Senior Errands, Courier.

## What v1 does not do

No live GPS. No route optimization. Invoicing and payment links are not on screen yet. The database already has an `invoices` table, and each job has `invoice_status` and `payment_url`, so that step can be added later without a new books system.

## What it costs to sell

Same split as the spec. Bigger operation, more tools, higher price.

| Buyer | Plan | Price |
| --- | --- | --- |
| Car, SUV, minivan, solo pickup | Launch (Level A) | $297 setup + $29/mo |
| Sprinter, box truck, hotshot | Pro (Level B) | $497 setup + $49/mo |
| Multi-vehicle / multi-driver | Fleet (Level B + priority support) | $997 setup + $99/mo |

Founding-10, if you offer it: small-vehicle Launch at $97 setup + $29/mo locked 12 months. Commercial founding spots, if offered, are $297 setup + $49/mo locked 12 months.

## Photo credits

Demo photos are real photographs, resized for the page. Replace them when a client has their own.

- Box truck: Elise240SX, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), via Wikimedia Commons. File: “2016 Hino 338 Box Truck in White, Front Left, 01-21-2023”.
- Sprinter: mark.mitchell.brown, [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/), via Flickr / Wikimedia Commons. File: “2010 Mercedes-Benz Sprinter 2500 Cargo Van (W906)”.
- Strapped pallets: heb, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), via Wikimedia Commons. File: “UNICEF pallets 02”.
- Warehouse loading, sedan, and grocery market: [Unsplash License](https://unsplash.com/license). Photo ids `1553413077-190dd305871c`, `1549317661-bd32c8ce0db2`, and `1542838132-92c53300491e`.

Resized copies stay under the same license as the original. Captions under the pictures are the on-site attribution.

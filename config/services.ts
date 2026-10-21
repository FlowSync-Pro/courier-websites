import type { ServiceId, VehicleClass } from "./types";

export type Demand = "VERY HIGH" | "HIGH" | "STEADY";

export type ServiceDef = {
  id: ServiceId;
  name: string;
  blurb: string;
  what: string;
  included: string[];
  demand: Demand | null;
  suggestedRate: string;
  vehicleClasses: VehicleClass[];
};

const ANY: VehicleClass[] = [
  "sedan",
  "suv",
  "minivan",
  "pickup",
  "cargo-van",
  "sprinter",
  "box-truck",
  "hotshot",
];

/**
 * Fixed menu from the Courier Websites template spec (FlowSync's 8 services
 * plus Store Pickups). A client site only renders rows their vehicles can run,
 * in the order listed on that client's config.
 * Rates are suggested starting points for quoting. They are not guaranteed pay,
 * and this file has no per-mile numbers.
 */
export const SERVICE_MENU: ServiceDef[] = [
  {
    id: "grocery",
    name: "Grocery Shopping & Delivery",
    blurb: "A list from the store, brought to the door.",
    what: "Shopping and delivery from the grocery stores people already use — Whole Foods, Costco, Trader Joe's, Kroger, Aldi, and the local market down the street.",
    included: [
      "In-store shopping from your list",
      "A text before any substitution",
      "Cold and pantry items kept apart",
      "Delivery to the door",
    ],
    demand: "VERY HIGH",
    suggestedRate: "$22–$34/hr",
    vehicleClasses: ANY,
  },
  {
    id: "food",
    name: "Food / Restaurant Delivery",
    blurb: "Restaurant pickup, then a direct drop-off.",
    what: "Prepared food picked up from the restaurant and driven straight to the person who ordered it.",
    included: [
      "Pickup from the restaurant",
      "Direct drop-off, no extra stops added",
      "Same-day timing",
      "A call or text when it is on the way",
    ],
    demand: "VERY HIGH",
    suggestedRate: "$18–$30/hr",
    vehicleClasses: ANY,
  },
  {
    id: "pharmacy",
    name: "Pharmacy / Medical",
    blurb: "Prescriptions and medical supplies, same day.",
    what: "Prescriptions, medical supplies, and emergency medication picked up at the pharmacy and handed to the person you name.",
    included: [
      "Pharmacy counter pickup",
      "Supplies and medication the pharmacy has released",
      "Handoff to the person you name",
      "Same day when the pharmacy has it ready",
    ],
    demand: "HIGH",
    suggestedRate: "$24–$38/hr",
    vehicleClasses: ["sedan", "suv", "minivan", "pickup"],
  },
  {
    id: "senior",
    name: "Senior Errands & Personal Shopping",
    blurb: "Grocery, pharmacy, and the list on the fridge.",
    what: "Errands for an older adult: grocery and pharmacy pickups, personal shopping, and a careful handoff at the door.",
    included: [
      "Grocery and pharmacy pickups",
      "Personal shopping from a list",
      "A text to the family contact you choose",
      "Unhurried drop-off at the door",
    ],
    demand: "HIGH",
    suggestedRate: "$22–$36/hr",
    vehicleClasses: ["sedan", "suv", "minivan"],
  },
  {
    id: "courier",
    name: "Courier / Package",
    blurb: "Small parcels and signature items, same day.",
    what: "Small parcels, legal documents, and signature items that need to move across town the same day.",
    included: [
      "Pickup and a direct drive",
      "Signature on request",
      "Same-day or a scheduled window",
      "A photo of the drop-off on request",
    ],
    demand: "STEADY",
    suggestedRate: "$20–$32/hr",
    vehicleClasses: ANY,
  },
  {
    id: "auto-parts",
    name: "Auto Parts Delivery",
    blurb: "Parts from the counter to the bay.",
    what: "Parts from NAPA, AutoZone, O'Reilly, and dealership parts counters, delivered to the shop or the driveway.",
    included: [
      "Counter pickup",
      "Delivery to the bay or the driveway",
      "Same day when the part is at the counter",
    ],
    demand: "STEADY",
    suggestedRate: "$20–$33/hr",
    vehicleClasses: ["sedan", "suv", "minivan", "pickup", "cargo-van", "sprinter"],
  },
  {
    id: "store-pickups",
    name: "Store Pickups",
    blurb: "Home Depot, Lowe's, Costco, and Sam's Club.",
    what: "Building materials, bulk orders, and appliances picked up at Home Depot, Lowe's, Costco, and Sam's Club and delivered to the job site or the door.",
    included: [
      "Store will-call and lot pickup",
      "Building materials, bulk orders, and appliances",
      "Delivery to the job site, warehouse, or door",
      "The quote names which vehicle is coming",
    ],
    demand: "HIGH",
    suggestedRate: "Quote per job",
    vehicleClasses: ANY,
  },
  {
    id: "furniture",
    name: "Furniture & Large Item Delivery",
    blurb: "Sofas, appliances, and pieces that need a truck.",
    what: "Sofas, appliances, and other large pieces that need a cargo van or a box truck, blanket-wrapped and delivered to the first door.",
    included: [
      "Blanket wrap",
      "Load and unload",
      "Delivery to the first door when the path is clear",
      "Capacity follows the truck's payload on the About page",
    ],
    demand: "HIGH",
    suggestedRate: "$35–$60/hr",
    vehicleClasses: ["cargo-van", "sprinter", "box-truck", "hotshot"],
  },
  {
    id: "moving",
    name: "Moving & Hauling",
    blurb: "Local moves and junk hauls, with a liftgate when you need it.",
    what: "Local moves and junk hauls for apartments, small offices, and the cleanout after a job. The box truck takes the big loads. The Sprinter takes the tight streets.",
    included: [
      "Load, transport, and unload",
      "Junk haul to the dump or donation drop you name",
      "Dump fees quoted with the job",
      "Liftgate on the box truck when the stop has no dock",
    ],
    demand: "HIGH",
    suggestedRate: "$40–$75/hr",
    vehicleClasses: ["sprinter", "box-truck"],
  },
  {
    id: "pallets",
    name: "Pallets & Freight",
    blurb: "Pallet freight and recurring runs between businesses.",
    what: "Palletized freight and recurring runs between warehouses, stores, and job sites. Quoted per load, scheduled or same day.",
    included: [
      "Dock or street pickup",
      "Liftgate when the receiver has no dock",
      "Pallet count and weight confirmed before the truck rolls",
      "One-off loads or a standing weekly schedule",
    ],
    demand: null,
    suggestedRate: "Quote per load",
    vehicleClasses: ["sprinter", "box-truck", "hotshot"],
  },
];

export function serviceById(id: string) {
  return SERVICE_MENU.find((service) => service.id === id);
}

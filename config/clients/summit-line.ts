import type { ClientConfig } from "../types";

export const client: ClientConfig = {
  id: "summit-line",
  legalName: "Summit Line Delivery LLC",
  shortName: "Summit Line",
  ownerLine: "Owner-operated. You talk to the owner, not a call center.",
  ownerOperated: true,
  headline: "Freight and pallet delivery for businesses — same-day and scheduled.",
  subline:
    "A 26-ft box truck with liftgate and a high-roof Sprinter, covering Los Angeles, Orange, Riverside, and San Bernardino counties.",
  servicesIntro: "The work this box truck and Sprinter actually do.",
  audienceHeading: "Who we deliver for",
  audiences: ["Warehouses", "Stores", "Contractors", "Manufacturers", "Medical suppliers"],
  phoneDisplay: "(555) 013-2600",
  phoneDigits: "15550132600",
  email: "hello@summitlinedelivery.demo",
  domain: "summitlinedelivery.demo",
  timezone: "America/Los_Angeles",
  colors: { primary: "#0E1C33", accent: "#FF5C1C" },
  seo: {
    title: "Summit Line Delivery — freight and pallet delivery in Southern California",
    description:
      "Owner-operated 26-ft box truck with liftgate and a high-roof Sprinter. Same-day and scheduled freight across Los Angeles, Orange, Riverside, and San Bernardino counties.",
  },
  showDemandNotes: true,
  servicesOffered: ["moving", "furniture", "store-pickups", "pallets", "courier", "food"],
  serviceArea: {
    region: "Southern California",
    intro:
      "Same-day and scheduled delivery across four counties. The box truck takes the docks. The Sprinter takes the tight streets and the smaller loads.",
    areas: [
      {
        name: "Los Angeles County",
        body: "Los Angeles County is the core of the route: warehouses in Vernon and Commerce, shops from downtown to the westside, and job sites from Long Beach up through the Valley. Dock deliveries go on the box truck. Furniture and tighter streets go on the Sprinter.",
      },
      {
        name: "Orange County",
        body: "Orange County covers Anaheim, Santa Ana, Irvine, and the coast. Most of the work is scheduled store and warehouse drops, with same-day when the dock can take the truck that morning.",
      },
      {
        name: "Riverside County",
        body: "Riverside and Corona are regular runs from Los Angeles warehouses, including freight to shops and contractors. Ask for a same-day window before noon if the load is ready early.",
      },
      {
        name: "San Bernardino County",
        body: "Ontario, Fontana, San Bernardino, and Rancho Cucamonga are on the route for freight between inland warehouses and the coast. Weekly standing runs are welcome.",
      },
    ],
    outsideNote: "Outside this area? Ask — long runs quoted per job.",
  },
  about: {
    heading: "The owner answers the phone",
    story: [
      "Summit Line Delivery is Marcus Hale's company.",
      "He spent years driving for other people and got tired of customers who could not reach anyone when a dock time changed.",
      "So he bought a 26-ft box truck with a liftgate, then a high-roof Sprinter for the stops a big truck cannot squeeze into.",
      "When you call, you get Marcus or a driver who works for him — not a call center reading a script.",
      "Most jobs are same-day or scheduled freight between warehouses, stores, and job sites across Los Angeles, Orange, Riverside, and San Bernardino counties.",
      "If a load is awkward, he would rather say so before the truck rolls than surprise you at the dock.",
    ],
  },
  vehicles: [
    {
      id: "box-26",
      name: "26-ft box truck",
      class: "box-truck",
      summary: "26-ft box with a liftgate for docks and street-level stops.",
      photo: {
        src: "/photos/box-truck.jpg",
        alt: "White box truck",
        caption: "26-ft box truck with liftgate",
        credit: "Elise240SX, CC BY-SA 4.0, via Wikimedia Commons",
      },
      specs: [
        { label: "Box", value: "26 ft" },
        { label: "Liftgate", value: "2,500 lb" },
        { label: "Payload", value: "10,000 lb" },
        { label: "Pallets", value: "12 standard" },
      ],
      liftgate: true,
      palletCapacity: 12,
      keyDates: {
        insurance: "2027-03-01",
        registration: "2027-01-15",
        dot: "2027-06-30",
        mc: "2027-06-30",
      },
    },
    {
      id: "sprinter-hr",
      name: "High-roof Sprinter",
      class: "sprinter",
      summary: "High-roof cargo Sprinter for furniture, store runs, and tight docks.",
      photo: {
        src: "/photos/sprinter.jpg",
        alt: "White high-roof Sprinter cargo van",
        caption: "High-roof Sprinter cargo van",
        credit: "mark.mitchell.brown, CC BY-SA 2.0, via Flickr / Wikimedia Commons",
      },
      specs: [
        { label: "Roof", value: "High roof" },
        { label: "Cargo length", value: "About 14 ft" },
        { label: "Payload", value: "About 3,800 lb" },
        { label: "Pallets", value: "3 to 4" },
        { label: "Liftgate", value: "No — dock, ramp, or by hand" },
      ],
      liftgate: false,
      palletCapacity: 4,
      keyDates: {
        insurance: "2027-03-01",
        registration: "2027-02-28",
        dot: "2027-06-30",
      },
    },
  ],
  drivers: [],
  gallery: [
    {
      src: "/photos/warehouse-loading.jpg",
      alt: "Forklift loading boxes into a truck at a warehouse",
      caption: "Warehouse loading",
      credit: "Unsplash License",
    },
    {
      src: "/photos/strapped-pallet.jpg",
      alt: "Shrink-wrapped pallets held with straps",
      caption: "Strapped pallet freight",
      credit: "heb, CC BY-SA 3.0, via Wikimedia Commons",
    },
  ],
  reviews: [
    {
      quote:
        "Booked a same-day pallet run from Vernon to Ontario. The truck was on time and the liftgate saved us at a stop with no dock.",
      name: "Dana Ruiz",
      detail: "Warehouse supervisor, Commerce",
    },
    {
      quote:
        "We use them for store pickups when a job site needs materials before noon. The price is straight and they answer the phone.",
      name: "Chris Pell",
      detail: "Contractor, Riverside",
    },
    {
      quote:
        "Four pieces of office furniture into a tight downtown dock, on the Sprinter. Careful and quick.",
      name: "Amina Shah",
      detail: "Office manager, Irvine",
    },
  ],
  compliance: {
    insurance: {
      carrier: "Harbor & Pine Mutual",
      liability: "$1,000,000 auto liability",
      cargo: "$100,000 cargo",
      expires: "2027-03-01",
    },
    dot: "3982210",
    mc: "1422087",
  },
  dashboard: {
    email: "owner@summitlinedelivery.demo",
    password: "summit-demo",
  },
};

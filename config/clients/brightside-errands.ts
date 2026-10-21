import type { ClientConfig } from "../types";

export const client: ClientConfig = {
  id: "brightside-errands",
  legalName: "Brightside Errands",
  shortName: "Brightside",
  ownerLine: "Owner-operated. You talk to the person who does the driving.",
  ownerOperated: true,
  headline: "Pharmacy, grocery, and errands — same day, brought to the door.",
  subline:
    "An owner-operated sedan for central Austin, Round Rock, Cedar Park, and Pflugerville.",
  servicesIntro: "Errands a sedan can finish the same day.",
  audienceHeading: "Who we help",
  audiences: ["Households", "Seniors", "Clinics and pharmacies", "Busy professionals", "Local shops"],
  phoneDisplay: "(555) 014-4188",
  phoneDigits: "15550144188",
  email: "hello@brightsideerrands.demo",
  domain: "brightsideerrands.demo",
  timezone: "America/Chicago",
  colors: { primary: "#143028", accent: "#E39B12" },
  seo: {
    title: "Brightside Errands — pharmacy, grocery, and same-day errands in Austin",
    description:
      "Owner-operated sedan service for prescriptions, groceries, senior errands, and same-day documents across Austin, Round Rock, Cedar Park, and Pflugerville.",
  },
  showDemandNotes: false,
  servicesOffered: ["pharmacy", "grocery", "senior", "courier", "food"],
  serviceArea: {
    region: "Austin",
    intro:
      "Same-day errands across Austin and the nearby cities. If the pharmacy has it, or the store has it, it can be at the door today.",
    areas: [
      {
        name: "Austin",
        body: "Central Austin is home base — downtown, the university area, and the neighborhoods inside the loop. Pharmacy and grocery runs are usually same day when the order is in before early afternoon.",
      },
      {
        name: "Round Rock",
        body: "Round Rock is a regular stop for prescriptions and household errands. The drive is quoted with the order, so the price is clear before the car leaves.",
      },
      {
        name: "Cedar Park",
        body: "Cedar Park and the northwest side are covered for grocery lists, pharmacy pickups, and same-day documents.",
      },
      {
        name: "Pflugerville",
        body: "Pflugerville is on the route for the same errands. If you are just past it, ask — a longer drive is quoted per job.",
      },
    ],
    outsideNote: "Outside this area? Ask — long runs quoted per job.",
  },
  about: {
    heading: "A sedan, a list, and a person who answers",
    story: [
      "Brightside Errands is run by Elena Cho from the driver's seat of her sedan.",
      "She started the route after helping her own parents keep up with prescriptions and grocery runs.",
      "The work is small on purpose: a pharmacy bag, a grocery list, a document that has to be across town today.",
      "You talk to Elena when you call.",
      "She texts when she is on the way and hands the order to the person who asked for it.",
      "If a store is out of something on the list, she checks before she substitutes.",
    ],
  },
  vehicles: [
    {
      id: "sedan-1",
      name: "Midsize sedan",
      class: "sedan",
      summary: "A midsize sedan for prescriptions, groceries, and small parcels.",
      photo: {
        src: "/photos/sedan.jpg",
        alt: "White midsize sedan",
        caption: "The sedan used for same-day errands",
        credit: "Unsplash License",
      },
      specs: [
        { label: "Body", value: "Midsize sedan" },
        { label: "Cargo", value: "Trunk and rear seat" },
        { label: "Best for", value: "Groceries, prescriptions, small parcels" },
        { label: "Same day", value: "Across the cities listed" },
      ],
      liftgate: false,
    },
  ],
  drivers: [],
  gallery: [
    {
      src: "/photos/grocery.jpg",
      alt: "Fresh produce at a grocery market",
      caption: "Grocery runs from the stores you already use",
      credit: "Unsplash License",
    },
  ],
  reviews: [
    {
      quote:
        "Picked up my mom's prescription and had it at her door before dinner. I got a text when it was handed over.",
      name: "Andre Walsh",
      detail: "Round Rock",
    },
    {
      quote:
        "I send a grocery list in the morning and it shows up after work. Substitutions are always checked first.",
      name: "Megan Ortiz",
      detail: "Central Austin",
    },
    {
      quote: "Needed a signed packet across town the same day. Easy to reach, fair price, done.",
      name: "Chris Adelman",
      detail: "Cedar Park",
    },
  ],
  compliance: null,
  dashboard: {
    email: "owner@brightsideerrands.demo",
    password: "brightside-demo",
  },
};

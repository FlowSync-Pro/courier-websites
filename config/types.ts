export const VEHICLE_CLASSES = [
  "sedan",
  "suv",
  "minivan",
  "pickup",
  "cargo-van",
  "sprinter",
  "box-truck",
  "hotshot",
] as const;

export type VehicleClass = (typeof VEHICLE_CLASSES)[number];

export type ServiceId =
  | "grocery"
  | "food"
  | "pharmacy"
  | "senior"
  | "courier"
  | "auto-parts"
  | "store-pickups"
  | "furniture"
  | "moving"
  | "pallets";

export type Photo = {
  src: string;
  alt: string;
  caption?: string;
  credit: string;
};

export type Vehicle = {
  id: string;
  name: string;
  class: VehicleClass;
  summary: string;
  photo: Photo;
  specs: { label: string; value: string }[];
  liftgate: boolean;
  palletCapacity?: number;
  keyDates?: {
    insurance?: string;
    registration?: string;
    dot?: string;
    mc?: string;
  };
};

export type ClientConfig = {
  id: string;
  legalName: string;
  shortName: string;
  ownerLine: string;
  ownerOperated: boolean;
  headline: string;
  subline: string;
  servicesIntro: string;
  audienceHeading: string;
  audiences: string[];
  phoneDisplay: string;
  phoneDigits: string;
  email: string;
  domain: string;
  timezone: string;
  colors: { primary: string; accent: string };
  logoSrc?: string;
  seo: { title: string; description: string };
  /** Sales/demo pages only. Real client sites keep this false. */
  showDemandNotes: boolean;
  servicesOffered: ServiceId[];
  serviceArea: {
    region: string;
    intro: string;
    areas: { name: string; body: string }[];
    outsideNote: string;
  };
  about: {
    heading: string;
    story: string[];
  };
  vehicles: Vehicle[];
  /** Listed drivers are part of the roster. One or more drivers selects the commercial dashboard. */
  drivers: { name: string; phone?: string }[];
  gallery: Photo[];
  reviews: { quote: string; name: string; detail: string }[];
  compliance: null | {
    insurance?: {
      carrier: string;
      liability?: string;
      cargo?: string;
      expires?: string;
    };
    dot?: string;
    mc?: string;
  };
  dashboard: {
    email: string;
    password: string;
  };
};

import { client } from "@/config/site";
import { SERVICE_MENU, serviceById, type ServiceDef } from "@/config/services";
import type { VehicleClass } from "@/config/types";

const COMMERCIAL = new Set<VehicleClass>(["cargo-van", "sprinter", "box-truck", "hotshot"]);

export function dashboardLevel(): "A" | "B" {
  if (client.vehicles.some((vehicle) => COMMERCIAL.has(vehicle.class))) return "B";
  if (client.vehicles.length >= 2) return "B";
  if (client.drivers.length >= 1) return "B";
  return "A";
}

export function offeredServices(): ServiceDef[] {
  const classes = new Set(client.vehicles.map((vehicle) => vehicle.class));
  return client.servicesOffered.flatMap((id) => {
    const service = serviceById(id);
    if (!service) return [];
    if (!service.vehicleClasses.some((vehicleClass) => classes.has(vehicleClass))) return [];
    return [service];
  });
}

export function vehiclesFor(service: ServiceDef) {
  return client.vehicles.filter((vehicle) => service.vehicleClasses.includes(vehicle.class));
}

export function trustItems() {
  const items: string[] = [];
  if (client.compliance?.insurance) items.push("Licensed & insured");
  if (client.ownerOperated) items.push("Owner-operated");
  if (client.vehicles.some((vehicle) => vehicle.liftgate)) items.push("Liftgate available");
  const pallets = client.vehicles.reduce(
    (max, vehicle) => Math.max(max, vehicle.palletCapacity ?? 0),
    0,
  );
  if (pallets > 0) items.push(`Pallets up to ${pallets}`);
  return items;
}

export function piecesLabel() {
  return offeredServices().some((service) => service.id === "pallets")
    ? "How many pallets / pieces"
    : "How many pieces";
}

export function serviceName(id: string) {
  return serviceById(id)?.name ?? (id ? id : "Unspecified");
}

export function vehicleName(id: string) {
  if (!id) return "Overhead";
  return client.vehicles.find((vehicle) => vehicle.id === id)?.name ?? "Former vehicle";
}

export function telHref() {
  return `tel:+${client.phoneDigits}`;
}

export function smsHref() {
  return `sms:+${client.phoneDigits}`;
}

export function previewServices() {
  return offeredServices().slice(0, 4);
}

export const EXPENSE_CATEGORIES = [
  ["fuel", "Fuel"],
  ["maintenance", "Maintenance"],
  ["insurance", "Insurance"],
  ["tolls", "Tolls"],
  ["parking", "Parking"],
  ["phone", "Phone"],
  ["supplies", "Supplies"],
] as const;

export function categoryLabel(id: string) {
  return EXPENSE_CATEGORIES.find(([key]) => key === id)?.[1] ?? id;
}

export { SERVICE_MENU };

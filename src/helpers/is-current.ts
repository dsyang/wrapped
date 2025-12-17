import { Config } from "../data/config";

export function isCurrent(config: Config, createdOn?: Date): string | null {
  if (!createdOn) {
    return "no creation date found";
  }

  const now = new Date();
  const to = config.to;

  // If data was created after the "to" date, return true
  if (createdOn > to) {
    return null;
  }

  // If it was created within 10 minutes of now, return true
  if (now.getTime() - createdOn.getTime() < 1000 * 60 * 10) {
    return null;
  }

  const minutesAgo = Math.floor(
    (now.getTime() - createdOn.getTime()) / (1000 * 60),
  );
  return `data is ${minutesAgo} minutes old (created: ${createdOn.toLocaleString()}, now: ${now.toLocaleString()}, stale after 10 minutes)`;
}

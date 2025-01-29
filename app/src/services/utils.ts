import { API_DOMAIN } from "@/services/env";

export function createAcceptHeaderValue(version: number): string {
  return `application/${API_DOMAIN}; version=${version}`;
}

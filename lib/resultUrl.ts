import { deflate, inflate } from "pako";

export interface ResultPayload {
  v: string; // verdict: "사세요" | "참으세요"
  s: number; // score: 0-100
  p: string; // productName
  pr?: string; // price (optional)
  rb: string[]; // reasons_to_buy
  rs: string[]; // reasons_to_skip
  vc: string; // verdict_comment
  t: number; // timestamp (unix seconds)
}

export function encodeResult(payload: ResultPayload): string {
  const json = JSON.stringify(payload);
  const compressed = deflate(json, { level: 6 });
  const binary = String.fromCharCode(...compressed);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeResult(encoded: string): ResultPayload {
  const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  const json = inflate(bytes, { to: "string" });
  return JSON.parse(json) as ResultPayload;
}

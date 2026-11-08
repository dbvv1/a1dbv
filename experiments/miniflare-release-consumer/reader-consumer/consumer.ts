import { Miniflare } from "miniflare";

// Compile-time consumer only: this function is never executed.
async function consume(mf: Miniflare): Promise<string> {
  const response = await mf.dispatchFetch("https://example.com/");
  return response.text();
}
export { consume };

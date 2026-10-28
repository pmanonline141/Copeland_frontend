/**
 * Generated imagery helper.
 * ------------------------------------------------------------------
 * The brand photography set does not exist yet, so marketing surfaces
 * (hero, category tiles, editorial blocks) render generated images on a
 * brand-appropriate prompt. Swap these for real product/editorial shots
 * once they are shot — the call sites already take a plain URL.
 */
export type ImageSize =
  | "square_hd"
  | "square"
  | "portrait_4_3"
  | "portrait_16_9"
  | "landscape_4_3"
  | "landscape_16_9";

export function imageUrl(prompt: string, size: ImageSize = "portrait_4_3"): string {
  return `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${size}`;
}

/**
 * Shared `view-transition-name` used to morph an example screenshot (on a listing/home page)
 * into its full rendering on the example's detail page.
 *
 * Both ends of the transition must produce the identical name, so the listing-side
 * (`ExampleLink`/`ExampleScreenshot`) and the detail-side (consumer's `Example` component)
 * should both derive it from this helper rather than hardcoding the string.
 */
export function exampleViewTransitionName(component: string, example: string): string {
  return `example-${component}-${example}`;
}

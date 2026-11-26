/**
 * Shared types for component API documentation
 */
export interface PropertyInfo {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  descriptionHtml?: string;
  default?: string;
  tags?: Record<string, string>;
  properties?: PropertyInfo[];
  /**
   * The component it's inherited from, for a prop another component's Props contribute (ex.
   * `Circle` for the `z` that `Points` passes on to each circle)
   */
  inheritedFrom?: string;
}

export interface ExtendedType {
  name: string;
  /** The full type expression, e.g., "SVGAttributes<SVGRectElement>" */
  fullType: string;
  /** For HTML/SVG element types, the element name, e.g., "SVGRectElement" */
  elementType?: string;
  /** Whether this is a known library type that should be documented separately */
  isLibraryType?: boolean;
  /** Another component's Props, whose props are listed (with `inheritedFrom`) in `properties` */
  inherited?: boolean;
}

export interface ComponentAPI {
  generatedAt: string;
  component: string;
  propsType: string;
  properties: PropertyInfo[];
  /** Types that are extended/intersected (e.g., CommonEvents, SVGAttributes<SVGRectElement>) */
  extends?: ExtendedType[];
}

import { isLiteralObject } from '@layerstack/utils/object';

import type { IconProps } from '../components/Icon.svelte';
import type { IconData } from '../types/index.js';

/** Accept either raw icon data or an `Icon` props object, and narrow to the icon data */
export function asIconData(v: IconData | IconProps): IconData {
  return isIconComponentProps(v) ? v.data : v;
}

function isIconComponentProps(v: IconData | IconProps): v is IconProps {
  // `iconName` is a required property of a Font Awesome definition, the only other object supported
  return isLiteralObject(v) && !('iconName' in v);
}

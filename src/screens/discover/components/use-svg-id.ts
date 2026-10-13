import { useId } from 'react';

/**
 * Document-unique id for SVG <defs> (gradients, clip paths). Several cards render the same
 * shape at different heights, and on web every <svg> shares one id namespace, so fixed ids
 * would make all cards reuse the first card's clip path.
 */
export function useSvgId(prefix: string) {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

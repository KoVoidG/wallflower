// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';

/**
 * Utility to merge class names.
 * Works like `clsx` but provides a typed signature for better TypeScript support.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(...inputs);
}

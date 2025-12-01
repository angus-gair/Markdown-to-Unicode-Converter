import { BOLD_MAP, ITALIC_MAP, BOLD_ITALIC_MAP } from '../constants.ts';

/**
 * Helper function to safely apply character mapping.
 * Uses Array.from to correctly iterate over Unicode characters (including surrogate pairs like emojis).
 */
const applyMapping = (text: string, map: Record<string, string>): string => {
  if (!text) return '';
  // Array.from ensures that surrogate pairs (e.g. 😹) are treated as single characters
  // instead of being split into two invalid characters.
  return Array.from(text).map(char => map[char] ?? char).join('');
};

export const transformToBold = (text: string): string => {
  return applyMapping(text, BOLD_MAP);
};

export const transformToItalic = (text: string): string => {
  return applyMapping(text, ITALIC_MAP);
};

export const transformToBoldItalic = (text: string): string => {
  return applyMapping(text, BOLD_ITALIC_MAP);
};

export const transformToUnderline = (text: string): string => {
  if (!text) return '';
  
  return Array.from(text).map(char => {
    // Skip underlining for newlines, tabs, and carriage returns to avoid rendering issues
    if (/[\r\n\t]/.test(char)) {
      return char;
    }
    // Append Combining Low Line (U+0332) to the character
    return char + '\u0332';
  }).join('');
};

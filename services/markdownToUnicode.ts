import { BOLD_MAP, ITALIC_MAP, BOLD_ITALIC_MAP, MONOSPACE_MAP } from '../constants.ts';

const applyCharMapping = (text: string, map: Record<string, string>): string => {
  if (!text) return '';
  // Use Array.from to correctly iterate over Unicode characters (including surrogate pairs)
  return Array.from(text).map(char => map[char] || char).join('');
};

export const convertMarkdownToUnicode = (markdown: string): string => {
  let result = markdown;
  
  // Storage for code blocks to protect them from other formatting
  // We use Private Use Area characters as placeholders (U+E000 to U+F8FF)
  const codeBlocks: string[] = [];
  
  // 1. Extract and process Code blocks first (`text`)
  // This prevents internal markdown characters (like *) from being processed by subsequent rules.
  result = result.replace(/`([^`]+)`/g, (match, content) => {
    const converted = applyCharMapping(content, MONOSPACE_MAP);
    codeBlocks.push(converted);
    // Return a single character placeholder corresponding to the index
    return String.fromCharCode(0xE000 + codeBlocks.length - 1);
  });

  // Process line by line for block elements
  result = result.split('\n').map(line => {
    // Headings (e.g., #, ##) -> Bold
    if (line.match(/^#+\s/)) {
      const headingText = line.replace(/^[#]+\s*/, '');
      return applyCharMapping(headingText, BOLD_MAP);
    }
    
    // Unordered lists (using * or - or +)
    // Regex: Start of line, capture indentation ($1), bullet char ($2), whitespace, capture content ($3)
    const ulMatch = line.match(/^(\s*)([*+\-])\s+(.*)$/);
    if (ulMatch) {
        const rawIndent = ulMatch[1];
        const content = ulMatch[3];

        // Normalize indentation: convert tabs to 4 spaces for calculation and consistent output
        const expandedIndent = rawIndent.replace(/\t/g, '    ');
        const indentLength = expandedIndent.length;

        // Calculate nesting level (assuming 2 spaces represents one level of indentation)
        const level = Math.floor(indentLength / 2);

        // Normalize indent to spaces for consistent rendering
        const normalizedIndent = ' '.repeat(indentLength);

        // Check for task lists (e.g., - [ ] Task)
        const taskMatch = content.match(/^\[([ xX])\]\s+(.*)$/);
        if (taskMatch) {
            const isChecked = taskMatch[1] !== ' ';
            const checkbox = isChecked ? '☑' : '☐'; // U+2611, U+2610
            return `${normalizedIndent}${checkbox} ${taskMatch[2]}`;
        }

        // Cycle through different bullet styles for nested lists
        const bullets = ['•', '◦', '▪', '▫'];
        const bullet = bullets[level % bullets.length];

        return `${normalizedIndent}${bullet} ${content}`;
    }

    // Ordered lists
    // Regex: Start of line, capture indentation ($1), digits ($2), dot, whitespace, capture content ($3)
    const olMatch = line.match(/^(\s*)([0-9]+)\.\s+(.*)$/);
    if (olMatch) {
        const rawIndent = olMatch[1];
        const number = olMatch[2];
        const content = olMatch[3];

        // Normalize indentation
        const expandedIndent = rawIndent.replace(/\t/g, '    ');
        const indentLength = expandedIndent.length;
        const normalizedIndent = ' '.repeat(indentLength);

        // Convert number digits to Bold Unicode for better visual styling
        const boldNumber = applyCharMapping(number, BOLD_MAP);
        return `${normalizedIndent}${boldNumber}. ${content}`;
    }

    // Horizontal rule
    if (line.match(/^(?:---|\*\*\*|___)\s*$/)) {
        return '---';
    }
    return line;
  }).join('\n');


  // Process inline elements (order is important to avoid conflicts)
  // 1. Bold Italic: ***text*** or ___text___
  result = result.replace(/\*\*\*(.*?)\*\*\*|___(.*?)___/g, (match, p1, p2) => {
    return applyCharMapping(p1 || p2, BOLD_ITALIC_MAP);
  });

  // 2. Bold: **text** or __text__
  result = result.replace(/\*\*(.*?)\*\*|__(.*?)__/g, (match, p1, p2) => {
    return applyCharMapping(p1 || p2, BOLD_MAP);
  });

  // 3. Italic: *text* or _text_
  // Note: Bold and Bold Italic are already processed, so we can safely match remaining pairs.
  result = result.replace(/\*([^*]+)\*|_([^_]+)_/g, (match, p1, p2) => {
    return applyCharMapping(p1 || p2, ITALIC_MAP);
  });
  
  // 4. Strikethrough: ~~text~~
  result = result.replace(/~~(.*?)~~/g, (match, p1) => {
    if (!p1) return '';
    return Array.from(p1).map(char => char + '\u0336').join('');
  });

  // 5. Underline: <u>text</u>
  // Using combining low line (U+0332)
  result = result.replace(/<u>(.*?)<\/u>/g, (match, p1) => {
    if (!p1) return '';
    return Array.from(p1).map(char => char + '\u0332').join('');
  });

  // 6. Restore code blocks from placeholders
  result = result.replace(/[\uE000-\uF8FF]/g, (match) => {
    const index = match.charCodeAt(0) - 0xE000;
    return codeBlocks[index] !== undefined ? codeBlocks[index] : match;
  });

  return result;
};
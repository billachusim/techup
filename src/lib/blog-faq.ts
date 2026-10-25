export type FaqItem = { question: string; answer: string };

/** Markdown to plain text for schema answers: keeps link text, drops formatting. */
const plain = (markdown: string) =>
  markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/**
 * The questions and answers in a post's "## Frequently asked questions" (or
 * "## FAQ") section, where each question is a "### " heading and the answer is
 * the text under it. Used for the post's FAQPage markup.
 */
export function extractFaq(markdown: string): FaqItem[] {
  const section = markdown.match(
    /^##\s+(?:Frequently asked questions|FAQs?)\b[^\n]*\n([\s\S]*?)(?=^##\s|(?![\s\S]))/im,
  );
  if (!section) return [];
  return [
    ...section[1].matchAll(/^###\s+(.+)\n([\s\S]*?)(?=^###\s|(?![\s\S]))/gm),
  ]
    .map((m) => ({ question: plain(m[1]), answer: plain(m[2]) }))
    .filter((item) => item.question && item.answer);
}

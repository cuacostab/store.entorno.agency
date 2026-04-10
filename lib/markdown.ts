/**
 * Lightweight markdown parser for chat messages.
 * Supports: **bold**, *italic*, - lists, [links](url), line breaks.
 */
export function parseMarkdown(raw: string): string {
  let html = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Links: [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, url) => {
    const isExternal = url.startsWith("http");
    const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${url}"${target} style="color:var(--brand);text-decoration:underline;font-weight:600">${text}</a>`;
  });

  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  const lines = html.split("\n");
  const out: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    const listMatch = trimmed.match(/^[-•]\s+(.+)/);
    if (listMatch) {
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push(`<li>${listMatch[1]}</li>`);
    } else {
      if (inList) { out.push("</ul>"); inList = false; }
      if (trimmed === "") out.push("<br/>");
      else out.push(`<p>${trimmed}</p>`);
    }
  }
  if (inList) out.push("</ul>");
  return out.join("");
}

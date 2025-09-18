export function safeEncode(text) {
  return encodeURIComponent(text)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/'/g, "%27"); // you can add more replacements if needed
}
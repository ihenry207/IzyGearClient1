export function truncateText(text, maxLength) {
  if (!text) return ""; // Add this check
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}
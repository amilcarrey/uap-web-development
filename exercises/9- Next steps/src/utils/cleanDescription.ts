export function cleanDescription(html: string | undefined) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, ""); // elimina etiquetas <b>, <br>, etc.
}

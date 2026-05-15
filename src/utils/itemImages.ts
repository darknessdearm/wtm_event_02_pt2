const modules = import.meta.glob("../assets/item/*.png", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const byFilename: Record<string, string> = {};
for (const [path, url] of Object.entries(modules)) {
  const name = path.split("/").pop();
  if (name) byFilename[name] = url;
}

export function resolveItemImage(imgUrl?: string): string {
  if (!imgUrl) return "";
  const filename = imgUrl.split(/[/\\]/).pop() ?? "";
  return byFilename[filename] ?? "";
}

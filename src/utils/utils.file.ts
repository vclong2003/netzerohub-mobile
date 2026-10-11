export function getFileName(url: string, index: number): string {
  try {
    const pathname = url.split("?")[0];
    const rawFilename = pathname.split("/").pop();
    if (!rawFilename) return `Information Sheet #${index + 1}`;

    const decoded = decodeURIComponent(rawFilename);
    const withoutUuid = decoded.replace(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}-/,
      "",
    );

    return (
      withoutUuid.replace(/\.pdf$/i, "").replace(/[-_]/g, " ") ||
      `Info Sheet #${index + 1}`
    );
  } catch {
    return `Info Sheet #${index + 1}`;
  }
}

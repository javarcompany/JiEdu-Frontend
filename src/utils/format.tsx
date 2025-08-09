export function formatCurrencyShort(value: number | string): string {
    const num = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(num)) return "0";

    const format = (n: number, suffix: string) =>
        n.toFixed(2).replace(/\.00$/, "") + suffix;

    if (num >= 1_000_000_000) {
        return format(num / 1_000_000_000, "B");
    } else if (num >= 1_000_000) {
        return format(num / 1_000_000, "M");
    } else if (num >= 1_000) {
        return format(num / 1_000, "K");
    }

    return num.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 });
}

export const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

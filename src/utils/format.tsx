export function formatCurrencyShort(value: number | string): string {
    const num = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(num)) return "0";

    if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    } else if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (num > 1_000) {
        return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }

    return num.toLocaleString(); // e.g., "745"
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

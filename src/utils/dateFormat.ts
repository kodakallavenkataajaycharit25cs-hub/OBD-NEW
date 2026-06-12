/**
 * Shared date/time formatting utilities.
 * Format: dd/mm/yy for dates, HH:mm for times.
 */

/** Format a date value to dd/mm/yy */
export function formatDate(value: string | Date): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  if (isNaN(d.getTime())) return 'N/A';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

/** Format a date value to HH:mm (24-hour) */
export function formatTime(value: string | Date): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  if (isNaN(d.getTime())) return 'N/A';
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${mins}`;
}

/** Format a date value to "dd/mm/yy HH:mm" */
export function formatDateTime(value: string | Date): string {
  return `${formatDate(value)} ${formatTime(value)}`;
}

/** Format current date to "dd/mm/yy" */
export function formatCurrentDate(): string {
  return formatDate(new Date());
}

/** Format current time to "HH:mm" */
export function formatCurrentTime(): string {
  return formatTime(new Date());
}

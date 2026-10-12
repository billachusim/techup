/** Helpers for the admin "Download CSV" buttons. */

export type CsvColumn<T> = {
  header: string;
  value: (row: T) => string | number | null | undefined;
};

/**
 * Spreadsheet apps run cells that start with these characters as formulas, so
 * a lead who types "=HYPERLINK(...)" as their name could plant one. Such cells
 * get a leading apostrophe so they stay plain text. Phone numbers like
 * "+234 801 234 5678" can't do harm, so they're left as typed.
 */
const FORMULA_START = /^[=+\-@\t\r]/;
const PLAIN_NUMBER = /^[+-][\d\s().-]*$/;

export function csvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  let text = String(value);
  if (
    typeof value === "string" &&
    FORMULA_START.test(text) &&
    !PLAIN_NUMBER.test(text)
  )
    text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const lines = [columns.map((c) => csvCell(c.header)).join(",")];
  for (const row of rows)
    lines.push(columns.map((c) => csvCell(c.value(row))).join(","));
  return lines.join("\r\n");
}

/** "leads-2026-10-12.csv" style names, using the admin's local date. */
export function csvFilename(name: string, date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${name}-${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}.csv`;
}

/** Saves the CSV in the browser. The byte-order mark makes Excel read ₦ and accents correctly. */
export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

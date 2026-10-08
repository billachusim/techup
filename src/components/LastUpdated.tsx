interface LastUpdatedProps {
  /** ISO date, e.g. "2026-10-08" */
  date: string;
  className?: string;
}

/** Formats an ISO date as "8 October 2026", pinned to UTC so server and browser agree. */
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

/** Visible "Last updated" line, matching the dateModified in the page's JSON-LD. */
const LastUpdated = ({ date, className = "" }: LastUpdatedProps) => (
  <p className={`text-xs text-muted-foreground ${className}`}>
    Last updated <time dateTime={date}>{formatDate(date)}</time>
  </p>
);

export default LastUpdated;

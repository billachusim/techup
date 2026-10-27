import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import {
  fetchUpcomingIntakes,
  formatIntakeDate,
  intakeModeLabel,
  type Intake,
} from "@/lib/intakes";

/**
 * The next intake dates for a department. Shows nothing until an admin adds
 * one on /admin/intakes, so the page never shows a made-up date.
 */
export default function NextIntakes({
  departmentSlug,
  onLoaded,
}: {
  departmentSlug: string;
  onLoaded?: (intakes: Intake[]) => void;
}) {
  const [intakes, setIntakes] = useState<Intake[]>([]);

  useEffect(() => {
    let active = true;
    fetchUpcomingIntakes(departmentSlug)
      .then((rows) => {
        if (!active) return;
        setIntakes(rows);
        onLoaded?.(rows);
      })
      .catch(() => {
        // No dates is better than a broken page.
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentSlug]);

  if (intakes.length === 0) return null;
  const [next, ...later] = intakes;

  return (
    <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
      <p className="flex items-center gap-2 font-semibold">
        <CalendarDays className="h-4 w-4 text-primary" />
        Next intake: {formatIntakeDate(next.starts_on)}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {[
          intakeModeLabel(next.learning_mode),
          next.campus,
          next.enrol_by && `enrol by ${formatIntakeDate(next.enrol_by)}`,
          next.seats && `${next.seats} seats`,
          next.note,
        ]
          .filter(Boolean)
          .join(" · ")}
      </p>
      {later.length > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          Later intakes:{" "}
          {later
            .map(
              (i) =>
                `${formatIntakeDate(i.starts_on)} (${intakeModeLabel(i.learning_mode)}${i.campus ? `, ${i.campus}` : ""})`,
            )
            .join(" · ")}
        </p>
      )}
    </div>
  );
}

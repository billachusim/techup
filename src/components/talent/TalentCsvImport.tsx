import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { TalentProfile } from "@/lib/talent";
import {
  IMPORT_FIELD_LABEL,
  buildImportRows,
  parseCsv,
  type ImportField,
  type ImportRow,
} from "@/lib/talent-import";

const STATUS_BADGE: Record<
  ImportRow["status"],
  "default" | "secondary" | "destructive"
> = {
  ready: "default",
  duplicate: "secondary",
  invalid: "destructive",
};

type Props = {
  existing: Pick<TalentProfile, "email" | "phone" | "whatsapp">[];
  onImported: () => void;
};

/** Staff tool: preview a Google Form CSV export, then add the new people to the talent pool. */
const TalentCsvImport = ({ existing, onImported }: Props) => {
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState<{
    headers: string[];
    mapping: (ImportField | null)[];
    rows: ImportRow[];
  } | null>(null);
  const [importing, setImporting] = useState(false);

  const readFile = async (file: File | undefined) => {
    if (!file) return;
    setFileName(file.name);
    const result = buildImportRows(parseCsv(await file.text()), existing);
    setPreview(result);
    if (!result.mapping.some((f) => f === "full_name" || f === "first_name")) {
      toast({
        title: "No name column found",
        description:
          "Check that the first row of the CSV has the form's question titles.",
        variant: "destructive",
      });
    }
  };

  const ready = preview?.rows.filter((r) => r.status === "ready") ?? [];

  const runImport = async () => {
    if (!ready.length) return;
    setImporting(true);
    let added = 0;
    try {
      for (let i = 0; i < ready.length; i += 50) {
        const batch = ready.slice(i, i + 50).map((r) => r.profile);
        const { error } = await supabase.from("talent_profiles").insert(batch);
        if (error) throw error;
        added += batch.length;
      }
      toast({
        title: `Imported ${added} talent profiles`,
        description:
          "They are hidden from the directory until you review them.",
      });
      setPreview(null);
      setFileName("");
      onImported();
    } catch (e) {
      toast({
        title: added ? `Imported ${added}, then stopped` : "Import failed",
        description: (e as Error).message,
        variant: "destructive",
      });
      onImported();
    } finally {
      setImporting(false);
    }
  };

  const counts = preview
    ? (["ready", "duplicate", "invalid"] as const).map(
        (s) => [s, preview.rows.filter((r) => r.status === s).length] as const,
      )
    : [];

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="text-lg font-semibold">Import from Google Form</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        In the form's Responses tab, choose Download responses (.csv), then pick
        the file here. Nothing is saved until you press Import.
      </p>
      <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted">
        <Upload size={14} /> {fileName || "Choose CSV file"}
        <input
          type="file"
          accept=".csv,text/csv"
          className="sr-only"
          onChange={(e) => readFile(e.target.files?.[0])}
        />
      </label>

      {preview && (
        <div className="mt-5 space-y-4">
          <div className="flex flex-wrap gap-2 text-xs">
            {preview.headers.map((h, i) => (
              <span key={i} className="rounded border border-border px-2 py-1">
                <span className="text-muted-foreground">
                  {h.trim() || `Column ${i + 1}`}
                </span>
                {" → "}
                {preview.mapping[i]
                  ? IMPORT_FIELD_LABEL[preview.mapping[i]!]
                  : "notes"}
              </span>
            ))}
          </div>

          <p className="text-sm">
            {counts.map(([s, n]) => `${n} ${s}`).join(" · ")}
          </p>

          <div className="max-h-80 overflow-auto rounded border border-border">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-muted">
                <tr>
                  <th className="px-2 py-1.5">Row</th>
                  <th className="px-2 py-1.5">Status</th>
                  <th className="px-2 py-1.5">Name</th>
                  <th className="px-2 py-1.5">Email</th>
                  <th className="px-2 py-1.5">Phone</th>
                  <th className="px-2 py-1.5">City</th>
                  <th className="px-2 py-1.5">Skills</th>
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((r) => (
                  <tr key={r.line} className="border-t border-border">
                    <td className="px-2 py-1.5 text-muted-foreground">
                      {r.line}
                    </td>
                    <td className="px-2 py-1.5">
                      <Badge variant={STATUS_BADGE[r.status]}>
                        {r.problem ?? "Ready"}
                      </Badge>
                    </td>
                    <td className="px-2 py-1.5">{r.profile.full_name}</td>
                    <td className="px-2 py-1.5">{r.profile.email}</td>
                    <td className="px-2 py-1.5">{r.profile.phone}</td>
                    <td className="px-2 py-1.5">{r.profile.city}</td>
                    <td className="px-2 py-1.5">
                      {(r.profile.skills ?? []).join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={runImport}
              disabled={importing || ready.length === 0}
            >
              {importing && (
                <Loader2 size={14} className="mr-1.5 animate-spin" />
              )}
              Import {ready.length}{" "}
              {ready.length === 1 ? "profile" : "profiles"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setPreview(null);
                setFileName("");
              }}
              disabled={importing}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default TalentCsvImport;

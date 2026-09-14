import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  EMPTY_CERTIFICATION,
  EMPTY_EDUCATION,
  EMPTY_EXPERIENCE,
  type Certification,
  type Education,
  type Experience,
} from "@/lib/cv";

type RowProps = { onRemove: () => void; index: number; label: string; children: React.ReactNode };

const Row = ({ onRemove, index, label, children }: RowProps) => (
  <div className="rounded-lg border border-border bg-card p-4">
    <div className="mb-3 flex items-center justify-between">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label} {index + 1}
      </span>
      <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="h-8 px-2 text-muted-foreground">
        <Trash2 size={14} />
        <span className="sr-only">Remove</span>
      </Button>
    </div>
    <div className="grid gap-3 sm:grid-cols-2">{children}</div>
  </div>
);

const Field = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  className,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) => (
  <div className={className}>
    <Label htmlFor={id} className="text-xs">{label}</Label>
    <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
  </div>
);

const AddButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <Button type="button" variant="outline" size="sm" onClick={onClick}>
    <Plus size={14} className="mr-1.5" /> {children}
  </Button>
);

export function ExperienceEditor({
  items,
  onChange,
}: {
  items: Experience[];
  onChange: (next: Experience[]) => void;
}) {
  const update = (i: number, patch: Partial<Experience>) =>
    onChange(items.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <Row key={i} index={i} label="Role" onRemove={() => onChange(items.filter((_, idx) => idx !== i))}>
          <Field id={`exp-title-${i}`} label="Job title" value={item.title} onChange={(v) => update(i, { title: v })} placeholder="Data analyst" />
          <Field id={`exp-company-${i}`} label="Company" value={item.company} onChange={(v) => update(i, { company: v })} placeholder="Company name" />
          <Field id={`exp-location-${i}`} label="Location" value={item.location ?? ""} onChange={(v) => update(i, { location: v })} placeholder="Lagos, Nigeria" />
          <div className="grid grid-cols-2 gap-3">
            <Field id={`exp-start-${i}`} label="Start" value={item.start ?? ""} onChange={(v) => update(i, { start: v })} placeholder="Jan 2024" />
            <Field id={`exp-end-${i}`} label="End" value={item.end ?? ""} onChange={(v) => update(i, { end: v })} placeholder="Present" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor={`exp-desc-${i}`} className="text-xs">What you did</Label>
            <Textarea
              id={`exp-desc-${i}`}
              rows={3}
              value={item.description ?? ""}
              onChange={(e) => update(i, { description: e.target.value })}
              placeholder="Built weekly sales dashboards that cut reporting time by half."
            />
          </div>
        </Row>
      ))}
      {items.length < 15 && (
        <AddButton onClick={() => onChange([...items, { ...EMPTY_EXPERIENCE }])}>Add work experience</AddButton>
      )}
    </div>
  );
}

export function EducationEditor({
  items,
  onChange,
}: {
  items: Education[];
  onChange: (next: Education[]) => void;
}) {
  const update = (i: number, patch: Partial<Education>) =>
    onChange(items.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <Row key={i} index={i} label="Study" onRemove={() => onChange(items.filter((_, idx) => idx !== i))}>
          <Field id={`edu-q-${i}`} label="Qualification" value={item.qualification} onChange={(v) => update(i, { qualification: v })} placeholder="BSc" />
          <Field id={`edu-i-${i}`} label="School" value={item.institution} onChange={(v) => update(i, { institution: v })} placeholder="Nnamdi Azikiwe University" />
          <Field id={`edu-f-${i}`} label="Course or field" value={item.field ?? ""} onChange={(v) => update(i, { field: v })} placeholder="Computer science" />
          <div className="grid grid-cols-2 gap-3">
            <Field id={`edu-s-${i}`} label="Start" value={item.start ?? ""} onChange={(v) => update(i, { start: v })} placeholder="2019" />
            <Field id={`edu-e-${i}`} label="End" value={item.end ?? ""} onChange={(v) => update(i, { end: v })} placeholder="2023" />
          </div>
          <Field id={`edu-g-${i}`} label="Grade (optional)" value={item.grade ?? ""} onChange={(v) => update(i, { grade: v })} placeholder="Second class upper" />
        </Row>
      ))}
      {items.length < 15 && (
        <AddButton onClick={() => onChange([...items, { ...EMPTY_EDUCATION }])}>Add education</AddButton>
      )}
    </div>
  );
}

export function CertificationEditor({
  items,
  onChange,
}: {
  items: Certification[];
  onChange: (next: Certification[]) => void;
}) {
  const update = (i: number, patch: Partial<Certification>) =>
    onChange(items.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <Row key={i} index={i} label="Certificate" onRemove={() => onChange(items.filter((_, idx) => idx !== i))}>
          <Field id={`cert-n-${i}`} label="Certificate" value={item.name} onChange={(v) => update(i, { name: v })} placeholder="Google Data Analytics" />
          <Field id={`cert-i-${i}`} label="Issued by" value={item.issuer ?? ""} onChange={(v) => update(i, { issuer: v })} placeholder="Google" />
          <Field id={`cert-y-${i}`} label="Year" value={item.year ?? ""} onChange={(v) => update(i, { year: v })} placeholder="2025" />
        </Row>
      ))}
      {items.length < 15 && (
        <AddButton onClick={() => onChange([...items, { ...EMPTY_CERTIFICATION }])}>Add certificate</AddButton>
      )}
    </div>
  );
}

import type { Education, UiLabels } from "@/types/content";

interface EducationDetailField {
  label: string;
  value: string;
}

function EducationDetailRow({ label, value }: EducationDetailField) {
  return (
    <div>
      <p className="mono-label mb-0.5 text-muted-foreground">{label}</p>
      <p className="text-sm leading-tight text-foreground">{value}</p>
    </div>
  );
}

export interface EducationFocusPanelProps {
  item: Education;
  labels: UiLabels["education"];
}

export function EducationFocusPanel({
  item,
  labels,
}: EducationFocusPanelProps) {
  const fields: EducationDetailField[] = [
    {
      label: item.focusLabel ?? labels.researchFocus,
      value: item.focus,
    },
    ...(item.thesis ? [{ label: labels.thesis, value: item.thesis }] : []),
    ...(item.project ? [{ label: labels.project, value: item.project }] : []),
    ...(item.note ? [{ label: labels.note, value: item.note }] : []),
  ];

  return (
    <div className="px-6 pb-2 pt-0">
      <div className="flex flex-col gap-2">
        {fields.map((field) => (
          <EducationDetailRow key={field.label} {...field} />
        ))}
      </div>
    </div>
  );
}

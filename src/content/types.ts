export type View = "neutral" | "hire" | "casual";

export type Profile = {
  name: string;
  valueLine: Record<View, string>;
  contacts: {
    telegram: string;
    email?: string;
    cal?: string;
  };
};

export type Section = {
  id: string;
  label: string;
  order: Partial<Record<View, number>>;
};

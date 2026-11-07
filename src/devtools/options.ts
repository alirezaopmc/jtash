export type OptionValue = string | number | boolean;
export type DevConfig = Record<string, OptionValue>;
export type OptionDef = {
  key: string;
  label: string;
  choices: { value: OptionValue; label: string }[];
};

/**
 * Add option groups here to compare design alternatives live. The panel only shows
 * with `?dev` in the URL and at least one option defined. Read values with `useConfig()`.
 */
export const optionGroups: { title: string; options: OptionDef[] }[] = [];

export const defaultConfig: DevConfig = Object.fromEntries(
  optionGroups.flatMap((g) =>
    g.options.map((o) => [o.key, o.choices[0].value]),
  ),
);

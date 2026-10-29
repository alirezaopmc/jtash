import { shell } from "./shell";
import type { Profile, View } from "./types";

export const profile: Profile = {
  name: "Jay Tash",
  valueLine: {
    neutral: "I turn rough ideas into products people pay for.",
    hire: "I turn rough ideas into products people pay for.",
    casual: "I turn rough ideas into products people pay for.",
  },
  contacts: {
    telegram: "https://t.me/alirezaopmc",
  },
};

export function profileTitle(view: View): string {
  if (view === "neutral") {
    return profile.name;
  }

  return `${profile.name} · ${shell.modes[view].label}`;
}

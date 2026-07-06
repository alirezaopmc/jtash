export function parseExperienceHighlight(text: string) {
  const colonIndex = text.indexOf(": ");

  if (colonIndex > 0 && colonIndex < 48) {
    return {
      title: text.slice(0, colonIndex),
      body: text.slice(colonIndex + 2),
    };
  }

  return { body: text };
}

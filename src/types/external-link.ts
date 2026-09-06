export interface ExternalLinkMetaItem {
  label: string;
  value: string;
}

export interface ExternalLinkProfile {
  title: string;
  url: string;
  description?: string;
  subtitle?: string;
  facts?: string[];
  meta?: ExternalLinkMetaItem[];
  logo?: string;
  logoAlt?: string;
  accentColor?: string;
}

export interface ExternalLinkLabels {
  visit: string;
  copyEmail: string;
  emailCopied: string;
  copyEmailFailed: string;
  openInMail: string;
  githubDescription: string;
  linkedinDescription: string;
  telegramDescription: string;
}

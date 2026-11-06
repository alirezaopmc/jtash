import {
  Activity,
  BarChart3,
  Boxes,
  Code2,
  Cpu,
  Database,
  Flame,
  Gamepad2,
  LineChart,
  MapPin,
  Scroll,
  Server,
  Sparkles,
  Terminal,
  Workflow,
  Zap,
} from "lucide-react";

export function getCountryInfo(code: string) {
  switch (code.toUpperCase()) {
    case "TR":
      return { code: "TR", name: "Türkiye", flag: "🇹🇷" };
    case "IR":
      return { code: "IR", name: "Iran", flag: "🇮🇷" };
    case "CA":
      return { code: "CA", name: "Canada", flag: "🇨🇦" };
    case "US":
      return { code: "US", name: "United States", flag: "🇺🇸" };
    case "UK":
    case "GB":
      return { code: "UK", name: "United Kingdom", flag: "🇬🇧" };
    default:
      return { code, name: code, flag: "🌐" };
  }
}

export function CountryBadge({
  country,
  location,
  className = "",
}: {
  country: string;
  location: string;
  className?: string;
}) {
  const info = getCountryInfo(country);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-muted ${className}`}
      title={`${location} (${info.name})`}
    >
      <MapPin className="size-3 text-claude shrink-0" />
      <span>{location}</span>
      <span className="text-white/20">·</span>
      <span className="font-mono text-fg/90 flex items-center gap-1">
        <span>{info.flag}</span>
        <span className="text-[10px] tracking-wider uppercase text-muted">
          {info.code}
        </span>
      </span>
    </span>
  );
}

function TypeScriptIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3h18v18H3V3zm10.7 13.5c1 .6 2.2 1 3.5 1 2.3 0 3.7-1.1 3.7-2.9 0-1.7-1-2.6-2.9-3.4l-.8-.3c-1.3-.5-1.8-1-1.8-1.8 0-.9.8-1.6 2-1.6 1 0 1.8.3 2.5.7l.6-1.8c-.8-.4-1.8-.7-3.1-.7-2.3 0-3.8 1.3-3.8 3 0 1.6 1 2.5 2.7 3.2l.9.4c1.3.5 1.9 1 1.9 1.9 0 1.1-.9 1.7-2.2 1.7-1.3 0-2.3-.4-3-.9l-.7 1.6zM8 9.5h5.5V7.7H4.5v1.8H7v8.7h2V9.5z" />
    </svg>
  );
}

function PythonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.9 2c-3.4 0-5.5 1.5-5.5 4.5v2.3h5.6V9H6.4c-3 0-4.4 2-4.4 5.3s1.4 5.2 4.4 5.2H8v-2.3c0-2.7 2.2-4.9 4.9-4.9h4.7V10c0-3-2.1-4.5-5.7-4.5h-.1V2zm-2 2.2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm2.2 17.8c3.4 0 5.5-1.5 5.5-4.5v-2.3h-5.6V15h5.6c3 0 4.4-2 4.4-5.3s-1.4-5.2-4.4-5.2H16v2.3c0 2.7-2.2 4.9-4.9 4.9H6.4V14c0 3 2.1 4.5 5.7 4.5h.1V22zm2-2.2a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
    </svg>
  );
}

function GoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.5 11.5c0-3 2.5-5.5 5.5-5.5 1.8 0 3.3.8 4.3 2.1l-1.8 1.4c-.6-.8-1.5-1.3-2.5-1.3-1.8 0-3.3 1.5-3.3 3.3s1.5 3.3 3.3 3.3c1.4 0 2.5-.8 3-2H7v-2.2h5.4c.1.4.1.8.1 1.2 0 3.3-2.4 5.7-5.5 5.7-3 0-5.5-2.6-5.5-6zm15.2-5.5c3.2 0 5.8 2.5 5.8 5.7s-2.6 5.8-5.8 5.8c-3.2 0-5.8-2.6-5.8-5.8s2.6-5.7 5.8-5.7zm0 2.2c-1.9 0-3.5 1.6-3.5 3.5s1.6 3.6 3.5 3.6 3.5-1.6 3.5-3.6-1.6-3.5-3.5-3.5z" />
    </svg>
  );
}

function JavaIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" x2="6" y1="2" y2="4" />
      <line x1="10" x2="10" y1="2" y2="4" />
      <line x1="14" x2="14" y1="2" y2="4" />
    </svg>
  );
}

function DockerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.5 10.5h2v2h-2zm3 0h2v2h-2zm3 0h2v2h-2zm-3-3h2v2h-2zm3 0h2v2h-2zm3 0h2v2h-2zm3 3h2v2h-2zm-15 4c.3 2.7 2.3 5.4 6 5.5 4.5.1 8-2.6 9-6.5 1.5-.2 3.5-1.2 4-2.8-.7-.2-1.7-.1-2.5.4.1-.7 0-1.7-.5-2.2-.7-.7-2-.8-2.8-.2l-.6.4v.9H1.7c0 .5.1 1 .3 1.5l1.5 3z" />
    </svg>
  );
}

function KubernetesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.3 2.2a1.5 1.5 0 0 1 1.4 0l7.2 4.1a1.5 1.5 0 0 1 .8 1.3v8.4a1.5 1.5 0 0 1-.8 1.3l-7.2 4.1a1.5 1.5 0 0 1-1.4 0l-7.2-4.1a1.5 1.5 0 0 1-.8-1.3V7.6a1.5 1.5 0 0 1 .8-1.3l7.2-4.1zm.7 2.6-6 3.4v6.8l6 3.4 6-3.4V8.2l-6-3.4zm0 3.2a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
    </svg>
  );
}

function PostgreSqlIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.3 9.3.2-.8.5-1.8.5-2.5 0-1-.3-1.6-.7-2.4-.4-.8-.9-1.9-.9-3.4 0-3.3 2.5-5.5 5.8-5.5 3 0 5 1.8 5 4.5 0 2.2-1.2 4.2-3.2 4.2-.8 0-1.4-.4-1.7-1l-.5 2c-.3 1.2-1.1 2.7-1.6 3.6 1 .3 2.1.4 3.2.4 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
    </svg>
  );
}

function RedisIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2 2 6.8v10.4L12 22l10-4.8V6.8L12 2zm0 3.2 7 3.3-7 3.4-7-3.4 7-3.3zm-8 6 7 3.4v6.2l-7-3.4v-6.2zm9 9.6v-6.2l7-3.4v6.2l-7 3.4z" />
    </svg>
  );
}

function MongoDbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1.5s-6 5.8-6 11.2c0 4.6 3.4 8.5 6 9.8 2.6-1.3 6-5.2 6-9.8 0-5.4-6-11.2-6-11.2zm.5 17.7v-7.2c0-.3-.2-.5-.5-.5s-.5.2-.5.5v7.2c-2.4-1.1-4.5-4-4.5-7.5 0-3.7 3.5-7.7 5-9.2 1.5 1.5 5 5.5 5 9.2 0 3.5-2.1 6.4-4.5 7.5z" />
    </svg>
  );
}

function TerraformIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.5 2v7.5l6.5 3.7V5.7L1.5 2zm7.5 3.7v7.5l6.5-3.7V2L9 5.7zm0 8.5v7.5l6.5-3.7v-7.5L9 14.2zm7.5-3.7v7.5l6.5-3.7V6.8l-6.5 3.7z" />
    </svg>
  );
}

function GraphQlIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <polygon points="12 2 21 7.5 21 16.5 12 22 3 16.5 3 7.5" />
      <circle cx="12" cy="2" r="1.5" fill="currentColor" />
      <circle cx="21" cy="7.5" r="1.5" fill="currentColor" />
      <circle cx="21" cy="16.5" r="1.5" fill="currentColor" />
      <circle cx="12" cy="22" r="1.5" fill="currentColor" />
      <circle cx="3" cy="16.5" r="1.5" fill="currentColor" />
      <circle cx="3" cy="7.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function KotlinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 2H2v20h20L12 12 22 2zM12 12 2 22h10l5-5-5-5z" />
    </svg>
  );
}

function NodeJsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2 3.5 7v10L12 22l8.5-5V7L12 2zm0 2.3 6.5 3.8v7.6L12 19.5 5.5 15.7V8.1L12 4.3z" />
    </svg>
  );
}

function GcpIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.5 19H9a7 7 0 1 1 6.7-9h.8a4.5 4.5 0 0 1 1 8.9v.1Z" />
    </svg>
  );
}

export function ToolIcon({
  name,
  className = "size-3.5",
}: {
  name: string;
  className?: string;
}) {
  const n = name.toLowerCase();

  if (n.includes("typescript")) return <TypeScriptIcon className={className} />;
  if (n.includes("python")) return <PythonIcon className={className} />;
  if (n.startsWith("go")) return <GoIcon className={className} />;
  if (n.startsWith("java")) return <JavaIcon className={className} />;
  if (n.includes("docker")) return <DockerIcon className={className} />;
  if (n.includes("kubernetes")) return <KubernetesIcon className={className} />;
  if (n.includes("postgres")) return <PostgreSqlIcon className={className} />;
  if (n.includes("redis")) return <RedisIcon className={className} />;
  if (n.includes("mongodb") || n.includes("mongo"))
    return <MongoDbIcon className={className} />;
  if (n.includes("terraform")) return <TerraformIcon className={className} />;
  if (n.includes("graphql")) return <GraphQlIcon className={className} />;
  if (n.includes("kotlin")) return <KotlinIcon className={className} />;
  if (n.includes("node")) return <NodeJsIcon className={className} />;
  if (n.includes("gcp")) return <GcpIcon className={className} />;
  if (n.includes("kafka")) return <Workflow className={className} />;
  if (n.includes("rabbitmq")) return <Boxes className={className} />;
  if (n.includes("spring")) return <Cpu className={className} />;
  if (n.includes("nest")) return <Server className={className} />;
  if (n.includes("django")) return <Terminal className={className} />;
  if (n.includes("prometheus")) return <Flame className={className} />;
  if (n.includes("grafana")) return <Activity className={className} />;
  if (n.includes("liquibase")) return <Database className={className} />;
  if (n.includes("spigot")) return <Gamepad2 className={className} />;
  if (n.includes("paper")) return <Scroll className={className} />;
  if (n.includes("event-driven")) return <Zap className={className} />;
  if (n.includes("ai")) return <Sparkles className={className} />;
  if (n.includes("data vis") || n.includes("visualization"))
    return <BarChart3 className={className} />;
  if (n.includes("d3")) return <LineChart className={className} />;

  return <Code2 className={className} />;
}

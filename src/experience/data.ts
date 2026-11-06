export type Experience = {
  id: string;
  company: string;
  role: string;
  slogan: string;
  period: string;
  location: string;
  country: string;
  mode?: string;
  start: [year: number, month: number];
  end: [year: number, month: number] | null;
  logo: string;
  color: string;
  summary: string;
  highlights: string[];
  tools: string[];
};

export const experiences: Experience[] = [
  {
    id: "lvtgames",
    company: "LvtGames",
    role: "Software Engineer",
    slogan: "High-throughput wallet & transaction infrastructure.",
    period: "Aug 2025 — Mar 2026",
    location: "Istanbul, Türkiye",
    country: "TR",
    mode: "Remote · Full-time",
    start: [2025, 8],
    end: [2026, 3],
    logo: "/logos/experience/lvtgames.png",
    color: "#ED2F41",
    summary:
      "Transaction, wallet, and infrastructure work for a multi-tenant entertainment platform.",
    highlights: [
      "Built high-throughput transaction processing and multi-balance wallet services in Go and Spring Boot.",
      "Provisioned GCP infrastructure with Terraform and built layer-cached Bitbucket pipelines that cut deployment time by about 30%.",
      "Led cross-functional feature launches across backend, frontend, design, and product constraints.",
    ],
    tools: [
      "Go 1.24",
      "Java 21",
      "Spring Boot 3",
      "PostgreSQL",
      "Redis",
      "GCP",
      "Terraform",
      "Liquibase",
    ],
  },
  {
    id: "swapwallet",
    company: "SwapWallet",
    role: "Software Engineer",
    slogan: "Ledger correctness and matching under peak load.",
    period: "May 2025 — Jul 2025",
    location: "Tehran, Iran",
    country: "IR",
    mode: "Full-time",
    start: [2025, 5],
    end: [2025, 7],
    logo: "/logos/experience/swapwallet.png",
    color: "#0C3C94",
    summary: "Correctness and operations inside a crypto exchange.",
    highlights: [
      "Resolved critical ledger concurrency race conditions and optimized the exchange matching engine under peak load.",
      "Designed an event-driven Telegram workflow bot integrated with core exchange services.",
    ],
    tools: ["Kotlin", "Spring", "Apache Kafka", "PostgreSQL", "Kubernetes"],
  },
  {
    id: "ultratrader",
    company: "Ultratrader",
    role: "Software Engineer",
    slogan: "Real-time market data ingestion across 30+ broker APIs.",
    period: "Feb 2024 — Oct 2024",
    location: "Toronto, Canada",
    country: "CA",
    mode: "Remote · Full-time",
    start: [2024, 2],
    end: [2024, 10],
    logo: "/logos/experience/ultratrader.png",
    color: "#3C4DFF",
    summary: "Real-time market data, broker gateways, and analytical APIs.",
    highlights: [
      "Designed ingestion across 30+ broker APIs at about 1,000 events/sec sustained, with bursts to 300k events/sec.",
      "Built REST, GraphQL, and low-latency proxy gateways.",
      "Optimized analytical PostgreSQL queries to cut reporting latency by more than 90%.",
    ],
    tools: ["NestJS", "TypeScript", "PostgreSQL", "Redis", "GraphQL", "Docker"],
  },
  {
    id: "ravindex",
    company: "Ravindex",
    role: "Software Engineer",
    slogan: "Analytical pipelines for high-volume market tick data.",
    period: "May 2022 — Dec 2023",
    location: "Tehran, Iran",
    country: "IR",
    mode: "Full-time",
    start: [2022, 5],
    end: [2023, 12],
    logo: "/logos/experience/ravindex.png",
    color: "#7E52F5",
    summary: "High-throughput analytical pipelines for stock-market data.",
    highlights: [
      "Processed market tick data through analytical pipelines backed by replicated PostgreSQL.",
      "Built event-driven Django and RabbitMQ services across 20+ automated data-fetching workers.",
      "Instrumented the system with Prometheus and Grafana alerting.",
    ],
    tools: [
      "Python",
      "Django",
      "PostgreSQL",
      "RabbitMQ",
      "Docker",
      "Prometheus",
      "Grafana",
    ],
  },
  {
    id: "plotset",
    company: "Plotset",
    role: "Research & Development Intern",
    slogan: "Modular rendering framework & AI charting engines.",
    period: "Aug 2020 — Jul 2021",
    location: "California, US",
    country: "US",
    mode: "Remote",
    start: [2020, 8],
    end: [2021, 7],
    logo: "/logos/experience/plotset.png",
    color: "#0B65F6",
    summary: "Researching how data becomes visual explanation.",
    highlights: [
      "Researched AI-driven data visualization.",
      "Architected a modular rendering framework that integrated multiple charting engines.",
    ],
    tools: ["Node.js", "D3.js", "Data Visualization", "AI"],
  },
  {
    id: "cubecraft",
    company: "CubeCraft",
    role: "Game Developer",
    slogan: "Core gameplay mechanics for premier Minecraft minigames.",
    period: "Sep 2016 — Feb 2017",
    location: "London, UK",
    country: "UK",
    mode: "Remote",
    start: [2016, 9],
    end: [2017, 2],
    logo: "/logos/experience/cubecraft.png",
    color: "#3BA9FF",
    summary:
      "Core gameplay mechanics and scalable minigame systems for a premier global Minecraft server network.",
    highlights: [
      "Built customizable and maintainable Spigot game mode plugins handling high concurrency.",
      "Designed state machines with 50+ states and 100+ transitions to manage complex gameplay loops.",
      "Implemented over 300 event listeners and schedulers to optimize real-time tick performance.",
      "Debugged and enhanced low-level libraries in the core Java codebase.",
    ],
    tools: ["Java", "Spigot API", "PaperMC", "MongoDB", "Event-Driven"],
  },
];

export const timelineYears = [
  2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026,
] as const;

export function activeInMonth(
  experience: Experience,
  year: number,
  month: number,
) {
  const point = year * 12 + month;
  const start = experience.start[0] * 12 + experience.start[1];
  const end = experience.end
    ? experience.end[0] * 12 + experience.end[1]
    : Infinity;
  return point >= start && point <= end;
}

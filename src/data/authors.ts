import type { Author } from "../types";
import { portraits } from "./media";

export const authors: Author[] = [
  {
    id: "maya-ellison",
    slug: "maya-ellison",
    name: "Maya Ellison",
    role: "Senior AI Correspondent",
    location: "London",
    bio: "Maya covers artificial intelligence, compute infrastructure and the policy debates surrounding both. She previously reported on energy markets and now spends most of her time in server halls, laboratories and parliamentary committee rooms. Her work for Signal Desk focuses on the gap between model announcements and industrial reality.",
    expertise: ["Foundation models", "AI infrastructure", "UK & EU regulation"],
    image: portraits.maya,
    email: "maya.ellison@signaldesk.news",
    social: { x: "https://x.com", linkedin: "https://www.linkedin.com" },
  },
  {
    id: "james-whitfield",
    slug: "james-whitfield",
    name: "James Whitfield",
    role: "Technology Editor",
    location: "San Francisco",
    bio: "James edits Signal Desk’s technology coverage and writes on semiconductors, cloud platforms and the consumer internet. He has spent fifteen years reporting from the Bay Area and still believes the most important stories are the ones companies would rather not announce.",
    expertise: ["Semiconductors", "Cloud", "Platforms"],
    image: portraits.james,
    email: "james.whitfield@signaldesk.news",
    social: { x: "https://x.com", linkedin: "https://www.linkedin.com" },
  },
  {
    id: "priya-ramanathan",
    slug: "priya-ramanathan",
    name: "Priya Ramanathan",
    role: "Startups Reporter",
    location: "New York",
    bio: "Priya reports on early-stage companies, venture capital and the changing economics of building software. She is particularly interested in the unfashionable parts of company-building: pricing, distribution, hiring and the moment a founder stops performing growth and starts managing it.",
    expertise: ["Venture capital", "SaaS", "Founder strategy"],
    image: portraits.priya,
    email: "priya.ramanathan@signaldesk.news",
    social: { x: "https://x.com", linkedin: "https://www.linkedin.com" },
  },
  {
    id: "oliver-grant",
    slug: "oliver-grant",
    name: "Oliver Grant",
    role: "Cybersecurity Correspondent",
    location: "Washington, D.C.",
    bio: "Oliver covers cyber operations, critical infrastructure and the uneasy relationship between intelligence agencies, vendors and corporate boards. He previously reported on defence technology and still writes as if readers have a right to the unvarnished version.",
    expertise: ["Ransomware", "Critical infrastructure", "National security"],
    image: portraits.oliver,
    email: "oliver.grant@signaldesk.news",
    social: { x: "https://x.com", linkedin: "https://www.linkedin.com" },
  },
  {
    id: "helen-cho",
    slug: "helen-cho",
    name: "Helen Cho",
    role: "Business & Markets Correspondent",
    location: "London",
    bio: "Helen writes about the commercial decisions inside technology companies: capital allocation, regulation, labour and the slow work of turning a product into a durable business. She splits her time between the City and company results calls that last longer than they should.",
    expertise: ["Public markets", "Regulation", "Corporate strategy"],
    image: portraits.helen,
    email: "helen.cho@signaldesk.news",
    social: { x: "https://x.com", linkedin: "https://www.linkedin.com" },
  },
];

export const authorMap = Object.fromEntries(authors.map((a) => [a.id, a]));

export function getAuthor(id: string) {
  return authorMap[id];
}

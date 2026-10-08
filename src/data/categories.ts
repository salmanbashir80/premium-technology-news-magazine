import type { Category, CategorySlug } from "../types";

export const categories: Category[] = [
  {
    slug: "ai",
    name: "Artificial Intelligence",
    navLabel: "AI",
    kicker: "Artificial Intelligence",
    description:
      "Models, infrastructure, regulation and the industrial consequences of machine intelligence — reported for readers who need more than a product announcement.",
  },
  {
    slug: "technology",
    name: "Technology",
    navLabel: "Technology",
    kicker: "Technology",
    description:
      "Chips, cloud, devices, platforms and the systems that quietly decide what the rest of the industry can build next.",
  },
  {
    slug: "startups",
    name: "Startups",
    navLabel: "Startups",
    kicker: "Startups",
    description:
      "Founders, funding, product strategy and the unglamorous work of building companies that last.",
  },
  {
    slug: "business",
    name: "Business",
    navLabel: "Business",
    kicker: "Business",
    description:
      "Markets, regulation, labour and the commercial decisions reshaping technology companies on both sides of the Atlantic.",
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    navLabel: "Cybersecurity",
    kicker: "Cybersecurity",
    description:
      "Attacks, defences, policy and the operational reality of keeping networks, identities and supply chains intact.",
  },
  {
    slug: "ecommerce",
    name: "E-commerce",
    navLabel: "E-commerce",
    kicker: "E-commerce",
    description:
      "Retail technology, logistics, payments and the software layer sitting between a customer and a warehouse.",
  },
  {
    slug: "guides",
    name: "Guides & Analysis",
    navLabel: "Guides",
    kicker: "Guides & Analysis",
    description:
      "Explainers, frameworks and reported analysis designed to help operators, investors and policymakers make better decisions.",
  },
];

export const categoryMap = Object.fromEntries(
  categories.map((c) => [c.slug, c]),
) as Record<CategorySlug, Category>;

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

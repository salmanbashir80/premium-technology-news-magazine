import type { Article } from "../types";
import { images } from "./media";

export const articles: Article[] = [
  {
    id: "a01",
    slug: "ai-power-bottleneck-data-centers",
    title: "The new bottleneck in artificial intelligence is no longer compute. It is power.",
    dek: "Model labs still talk about parameters. Grid operators, utilities and chipmakers are talking about megawatts — and the gap between those conversations is becoming the story of the decade.",
    excerpt:
      "Across the US and UK, AI expansion is colliding with ageing grids, slow interconnection queues and a shortage of substations. The constraint has moved from silicon to electricity.",
    category: "ai",
    tags: ["Infrastructure", "Energy", "Data centres", "Policy"],
    authorId: "maya-ellison",
    publishedAt: "2026-03-18T07:30:00.000Z",
    updatedAt: "2026-03-18T16:10:00.000Z",
    readingTime: 14,
    featuredImage: images.heroAi,
    featuredImageCaption:
      "A demonstration GPU hall of the kind now being planned on both sides of the Atlantic. The limiting factor is increasingly the substation, not the rack.",
    featuredImageCredit: "Signal Desk demonstration image",
    isFeatured: true,
    isBreaking: false,
    isEditorsPick: true,
    isTrending: true,
    keyTakeaways: [
      "Electricity, not chips, is now the binding constraint on several large AI build-outs in the US and UK.",
      "Interconnection queues of five to seven years are forcing labs into unusual power-purchase and on-site generation deals.",
      "Utilities, not model companies, may set the practical ceiling on AI capacity through 2030.",
      "Policymakers are beginning to treat data-centre load as industrial policy rather than a planning nuisance.",
    ],
    body: [
      {
        type: "p",
        text: "For most of the past three years, the public conversation about artificial intelligence has been a conversation about models: how large they are, how capable they appear, and which laboratory will announce the next one. Inside the industry, that conversation is already out of date. The argument that now occupies chief executives, grid operators and chipmakers is more prosaic. It is about electricity.",
      },
      {
        type: "p",
        text: "This article is illustrative demo content prepared for the Signal Desk design prototype. It is not a report of real events, transactions or regulatory decisions. The reporting posture, structure and sourcing style are what a finished investigation would look like.",
      },
      {
        type: "p",
        text: "In northern Virginia, in west London, on the outskirts of Dallas and in a handful of Nordic municipalities that still have spare hydropower, the same pattern is repeating. A hyperscaler or model laboratory identifies a site. The land is available. The fibre is available. Even the GPUs, after two painful years, can be procured on a timetable. The substation is not. Interconnection studies stretch into 2030. Local networks were never designed for a single customer that wants 300 megawatts by Thursday.",
      },
      {
        type: "quote",
        text: "We can buy the chips. We cannot conjure a transmission line. That is the entire strategy document now.",
        attribution: "Infrastructure executive at a frontier lab, speaking for this demonstration piece",
      },
      {
        type: "h2",
        id: "from-flops-to-megawatts",
        text: "From FLOPs to megawatts",
      },
      {
        type: "p",
        text: "The shift is easy to miss if you still follow AI through product launches. Those remain theatrical. What has changed is the industrial stack underneath them. Training a frontier model is no longer a research exercise that happens to use a lot of computers. It is closer to commissioning a mid-sized industrial plant, with a power-purchase agreement, a water strategy and a political-risk memo.",
      },
      {
        type: "p",
        text: "A single modern training campus can draw as much electricity as a small city. Inference, once dismissed as the cheap leftover of training, is beginning to rival it as products move from demos into daily software. The result is a demand curve that utilities have not seen outside wartime manufacturing.",
      },
      {
        type: "table",
        caption: "Illustrative load comparison for a design prototype — not operational data.",
        headers: ["Facility type", "Typical load", "Time to interconnect", "Primary constraint"],
        rows: [
          ["Legacy enterprise data centre", "20–40 MW", "18–30 months", "Land and cooling"],
          ["Cloud region expansion", "80–150 MW", "3–5 years", "Transmission"],
          ["Frontier AI training campus", "250–500 MW", "5–7 years", "Substation + generation"],
          ["Inference cluster (urban edge)", "15–60 MW", "2–4 years", "Local network capacity"],
        ],
      },
      {
        type: "p",
        text: "Those numbers are directional, which is part of the problem. Companies treat their power needs as competitive intelligence. Utilities treat interconnection studies as confidential. The public debate, meanwhile, still proceeds as if the only scarce input is talent.",
      },
      {
        type: "h2",
        id: "the-queue",
        text: "The queue nobody wanted to own",
      },
      {
        type: "p",
        text: "In the United States, the interconnection queue has become a dark joke among energy lawyers. Projects wait years for studies that were designed for wind farms and factories, not for a customer that might double its load twice before the first transformer arrives. In Britain, the situation is different in legal form and similar in effect: constrained urban networks, ageing transmission, and a planning system that was not built for this kind of concentrated demand.",
      },
      {
        type: "p",
        text: "The commercial response has been improvisation. Some operators are signing behind-the-meter deals with gas plants they would have publicly disdained two years ago. Others are exploring small modular reactors with the enthusiasm of people who have run out of alternatives. A few are simply moving workloads to regions where the politics of power are quieter, even if the latency is worse.",
      },
      {
        type: "callout",
        variant: "analysis",
        title: "Signal Desk analysis",
        text: "If electricity remains the binding constraint, model capability will start to diverge by geography. Labs with privileged access to firm power will train more often, iterate faster and ship products the rest of the market can only rent. That is an industrial-policy outcome disguised as a technical one.",
      },
      {
        type: "h3",
        id: "on-site-generation",
        text: "On-site generation, and the politics that follow",
      },
      {
        type: "p",
        text: "On-site generation is no longer a footnote. It is a negotiating position. A campus that can light itself is a campus that can open on a timetable of its own choosing. It is also a campus that becomes a political object: a private power station sitting next to a town that was promised data-centre jobs and is now being asked to live with turbines, diesel backups or a new gas connection.",
      },
      {
        type: "p",
        text: "Community opposition is no longer theoretical. Local officials in several US counties have begun to treat data-centre applications the way they once treated casino bids — as a bargain to be extracted, not a gift to be accepted. In the UK, the argument is folding into a broader fight about housing, water and whether the country’s industrial strategy exists on paper only.",
      },
      {
        type: "image",
        src: images.chipFoundry,
        alt: "A semiconductor clean room, representative of the wider industrial stack behind AI.",
        caption: "Chips remain scarce in specific packages, but they are no longer the only scarce input. Power, packaging, networking and people now compete for the title.",
        credit: "Signal Desk demonstration image",
      },
      {
        type: "h2",
        id: "who-sets-the-ceiling",
        text: "Who actually sets the ceiling",
      },
      {
        type: "p",
        text: "The uncomfortable implication is that the ceiling on AI capacity through the end of the decade may be set not in Palo Alto or London’s King’s Cross, but in utility boardrooms and energy ministries. A model laboratory can raise another ten billion dollars. It cannot, by itself, rebuild a transmission corridor.",
      },
      {
        type: "p",
        text: "That redistributes power in the old-fashioned sense. Utilities that spent a decade being lectured about disruption now find themselves courted. Chipmakers are hiring energy specialists. Sovereign wealth funds that once wanted exposure to software are asking for term sheets that include megawatts.",
      },
      {
        type: "list",
        items: [
          "Procurement is shifting from GPU allocations to power-plus-compute packages.",
          "Secondary markets are forming around delayed interconnection rights.",
          "National security reviews are beginning to treat energy access as a strategic input to AI.",
          "Corporate climate pledges are colliding with the physics of 24-hour training runs.",
        ],
      },
      {
        type: "h2",
        id: "what-readers-should-watch",
        text: "What readers should watch next",
      },
      {
        type: "p",
        text: "The next phase of this story will not arrive as a keynote. It will arrive as a planning inquiry, a delayed substation, a quietly cancelled campus, or a power-purchase agreement that makes a model company look, for a moment, like an energy company that happens to train neural networks.",
      },
      {
        type: "p",
        text: "For operators, the practical advice is unfashionable: map your power before you map your model roadmap. For policymakers, the question is whether AI infrastructure should be treated as digital policy or as industrial plant. For investors, the tell is already visible in capital expenditure. The companies talking most loudly about intelligence are spending most quietly on transformers.",
      },
      {
        type: "quote",
        text: "If your AI strategy does not have a paragraph on interconnection, it is not a strategy. It is a press release.",
        attribution: "Energy-markets analyst, quoted for this demonstration article",
      },
      {
        type: "p",
        text: "Signal Desk will continue to treat this as a reported beat rather than a technology feature. The interesting questions are no longer about whether the models work. They are about who gets to turn them on.",
      },
    ],
    sources: [
      {
        title: "Illustrative utility interconnection statistics compiled for prototype",
        publisher: "Signal Desk research desk",
        note: "Demo material. Not drawn from a live filing.",
      },
      {
        title: "Background interviews with energy and infrastructure sources",
        publisher: "Signal Desk",
        note: "Composite sourcing style for design purposes.",
      },
      {
        title: "Public-style comparison of data-centre load ranges",
        publisher: "Editorial research memo",
        note: "Figures are directional and labelled as illustrative.",
      },
    ],
    corrections: [],
    status: "published",
    isDemo: true,
  },
  {
    id: "a02",
    slug: "smaller-specialised-ai-models",
    title: "Why the next generation of AI models will be smaller, cheaper and more specialised",
    dek: "The industry spent two years worshipping scale. The buyers who write the cheques are now asking a different question: what, exactly, is this model for?",
    excerpt:
      "Enterprises are quietly abandoning the idea that one frontier model should do everything. The commercial future looks more like a workshop than a cathedral.",
    category: "ai",
    tags: ["Models", "Enterprise", "Open source"],
    authorId: "maya-ellison",
    publishedAt: "2026-03-17T09:00:00.000Z",
    updatedAt: "2026-03-17T09:00:00.000Z",
    readingTime: 8,
    featuredImage: images.chatgpt,
    featuredImageCaption: "A model interface is no longer the product. The product is a system that can be governed, costed and specialised.",
    featuredImageCredit: "Pexels / Matheus Bertelli",
    isFeatured: false,
    isBreaking: false,
    isEditorsPick: true,
    isTrending: true,
    keyTakeaways: [
      "Procurement teams are shifting from ‘best model’ to ‘best model for this workflow’.",
      "Open-weight systems have made specialised fine-tunes commercially realistic.",
      "Inference cost, not training prestige, is now the number boards actually read.",
    ],
    body: [
      {
        type: "p",
        text: "The most important sentence in enterprise AI this year is not a benchmark. It is a question from a chief financial officer: why are we paying frontier prices for a task that a specialised model can do overnight? This is demo analysis for Signal Desk, written in the register of a reported feature.",
      },
      {
        type: "p",
        text: "Scale was a useful story when the market needed a story. It is a less useful operating system. Once a company has identified the twenty workflows that actually matter — claims, code review, contract markup, customer email, document intake — the argument for a single gigantic model begins to look like the argument for a single gigantic ERP: theoretically elegant, operationally expensive, politically convenient for the vendor.",
      },
      {
        type: "h2",
        id: "the-workshop",
        text: "The workshop model",
      },
      {
        type: "p",
        text: "What is emerging instead is a workshop. A small routing layer. A handful of specialised models, some open-weight, some licensed. Tight evaluation harnesses. Retrieval that is treated as a product, not a feature. Humans who still own the last mile because the last mile is where the liability lives.",
      },
      {
        type: "quote",
        text: "We stopped asking which model is smartest. We started asking which model we can defend in a board minutes.",
        attribution: "Fictional composite of enterprise buyers, for this demo",
      },
      {
        type: "callout",
        variant: "info",
        title: "What changed",
        text: "Open-weight models collapsed the cost of experimentation. Evaluation tooling made quality visible. Finance teams learned to read tokens the way they once read cloud invoices. Together those three shifts ended the era of unexamined frontier default.",
      },
      {
        type: "p",
        text: "None of this means frontier labs become irrelevant. They remain the research engines and, in many cases, the best general interfaces. It does mean their pricing power will be tested by customers who have finally learned to disaggregate the stack.",
      },
    ],
    sources: [
      {
        title: "Composite of demo buyer interviews",
        publisher: "Signal Desk",
        note: "Illustrative only.",
      },
    ],
    corrections: [],
    status: "published",
    isDemo: true,
  },
  {
    id: "a03",
    slug: "chip-war-supply-chains",
    title: "Inside the quiet chip war that is redrawing global supply chains",
    dek: "Export controls were supposed to be a scalpel. Three years on, they look more like industrial geography.",
    excerpt:
      "Packaging, chemicals, lithography tools and talent are moving in ways that will outlast any single export rule. The map of computing is being redrawn in slow motion.",
    category: "technology",
    tags: ["Semiconductors", "Geopolitics", "Supply chain"],
    authorId: "james-whitfield",
    publishedAt: "2026-03-16T11:20:00.000Z",
    updatedAt: "2026-03-16T18:40:00.000Z",
    readingTime: 11,
    featuredImage: images.chipFoundry,
    featuredImageCaption: "Advanced packaging and lithography have become as strategically sensitive as the design tools that precede them.",
    featuredImageCredit: "Signal Desk demonstration image",
    isFeatured: false,
    isBreaking: false,
    isEditorsPick: true,
    isTrending: true,
    keyTakeaways: [
      "The constraint has shifted from leading-edge wafers to a longer list: packaging, chemicals, tools and people.",
      "Allied industrial policy is creating parallel supply chains that are more expensive and more political.",
      "Companies are dual-sourcing not for efficiency but for optionality.",
    ],
    body: [
      {
        type: "p",
        text: "The semiconductor industry used to describe itself as globalised. That word now sounds like nostalgia. What has replaced it is a set of overlapping industrial policies, each pretending to be a security measure, each quietly becoming a jobs programme. This is demo editorial content for Signal Desk.",
      },
      {
        type: "p",
        text: "The public focuses on the most advanced logic chips, which is understandable and incomplete. The chokepoints that actually stop a factory are often duller: a photoresist, a substrate, a technician who knows how to keep a tool alive at 3am. Those are the things moving.",
      },
      {
        type: "h2",
        id: "parallel-stacks",
        text: "Parallel stacks, higher bills",
      },
      {
        type: "p",
        text: "Building a second supply chain is not a metaphor. It is a bill. Every duplicated packaging line, every redundant chemical supplier, every additional qualification cycle shows up as cost. Some of that cost is being socialised through subsidies. The rest is being passed into server prices, phone prices and, eventually, software prices.",
      },
      {
        type: "table",
        caption: "Illustrative pressure points — prototype data only.",
        headers: ["Layer", "Former assumption", "Current reality"],
        rows: [
          ["Design software", "Global licences", "Jurisdiction-aware access"],
          ["Leading-edge foundry", "One or two sites matter", "Political capacity matters as much as technical"],
          ["Advanced packaging", "Back-end, therefore boring", "Strategic, scarce, slow to copy"],
          ["Specialty chemicals", "Traded commodities", "Export-reviewed inputs"],
        ],
      },
      {
        type: "quote",
        text: "We used to optimise for cost. Now we optimise for the right to exist in two markets at once.",
        attribution: "Supply-chain executive, demonstration quotation",
      },
      {
        type: "p",
        text: "For readers in London and Washington the policy rhyme is similar even when the instruments differ: both capitals have discovered that computing is a physical industry, and physical industries require patience.",
      },
    ],
    sources: [
      {
        title: "Demo policy timeline compiled by the technology desk",
        publisher: "Signal Desk",
        note: "Not a live legal analysis.",
      },
    ],
    corrections: [
      {
        date: "2026-03-16",
        text: "An earlier demo version of this article used an incorrect illustrative figure for packaging lead times. It has been updated.",
      },
    ],
    status: "published",
    isDemo: true,
  },
  {
    id: "a04",
    slug: "london-fintech-series-d",
    title: "A London fintech’s $400m round, and what it actually signals for European venture",
    dek: "The headline will be the valuation. The more interesting number is how little of the capital is earmarked for growth theatre.",
    excerpt:
      "European late-stage funding is not back. It is becoming more selective, more operational, and less impressed by narrative.",
    category: "startups",
    tags: ["Venture", "Fintech", "Europe"],
    authorId: "priya-ramanathan",
    publishedAt: "2026-03-18T12:00:00.000Z",
    updatedAt: "2026-03-18T12:00:00.000Z",
    readingTime: 7,
    featuredImage: images.london,
    featuredImageCaption: "London remains Europe’s deepest pool of fintech talent and its most sceptical audience for a pitch deck.",
    featuredImageCredit: "Pexels / Samuel Sweet",
    isFeatured: false,
    isBreaking: true,
    isEditorsPick: false,
    isTrending: true,
    keyTakeaways: [
      "Late-stage European capital is returning to companies with real unit economics, not category narratives.",
      "The round’s structure matters more than the headline valuation.",
      "US funds are still present, but they are no longer setting the cultural terms.",
    ],
    body: [
      {
        type: "p",
        text: "Every few months London produces a funding announcement large enough to restart the old argument: is European venture back? The honest answer, for this demonstration article, is that the question is the wrong one. What is back is discrimination. Capital is available for companies that can describe their economics without a fog machine.",
      },
      {
        type: "p",
        text: "The fictional company in this prototype — a payments infrastructure business with regulated licences in four markets — raised a $400 million Series D. The more revealing detail is the use of proceeds: compliance, bank partnerships, and a plodding expansion into the Midwest of the United States. Not a superbowl advertisement.",
      },
      {
        type: "h2",
        id: "what-changed-in-the-room",
        text: "What changed in the room",
      },
      {
        type: "p",
        text: "Partners who once competed to sound visionary now compete to sound adult. They ask about contribution margin after fraud. They ask about the cost of a licence in Germany. They ask whether the founder still wants to be a founder in year nine. These are unromantic questions. They are also how industries mature.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Demo note",
        text: "No real company, round or valuation is being described here. The piece exists to show how Signal Desk would cover a late-stage European financing.",
      },
    ],
    sources: [
      {
        title: "Prototype term-sheet structure",
        publisher: "Signal Desk startups desk",
        note: "Fictional.",
      },
    ],
    corrections: [],
    status: "published",
    isDemo: true,
  },
  {
    id: "a05",
    slug: "conversational-commerce-checkout",
    title: "Retailers are rebuilding checkout around conversational commerce",
    dek: "The shopping cart is beginning to look like a legacy object. What replaces it is a chat that can take payment — and be audited.",
    excerpt:
      "E-commerce teams are discovering that an interface can be conversational without being chaotic. The hard part is not the model. It is the merchandising system behind it.",
    category: "ecommerce",
    tags: ["Retail", "Payments", "Interfaces"],
    authorId: "helen-cho",
    publishedAt: "2026-03-15T08:45:00.000Z",
    updatedAt: "2026-03-15T08:45:00.000Z",
    readingTime: 6,
    featuredImage: images.packing,
    featuredImageCaption: "The warehouse does not care how a customer asked for the item. It cares whether the order is clean.",
    featuredImageCredit: "Pexels / Kampus Production",
    isFeatured: false,
    isBreaking: false,
    isEditorsPick: false,
    isTrending: false,
    keyTakeaways: [
      "Conversational checkout only works when catalogue data is cleaner than most retailers admit.",
      "Payments and returns, not the chat bubble, are the real product problem.",
      "Brands that treat this as a skin on the old cart will ship a novelty. Brands that rebuild merchandising will ship a channel.",
    ],
    body: [
      {
        type: "p",
        text: "A decade of e-commerce optimisation produced a checkout flow that is extremely good at one thing: extracting a card number from a tired person. Conversational commerce asks whether that person might rather describe what they want. This is demo reporting for Signal Desk.",
      },
      {
        type: "p",
        text: "Early deployments have a tell. When the catalogue is messy, the conversation becomes a customer-service ticket. When the catalogue is structured, the conversation becomes a sales associate who never clocks off. The difference is not the model vendor. It is whether product data was treated as a first-class system.",
      },
      {
        type: "h2",
        id: "audit-trails",
        text: "The unglamorous necessity of an audit trail",
      },
      {
        type: "p",
        text: "Regulators, payment processors and returns teams all need to know why a particular SKU was offered at a particular price. A freewheeling chat that cannot reconstruct its own reasoning is not a store. It is a liability.",
      },
    ],
    sources: [
      {
        title: "Demo retailer interviews",
        publisher: "Signal Desk",
        note: "Illustrative.",
      },
    ],
    corrections: [],
    status: "published",
    isDemo: true,
  },
  {
    id: "a06",
    slug: "board-cybersecurity-gap",
    title: "The cybersecurity gap most boards still refuse to fund",
    dek: "Identity, backups and third parties remain underfunded while companies buy another dashboard. Attackers have noticed.",
    excerpt:
      "Incident responders keep finding the same absences: stale identity, unrehearsed restoration, and vendors that were never truly in scope. The tools were never the whole problem.",
    category: "cybersecurity",
    tags: ["Boards", "Identity", "Ransomware"],
    authorId: "oliver-grant",
    publishedAt: "2026-03-14T10:15:00.000Z",
    updatedAt: "2026-03-14T21:00:00.000Z",
    readingTime: 9,
    featuredImage: images.cyberOps,
    featuredImageCaption: "Operations centres look dramatic. The failures that matter usually happen in identity systems that nobody wanted to own.",
    featuredImageCredit: "Signal Desk demonstration image",
    isFeatured: false,
    isBreaking: false,
    isEditorsPick: true,
    isTrending: true,
    keyTakeaways: [
      "Most serious incidents still begin with identity, not with a novel exploit.",
      "Boards fund visibility more readily than restoration.",
      "Third-party scope is where optimistic diagrams go to die.",
    ],
    body: [
      {
        type: "p",
        text: "If you sit in enough incident reviews you begin to hear a rhyme. The novel malware is rarely the point. The point is a service account that should have been retired, a backup that was never restored in anger, and a vendor whose access nobody could describe on a whiteboard. This is demonstration reporting for Signal Desk.",
      },
      {
        type: "p",
        text: "Boards are not indifferent. They are misinformed by catalogues. Security spending has a retail logic: dashboards are easy to present; identity hygiene is not. Restoration rehearsals do not photograph well. Vendor inventories make executives uncomfortable because they reveal how little of the estate is truly internal.",
      },
      {
        type: "h2",
        id: "three-absences",
        text: "Three absences, repeated",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Identity: privileged access that grew by accretion and was never redesigned.",
          "Restoration: backups that exist as a slide but not as a timed exercise.",
          "Third parties: contracts that mention security without defining the blast radius.",
        ],
      },
      {
        type: "quote",
        text: "We did not fail to detect. We failed to be able to continue. Those are different failures, and only one of them is glamorous.",
        attribution: "Incident commander, demonstration quotation",
      },
      {
        type: "callout",
        variant: "analysis",
        title: "A better board question",
        text: "Not ‘how many alerts did we see?’ but ‘how long would it take to restore the payments system from a cold start, and when did we last time it?’",
      },
      {
        type: "p",
        text: "None of this requires a new category of startup. It requires unfashionable work. That is precisely why it remains the gap.",
      },
    ],
    sources: [
      {
        title: "Composite incident patterns for prototype",
        publisher: "Signal Desk cybersecurity desk",
        note: "Not a live incident report.",
      },
    ],
    corrections: [],
    status: "published",
    isDemo: true,
  },
  {
    id: "a07",
    slug: "open-source-models-enterprise-buying",
    title: "How open-weight models changed the enterprise buying cycle",
    dek: "Legal took six months. Engineering took a weekend. That mismatch is now the sales cycle.",
    excerpt:
      "Open-weight systems did not kill the model vendors. They gave buyers a BATNA — and procurement has never been the same.",
    category: "ai",
    tags: ["Open source", "Procurement", "Enterprise"],
    authorId: "maya-ellison",
    publishedAt: "2026-03-12T07:00:00.000Z",
    updatedAt: "2026-03-12T07:00:00.000Z",
    readingTime: 7,
    featuredImage: images.labWoman,
    featuredImageCaption: "Evaluation used to be a vendor-led ritual. It is becoming an internal engineering practice.",
    featuredImageCredit: "Pexels / Mikhail Nilov",
    isFeatured: false,
    isBreaking: false,
    isEditorsPick: false,
    isTrending: false,
    keyTakeaways: [
      "A credible internal alternative shortens some negotiations and lengthens others.",
      "Legal review, not model quality, is the slow variable.",
      "Vendors now sell governance and distribution as much as raw capability.",
    ],
    body: [
      {
        type: "p",
        text: "Before open-weight models, an enterprise AI negotiation had a familiar shape. The vendor arrived with a benchmark, a security white paper and a sense that the customer had nowhere else to go. That sense has evaporated. This is demo analysis.",
      },
      {
        type: "p",
        text: "Engineering teams can now stand up a specialised model on a Friday. Counsel still needs to decide whether the weights, the data, the logs and the indemnity are acceptable. The buying cycle is therefore both faster and slower, which is an unpleasant combination for quota-carrying salespeople.",
      },
      {
        type: "h2",
        id: "what-vendors-sell-now",
        text: "What vendors actually sell now",
      },
      {
        type: "p",
        text: "Capability is table stakes. The differentiators are evaluation tooling, data governance, latency SLAs, and the political cover of a name a board already recognises. In other words: the model is the demo. The company is the product.",
      },
    ],
    sources: [
      {
        title: "Demo procurement notes",
        publisher: "Signal Desk",
        note: "Illustrative.",
      },
    ],
    corrections: [],
    status: "published",
    isDemo: true,
  },
  {
    id: "a08",
    slug: "app-store-regulation-five-years",
    title: "Apple, regulation and the next five years of the App Store",
    dek: "The legal map is fragmenting. The commercial question is whether Apple’s gravity still holds when the exits are real.",
    excerpt:
      "From the DMA in Europe to state-level fights in the US, the store that defined mobile software is being forced to become one channel among several.",
    category: "business",
    tags: ["Apple", "Regulation", "Mobile"],
    authorId: "helen-cho",
    publishedAt: "2026-03-11T13:30:00.000Z",
    updatedAt: "2026-03-11T13:30:00.000Z",
    readingTime: 8,
    featuredImage: images.phone,
    featuredImageCaption: "The phone remains the most valuable piece of glass in consumer technology. The store on top of it is no longer uncontested.",
    featuredImageCredit: "Pexels / Jatin Jangid",
    isFeatured: false,
    isBreaking: false,
    isEditorsPick: false,
    isTrending: true,
    keyTakeaways: [
      "Regulatory pressure is uneven across the US and UK/EU, which is itself a strategy problem for developers.",
      "Apple’s advantage is still the customer relationship, not the payment rail.",
      "The next five years will be won by companies that can operate in more than one commercial geometry.",
    ],
    body: [
      {
        type: "p",
        text: "For fifteen years the App Store was not merely a shop. It was a constitution. Developers learned its rules the way medieval merchants learned a city’s tariffs. That era is ending in pieces, which is a more chaotic outcome than either Apple or its critics wanted. Demo analysis for Signal Desk.",
      },
      {
        type: "p",
        text: "Europe has forced openings. American litigation has created uncertainty without yet creating a clean alternative. Britain is writing its own version of the same argument. Developers, who just wanted to sell a subscription, now maintain a matrix of compliance.",
      },
      {
        type: "quote",
        text: "We did not want a war with Apple. We wanted a second cash register. Those turned out to be the same request.",
        attribution: "App developer, demonstration quotation",
      },
      {
        type: "p",
        text: "The lasting advantage may still sit with the company that owns the hardware relationship. But gravity is not the same thing as a monopoly on the till.",
      },
    ],
    sources: [
      {
        title: "Prototype regulatory comparison",
        publisher: "Signal Desk business desk",
        note: "Not legal advice.",
      },
    ],
    corrections: [],
    status: "published",
    isDemo: true,
  },
  {
    id: "a09",
    slug: "evaluating-ai-vendors-guide",
    title: "A practical guide to evaluating AI vendors without the theatre",
    dek: "Ignore the keynote. Build a harness, pick five tasks, and make the model fail in front of you.",
    excerpt:
      "Most AI evaluations are still sales processes in costume. A serious one looks more like quality engineering than a demo day.",
    category: "guides",
    tags: ["Procurement", "Evaluation", "Playbook"],
    authorId: "james-whitfield",
    publishedAt: "2026-03-10T09:00:00.000Z",
    updatedAt: "2026-03-10T09:00:00.000Z",
    readingTime: 10,
    featuredImage: images.coding,
    featuredImageCaption: "If you cannot measure failure, you are not evaluating. You are being sold to.",
    featuredImageCredit: "Pexels / Daniil Komov",
    isFeatured: false,
    isBreaking: false,
    isEditorsPick: true,
    isTrending: false,
    keyTakeaways: [
      "A vendor-supplied demo is not an evaluation.",
      "Five real tasks, held constant, beat a hundred benchmarks.",
      "Cost, latency, governance and failure modes belong on the same scorecard as quality.",
    ],
    body: [
      {
        type: "p",
        text: "The easiest way to waste a year of AI budget is to confuse a polished demonstration with evidence. This guide is demonstration editorial, written the way Signal Desk would brief an operator who has already sat through too many decks.",
      },
      {
        type: "h2",
        id: "build-the-harness",
        text: "1. Build the harness first",
      },
      {
        type: "p",
        text: "Before a vendor arrives, write down five tasks that already exist in the business. Use real documents, real tickets, real messy data. Decide what ‘good’ looks like in a sentence a sceptic would accept. Then, and only then, invite the model in.",
      },
      {
        type: "h2",
        id: "score-the-ugly-parts",
        text: "2. Score the ugly parts",
      },
      {
        type: "list",
        items: [
          "Does it fail loudly or silently?",
          "Can you reconstruct why it answered?",
          "What does a bad day cost, in tokens and in people?",
          "Who is liable when it is confidently wrong?",
        ],
      },
      {
        type: "h2",
        id: "keep-a-control",
        text: "3. Keep a control",
      },
      {
        type: "p",
        text: "Run the same tasks on a cheaper specialised model and on a competent human. If the frontier system cannot beat both on the metrics you actually care about, you do not have a deployment. You have a story.",
      },
      {
        type: "callout",
        variant: "info",
        title: "A one-page scorecard",
        text: "Quality on held-out tasks. Cost per successful outcome. p95 latency. Data handling. Identity integration. Exit clause. If a vendor cannot sit still for those six, they are not ready for your production environment.",
      },
      {
        type: "table",
        caption: "Illustrative scorecard — replace with your own weights.",
        headers: ["Dimension", "Weight", "What ‘good’ looks like"],
        rows: [
          ["Task quality", "30%", "Beats current process on a frozen set"],
          ["Cost", "20%", "Fully loaded cost per successful outcome"],
          ["Latency", "15%", "Fits the human workflow, not a benchmark"],
          ["Governance", "20%", "Logs, access, retention, indemnity"],
          ["Exit", "15%", "You can leave without a rewrite"],
        ],
      },
    ],
    sources: [
      {
        title: "Internal evaluation memo, prototype",
        publisher: "Signal Desk guides desk",
        note: "Educational demo.",
      },
    ],
    corrections: [],
    status: "published",
    isDemo: true,
  },
  {
    id: "a10",
    slug: "startups-profitability-wrong-metric",
    title: "Startups are returning to profitability — and VCs are watching the wrong metric",
    dek: "Contribution margin after human review is the number. Headcount theatre is not.",
    excerpt:
      "A generation of companies is discovering that AI can raise gross margin or raise support costs. Investors who do not separate those outcomes will be surprised.",
    category: "startups",
    tags: ["Venture", "Margins", "AI ops"],
    authorId: "priya-ramanathan",
    publishedAt: "2026-03-09T15:10:00.000Z",
    updatedAt: "2026-03-09T15:10:00.000Z",
    readingTime: 6,
    featuredImage: images.startupPitch,
    featuredImageCaption: "The pitch has changed. The spreadsheet has not always kept up.",
    featuredImageCredit: "Signal Desk demonstration image",
    isFeatured: false,
    isBreaking: false,
    isEditorsPick: false,
    isTrending: false,
    keyTakeaways: [
      "AI features can conceal labour rather than remove it.",
      "Profitability that depends on unpaid founder review is not profitability.",
      "The right metric is contribution after the humans the product still needs.",
    ],
    body: [
      {
        type: "p",
        text: "There is a fashionable sentence in venture this year: the company is profitable. Sometimes it is even true. Often it is true only if you ignore the contractors in Manila, the founder who still reviews every output, and the refund line that has not found its way into the cohort chart. Demo commentary for Signal Desk.",
      },
      {
        type: "p",
        text: "The companies worth taking seriously can show you a contribution margin after human review, by cohort, without reaching for a narrative about ‘leverage coming next quarter’.",
      },
    ],
    sources: [
      {
        title: "Demo operator conversations",
        publisher: "Signal Desk",
        note: "Illustrative.",
      },
    ],
    corrections: [],
    status: "published",
    isDemo: true,
  },
  {
    id: "a11",
    slug: "uk-ai-safety-institute",
    title: "The UK’s AI safety institute, one year on",
    dek: "Whitehall wanted a serious technical body. What it got is a test of whether Britain can hold talent without holding equity.",
    excerpt:
      "The institute has produced useful evaluations and a harder question: can a public body keep pace with laboratories that refresh weights every quarter?",
    category: "ai",
    tags: ["UK", "Policy", "Safety"],
    authorId: "maya-ellison",
    publishedAt: "2026-03-08T08:20:00.000Z",
    updatedAt: "2026-03-08T08:20:00.000Z",
    readingTime: 8,
    featuredImage: images.newsroom,
    featuredImageCaption: "Policy shops and newsrooms now share a problem: the underlying systems move faster than the institutions that describe them.",
    featuredImageCredit: "Signal Desk demonstration image",
    isFeatured: false,
    isBreaking: false,
    isEditorsPick: false,
    isTrending: false,
    keyTakeaways: [
      "Evaluation capacity is a national asset if it is staffed like one.",
      "Access to models remains the political bottleneck.",
      "The UK’s influence will depend on method, not on metaphor.",
    ],
    body: [
      {
        type: "p",
        text: "Britain’s bet was distinctive: rather than race to build a national champion model, build a national capacity to understand everybody else’s. A year into that experiment, the institute looks like a serious technical organisation trapped in a civil-service compensation band. This is demo political reporting.",
      },
      {
        type: "p",
        text: "The work that matters is unglamorous. Evaluations. Access agreements. The slow construction of a methodology that other governments might actually reuse. Whether that is enough to keep the people capable of doing it is an HR story with geopolitical consequences.",
      },
      {
        type: "h2",
        id: "access",
        text: "Access is policy",
      },
      {
        type: "p",
        text: "Without privileged access to frontier systems, an evaluator is just another user with a clever prompt. The diplomatic work of obtaining that access is therefore not a side quest. It is the job.",
      },
    ],
    sources: [
      {
        title: "Demo policy briefing",
        publisher: "Signal Desk",
        note: "Not a government document.",
      },
    ],
    corrections: [],
    status: "published",
    isDemo: true,
  },
  {
    id: "a12",
    slug: "warehouse-robotics-margin-war",
    title: "Warehouse robotics is no longer a moonshot. It is a margin war.",
    dek: "The robots arrived. The argument now is about pick rates, maintenance contracts and who owns the software layer.",
    excerpt:
      "Fulfilment centres in the US and UK are quietly filling with machines. The winners will be the companies that treat robotics as operations, not as spectacle.",
    category: "ecommerce",
    tags: ["Logistics", "Robotics", "Retail"],
    authorId: "helen-cho",
    publishedAt: "2026-03-07T11:00:00.000Z",
    updatedAt: "2026-03-07T11:00:00.000Z",
    readingTime: 7,
    featuredImage: images.warehouse,
    featuredImageCaption: "Once the novelty fades, a robot is a cost centre with a service agreement.",
    featuredImageCredit: "Signal Desk demonstration image",
    isFeatured: false,
    isBreaking: false,
    isEditorsPick: false,
    isTrending: false,
    keyTakeaways: [
      "Robotics ROI is won in integration and uptime, not in a launch video.",
      "Labour shortages made the business case; software will decide the margin.",
      "Retailers that do not own their orchestration layer will rent their advantage.",
    ],
    body: [
      {
        type: "p",
        text: "A decade ago warehouse robotics was a keynote. Today it is a line item. The machines work. They also break, require spare parts, and expose every weakness in a retailer’s inventory data. Demo feature for Signal Desk.",
      },
      {
        type: "p",
        text: "The strategic question has therefore shifted. Not ‘should we automate?’ but ‘who owns the software that tells the robots what to do when Christmas arrives early?’",
      },
      {
        type: "h2",
        id: "uptime",
        text: "Uptime is the product",
      },
      {
        type: "p",
        text: "A 2% improvement in pick rate is interesting. A weekend of downtime during a promotions calendar is existential. Vendors that sell spectacle without a maintenance culture are about to discover the difference.",
      },
    ],
    sources: [
      {
        title: "Demo logistics interviews",
        publisher: "Signal Desk",
        note: "Illustrative.",
      },
    ],
    corrections: [],
    status: "published",
    isDemo: true,
  },
  {
    id: "a13",
    slug: "ransomware-third-party-risk",
    title: "What the latest ransomware campaign tells us about third-party risk",
    dek: "The target was not the company on the homepage. It was the remote-support tool everybody had agreed was ‘low risk’.",
    excerpt:
      "A demonstration incident pattern: a trusted vendor, a reused credential, and a weekend of pretending the diagram still matched the network.",
    category: "cybersecurity",
    tags: ["Ransomware", "Vendors", "Incident response"],
    authorId: "oliver-grant",
    publishedAt: "2026-03-06T06:40:00.000Z",
    updatedAt: "2026-03-06T19:15:00.000Z",
    readingTime: 8,
    featuredImage: images.cyber1,
    featuredImageCaption: "By the time the wall screens look cinematic, the important decisions have already been missed.",
    featuredImageCredit: "Pexels / Tima Miroshnichenko",
    isFeatured: false,
    isBreaking: true,
    isEditorsPick: false,
    isTrending: true,
    keyTakeaways: [
      "Trusted remote tools remain a favourite path because they are supposed to be trusted.",
      "Contract language about ‘industry standard security’ is not a control.",
      "The first 12 hours still decide whether an incident is an outage or an existential event.",
    ],
    body: [
      {
        type: "p",
        text: "The campaign described in this prototype did not begin with a brilliant exploit. It began with a helpdesk tool that had been granted a kind of diplomatic immunity because it was inconvenient to question. Demo incident analysis for Signal Desk — not a report of a live event.",
      },
      {
        type: "p",
        text: "Once inside, the operators did what competent ransomware groups do. They learned the backup schedule. They waited. They left a note that was polite, specific and economically rational.",
      },
      {
        type: "h2",
        id: "the-diagram-lie",
        text: "The diagram was a lie",
      },
      {
        type: "p",
        text: "Every company has a network diagram that was true in a particular month of a particular year. Incidents happen in the delta between that diagram and the access that accumulated afterwards. Third parties live in that delta.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "If you only do one thing",
        text: "Inventory the remote-access tools that can reach production. Assume each one is a potential domain admin. Then prove otherwise.",
      },
    ],
    sources: [
      {
        title: "Composite incident pattern",
        publisher: "Signal Desk",
        note: "Fictionalised for the prototype.",
      },
    ],
    corrections: [],
    status: "published",
    isDemo: true,
  },
  {
    id: "a14",
    slug: "microsoft-openai-distribution",
    title: "Microsoft, OpenAI and the uneasy economics of distribution",
    dek: "One company has the customers. The other has the myth. The contract between them is now a map of the industry.",
    excerpt:
      "Distribution is the unsolved problem in generative software. Partnerships that looked inevitable in 2023 now look like a negotiation without an off-ramp.",
    category: "business",
    tags: ["Microsoft", "OpenAI", "Distribution"],
    authorId: "helen-cho",
    publishedAt: "2026-03-05T12:00:00.000Z",
    updatedAt: "2026-03-05T12:00:00.000Z",
    readingTime: 9,
    featuredImage: images.boardroom,
    featuredImageCaption: "The most important conversations in this industry no longer happen on stage.",
    featuredImageCredit: "Pexels / Werner Pfennig",
    isFeatured: false,
    isBreaking: false,
    isEditorsPick: true,
    isTrending: false,
    keyTakeaways: [
      "Distribution remains more valuable, and more fragile, than model prestige.",
      "Cloud credits, exclusivity and brand risk are now the same conversation.",
      "Enterprises will multi-home. Contracts that assume otherwise will age badly.",
    ],
    body: [
      {
        type: "p",
        text: "Every platform era produces a couple that the rest of the industry cannot stop watching. In this one it is the software company that already sits on every desk and the laboratory that taught the public to care. Their relationship is demonstration material here, used to explore how Signal Desk would write about distribution without turning it into gossip.",
      },
      {
        type: "p",
        text: "The economic tension is simple to state and hard to live with. A model company needs distribution or it becomes a research boutique. A platform company needs a model or it becomes a suite with a chatbot bolted on. Neither wants to be the junior partner. Both already are, in different rooms.",
      },
      {
        type: "h2",
        id: "multi-home",
        text: "Customers will multi-home",
      },
      {
        type: "p",
        text: "The enterprise conclusion is already visible. Nobody wants a single throat to choke if that throat can also raise prices. Multi-homing is not a rebellion. It is hygiene.",
      },
    ],
    sources: [
      {
        title: "Demo corporate analysis",
        publisher: "Signal Desk business desk",
        note: "Illustrative commentary.",
      },
    ],
    corrections: [],
    status: "published",
    isDemo: true,
  },
  {
    id: "a15",
    slug: "how-to-read-series-b-2026",
    title: "How to read a Series B deck in 2026",
    dek: "Skip the total addressable market. Start with the cohort that would still pay if the founder stopped posting.",
    excerpt:
      "A working method for operators and angels who have grown tired of slides that could belong to any company in the category.",
    category: "guides",
    tags: ["Venture", "Fundraising", "Framework"],
    authorId: "priya-ramanathan",
    publishedAt: "2026-03-04T10:00:00.000Z",
    updatedAt: "2026-03-04T10:00:00.000Z",
    readingTime: 9,
    featuredImage: images.briefing,
    featuredImageCaption: "The useful information is rarely on the page the founder wants to linger on.",
    featuredImageCredit: "Pexels / Anna Shvets",
    isFeatured: false,
    isBreaking: false,
    isEditorsPick: false,
    isTrending: false,
    keyTakeaways: [
      "Category slides are a tell. Specificity is a better one.",
      "Retention after the founder’s involvement is the adult metric.",
      "AI features should be costed, not merely listed.",
    ],
    body: [
      {
        type: "p",
        text: "A Series B deck is a personality test. Some founders use it to think. Most use it to perform thinking. This guide, prepared as demo editorial, is a method for reading the second kind without becoming cruel.",
      },
      {
        type: "h2",
        id: "the-order",
        text: "Read in this order",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "The cohort chart, not the logo slide.",
          "Gross margin after the humans the product still needs.",
          "Concentration: how much revenue sits in the top ten customers.",
          "The hiring plan versus the actual bottleneck.",
          "The slide that admits what is not working.",
        ],
      },
      {
        type: "callout",
        variant: "analysis",
        title: "A useful prejudice",
        text: "If the competitive slide is a two-by-two with the company in the top right, put the deck down and ask for the customer calls. The truth is in the calls.",
      },
      {
        type: "p",
        text: "None of this replaces taste. It simply prevents taste from being hijacked by typography.",
      },
    ],
    sources: [
      {
        title: "Operator notes, prototype",
        publisher: "Signal Desk",
        note: "Educational demo.",
      },
    ],
    corrections: [],
    status: "published",
    isDemo: true,
  },
  {
    id: "a16",
    slug: "browser-becoming-agent",
    title: "The browser is becoming an agent. Publishers should pay attention.",
    dek: "When the window starts acting on a user’s behalf, the open web’s business model meets another reckoning.",
    excerpt:
      "Agentic browsing turns publishers from destinations into sources. The commercial terms of that transformation have not been written.",
    category: "technology",
    tags: ["Browsers", "Publishing", "Agents"],
    authorId: "james-whitfield",
    publishedAt: "2026-03-03T16:45:00.000Z",
    updatedAt: "2026-03-03T16:45:00.000Z",
    readingTime: 7,
    featuredImage: images.darkCode,
    featuredImageCaption: "The interface is no longer a page. It is a process that visits pages without asking permission in the old way.",
    featuredImageCredit: "Pexels / Rahul Pandit",
    isFeatured: false,
    isBreaking: false,
    isEditorsPick: false,
    isTrending: true,
    keyTakeaways: [
      "Agentic browsing changes who is the customer of a publisher.",
      "Robots.txt was not designed for this.",
      "New commercial terms will be negotiated in law, product and spite.",
    ],
    body: [
      {
        type: "p",
        text: "A browser that can book, extract, summarise and click is not a window. It is an employee with no employment contract. For publishers, that is either a distribution channel or a theft, depending on who is writing the blog post. Demo analysis for Signal Desk.",
      },
      {
        type: "p",
        text: "The industry has been here before, with search. It told itself a story about traffic. Some of that story was true. A lot of it was a way of not having a better one. Agentic interfaces will force a more honest negotiation because they do not even pretend to send the reader.",
      },
      {
        type: "quote",
        text: "If your reader is a model, you are not in media. You are in data licensing, and you should start acting like it.",
        attribution: "Publishing strategist, demonstration quotation",
      },
    ],
    sources: [
      {
        title: "Demo publishing brief",
        publisher: "Signal Desk",
        note: "Illustrative.",
      },
    ],
    corrections: [],
    status: "published",
    isDemo: true,
  },
  {
    id: "a17",
    slug: "european-cloud-sovereignty",
    title: "Why European cloud sovereignty is finally a procurement issue",
    dek: "Boards used to treat residency as a compliance checkbox. They now treat it as continuity planning.",
    excerpt:
      "Geopolitics, regulation and a series of ugly outages have moved ‘where does this run?’ from the appendix to the first page of the RFP.",
    category: "technology",
    tags: ["Cloud", "Europe", "Procurement"],
    authorId: "james-whitfield",
    publishedAt: "2026-03-02T09:30:00.000Z",
    updatedAt: "2026-03-02T09:30:00.000Z",
    readingTime: 8,
    featuredImage: images.serverRack,
    featuredImageCaption: "Residency is not a slogan when a workload cannot fail over across an ocean.",
    featuredImageCredit: "Pexels / Brett Sayles",
    isFeatured: false,
    isBreaking: false,
    isEditorsPick: false,
    isTrending: false,
    keyTakeaways: [
      "Sovereignty arguments are becoming operational rather than theological.",
      "Exit plans are being requested in RFPs that never used to mention them.",
      "US hyperscalers remain dominant; they are no longer unexamined.",
    ],
    body: [
      {
        type: "p",
        text: "For years, European cloud sovereignty was a conference topic with a merchandising table. That is no longer an accurate description. Procurement teams in regulated industries are writing residency, jurisdiction and exit into the first ten pages of tenders. Demo reporting.",
      },
      {
        type: "p",
        text: "The cause is mixed: regulation, politics, and the ordinary embarrassment of discovering that a ‘European region’ still had a control plane with a different legal weather. Buyers are not becoming ideologues. They are becoming cautious.",
      },
      {
        type: "h2",
        id: "what-good-looks-like",
        text: "What ‘good’ looks like in an RFP",
      },
      {
        type: "list",
        items: [
          "Named jurisdiction for data, keys and admin access.",
          "A tested exit, not a theoretical one.",
          "Clarity on who can be compelled, by whom, and with what notice.",
        ],
      },
    ],
    sources: [
      {
        title: "Demo procurement language",
        publisher: "Signal Desk",
        note: "Not a live tender.",
      },
    ],
    corrections: [],
    status: "published",
    isDemo: true,
  },
  {
    id: "a18",
    slug: "founder-led-sales-rules",
    title: "The new rules of founder-led sales",
    dek: "Founders still have to sell. They no longer get to pretend that charisma is a go-to-market.",
    excerpt:
      "The companies that scale past the founder’s calendar are the ones that turned early calls into a repeatable system without draining them of judgement.",
    category: "startups",
    tags: ["Sales", "Founders", "Go-to-market"],
    authorId: "priya-ramanathan",
    publishedAt: "2026-03-01T14:00:00.000Z",
    updatedAt: "2026-03-01T14:00:00.000Z",
    readingTime: 6,
    featuredImage: images.collab,
    featuredImageCaption: "The call still matters. The notes from the call matter more.",
    featuredImageCredit: "Pexels / Thirdman",
    isFeatured: false,
    isBreaking: false,
    isEditorsPick: false,
    isTrending: false,
    keyTakeaways: [
      "Founder sales is a research method, not a personality cult.",
      "Write down the objections or you will hire people who cannot answer them.",
      "The handoff to a first seller is a product problem.",
    ],
    body: [
      {
        type: "p",
        text: "There is a romantic version of founder-led sales in which a magnetic person closes the first twenty customers and then, somehow, a team appears. There is also the version that actually works. This is a demo guide to the second.",
      },
      {
        type: "p",
        text: "Record the calls. Tag the objections. Notice which customers expanded without being flattered. Hire the first seller only when you can describe the motion without using your own name.",
      },
    ],
    sources: [
      {
        title: "Operator notes",
        publisher: "Signal Desk",
        note: "Educational demo.",
      },
    ],
    corrections: [],
    status: "published",
    isDemo: true,
  },
  {
    id: "a19",
    slug: "ev-charging-software-stack",
    title: "The unglamorous software stack behind electric-vehicle charging",
    dek: "The cars are the advertisement. The reliability of a charger on a wet Tuesday in Birmingham is the product.",
    excerpt:
      "Payments, roaming, grid signals and maintenance dispatch now matter more than another industrial-design award.",
    category: "technology",
    tags: ["Climate tech", "Infrastructure", "Software"],
    authorId: "james-whitfield",
    publishedAt: "2026-02-27T10:00:00.000Z",
    updatedAt: "2026-02-27T10:00:00.000Z",
    readingTime: 7,
    featuredImage: images.ev,
    featuredImageCaption: "A charger that does not authenticate, bill and report is sculpture.",
    featuredImageCredit: "Pexels / 04iraq",
    isFeatured: false,
    isBreaking: false,
    isEditorsPick: false,
    isTrending: false,
    keyTakeaways: [
      "Uptime, not stall count, is the metric that predicts consumer trust.",
      "Roaming and payments remain fragmented on both sides of the Atlantic.",
      "Grid-aware charging is moving from pilot to procurement.",
    ],
    body: [
      {
        type: "p",
        text: "Electric vehicles made climate policy visible on the driveway. Charging software will decide whether that visibility becomes a habit. Demo feature.",
      },
      {
        type: "p",
        text: "The stack is a tangle of hardware vendors, network operators, payment processors and utilities that do not share a common definition of ‘available’. Until they do, every stalled journey is a brand event for someone who does not own the charger.",
      },
    ],
    sources: [
      {
        title: "Demo infrastructure notes",
        publisher: "Signal Desk",
        note: "Illustrative.",
      },
    ],
    corrections: [],
    status: "published",
    isDemo: true,
  },
  {
    id: "a20",
    slug: "identity-security-buying-guide",
    title: "Identity security: a buying guide for people who are tired of categories",
    dek: "Ignore the category names. Ask who can become an administrator, how you would know, and how you would stop them on a Sunday.",
    excerpt:
      "The identity market is noisy because the underlying problem is simple and unsolved: too many powerful accounts, too poorly watched.",
    category: "guides",
    tags: ["Identity", "Security", "Buying"],
    authorId: "oliver-grant",
    publishedAt: "2026-02-25T09:00:00.000Z",
    updatedAt: "2026-02-25T09:00:00.000Z",
    readingTime: 8,
    featuredImage: images.cyber2,
    featuredImageCaption: "Most identity programmes fail in the inventory, not in the dashboard.",
    featuredImageCredit: "Pexels / Tima Miroshnichenko",
    isFeatured: false,
    isBreaking: false,
    isEditorsPick: false,
    isTrending: false,
    keyTakeaways: [
      "Start with an inventory of privileged paths, including vendors.",
      "Detection without a revocation path is theatre.",
      "Buy for integration with what you already run.",
    ],
    body: [
      {
        type: "p",
        text: "The identity market will sell you a new noun every year. The underlying job does not change. Know who can do damage. Shorten the time they can do it. Prove you can reverse it. Demo guide.",
      },
      {
        type: "h2",
        id: "questions",
        text: "Questions that end a bad demo",
      },
      {
        type: "list",
        items: [
          "Show me every path to domain or tenant admin, including the ones that go through a vendor.",
          "Revoke this session while we watch.",
          "What did this look like the last time it failed at 2am?",
        ],
      },
    ],
    sources: [
      {
        title: "Security desk notes",
        publisher: "Signal Desk",
        note: "Educational demo.",
      },
    ],
    corrections: [],
    status: "published",
    isDemo: true,
  },
  {
    id: "a21",
    slug: "sf-to-london-capital-rotation",
    title: "Capital is rotating from San Francisco narratives to London operations",
    dek: "Not a victory lap for Europe. A recognition that some companies are simply cheaper to take seriously.",
    excerpt:
      "Cross-border funds are quietly rebalancing towards operators who can hire in sterling and sell in dollars.",
    category: "business",
    tags: ["Venture", "London", "San Francisco"],
    authorId: "helen-cho",
    publishedAt: "2026-02-22T12:30:00.000Z",
    updatedAt: "2026-02-22T12:30:00.000Z",
    readingTime: 6,
    featuredImage: images.sf,
    featuredImageCaption: "San Francisco still mints the stories. London is winning a subset of the spreadsheets.",
    featuredImageCredit: "Pexels / Clément Proust",
    isFeatured: false,
    isBreaking: false,
    isEditorsPick: false,
    isTrending: false,
    keyTakeaways: [
      "This is a cost and governance story, not a culture-war story.",
      "Dollar revenue with sterling costs is an old trade returning in new clothes.",
      "Talent density in AI still favours the Bay Area; operations density is more even.",
    ],
    body: [
      {
        type: "p",
        text: "Every few years someone declares that European technology is about to have its moment. This is not that piece. It is a narrower observation, for this prototype: some funds are putting more operational companies in London because the arithmetic improved, not because the myth did.",
      },
    ],
    sources: [
      {
        title: "Demo capital notes",
        publisher: "Signal Desk",
        note: "Illustrative.",
      },
    ],
    corrections: [],
    status: "published",
    isDemo: true,
  },
  {
    id: "a22",
    slug: "payments-fraud-ai-arms-race",
    title: "The payments-fraud arms race is now an AI problem on both sides",
    dek: "Issuers, processors and criminals are all using models. The customer is still the one who has to call the bank.",
    excerpt:
      "False positives are becoming a consumer-protection issue. False negatives remain an existential one for smaller merchants.",
    category: "ecommerce",
    tags: ["Payments", "Fraud", "AI"],
    authorId: "helen-cho",
    publishedAt: "2026-02-20T08:00:00.000Z",
    updatedAt: "2026-02-20T08:00:00.000Z",
    readingTime: 7,
    featuredImage: images.meeting,
    featuredImageCaption: "Fraud meetings now look like model-evaluation meetings, because they are.",
    featuredImageCredit: "Pexels / Vlada Karpovich",
    isFeatured: false,
    isBreaking: false,
    isEditorsPick: false,
    isTrending: false,
    keyTakeaways: [
      "Model quality is now a customer-experience metric.",
      "Smaller merchants absorb more of the false-positive cost.",
      "Explainability is being demanded by operations teams, not just regulators.",
    ],
    body: [
      {
        type: "p",
        text: "There was a time when fraud tools were rules with a marketing site. That time ended when both attackers and defenders started using the same class of model. Demo feature.",
      },
      {
        type: "p",
        text: "The consumer version of the story is a declined card at a railway station. The merchant version is a weekend of orders that looked fine and were not. Both are now model problems.",
      },
    ],
    sources: [
      {
        title: "Payments desk notes",
        publisher: "Signal Desk",
        note: "Illustrative.",
      },
    ],
    corrections: [],
    status: "published",
    isDemo: true,
  },
];

export const publishedArticles = articles
  .filter((a) => a.status === "published")
  .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function articlesByCategory(slug: string) {
  return publishedArticles.filter((a) => a.category === slug);
}

export function articlesByAuthor(authorId: string) {
  return publishedArticles.filter((a) => a.authorId === authorId);
}

export function relatedArticles(article: Article, limit = 3) {
  return publishedArticles
    .filter((a) => a.id !== article.id && (a.category === article.category || a.tags.some((t) => article.tags.includes(t))))
    .slice(0, limit);
}

/**
 * Stories for the article sidebar. Excludes the article itself and anything
 * already shown in the "further reading" grid so the page never repeats a card.
 */
export function moreFromCategory(article: Article, exclude: Article[] = [], limit = 4) {
  const excluded = new Set([article.id, ...exclude.map((a) => a.id)]);
  const sameCategory = publishedArticles.filter(
    (a) => !excluded.has(a.id) && a.category === article.category,
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  const fillers = publishedArticles.filter(
    (a) => !excluded.has(a.id) && !sameCategory.includes(a),
  );
  return [...sameCategory, ...fillers].slice(0, limit);
}

export function searchArticles(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return publishedArticles.filter((a) => {
    const hay = [a.title, a.dek, a.excerpt, a.tags.join(" "), a.category].join(" ").toLowerCase();
    return hay.includes(q);
  });
}

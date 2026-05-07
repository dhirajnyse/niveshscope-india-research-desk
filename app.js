"use strict";

const STORAGE_KEYS = {
  uploads: "niveshscope-uploads-v1",
  notes: "niveshscope-notes-v1",
  waitlist: "niveshscope-waitlist-v1"
};

const WAITLIST_ENDPOINT = "https://formsubmit.co/ajax/dhirajnyse@gmail.com";

const SAMPLE_COMPANIES = [
  {
    ticker: "RILP",
    name: "Rudra Industries",
    sector: "Energy, retail, digital infra",
    revenue: 920000,
    growth: 10,
    grossMargin: 38.4,
    opMargin: 16.8,
    fcfMargin: 8,
    netDebt: 108000,
    shares: 676,
    multiple: 16,
    risk: 52,
    sentiment: 68,
    thesis: "Integrated cash engine with refining cyclicality, retail execution, telecom capex, and green-energy timing risk."
  },
  {
    ticker: "TCSQ",
    name: "Tara Consultancy Services",
    sector: "IT services",
    revenue: 255000,
    growth: 7,
    grossMargin: 41.2,
    opMargin: 24.6,
    fcfMargin: 21,
    netDebt: -45000,
    shares: 365,
    multiple: 24,
    risk: 34,
    sentiment: 79,
    thesis: "High cash conversion and order book visibility, offset by discretionary tech-spend and currency sensitivity."
  },
  {
    ticker: "HDFQ",
    name: "Himalaya Finance Bank",
    sector: "Private sector bank",
    revenue: 286000,
    growth: 15,
    grossMargin: 29.4,
    opMargin: 27.8,
    fcfMargin: 18,
    netDebt: 0,
    shares: 560,
    multiple: 18,
    risk: 46,
    sentiment: 71,
    thesis: "Deposit franchise and credit growth with margin pressure, unsecured-loan seasoning, and integration execution risk."
  },
  {
    ticker: "SUNM",
    name: "Surya Motors Mobility",
    sector: "Auto and EV mobility",
    revenue: 146000,
    growth: 18,
    grossMargin: 31.6,
    opMargin: 13.4,
    fcfMargin: 7,
    netDebt: 18000,
    shares: 320,
    multiple: 19,
    risk: 61,
    sentiment: 65,
    thesis: "EV and export growth with commodity swings, battery sourcing, dealer inventory, and capex-cycle risk."
  }
];

const PUBLIC_TICKER_ALIASES = {
  RELIANCE: { ticker: "RILP", note: "large Indian energy-to-consumer conglomerate proxy" },
  RIL: { ticker: "RILP", note: "large Indian energy-to-consumer conglomerate proxy" },
  TCS: { ticker: "TCSQ", note: "large Indian IT services proxy" },
  HDFCBANK: { ticker: "HDFQ", note: "large private-sector bank proxy" },
  HDFC: { ticker: "HDFQ", note: "large private-sector bank proxy" },
  TATAMOTORS: { ticker: "SUNM", note: "auto and EV mobility proxy" },
  MM: { ticker: "SUNM", note: "auto and EV mobility proxy" },
  NIFTY: { ticker: "RILP", note: "Nifty heavyweight proxy for demo routing" }
};

const RISK_FACTOR_LIBRARY = {
  RILP: [
    {
      title: "Commodity spreads and refining-cycle volatility",
      severity: "High",
      terms: ["refining", "crude", "spread", "margin", "commodity", "export duty", "cycle"],
      body:
        "A large share of cash generation still depends on refining and petrochemical spreads. Crude volatility, export duties, or weaker downstream demand can compress consolidated margins even when consumer and digital businesses keep growing."
    },
    {
      title: "Green-energy capex and execution timing",
      severity: "Medium",
      terms: ["capex", "green", "hydrogen", "battery", "solar", "execution", "commissioning"],
      body:
        "The new-energy plan could become a durable growth option, but returns depend on commissioning schedules, policy incentives, technology cost curves, and disciplined capital allocation."
    },
    {
      title: "Telecom monetisation and leverage discipline",
      severity: "Medium",
      terms: ["telecom", "arpu", "spectrum", "debt", "leverage", "tariff"],
      body:
        "Digital infrastructure returns rely on ARPU repair, spectrum economics, and monetisation of platform investments. If tariff hikes lag capex, free cash flow can stay below headline EBITDA growth."
    }
  ],
  TCSQ: [
    {
      title: "Discretionary tech-spend slowdown",
      severity: "High",
      terms: ["discretionary", "deal", "pipeline", "client", "budget", "spend", "demand"],
      body:
        "Client decision cycles can lengthen when global enterprises defer discretionary transformation work. Deal wins may remain healthy, but revenue conversion and pricing can lag until budgets reopen."
    },
    {
      title: "Talent pyramid and onsite-cost pressure",
      severity: "Medium",
      terms: ["attrition", "wage", "utilisation", "onsite", "subcontractor", "pyramid"],
      body:
        "Operating margin depends on utilisation, fresher deployment, onsite mix, and subcontractor discipline. A wage cycle or weaker pyramid can dilute the usual cash-conversion advantage."
    },
    {
      title: "Currency translation and cross-border exposure",
      severity: "Medium",
      terms: ["currency", "rupee", "dollar", "fx", "hedge", "translation"],
      body:
        "A stronger rupee, hedge roll-offs, or regional weakness can pressure reported growth. The desk should separate constant-currency demand quality from translation noise."
    }
  ],
  HDFQ: [
    {
      title: "Deposit competition and NIM compression",
      severity: "High",
      terms: ["deposit", "nim", "casa", "cost of funds", "competition", "margin"],
      body:
        "System-wide competition for deposits can raise funding costs faster than loan yields. If CASA mix weakens, credit growth may not translate into proportional earnings growth."
    },
    {
      title: "Unsecured retail and SME credit seasoning",
      severity: "High",
      terms: ["unsecured", "retail", "sme", "slippage", "npa", "credit cost"],
      body:
        "Fast growth in unsecured retail, cards, or SME credit can look clean until portfolios season. Slippages, collection efficiency, and provisioning language need closer monitoring."
    },
    {
      title: "Merger integration and technology execution",
      severity: "Medium",
      terms: ["integration", "migration", "technology", "branch", "cost", "synergy"],
      body:
        "Integration programmes can absorb management bandwidth and raise operating cost. The evidence stack should watch whether promised synergies arrive without service or credit disruption."
    }
  ],
  SUNM: [
    {
      title: "Commodity cost and battery-sourcing volatility",
      severity: "High",
      terms: ["commodity", "steel", "aluminium", "lithium", "battery", "sourcing", "margin"],
      body:
        "Vehicle margins can move quickly with steel, aluminium, lithium, and imported component costs. The risk is amplified when price hikes lag input inflation."
    },
    {
      title: "Dealer inventory and rural-demand cyclicality",
      severity: "Medium",
      terms: ["dealer", "inventory", "rural", "monsoon", "demand", "channel"],
      body:
        "Channel inventory and rural demand can make volume growth less durable than headline wholesales suggest. The desk should cross-check management tone against dealer-stock disclosures."
    },
    {
      title: "EV capex, platform timing, and subsidy risk",
      severity: "Medium",
      terms: ["ev", "capex", "platform", "subsidy", "battery", "launch", "capacity"],
      body:
        "EV programmes can create long-run optionality, but returns depend on launch cadence, battery localisation, charging partnerships, and subsidy stability."
    }
  ]
};

const SAMPLE_DOCS = [
  {
    id: "rilp-annual-2025",
    ticker: "RILP",
    company: "Rudra Industries",
    type: "Annual report",
    period: "FY2025",
    date: "2026-04-28",
    sections: [
      {
        title: "Business overview",
        text:
          "Rudra Industries operates an integrated energy, consumer retail, and digital infrastructure platform. FY2025 consolidated revenue was Rs 920000 crore, up 10% year over year. Consumer retail store count expanded 14%, digital subscribers grew 8%, and refining throughput stayed high despite weaker petrochemical spreads."
      },
      {
        title: "Management discussion and analysis",
        text:
          "Operating margin improved to 16.8% as retail scale and telecom tariff repair offset weaker petrochemical margins. Management said new-energy capex remains front-loaded and may pressure reported free cash flow until solar module, battery, and green hydrogen assets begin commercial production."
      },
      {
        title: "Risk factors",
        text:
          "The company faces volatility in crude oil, refining spreads, petrochemical demand, exchange rates, government duties, and project commissioning schedules. Telecom spectrum payments, retail working capital, and green-energy execution could affect leverage and cash conversion."
      },
      {
        title: "Liquidity and capital resources",
        text:
          "Free cash flow before growth projects was Rs 73500 crore. Net debt stood at Rs 108000 crore after spectrum payments, store expansion, and new-energy capex. Management highlighted asset monetisation and disciplined capital recycling as priorities."
      }
    ]
  },
  {
    id: "rilp-concall-q4-2025",
    ticker: "RILP",
    company: "Rudra Industries",
    type: "Concall transcript",
    period: "Q4 FY2025",
    date: "2026-04-29",
    sections: [
      {
        title: "Prepared remarks",
        text:
          "Management said consumer and digital businesses now provide a steadier earnings base than the refining cycle alone. The team expects telecom ARPU to improve through selective tariff actions and expects retail margin to benefit from private label and supply-chain density."
      },
      {
        title: "Analyst Q&A",
        text:
          "When asked about new-energy returns, the CFO said the project pipeline is staged and will be funded through internal accruals, partnerships, and possible asset-level monetisation. Management acknowledged that commissioning dates are the key swing factor for free cash flow."
      },
      {
        title: "Analyst Q&A",
        text:
          "On petrochemicals, management said spreads remain below mid-cycle levels and that inventory discipline is important. The CEO said the company will prioritise capital discipline over simply chasing volume growth."
      }
    ]
  },
  {
    id: "tcsq-annual-2025",
    ticker: "TCSQ",
    company: "Tara Consultancy Services",
    type: "Annual report",
    period: "FY2025",
    date: "2026-04-18",
    sections: [
      {
        title: "Business overview",
        text:
          "Tara Consultancy Services provides IT services, consulting, cloud migration, managed services, and AI-enabled transformation programmes for global enterprises. FY2025 revenue was Rs 255000 crore, up 7%, with an order book of Rs 345000 crore equivalent and broad participation from BFSI, manufacturing, retail, and life sciences clients."
      },
      {
        title: "Management discussion and analysis",
        text:
          "Operating margin was 24.6%, supported by utilisation, offshore mix, and lower subcontractor cost. Management said discretionary programmes remain selective in North America, but cost-takeout and cloud optimisation work continue to convert from pipeline to revenue."
      },
      {
        title: "Risk factors",
        text:
          "Revenue growth can be affected by client budget reductions, delayed transformation projects, currency movements, visa rules, wage inflation, data-protection obligations, and vendor-consolidation pressure."
      },
      {
        title: "Liquidity and capital resources",
        text:
          "Free cash flow was Rs 53500 crore and cash exceeded debt by Rs 45000 crore. The board maintained a high payout ratio while preserving capacity for tuck-in acquisitions and AI platform investment."
      }
    ]
  },
  {
    id: "tcsq-concall-q4-2025",
    ticker: "TCSQ",
    company: "Tara Consultancy Services",
    type: "Concall transcript",
    period: "Q4 FY2025",
    date: "2026-04-19",
    sections: [
      {
        title: "Prepared remarks",
        text:
          "Management said clients are prioritising efficiency, cloud optimisation, and AI pilots with visible payback. The CEO said large transformation decisions are taking longer, but renewal quality remains strong and deal closures improved sequentially."
      },
      {
        title: "Analyst Q&A",
        text:
          "The CFO said the company is not assuming a sharp discretionary recovery in the base case. Margin defence depends on utilisation, fresher deployment, automation, and the ability to reduce subcontractor intensity."
      },
      {
        title: "Analyst Q&A",
        text:
          "When asked about currency, management said hedges protect near-term margin, but a stronger rupee would still be a reported-growth headwind if constant-currency growth stays modest."
      }
    ]
  },
  {
    id: "hdfq-annual-2025",
    ticker: "HDFQ",
    company: "Himalaya Finance Bank",
    type: "Annual report",
    period: "FY2025",
    date: "2026-04-24",
    sections: [
      {
        title: "Business overview",
        text:
          "Himalaya Finance Bank is a private-sector lender with retail, SME, wholesale, payments, and wealth-management franchises. FY2025 net interest income and fee income totalled Rs 286000 crore, up 15%, while advances grew 16% and deposits grew 13%."
      },
      {
        title: "Management discussion and analysis",
        text:
          "Net interest margin compressed 22 basis points as term-deposit costs repriced faster than loan yields. Operating margin stayed resilient through fee income and branch productivity, but management noted that deposit mobilisation remains the most important execution priority."
      },
      {
        title: "Risk factors",
        text:
          "The bank faces credit-cost normalisation, unsecured retail loan seasoning, cyber risk, technology migration, liquidity coverage requirements, regulatory scrutiny, and deposit competition from mutual funds and smaller banks."
      },
      {
        title: "Liquidity and capital resources",
        text:
          "The common equity tier 1 ratio was 15.6%, gross NPA was 1.2%, and provision coverage was 74%. Management said capital is sufficient for mid-teens loan growth under the base scenario."
      }
    ]
  },
  {
    id: "hdfq-concall-q4-2025",
    ticker: "HDFQ",
    company: "Himalaya Finance Bank",
    type: "Concall transcript",
    period: "Q4 FY2025",
    date: "2026-04-25",
    sections: [
      {
        title: "Prepared remarks",
        text:
          "Management said loan growth remains broad-based, but the bank will not chase low-spread wholesale growth. The CEO said deposit quality and digital engagement matter more than near-term market-share optics."
      },
      {
        title: "Analyst Q&A",
        text:
          "The CFO said cost of funds may stay elevated for two more quarters. Management expects NIM to stabilise if deposit pricing peaks and the loan book reprices upward."
      },
      {
        title: "Analyst Q&A",
        text:
          "When asked about unsecured credit, management said early-bucket delinquencies are stable but acknowledged that the portfolio needs another two to three quarters of seasoning before loss rates are fully visible."
      }
    ]
  },
  {
    id: "sunm-annual-2025",
    ticker: "SUNM",
    company: "Surya Motors Mobility",
    type: "Annual report",
    period: "FY2025",
    date: "2026-05-02",
    sections: [
      {
        title: "Business overview",
        text:
          "Surya Motors Mobility manufactures passenger vehicles, utility vehicles, commercial vehicles, EV platforms, and connected-mobility components. FY2025 revenue was Rs 146000 crore, up 18%, with EV sales up 46% and export revenue up 19%."
      },
      {
        title: "Management discussion and analysis",
        text:
          "Operating margin improved to 13.4% as premium SUV mix and export realisations offset higher battery and electronic-component costs. Management said EV platform capex will remain elevated through FY2027."
      },
      {
        title: "Risk factors",
        text:
          "Commodity inflation, battery supply, charging infrastructure, subsidy changes, dealer inventory, rural-demand cyclicality, and foreign-exchange movements could affect volume growth and margins."
      },
      {
        title: "Liquidity and capital resources",
        text:
          "Free cash flow was Rs 10200 crore before strategic EV investments. Net debt was Rs 18000 crore. Management expects capex to peak as the next EV platform moves from tooling to launch."
      }
    ]
  },
  {
    id: "sunm-exchange-q4-2025",
    ticker: "SUNM",
    company: "Surya Motors Mobility",
    type: "Exchange announcement",
    period: "Q4 FY2025",
    date: "2026-05-03",
    sections: [
      {
        title: "Monthly volume filing",
        text:
          "The company reported domestic wholesale growth of 17% and export growth of 21%. Dealer inventory normalised to 28 days from 37 days in the previous quarter, but management noted that rural demand depends on monsoon progression and financing availability."
      },
      {
        title: "Investor update",
        text:
          "Management said the EV order book remains strong, but launch cadence will be paced with battery localisation and charging partnerships. The company expects commodity cost headwinds to moderate in the second half."
      }
    ]
  },
  {
    id: "india-model-note-cross-sector",
    ticker: "RILP",
    company: "India cross-sector model note",
    type: "Valuation model",
    period: "Base cases",
    date: "2026-05-04",
    sections: [
      {
        title: "Scenario assumptions",
        text:
          "An India-market quality screen favours companies with cash conversion, promoter alignment, low pledge risk, strong disclosure quality, and earnings resilience through rate and commodity cycles. Tara Consultancy Services has the strongest cash conversion. Himalaya Finance Bank has compounding loan growth but deposit-cost sensitivity. Rudra Industries has optionality in consumer and green energy but heavier capex. Surya Motors Mobility has the fastest growth but the highest commodity and EV execution sensitivity."
      },
      {
        title: "Committee debate",
        text:
          "For a higher-rate scenario, the model penalises stretched working capital, weak deposit growth, external financing needs, and capex programmes where returns are back-ended. The committee should flex terminal multiples only after testing FCF margin, credit cost, capex intensity, and promoter or pledge disclosures."
      }
    ]
  }
];

const QUESTION_TEMPLATES = [
  "What are the risks for $RELIANCE?",
  "Compare $TCS and $HDFCBANK on margin durability and cash conversion.",
  "Where does management sound less confident than the annual report?",
  "Is Surya Motors Mobility's EV capex a free-cash-flow risk or a growth moat?",
  "What are the three most material risks hidden behind revenue growth?",
  "Which company looks better if rates stay high and deposits stay expensive?",
  "What valuation assumptions should I flex first before buying?"
];

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "can",
  "do",
  "does",
  "for",
  "from",
  "has",
  "have",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "of",
  "on",
  "or",
  "our",
  "over",
  "than",
  "that",
  "the",
  "their",
  "this",
  "to",
  "was",
  "we",
  "what",
  "when",
  "where",
  "which",
  "with",
  "year"
]);

const INTENTS = [
  {
    id: "margin",
    label: "Margin durability",
    terms: ["margin", "gross", "operating", "nim", "pricing", "price", "durability", "yield", "mix", "cost", "spread", "arpu"]
  },
  {
    id: "growth",
    label: "Growth quality",
    terms: ["growth", "revenue", "demand", "volume", "backlog", "orders", "deposit", "loan", "subscriber", "contract", "pipeline"]
  },
  {
    id: "risk",
    label: "Risk factors",
    terms: ["risk", "risks", "factor", "factors", "pressure", "headwind", "volatile", "delay", "commodity", "regulatory", "pledge", "promoter", "npa"]
  },
  {
    id: "rates",
    label: "Rate sensitivity",
    terms: ["rate", "rates", "interest", "repo", "deposit", "debt", "financing", "discount", "refinancing", "credit", "leverage"]
  },
  {
    id: "cash",
    label: "Cash conversion",
    terms: ["cash", "fcf", "free", "capex", "capital", "liquidity", "working", "inventory", "accrual", "conversion"]
  },
  {
    id: "tone",
    label: "Management tone",
    terms: ["tone", "confidence", "call", "concall", "management", "said", "acknowledged", "expects", "guidance", "q&a"]
  },
  {
    id: "valuation",
    label: "Valuation",
    terms: ["valuation", "multiple", "model", "terminal", "discount", "value", "assumption", "equity", "pe", "ev"]
  },
  {
    id: "governance",
    label: "Governance and ownership",
    terms: ["governance", "promoter", "pledge", "shareholding", "related party", "auditor", "sebi", "board"]
  }
];

const SYNONYMS = {
  durable: ["durability", "resilient", "stable", "visibility", "backlog"],
  margin: ["gross", "operating", "pricing", "yield", "mix", "cost", "spread", "nim"],
  moat: ["pricing", "backlog", "contract", "retention", "visibility", "franchise"],
  rates: ["interest", "repo", "deposit", "debt", "financing", "discount", "refinancing"],
  cash: ["fcf", "free", "liquidity", "capex", "conversion", "accrual"],
  call: ["management", "concall", "q&a", "guidance", "expects", "said"],
  risk: ["headwind", "pressure", "delay", "volatile", "commodity", "regulatory"],
  valuation: ["multiple", "terminal", "discount", "equity", "model", "pe"],
  governance: ["promoter", "pledge", "shareholding", "auditor", "board", "sebi"]
};

const POSITIVE_TERMS = [
  "accelerated",
  "improved",
  "expanded",
  "stable",
  "strong",
  "visibility",
  "backlog",
  "retention",
  "cash",
  "net cash",
  "pricing",
  "growth",
  "contracted",
  "deposit",
  "utilisation",
  "capital discipline",
  "free cash flow"
];

const NEGATIVE_TERMS = [
  "risk",
  "pressure",
  "headwind",
  "delay",
  "volatile",
  "commodity",
  "pledge",
  "slippage",
  "npa",
  "debt",
  "negative",
  "inflation",
  "cost of funds",
  "financing",
  "regulatory",
  "working capital"
];

const state = {
  documents: [],
  activeTickers: new Set(SAMPLE_COMPANIES.map((company) => company.ticker)),
  enabledDocIds: new Set(),
  answerDepth: "brief",
  selectedTicker: "RILP",
  tickerFocus: null,
  lastFocusKey: null,
  uploadedDocs: [],
  notes: [],
  waitlistLeads: [],
  lastBrief: null,
  currentCitations: [],
  isRunning: false
};

const els = {};

document.addEventListener("DOMContentLoaded", init);

function init() {
  cacheElements();
  window.NiveshScopeRunAnalysis = submitCurrentQuestion;
  window.NiveshScopeScanDisclosure = scanFilingFromCurrentQuestion;
  state.uploadedDocs = loadJson(STORAGE_KEYS.uploads, []);
  state.notes = loadJson(STORAGE_KEYS.notes, []);
  state.waitlistLeads = loadJson(STORAGE_KEYS.waitlist, []);
  state.documents = [...SAMPLE_DOCS, ...state.uploadedDocs];
  state.documents.forEach((doc) => state.enabledDocIds.add(doc.id));
  for (const doc of state.uploadedDocs) {
    state.activeTickers.add(doc.ticker);
  }

  renderTemplates();
  renderCoverage();
  renderLibrary();
  renderContextBand();
  renderValuationOptions();
  renderNotebook();
  bindEvents();
  updateValuationFromCompany();
  updateValuation();
  renderEvidence([]);
  drawSignalMap();
}

function cacheElements() {
  els.templateStack = document.querySelector("#templateStack");
  els.questionCount = document.querySelector("#questionCount");
  els.coverageList = document.querySelector("#coverageList");
  els.selectAllTickers = document.querySelector("#selectAllTickers");
  els.libraryList = document.querySelector("#libraryList");
  els.documentCount = document.querySelector("#documentCount");
  els.fileInput = document.querySelector("#fileInput");
  els.fileDrop = document.querySelector(".file-drop");
  els.pasteForm = document.querySelector("#pasteForm");
  els.pasteTicker = document.querySelector("#pasteTicker");
  els.pasteType = document.querySelector("#pasteType");
  els.pasteTitle = document.querySelector("#pasteTitle");
  els.pasteText = document.querySelector("#pasteText");
  els.clearUploads = document.querySelector("#clearUploads");
  els.queryForm = document.querySelector("#queryForm");
  els.queryInput = document.querySelector("#queryInput");
  els.scanFilingButton = document.querySelector("#scanFilingButton");
  els.runAnalysisButton = document.querySelector("#runAnalysisButton");
  els.contextBand = document.querySelector("#contextBand");
  els.answerPanel = document.querySelector("#answerPanel");
  els.evidenceList = document.querySelector("#evidenceList");
  els.evidenceCount = document.querySelector("#evidenceCount");
  els.signalCanvas = document.querySelector("#signalCanvas");
  els.signalStamp = document.querySelector("#signalStamp");
  els.valuationTicker = document.querySelector("#valuationTicker");
  els.growthSlider = document.querySelector("#growthSlider");
  els.marginSlider = document.querySelector("#marginSlider");
  els.multipleSlider = document.querySelector("#multipleSlider");
  els.discountSlider = document.querySelector("#discountSlider");
  els.growthValue = document.querySelector("#growthValue");
  els.marginValue = document.querySelector("#marginValue");
  els.multipleValue = document.querySelector("#multipleValue");
  els.discountValue = document.querySelector("#discountValue");
  els.valuePerShare = document.querySelector("#valuePerShare");
  els.equityValue = document.querySelector("#equityValue");
  els.valuationFootnote = document.querySelector("#valuationFootnote");
  els.copyBrief = document.querySelector("#copyBrief");
  els.saveBrief = document.querySelector("#saveBrief");
  els.exportBrief = document.querySelector("#exportBrief");
  els.notebookList = document.querySelector("#notebookList");
  els.clearNotes = document.querySelector("#clearNotes");
  els.waitlistForm = document.querySelector("#waitlistForm");
  els.waitlistEmail = document.querySelector("#waitlistEmail");
  els.waitlistProfile = document.querySelector("#waitlistProfile");
  els.waitlistPlan = document.querySelector("#waitlistPlan");
  els.waitlistNeed = document.querySelector("#waitlistNeed");
  els.waitlistTickers = document.querySelector("#waitlistTickers");
  els.waitlistQuestion = document.querySelector("#waitlistQuestion");
  els.waitlistResult = document.querySelector("#waitlistResult");
}

function bindEvents() {
  els.queryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submitCurrentQuestion();
  });

  els.queryInput.addEventListener("input", () => {
    syncTickerFocus(els.queryInput.value);
  });

  els.scanFilingButton.addEventListener("click", (event) => {
    event.preventDefault();
    scanFilingFromCurrentQuestion();
  });
  els.runAnalysisButton.addEventListener("click", (event) => {
    event.preventDefault();
    submitCurrentQuestion();
  });

  document.querySelectorAll(".segment").forEach((button) => {
    button.addEventListener("click", () => {
      state.answerDepth = button.dataset.depth;
      document.querySelectorAll(".segment").forEach((candidate) => candidate.classList.toggle("is-active", candidate === button));
      if (els.queryInput.value.trim()) {
        runAnalysis(els.queryInput.value.trim());
      }
    });
  });

  els.selectAllTickers.addEventListener("click", () => {
    state.activeTickers = new Set(getCompanies().map((company) => company.ticker));
    renderCoverage();
    renderContextBand();
    drawSignalMap();
  });

  els.fileInput.addEventListener("change", async () => {
    const files = Array.from(els.fileInput.files || []);
    await processFiles(files);
    els.fileInput.value = "";
  });

  els.fileDrop.addEventListener("dragover", (event) => {
    event.preventDefault();
    els.fileDrop.classList.add("is-dragging");
  });

  els.fileDrop.addEventListener("dragleave", () => {
    els.fileDrop.classList.remove("is-dragging");
  });

  els.fileDrop.addEventListener("drop", async (event) => {
    event.preventDefault();
    els.fileDrop.classList.remove("is-dragging");
    const files = Array.from(event.dataTransfer.files || []);
    await processFiles(files);
  });

  els.pasteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = els.pasteText.value.trim();
    if (!text) {
      els.pasteText.focus();
      return;
    }
    addUploadedDocs([
      makeUploadedDoc({
        ticker: els.pasteTicker.value,
        title: els.pasteTitle.value,
        type: els.pasteType.value,
        text
      })
    ]);
    els.pasteText.value = "";
  });

  els.clearUploads.addEventListener("click", () => {
    state.uploadedDocs = [];
    state.documents = [...SAMPLE_DOCS];
    state.enabledDocIds = new Set(state.documents.map((doc) => doc.id));
    state.activeTickers = new Set(SAMPLE_COMPANIES.map((company) => company.ticker));
    saveJson(STORAGE_KEYS.uploads, []);
    renderCoverage();
    renderLibrary();
    renderContextBand();
    renderValuationOptions();
    updateValuationFromCompany();
    updateValuation();
    drawSignalMap();
  });

  els.valuationTicker.addEventListener("change", () => {
    state.selectedTicker = els.valuationTicker.value;
    updateValuationFromCompany();
    updateValuation();
    drawSignalMap();
  });

  [els.growthSlider, els.marginSlider, els.multipleSlider, els.discountSlider].forEach((slider) => {
    slider.addEventListener("input", updateValuation);
  });

  els.copyBrief.addEventListener("click", copyCurrentBrief);
  els.saveBrief.addEventListener("click", saveCurrentBrief);
  els.exportBrief.addEventListener("click", exportCurrentBrief);
  els.clearNotes.addEventListener("click", () => {
    state.notes = [];
    saveJson(STORAGE_KEYS.notes, state.notes);
    renderNotebook();
  });

  els.waitlistForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitWaitlistLead();
  });
}

function submitCurrentQuestion() {
  if (state.isRunning) return;
  const question = els.queryInput.value.trim();
  if (!question) {
    els.queryInput.focus();
    return;
  }
  state.isRunning = true;
  showRunFeedback();
  window.setTimeout(() => {
    runAnalysis(question);
    clearRunFeedback();
  }, 180);
}

function showRunFeedback() {
  if (!els.runAnalysisButton) return;
  els.runAnalysisButton.textContent = "Analyzing...";
  els.runAnalysisButton.classList.add("is-running");
  els.answerPanel.innerHTML = `
    <div class="empty-state is-analyzing">
      <div class="empty-kicker">Analyzing</div>
      <h2>Scanning retrieved India-market evidence.</h2>
      <p>Matching the question to annual reports, exchange announcements, concall tone, ticker context, and valuation read-through.</p>
    </div>
  `;
}

function clearRunFeedback() {
  state.isRunning = false;
  if (!els.runAnalysisButton) return;
  els.runAnalysisButton.textContent = "Run analysis";
  els.runAnalysisButton.classList.remove("is-running");
}

function renderTemplates() {
  els.questionCount.textContent = String(QUESTION_TEMPLATES.length);
  els.templateStack.innerHTML = QUESTION_TEMPLATES.map((question) => {
    return `<button class="template-button" type="button" data-question="${escapeAttr(question)}">${escapeHtml(question)}</button>`;
  }).join("");

  els.templateStack.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const question = button.dataset.question;
      els.queryInput.value = question;
      runAnalysis(question);
    });
  });
}

function renderCoverage() {
  const companies = getCompanies();
  els.coverageList.innerHTML = companies.map((company) => {
    const checked = state.activeTickers.has(company.ticker) ? "checked" : "";
    const riskClass = company.risk > 65 ? "negative" : company.risk > 50 ? "mixed" : "positive";
    return `
      <label class="company-row">
        <input type="checkbox" data-ticker="${escapeAttr(company.ticker)}" ${checked} />
        <span class="company-main">
          <strong>${escapeHtml(company.ticker)} - ${escapeHtml(company.name)}</strong>
          <span>${escapeHtml(company.sector)} - ${escapeHtml(company.thesis)}</span>
        </span>
        <span class="company-score ${riskClass}">${Math.round(company.sentiment)} sig</span>
      </label>
    `;
  }).join("");

  els.coverageList.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) {
        state.activeTickers.add(input.dataset.ticker);
      } else {
        state.activeTickers.delete(input.dataset.ticker);
      }
      if (!state.activeTickers.size) {
        state.activeTickers.add(input.dataset.ticker);
        input.checked = true;
      }
      renderContextBand();
      drawSignalMap();
    });
  });
}

function renderLibrary() {
  const docs = state.documents;
  els.documentCount.textContent = `${docs.length} docs`;
  els.libraryList.innerHTML = docs.map((doc) => {
    const checked = state.enabledDocIds.has(doc.id) ? "checked" : "";
    return `
      <label class="source-toggle">
        <input type="checkbox" data-doc-id="${escapeAttr(doc.id)}" ${checked} />
        <span class="source-main">
          <strong>${escapeHtml(doc.ticker)} - ${escapeHtml(doc.period)}</strong>
          <span>${escapeHtml(doc.company)} - ${escapeHtml(doc.date)}</span>
        </span>
        <span class="source-kind">${escapeHtml(shortDocType(doc.type))}</span>
      </label>
    `;
  }).join("");

  els.libraryList.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) {
        state.enabledDocIds.add(input.dataset.docId);
      } else {
        state.enabledDocIds.delete(input.dataset.docId);
      }
      renderContextBand();
    });
  });
}

function renderContextBand() {
  const enabledDocs = getEnabledDocs();
  const activeCompanies = getCompanies().filter((company) => state.activeTickers.has(company.ticker));
  const averageMargin = activeCompanies.length
    ? activeCompanies.reduce((sum, company) => sum + company.opMargin, 0) / activeCompanies.length
    : 0;
  const averageRisk = activeCompanies.length
    ? activeCompanies.reduce((sum, company) => sum + company.risk, 0) / activeCompanies.length
    : 0;
  const citationCount = state.currentCitations.length;
  const focusTile = state.tickerFocus
    ? {
        label: "Ticker focus",
        value: state.tickerFocus.rawTicker,
        sub: state.tickerFocus.isAlias ? `${state.tickerFocus.ticker} demo proxy` : state.tickerFocus.company.name
      }
    : { label: "Active companies", value: activeCompanies.length, sub: activeCompanies.map((company) => company.ticker).join(", ") || "None" };

  const tiles = [
    focusTile,
    { label: "Enabled docs", value: enabledDocs.length, sub: `${state.uploadedDocs.length} uploaded` },
    { label: "Avg op margin", value: `${averageMargin.toFixed(1)}%`, sub: "Selected coverage" },
    { label: "Risk index", value: Math.round(averageRisk), sub: citationCount ? `${citationCount} current citations` : "Pre-query baseline" }
  ];

  els.contextBand.innerHTML = tiles.map((tile) => `
    <div class="metric-tile">
      <span>${escapeHtml(tile.label)}</span>
      <strong>${escapeHtml(String(tile.value))}</strong>
      <em>${escapeHtml(tile.sub)}</em>
    </div>
  `).join("");
}

function renderValuationOptions() {
  const companies = getCompanies();
  els.valuationTicker.innerHTML = companies.map((company) => {
    const selected = company.ticker === state.selectedTicker ? "selected" : "";
    return `<option value="${escapeAttr(company.ticker)}" ${selected}>${escapeHtml(company.ticker)} - ${escapeHtml(company.name)}</option>`;
  }).join("");
}

function scanFilingFromCurrentQuestion() {
  const current = els.queryInput.value.trim();
  const focus = syncTickerFocus(current) || state.tickerFocus || {
    rawTicker: state.selectedTicker,
    ticker: state.selectedTicker,
    company: getCompany(state.selectedTicker),
    isAlias: false,
    note: ""
  };
  const tickerToken = focus.rawTicker || focus.ticker;
  const filingPrompt = current
    ? `${current} Scan annual-report risk factors, MD&A, debt schedule, shareholding pattern, and concall tone.`
    : `Scan annual-report risk factors, MD&A, debt schedule, shareholding pattern, and concall tone for $${tickerToken}.`;
  els.queryInput.value = filingPrompt;
  runAnalysis(filingPrompt);
}

function syncTickerFocus(question) {
  const focus = resolveTickerFocus(question);
  if (!focus) return null;
  const key = `${focus.rawTicker}->${focus.ticker}`;
  if (key === state.lastFocusKey) return focus;

  state.lastFocusKey = key;
  state.tickerFocus = focus;
  state.selectedTicker = focus.ticker;
  state.activeTickers.add(focus.ticker);
  renderCoverage();
  renderContextBand();
  renderValuationOptions();
  updateValuationFromCompany();
  updateValuation();
  drawSignalMap();
  return focus;
}

function resolveTickerFocus(question) {
  const text = String(question || "");
  const companies = getCompanies();
  const tickerMatch = text.match(/\$([A-Z][A-Z0-9.]{0,11})\b/i);
  const rawTicker = tickerMatch ? normalizeTicker(tickerMatch[1]) : "";
  if (rawTicker) {
    const direct = companies.find((company) => company.ticker.toUpperCase() === rawTicker);
    if (direct) {
      return { rawTicker, ticker: direct.ticker, company: direct, isAlias: false, note: "" };
    }
    const alias = PUBLIC_TICKER_ALIASES[rawTicker];
    if (alias) {
      const company = getCompany(alias.ticker);
      return { rawTicker, ticker: company.ticker, company, isAlias: true, note: alias.note };
    }
  }

  const lower = text.toLowerCase();
  const directMention = companies.find((company) => {
    return lower.includes(company.ticker.toLowerCase()) || lower.includes(company.name.toLowerCase());
  });
  if (!directMention) return null;
  return {
    rawTicker: directMention.ticker,
    ticker: directMention.ticker,
    company: directMention,
    isAlias: false,
    note: ""
  };
}

function addTickerContext(question, focus) {
  if (!focus) return question;
  const aliasText = focus.isAlias ? `${focus.rawTicker} maps to ${focus.ticker} as a static demo proxy. ${focus.note}.` : "";
  return `${question} ${focus.ticker} ${focus.company.name} ${aliasText}`;
}

function runAnalysis(question) {
  if (!question) {
    els.queryInput.focus();
    return;
  }

  const tickerFocus = syncTickerFocus(question);
  const retrievalQuestion = addTickerContext(question, tickerFocus);
  const docs = getEnabledDocs();
  if (!docs.length) {
    renderNoDocs(question);
    return;
  }

  const chunks = buildChunks(docs);
  const ranked = rankChunks(retrievalQuestion, chunks).slice(0, 8);
  if (!ranked.length) {
    renderNoHits(question);
    return;
  }

  const citations = ranked.slice(0, 6).map((chunk, index) => ({
    ...chunk,
    citationId: `C${index + 1}`
  }));
  state.currentCitations = citations;

  const intent = detectIntent(retrievalQuestion);
  const answerModel = buildAnswerModel(question, citations, intent, tickerFocus);
  state.lastBrief = answerModel.plainText;
  renderAnswer(answerModel);
  renderEvidence(citations);
  renderContextBand();
  drawSignalMap(citations);
}

function renderNoDocs(question) {
  state.currentCitations = [];
  state.lastBrief = `No enabled documents for: ${question}`;
  els.answerPanel.innerHTML = `
    <div class="empty-state">
      <div class="empty-kicker">No corpus</div>
      <h2>No enabled documents match the selected coverage.</h2>
      <p>Enable at least one source document or select another company, then run the analysis again.</p>
    </div>
  `;
  renderEvidence([]);
  renderContextBand();
}

function renderNoHits(question) {
  state.currentCitations = [];
  state.lastBrief = `No high-confidence passages for: ${question}`;
  els.answerPanel.innerHTML = `
    <div class="empty-state">
      <div class="empty-kicker">Low recall</div>
      <h2>No strong source passages were retrieved.</h2>
      <p>Try a narrower question, enable more documents, or import an annual report, concall, exchange announcement, or shareholding section with the relevant disclosure.</p>
    </div>
  `;
  renderEvidence([]);
  renderContextBand();
}

function buildAnswerModel(question, citations, intent, tickerFocus = null) {
  const compareMode = isCompareQuestion(question, citations);
  const grouped = groupCitationsByTicker(citations);
  const rankedCompanies = rankCompaniesForQuestion(question, grouped, intent);
  const confidence = computeConfidence(citations, rankedCompanies);
  const headline = makeHeadline(question, compareMode, rankedCompanies, intent);
  const thesis = makeThesis(compareMode, rankedCompanies, citations, intent);
  const toneMeter = makeToneMeter(rankedCompanies, citations);
  const focusNotice = makeTickerFocusNotice(tickerFocus);
  const evidenceBullets = citations.slice(0, state.answerDepth === "brief" ? 3 : 5).map((citation, index) => {
    return `<li>${makeEvidenceSentence(citation, intent)} ${citationLink(index)}</li>`;
  }).join("");
  const riskFactorSection = intent.id === "risk" ? makeRiskFactorSection(citations, rankedCompanies) : "";
  const watchItems = makeWatchItems(citations, rankedCompanies, intent);
  const valuationRead = makeValuationRead(rankedCompanies[0], intent);
  const debate = makeDebate(citations, rankedCompanies);
  const table = makeCompanyTable(rankedCompanies);

  const sections = [
    `
      <section class="answer-section">
        <h3>Bottom line</h3>
        <p>${thesis}</p>
      </section>
    `
  ];

  if (intent.id === "risk") {
    sections.push(riskFactorSection);
  } else {
    sections.push(`
      <section class="answer-section">
        <h3>Evidence</h3>
        <ul>${evidenceBullets}</ul>
      </section>
    `);
  }

  if (state.answerDepth !== "brief") {
    sections.push(`
      <section class="answer-section">
        <h3>Source-weighted ranking</h3>
        ${table}
      </section>
    `);
    sections.push(`
      <section class="answer-section">
        <h3>What the committee would debate</h3>
        <p>${debate}</p>
      </section>
    `);
  }

  sections.push(`
    <section class="answer-section">
      <h3>Valuation read-through</h3>
      <p>${valuationRead}</p>
    </section>
  `);

  if (state.answerDepth === "committee") {
    sections.push(`
      <section class="answer-section">
        <h3>What would change the answer</h3>
        <p>${watchItems}</p>
      </section>
    `);
  }

  const html = `
    <div class="answer-header">
      <div>
        <div class="answer-kicker">${escapeHtml(intent.label)}</div>
        <h2>${headline}</h2>
      </div>
      <div class="confidence-box">
        <span>Confidence</span>
        <strong>${confidence}%</strong>
      </div>
    </div>
    <div class="answer-body">
      ${focusNotice}
      ${toneMeter.html}
      ${sections.join("")}
    </div>
  `;

  const plainParts = [
    `${intent.label} | ${confidence}% confidence`,
    `Management tone: ${toneMeter.label} (${toneMeter.percent}/100)`,
    tickerFocus ? `Ticker focus: ${tickerFocus.rawTicker}${tickerFocus.isAlias ? ` maps to ${tickerFocus.ticker} (${tickerFocus.note})` : ""}` : "",
    stripHtml(headline),
    stripHtml(thesis),
    intent.id === "risk" ? "3 cited risk factors:" : "Evidence:"
  ].filter(Boolean);

  if (intent.id === "risk") {
    plainParts.push(makeRiskFactorPlainText(citations, rankedCompanies));
    plainParts.push("Evidence stack:");
  }

  plainParts.push(
    ...citations.slice(0, 5).map((citation, index) => `${index + 1}. ${citation.company} ${citation.type} ${citation.section}: ${snippet(citation.text, 240)}`),
    `Valuation read-through: ${stripHtml(valuationRead)}`
  );

  const plainText = plainParts.join("\n\n");

  return { html, plainText, citations, confidence, headline: stripHtml(headline) };
}

function makeToneMeter(rankedCompanies, citations) {
  const score = rankedCompanies[0]
    ? rankedCompanies[0].tone
    : citations.reduce((sum, citation) => sum + toneScore(citation.text), 0) / Math.max(citations.length, 1);
  const percent = Math.max(5, Math.min(95, Math.round(50 + score * 12)));
  const label = percent >= 62 ? "Bullish" : percent <= 38 ? "Bearish" : "Balanced";
  const cls = percent >= 62 ? "positive" : percent <= 38 ? "negative" : "mixed";
  const evidenceCount = citations.filter((citation) => /call|concall|management|q&a|prepared/i.test(`${citation.type} ${citation.section}`)).length;
  const sourceText = evidenceCount
    ? `${evidenceCount} management-commentary source${evidenceCount === 1 ? "" : "s"} pulled into the read.`
    : "Tone inferred from the retrieved annual-report, announcement, and model language.";

  return {
    label,
    percent,
    html: `
      <section class="tone-meter-card ${cls}" aria-label="Management tone meter">
        <div class="tone-meter-top">
          <span>Management tone</span>
          <strong>${escapeHtml(label)} ${percent}/100</strong>
        </div>
        <div class="tone-track" aria-hidden="true">
          <i style="left: ${percent}%"></i>
        </div>
        <div class="tone-scale">
          <span>Bearish</span>
          <span>Balanced</span>
          <span>Bullish</span>
        </div>
        <p>${escapeHtml(sourceText)}</p>
      </section>
    `
  };
}

function makeTickerFocusNotice(focus) {
  if (!focus) return "";
  const aliasText = focus.isAlias
    ? ` Static demo maps $${focus.rawTicker} to ${focus.ticker} (${focus.note}) until live market data is connected.`
    : "";
  return `
    <section class="ticker-focus-card">
      <span>Ticker focus</span>
      <strong>${escapeHtml(focus.company.ticker)} - ${escapeHtml(focus.company.name)}</strong>
      <p>${escapeHtml(focus.company.thesis || "Research context updated from the question input.")}${escapeHtml(aliasText)}</p>
    </section>
  `;
}

function renderAnswer(answerModel) {
  els.answerPanel.innerHTML = answerModel.html;
  els.answerPanel.querySelectorAll(".citation-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        document.querySelectorAll(".evidence-card").forEach((card) => card.classList.remove("is-active"));
        target.classList.add("is-active");
      }
    });
  });
}

function renderEvidence(citations) {
  els.evidenceCount.textContent = String(citations.length);
  if (!citations.length) {
    els.evidenceList.innerHTML = `<div class="empty-list">Retrieved passages will appear here with source metadata and relevance scores.</div>`;
    return;
  }
  els.evidenceList.innerHTML = citations.map((citation) => `
    <article class="evidence-card" id="evidence-${escapeAttr(citation.citationId)}">
      <div class="evidence-meta">
        <span>${escapeHtml(citation.citationId)} - ${escapeHtml(citation.ticker)}</span>
        <span>${citation.score.toFixed(1)}</span>
      </div>
      <strong>${escapeHtml(citation.type)} - ${escapeHtml(citation.period)} - ${escapeHtml(citation.section)}</strong>
      <p>${escapeHtml(snippet(citation.text, 280))}</p>
    </article>
  `).join("");
}

function buildChunks(docs) {
  const chunks = [];
  for (const doc of docs) {
    for (const section of doc.sections) {
      const parts = splitIntoChunks(section.text, 520);
      parts.forEach((text, index) => {
        const tokens = tokenize(`${doc.ticker} ${doc.company} ${doc.type} ${section.title} ${text}`);
        const tokenCounts = tokens.reduce((counts, token) => {
          counts[token] = (counts[token] || 0) + 1;
          return counts;
        }, {});
        chunks.push({
          id: `${doc.id}-${section.title}-${index}`,
          docId: doc.id,
          ticker: doc.ticker,
          company: doc.company,
          type: doc.type,
          period: doc.period,
          date: doc.date,
          section: section.title,
          text,
          tokens,
          tokenCounts
        });
      });
    }
  }
  return chunks;
}

function rankChunks(question, chunks) {
  const queryTokens = expandTokens(question);
  const intent = detectIntent(question);
  const lowerQuestion = question.toLowerCase();
  const tickersInQuestion = getCompanies()
    .filter((company) => lowerQuestion.includes(company.ticker.toLowerCase()) || lowerQuestion.includes(company.name.toLowerCase()))
    .map((company) => company.ticker);

  return chunks
    .map((chunk) => {
      let score = 0;
      for (const token of queryTokens) {
        if (chunk.tokenCounts[token]) {
          score += 2.2 + Math.log(1 + chunk.tokenCounts[token]);
        }
      }
      for (const term of intent.terms) {
        if (chunk.tokenCounts[normalizeToken(term)]) {
          score += 1.6;
        }
      }
      if (tickersInQuestion.includes(chunk.ticker)) score += 6;
      if (/call|concall|tone|management|confidence|guidance/.test(lowerQuestion) && /call|concall/i.test(chunk.type)) score += 3.5;
      if (/filing|annual|report|risk factor|mda|md&a|announcement|shareholding/.test(lowerQuestion) && /annual|filing|announcement|shareholding/i.test(chunk.type)) score += 3.5;
      if (/valuation|model|multiple|discount/.test(lowerQuestion) && /model/i.test(chunk.type)) score += 5;
      if (/risk|headwind|pressure/.test(lowerQuestion) && /risk/i.test(chunk.section)) score += 2.5;
      score += toneRelevance(question, chunk.text) * 0.55;
      return { ...chunk, score };
    })
    .filter((chunk) => chunk.score > 2)
    .sort((a, b) => b.score - a.score);
}

function expandTokens(text) {
  const base = tokenize(text);
  const expanded = new Set(base);
  for (const token of base) {
    if (SYNONYMS[token]) {
      SYNONYMS[token].forEach((item) => expanded.add(item));
    }
  }
  for (const company of getCompanies()) {
    const lower = text.toLowerCase();
    if (lower.includes(company.ticker.toLowerCase()) || lower.includes(company.name.toLowerCase())) {
      expanded.add(company.ticker.toLowerCase());
      tokenize(company.name).forEach((token) => expanded.add(token));
    }
  }
  return Array.from(expanded);
}

function tokenize(text) {
  return (text.toLowerCase().match(/[a-z0-9]+(?:\.[0-9]+)?/g) || [])
    .map(normalizeToken)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function normalizeToken(token) {
  return String(token).toLowerCase().replace(/[^a-z0-9.]/g, "");
}

function detectIntent(question) {
  const lowerQuestion = String(question || "").toLowerCase();
  if (/\b(risk|risks|risk factor|risk factors|headwind|headwinds|pressure points?)\b/.test(lowerQuestion)) {
    return INTENTS.find((intent) => intent.id === "risk");
  }
  if (/\b(rate|rates|repo|deposit|interest|financing|refinancing|discount rate|leverage)\b/.test(lowerQuestion)) {
    return INTENTS.find((intent) => intent.id === "rates");
  }
  const tokens = new Set(expandTokens(question));
  const scored = INTENTS.map((intent) => {
    const score = intent.terms.reduce((sum, term) => sum + (tokens.has(normalizeToken(term)) ? 1 : 0), 0);
    return { ...intent, score };
  }).sort((a, b) => b.score - a.score);
  return scored[0].score ? scored[0] : INTENTS[1];
}

function groupCitationsByTicker(citations) {
  return citations.reduce((groups, citation) => {
    if (!groups[citation.ticker]) groups[citation.ticker] = [];
    groups[citation.ticker].push(citation);
    return groups;
  }, {});
}

function rankCompaniesForQuestion(question, grouped, intent) {
  const companies = getCompanies().filter((company) => grouped[company.ticker]);
  return companies.map((company) => {
    const group = grouped[company.ticker] || [];
    const relevance = group.reduce((sum, citation) => sum + citation.score, 0);
    const tone = group.reduce((sum, citation) => sum + toneScore(citation.text), 0) / Math.max(group.length, 1);
    let quality = company.growth * 0.2 + company.opMargin * 0.28 + company.fcfMargin * 0.25 + company.sentiment * 0.2 - company.risk * 0.18;
    if (intent.id === "margin") quality = company.grossMargin * 0.4 + company.opMargin * 0.38 + company.fcfMargin * 0.22 - company.risk * 0.16;
    if (intent.id === "rates") quality = company.fcfMargin * 0.32 + Math.max(-company.netDebt, 0) * 2.6 - Math.max(company.netDebt, 0) * 1.8 - company.risk * 0.22;
    if (intent.id === "cash") quality = company.fcfMargin * 0.45 - Math.max(company.netDebt, 0) * 1.6 - company.risk * 0.15;
    if (intent.id === "growth") quality = company.growth * 0.55 + company.sentiment * 0.2 - company.risk * 0.12;
    if (intent.id === "risk") quality = 100 - company.risk + company.fcfMargin * 0.2 + tone * 0.3;
    const score = relevance + quality + tone;
    return {
      ...company,
      citations: group,
      relevance,
      tone,
      score
    };
  }).sort((a, b) => b.score - a.score);
}

function computeConfidence(citations, rankedCompanies) {
  const docs = new Set(citations.map((citation) => citation.docId)).size;
  const types = new Set(citations.map((citation) => citation.type)).size;
  const companies = rankedCompanies.length;
  const topScore = citations[0] ? citations[0].score : 0;
  const confidence = 34 + docs * 6 + types * 7 + companies * 5 + Math.min(topScore * 1.5, 18);
  return Math.max(42, Math.min(94, Math.round(confidence)));
}

function makeHeadline(question, compareMode, rankedCompanies, intent) {
  if (!rankedCompanies.length) return escapeHtml(question);
  const leader = rankedCompanies[0];
  if (intent.id === "risk") {
    return `${escapeHtml(leader.ticker)} has three source-backed risk factors to underwrite.`;
  }
  if (compareMode && rankedCompanies.length > 1) {
    return `${escapeHtml(leader.ticker)} screens best on ${escapeHtml(intent.label.toLowerCase())}, but the answer is source-dependent.`;
  }
  return `${escapeHtml(leader.ticker)} has a ${toneLabel(leader.tone).toLowerCase()} setup for ${escapeHtml(intent.label.toLowerCase())}.`;
}

function makeThesis(compareMode, rankedCompanies, citations, intent) {
  if (!rankedCompanies.length) {
    return "The enabled corpus does not have enough source material to support a ranked answer.";
  }
  const leader = rankedCompanies[0];
  const runnerUp = rankedCompanies[1];
  const topCitation = citations[0];
  const leaderMetrics = `${leader.growth}% revenue growth, ${leader.opMargin}% operating margin, and ${leader.fcfMargin}% FCF margin`;
  if (intent.id === "risk") {
    return `The retrieved source stack points to underwritable risks, not a single fatal flaw. ${escapeHtml(leader.ticker)} still shows ${escapeHtml(leaderMetrics)}, but the risk work should focus on disclosures tied to demand cadence, promoter alignment, cash conversion, financing, and execution timing. The highest-weighted passage is from ${escapeHtml(topCitation.company)} ${escapeHtml(topCitation.type)}. ${citationLink(0)}`;
  }
  if (compareMode && runnerUp) {
    return `${escapeHtml(leader.ticker)} leads because the retrieved sources combine stronger fundamentals (${escapeHtml(leaderMetrics)}) with more direct support on ${escapeHtml(intent.label.toLowerCase())}. ${escapeHtml(runnerUp.ticker)} has a credible counter-case, but its source stack carries more visible pressure points. The highest-weighted passage is from ${escapeHtml(topCitation.company)} ${escapeHtml(topCitation.type)}, which anchors the answer rather than relying on a broad sector narrative. ${citationLink(0)}`;
  }
  return `The source stack is ${toneLabel(leader.tone).toLowerCase()} rather than cleanly bullish. ${escapeHtml(leader.ticker)} shows ${escapeHtml(leaderMetrics)}, but the same documents also surface risks that should be tested in the valuation model. The best anchor is ${escapeHtml(topCitation.type)} coverage of ${escapeHtml(topCitation.section.toLowerCase())}. ${citationLink(0)}`;
}

function makeRiskFactorSection(citations, rankedCompanies) {
  const factors = buildRiskFactors(citations, rankedCompanies[0]);
  const items = factors.map((factor) => `
    <li>
      <div class="risk-factor-top">
        <span class="risk-severity ${escapeAttr(factor.severityClass)}">${escapeHtml(factor.severity)}</span>
        <strong>${escapeHtml(factor.title)}</strong>
      </div>
      <p>${escapeHtml(factor.body)} ${citationLink(factor.citationIndex)}</p>
    </li>
  `).join("");

  return `
    <section class="answer-section risk-factor-section">
      <h3>3 cited risk factors</h3>
      <ol class="risk-factor-list">${items}</ol>
    </section>
  `;
}

function makeRiskFactorPlainText(citations, rankedCompanies) {
  return buildRiskFactors(citations, rankedCompanies[0]).map((factor, index) => {
    const citation = citations[factor.citationIndex];
    const citationText = citation ? ` [${citation.citationId} ${citation.type} - ${citation.section}]` : "";
    return `${index + 1}. ${factor.title} (${factor.severity}): ${factor.body}${citationText}`;
  }).join("\n");
}

function buildRiskFactors(citations, company) {
  const fallbackCompany = company || getCompanies()[0];
  const blueprint = RISK_FACTOR_LIBRARY[fallbackCompany.ticker] || makeGenericRiskBlueprint(fallbackCompany);
  const factors = blueprint.slice(0, 3).map((factor, index) => {
    const citationIndex = findRiskCitationIndex(citations, factor.terms, index);
    return {
      ...factor,
      citationIndex,
      severityClass: factor.severity.toLowerCase()
    };
  });

  while (factors.length < 3) {
    const index = factors.length;
    factors.push({
      title: "Source coverage gap",
      severity: "Medium",
      severityClass: "medium",
      terms: [],
      body: "Import more annual reports, exchange announcements, shareholding patterns, or concall transcripts to pressure-test this risk with a broader evidence base.",
      citationIndex: Math.min(index, Math.max(citations.length - 1, 0))
    });
  }

  return factors;
}

function makeGenericRiskBlueprint(company) {
  return [
    {
      title: "Demand and revenue durability",
      severity: "High",
      terms: ["demand", "revenue", "customer", "growth"],
      body: `${company.ticker} should be tested for demand volatility, promoter alignment, regulatory pressure, and the durability of its revenue growth.`
    },
    {
      title: "Margin and cash conversion",
      severity: "Medium",
      terms: ["margin", "cash", "working capital", "inventory", "capex"],
      body: `${company.ticker} risk work should connect margin pressure to working capital, capex, credit cost, and free cash flow conversion.`
    },
    {
      title: "Balance sheet and execution timing",
      severity: "Medium",
      terms: ["debt", "financing", "delay", "execution", "rates"],
      body: `${company.ticker} needs a timing, leverage, and disclosure-quality check so execution delays do not hide in the base valuation case.`
    }
  ];
}

function findRiskCitationIndex(citations, terms, fallbackIndex) {
  if (!citations.length) return 0;
  const lowerTerms = terms.map((term) => term.toLowerCase());
  const scored = citations.map((citation, index) => {
    const haystack = `${citation.type} ${citation.section} ${citation.text}`.toLowerCase();
    const score = lowerTerms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0)
      + (/risk|liquidity|q&a|management discussion/i.test(`${citation.section} ${citation.type}`) ? 0.5 : 0);
    return { index, score };
  }).sort((a, b) => b.score - a.score || a.index - b.index);
  if (scored[0].score > 0) return scored[0].index;
  return Math.min(fallbackIndex, citations.length - 1);
}

function makeEvidenceSentence(citation, intent) {
  const metrics = extractMetrics(citation.text);
  const metricPhrase = metrics.length ? ` Key extracted figures: ${escapeHtml(metrics.slice(0, 4).join(", "))}.` : "";
  return `${escapeHtml(citation.company)} ${escapeHtml(citation.type)} links ${escapeHtml(intent.label.toLowerCase())} to ${escapeHtml(snippet(citation.text, 170))}.${metricPhrase}`;
}

function makeWatchItems(citations, rankedCompanies, intent) {
  const negative = citations
    .map((citation) => ({ citation, score: negativeTermCount(citation.text) }))
    .sort((a, b) => b.score - a.score)
    .filter((item) => item.score > 0)
    .slice(0, 2);
  const leader = rankedCompanies[0];
  const items = negative.length
    ? negative.map((item, index) => `${escapeHtml(snippet(item.citation.text, 155))} ${citationLink(citations.indexOf(item.citation))}`)
    : [`Watch whether the next disclosure confirms the ${escapeHtml(intent.label.toLowerCase())} indicators that drove this retrieval result.`];
  if (leader) {
    items.push(`For ${escapeHtml(leader.ticker)}, the model answer would weaken if revenue growth decelerates without a matching improvement in FCF margin.`);
  }
  return items.join(" ");
}

function makeValuationRead(company, intent) {
  if (!company) return "Run the valuation lens against the company with the strongest retrieved evidence.";
  const onePointFcf = terminalFcfSensitivity(company, 1);
  const rateText = intent.id === "rates"
    ? "Because the question centers on rates, discount rate and net debt deserve the first sensitivity pass."
    : "Flex FCF margin before terminal multiple so the valuation stays tied to operating evidence.";
  return `${escapeHtml(company.ticker)} should be modeled from the evidence, not from a static multiple. At current base revenue of ${formatMoney(company.revenue)} and ${company.fcfMargin}% FCF margin, a one-point terminal FCF margin swing is worth roughly ${formatMoney(onePointFcf)} of annual terminal FCF before discounting. ${rateText}`;
}

function makeDebate(citations, rankedCompanies) {
  const callEvidence = citations.find((citation) => /call|concall/i.test(citation.type));
  const filingEvidence = citations.find((citation) => /annual|filing|announcement|shareholding/i.test(citation.type));
  const leader = rankedCompanies[0];
  const debateParts = [];
  if (filingEvidence) {
    debateParts.push(`The disclosure is the discipline check: ${escapeHtml(snippet(filingEvidence.text, 170))} ${citationLink(citations.indexOf(filingEvidence))}`);
  }
  if (callEvidence) {
    debateParts.push(`The concall tests tone: ${escapeHtml(snippet(callEvidence.text, 170))} ${citationLink(citations.indexOf(callEvidence))}`);
  }
  if (leader) {
    debateParts.push(`The committee question is whether ${escapeHtml(leader.ticker)}'s evidence quality deserves a higher multiple or simply lowers downside risk.`);
  }
  return debateParts.join(" ");
}

function makeCompanyTable(rankedCompanies) {
  if (!rankedCompanies.length) return `<p>No company ranking was available.</p>`;
  const rows = rankedCompanies.map((company, index) => {
    const tone = toneClass(company.tone);
    return `
      <tr>
        <td>${index + 1}</td>
        <td><strong>${escapeHtml(company.ticker)}</strong><br>${escapeHtml(company.name)}</td>
        <td>${company.growth}%</td>
        <td>${company.opMargin}%</td>
        <td>${company.fcfMargin}%</td>
        <td><span class="tone-chip ${tone}">${escapeHtml(toneLabel(company.tone))}</span></td>
      </tr>
    `;
  }).join("");
  return `
    <table class="rank-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Company</th>
          <th>Growth</th>
          <th>Op margin</th>
          <th>FCF</th>
          <th>Tone</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function citationLink(index) {
  const citation = state.currentCitations[index];
  if (!citation) return "";
  return `<a class="citation-link" href="#evidence-${escapeAttr(citation.citationId)}">${escapeHtml(citation.citationId)}</a>`;
}

function isCompareQuestion(question, citations) {
  const lower = question.toLowerCase();
  const tickers = new Set(citations.map((citation) => citation.ticker));
  return tickers.size > 1 || /compare|versus| vs |which|better|best|rank/i.test(lower);
}

function getEnabledDocs() {
  return state.documents.filter((doc) => state.enabledDocIds.has(doc.id) && state.activeTickers.has(doc.ticker));
}

function getCompanies() {
  const byTicker = new Map(SAMPLE_COMPANIES.map((company) => [company.ticker, { ...company }]));
  for (const doc of state.uploadedDocs) {
    if (!byTicker.has(doc.ticker)) {
      byTicker.set(doc.ticker, {
        ticker: doc.ticker,
        name: doc.company || `${doc.ticker} imported corpus`,
        sector: "Imported sources",
        revenue: estimateRevenue(doc),
        growth: 8,
        grossMargin: 38,
        opMargin: 14,
        fcfMargin: 8,
        netDebt: 0,
        shares: 10,
        multiple: 12,
        risk: 55,
        sentiment: 52,
        thesis: "User-imported source set awaiting normalized fundamentals."
      });
    }
  }
  return Array.from(byTicker.values());
}

function getCompany(ticker) {
  return getCompanies().find((company) => company.ticker === ticker) || getCompanies()[0];
}

function updateValuationFromCompany() {
  const company = getCompany(state.selectedTicker);
  if (!company) return;
  els.growthSlider.value = String(Math.round(company.growth));
  els.marginSlider.value = String(Math.round(company.fcfMargin));
  els.multipleSlider.value = String(Math.round(company.multiple));
}

function updateValuation() {
  const company = getCompany(state.selectedTicker);
  if (!company) return;
  const revenueGrowth = Number(els.growthSlider.value) / 100;
  const fcfMargin = Number(els.marginSlider.value) / 100;
  const terminalMultiple = Number(els.multipleSlider.value);
  const discountRate = Number(els.discountSlider.value) / 100;
  const years = 5;
  let presentValueFcf = 0;
  let revenue = company.revenue;
  for (let year = 1; year <= years; year += 1) {
    revenue *= 1 + revenueGrowth;
    const fcf = revenue * fcfMargin;
    presentValueFcf += fcf / Math.pow(1 + discountRate, year);
  }
  const terminalRevenue = revenue;
  const terminalFcf = terminalRevenue * fcfMargin;
  const terminalValue = terminalFcf * terminalMultiple;
  const discountedTerminal = terminalValue / Math.pow(1 + discountRate, years);
  const enterpriseValue = presentValueFcf + discountedTerminal;
  const equityValue = enterpriseValue - company.netDebt;
  const perShare = equityValue / Math.max(company.shares, 0.01);

  els.growthValue.textContent = `${Math.round(revenueGrowth * 100)}%`;
  els.marginValue.textContent = `${Math.round(fcfMargin * 100)}%`;
  els.multipleValue.textContent = `${terminalMultiple}x`;
  els.discountValue.textContent = `${Math.round(discountRate * 100)}%`;
  els.valuePerShare.textContent = `Rs ${Math.max(perShare, 0).toFixed(0)}`;
  els.equityValue.textContent = `${formatMoney(Math.max(equityValue, 0))}`;
  els.valuationFootnote.textContent = `${company.ticker} base model: ${formatMoney(company.revenue)} revenue, ${company.fcfMargin}% FCF margin, ${company.netDebt < 0 ? "net cash" : "net debt"} of ${formatMoney(Math.abs(company.netDebt))}. This is a scenario lens, not a price target.`;
}

function drawSignalMap(citations = state.currentCitations) {
  const canvas = els.signalCanvas;
  const context = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#0f1716";
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "rgba(255,255,255,0.07)";
  context.lineWidth = 1;
  for (let x = 0; x < width; x += 40) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }
  for (let y = 0; y < height; y += 40) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }

  const companies = getCompanies().filter((company) => state.activeTickers.has(company.ticker)).slice(0, 6);
  const activeCitationTickers = new Set(citations.map((citation) => citation.ticker));
  const rowHeight = Math.floor((height - 56) / Math.max(companies.length, 1));
  context.font = "700 15px Inter, system-ui, sans-serif";
  context.textBaseline = "middle";

  companies.forEach((company, index) => {
    const y = 36 + index * rowHeight;
    context.fillStyle = activeCitationTickers.has(company.ticker) || company.ticker === state.selectedTicker ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.045)";
    context.fillRect(14, y - 16, width - 28, rowHeight - 8);
    context.fillStyle = "#f7fbfa";
    context.fillText(company.ticker, 28, y + 2);
    drawBar(context, 116, y - 9, 150, 12, company.growth, 35, "#3fa05a");
    drawBar(context, 284, y - 9, 150, 12, company.opMargin, 40, "#5c8ed8");
    drawBar(context, 452, y - 9, 130, 12, company.risk, 100, "#dc5d55");
    context.fillStyle = "rgba(255,255,255,0.66)";
    context.font = "700 11px Inter, system-ui, sans-serif";
    context.fillText(`${company.growth}%`, 116, y + 18);
    context.fillText(`${company.opMargin}%`, 284, y + 18);
    context.fillText(`${company.risk} risk`, 452, y + 18);
    context.font = "700 15px Inter, system-ui, sans-serif";
  });

  context.fillStyle = "rgba(255,255,255,0.68)";
  context.font = "700 12px Inter, system-ui, sans-serif";
  context.fillText("Growth", 116, 18);
  context.fillText("Margin", 284, 18);
  context.fillText("Risk", 452, 18);
  els.signalStamp.textContent = citations.length ? `${citations.length} hits` : "Baseline";
}

function drawBar(context, x, y, width, height, value, max, color) {
  context.fillStyle = "rgba(255,255,255,0.13)";
  context.fillRect(x, y, width, height);
  context.fillStyle = color;
  context.fillRect(x, y, Math.max(4, Math.min(width, (value / max) * width)), height);
}

function renderNotebook() {
  if (!state.notes.length) {
    els.notebookList.innerHTML = `<div class="empty-list">Saved answers stay in this browser for quick review.</div>`;
    return;
  }
  els.notebookList.innerHTML = state.notes.map((note) => `
    <article class="note-card">
      <span><b>${escapeHtml(note.intent)}</b><b>${escapeHtml(note.date)}</b></span>
      <strong>${escapeHtml(note.title)}</strong>
      <p>${escapeHtml(snippet(note.body, 220))}</p>
    </article>
  `).join("");
}

function copyCurrentBrief() {
  if (!state.lastBrief) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(state.lastBrief).catch(() => fallbackCopy(state.lastBrief));
  } else {
    fallbackCopy(state.lastBrief);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function saveCurrentBrief() {
  if (!state.lastBrief) return;
  const title = state.lastBrief.split("\n").find(Boolean) || "Saved research brief";
  const note = {
    id: `note-${Date.now()}`,
    title: stripHtml(title).slice(0, 120),
    body: state.lastBrief,
    intent: state.currentCitations[0] ? state.currentCitations[0].ticker : "Desk",
    date: new Date().toLocaleDateString()
  };
  state.notes = [note, ...state.notes].slice(0, 10);
  saveJson(STORAGE_KEYS.notes, state.notes);
  renderNotebook();
}

function exportCurrentBrief() {
  if (!state.lastBrief) return;
  const ticker = state.currentCitations[0] ? state.currentCitations[0].ticker : state.selectedTicker;
  const date = new Date().toISOString().slice(0, 10);
  const filename = `niveshscope-${String(ticker || "desk").toLowerCase()}-brief-${date}.md`;
  const evidence = state.currentCitations.length
    ? state.currentCitations.map((citation) => {
        return `### ${citation.citationId} - ${citation.company} ${citation.type} (${citation.period})\n\n${citation.section}: ${citation.text}`;
      }).join("\n\n")
    : "No evidence stack available. Run an analysis first.";
  const content = [
    "# NiveshScope Research Brief",
    "",
    state.lastBrief,
    "",
    "## Evidence Stack",
    "",
    evidence,
    "",
    "_Synthetic demo corpus for product prototyping. Import source documents before using the workflow for live investment research._"
  ].join("\n");

  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
  flashButtonLabel(els.exportBrief, "Exported");
}

function flashButtonLabel(button, label) {
  if (!button) return;
  const original = button.textContent;
  button.textContent = label;
  window.setTimeout(() => {
    button.textContent = original;
  }, 1200);
}

async function submitWaitlistLead() {
  const email = els.waitlistEmail.value.trim();
  if (!email) {
    els.waitlistEmail.focus();
    return;
  }
  const lead = {
    id: `lead-${Date.now()}`,
    email,
    profile: els.waitlistProfile.value,
    plan: els.waitlistPlan.value,
    need: els.waitlistNeed.value,
    tickers: els.waitlistTickers.value.trim(),
    question: els.waitlistQuestion.value.trim(),
    date: new Date().toISOString()
  };
  state.waitlistLeads = [lead, ...state.waitlistLeads].slice(0, 50);
  saveJson(STORAGE_KEYS.waitlist, state.waitlistLeads);

  const summary = [
    "NiveshScope waitlist lead",
    `Email: ${lead.email}`,
    `Profile: ${lead.profile}`,
    `Plan: ${lead.plan}`,
    `Need: ${lead.need}`,
    `Tickers: ${lead.tickers || "Not provided"}`,
    `Question: ${lead.question || "Not provided"}`,
    `Date: ${new Date(lead.date).toLocaleString()}`
  ].join("\n");

  els.waitlistResult.classList.remove("is-success");
  els.waitlistResult.textContent = "Joining the pilot list...";

  try {
    const payload = {
      name: "NiveshScope waitlist",
      email: lead.email,
      _replyto: lead.email,
      profile: lead.profile,
      plan: lead.plan,
      need: lead.need,
      tickers: lead.tickers || "Not provided",
      question: lead.question || "Not provided",
      source: window.location.href,
      _subject: "New NiveshScope waitlist lead",
      _template: "table",
      _captcha: "false"
    };
    const response = await fetch(WAITLIST_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error(`Waitlist endpoint returned ${response.status}`);
    }
    els.waitlistResult.classList.add("is-success");
    els.waitlistResult.textContent = "You are on the NiveshScope pilot list. Check your inbox if this is the first activation email.";
    els.waitlistEmail.value = "";
    els.waitlistTickers.value = "";
    els.waitlistQuestion.value = "";
  } catch (error) {
    copyLeadSummary(summary);
    els.waitlistResult.textContent = `Saved locally and copied for follow-up. If this is the first live submission, confirm the FormSubmit activation email and submit once more.`;
  }
}

function copyLeadSummary(summary) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(summary).catch(() => fallbackCopy(summary));
  } else {
    fallbackCopy(summary);
  }
}

async function processFiles(files) {
  const usableFiles = files.filter((file) => /\.(txt|md|csv|html|json)$/i.test(file.name));
  if (!usableFiles.length) return;
  const docs = await Promise.all(usableFiles.map(readUploadedFile));
  addUploadedDocs(docs);
}

function readUploadedFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(makeUploadedDoc({
        ticker: inferTickerFromName(file.name) || "CUSTOM",
        title: file.name.replace(/\.[^.]+$/, ""),
        type: inferTypeFromName(file.name),
        text: String(reader.result || "")
      }));
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function makeUploadedDoc({ ticker, title, type, text }) {
  const safeTicker = normalizeTicker(ticker);
  const cleanTitle = String(title || "Imported document").trim().slice(0, 90);
  const cleanText = String(text || "").replace(/\s+/g, " ").trim();
  return {
    id: `upload-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    ticker: safeTicker,
    company: `${safeTicker} imported corpus`,
    type: String(type || "Research note"),
    period: cleanTitle,
    date: new Date().toISOString().slice(0, 10),
    sections: splitImportedText(cleanText)
  };
}

function addUploadedDocs(docs) {
  const filtered = docs.filter((doc) => doc.sections.some((section) => section.text.length > 30));
  if (!filtered.length) return;
  state.uploadedDocs = [...filtered, ...state.uploadedDocs].slice(0, 18);
  state.documents = [...SAMPLE_DOCS, ...state.uploadedDocs];
  filtered.forEach((doc) => {
    state.enabledDocIds.add(doc.id);
    state.activeTickers.add(doc.ticker);
  });
  saveJson(STORAGE_KEYS.uploads, state.uploadedDocs);
  renderCoverage();
  renderLibrary();
  renderContextBand();
  renderValuationOptions();
  drawSignalMap();
}

function splitImportedText(text) {
  if (!text) return [];
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  const sections = [];
  let buffer = [];
  let index = 1;
  for (const sentence of sentences) {
    buffer.push(sentence.trim());
    if (buffer.join(" ").length > 850) {
      sections.push({ title: `Imported section ${index}`, text: buffer.join(" ") });
      buffer = [];
      index += 1;
    }
  }
  if (buffer.length) sections.push({ title: `Imported section ${index}`, text: buffer.join(" ") });
  return sections;
}

function splitIntoChunks(text, targetLength) {
  if (text.length <= targetLength) return [text];
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  const chunks = [];
  let buffer = "";
  for (const sentence of sentences) {
    if ((buffer + " " + sentence).trim().length > targetLength && buffer) {
      chunks.push(buffer.trim());
      buffer = sentence;
    } else {
      buffer = `${buffer} ${sentence}`.trim();
    }
  }
  if (buffer) chunks.push(buffer.trim());
  return chunks;
}

function inferTickerFromName(name) {
  const match = String(name).toUpperCase().match(/\b[A-Z]{2,10}\b/);
  return match ? match[0] : "";
}

function inferTypeFromName(name) {
  const lower = String(name).toLowerCase();
  if (lower.includes("annual") || lower.includes("ar-") || lower.includes("10-k") || lower.includes("10k")) return "Annual report";
  if (lower.includes("quarter") || lower.includes("results") || lower.includes("10-q") || lower.includes("10q")) return "Quarterly results";
  if (lower.includes("concall") || lower.includes("call") || lower.includes("transcript")) return "Concall transcript";
  if (lower.includes("shareholding") || lower.includes("pledge") || lower.includes("promoter")) return "Shareholding pattern";
  if (lower.includes("exchange") || lower.includes("announcement")) return "Exchange announcement";
  if (lower.includes("model")) return "Valuation model";
  return "Research note";
}

function normalizeTicker(value) {
  const ticker = String(value || "CUSTOM").toUpperCase().replace(/[^A-Z0-9.]/g, "").slice(0, 12);
  return ticker || "CUSTOM";
}

function estimateRevenue(doc) {
  const text = doc.sections.map((section) => section.text).join(" ");
  const croreMatch = text.match(/rs\.?\s*([\d,.]+)\s*(lakh\s*crore|crore|cr)\b/i);
  if (croreMatch) {
    const amount = Number(croreMatch[1].replace(/,/g, ""));
    return /lakh/i.test(croreMatch[2]) ? amount * 100000 : amount;
  }
  const billionMatch = text.match(/\$?(\d+(?:\.\d+)?)\s*(billion|bn|b)\b/i);
  return billionMatch ? Number(billionMatch[1]) * 8300 : 20000;
}

function extractMetrics(text) {
  const matches = text.match(/(?:rs\.?\s*)?\d[\d,.]*(?:\.\d+)?\s?(?:lakh crore|crore|cr|billion|million|bn|m|x|%|bps|basis points)|\d+(?:\.\d+)?\s?basis points/gi) || [];
  return Array.from(new Set(matches.map((item) => item.replace(/\s+/g, " ").trim()))).slice(0, 8);
}

function toneScore(text) {
  const lower = text.toLowerCase();
  const positive = POSITIVE_TERMS.reduce((sum, term) => sum + (lower.includes(term) ? 1 : 0), 0);
  const negative = NEGATIVE_TERMS.reduce((sum, term) => sum + (lower.includes(term) ? 1 : 0), 0);
  return positive - negative;
}

function toneRelevance(question, text) {
  const lowerQuestion = question.toLowerCase();
  const score = toneScore(text);
  if (/risk|pressure|headwind|weaken|negative|concern/.test(lowerQuestion)) return Math.max(-score, score * 0.3);
  if (/confidence|tone|management/.test(lowerQuestion)) return Math.abs(score);
  return score;
}

function negativeTermCount(text) {
  const lower = text.toLowerCase();
  return NEGATIVE_TERMS.reduce((sum, term) => sum + (lower.includes(term) ? 1 : 0), 0);
}

function toneClass(score) {
  if (score >= 1.1) return "positive";
  if (score <= -1.1) return "negative";
  return "mixed";
}

function toneLabel(score) {
  const cls = toneClass(score);
  if (cls === "positive") return "Positive";
  if (cls === "negative") return "Cautious";
  return "Mixed";
}

function shortDocType(type) {
  if (/annual|10-k/i.test(type)) return "AR";
  if (/quarter|10-q/i.test(type)) return "QR";
  if (/concall|call/i.test(type)) return "Call";
  if (/exchange|announcement/i.test(type)) return "NSE/BSE";
  if (/shareholding|pledge/i.test(type)) return "SHP";
  if (/model/i.test(type)) return "Model";
  return "Note";
}

function terminalFcfSensitivity(company, marginPoints) {
  const revenue = company.revenue * Math.pow(1 + company.growth / 100, 5);
  return revenue * (marginPoints / 100);
}

function formatMoney(value) {
  const absolute = Math.abs(Number(value) || 0);
  return `Rs ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(absolute)} cr`;
}

function snippet(text, maxLength) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trim()}...`;
}

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

function loadJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function saveJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Local storage can be blocked under some browser privacy settings.
  }
}

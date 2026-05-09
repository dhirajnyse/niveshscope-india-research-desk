"use strict";

const STORAGE_KEYS = {
  uploads: "niveshscope-uploads-v1",
  notes: "niveshscope-notes-v1",
  waitlist: "niveshscope-waitlist-v1",
  valuationCases: "niveshscope-valuation-cases-v1",
  sourcePack: "niveshscope-source-pack-v1",
  sourceProgress: "niveshscope-source-progress-v1",
  evidenceVault: "niveshscope-evidence-vault-v1",
  memoReviews: "niveshscope-memo-reviews-v1",
  decisionJournal: "niveshscope-decision-journal-v1",
  deskTasks: "niveshscope-desk-tasks-v1"
};

const WAITLIST_ENDPOINT = "https://formsubmit.co/ajax/dhirajnyse@gmail.com";
const DATA_VERSION = "20260509-22";
const RELEASE_LABEL = "v47 Source Review Gate";
const RELEASE_PACKAGE_NAME = "niveshscope-github-pages-v47-source-review-gate.zip";
const RELEASE_ROOT_MANIFEST = [
  { path: "index.html", kind: "file", role: "App entrypoint" },
  { path: "app.js", kind: "file", role: "Application logic" },
  { path: "styles.css", kind: "file", role: "Main interface styles" },
  { path: "launch.css", kind: "file", role: "Launch-page styles" },
  { path: "assets/", kind: "folder", role: "Logo, favicon, social artwork" },
  { path: "data/", kind: "folder", role: "Companies, documents, questions, watchlists" },
  { path: "docs/", kind: "folder", role: "Product, security, and release documentation" },
  { path: "scripts/", kind: "folder", role: "Static verification checks" },
  { path: ".github/workflows/static-checks.yml", kind: "file", role: "GitHub Actions smoke check" },
  { path: ".nojekyll", kind: "file", role: "GitHub Pages static-asset guard" },
  { path: "README.md", kind: "file", role: "Release notes and operating guide" },
  { path: "SECURITY.md", kind: "file", role: "Security baseline" },
  { path: "site.webmanifest", kind: "file", role: "Install metadata" },
  { path: "robots.txt", kind: "file", role: "Crawler policy" }
];
const MAX_IMPORT_FILE_BYTES = 2 * 1024 * 1024;
const MAX_IMPORT_TOTAL_BYTES = 8 * 1024 * 1024;
const MAX_SOURCE_TEXT_CHARS = 120000;
const MAX_SOURCE_URL_LENGTH = 2048;
const STARTER_PACK_TICKERS = ["RELIANCE", "TCS", "HDFCBANK"];
const TRUSTED_SOURCE_DOMAINS = [
  "rilofficial.com",
  "tcs.com",
  "hdfc.bank.in",
  "infosys.com",
  "icicibank.com",
  "sbi.co.in",
  "tatamotors.com",
  "larsentoubro.com",
  "bajajfinserv.in",
  "adanienterprises.com",
  "nseindia.com",
  "bseindia.com",
  "sebi.gov.in",
  "screener.in",
  "google.com"
];
const DATA_FILES = {
  companies: "data/companies.json",
  documents: "data/documents.json",
  questions: "data/questions.json",
  watchlists: "data/watchlists.json"
};

const REAL_SOURCE_REQUIREMENTS = [
  {
    key: "annual-report",
    label: "Annual report",
    type: "Annual report",
    pattern: /annual|ar\b/i,
    instruction: "Collect business overview, MD&A, risk factors, liquidity, capex, debt, and management outlook from the latest annual report."
  },
  {
    key: "concall",
    label: "Concall",
    type: "Concall transcript",
    pattern: /concall|transcript|call/i,
    instruction: "Collect prepared remarks plus analyst Q&A where management discusses demand, margins, capital allocation, and near-term risks."
  },
  {
    key: "results",
    label: "Results",
    type: "Quarterly results",
    pattern: /quarter|results/i,
    instruction: "Collect revenue, margin, segment performance, balance-sheet movement, and management commentary from the latest results pack."
  },
  {
    key: "shareholding",
    label: "Shareholding",
    type: "Shareholding pattern",
    pattern: /shareholding|pledge|promoter/i,
    instruction: "Collect promoter holding, pledge movement, institutional ownership, and material shareholding changes."
  },
  {
    key: "announcement",
    label: "Announcement",
    type: "Exchange announcement",
    pattern: /exchange|announcement|nse|bse/i,
    instruction: "Collect the exact exchange announcement text for material orders, capex, transactions, ratings, regulatory actions, or governance events."
  }
];

const MARKET_SOURCE_LINKS = {
  "annual-report": [
    { label: "NSE annual reports", url: "https://www.nseindia.com/companies-listing/corporate-filings-annual-reports" },
    { label: "SEBI filing map", url: "https://www.sebi.gov.in/curation/corporate_filings.html" }
  ],
  concall: [
    { label: "NSE announcements", url: "https://www.nseindia.com/companies-listing/corporate-filings-announcements" },
    { label: "BSE announcements", url: "https://www.bseindia.com/corporates/ann.html" }
  ],
  results: [
    { label: "NSE financial results", url: "https://www.nseindia.com/companies-listing/corporate-filings-financial-results" },
    { label: "BSE financial results", url: "https://www.bseindia.com/corporates/Comp_Resultsnew.aspx" }
  ],
  shareholding: [
    { label: "NSE shareholding", url: "https://www.nseindia.com/companies-listing/corporate-filings-shareholding-pattern" },
    { label: "BSE shareholding", url: "https://www.bseindia.com/corporates/Sharehold_Searchnew.aspx" }
  ],
  announcement: [
    { label: "NSE announcements", url: "https://www.nseindia.com/companies-listing/corporate-filings-announcements" },
    { label: "BSE announcements", url: "https://www.bseindia.com/corporates/ann.html" }
  ]
};

const COMPANY_IR_LINKS = {
  RELIANCE: "https://www.rilofficial.com/investors/investor-relations.html",
  TCS: "https://www.tcs.com/investor-relations",
  HDFCBANK: "https://www.hdfc.bank.in/about-us/investor-relations",
  INFY: "https://www.infosys.com/investors/reports-filings.html",
  ICICIBANK: "https://www.icicibank.com/about-us/investor-relations",
  SBIN: "https://sbi.co.in/web/investor-relations",
  TATAMOTORS: "https://www.tatamotors.com/investors/",
  LT: "https://www.larsentoubro.com/corporate/investors/",
  BAJFINANCE: "https://www.bajajfinserv.in/corporate-bajaj-finance/investor-relations",
  ADANIENT: "https://www.adanienterprises.com/investors"
};

const SOURCE_PROGRESS_STAGES = [
  { id: "queued", label: "Queued" },
  { id: "collected", label: "Collected" },
  { id: "pasted", label: "Pasted" },
  { id: "verified", label: "Verified" }
];

const DESK_TASK_STATUS_FLOW = ["queued", "in-progress", "done"];

let SAMPLE_COMPANIES = [];
let PUBLIC_TICKER_ALIASES = {};
let RISK_FACTOR_LIBRARY = {};
let SAMPLE_DOCS = [];
let QUESTION_TEMPLATES = [];
let WATCHLIST_CONFIG = { defaultWatchlist: "starter-india-largecap", watchlists: [], aliases: {} };

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
  activeTickers: new Set(),
  enabledDocIds: new Set(),
  answerDepth: "brief",
  selectedTicker: "",
  tickerFocus: null,
  lastFocusKey: null,
  uploadedDocs: [],
  sourcePackDocs: [],
  sourceProgress: {},
  evidenceVault: [],
  notes: [],
  memoReviews: [],
  decisionJournal: [],
  deskTasks: [],
  waitlistLeads: [],
  valuationCases: [],
  importReport: null,
  lastBrief: null,
  lastAnswerMeta: null,
  activeSourceTask: null,
  currentCitations: [],
  onlySelectedTicker: true,
  reviewRadarFilter: "all",
  portfolioWatchtowerFilter: "all",
  portfolioWatchtowerSort: "priority",
  catalystCalendarFilter: "all",
  catalystCalendarHorizon: "30",
  dailyBriefingMode: "morning",
  deskTaskFilter: "open",
  sprintMode: "focus",
  sprintCapacity: "5",
  icMemoMode: "committee",
  claimTraceMode: "answer",
  answerQualityMode: "release",
  isRunning: false
};

const SOURCE_CITATION_KEYWORDS = {
  "annual-report": ["business", "risk", "margin", "capital", "liquidity", "debt", "cash flow", "capex", "outlook", "management"],
  concall: ["management", "demand", "margin", "capital allocation", "analyst", "question", "guidance", "near-term", "prepared remarks"],
  results: ["revenue", "profit", "margin", "segment", "quarter", "growth", "ebitda", "cash", "balance sheet", "management commentary"],
  shareholding: ["promoter", "pledge", "shareholding", "institutional", "public", "fii", "dii", "mutual fund", "holding"],
  announcement: ["announcement", "order", "transaction", "approval", "capex", "rating", "regulatory", "governance", "material"],
  default: ["revenue", "margin", "risk", "cash", "management", "capital", "growth", "debt", "outlook"]
};

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  init().catch((error) => {
    console.error(error);
    showDataLoadError(error);
  });
});

async function init() {
  cacheElements();
  await loadDeskData();
  window.NiveshScopeRunAnalysis = submitCurrentQuestion;
  window.NiveshScopeScanDisclosure = scanFilingFromCurrentQuestion;
  state.uploadedDocs = loadJson(STORAGE_KEYS.uploads, []);
  state.sourcePackDocs = loadJson(STORAGE_KEYS.sourcePack, []).map((doc) => normalizeDocumentRecord(doc, "real"));
  state.sourceProgress = normalizeSourceProgress(loadJson(STORAGE_KEYS.sourceProgress, {}));
  state.evidenceVault = loadJson(STORAGE_KEYS.evidenceVault, []).map(normalizeEvidenceVaultItem).filter(Boolean);
  state.notes = loadJson(STORAGE_KEYS.notes, []);
  state.memoReviews = loadJson(STORAGE_KEYS.memoReviews, []).map(normalizeMemoReview);
  state.decisionJournal = loadJson(STORAGE_KEYS.decisionJournal, []).map(normalizeDecisionEntry);
  state.deskTasks = loadJson(STORAGE_KEYS.deskTasks, []).map(normalizeDeskTask);
  state.waitlistLeads = loadJson(STORAGE_KEYS.waitlist, []);
  state.valuationCases = loadJson(STORAGE_KEYS.valuationCases, []);
  state.activeTickers = new Set(getDefaultWatchlistTickers());
  state.selectedTicker = state.activeTickers.values().next().value || SAMPLE_COMPANIES[0]?.ticker || "";
  state.documents = [...SAMPLE_DOCS, ...state.sourcePackDocs, ...state.uploadedDocs];
  state.documents.forEach((doc) => state.enabledDocIds.add(doc.id));
  for (const doc of state.sourcePackDocs) {
    state.activeTickers.add(doc.ticker);
  }
  for (const doc of state.uploadedDocs) {
    state.activeTickers.add(doc.ticker);
  }

  renderImportTickerOptions();
  renderSourceBuilderTickerOptions();
  renderSourceBuilderSections();
  renderSourceAssistantLinks();
  renderSourceCitationExtractor();
  renderSourceReviewGate();
  renderGuidedSourceCollector();
  renderSourcePackList();
  renderSourceMatrixOptions();
  renderSourceMatrix();
  renderRealSourceStarterPack();
  renderSourceQueueOptions();
  renderSourceQueue();
  renderSourceHubOptions();
  renderSourceHub();
  renderSourceWorkspace();
  renderTemplates();
  renderCoverage();
  renderLibrary();
  renderImportSummary();
  renderContextBand();
  renderValuationOptions();
  renderCompanyDossier();
  renderValuationCases();
  renderNotebook();
  renderEvidenceVault();
  renderBriefWorkbench();
  renderInvestmentGate();
  renderMemoReviewRoom();
  renderDecisionJournal();
  renderReviewRadar();
  renderPortfolioWatchtower();
  renderCatalystCalendar();
  renderDailyBriefing();
  renderDeskTaskBoard();
  renderResearchSprintPlanner();
  renderIcMemoBuilder();
  renderClaimTraceInspector();
  renderAnswerQualityLab();
  renderTrustCenter();
  renderLaunchControlRoom();
  bindEvents();
  updateValuationFromCompany();
  updateValuation();
  renderEvidence([]);
  drawSignalMap();
}

async function loadDeskData() {
  const [companies, documents, questions, watchlists] = await Promise.all([
    fetchJson(DATA_FILES.companies),
    fetchJson(DATA_FILES.documents),
    fetchJson(DATA_FILES.questions),
    fetchJson(DATA_FILES.watchlists)
  ]);

  SAMPLE_COMPANIES = companies.map(normalizeCompanyRecord);
  SAMPLE_DOCS = documents.map((doc) => normalizeDocumentRecord(doc, "synthetic"));
  QUESTION_TEMPLATES = questions;
  WATCHLIST_CONFIG = watchlists;
  PUBLIC_TICKER_ALIASES = watchlists.aliases || {};
  RISK_FACTOR_LIBRARY = Object.fromEntries(SAMPLE_COMPANIES.map((company) => [company.ticker, company.riskFactors || []]));
}

async function fetchJson(path) {
  const response = await fetch(`${path}?v=${DATA_VERSION}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Could not load ${path} (${response.status})`);
  }
  return response.json();
}

function showDataLoadError(error) {
  cacheElements();
  const message = window.location.protocol === "file:"
    ? "NiveshScope v5 loads its data from JSON files. Open it through GitHub Pages or a local web server so the browser can fetch the data folder."
    : "NiveshScope could not load its data files. Confirm the data folder was uploaded at the repository root.";
  if (els.answerPanel) {
    els.answerPanel.innerHTML = `
      <div class="empty-state">
        <div class="empty-kicker">Data unavailable</div>
        <h2>Source pack files did not load.</h2>
        <p>${escapeHtml(message)} ${escapeHtml(error.message || "")}</p>
      </div>
    `;
  }
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
  els.importSummary = document.querySelector("#importSummary");
  els.pasteForm = document.querySelector("#pasteForm");
  els.importTickerSelect = document.querySelector("#importTickerSelect");
  els.pasteTicker = document.querySelector("#pasteTicker");
  els.pasteType = document.querySelector("#pasteType");
  els.pasteTitle = document.querySelector("#pasteTitle");
  els.pasteText = document.querySelector("#pasteText");
  els.clearUploads = document.querySelector("#clearUploads");
  els.queryForm = document.querySelector("#queryForm");
  els.queryInput = document.querySelector("#queryInput");
  els.memoShortcuts = document.querySelector(".memo-shortcuts");
  els.scanFilingButton = document.querySelector("#scanFilingButton");
  els.runAnalysisButton = document.querySelector("#runAnalysisButton");
  els.onlySelectedTicker = document.querySelector("#onlySelectedTicker");
  els.contextBand = document.querySelector("#contextBand");
  els.answerPanel = document.querySelector("#answerPanel");
  els.briefWorkbench = document.querySelector("#brief-workbench");
  els.briefWorkbenchStatus = document.querySelector("#briefWorkbenchStatus");
  els.briefWorkbenchSummary = document.querySelector("#briefWorkbenchSummary");
  els.briefReadinessGrid = document.querySelector("#briefReadinessGrid");
  els.briefSourceMap = document.querySelector("#briefSourceMap");
  els.copyBriefPacket = document.querySelector("#copyBriefPacket");
  els.exportBriefPacketJson = document.querySelector("#exportBriefPacketJson");
  els.openBriefNextGap = document.querySelector("#openBriefNextGap");
  els.briefWorkbenchResult = document.querySelector("#briefWorkbenchResult");
  els.investmentGateStatus = document.querySelector("#investmentGateStatus");
  els.investmentGateSummary = document.querySelector("#investmentGateSummary");
  els.investmentGateChecks = document.querySelector("#investmentGateChecks");
  els.runInvestmentGate = document.querySelector("#runInvestmentGate");
  els.openInvestmentGateGap = document.querySelector("#openInvestmentGateGap");
  els.copyInvestmentGateNote = document.querySelector("#copyInvestmentGateNote");
  els.investmentGateResult = document.querySelector("#investmentGateResult");
  els.memoReviewForm = document.querySelector("#memoReviewForm");
  els.memoReviewContext = document.querySelector("#memoReviewContext");
  els.memoReviewDecision = document.querySelector("#memoReviewDecision");
  els.memoReviewConviction = document.querySelector("#memoReviewConviction");
  els.memoReviewOwner = document.querySelector("#memoReviewOwner");
  els.memoReviewNote = document.querySelector("#memoReviewNote");
  els.memoReviewRisk = document.querySelector("#memoReviewRisk");
  els.saveMemoReview = document.querySelector("#saveMemoReview");
  els.exportMemoReviews = document.querySelector("#exportMemoReviews");
  els.copyMemoReviews = document.querySelector("#copyMemoReviews");
  els.clearMemoReviews = document.querySelector("#clearMemoReviews");
  els.memoReviewResult = document.querySelector("#memoReviewResult");
  els.memoReviewList = document.querySelector("#memoReviewList");
  els.memoReviewCount = document.querySelector("#memoReviewCount");
  els.decisionJournalForm = document.querySelector("#decisionJournalForm");
  els.decisionJournalContext = document.querySelector("#decisionJournalContext");
  els.decisionJournalDecision = document.querySelector("#decisionJournalDecision");
  els.decisionJournalStrength = document.querySelector("#decisionJournalStrength");
  els.decisionJournalHorizon = document.querySelector("#decisionJournalHorizon");
  els.decisionJournalDate = document.querySelector("#decisionJournalDate");
  els.decisionJournalOwner = document.querySelector("#decisionJournalOwner");
  els.decisionJournalNote = document.querySelector("#decisionJournalNote");
  els.decisionJournalTrigger = document.querySelector("#decisionJournalTrigger");
  els.decisionJournalEvidenceTask = document.querySelector("#decisionJournalEvidenceTask");
  els.saveDecisionJournalEntry = document.querySelector("#saveDecisionJournalEntry");
  els.exportDecisionJournal = document.querySelector("#exportDecisionJournal");
  els.copyDecisionJournal = document.querySelector("#copyDecisionJournal");
  els.clearDecisionJournal = document.querySelector("#clearDecisionJournal");
  els.decisionJournalResult = document.querySelector("#decisionJournalResult");
  els.decisionJournalList = document.querySelector("#decisionJournalList");
  els.decisionJournalCount = document.querySelector("#decisionJournalCount");
  els.reviewRadarStatus = document.querySelector("#reviewRadarStatus");
  els.reviewRadarSummary = document.querySelector("#reviewRadarSummary");
  els.reviewRadarFilter = document.querySelector("#reviewRadarFilter");
  els.openNextReview = document.querySelector("#openNextReview");
  els.copyReviewRadar = document.querySelector("#copyReviewRadar");
  els.exportReviewRadar = document.querySelector("#exportReviewRadar");
  els.reviewRadarList = document.querySelector("#reviewRadarList");
  els.reviewRadarResult = document.querySelector("#reviewRadarResult");
  els.portfolioWatchtowerStatus = document.querySelector("#portfolioWatchtowerStatus");
  els.portfolioWatchtowerSummary = document.querySelector("#portfolioWatchtowerSummary");
  els.portfolioWatchtowerFilter = document.querySelector("#portfolioWatchtowerFilter");
  els.portfolioWatchtowerSort = document.querySelector("#portfolioWatchtowerSort");
  els.openPortfolioAction = document.querySelector("#openPortfolioAction");
  els.copyPortfolioWatchtower = document.querySelector("#copyPortfolioWatchtower");
  els.exportPortfolioWatchtower = document.querySelector("#exportPortfolioWatchtower");
  els.portfolioWatchtowerList = document.querySelector("#portfolioWatchtowerList");
  els.portfolioWatchtowerResult = document.querySelector("#portfolioWatchtowerResult");
  els.catalystCalendarStatus = document.querySelector("#catalystCalendarStatus");
  els.catalystCalendarSummary = document.querySelector("#catalystCalendarSummary");
  els.catalystCalendarFilter = document.querySelector("#catalystCalendarFilter");
  els.catalystCalendarHorizon = document.querySelector("#catalystCalendarHorizon");
  els.openCatalystAction = document.querySelector("#openCatalystAction");
  els.copyCatalystCalendar = document.querySelector("#copyCatalystCalendar");
  els.exportCatalystCalendar = document.querySelector("#exportCatalystCalendar");
  els.catalystCalendarList = document.querySelector("#catalystCalendarList");
  els.catalystCalendarResult = document.querySelector("#catalystCalendarResult");
  els.dailyBriefingStatus = document.querySelector("#dailyBriefingStatus");
  els.dailyBriefingSummary = document.querySelector("#dailyBriefingSummary");
  els.dailyBriefingMode = document.querySelector("#dailyBriefingMode");
  els.openDailyBriefingAction = document.querySelector("#openDailyBriefingAction");
  els.captureDailyBriefingTask = document.querySelector("#captureDailyBriefingTask");
  els.copyDailyBriefing = document.querySelector("#copyDailyBriefing");
  els.exportDailyBriefing = document.querySelector("#exportDailyBriefing");
  els.dailyBriefingList = document.querySelector("#dailyBriefingList");
  els.dailyBriefingResult = document.querySelector("#dailyBriefingResult");
  els.deskTaskBoardStatus = document.querySelector("#deskTaskBoardStatus");
  els.deskTaskSummary = document.querySelector("#deskTaskSummary");
  els.deskTaskFilter = document.querySelector("#deskTaskFilter");
  els.captureFirstTask = document.querySelector("#captureFirstTask");
  els.copyDeskTasks = document.querySelector("#copyDeskTasks");
  els.exportDeskTasks = document.querySelector("#exportDeskTasks");
  els.clearCompletedTasks = document.querySelector("#clearCompletedTasks");
  els.deskTaskList = document.querySelector("#deskTaskList");
  els.deskTaskResult = document.querySelector("#deskTaskResult");
  els.researchSprintStatus = document.querySelector("#researchSprintStatus");
  els.researchSprintSummary = document.querySelector("#researchSprintSummary");
  els.researchSprintMode = document.querySelector("#researchSprintMode");
  els.researchSprintCapacity = document.querySelector("#researchSprintCapacity");
  els.startResearchSprint = document.querySelector("#startResearchSprint");
  els.captureSprintTasks = document.querySelector("#captureSprintTasks");
  els.copyResearchSprint = document.querySelector("#copyResearchSprint");
  els.exportResearchSprint = document.querySelector("#exportResearchSprint");
  els.researchSprintList = document.querySelector("#researchSprintList");
  els.researchSprintResult = document.querySelector("#researchSprintResult");
  els.icMemoStatus = document.querySelector("#icMemoStatus");
  els.icMemoSummary = document.querySelector("#icMemoSummary");
  els.icMemoMode = document.querySelector("#icMemoMode");
  els.openIcMemoBlocker = document.querySelector("#openIcMemoBlocker");
  els.copyIcMemo = document.querySelector("#copyIcMemo");
  els.exportIcMemoPdf = document.querySelector("#exportIcMemoPdf");
  els.exportIcMemoJson = document.querySelector("#exportIcMemoJson");
  els.icMemoSections = document.querySelector("#icMemoSections");
  els.icMemoResult = document.querySelector("#icMemoResult");
  els.claimTraceStatus = document.querySelector("#claimTraceStatus");
  els.claimTraceSummary = document.querySelector("#claimTraceSummary");
  els.claimTraceMode = document.querySelector("#claimTraceMode");
  els.openWeakClaim = document.querySelector("#openWeakClaim");
  els.copyClaimTrace = document.querySelector("#copyClaimTrace");
  els.exportClaimTrace = document.querySelector("#exportClaimTrace");
  els.claimTraceList = document.querySelector("#claimTraceList");
  els.claimTraceResult = document.querySelector("#claimTraceResult");
  els.answerQualityStatus = document.querySelector("#answerQualityStatus");
  els.answerQualitySummary = document.querySelector("#answerQualitySummary");
  els.answerQualityMode = document.querySelector("#answerQualityMode");
  els.openQualityFix = document.querySelector("#openQualityFix");
  els.copyQualityReport = document.querySelector("#copyQualityReport");
  els.exportQualityReport = document.querySelector("#exportQualityReport");
  els.answerQualityGrid = document.querySelector("#answerQualityGrid");
  els.answerQualityTests = document.querySelector("#answerQualityTests");
  els.answerQualityResult = document.querySelector("#answerQualityResult");
  els.trustCenterStatus = document.querySelector("#trustCenterStatus");
  els.trustCenterSummary = document.querySelector("#trustCenterSummary");
  els.trustCenterGrid = document.querySelector("#trustCenterGrid");
  els.trustCenterChecks = document.querySelector("#trustCenterChecks");
  els.openTrustAction = document.querySelector("#openTrustAction");
  els.copyTrustReport = document.querySelector("#copyTrustReport");
  els.exportTrustReport = document.querySelector("#exportTrustReport");
  els.trustCenterResult = document.querySelector("#trustCenterResult");
  els.evidenceVaultStatus = document.querySelector("#evidenceVaultStatus");
  els.evidenceVaultSummary = document.querySelector("#evidenceVaultSummary");
  els.evidenceVaultList = document.querySelector("#evidenceVaultList");
  els.saveCurrentEvidence = document.querySelector("#saveCurrentEvidence");
  els.copyEvidenceVault = document.querySelector("#copyEvidenceVault");
  els.exportEvidenceVault = document.querySelector("#exportEvidenceVault");
  els.clearEvidenceVault = document.querySelector("#clearEvidenceVault");
  els.evidenceVaultResult = document.querySelector("#evidenceVaultResult");
  els.operatorCoachStatus = document.querySelector("#operatorCoachStatus");
  els.operatorCoachSummary = document.querySelector("#operatorCoachSummary");
  els.operatorCoachQueue = document.querySelector("#operatorCoachQueue");
  els.operatorCoachDo = document.querySelector("#operatorCoachDo");
  els.copyOperatorPlan = document.querySelector("#copyOperatorPlan");
  els.exportOperatorPlan = document.querySelector("#exportOperatorPlan");
  els.operatorCoachResult = document.querySelector("#operatorCoachResult");
  els.launchControlStatus = document.querySelector("#launchControlStatus");
  els.launchControlSummary = document.querySelector("#launchControlSummary");
  els.launchControlStats = document.querySelector("#launchControlStats");
  els.launchBlockerCount = document.querySelector("#launchBlockerCount");
  els.launchBlockerList = document.querySelector("#launchBlockerList");
  els.launchCompanyList = document.querySelector("#launchCompanyList");
  els.launchTestPlan = document.querySelector("#launchTestPlan");
  els.releaseDoctorStatus = document.querySelector("#releaseDoctorStatus");
  els.releaseDoctorSummary = document.querySelector("#releaseDoctorSummary");
  els.releaseDoctorFiles = document.querySelector("#releaseDoctorFiles");
  els.copyReleaseManifest = document.querySelector("#copyReleaseManifest");
  els.exportReleaseManifest = document.querySelector("#exportReleaseManifest");
  els.openLaunchBlocker = document.querySelector("#openLaunchBlocker");
  els.exportLaunchAudit = document.querySelector("#exportLaunchAudit");
  els.copyLaunchChecklist = document.querySelector("#copyLaunchChecklist");
  els.launchControlResult = document.querySelector("#launchControlResult");
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
  els.saveValuationCase = document.querySelector("#saveValuationCase");
  els.valuationCaseList = document.querySelector("#valuationCaseList");
  els.companyDossier = document.querySelector("#companyDossier");
  els.copyBrief = document.querySelector("#copyBrief");
  els.saveBrief = document.querySelector("#saveBrief");
  els.exportBrief = document.querySelector("#exportBrief");
  els.exportPdfBrief = document.querySelector("#exportPdfBrief");
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
  els.sourcePackForm = document.querySelector("#sourcePackForm");
  els.sourceBuilderTicker = document.querySelector("#sourceBuilderTicker");
  els.sourceBuilderType = document.querySelector("#sourceBuilderType");
  els.sourceBuilderStatus = document.querySelector("#sourceBuilderStatus");
  els.sourceBuilderPeriod = document.querySelector("#sourceBuilderPeriod");
  els.sourceBuilderDate = document.querySelector("#sourceBuilderDate");
  els.sourceBuilderUrl = document.querySelector("#sourceBuilderUrl");
  els.sourceBuilderTitleInput = document.querySelector("#sourceBuilderTitleInput");
  els.sourceBuilderSections = document.querySelector("#sourceBuilderSections");
  els.activeSourceTask = document.querySelector("#activeSourceTask");
  els.sourceAssistantText = document.querySelector("#sourceAssistantText");
  els.applySourceAssistant = document.querySelector("#applySourceAssistant");
  els.loadSampleFiling = document.querySelector("#loadSampleFiling");
  els.runSourceIntakeDoctor = document.querySelector("#runSourceIntakeDoctor");
  els.copySourceCitationNote = document.querySelector("#copySourceCitationNote");
  els.clearSourceAssistant = document.querySelector("#clearSourceAssistant");
  els.filingCapturePreview = document.querySelector("#filingCapturePreview");
  els.sourceIntakeDoctor = document.querySelector("#source-intake-doctor");
  els.sourceCitationStatus = document.querySelector("#sourceCitationStatus");
  els.sourceCitationSummary = document.querySelector("#sourceCitationSummary");
  els.sourceCitationList = document.querySelector("#sourceCitationList");
  els.refreshSourceCitations = document.querySelector("#refreshSourceCitations");
  els.applySourceCitations = document.querySelector("#applySourceCitations");
  els.copySourceCitations = document.querySelector("#copySourceCitations");
  els.exportSourceCitations = document.querySelector("#exportSourceCitations");
  els.sourceCitationResult = document.querySelector("#sourceCitationResult");
  els.sourceReviewStatus = document.querySelector("#sourceReviewStatus");
  els.sourceReviewSummary = document.querySelector("#sourceReviewSummary");
  els.sourceReviewChecks = document.querySelector("#sourceReviewChecks");
  els.runSourceReviewGate = document.querySelector("#runSourceReviewGate");
  els.openSourceReviewFix = document.querySelector("#openSourceReviewFix");
  els.copySourceReviewSheet = document.querySelector("#copySourceReviewSheet");
  els.exportSourceReviewSheet = document.querySelector("#exportSourceReviewSheet");
  els.sourceReviewResult = document.querySelector("#sourceReviewResult");
  els.sourceAssistantLinks = document.querySelector("#sourceAssistantLinks");
  els.sourceAssistantResult = document.querySelector("#sourceAssistantResult");
  els.guidedSourceStatus = document.querySelector("#guidedSourceStatus");
  els.guidedSourceSummary = document.querySelector("#guidedSourceSummary");
  els.guidedSourceTask = document.querySelector("#guidedSourceTask");
  els.guidedSourceChecklist = document.querySelector("#guidedSourceChecklist");
  els.loadGuidedSourceTask = document.querySelector("#loadGuidedSourceTask");
  els.openGuidedSourceLinks = document.querySelector("#openGuidedSourceLinks");
  els.copyGuidedSourceBrief = document.querySelector("#copyGuidedSourceBrief");
  els.exportGuidedSourceBrief = document.querySelector("#exportGuidedSourceBrief");
  els.guidedSourceResult = document.querySelector("#guidedSourceResult");
  els.sourceConfidenceChecklist = document.querySelector("#sourceConfidenceChecklist");
  els.sourceBuilderResult = document.querySelector("#sourceBuilderResult");
  els.exportSourcePack = document.querySelector("#exportSourcePack");
  els.exportMergedDocuments = document.querySelector("#exportMergedDocuments");
  els.returnToDossier = document.querySelector("#returnToDossier");
  els.sourcePackJsonInput = document.querySelector("#sourcePackJsonInput");
  els.clearSourcePack = document.querySelector("#clearSourcePack");
  els.sourcePackList = document.querySelector("#sourcePackList");
  els.sourcePackCount = document.querySelector("#sourcePackCount");
  els.exportReadiness = document.querySelector("#exportReadiness");
  els.matrixTickerFilter = document.querySelector("#matrixTickerFilter");
  els.matrixStatusFilter = document.querySelector("#matrixStatusFilter");
  els.matrixNextGap = document.querySelector("#matrixNextGap");
  els.copyCoverageMatrix = document.querySelector("#copyCoverageMatrix");
  els.downloadCoverageMatrix = document.querySelector("#downloadCoverageMatrix");
  els.sourceMatrixSummary = document.querySelector("#sourceMatrixSummary");
  els.sourceMatrix = document.querySelector("#sourceMatrix");
  els.sourceMatrixResult = document.querySelector("#sourceMatrixResult");
  els.sourceMatrixExport = document.querySelector("#sourceMatrixExport");
  els.realStarterSummary = document.querySelector("#realStarterSummary");
  els.realStarterGrid = document.querySelector("#realStarterGrid");
  els.realStarterResult = document.querySelector("#realStarterResult");
  els.queueTickerFilter = document.querySelector("#queueTickerFilter");
  els.queueStatusFilter = document.querySelector("#queueStatusFilter");
  els.generateSourceTasks = document.querySelector("#generateSourceTasks");
  els.exportChecklistCsv = document.querySelector("#exportChecklistCsv");
  els.copyChecklistCsv = document.querySelector("#copyChecklistCsv");
  els.sourceQueueSummary = document.querySelector("#sourceQueueSummary");
  els.sourceQueueList = document.querySelector("#sourceQueueList");
  els.sourceQueueResult = document.querySelector("#sourceQueueResult");
  els.hubTickerSelect = document.querySelector("#hubTickerSelect");
  els.hubRequirementSelect = document.querySelector("#hubRequirementSelect");
  els.sourceHubTask = document.querySelector("#sourceHubTask");
  els.sourceLinkPanel = document.querySelector("#sourceLinkPanel");
  els.loadHubTask = document.querySelector("#loadHubTask");
  els.copyHubTask = document.querySelector("#copyHubTask");
  els.exportAssistantTasks = document.querySelector("#exportAssistantTasks");
  els.sourceHubResult = document.querySelector("#sourceHubResult");
  els.workspaceFilter = document.querySelector("#workspaceFilter");
  els.workspaceBatchSize = document.querySelector("#workspaceBatchSize");
  els.buildWorkspaceBatch = document.querySelector("#buildWorkspaceBatch");
  els.exportWorkspaceProgress = document.querySelector("#exportWorkspaceProgress");
  els.exportWorkspacePack = document.querySelector("#exportWorkspacePack");
  els.sourceWorkspaceSummary = document.querySelector("#sourceWorkspaceSummary");
  els.sourceWorkspaceList = document.querySelector("#sourceWorkspaceList");
  els.sourceWorkspaceResult = document.querySelector("#sourceWorkspaceResult");
}

function normalizeCompanyRecord(company) {
  return {
    ...company,
    ticker: normalizeTicker(company.ticker),
    riskFactors: Array.isArray(company.riskFactors) ? company.riskFactors : []
  };
}

function normalizeDocumentRecord(doc, fallbackStatus = "synthetic") {
  return {
    ...doc,
    ticker: normalizeTicker(doc.ticker),
    sourceStatus: normalizeSourceStatus(doc.sourceStatus || fallbackStatus),
    sourceLabel: doc.sourceLabel || defaultSourceLabel(doc.sourceStatus || fallbackStatus),
    sourceUrl: doc.sourceUrl || "",
    sections: Array.isArray(doc.sections) ? doc.sections : []
  };
}

function getDefaultWatchlistTickers() {
  const defaultWatchlist = (WATCHLIST_CONFIG.watchlists || []).find((watchlist) => watchlist.id === WATCHLIST_CONFIG.defaultWatchlist)
    || (WATCHLIST_CONFIG.watchlists || [])[0];
  const tickers = defaultWatchlist ? defaultWatchlist.tickers : SAMPLE_COMPANIES.map((company) => company.ticker);
  return tickers.filter((ticker) => SAMPLE_COMPANIES.some((company) => company.ticker === ticker));
}

function bindEvents() {
  els.queryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submitCurrentQuestion();
  });

  els.queryInput.addEventListener("input", () => {
    syncTickerFocus(els.queryInput.value);
  });

  els.memoShortcuts.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const prompt = makeMemoPrompt(button.dataset.memo);
      els.queryInput.value = prompt;
      runAnalysis(prompt);
    });
  });

  els.scanFilingButton.addEventListener("click", (event) => {
    event.preventDefault();
    scanFilingFromCurrentQuestion();
  });
  els.runAnalysisButton.addEventListener("click", (event) => {
    event.preventDefault();
    submitCurrentQuestion();
  });

  if (els.onlySelectedTicker) {
    els.onlySelectedTicker.addEventListener("change", () => {
      state.onlySelectedTicker = els.onlySelectedTicker.checked;
      if (els.queryInput.value.trim() && state.currentCitations.length) {
        runAnalysis(els.queryInput.value.trim());
      }
    });
  }

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
    renderCompanyDossier();
    drawSignalMap();
  });

  els.fileInput.addEventListener("change", async () => {
    const files = Array.from(els.fileInput.files || []);
    await processFiles(files);
    els.fileInput.value = "";
  });

  els.importTickerSelect.addEventListener("change", () => {
    els.pasteTicker.value = els.importTickerSelect.value;
    state.selectedTicker = els.importTickerSelect.value;
    renderValuationOptions();
    renderCompanyDossier();
    updateValuationFromCompany();
    updateValuation();
    drawSignalMap();
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
    const text = els.pasteText.value.trim().slice(0, MAX_SOURCE_TEXT_CHARS);
    if (!text) {
      els.pasteText.focus();
      return;
    }
    const added = addUploadedDocs([
      makeUploadedDoc({
        ticker: els.pasteTicker.value,
        title: els.pasteTitle.value,
        type: els.pasteType.value,
        text
      })
    ]);
    state.importReport = makeImportReport(added, []);
    renderImportSummary();
    els.pasteText.value = "";
  });

  els.clearUploads.addEventListener("click", () => {
    state.uploadedDocs = [];
    rebuildDocumentCorpus();
    state.activeTickers = new Set(SAMPLE_COMPANIES.map((company) => company.ticker));
    for (const doc of state.sourcePackDocs) {
      state.activeTickers.add(doc.ticker);
    }
    saveJson(STORAGE_KEYS.uploads, []);
    state.importReport = null;
    renderImportSummary();
    renderCoverage();
    renderLibrary();
    renderImportTickerOptions();
    renderContextBand();
    renderValuationOptions();
    renderCompanyDossier();
    updateValuationFromCompany();
    updateValuation();
    drawSignalMap();
  });

  els.valuationTicker.addEventListener("change", () => {
    state.selectedTicker = els.valuationTicker.value;
    updateValuationFromCompany();
    updateValuation();
    renderCompanyDossier();
    drawSignalMap();
  });

  [els.growthSlider, els.marginSlider, els.multipleSlider, els.discountSlider].forEach((slider) => {
    slider.addEventListener("input", updateValuation);
  });

  els.saveValuationCase.addEventListener("click", saveValuationCase);
  els.copyBrief.addEventListener("click", copyCurrentBrief);
  els.saveBrief.addEventListener("click", saveCurrentBrief);
  if (els.saveCurrentEvidence) {
    els.saveCurrentEvidence.addEventListener("click", saveCurrentEvidenceToVault);
  }
  if (els.copyEvidenceVault) {
    els.copyEvidenceVault.addEventListener("click", copyEvidenceVault);
  }
  if (els.exportEvidenceVault) {
    els.exportEvidenceVault.addEventListener("click", exportEvidenceVault);
  }
  if (els.clearEvidenceVault) {
    els.clearEvidenceVault.addEventListener("click", clearEvidenceVault);
  }
  if (els.exportPdfBrief) {
    els.exportPdfBrief.addEventListener("click", exportPdfBrief);
  }
  els.exportBrief.addEventListener("click", exportCurrentBrief);
  if (els.copyBriefPacket) {
    els.copyBriefPacket.addEventListener("click", copyBriefPacket);
  }
  if (els.exportBriefPacketJson) {
    els.exportBriefPacketJson.addEventListener("click", exportBriefPacketJson);
  }
  if (els.openBriefNextGap) {
    els.openBriefNextGap.addEventListener("click", openBriefNextGap);
  }
  if (els.runInvestmentGate) {
    els.runInvestmentGate.addEventListener("click", () => {
      renderInvestmentGate({ focus: true });
      flashInvestmentGateResult("Investment Readiness Gate refreshed.", "neutral");
    });
  }
  if (els.openInvestmentGateGap) {
    els.openInvestmentGateGap.addEventListener("click", openInvestmentGateGap);
  }
  if (els.copyInvestmentGateNote) {
    els.copyInvestmentGateNote.addEventListener("click", copyInvestmentGateNote);
  }
  if (els.memoReviewForm) {
    els.memoReviewForm.addEventListener("submit", (event) => {
      event.preventDefault();
      saveMemoReview();
    });
  }
  if (els.exportMemoReviews) {
    els.exportMemoReviews.addEventListener("click", exportMemoReviewLog);
  }
  if (els.copyMemoReviews) {
    els.copyMemoReviews.addEventListener("click", copyMemoReviewLog);
  }
  if (els.clearMemoReviews) {
    els.clearMemoReviews.addEventListener("click", clearMemoReviews);
  }
  if (els.decisionJournalForm) {
    els.decisionJournalForm.addEventListener("submit", (event) => {
      event.preventDefault();
      saveDecisionJournalEntry();
    });
  }
  if (els.exportDecisionJournal) {
    els.exportDecisionJournal.addEventListener("click", exportDecisionJournal);
  }
  if (els.copyDecisionJournal) {
    els.copyDecisionJournal.addEventListener("click", copyDecisionJournal);
  }
  if (els.clearDecisionJournal) {
    els.clearDecisionJournal.addEventListener("click", clearDecisionJournal);
  }
  if (els.reviewRadarFilter) {
    els.reviewRadarFilter.addEventListener("change", () => {
      state.reviewRadarFilter = els.reviewRadarFilter.value;
      renderReviewRadar();
    });
  }
  if (els.openNextReview) {
    els.openNextReview.addEventListener("click", openNextReview);
  }
  if (els.copyReviewRadar) {
    els.copyReviewRadar.addEventListener("click", copyReviewRadar);
  }
  if (els.exportReviewRadar) {
    els.exportReviewRadar.addEventListener("click", exportReviewRadar);
  }
  if (els.portfolioWatchtowerFilter) {
    els.portfolioWatchtowerFilter.addEventListener("change", () => {
      state.portfolioWatchtowerFilter = els.portfolioWatchtowerFilter.value;
      renderPortfolioWatchtower();
    });
  }
  if (els.portfolioWatchtowerSort) {
    els.portfolioWatchtowerSort.addEventListener("change", () => {
      state.portfolioWatchtowerSort = els.portfolioWatchtowerSort.value;
      renderPortfolioWatchtower();
    });
  }
  if (els.openPortfolioAction) {
    els.openPortfolioAction.addEventListener("click", openNextPortfolioAction);
  }
  if (els.copyPortfolioWatchtower) {
    els.copyPortfolioWatchtower.addEventListener("click", copyPortfolioWatchtower);
  }
  if (els.exportPortfolioWatchtower) {
    els.exportPortfolioWatchtower.addEventListener("click", exportPortfolioWatchtower);
  }
  if (els.catalystCalendarFilter) {
    els.catalystCalendarFilter.addEventListener("change", () => {
      state.catalystCalendarFilter = els.catalystCalendarFilter.value;
      renderCatalystCalendar();
      renderDailyBriefing();
      renderDeskTaskBoard();
      renderResearchSprintPlanner();
      renderIcMemoBuilder();
      renderClaimTraceInspector();
      renderAnswerQualityLab();
    });
  }
  if (els.catalystCalendarHorizon) {
    els.catalystCalendarHorizon.addEventListener("change", () => {
      state.catalystCalendarHorizon = els.catalystCalendarHorizon.value;
      renderCatalystCalendar();
      renderDailyBriefing();
      renderDeskTaskBoard();
      renderResearchSprintPlanner();
      renderIcMemoBuilder();
      renderClaimTraceInspector();
      renderAnswerQualityLab();
    });
  }
  if (els.openCatalystAction) {
    els.openCatalystAction.addEventListener("click", openNextCatalystAction);
  }
  if (els.copyCatalystCalendar) {
    els.copyCatalystCalendar.addEventListener("click", copyCatalystCalendar);
  }
  if (els.exportCatalystCalendar) {
    els.exportCatalystCalendar.addEventListener("click", exportCatalystCalendar);
  }
  if (els.dailyBriefingMode) {
    els.dailyBriefingMode.addEventListener("change", () => {
      state.dailyBriefingMode = els.dailyBriefingMode.value;
      renderDailyBriefing();
      renderDeskTaskBoard();
      renderResearchSprintPlanner();
      renderIcMemoBuilder();
      renderClaimTraceInspector();
      renderAnswerQualityLab();
    });
  }
  if (els.openDailyBriefingAction) {
    els.openDailyBriefingAction.addEventListener("click", () => openDailyBriefingAction());
  }
  if (els.captureDailyBriefingTask) {
    els.captureDailyBriefingTask.addEventListener("click", () => captureDailyBriefingTask());
  }
  if (els.copyDailyBriefing) {
    els.copyDailyBriefing.addEventListener("click", copyDailyBriefing);
  }
  if (els.exportDailyBriefing) {
    els.exportDailyBriefing.addEventListener("click", exportDailyBriefing);
  }
  if (els.deskTaskFilter) {
    els.deskTaskFilter.addEventListener("change", () => {
      state.deskTaskFilter = els.deskTaskFilter.value;
      renderDeskTaskBoard();
      renderResearchSprintPlanner();
      renderIcMemoBuilder();
      renderClaimTraceInspector();
      renderAnswerQualityLab();
    });
  }
  if (els.captureFirstTask) {
    els.captureFirstTask.addEventListener("click", () => captureDailyBriefingTask());
  }
  if (els.copyDeskTasks) {
    els.copyDeskTasks.addEventListener("click", copyDeskTasks);
  }
  if (els.exportDeskTasks) {
    els.exportDeskTasks.addEventListener("click", exportDeskTasks);
  }
  if (els.clearCompletedTasks) {
    els.clearCompletedTasks.addEventListener("click", clearCompletedTasks);
  }
  if (els.researchSprintMode) {
    els.researchSprintMode.addEventListener("change", () => {
      state.sprintMode = els.researchSprintMode.value;
      renderResearchSprintPlanner();
      renderIcMemoBuilder();
      renderClaimTraceInspector();
      renderAnswerQualityLab();
    });
  }
  if (els.researchSprintCapacity) {
    els.researchSprintCapacity.addEventListener("change", () => {
      state.sprintCapacity = els.researchSprintCapacity.value;
      renderResearchSprintPlanner();
      renderIcMemoBuilder();
      renderClaimTraceInspector();
      renderAnswerQualityLab();
    });
  }
  if (els.startResearchSprint) {
    els.startResearchSprint.addEventListener("click", () => startResearchSprint());
  }
  if (els.captureSprintTasks) {
    els.captureSprintTasks.addEventListener("click", captureResearchSprintTasks);
  }
  if (els.copyResearchSprint) {
    els.copyResearchSprint.addEventListener("click", copyResearchSprint);
  }
  if (els.exportResearchSprint) {
    els.exportResearchSprint.addEventListener("click", exportResearchSprint);
  }
  if (els.icMemoMode) {
    els.icMemoMode.addEventListener("change", () => {
      state.icMemoMode = els.icMemoMode.value;
      renderIcMemoBuilder();
      renderClaimTraceInspector();
      renderAnswerQualityLab();
      renderLaunchControlRoom();
    });
  }
  if (els.openIcMemoBlocker) {
    els.openIcMemoBlocker.addEventListener("click", openIcMemoBlocker);
  }
  if (els.copyIcMemo) {
    els.copyIcMemo.addEventListener("click", copyIcMemo);
  }
  if (els.exportIcMemoPdf) {
    els.exportIcMemoPdf.addEventListener("click", exportIcMemoPdf);
  }
  if (els.exportIcMemoJson) {
    els.exportIcMemoJson.addEventListener("click", exportIcMemoJson);
  }
  if (els.claimTraceMode) {
    els.claimTraceMode.addEventListener("change", () => {
      state.claimTraceMode = els.claimTraceMode.value;
      renderClaimTraceInspector();
      renderAnswerQualityLab();
      renderIcMemoBuilder();
      renderClaimTraceInspector();
      renderAnswerQualityLab();
      renderLaunchControlRoom();
    });
  }
  if (els.openWeakClaim) {
    els.openWeakClaim.addEventListener("click", openWeakestClaim);
  }
  if (els.copyClaimTrace) {
    els.copyClaimTrace.addEventListener("click", copyClaimTrace);
  }
  if (els.exportClaimTrace) {
    els.exportClaimTrace.addEventListener("click", exportClaimTrace);
  }
  if (els.answerQualityMode) {
    els.answerQualityMode.addEventListener("change", () => {
      state.answerQualityMode = els.answerQualityMode.value;
      renderAnswerQualityLab();
      renderLaunchControlRoom();
    });
  }
  if (els.openQualityFix) {
    els.openQualityFix.addEventListener("click", openAnswerQualityFix);
  }
  if (els.copyQualityReport) {
    els.copyQualityReport.addEventListener("click", copyAnswerQualityReport);
  }
  if (els.exportQualityReport) {
    els.exportQualityReport.addEventListener("click", exportAnswerQualityReport);
  }
  if (els.openTrustAction) {
    els.openTrustAction.addEventListener("click", openTrustCenterAction);
  }
  if (els.copyTrustReport) {
    els.copyTrustReport.addEventListener("click", copyTrustReport);
  }
  if (els.exportTrustReport) {
    els.exportTrustReport.addEventListener("click", exportTrustReport);
  }
  if (els.operatorCoachDo) {
    els.operatorCoachDo.addEventListener("click", openOperatorCoachAction);
  }
  if (els.copyOperatorPlan) {
    els.copyOperatorPlan.addEventListener("click", copyOperatorCoachPlan);
  }
  if (els.exportOperatorPlan) {
    els.exportOperatorPlan.addEventListener("click", exportOperatorCoachPlan);
  }
  if (els.openLaunchBlocker) {
    els.openLaunchBlocker.addEventListener("click", openLaunchBlocker);
  }
  if (els.exportLaunchAudit) {
    els.exportLaunchAudit.addEventListener("click", exportLaunchAuditPack);
  }
  if (els.copyLaunchChecklist) {
    els.copyLaunchChecklist.addEventListener("click", copyLaunchUploadChecklist);
  }
  if (els.copyReleaseManifest) {
    els.copyReleaseManifest.addEventListener("click", copyReleaseManifest);
  }
  if (els.exportReleaseManifest) {
    els.exportReleaseManifest.addEventListener("click", exportReleaseManifest);
  }
  els.clearNotes.addEventListener("click", () => {
    state.notes = [];
    saveJson(STORAGE_KEYS.notes, state.notes);
    renderNotebook();
  });

  els.waitlistForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitWaitlistLead();
  });

  els.sourceBuilderTicker.addEventListener("change", () => {
    state.selectedTicker = els.sourceBuilderTicker.value;
    renderSourceAssistantLinks();
    renderSourceReviewGate();
    renderGuidedSourceCollector();
    renderValuationOptions();
    renderImportTickerOptions();
    renderCompanyDossier();
    updateValuationFromCompany();
    updateValuation();
    drawSignalMap();
  });

  els.sourceBuilderType.addEventListener("change", () => {
    renderSourceBuilderSections();
    renderSourceAssistantLinks();
    renderActiveSourceTask();
    renderFilingCapturePreview();
    renderSourceIntakeDoctor();
    renderSourceCitationExtractor();
    renderSourceReviewGate();
    renderGuidedSourceCollector();
  });

  if (els.sourceBuilderUrl) {
    els.sourceBuilderUrl.addEventListener("input", () => {
      if (normalizeExternalUrl(els.sourceBuilderUrl.value)) markActiveSourceTaskStage("collected");
      renderActiveSourceTask();
      renderFilingCapturePreview();
      renderSourceIntakeDoctor();
      renderSourceCitationExtractor();
      renderSourceReviewGate();
      renderGuidedSourceCollector();
    });
  }

  [els.sourceBuilderTicker, els.sourceBuilderStatus, els.sourceBuilderPeriod, els.sourceBuilderDate, els.sourceBuilderTitleInput].forEach((input) => {
    if (!input) return;
    input.addEventListener("input", renderFilingCapturePreview);
    input.addEventListener("change", renderFilingCapturePreview);
    input.addEventListener("input", renderSourceIntakeDoctor);
    input.addEventListener("change", renderSourceIntakeDoctor);
    input.addEventListener("input", renderSourceCitationExtractor);
    input.addEventListener("change", renderSourceCitationExtractor);
    input.addEventListener("input", renderSourceReviewGate);
    input.addEventListener("change", renderSourceReviewGate);
    input.addEventListener("input", renderGuidedSourceCollector);
    input.addEventListener("change", renderGuidedSourceCollector);
  });

  if (els.applySourceAssistant) {
    els.applySourceAssistant.addEventListener("click", applySourceAssistant);
  }

  if (els.sourceAssistantText) {
    els.sourceAssistantText.addEventListener("input", () => {
      els.sourceAssistantText.dataset.sample = "";
      renderFilingCapturePreview();
      renderSourceIntakeDoctor();
      renderSourceCitationExtractor();
      renderSourceReviewGate();
      renderGuidedSourceCollector();
    });
  }

  if (els.loadSampleFiling) {
    els.loadSampleFiling.addEventListener("click", loadSampleFilingText);
  }

  if (els.clearSourceAssistant) {
    els.clearSourceAssistant.addEventListener("click", () => {
      els.sourceAssistantText.value = "";
      els.sourceAssistantText.dataset.sample = "";
      renderFilingCapturePreview();
      renderSourceIntakeDoctor();
      renderSourceCitationExtractor();
      renderSourceReviewGate();
      renderGuidedSourceCollector();
      flashSourceAssistantResult("Paste cleared.", "neutral");
    });
  }

  if (els.sourceConfidenceChecklist) {
    els.sourceConfidenceChecklist.querySelectorAll("input[type='checkbox']").forEach((input) => {
      input.addEventListener("change", renderFilingCapturePreview);
      input.addEventListener("change", renderSourceIntakeDoctor);
      input.addEventListener("change", renderSourceReviewGate);
      input.addEventListener("change", renderGuidedSourceCollector);
    });
  }

  if (els.runSourceIntakeDoctor) {
    els.runSourceIntakeDoctor.addEventListener("click", () => {
      renderSourceIntakeDoctor({ focus: true });
    });
  }

  if (els.copySourceCitationNote) {
    els.copySourceCitationNote.addEventListener("click", copySourceCitationNote);
  }

  document.addEventListener("click", handleSourceCitationActionClick);
  document.addEventListener("click", handleSourceReviewActionClick);

  if (els.loadGuidedSourceTask) {
    els.loadGuidedSourceTask.addEventListener("click", loadGuidedSourceTask);
  }

  if (els.openGuidedSourceLinks) {
    els.openGuidedSourceLinks.addEventListener("click", openGuidedSourceLinks);
  }

  if (els.copyGuidedSourceBrief) {
    els.copyGuidedSourceBrief.addEventListener("click", copyGuidedSourceBrief);
  }

  if (els.exportGuidedSourceBrief) {
    els.exportGuidedSourceBrief.addEventListener("click", exportGuidedSourceBrief);
  }

  els.sourcePackForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addSourcePackDocFromBuilder();
  });

  els.exportSourcePack.addEventListener("click", exportSourcePackJson);
  els.exportMergedDocuments.addEventListener("click", exportMergedDocumentsJson);

  if (els.returnToDossier) {
    els.returnToDossier.addEventListener("click", returnToDossier);
  }

  els.sourcePackJsonInput.addEventListener("change", async () => {
    const file = els.sourcePackJsonInput.files && els.sourcePackJsonInput.files[0];
    if (file) {
      await importSourcePackJson(file);
      els.sourcePackJsonInput.value = "";
    }
  });

  els.clearSourcePack.addEventListener("click", () => {
    state.sourcePackDocs = [];
    rebuildDocumentCorpus();
    saveJson(STORAGE_KEYS.sourcePack, []);
    renderSourcePackList();
    renderGuidedSourceCollector();
    renderSourceMatrixOptions();
    renderSourceMatrix();
    renderRealSourceStarterPack();
    renderSourceQueueOptions();
    renderSourceQueue();
    state.importReport = null;
    renderImportSummary();
    flashBuilderResult("Builder pack cleared. Starter and uploaded sources are unchanged.", "neutral");
  });

  if (els.queueTickerFilter) {
    els.queueTickerFilter.addEventListener("change", renderSourceQueue);
  }

  if (els.queueStatusFilter) {
    els.queueStatusFilter.addEventListener("change", renderSourceQueue);
  }

  if (els.matrixTickerFilter) {
    els.matrixTickerFilter.addEventListener("change", renderSourceMatrix);
  }

  if (els.matrixStatusFilter) {
    els.matrixStatusFilter.addEventListener("change", renderSourceMatrix);
  }

  if (els.matrixNextGap) {
    els.matrixNextGap.addEventListener("click", openNextCoverageGap);
  }

  if (els.copyCoverageMatrix) {
    els.copyCoverageMatrix.addEventListener("click", copyCoverageMatrixCsv);
  }

  if (els.downloadCoverageMatrix) {
    els.downloadCoverageMatrix.addEventListener("click", downloadCoverageMatrixCsv);
  }

  if (els.generateSourceTasks) {
    els.generateSourceTasks.addEventListener("click", () => {
      if (els.queueStatusFilter) els.queueStatusFilter.value = "priority";
      renderSourceQueue();
      flashSourceQueueResult("Priority queue refreshed for missing and synthetic evidence.", "neutral");
    });
  }

  if (els.exportChecklistCsv) {
    els.exportChecklistCsv.addEventListener("click", exportSourceChecklistCsv);
  }

  if (els.copyChecklistCsv) {
    els.copyChecklistCsv.addEventListener("click", copySourceChecklistCsv);
  }

  if (els.hubTickerSelect) {
    els.hubTickerSelect.addEventListener("change", renderSourceHub);
  }

  if (els.hubRequirementSelect) {
    els.hubRequirementSelect.addEventListener("change", renderSourceHub);
  }

  if (els.loadHubTask) {
    els.loadHubTask.addEventListener("click", () => {
      const item = getCurrentSourceHubItem();
      if (item) loadSourceTaskIntoBuilder(item.company.ticker, item.requirement.key);
    });
  }

  if (els.copyHubTask) {
    els.copyHubTask.addEventListener("click", copySourceHubTask);
  }

  if (els.exportAssistantTasks) {
    els.exportAssistantTasks.addEventListener("click", exportAssistantTaskList);
  }

  if (els.workspaceFilter) {
    els.workspaceFilter.addEventListener("change", renderSourceWorkspace);
  }

  if (els.workspaceBatchSize) {
    els.workspaceBatchSize.addEventListener("change", renderSourceWorkspace);
  }

  if (els.buildWorkspaceBatch) {
    els.buildWorkspaceBatch.addEventListener("click", () => {
      renderSourceWorkspace();
      flashSourceWorkspaceResult("Today's source-collection batch is ready.", "neutral");
      document.querySelector("#source-workspace")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (els.exportWorkspaceProgress) {
    els.exportWorkspaceProgress.addEventListener("click", exportWorkspaceProgressReport);
  }

  if (els.exportWorkspacePack) {
    els.exportWorkspacePack.addEventListener("click", exportWorkspaceJsonPack);
  }
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

function renderImportTickerOptions() {
  if (!els.importTickerSelect) return;
  const companies = getCompanies();
  els.importTickerSelect.innerHTML = companies.map((company) => {
    const selected = company.ticker === state.selectedTicker ? "selected" : "";
    return `<option value="${escapeAttr(company.ticker)}" ${selected}>${escapeHtml(company.ticker)} - ${escapeHtml(company.name)}</option>`;
  }).join("");
  els.pasteTicker.value = state.selectedTicker || companies[0]?.ticker || "CUSTOM";
}

function renderSourceBuilderTickerOptions() {
  if (!els.sourceBuilderTicker) return;
  const companies = getCompanies();
  els.sourceBuilderTicker.innerHTML = companies.map((company) => {
    const selected = company.ticker === state.selectedTicker ? "selected" : "";
    return `<option value="${escapeAttr(company.ticker)}" ${selected}>${escapeHtml(company.ticker)} - ${escapeHtml(company.name)}</option>`;
  }).join("");
}

function renderSourceBuilderSections() {
  if (!els.sourceBuilderSections) return;
  const templates = getSourceSectionTemplates(els.sourceBuilderType ? els.sourceBuilderType.value : "Annual report");
  els.sourceBuilderSections.innerHTML = templates.map((title, index) => `
    <label>
      <span>${escapeHtml(title)}</span>
      <textarea data-section-title="${escapeAttr(title)}" rows="${index === 0 ? 5 : 4}" placeholder="Paste ${escapeAttr(title.toLowerCase())} text here"></textarea>
    </label>
  `).join("");
  els.sourceBuilderSections.querySelectorAll("textarea").forEach((textarea) => {
    textarea.addEventListener("input", () => {
      renderActiveSourceTask();
      renderFilingCapturePreview();
      renderSourceIntakeDoctor();
      renderSourceCitationExtractor();
      renderSourceReviewGate();
      renderGuidedSourceCollector();
    });
  });
  renderFilingCapturePreview();
  renderSourceIntakeDoctor();
  renderSourceCitationExtractor();
  renderSourceReviewGate();
  renderGuidedSourceCollector();
}

function getSourceSectionTemplates(type) {
  if (/annual/i.test(type)) return ["Business overview", "Management discussion and analysis", "Risk factors", "Liquidity and capital resources"];
  if (/concall|transcript/i.test(type)) return ["Prepared remarks", "Analyst Q&A", "Management tone"];
  if (/quarter|results/i.test(type)) return ["Results summary", "Segment performance", "Management commentary"];
  if (/shareholding|pledge/i.test(type)) return ["Shareholding pattern", "Promoter holding and pledge", "Institutional ownership"];
  if (/exchange|announcement/i.test(type)) return ["Announcement extract", "Management rationale", "Investment impact"];
  if (/rating|credit/i.test(type)) return ["Rating action", "Credit strengths", "Credit risks"];
  if (/valuation|model/i.test(type)) return ["Scenario assumptions", "Valuation bridge", "Sensitivity notes"];
  return ["Source summary", "Key evidence", "Risks and watch items"];
}

function applySourceAssistant() {
  if (!els.sourceAssistantText) return;
  const rawText = els.sourceAssistantText.value.trim().slice(0, MAX_SOURCE_TEXT_CHARS);
  if (rawText.replace(/\s+/g, "").length < 120) {
    els.sourceAssistantText.focus();
    flashSourceAssistantResult("Paste at least a few paragraphs from the source before detecting sections.", "error");
    return;
  }
  const draft = makeSourceAssistantDraft(rawText);
  const company = getCompany(draft.ticker);
  const sampleMode = els.sourceAssistantText.dataset.sample === "true";
  state.selectedTicker = draft.ticker;
  renderSourceBuilderTickerOptions();
  els.sourceBuilderTicker.value = draft.ticker;
  els.sourceBuilderType.value = draft.type;
  els.sourceBuilderStatus.value = sampleMode ? "imported" : "real";
  els.sourceBuilderPeriod.value = draft.period;
  els.sourceBuilderDate.value = new Date().toISOString().slice(0, 10);
  els.sourceBuilderTitleInput.value = draft.title;
  renderSourceBuilderSections();
  fillSourceBuilderSections(draft.sections);
  renderSourceAssistantLinks();
  renderImportTickerOptions();
  renderValuationOptions();
  renderCompanyDossier();
  updateValuationFromCompany();
  updateValuation();
  drawSignalMap();
  markActiveSourceTaskStage("pasted");
  renderFilingCapturePreview(draft);
  renderSourceIntakeDoctor();
  renderSourceCitationExtractor();
  renderSourceReviewGate();
  renderGuidedSourceCollector();
  const urlWarning = els.sourceBuilderUrl.value.trim() ? "" : " Add the source URL before shipping as REAL.";
  const sampleWarning = sampleMode ? " Sample text is marked IMP, not REAL." : "";
  flashSourceAssistantResult(`${company ? company.ticker : draft.ticker} ${draft.type} detected with ${draft.sections.length} citation section${draft.sections.length === 1 ? "" : "s"}.${urlWarning}${sampleWarning}`, urlWarning || sampleMode ? "neutral" : "success");
}

function makeSourceAssistantDraft(rawText) {
  const text = normalizeSourceAssistantText(rawText);
  const ticker = detectAssistantTicker(text);
  const type = detectAssistantSourceType(text);
  const period = detectAssistantPeriod(text, type);
  const company = getCompany(ticker);
  return {
    ticker,
    type,
    period,
    title: `${company ? company.name : ticker} ${shortDocType(type)} source ${period}`.trim(),
    sections: makeAssistantSections(text, type)
  };
}

function loadSampleFilingText() {
  if (!els.sourceAssistantText) return;
  const ticker = normalizeTicker(state.activeSourceTask?.ticker || els.sourceBuilderTicker?.value || state.selectedTicker);
  const company = getCompany(ticker);
  const requirement = state.activeSourceTask
    ? REAL_SOURCE_REQUIREMENTS.find((item) => item.key === state.activeSourceTask.requirementKey) || getBuilderRequirement()
    : getBuilderRequirement();
  const sampleText = makeSampleFilingText(company, requirement);
  els.sourceAssistantText.value = sampleText;
  els.sourceAssistantText.dataset.sample = "true";
  if (els.sourceBuilderStatus) els.sourceBuilderStatus.value = "imported";
  if (els.sourceBuilderTicker && company) els.sourceBuilderTicker.value = company.ticker;
  if (els.sourceBuilderType && requirement) els.sourceBuilderType.value = requirement.type;
  renderSourceBuilderSections();
  renderSourceAssistantLinks();
  renderFilingCapturePreview(makeSourceAssistantDraft(sampleText));
  renderSourceIntakeDoctor();
  renderSourceCitationExtractor();
  renderSourceReviewGate();
  renderGuidedSourceCollector();
  flashSourceAssistantResult("Training sample loaded as IMP review. Use it to learn the flow, not as REAL evidence.", "neutral");
}

function makeSampleFilingText(company, requirement) {
  const safeCompany = company || getCompany(state.selectedTicker);
  const label = requirement ? requirement.label : "Results";
  const ticker = safeCompany ? safeCompany.ticker : "RELIANCE";
  const name = safeCompany ? safeCompany.name : "Reliance Industries";
  if (/results/i.test(label)) {
    return `${name} ${ticker} quarterly results training sample for Q4 FY2025. This sample is not an official filing and should remain imported review evidence. Results summary: consolidated revenue increased on resilient consumer and digital services performance, while energy margins remained sensitive to refining spreads and feedstock costs. Segment performance: retail store additions, telecom subscriber quality, and new-energy project timing were cited as key operating variables. Management commentary: management said capital allocation remains disciplined, cash conversion will be monitored, and near-term demand should be read with commodity and currency volatility in mind.`;
  }
  if (/concall/i.test(label)) {
    return `${name} ${ticker} concall transcript training sample for Q4 FY2025. This sample is not an official filing and should remain imported review evidence. Prepared remarks: management described demand trends, operating discipline, and investment priorities. Analyst Q&A: analysts asked about margins, capital expenditure, working capital, and execution risk. Management tone: management sounded balanced, highlighting growth opportunities while acknowledging cost inflation and timing uncertainty.`;
  }
  if (/shareholding/i.test(label)) {
    return `${name} ${ticker} shareholding pattern training sample for FY2025. This sample is not an official filing and should remain imported review evidence. Shareholding pattern: promoter holding, institutional ownership, and public shareholding should be checked against the official exchange filing. Promoter holding and pledge: verify whether any pledge or encumbrance is disclosed. Institutional ownership: compare FII, DII, and mutual fund movement with prior periods.`;
  }
  if (/announcement/i.test(label)) {
    return `${name} ${ticker} exchange announcement training sample for FY2025. This sample is not an official filing and should remain imported review evidence. Announcement extract: the company disclosed a material update requiring investor review. Management rationale: the announcement should be read for strategic intent, capital impact, and governance context. Investment impact: verify whether the event changes revenue visibility, risk, leverage, or execution timing.`;
  }
  return `${name} ${ticker} annual report training sample for FY2025. This sample is not an official filing and should remain imported review evidence. Business overview: the company describes its operating segments, growth priorities, and market position. Management discussion and analysis: management discusses demand, margin movement, working capital, and capital expenditure. Risk factors: commodity prices, regulation, competition, execution timing, and currency movement may affect results. Liquidity and capital resources: review free cash flow, debt, cash balances, and funding needs before using the source for investment research.`;
}

function renderFilingCapturePreview(draft = null) {
  if (!els.filingCapturePreview) return;
  const rawText = els.sourceAssistantText ? els.sourceAssistantText.value.trim() : "";
  const detected = draft || (rawText.replace(/\s+/g, "").length >= 120 ? makeSourceAssistantDraft(rawText) : null);
  const ticker = normalizeTicker((detected && detected.ticker) || els.sourceBuilderTicker?.value || state.selectedTicker);
  const company = getCompany(ticker);
  const requirement = detected
    ? REAL_SOURCE_REQUIREMENTS.find((item) => item.type === detected.type) || getBuilderRequirement()
    : getBuilderRequirement();
  const status = normalizeSourceStatus(els.sourceBuilderStatus ? els.sourceBuilderStatus.value : "real");
  const sourceUrl = normalizeExternalUrl(els.sourceBuilderUrl ? els.sourceBuilderUrl.value : "");
  const sections = detected
    ? detected.sections
    : els.sourceBuilderSections
      ? Array.from(els.sourceBuilderSections.querySelectorAll("textarea"))
          .map((textarea) => ({ title: textarea.dataset.sectionTitle || "Source section", text: textarea.value.trim() }))
          .filter((section) => section.text.replace(/\s+/g, "").length > 30)
      : [];
  const impact = makeBuilderReadinessImpact(ticker, requirement, status);
  const confidence = getSourceConfidenceChecks();
  const sourceMode = els.sourceAssistantText && els.sourceAssistantText.dataset.sample === "true" ? "Training sample" : "Pasted filing";

  if (!rawText && !sections.length && !sourceUrl) {
    els.filingCapturePreview.innerHTML = `
      <div class="filing-preview-empty">
        Paste filing text or click Load sample filing to preview company, source type, sections, and readiness impact before adding evidence.
      </div>
    `;
    return;
  }

  els.filingCapturePreview.innerHTML = `
    <div class="filing-preview-card">
      <div>
        <span>${escapeHtml(sourceMode)}</span>
        <strong>${escapeHtml(company ? company.ticker : ticker)} ${escapeHtml(requirement ? requirement.label : "Source")} capture preview</strong>
      </div>
      <dl>
        <div><dt>Detected company</dt><dd>${escapeHtml(company ? company.name : ticker)}</dd></div>
        <div><dt>Source type</dt><dd>${escapeHtml(detected ? detected.type : els.sourceBuilderType?.value || "Source")}</dd></div>
        <div><dt>Period</dt><dd>${escapeHtml(detected ? detected.period : els.sourceBuilderPeriod?.value || "Current")}</dd></div>
        <div><dt>Sections</dt><dd>${escapeHtml(sections.length)} ready</dd></div>
      </dl>
    </div>
    <div class="filing-preview-card is-impact">
      <div>
        <span>Before / after readiness</span>
        <strong>${escapeHtml(impact.requirementLabel)}: ${escapeHtml(impact.beforeStatus)} -> ${escapeHtml(impact.afterStatus)}</strong>
      </div>
      <p>${escapeHtml(impact.companyReadyBefore)} REAL now, ${escapeHtml(impact.companyReadyAfter)} REAL after add. ${escapeHtml(impact.packImpact)}</p>
    </div>
    <div class="filing-preview-card ${status === "real" && !confidence.ready ? "is-warning" : "is-ok"}">
      <div>
        <span>Confidence gate</span>
        <strong>${status === "real" ? `${confidence.count}/3 REAL checks confirmed` : "REAL checks not required for IMP/SYN drafts"}</strong>
      </div>
      <p>${escapeHtml(status === "real" ? confidence.message : "Imported or synthetic drafts can be saved without the REAL verification checklist.")}</p>
    </div>
  `;
}

function renderSourceIntakeDoctor(options = {}) {
  if (!els.sourceIntakeDoctor) return;
  const audit = makeSourceIntakeAudit();
  if (els.copySourceCitationNote) els.copySourceCitationNote.disabled = !audit.hasAnyInput;
  const rows = audit.checks.map((check) => `
    <article class="source-intake-check ${check.passed ? "is-pass" : check.severity === "High" ? "is-high" : "is-warning"}">
      <span>${check.passed ? "OK" : check.severity}</span>
      <strong>${escapeHtml(check.label)}</strong>
      <p>${escapeHtml(check.detail)}</p>
    </article>
  `).join("");

  els.sourceIntakeDoctor.innerHTML = `
    <div class="source-intake-hero ${escapeAttr(audit.statusClass)}">
      <div>
        <span>Source Intake Doctor</span>
        <strong>${escapeHtml(audit.statusLabel)}</strong>
        <p>${escapeHtml(audit.summary)}</p>
      </div>
      <div class="source-intake-score">
        <span>Intake score</span>
        <strong>${escapeHtml(audit.score)}%</strong>
      </div>
    </div>
    <div class="source-intake-stats">
      <article><span>Company</span><strong>${escapeHtml(audit.companyLabel)}</strong><em>${escapeHtml(audit.sourceType)}</em></article>
      <article><span>URL</span><strong>${escapeHtml(audit.urlLabel)}</strong><em>${escapeHtml(audit.urlHost || "No host")}</em></article>
      <article><span>Sections</span><strong>${escapeHtml(audit.readySections)}/${escapeHtml(audit.totalSections)}</strong><em>${escapeHtml(audit.totalWords)} words</em></article>
      <article><span>Quality</span><strong>${escapeHtml(audit.qualityLabel)}</strong><em>${escapeHtml(audit.periodLabel)}</em></article>
    </div>
    <div class="source-intake-checks">
      ${rows}
    </div>
  `;

  if (options.focus) {
    els.sourceIntakeDoctor.scrollIntoView({ behavior: "smooth", block: "center" });
    flashSourceAssistantResult(`${audit.statusLabel}. Intake score ${audit.score}%.`, audit.blockers.length ? "error" : audit.warnings.length ? "neutral" : "success");
  }
}

function renderSourceCitationExtractor(options = {}) {
  if (!els.sourceCitationSummary || !els.sourceCitationList) return;
  const audit = makeSourceCitationExtraction();
  if (els.sourceCitationStatus) els.sourceCitationStatus.textContent = audit.statusLabel;
  [els.applySourceCitations, els.copySourceCitations, els.exportSourceCitations].forEach((button) => {
    if (button) button.disabled = !audit.snippets.length;
  });

  els.sourceCitationSummary.innerHTML = audit.metrics.map((metric) => `
    <article>
      <span>${escapeHtml(metric.label)}</span>
      <strong>${escapeHtml(metric.value)}</strong>
      <p>${escapeHtml(metric.detail)}</p>
    </article>
  `).join("");

  if (!audit.snippets.length) {
    els.sourceCitationList.innerHTML = `
      <div class="source-citation-empty">
        <strong>${escapeHtml(audit.emptyTitle)}</strong>
        <p>${escapeHtml(audit.emptyDetail)}</p>
      </div>
    `;
  } else {
    els.sourceCitationList.innerHTML = audit.snippets.map((snippet, index) => `
      <article class="source-citation-card ${escapeAttr(snippet.className)}">
        <div class="source-citation-card-head">
          <span>C${index + 1}</span>
          <strong>${escapeHtml(snippet.targetSection)}</strong>
          <em>${escapeHtml(snippet.score)} pts</em>
        </div>
        <p>${escapeHtml(snippet.text)}</p>
        <div class="source-citation-meta">
          <span>${escapeHtml(snippet.reason)}</span>
          <button type="button" data-use-source-citation="${escapeAttr(index)}">Use passage</button>
        </div>
      </article>
    `).join("");

    els.sourceCitationList.querySelectorAll("button[data-use-source-citation]").forEach((button) => {
      button.addEventListener("click", () => {
        useSourceCitationSnippet(Number(button.dataset.useSourceCitation || 0));
      });
    });
  }

  if (options.focus) {
    els.sourceCitationList.scrollIntoView({ behavior: "smooth", block: "center" });
    flashSourceCitationResult(audit.snippets.length ? `${audit.snippets.length} citation passage${audit.snippets.length === 1 ? "" : "s"} extracted.` : audit.emptyDetail, audit.snippets.length ? "success" : "neutral");
  }
}

function makeSourceCitationExtraction() {
  const rawText = normalizeSourceAssistantText(els.sourceAssistantText ? els.sourceAssistantText.value : "").slice(0, MAX_SOURCE_TEXT_CHARS);
  const ticker = normalizeTicker(els.sourceBuilderTicker?.value || state.selectedTicker || "CUSTOM");
  const company = getCompany(ticker);
  const sourceType = els.sourceBuilderType?.value || "Research note";
  const requirement = getBuilderRequirement();
  const templates = getSourceSectionTemplates(sourceType);
  const sampleMode = els.sourceAssistantText?.dataset.sample === "true";
  const passages = splitSourceCandidatePassages(rawText);
  const snippets = passages
    .map((text) => scoreSourcePassage(text, { company, ticker, requirement, sourceType, templates }))
    .filter((snippet) => snippet.score >= 8 || /\d/.test(snippet.text))
    .sort((a, b) => b.score - a.score || b.text.length - a.text.length)
    .slice(0, 6)
    .map((snippet, index) => ({
      ...snippet,
      className: index < 2 ? "is-primary" : snippet.score >= 16 ? "is-strong" : "is-review"
    }));
  const mappedSections = new Set(snippets.map((snippet) => snippet.targetSection));
  const coverage = templates.length ? Math.round((mappedSections.size / templates.length) * 100) : 0;
  const statusLabel = !rawText
    ? "Paste needed"
    : snippets.length >= 3
      ? sampleMode ? "Sample passages" : "Passages ready"
      : "Need more text";
  return {
    rawText,
    ticker,
    company,
    sourceType,
    requirement,
    templates,
    sampleMode,
    snippets,
    coverage,
    statusLabel,
    emptyTitle: rawText ? "No strong citation passages yet." : "Paste source text first.",
    emptyDetail: rawText
      ? "Paste more filing text or include paragraphs with numbers, management commentary, risk language, or source-specific terms."
      : "Paste annual report, concall, results, shareholding, or announcement text above, then click Extract passages.",
    metrics: [
      {
        label: "Passages",
        value: String(snippets.length),
        detail: snippets.length ? "Ranked citation candidates from pasted source text." : "No citation candidates yet."
      },
      {
        label: "Section coverage",
        value: `${coverage}%`,
        detail: `${mappedSections.size}/${templates.length || 0} builder sections have a candidate.`
      },
      {
        label: "Company match",
        value: sourceTextMentionsCompany(rawText, company, ticker) ? ticker : "Review",
        detail: company ? `Expected ${company.name}.` : "Custom ticker selected."
      },
      {
        label: "Source mode",
        value: sampleMode ? "IMP sample" : shortDocType(sourceType),
        detail: sampleMode ? "Training samples should not be saved as REAL." : "Extractor is reading pasted filing text."
      }
    ]
  };
}

function splitSourceCandidatePassages(text) {
  const clean = normalizeSourceAssistantText(text);
  if (!clean) return [];
  const paragraphCandidates = clean
    .split(/\n{2,}|[.!?]\s+(?=[A-Z][a-z]+\s)/)
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter((item) => item.length >= 80);
  const sentences = clean
    .split(/[.!?]\s+/)
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter((item) => item.length >= 45);
  const chunks = [];
  for (let index = 0; index < sentences.length; index += 2) {
    const chunk = [sentences[index], sentences[index + 1]].filter(Boolean).join(" ");
    if (chunk.length >= 90) chunks.push(chunk);
  }
  return [...new Set([...paragraphCandidates, ...chunks])]
    .map((item) => item.slice(0, 620))
    .slice(0, 24);
}

function scoreSourcePassage(text, context) {
  const lower = text.toLowerCase();
  const key = context.requirement?.key || "default";
  const keywords = SOURCE_CITATION_KEYWORDS[key] || SOURCE_CITATION_KEYWORDS.default;
  const matches = keywords.filter((keyword) => lower.includes(keyword.toLowerCase()));
  let score = matches.length * 4;
  if (sourceTextMentionsCompany(text, context.company, context.ticker)) score += 8;
  if (/(rs\.?|inr|crore|%|bps|million|billion|\d)/i.test(text)) score += 6;
  if (/\b(management|board|promoter|risk|margin|cash|revenue|capex|debt|order|guidance)\b/i.test(text)) score += 5;
  if (text.length >= 140 && text.length <= 520) score += 3;
  if (/sample is not an official filing/i.test(text)) score -= 8;
  const targetSection = matchSnippetSection(text, context.templates);
  const reasonParts = [];
  if (matches.length) reasonParts.push(matches.slice(0, 3).join(", "));
  if (/\d/.test(text)) reasonParts.push("numbers");
  if (sourceTextMentionsCompany(text, context.company, context.ticker)) reasonParts.push("company match");
  return {
    text,
    score: Math.max(0, score),
    targetSection,
    reason: reasonParts.length ? reasonParts.join(" + ") : "general source language"
  };
}

function matchSnippetSection(text, templates = []) {
  const lower = text.toLowerCase();
  const sectionHints = [
    ["Risk factors", ["risk", "volatility", "regulatory", "competition", "uncertainty", "pressure"]],
    ["Liquidity and capital resources", ["liquidity", "cash", "debt", "capital", "free cash flow", "working capital"]],
    ["Management discussion and analysis", ["management", "discussion", "margin", "demand", "outlook", "capex"]],
    ["Business overview", ["business", "segment", "revenue", "operations", "growth", "market"]],
    ["Prepared remarks", ["prepared", "management", "remarks", "quarter", "performance"]],
    ["Analyst Q&A", ["analyst", "question", "asked", "q&a", "answer"]],
    ["Management tone", ["tone", "expects", "guidance", "confident", "cautious"]],
    ["Results summary", ["results", "quarter", "revenue", "profit", "margin"]],
    ["Segment performance", ["segment", "retail", "services", "banking", "portfolio"]],
    ["Management commentary", ["commentary", "management", "outlook", "demand"]],
    ["Shareholding pattern", ["shareholding", "holding", "equity"]],
    ["Promoter holding and pledge", ["promoter", "pledge", "encumbrance"]],
    ["Institutional ownership", ["institutional", "fii", "dii", "mutual fund"]],
    ["Announcement extract", ["announcement", "disclosed", "exchange"]],
    ["Management rationale", ["rationale", "strategic", "approved", "board"]],
    ["Investment impact", ["impact", "order", "capex", "transaction", "rating"]]
  ];
  const found = sectionHints.find(([label, hints]) => templates.includes(label) && hints.some((hint) => lower.includes(hint)));
  return found ? found[0] : templates[0] || "Source summary";
}

function useSourceCitationSnippet(index) {
  const audit = makeSourceCitationExtraction();
  const snippet = audit.snippets[index];
  if (!snippet || !els.sourceBuilderSections) return;
  const textareas = Array.from(els.sourceBuilderSections.querySelectorAll("textarea"));
  const target = textareas.find((textarea) => textarea.dataset.sectionTitle === snippet.targetSection) || textareas[0];
  if (!target) return;
  target.value = target.value.trim()
    ? `${target.value.trim()}\n\n${snippet.text}`
    : snippet.text;
  markActiveSourceTaskStage("pasted");
  renderFilingCapturePreview();
  renderSourceIntakeDoctor();
  renderSourceCitationExtractor();
  renderSourceReviewGate();
  renderGuidedSourceCollector();
  flashSourceCitationResult(`${snippet.targetSection} updated with citation passage C${index + 1}.`, "success");
}

function applyBestSourceCitations() {
  const audit = makeSourceCitationExtraction();
  if (!audit.snippets.length || !els.sourceBuilderSections) {
    flashSourceCitationResult("Paste source text before using citation passages.", "error");
    return;
  }
  const grouped = new Map();
  for (const snippet of audit.snippets) {
    if (!grouped.has(snippet.targetSection)) grouped.set(snippet.targetSection, []);
    grouped.get(snippet.targetSection).push(snippet.text);
  }
  const textareas = Array.from(els.sourceBuilderSections.querySelectorAll("textarea"));
  let filled = 0;
  textareas.forEach((textarea) => {
    const title = textarea.dataset.sectionTitle || "Source section";
    const passages = grouped.get(title) || [];
    if (!passages.length) return;
    textarea.value = passages.slice(0, 2).join("\n\n");
    filled += 1;
  });
  if (!filled && textareas[0]) {
    textareas[0].value = audit.snippets.slice(0, 3).map((snippet) => snippet.text).join("\n\n");
    filled = 1;
  }
  markActiveSourceTaskStage("pasted");
  renderFilingCapturePreview();
  renderSourceIntakeDoctor();
  renderSourceCitationExtractor();
  renderSourceReviewGate();
  renderGuidedSourceCollector();
  flashSourceCitationResult(`Best passages filled ${filled} builder section${filled === 1 ? "" : "s"}. Review before adding to live corpus.`, "success");
}

function handleSourceCitationActionClick(event) {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest("#refreshSourceCitations, #applySourceCitations, #copySourceCitations, #exportSourceCitations");
  if (!button || button.disabled) return;
  event.preventDefault();
  if (button.id === "refreshSourceCitations") {
    renderSourceCitationExtractor({ focus: true });
    return;
  }
  if (button.id === "applySourceCitations") {
    applyBestSourceCitations();
    return;
  }
  if (button.id === "copySourceCitations") {
    copySourceCitationPack();
    return;
  }
  if (button.id === "exportSourceCitations") {
    exportSourceCitationPack();
  }
}

async function copySourceCitationPack() {
  const audit = makeSourceCitationExtraction();
  if (!audit.snippets.length) {
    flashSourceCitationResult("No citation passages to copy yet.", "error");
    return;
  }
  const copied = await copyTextToClipboard(makeSourceCitationPackMarkdown(audit));
  flashSourceCitationResult(copied ? "Citation pack copied." : "Clipboard blocked. Use Export citation pack instead.", copied ? "success" : "error");
}

function exportSourceCitationPack() {
  const audit = makeSourceCitationExtraction();
  if (!audit.snippets.length) {
    flashSourceCitationResult("No citation passages to export yet.", "error");
    return;
  }
  const date = new Date().toISOString().slice(0, 10);
  const filename = `niveshscope-source-citations-v47-${audit.ticker.toLowerCase()}-${date}.md`;
  downloadTextFile(filename, makeSourceCitationPackMarkdown(audit), "text/markdown;charset=utf-8");
  flashSourceCitationResult("Citation pack exported.", "success");
}

function makeSourceCitationPackMarkdown(audit = makeSourceCitationExtraction()) {
  const snippets = audit.snippets.map((snippet, index) => [
    `## C${index + 1} - ${snippet.targetSection}`,
    `Score: ${snippet.score}`,
    `Why selected: ${snippet.reason}`,
    "",
    snippet.text
  ].join("\n")).join("\n\n");
  return [
    `# NiveshScope Source Citation Pack - ${audit.ticker}`,
    "",
    `Generated: ${new Date().toLocaleString()}`,
    `Source type: ${audit.sourceType}`,
    `Mode: ${audit.sampleMode ? "Training sample / IMP review" : "Pasted filing"}`,
    `Section coverage: ${audit.coverage}%`,
    "",
    snippets,
    "",
    "_Review source URL, period, date, and document identity before treating any passage as REAL evidence._"
  ].join("\n");
}

function flashSourceCitationResult(message, tone = "neutral") {
  if (!els.sourceCitationResult) return;
  els.sourceCitationResult.className = `builder-result is-${tone}`;
  els.sourceCitationResult.textContent = message;
}

function renderSourceReviewGate(options = {}) {
  if (!els.sourceReviewSummary || !els.sourceReviewChecks) return;
  const gate = makeSourceReviewGate();
  if (els.sourceReviewStatus) els.sourceReviewStatus.textContent = gate.statusLabel;
  if (els.openSourceReviewFix) els.openSourceReviewFix.disabled = !gate.firstFix;
  [els.copySourceReviewSheet, els.exportSourceReviewSheet].forEach((button) => {
    if (button) button.disabled = !gate.hasAnyInput;
  });

  els.sourceReviewSummary.innerHTML = `
    <article class="source-review-hero ${escapeAttr(gate.statusClass)}">
      <div>
        <span>${escapeHtml(gate.modeLabel)}</span>
        <strong>${escapeHtml(gate.headline)}</strong>
        <p>${escapeHtml(gate.summary)}</p>
      </div>
      <div class="source-review-score">
        <span>Gate score</span>
        <strong>${escapeHtml(gate.score)}%</strong>
      </div>
    </article>
    <div class="source-review-metrics">
      ${gate.metrics.map((metric) => `
        <article>
          <span>${escapeHtml(metric.label)}</span>
          <strong>${escapeHtml(metric.value)}</strong>
          <p>${escapeHtml(metric.detail)}</p>
        </article>
      `).join("")}
    </div>
  `;

  els.sourceReviewChecks.innerHTML = gate.checks.map((check) => `
    <article class="source-review-check ${escapeAttr(check.className)}">
      <span>${escapeHtml(check.status)}</span>
      <strong>${escapeHtml(check.label)}</strong>
      <p>${escapeHtml(check.detail)}</p>
    </article>
  `).join("");

  if (options.focus) {
    els.sourceReviewSummary.scrollIntoView({ behavior: "smooth", block: "center" });
    flashSourceReviewResult(`${gate.statusLabel}. Gate score ${gate.score}%.`, gate.blockers.length ? "error" : gate.warnings.length ? "neutral" : "success");
  }
}

function makeSourceReviewGate() {
  const intake = makeSourceIntakeAudit();
  const citation = makeSourceCitationExtraction();
  const confidence = getSourceConfidenceChecks();
  const combinedText = [citation.rawText, ...intake.sections.map((section) => section.text)].join(" ");
  const companyMatched = sourceTextMentionsCompany(combinedText, intake.company, intake.ticker);
  const sectionsReady = intake.readySections >= Math.min(2, Math.max(1, intake.totalSections));
  const citationReady = citation.snippets.length >= 3 || sectionsReady;
  const trustedUrl = intake.sourceUrl && isHttpsUrl(intake.sourceUrl) && isTrustedSourceUrl(intake.sourceUrl);
  const checks = [
    {
      label: "Source identity",
      passed: Boolean(intake.company && intake.sourceType && intake.period && intake.date && intake.title),
      severity: "Blocker",
      action: "identity",
      detail: intake.period && intake.date && intake.title
        ? `${intake.companyLabel} ${intake.sourceType} is dated and titled.`
        : "Company, source type, period, date, and record title must be complete."
    },
    {
      label: "Official source URL",
      passed: intake.status !== "real" ? !intake.rawUrl || Boolean(intake.sourceUrl) : Boolean(trustedUrl),
      severity: "Blocker",
      action: "url",
      detail: intake.status === "real"
        ? trustedUrl
          ? `${intake.urlHost} is valid HTTPS and trusted.`
          : "REAL evidence needs a valid HTTPS URL from a trusted market, exchange, regulator, or company source."
        : intake.sourceUrl
          ? "Draft URL parses cleanly. Verify before upgrading to REAL."
          : "IMP/SYN drafts can continue without an official URL."
    },
    {
      label: "Company discipline",
      passed: companyMatched,
      severity: "Blocker",
      action: "paste",
      detail: companyMatched
        ? `${intake.ticker} appears in the pasted or sectioned source evidence.`
        : "The pasted evidence does not clearly mention the selected company."
    },
    {
      label: "Citation structure",
      passed: sectionsReady,
      severity: "Blocker",
      action: "sections",
      detail: `${intake.readySections}/${intake.totalSections} builder sections have enough citation text.`
    },
    {
      label: "Citation extractor",
      passed: citationReady,
      severity: "Review",
      action: "citations",
      detail: citation.snippets.length
        ? `${citation.snippets.length} extracted passages with ${citation.coverage}% section coverage.`
        : "Extract passages or fill structured sections before reviewer handoff."
    },
    {
      label: "Intake Doctor",
      passed: intake.score >= 80 && !intake.blockers.length,
      severity: "Blocker",
      action: "intake",
      detail: `${intake.statusLabel} at ${intake.score}%. ${intake.blockers[0]?.label || "No high-priority blockers."}`
    },
    {
      label: "REAL confidence",
      passed: intake.status !== "real" || confidence.ready,
      severity: "Blocker",
      action: "confidence",
      detail: intake.status === "real"
        ? confidence.message
        : "REAL confidence checklist is only required before verified evidence enters the corpus."
    },
    {
      label: "Sample guard",
      passed: !(intake.sampleMode && intake.status === "real"),
      severity: "Blocker",
      action: "paste",
      detail: intake.sampleMode
        ? "Training samples must remain IMP/SYN until replaced with a real filing."
        : "No training-sample flag is attached to this source."
    }
  ].map((check) => ({
    ...check,
    status: check.passed ? "OK" : check.severity,
    className: check.passed ? "is-pass" : check.severity === "Blocker" ? "is-blocked" : "is-review"
  }));
  const blockers = checks.filter((check) => !check.passed && check.severity === "Blocker");
  const warnings = checks.filter((check) => !check.passed && check.severity !== "Blocker");
  const score = Math.round((checks.filter((check) => check.passed).length / checks.length) * 100);
  const firstFix = blockers[0] || warnings[0] || null;
  const statusLabel = blockers.length ? "Blocked" : warnings.length ? "Review" : "Reviewer ready";
  const statusClass = blockers.length ? "is-blocked" : warnings.length ? "is-review" : "is-ready";
  return {
    intake,
    citation,
    confidence,
    checks,
    blockers,
    warnings,
    firstFix,
    score,
    statusLabel,
    statusClass,
    hasAnyInput: intake.hasAnyInput || Boolean(citation.rawText),
    modeLabel: intake.status === "real" ? "REAL source gate" : `${intake.qualityLabel} review gate`,
    headline: blockers.length
      ? `${blockers.length} blocker${blockers.length === 1 ? "" : "s"} before live corpus.`
      : warnings.length
        ? "Reviewer pass needed before shipping."
        : "Source is ready for reviewer handoff.",
    summary: blockers.length
      ? `Start with ${blockers[0].label}. The gate protects against wrong company, weak citations, unsafe URLs, and sample evidence being marked REAL.`
      : warnings.length
        ? `${warnings.length} review item${warnings.length === 1 ? "" : "s"} remain, but no high-priority save blocker is open.`
        : "The source has identity, citation structure, trusted URL posture, intake score, and confidence checks aligned.",
    metrics: [
      { label: "Quality", value: intake.qualityLabel, detail: intake.sourceType },
      { label: "URL", value: intake.sourceUrl ? intake.urlLabel : "Missing", detail: intake.urlHost || "No host" },
      { label: "Sections", value: `${intake.readySections}/${intake.totalSections}`, detail: `${intake.totalWords} words in source text.` },
      { label: "Citations", value: String(citation.snippets.length), detail: `${citation.coverage}% extractor section coverage.` },
      { label: "Confidence", value: `${confidence.count}/${confidence.total}`, detail: intake.status === "real" ? "Required for REAL save." : "Optional for drafts." },
      { label: "Next fix", value: firstFix ? firstFix.label : "None", detail: firstFix ? firstFix.detail : "No open review action." }
    ]
  };
}

function handleSourceReviewActionClick(event) {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest("#runSourceReviewGate, #openSourceReviewFix, #copySourceReviewSheet, #exportSourceReviewSheet");
  if (!button || button.disabled) return;
  event.preventDefault();
  if (button.id === "runSourceReviewGate") {
    renderSourceReviewGate({ focus: true });
    return;
  }
  if (button.id === "openSourceReviewFix") {
    openSourceReviewFix();
    return;
  }
  if (button.id === "copySourceReviewSheet") {
    copySourceReviewSheet();
    return;
  }
  if (button.id === "exportSourceReviewSheet") {
    exportSourceReviewSheet();
  }
}

function openSourceReviewFix() {
  const gate = makeSourceReviewGate();
  const fix = gate.firstFix;
  if (!fix) {
    flashSourceReviewResult("No source review fix is open.", "success");
    return;
  }
  const targets = {
    identity: ["#sourceBuilderTicker", "Source identity fields opened."],
    url: ["#sourceBuilderUrl", "Source URL field opened."],
    paste: ["#sourceAssistantText", "Paste assistant opened."],
    sections: ["#sourceBuilderSections", "Builder sections opened."],
    citations: ["#source-citation-extractor", "Citation extractor opened."],
    intake: ["#source-intake-doctor", "Source Intake Doctor opened."],
    confidence: ["#sourceConfidenceChecklist", "REAL confidence checklist opened."]
  };
  const [selector, message] = targets[fix.action] || targets.intake;
  document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "center" });
  if (fix.action === "url" && els.sourceBuilderUrl) els.sourceBuilderUrl.focus();
  if (fix.action === "paste" && els.sourceAssistantText) els.sourceAssistantText.focus();
  flashSourceReviewResult(message, "neutral");
}

async function copySourceReviewSheet() {
  const gate = makeSourceReviewGate();
  if (!gate.hasAnyInput) {
    flashSourceReviewResult("Add source text, sections, or a URL before copying a review sheet.", "error");
    return;
  }
  const copied = await copyTextToClipboard(makeSourceReviewSheetMarkdown(gate));
  flashSourceReviewResult(copied ? "Source review sheet copied." : "Clipboard blocked. Use Export review sheet instead.", copied ? "success" : "error");
}

function exportSourceReviewSheet() {
  const gate = makeSourceReviewGate();
  if (!gate.hasAnyInput) {
    flashSourceReviewResult("Add source text, sections, or a URL before exporting a review sheet.", "error");
    return;
  }
  const date = new Date().toISOString().slice(0, 10);
  downloadTextFile(`niveshscope-source-review-v47-${gate.intake.ticker.toLowerCase()}-${date}.md`, makeSourceReviewSheetMarkdown(gate), "text/markdown;charset=utf-8");
  flashSourceReviewResult("Source review sheet exported.", "success");
}

function makeSourceReviewSheetMarkdown(gate = makeSourceReviewGate()) {
  const checks = gate.checks.map((check) => `- ${check.status}: ${check.label} - ${check.detail}`).join("\n");
  const snippets = gate.citation.snippets.length
    ? gate.citation.snippets.map((snippet, index) => `- C${index + 1} ${snippet.targetSection} (${snippet.score} pts): ${snippet.text}`).join("\n")
    : "- No extracted citation passages.";
  return [
    `# NiveshScope Source Review Gate - ${gate.intake.ticker}`,
    "",
    `Release: ${RELEASE_LABEL}`,
    `Generated: ${new Date().toLocaleString()}`,
    `Company: ${gate.intake.companyLabel}`,
    `Source type: ${gate.intake.sourceType}`,
    `Quality: ${gate.intake.qualityLabel}`,
    `Period: ${gate.intake.period || "Missing"}`,
    `Date: ${gate.intake.date || "Missing"}`,
    `Source URL: ${gate.intake.sourceUrl || "Missing"}`,
    `Gate: ${gate.statusLabel} (${gate.score}%)`,
    "",
    "## Checks",
    checks,
    "",
    "## Extracted Citations",
    snippets,
    "",
    "_Reviewer must verify document identity, source URL, company match, period/date, and citation completeness before treating this as REAL evidence._"
  ].join("\n");
}

function flashSourceReviewResult(message, tone = "neutral") {
  if (!els.sourceReviewResult) return;
  els.sourceReviewResult.className = `builder-result is-${tone}`;
  els.sourceReviewResult.textContent = message;
}

function renderGuidedSourceCollector() {
  if (!els.guidedSourceTask || !els.guidedSourceSummary || !els.guidedSourceChecklist) return;
  const guide = makeGuidedSourceCollector();
  if (els.guidedSourceStatus) els.guidedSourceStatus.textContent = guide.statusLabel;
  const next = guide.nextTask;

  els.guidedSourceSummary.innerHTML = guide.metrics.map((metric) => `
    <article>
      <span>${escapeHtml(metric.label)}</span>
      <strong>${escapeHtml(metric.value)}</strong>
      <p>${escapeHtml(metric.detail)}</p>
    </article>
  `).join("");

  if (!next) {
    els.guidedSourceTask.innerHTML = `
      <div class="guided-source-empty">
        <strong>All covered source slots look complete.</strong>
        <p>Run the Trust Center or export the source pack when you are ready to ship.</p>
      </div>
    `;
    els.guidedSourceChecklist.innerHTML = "";
    [els.loadGuidedSourceTask, els.openGuidedSourceLinks, els.copyGuidedSourceBrief, els.exportGuidedSourceBrief].forEach((button) => {
      if (button) button.disabled = true;
    });
    return;
  }

  [els.loadGuidedSourceTask, els.openGuidedSourceLinks, els.copyGuidedSourceBrief, els.exportGuidedSourceBrief].forEach((button) => {
    if (button) button.disabled = false;
  });

  const links = sourceLinksForTask(next).slice(0, 4);
  els.guidedSourceTask.innerHTML = `
    <article class="guided-source-card ${escapeAttr(next.className)}">
      <div class="guided-source-card-head">
        <div>
          <span>${escapeHtml(next.statusLabel)}</span>
          <strong>${escapeHtml(next.company.ticker)} ${escapeHtml(next.requirement.label)}</strong>
          <p>${escapeHtml(next.requirement.instruction)}</p>
        </div>
        <em>${escapeHtml(guide.priorityLabel)}</em>
      </div>
      <div class="guided-source-meta">
        <div><span>Company</span><strong>${escapeHtml(next.company.name)}</strong></div>
        <div><span>Current evidence</span><strong>${escapeHtml(next.currentEvidence)}</strong></div>
        <div><span>Builder match</span><strong>${escapeHtml(guide.builderLabel)}</strong></div>
      </div>
      <div class="guided-source-links">
        ${links.map((link) => `
          <a href="${escapeAttr(link.url)}" target="_blank" rel="noopener noreferrer" data-guided-source-url="${escapeAttr(link.url)}">
            <span>${escapeHtml(link.label)}</span>
            <strong>${escapeHtml(link.note)}</strong>
          </a>
        `).join("")}
      </div>
    </article>
  `;

  els.guidedSourceChecklist.innerHTML = `
    <div class="guided-check-head">
      <span>Collector checklist</span>
      <strong>${escapeHtml(guide.checklistTitle)}</strong>
    </div>
    ${guide.checks.map((check, index) => `
      <article class="${check.done ? "is-done" : "is-next"}">
        <span>${index + 1}</span>
        <div>
          <strong>${escapeHtml(check.label)}</strong>
          <p>${escapeHtml(check.detail)}</p>
        </div>
      </article>
    `).join("")}
  `;

  els.guidedSourceTask.querySelectorAll("a[data-guided-source-url]").forEach((link) => {
    link.addEventListener("click", () => {
      if (!state.activeSourceTask || state.activeSourceTask.ticker !== next.company.ticker || state.activeSourceTask.requirementKey !== next.requirement.key) {
        loadSourceTaskIntoBuilder(next.company.ticker, next.requirement.key);
      }
      markActiveSourceTaskStage("collected");
      flashGuidedSourceResult("Official source opened. Search the company, copy the exact document text, then return to paste it.", "neutral");
    });
  });
}

function makeGuidedSourceCollector() {
  const items = buildSourceQueueItems();
  const nextTask = getGuidedSourceTask(items);
  const counts = countSourceQueueStatuses(items);
  const total = items.length || 1;
  const starterItems = items.filter((item) => STARTER_PACK_TICKERS.includes(item.company.ticker));
  const starterReal = starterItems.filter((item) => item.statusKey === "real").length;
  const priorityOpen = items.filter((item) => item.statusKey === "missing" || item.statusKey === "synthetic").length;
  const activeMatches = nextTask && state.activeSourceTask && state.activeSourceTask.ticker === nextTask.company.ticker && state.activeSourceTask.requirementKey === nextTask.requirement.key;
  const intake = makeSourceIntakeAudit();
  const builderLabel = activeMatches
    ? `${intake.score}% intake`
    : state.activeSourceTask
      ? `${state.activeSourceTask.ticker} active`
      : "Not loaded yet";
  const checks = nextTask ? makeGuidedSourceChecks(nextTask, Boolean(activeMatches), intake) : [];
  const statusLabel = priorityOpen ? "Source work open" : counts.imported ? "Review imports" : "Sources ready";
  const priorityLabel = nextTask
    ? nextTask.statusKey === "missing"
      ? "Highest gap"
      : nextTask.statusKey === "synthetic"
        ? "Replace SYN"
        : nextTask.statusKey === "imported"
          ? "Upgrade IMP"
          : "Ready"
    : "Complete";

  return {
    nextTask,
    statusLabel,
    priorityLabel,
    builderLabel,
    checklistTitle: activeMatches ? "Follow these steps in the form below." : "Load the task to start guided capture.",
    metrics: [
      {
        label: "REAL coverage",
        value: `${counts.real}/${total}`,
        detail: `${Math.round((counts.real / total) * 100)}% of required source slots are REAL.`
      },
      {
        label: "Starter pack",
        value: `${starterReal}/${starterItems.length || STARTER_PACK_TICKERS.length * REAL_SOURCE_REQUIREMENTS.length}`,
        detail: "RELIANCE, TCS, and HDFCBANK remain the first launch-quality targets."
      },
      {
        label: "Open priority",
        value: String(priorityOpen),
        detail: "Missing and synthetic slots should be replaced before public investment-use pilots."
      },
      {
        label: "Current intake",
        value: activeMatches ? `${intake.score}%` : "Idle",
        detail: activeMatches ? intake.statusLabel : "Load the guided task to score pasted source text."
      }
    ],
    checks
  };
}

function getGuidedSourceTask(items = buildSourceQueueItems()) {
  if (state.activeSourceTask && state.activeSourceTask.requirementKey) {
    const active = items.find((item) => item.company.ticker === state.activeSourceTask.ticker && item.requirement.key === state.activeSourceTask.requirementKey);
    if (active && active.statusKey !== "real") return active;
  }
  return prioritizeGuidedSourceItems(items).find((item) => item.statusKey !== "real") || items[0] || null;
}

function prioritizeGuidedSourceItems(items) {
  const statusRank = { missing: 0, synthetic: 1, imported: 2, real: 9 };
  const requirementRank = { results: 0, "annual-report": 1, concall: 2, shareholding: 3, announcement: 4 };
  return [...items].sort((a, b) => {
    const statusDelta = (statusRank[a.statusKey] ?? 5) - (statusRank[b.statusKey] ?? 5);
    if (statusDelta) return statusDelta;
    const aStarter = STARTER_PACK_TICKERS.includes(a.company.ticker) ? STARTER_PACK_TICKERS.indexOf(a.company.ticker) : 20;
    const bStarter = STARTER_PACK_TICKERS.includes(b.company.ticker) ? STARTER_PACK_TICKERS.indexOf(b.company.ticker) : 20;
    if (aStarter !== bStarter) return aStarter - bStarter;
    return (requirementRank[a.requirement.key] ?? 8) - (requirementRank[b.requirement.key] ?? 8);
  });
}

function makeGuidedSourceChecks(task, activeMatches, intake) {
  const sourceUrl = normalizeExternalUrl(els.sourceBuilderUrl ? els.sourceBuilderUrl.value : "");
  const hasPaste = els.sourceAssistantText ? els.sourceAssistantText.value.replace(/\s+/g, "").length >= 120 : false;
  const hasSections = els.sourceBuilderSections
    ? Array.from(els.sourceBuilderSections.querySelectorAll("textarea")).some((textarea) => textarea.value.replace(/\s+/g, "").length >= 120)
    : false;
  const confidence = getSourceConfidenceChecks();
  return [
    {
      label: "Load the task",
      done: activeMatches,
      detail: activeMatches ? `${task.company.ticker} ${task.requirement.label} is active in Source Pack Studio.` : "Click Load next source task to set company, type, period, and title."
    },
    {
      label: "Open official source",
      done: activeMatches && Boolean(sourceUrl),
      detail: sourceUrl ? "Source URL is filled in the builder." : "Use official links from the card or the helper below."
    },
    {
      label: "Paste source text",
      done: activeMatches && hasPaste,
      detail: hasPaste ? "Raw source text is pasted for detection." : "Paste only useful citation sections from the document."
    },
    {
      label: "Detect and review",
      done: activeMatches && hasSections,
      detail: hasSections ? "Builder sections contain citation-ready text." : "Click Detect and fill builder after pasting text."
    },
    {
      label: "Pass intake gate",
      done: activeMatches && intake.score >= 80 && !intake.blockers.length,
      detail: activeMatches ? `${intake.statusLabel} at ${intake.score}%.` : "The Source Intake Doctor will score this after the task is loaded."
    },
    {
      label: "Confirm REAL save",
      done: activeMatches && confidence.ready,
      detail: confidence.ready ? "All REAL confidence checks are confirmed." : "Tick URL, same-document text, and period/date checks before Add to live corpus."
    }
  ];
}

function loadGuidedSourceTask() {
  const task = getGuidedSourceTask();
  if (!task) {
    flashGuidedSourceResult("No source task is open right now.", "success");
    return;
  }
  loadSourceTaskIntoBuilder(task.company.ticker, task.requirement.key);
  renderGuidedSourceCollector();
  flashGuidedSourceResult(`${task.company.ticker} ${task.requirement.label} loaded below. Start with the official links, then paste source text.`, "success");
}

function openGuidedSourceLinks() {
  const task = getGuidedSourceTask();
  if (!task) {
    flashGuidedSourceResult("No source task is open right now.", "success");
    return;
  }
  openSourceTaskInHub(task.company.ticker, task.requirement.key);
  flashGuidedSourceResult(`${task.company.ticker} ${task.requirement.label} links opened in the Acquisition Hub.`, "neutral");
}

async function copyGuidedSourceBrief() {
  const task = getGuidedSourceTask();
  if (!task) {
    flashGuidedSourceResult("No source task is open right now.", "success");
    return;
  }
  const copied = await copyTextToClipboard(makeGuidedSourceBrief(task));
  flashGuidedSourceResult(copied ? "Guided source brief copied." : "Clipboard blocked. Use Export source brief instead.", copied ? "success" : "error");
}

function exportGuidedSourceBrief() {
  const task = getGuidedSourceTask();
  if (!task) {
    flashGuidedSourceResult("No source task is open right now.", "success");
    return;
  }
  const date = new Date().toISOString().slice(0, 10);
  const filename = `niveshscope-guided-source-task-v47-${task.company.ticker.toLowerCase()}-${task.requirement.key}-${date}.md`;
  downloadTextFile(filename, makeGuidedSourceBrief(task), "text/markdown;charset=utf-8");
  flashGuidedSourceResult("Guided source brief exported.", "success");
}

function makeGuidedSourceBrief(task = getGuidedSourceTask()) {
  if (!task) return "";
  const links = sourceLinksForTask(task).map((link) => `- ${link.label}: ${link.url}`).join("\n");
  const sections = getSourceSectionTemplates(task.requirement.type).map((section) => `- ${section}`).join("\n");
  return [
    `# NiveshScope Guided Source Task - ${task.company.ticker} ${task.requirement.label}`,
    "",
    `Company: ${task.company.name}`,
    `Ticker: ${task.company.ticker}`,
    `Current evidence: ${task.currentEvidence}`,
    `Target quality: REAL - verified source`,
    "",
    "Why this source matters:",
    task.requirement.instruction,
    "",
    "Official links:",
    links,
    "",
    "Paste these sections into Source Pack Studio:",
    sections,
    "",
    "REAL save checklist:",
    "- Official HTTPS source URL is captured.",
    "- Pasted text is from the same document.",
    "- Period, date, title, and company match the source.",
    "- Source Intake Doctor has no high-priority blockers."
  ].join("\n");
}

function flashGuidedSourceResult(message, tone = "neutral") {
  if (!els.guidedSourceResult) return;
  els.guidedSourceResult.className = `builder-result is-${tone}`;
  els.guidedSourceResult.textContent = message;
}

function makeSourceIntakeAudit() {
  const ticker = normalizeTicker(els.sourceBuilderTicker?.value || state.selectedTicker || "CUSTOM");
  const company = getCompany(ticker);
  const sourceType = els.sourceBuilderType?.value || "Research note";
  const status = normalizeSourceStatus(els.sourceBuilderStatus?.value || "real");
  const rawUrl = (els.sourceBuilderUrl?.value || "").trim();
  const sourceUrl = normalizeExternalUrl(rawUrl);
  const urlHost = sourceUrl ? new URL(sourceUrl).hostname : "";
  const title = (els.sourceBuilderTitleInput?.value || "").trim();
  const period = (els.sourceBuilderPeriod?.value || "").trim();
  const date = (els.sourceBuilderDate?.value || "").trim();
  const sampleMode = els.sourceAssistantText?.dataset.sample === "true";
  const rawPaste = (els.sourceAssistantText?.value || "").trim();
  const sections = getBuilderSectionDrafts();
  const readySections = sections.filter((section) => section.text.replace(/\s+/g, " ").trim().length >= 120);
  const totalWords = countWords([rawPaste, ...sections.map((section) => section.text)].join(" "));
  const combinedText = [rawPaste, ...sections.map((section) => section.text)].join(" ");
  const confidence = getSourceConfidenceChecks();
  const textMentionsCompany = sourceTextMentionsCompany(combinedText, company, ticker);
  const checks = [
    {
      label: "Company match",
      passed: Boolean(company && textMentionsCompany),
      severity: "Medium",
      weight: 12,
      detail: company
        ? textMentionsCompany
          ? `${company.ticker} appears aligned with the pasted source text.`
          : `Selected company is ${company.ticker}, but the pasted text does not clearly mention it.`
        : "Select a covered company before creating a source record."
    },
    {
      label: "Source URL",
      passed: status !== "real" ? !rawUrl || Boolean(sourceUrl) : Boolean(sourceUrl && isHttpsUrl(sourceUrl)),
      severity: "High",
      weight: 18,
      detail: status === "real"
        ? sourceUrl && isHttpsUrl(sourceUrl)
          ? `REAL source URL is valid HTTPS. ${sourceUrlTrustNote(sourceUrl)}`
          : "REAL records require a valid HTTPS source URL."
        : rawUrl && !sourceUrl
          ? "Draft URL is not valid. Fix it or leave it blank."
          : "IMP/SYN drafts can be saved without an official URL."
    },
    {
      label: "Official host review",
      passed: !sourceUrl || isTrustedSourceUrl(sourceUrl),
      severity: "Medium",
      weight: 10,
      detail: sourceUrl
        ? isTrustedSourceUrl(sourceUrl)
          ? `${urlHost} is on the trusted source-domain list.`
          : `${urlHost} is not on the trusted list. Verify it manually before marking REAL.`
        : "No source host to review yet."
    },
    {
      label: "Citation depth",
      passed: readySections.length >= 2 && totalWords >= 80,
      severity: "High",
      weight: 20,
      detail: `${readySections.length} citation section${readySections.length === 1 ? "" : "s"} are long enough. Target at least 2 with useful source text.`
    },
    {
      label: "Period and date",
      passed: Boolean(period && date && title),
      severity: "Medium",
      weight: 14,
      detail: period && date && title ? `${period} dated ${date} with a record title.` : "Add period, date, and record title before shipping."
    },
    {
      label: "Training sample guard",
      passed: !(sampleMode && status === "real"),
      severity: "High",
      weight: 14,
      detail: sampleMode ? "Training samples must remain IMP review, not REAL evidence." : "No training-sample flag detected."
    },
    {
      label: "REAL confidence checks",
      passed: status !== "real" || confidence.ready,
      severity: "High",
      weight: 12,
      detail: status === "real" ? confidence.message : "REAL confirmation checklist is not required for IMP/SYN drafts."
    }
  ];
  const maxScore = checks.reduce((sum, check) => sum + check.weight, 0) || 1;
  const score = Math.round((checks.reduce((sum, check) => sum + (check.passed ? check.weight : 0), 0) / maxScore) * 100);
  const blockers = checks.filter((check) => !check.passed && check.severity === "High");
  const warnings = checks.filter((check) => !check.passed && check.severity !== "High");
  const statusLabel = blockers.length
    ? "Not ready for live corpus"
    : warnings.length
      ? "Review before adding"
      : "Ready to add";
  const statusClass = blockers.length ? "is-blocked" : warnings.length ? "is-review" : "is-ready";
  const hasAnyInput = Boolean(rawPaste || rawUrl || sections.some((section) => section.text.trim()));
  return {
    ticker,
    company,
    companyLabel: company ? `${company.ticker} - ${company.name}` : ticker,
    sourceType,
    status,
    rawUrl,
    sourceUrl,
    urlHost,
    urlLabel: sourceUrl ? (isHttpsUrl(sourceUrl) ? "HTTPS" : "HTTP") : "Missing",
    qualityLabel: status.toUpperCase(),
    periodLabel: period || "No period",
    title,
    period,
    date,
    sampleMode,
    rawPaste,
    sections,
    readySections: readySections.length,
    totalSections: sections.length,
    totalWords,
    checks,
    blockers,
    warnings,
    score,
    statusLabel,
    statusClass,
    hasAnyInput,
    summary: blockers.length
      ? `${blockers.length} high-priority issue${blockers.length === 1 ? "" : "s"} should be fixed before adding this source.`
      : warnings.length
        ? `${warnings.length} review warning${warnings.length === 1 ? "" : "s"} remains before this source is clean.`
        : "Source fields, citation text, and REAL confidence checks look ready."
  };
}

function getBuilderSectionDrafts() {
  if (!els.sourceBuilderSections) return [];
  return Array.from(els.sourceBuilderSections.querySelectorAll("textarea")).map((textarea) => ({
    title: textarea.dataset.sectionTitle || textarea.previousElementSibling?.textContent || "Source section",
    text: textarea.value.replace(/\s+/g, " ").trim()
  })).filter((section) => section.text.length || section.title);
}

function sourceTextMentionsCompany(text, company, ticker) {
  const haystack = String(text || "").toLowerCase();
  if (!haystack.trim()) return false;
  if (ticker && haystack.includes(String(ticker).toLowerCase())) return true;
  if (company && haystack.includes(company.name.toLowerCase())) return true;
  if (!company) return false;
  return company.name.toLowerCase().split(/\s+/).filter((word) => word.length > 4).some((word) => haystack.includes(word));
}

function countWords(text) {
  return (String(text || "").match(/\b[a-zA-Z0-9][a-zA-Z0-9./-]*\b/g) || []).length;
}

async function copySourceCitationNote() {
  const audit = makeSourceIntakeAudit();
  if (!audit.hasAnyInput) {
    flashSourceAssistantResult("Add source text or a URL before copying a citation note.", "error");
    return;
  }
  const copied = await copyTextToClipboard(makeSourceCitationNote(audit));
  flashSourceAssistantResult(copied ? "Citation note copied." : "Clipboard blocked. Use the visible source fields as fallback.", copied ? "success" : "error");
}

function makeSourceCitationNote(audit) {
  const checks = audit.checks.map((check) => `- ${check.passed ? "OK" : check.severity}: ${check.label} - ${check.detail}`).join("\n");
  const sections = audit.sections
    .filter((section) => section.text.trim())
    .map((section) => `### ${section.title}\n${snippetLong(section.text, 700)}`)
    .join("\n\n") || "No citation sections pasted yet.";
  return [
    "# NiveshScope Source Intake Note",
    "",
    `Generated: ${new Date().toLocaleString()}`,
    `Company: ${audit.companyLabel}`,
    `Source type: ${audit.sourceType}`,
    `Quality: ${audit.qualityLabel}`,
    `Period: ${audit.period || "Missing"}`,
    `Date: ${audit.date || "Missing"}`,
    `Source URL: ${audit.sourceUrl || "Missing"}`,
    `Intake doctor: ${audit.statusLabel} (${audit.score}%)`,
    "",
    "## Checks",
    checks,
    "",
    "## Citation Sections",
    sections,
    "",
    "_Verify official source URL, exact document identity, and period/date before treating this as REAL evidence._"
  ].join("\n");
}

function makeBuilderReadinessImpact(ticker, requirement, status) {
  const safeRequirement = requirement || REAL_SOURCE_REQUIREMENTS[0];
  const docs = getCompanyDocs(ticker);
  const checklist = makeRealDataChecklist(docs);
  const beforeCompleteness = makeRealSourceCompleteness(checklist);
  const currentItem = checklist.find((item) => item.key === safeRequirement.key) || checklist[0];
  const afterStatus = status === "real" ? "REAL ready" : status === "imported" ? "IMP review" : "SYN starter";
  const companyReadyBefore = beforeCompleteness.percent === 100
    ? `${REAL_SOURCE_REQUIREMENTS.length}/${REAL_SOURCE_REQUIREMENTS.length}`
    : `${checklist.filter((item) => item.statusKey === "real").length}/${REAL_SOURCE_REQUIREMENTS.length}`;
  const realDelta = currentItem && currentItem.statusKey !== "real" && status === "real" ? 1 : 0;
  const companyReadyAfter = `${Math.min(REAL_SOURCE_REQUIREMENTS.length, checklist.filter((item) => item.statusKey === "real").length + realDelta)}/${REAL_SOURCE_REQUIREMENTS.length}`;
  const packImpact = STARTER_PACK_TICKERS.includes(ticker) && realDelta
    ? "Starter pack REAL count will increase by 1."
    : STARTER_PACK_TICKERS.includes(ticker)
      ? "Starter pack readiness will not increase until this is marked REAL."
    : "This company is outside the current starter pack.";
  return {
    requirementLabel: safeRequirement.label,
    beforeStatus: currentItem ? currentItem.status : "Needed",
    afterStatus,
    companyReadyBefore,
    companyReadyAfter,
    packImpact
  };
}

function getSourceConfidenceChecks() {
  const checks = els.sourceConfidenceChecklist
    ? Array.from(els.sourceConfidenceChecklist.querySelectorAll("input[type='checkbox']"))
    : [];
  const count = checks.filter((input) => input.checked).length;
  const missing = checks
    .filter((input) => !input.checked)
    .map((input) => input.parentElement ? input.parentElement.textContent.trim() : "verification check");
  return {
    count,
    total: checks.length,
    ready: checks.length > 0 && count === checks.length,
    message: missing.length ? `Missing: ${missing.join(", ")}.` : "All REAL source checks are confirmed."
  };
}

function isSourceConfidenceReady() {
  return getSourceConfidenceChecks().ready;
}

function resetSourceConfidenceChecks() {
  if (!els.sourceConfidenceChecklist) return;
  els.sourceConfidenceChecklist.querySelectorAll("input[type='checkbox']").forEach((input) => {
    input.checked = false;
  });
}

function normalizeSourceAssistantText(text) {
  return String(text || "")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function detectAssistantTicker(text) {
  const haystack = text.toLowerCase();
  const selected = normalizeTicker(els.sourceBuilderTicker ? els.sourceBuilderTicker.value : state.selectedTicker);
  const found = getCompanies().find((company) => {
    const nameWords = company.name.toLowerCase().split(/\s+/).filter((word) => word.length > 4);
    return haystack.includes(company.ticker.toLowerCase()) || haystack.includes(company.name.toLowerCase()) || nameWords.some((word) => haystack.includes(word));
  });
  return found ? found.ticker : selected || "CUSTOM";
}

function detectAssistantSourceType(text) {
  const lower = text.toLowerCase();
  if (/shareholding|promoter holding|pledge|public shareholding|institutional ownership/.test(lower)) return "Shareholding pattern";
  if (/exchange announcement|corporate announcement|regulation 30|nse|bse|order win|rating action|press release/.test(lower)) return "Exchange announcement";
  if (/analyst q&a|question-and-answer|earnings call|conference call|concall|transcript|prepared remarks/.test(lower)) return "Concall transcript";
  if (/quarterly results|results summary|quarter ended|segment revenue|ebitda|profit after tax|financial results/.test(lower)) return "Quarterly results";
  if (/credit rating|rating rationale|credit strengths|credit risks/.test(lower)) return "Credit rating note";
  if (/valuation|dcf|terminal multiple|scenario|sensitivity/.test(lower)) return "Valuation model";
  if (/annual report|board's report|management discussion|mda|md&a|risk factors|liquidity and capital resources/.test(lower)) return "Annual report";
  return els.sourceBuilderType ? els.sourceBuilderType.value || "Research note" : "Research note";
}

function detectAssistantPeriod(text, type) {
  const clean = text.replace(/\s+/g, " ");
  const quarter = clean.match(/\bQ[1-4]\s*(?:FY|FY\s*)?20\d{2}\b/i);
  if (quarter) return quarter[0].replace(/\s+/g, " ").toUpperCase();
  const quarterEnded = clean.match(/\bquarter ended\s+([A-Za-z]+\s+\d{1,2},?\s+20\d{2}|[A-Za-z]+\s+20\d{2}|20\d{2})/i);
  if (quarterEnded) return `Quarter ended ${quarterEnded[1]}`;
  const fy = clean.match(/\bFY\s?20\d{2}\b/i) || clean.match(/\b20\d{2}\s?-\s?\d{2}\b/);
  if (fy) return fy[0].replace(/\s+/g, "").replace("-", "-").toUpperCase().replace(/^20(\d{2})-(\d{2})$/, "FY20$1-$2");
  if (/quarter|results|concall/i.test(type)) return "Q4 FY2025";
  return "FY2025";
}

function makeAssistantSections(text, type) {
  const templates = getSourceSectionTemplates(type);
  const sectionized = sectionizeImportedText(text);
  const sourceSections = sectionized.length ? sectionized : splitSourceTextIntoSections(text, templates.length);
  return templates.map((title, index) => {
    const matched = findBestAssistantSection(title, sourceSections);
    const fallback = sourceSections[index] || sourceSections[0] || { text };
    return {
      title,
      text: snippetLong((matched || fallback).text, index === 0 ? 1200 : 950)
    };
  }).filter((section) => section.text.replace(/\s+/g, "").length > 30);
}

function findBestAssistantSection(title, sections) {
  const keywords = assistantSectionKeywords(title);
  let best = null;
  let bestScore = 0;
  for (const section of sections) {
    const haystack = `${section.title || ""} ${section.text || ""}`.toLowerCase();
    const score = keywords.reduce((sum, word) => sum + (haystack.includes(word) ? 1 : 0), 0);
    if (score > bestScore) {
      best = section;
      bestScore = score;
    }
  }
  return bestScore ? best : null;
}

function assistantSectionKeywords(title) {
  const lower = title.toLowerCase();
  if (/business/.test(lower)) return ["business", "overview", "segment", "revenue", "operations"];
  if (/discussion|analysis|commentary|prepared/.test(lower)) return ["management", "discussion", "analysis", "commentary", "outlook", "prepared"];
  if (/risk/.test(lower)) return ["risk", "uncertain", "volatility", "competition", "regulatory", "inflation"];
  if (/liquidity|capital|cash/.test(lower)) return ["liquidity", "capital", "cash", "debt", "borrowings", "capex"];
  if (/q&a|tone/.test(lower)) return ["question", "answer", "analyst", "management", "expects", "guidance"];
  if (/results|segment/.test(lower)) return ["results", "revenue", "margin", "profit", "segment", "ebitda"];
  if (/shareholding|promoter|pledge|institutional/.test(lower)) return ["shareholding", "promoter", "pledge", "institutional", "public"];
  if (/announcement|rationale|impact/.test(lower)) return ["announcement", "order", "approval", "transaction", "rationale", "impact"];
  return ["source", "summary", "evidence", "watch"];
}

function splitSourceTextIntoSections(text, count) {
  const sentences = text.replace(/\n+/g, " ").match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  const sections = [];
  const target = Math.max(450, Math.ceil(text.length / Math.max(count, 1)));
  let buffer = [];
  for (const sentence of sentences) {
    buffer.push(sentence.trim());
    if (buffer.join(" ").length >= target && sections.length < count - 1) {
      sections.push({ title: `Detected section ${sections.length + 1}`, text: buffer.join(" ") });
      buffer = [];
    }
  }
  if (buffer.length) sections.push({ title: `Detected section ${sections.length + 1}`, text: buffer.join(" ") });
  return sections;
}

function fillSourceBuilderSections(sections) {
  const textareas = Array.from(els.sourceBuilderSections.querySelectorAll("textarea"));
  sections.forEach((section, index) => {
    if (!textareas[index]) return;
    textareas[index].dataset.sectionTitle = section.title;
    textareas[index].previousElementSibling.textContent = section.title;
    textareas[index].value = section.text;
  });
  renderFilingCapturePreview();
  renderSourceIntakeDoctor();
}

function snippetLong(text, maxLength) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).replace(/\s+\S*$/, "")}.`;
}

function flashSourceAssistantResult(message, tone = "neutral") {
  if (!els.sourceAssistantResult) return;
  els.sourceAssistantResult.className = `builder-result is-${tone}`;
  els.sourceAssistantResult.textContent = message;
}

function normalizeExternalUrl(value) {
  const raw = String(value || "").trim();
  if (!raw || raw.length > MAX_SOURCE_URL_LENGTH) return "";
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    url.hash = url.hash.slice(0, 180);
    return url.href;
  } catch (error) {
    return "";
  }
}

function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === "https:";
  } catch (error) {
    return false;
  }
}

function isTrustedSourceUrl(value) {
  try {
    const host = new URL(value).hostname.toLowerCase();
    return TRUSTED_SOURCE_DOMAINS.some((domain) => host === domain || host.endsWith(`.${domain}`));
  } catch (error) {
    return false;
  }
}

function sourceUrlTrustNote(value) {
  if (!value) return "";
  return isTrustedSourceUrl(value)
    ? "Official source URL captured."
    : "URL captured. Verify this host before shipping as REAL evidence.";
}

function renderSourceAssistantLinks() {
  if (!els.sourceAssistantLinks) return;
  const ticker = normalizeTicker(els.sourceBuilderTicker ? els.sourceBuilderTicker.value : state.selectedTicker);
  const company = getCompany(ticker);
  const requirement = getBuilderRequirement();
  if (!company || !requirement) {
    els.sourceAssistantLinks.innerHTML = `
      <div class="source-url-helper-empty">Select a company and source type to see official collection links.</div>
    `;
    return;
  }
  const item = {
    company,
    requirement,
    statusLabel: "URL helper",
    currentEvidence: "Builder source URL"
  };
  const links = sourceLinksForTask(item)
    .map((link) => ({ ...link, url: normalizeExternalUrl(link.url) }))
    .filter((link) => link.url)
    .slice(0, 5);
  els.sourceAssistantLinks.innerHTML = `
    <div class="source-url-helper-head">
      <div>
        <span>Official Source URL Helper</span>
        <strong>${escapeHtml(company.ticker)} ${escapeHtml(requirement.label)} links</strong>
      </div>
      <button type="button" data-open-hub-from-helper="${escapeAttr(company.ticker)}" data-open-hub-key="${escapeAttr(requirement.key)}">Open hub</button>
    </div>
    <div class="source-collection-guide">
      <strong>Beginner flow for ${escapeHtml(company.ticker)} ${escapeHtml(requirement.label)}</strong>
      <ol>
        <li>Click <b>Open source site</b> for NSE, BSE, or Company IR.</li>
        <li>Search the company, open the latest matching document, and copy useful text.</li>
        <li>Return here, click <b>Fill URL</b>, paste the text above, then click <b>Detect and fill builder</b>.</li>
      </ol>
    </div>
    <div class="source-url-helper-list">
      ${links.map((link) => `
        <article>
          <div class="source-url-copy">
            <span>${escapeHtml(link.label)}</span>
            <strong>${escapeHtml(link.note)}</strong>
          </div>
          <div class="source-url-actions">
            <a href="${escapeAttr(link.url)}" target="_blank" rel="noopener noreferrer" data-open-source-url="${escapeAttr(link.url)}">Open source site</a>
            <button type="button" data-use-source-url="${escapeAttr(link.url)}">Fill URL</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;
  els.sourceAssistantLinks.querySelectorAll("a[data-open-source-url]").forEach((link) => {
    link.addEventListener("click", () => {
      markActiveSourceTaskStage("collected");
      flashSourceAssistantResult("Source site opened. Search the company, open the latest matching document, then copy citation text back here.", "neutral");
    });
  });
  els.sourceAssistantLinks.querySelectorAll("button[data-use-source-url]").forEach((button) => {
    button.addEventListener("click", () => {
      const url = normalizeExternalUrl(button.dataset.useSourceUrl || "");
      if (!url) {
        flashSourceAssistantResult("That helper link is not a valid http/https URL.", "error");
        return;
      }
      els.sourceBuilderUrl.value = url;
      markActiveSourceTaskStage("collected");
      renderActiveSourceTask();
      renderFilingCapturePreview();
      renderSourceIntakeDoctor();
      renderSourceCitationExtractor();
      renderSourceReviewGate();
      renderGuidedSourceCollector();
      flashSourceAssistantResult(`Source URL filled. Now paste source text above and click Detect and fill builder. ${sourceUrlTrustNote(url)}`, "success");
    });
  });
  const hubButton = els.sourceAssistantLinks.querySelector("button[data-open-hub-from-helper]");
  if (hubButton) {
    hubButton.addEventListener("click", () => {
      openSourceTaskInHub(hubButton.dataset.openHubFromHelper, hubButton.dataset.openHubKey);
    });
  }
}

function getBuilderRequirement() {
  const type = els.sourceBuilderType ? els.sourceBuilderType.value : "";
  if (state.activeSourceTask && state.activeSourceTask.requirementKey) {
    const active = REAL_SOURCE_REQUIREMENTS.find((item) => item.key === state.activeSourceTask.requirementKey);
    if (active && active.type === type) return active;
  }
  return REAL_SOURCE_REQUIREMENTS.find((item) => item.type === type)
    || REAL_SOURCE_REQUIREMENTS.find((item) => item.pattern.test(type))
    || REAL_SOURCE_REQUIREMENTS[0];
}

function addSourcePackDocFromBuilder() {
  const doc = makeSourcePackDocFromBuilder();
  if (!doc) return;
  state.sourcePackDocs = [doc, ...state.sourcePackDocs].slice(0, 40);
  state.selectedTicker = doc.ticker;
  state.activeTickers.add(doc.ticker);
  saveJson(STORAGE_KEYS.sourcePack, state.sourcePackDocs);
  rebuildDocumentCorpus();
  updateProgressFromSourceDoc(doc);
  renderSourcePackList();
  renderSourceMatrixOptions();
  renderSourceMatrix();
  renderRealSourceStarterPack();
  renderBriefWorkbench();
  renderInvestmentGate();
  renderMemoReviewRoom();
  renderDecisionJournal();
  renderReviewRadar();
  renderPortfolioWatchtower();
  renderCatalystCalendar();
  renderDailyBriefing();
  renderDeskTaskBoard();
  renderResearchSprintPlanner();
  renderIcMemoBuilder();
  renderClaimTraceInspector();
      renderAnswerQualityLab();
  renderLaunchControlRoom();
  resetSourceConfidenceChecks();
  renderFilingCapturePreview();
  renderSourceIntakeDoctor();
  renderSourceCitationExtractor();
  renderSourceReviewGate();
  renderGuidedSourceCollector();
  state.importReport = makeImportReport([doc], []);
  renderImportSummary();
  flashBuilderResult(`${doc.ticker} ${doc.type} added as ${shortSourceStatus(doc)} evidence and enabled in the live corpus. Use Return to dossier to confirm completeness.`, "success");
  renderActiveSourceTask({
    ticker: doc.ticker,
    label: shortDocType(doc.type),
    status: "Saved to live corpus",
    instruction: "Return to the dossier to confirm completeness, or export documents JSON when this source is ready to ship."
  });
}

function makeSourcePackDocFromBuilder() {
  const ticker = normalizeTicker(els.sourceBuilderTicker.value || state.selectedTicker || "CUSTOM");
  const company = getCompany(ticker);
  const type = els.sourceBuilderType.value || "Research note";
  const period = (els.sourceBuilderPeriod.value || "Current period").trim();
  const date = els.sourceBuilderDate.value || new Date().toISOString().slice(0, 10);
  const status = normalizeSourceStatus(els.sourceBuilderStatus.value || "real");
  const title = (els.sourceBuilderTitleInput.value || `${ticker} ${type}`).trim();
  const rawSourceUrl = (els.sourceBuilderUrl.value || "").trim();
  const sourceUrl = normalizeExternalUrl(rawSourceUrl);
  const sections = Array.from(els.sourceBuilderSections.querySelectorAll("textarea"))
    .map((textarea) => ({
      title: textarea.dataset.sectionTitle || "Source section",
      text: textarea.value.replace(/\s+/g, " ").trim()
    }))
    .filter((section) => section.text.length > 30);

  if (rawSourceUrl && !sourceUrl) {
    if (els.sourceBuilderUrl) els.sourceBuilderUrl.focus();
    flashBuilderResult("Use a valid http/https Source URL under 2048 characters, or leave the field blank for non-REAL draft records.", "error");
    return null;
  }

  if (status === "real" && !sourceUrl) {
    if (els.sourceBuilderUrl) els.sourceBuilderUrl.focus();
    flashBuilderResult("REAL records need an official https Source URL before they can enter the live corpus.", "error");
    return null;
  }

  if (status === "real" && !isHttpsUrl(sourceUrl)) {
    if (els.sourceBuilderUrl) els.sourceBuilderUrl.focus();
    flashBuilderResult("REAL records must use an https Source URL. Use imported or synthetic quality for offline drafts.", "error");
    return null;
  }

  if (status === "real" && !isSourceConfidenceReady()) {
    flashBuilderResult("Confirm all three REAL source checks before adding verified evidence.", "error");
    if (els.sourceConfidenceChecklist) els.sourceConfidenceChecklist.scrollIntoView({ behavior: "smooth", block: "center" });
    return null;
  }

  if (!sections.length) {
    const firstTextarea = els.sourceBuilderSections.querySelector("textarea");
    if (firstTextarea) firstTextarea.focus();
    flashBuilderResult("Paste at least one source section with enough text before adding it.", "error");
    return null;
  }

  const intakeAudit = makeSourceIntakeAudit();
  if (status === "real" && intakeAudit.blockers.length) {
    renderSourceIntakeDoctor({ focus: true });
    flashBuilderResult(`Source Intake Doctor blocked REAL save: ${intakeAudit.blockers[0].label}.`, "error");
    return null;
  }

  const reviewGate = makeSourceReviewGate();
  if (status === "real" && reviewGate.blockers.length) {
    renderSourceReviewGate({ focus: true });
    flashBuilderResult(`Source Review Gate blocked REAL save: ${reviewGate.blockers[0].label}.`, "error");
    return null;
  }

  return normalizeDocumentRecord({
    id: makeSourceRecordId(ticker, type, period, date),
    ticker,
    company: company ? company.name : `${ticker} source pack`,
    type,
    period,
    date,
    sourceStatus: status,
    sourceLabel: sourceStatusLabel({ sourceStatus: status }),
    sourceUrl,
    title,
    sections
  }, status);
}

function makeSourceRecordId(ticker, type, period, date) {
  const slug = `${ticker}-${type}-${period}-${date}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 84);
  return `source-${slug}-${Date.now().toString(36)}`;
}

function renderSourcePackList() {
  if (!els.sourcePackList) return;
  if (els.sourcePackCount) {
    els.sourcePackCount.textContent = `${state.sourcePackDocs.length} record${state.sourcePackDocs.length === 1 ? "" : "s"}`;
  }
  renderExportReadiness();
  if (!state.sourcePackDocs.length) {
    els.sourcePackList.innerHTML = `<div class="empty-list">Verified source records you build here will appear in this pack.</div>`;
    return;
  }
  els.sourcePackList.innerHTML = state.sourcePackDocs.map((doc) => `
    <article class="source-pack-item">
      <div>
        <span class="source-badge ${sourceStatusClass(doc)}">${escapeHtml(shortSourceStatus(doc))}</span>
        <strong>${escapeHtml(doc.ticker)} - ${escapeHtml(doc.type)}</strong>
        <p>${escapeHtml(doc.period)} - ${escapeHtml(doc.date)} - ${doc.sections.length} section${doc.sections.length === 1 ? "" : "s"}</p>
      </div>
      <button type="button" data-source-doc-id="${escapeAttr(doc.id)}" aria-label="Load source record">Load</button>
    </article>
  `).join("");
  els.sourcePackList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const doc = state.sourcePackDocs.find((item) => item.id === button.dataset.sourceDocId);
      if (!doc) return;
      state.selectedTicker = doc.ticker;
      renderSourceBuilderTickerOptions();
      els.sourceBuilderType.value = doc.type;
      els.sourceBuilderStatus.value = normalizeSourceStatus(doc.sourceStatus);
      els.sourceBuilderPeriod.value = doc.period;
      els.sourceBuilderDate.value = doc.date;
      els.sourceBuilderUrl.value = doc.sourceUrl || "";
      els.sourceBuilderTitleInput.value = doc.title || `${doc.ticker} ${doc.type}`;
      renderSourceBuilderSections();
      const textareas = Array.from(els.sourceBuilderSections.querySelectorAll("textarea"));
      doc.sections.forEach((section, index) => {
        if (textareas[index]) {
          textareas[index].dataset.sectionTitle = section.title;
          textareas[index].previousElementSibling.textContent = section.title;
          textareas[index].value = section.text;
        }
      });
      renderFilingCapturePreview();
      renderSourceIntakeDoctor();
      renderSourceCitationExtractor();
      renderSourceReviewGate();
      renderGuidedSourceCollector();
      flashBuilderResult(`${doc.ticker} source record loaded into the builder.`, "neutral");
    });
  });
}

function renderExportReadiness() {
  if (!els.exportReadiness) return;
  const docs = state.sourcePackDocs;
  const uploadTarget = "data/documents.json";
  if (!docs.length) {
    els.exportReadiness.innerHTML = `
      <div class="export-status is-empty">
        <span>Export readiness</span>
        <strong>No builder records yet</strong>
        <p>Use Replace with REAL, Upgrade next source, or paste a verified source below. The export checklist will update as records are added.</p>
      </div>
      <div class="export-path">
        <span>GitHub target</span>
        <code>${escapeHtml(uploadTarget)}</code>
      </div>
    `;
    return;
  }

  const summary = makeExportReadinessSummary(docs);
  const statusClass = summary.ready ? "is-ready" : "is-review";
  const statusTitle = summary.ready ? "Ready to export full documents.json" : "Review before shipping";
  const statusText = summary.ready
    ? `Builder pack has ${summary.realCount} REAL record${summary.realCount === 1 ? "" : "s"} with source URLs and no SYN starter records.`
    : summary.reviewNote;
  els.exportReadiness.innerHTML = `
    <div class="export-status ${statusClass}">
      <span>Export readiness</span>
      <strong>${escapeHtml(statusTitle)}</strong>
      <p>${escapeHtml(statusText)}</p>
    </div>
    <div class="export-stats" aria-label="Source pack readiness statistics">
      ${makeExportStat("Records", summary.total)}
      ${makeExportStat("REAL", summary.realCount)}
      ${makeExportStat("IMP", summary.importedCount)}
      ${makeExportStat("SYN", summary.syntheticCount)}
      ${makeExportStat("URLs missing", summary.missingUrls)}
      ${makeExportStat("Sections", summary.sectionCount)}
    </div>
    <ol class="export-steps">
      <li><strong>Export source pack</strong><span>Review or share only the builder records.</span></li>
      <li><strong>Export full documents.json</strong><span>Use this when you want the live site corpus updated.</span></li>
      <li><strong>Upload in GitHub</strong><span>Replace <code>${escapeHtml(uploadTarget)}</code>, commit, then refresh the site with <code>?v=15</code>.</span></li>
    </ol>
    <div class="export-path">
      <span>Public app reads from</span>
      <code>${escapeHtml(uploadTarget)}</code>
    </div>
  `;
}

function makeExportReadinessSummary(docs) {
  const total = docs.length;
  const realCount = docs.filter((doc) => normalizeSourceStatus(doc.sourceStatus) === "real").length;
  const importedCount = docs.filter((doc) => normalizeSourceStatus(doc.sourceStatus) === "imported").length;
  const syntheticCount = docs.filter((doc) => normalizeSourceStatus(doc.sourceStatus) === "synthetic").length;
  const missingUrls = docs.filter((doc) => normalizeSourceStatus(doc.sourceStatus) === "real" && !(doc.sourceUrl || "").trim()).length;
  const sectionCount = docs.reduce((sum, doc) => sum + (Array.isArray(doc.sections) ? doc.sections.length : 0), 0);
  const notes = [];
  if (!realCount) notes.push("add at least one REAL verified source");
  if (missingUrls) notes.push(`${missingUrls} REAL record${missingUrls === 1 ? " needs" : "s need"} source URL`);
  if (syntheticCount) notes.push(`${syntheticCount} SYN starter record${syntheticCount === 1 ? "" : "s"} still in the builder pack`);
  if (importedCount) notes.push(`${importedCount} imported record${importedCount === 1 ? "" : "s"} should be reviewed before marking REAL`);
  return {
    total,
    realCount,
    importedCount,
    syntheticCount,
    missingUrls,
    sectionCount,
    ready: total > 0 && realCount > 0 && syntheticCount === 0 && missingUrls === 0,
    reviewNote: notes.length ? `Before replacing public data, ${notes.join(", ")}.` : "Review record titles, periods, dates, URLs, and pasted sections before export."
  };
}

function makeExportStat(label, value) {
  return `
    <div>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function exportSourcePackJson() {
  if (!state.sourcePackDocs.length) {
    flashBuilderResult("Add at least one source record before exporting the builder source pack.", "error");
    return;
  }
  const filename = `niveshscope-documents-source-pack-${new Date().toISOString().slice(0, 10)}.json`;
  downloadTextFile(filename, JSON.stringify(state.sourcePackDocs, null, 2), "application/json;charset=utf-8");
  flashBuilderResult(`Exported ${state.sourcePackDocs.length} builder source record${state.sourcePackDocs.length === 1 ? "" : "s"}. For the public site, merge it into data/documents.json or use Export full documents.json.`, "success");
}

function exportMergedDocumentsJson() {
  const mergedDocs = dedupeDocuments([...SAMPLE_DOCS, ...state.sourcePackDocs, ...state.uploadedDocs]);
  const filename = "documents.json";
  downloadTextFile(filename, JSON.stringify(mergedDocs, null, 2), "application/json;charset=utf-8");
  flashBuilderResult(`Exported full documents.json with ${mergedDocs.length} records. Upload it to GitHub at data/documents.json, then refresh the public site with ?v=15.`, "success");
}

async function importSourcePackJson(file) {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const docs = normalizeImportedSourcePack(parsed);
    if (!docs.length) {
      flashBuilderResult("No valid source records found in that JSON file.", "error");
      return;
    }
    const existingIds = new Set(state.sourcePackDocs.map((doc) => doc.id));
    const freshDocs = docs.map((doc) => existingIds.has(doc.id) ? { ...doc, id: `${doc.id}-${Date.now().toString(36)}` } : doc);
    state.sourcePackDocs = dedupeDocuments([...freshDocs, ...state.sourcePackDocs]).slice(0, 80);
    freshDocs.forEach((doc) => state.activeTickers.add(doc.ticker));
    saveJson(STORAGE_KEYS.sourcePack, state.sourcePackDocs);
    rebuildDocumentCorpus();
    freshDocs.forEach(updateProgressFromSourceDoc);
    renderSourcePackList();
    renderGuidedSourceCollector();
    renderSourceMatrixOptions();
    renderSourceMatrix();
    renderRealSourceStarterPack();
    state.importReport = makeImportReport(freshDocs, []);
    renderImportSummary();
    flashBuilderResult(`Imported ${freshDocs.length} source record${freshDocs.length === 1 ? "" : "s"} from JSON.`, "success");
  } catch (error) {
    flashBuilderResult(`Could not import JSON: ${error.message}`, "error");
  }
}

function normalizeImportedSourcePack(parsed) {
  const records = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed.documents)
      ? parsed.documents
      : Array.isArray(parsed.sourcePackDocs)
        ? parsed.sourcePackDocs
        : [];
  return records
    .map((doc) => normalizeDocumentRecord(doc, doc.sourceStatus || "real"))
    .filter((doc) => doc.ticker && doc.type && doc.sections.some((section) => String(section.text || "").trim().length > 30));
}

function dedupeDocuments(docs) {
  const seen = new Set();
  const deduped = [];
  for (const doc of docs) {
    const key = doc.id || `${doc.ticker}-${doc.type}-${doc.period}-${doc.date}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(doc);
  }
  return deduped;
}

function flashBuilderResult(message, tone = "neutral") {
  if (!els.sourceBuilderResult) return;
  els.sourceBuilderResult.className = `builder-result is-${tone}`;
  els.sourceBuilderResult.textContent = message;
}

function renderSourceMatrixOptions() {
  if (!els.matrixTickerFilter) return;
  const current = els.matrixTickerFilter.value || "all";
  const companies = getCompanies();
  els.matrixTickerFilter.innerHTML = [
    `<option value="all">All companies</option>`,
    ...companies.map((company) => `<option value="${escapeAttr(company.ticker)}">${escapeHtml(company.ticker)} - ${escapeHtml(company.name)}</option>`)
  ].join("");
  els.matrixTickerFilter.value = companies.some((company) => company.ticker === current) ? current : "all";
}

function renderSourceMatrix() {
  if (!els.sourceMatrix || !els.sourceMatrixSummary) return;
  const rows = buildCoverageMatrixRows();
  const visibleRows = filterCoverageMatrixRows(rows);
  const allItems = rows.flatMap((row) => row.items);
  const counts = countSourceQueueStatuses(allItems);
  const totalSlots = allItems.length || 1;
  const realPercent = Math.round((counts.real / totalSlots) * 100);
  const gapCount = counts.missing + counts.synthetic;

  els.sourceMatrixSummary.innerHTML = [
    makeSourceQueueStat("Companies", rows.length),
    makeSourceQueueStat("Source slots", allItems.length),
    makeSourceQueueStat("REAL coverage", `${realPercent}%`),
    makeSourceQueueStat("Open gaps", gapCount)
  ].join("");

  if (!visibleRows.length) {
    els.sourceMatrix.innerHTML = `
      <tbody>
        <tr>
          <td><div class="empty-list">No coverage rows match this view.</div></td>
        </tr>
      </tbody>
    `;
    return;
  }

  els.sourceMatrix.innerHTML = `
    <thead>
      <tr>
        <th>Company</th>
        <th>Ready</th>
        ${REAL_SOURCE_REQUIREMENTS.map((requirement) => `<th>${escapeHtml(requirement.label)}</th>`).join("")}
        <th>Next action</th>
      </tr>
    </thead>
    <tbody>
      ${visibleRows.map((row) => renderCoverageMatrixRow(row)).join("")}
    </tbody>
  `;

  els.sourceMatrix.querySelectorAll("button[data-matrix-ticker]").forEach((button) => {
    button.addEventListener("click", () => loadSourceTaskIntoBuilder(button.dataset.matrixTicker, button.dataset.matrixKey));
  });
  els.sourceMatrix.querySelectorAll("button[data-matrix-next-ticker]").forEach((button) => {
    button.addEventListener("click", () => loadSourceTaskIntoBuilder(button.dataset.matrixNextTicker, button.dataset.matrixNextKey));
  });
}

function buildCoverageMatrixRows() {
  return getCompanies().map((company) => {
    const docs = getCompanyDocs(company.ticker);
    const items = REAL_SOURCE_REQUIREMENTS.map((requirement) => {
      const status = getRequirementStatus(docs, requirement);
      return {
        company,
        requirement,
        ...status,
        currentEvidence: status.doc
          ? `${shortSourceStatus(status.doc)} ${status.doc.type} (${status.doc.period || status.doc.date || "current"})`
          : "No matching source record"
      };
    });
    const realCount = items.filter((item) => item.statusKey === "real").length;
    const nextGap = items.find((item) => item.statusKey === "missing")
      || items.find((item) => item.statusKey === "synthetic")
      || items.find((item) => item.statusKey === "imported")
      || items[0];
    return {
      company,
      items,
      realCount,
      completeness: Math.round((realCount / REAL_SOURCE_REQUIREMENTS.length) * 100),
      nextGap
    };
  });
}

function filterCoverageMatrixRows(rows) {
  const tickerFilter = els.matrixTickerFilter ? els.matrixTickerFilter.value : "all";
  const statusFilter = els.matrixStatusFilter ? els.matrixStatusFilter.value : "priority";
  return rows.filter((row) => {
    const tickerMatch = tickerFilter === "all" || row.company.ticker === tickerFilter;
    const statusMatch = statusFilter === "all"
      || row.items.some((item) => item.statusKey === statusFilter)
      || statusFilter === "priority" && row.items.some((item) => item.statusKey === "missing" || item.statusKey === "synthetic");
    return tickerMatch && statusMatch;
  });
}

function renderCoverageMatrixRow(row) {
  return `
    <tr>
      <th scope="row">
        <span>${escapeHtml(row.company.ticker)}</span>
        <strong>${escapeHtml(row.company.name)}</strong>
      </th>
      <td>
        <div class="matrix-ready">
          <strong>${escapeHtml(row.completeness)}%</strong>
          <span>${escapeHtml(row.realCount)}/${escapeHtml(REAL_SOURCE_REQUIREMENTS.length)} REAL</span>
        </div>
      </td>
      ${row.items.map((item) => renderCoverageMatrixCell(item)).join("")}
      <td>
        <button class="matrix-next-button" type="button" data-matrix-next-ticker="${escapeAttr(row.company.ticker)}" data-matrix-next-key="${escapeAttr(row.nextGap.requirement.key)}">
          ${escapeHtml(row.nextGap.statusKey === "real" ? "Review REAL" : `Open ${row.nextGap.requirement.label}`)}
        </button>
      </td>
    </tr>
  `;
}

function renderCoverageMatrixCell(item) {
  return `
    <td>
      <button
        class="matrix-status ${escapeAttr(item.className)}"
        type="button"
        data-matrix-ticker="${escapeAttr(item.company.ticker)}"
        data-matrix-key="${escapeAttr(item.requirement.key)}"
        title="${escapeAttr(item.currentEvidence)}"
      >
        <strong>${escapeHtml(item.statusLabel)}</strong>
        <span>${escapeHtml(item.currentEvidence)}</span>
      </button>
    </td>
  `;
}

function openNextCoverageGap() {
  const rows = filterCoverageMatrixRows(buildCoverageMatrixRows());
  const next = rows.flatMap((row) => row.items)
    .find((item) => item.statusKey === "missing" || item.statusKey === "synthetic")
    || rows.flatMap((row) => row.items).find((item) => item.statusKey === "imported")
    || rows[0]?.items[0];
  if (!next) {
    flashSourceMatrixResult("No coverage gap matches this view.", "error");
    return;
  }
  loadSourceTaskIntoBuilder(next.company.ticker, next.requirement.key);
  flashSourceMatrixResult(`${next.company.ticker} ${next.requirement.label} opened in Source Pack Studio.`, "success");
}

function makeCoverageMatrixCsv() {
  const rows = filterCoverageMatrixRows(buildCoverageMatrixRows());
  const headers = ["Ticker", "Company", "Completeness", ...REAL_SOURCE_REQUIREMENTS.map((item) => item.label), "Next action"];
  const dataRows = rows.map((row) => [
    row.company.ticker,
    row.company.name,
    `${row.completeness}%`,
    ...row.items.map((item) => `${item.statusLabel} - ${item.currentEvidence}`),
    `${row.nextGap.requirement.label} - ${row.nextGap.statusLabel}`
  ]);
  return [headers, ...dataRows].map((row) => row.map(csvCell).join(",")).join("\n");
}

async function copyCoverageMatrixCsv() {
  const csv = makeCoverageMatrixCsv();
  hideCoverageMatrixExport();
  const copied = await copyTextToClipboard(csv);
  if (copied) {
    flashSourceMatrixResult("Copied the visible coverage matrix as CSV.", "success");
  } else {
    showCoverageMatrixExport(csv);
    flashSourceMatrixResult("Clipboard copy was blocked. CSV is shown below and can also be downloaded.", "error");
  }
}

function downloadCoverageMatrixCsv() {
  const csv = makeCoverageMatrixCsv();
  const filename = `niveshscope-coverage-matrix-${new Date().toISOString().slice(0, 10)}.csv`;
  downloadTextFile(filename, csv, "text/csv;charset=utf-8");
  hideCoverageMatrixExport();
  flashSourceMatrixResult("Downloaded the visible coverage matrix as CSV.", "success");
}

function showCoverageMatrixExport(csv) {
  if (!els.sourceMatrixExport) return;
  els.sourceMatrixExport.hidden = false;
  els.sourceMatrixExport.innerHTML = `
    <div>
      <strong>Manual CSV copy</strong>
      <span>Clipboard access is blocked in this browser session. Select the CSV below or use Download CSV.</span>
    </div>
    <textarea readonly rows="8">${escapeHtml(csv)}</textarea>
  `;
  const textarea = els.sourceMatrixExport.querySelector("textarea");
  if (textarea) {
    textarea.focus();
    textarea.select();
  }
}

function hideCoverageMatrixExport() {
  if (!els.sourceMatrixExport) return;
  els.sourceMatrixExport.hidden = true;
  els.sourceMatrixExport.innerHTML = "";
}

function flashSourceMatrixResult(message, tone = "neutral") {
  if (!els.sourceMatrixResult) return;
  els.sourceMatrixResult.className = `builder-result is-${tone}`;
  els.sourceMatrixResult.textContent = message;
}

function renderRealSourceStarterPack() {
  if (!els.realStarterGrid || !els.realStarterSummary) return;
  const starterRows = STARTER_PACK_TICKERS
    .map(makeStarterPackCompany)
    .filter(Boolean);
  const totalSlots = starterRows.length * REAL_SOURCE_REQUIREMENTS.length || 1;
  const realSlots = starterRows.reduce((sum, row) => sum + row.realCount, 0);
  const importedSlots = starterRows.reduce((sum, row) => sum + row.importedCount, 0);
  const readyCount = starterRows.filter((row) => row.investmentReady).length;

  els.realStarterSummary.innerHTML = [
    makeSourceQueueStat("Priority companies", starterRows.length),
    makeSourceQueueStat("REAL sources", `${realSlots}/${totalSlots}`),
    makeSourceQueueStat("Imported review", importedSlots),
    makeSourceQueueStat("Investment-ready", readyCount)
  ].join("");

  els.realStarterGrid.innerHTML = starterRows.map(renderStarterPackCard).join("");

  els.realStarterGrid.querySelectorAll("button[data-starter-ticker]").forEach((button) => {
    button.addEventListener("click", () => {
      loadSourceTaskIntoBuilder(button.dataset.starterTicker, button.dataset.starterKey);
      flashRealStarterResult(`${button.dataset.starterTicker} ${button.dataset.starterLabel} opened in Source Studio.`, "success");
    });
  });

  els.realStarterGrid.querySelectorAll("button[data-starter-question]").forEach((button) => {
    button.addEventListener("click", () => {
      const question = button.dataset.starterQuestion || "";
      els.queryInput.value = question;
      runAnalysis(question);
      document.querySelector("#desk")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function makeStarterPackCompany(ticker) {
  const company = getCompany(ticker);
  if (!company) return null;
  const docs = getCompanyDocs(company.ticker);
  const checklist = makeRealDataChecklist(docs);
  const realCount = checklist.filter((item) => item.statusKey === "real").length;
  const importedCount = checklist.filter((item) => item.statusKey === "imported").length;
  const syntheticCount = checklist.filter((item) => item.statusKey === "synthetic").length;
  const missingCount = checklist.filter((item) => item.statusKey === "missing").length;
  const completeness = makeRealSourceCompleteness(checklist);
  const hasAnnual = checklist.some((item) => item.key === "annual-report" && item.statusKey === "real");
  const hasManagement = checklist.some((item) => ["concall", "results"].includes(item.key) && item.statusKey === "real");
  const next = checklist.find((item) => item.statusKey === "missing")
    || checklist.find((item) => item.statusKey === "synthetic")
    || checklist.find((item) => item.statusKey === "imported")
    || checklist[0];
  const investmentReady = realCount === checklist.length;
  const pilotReady = !investmentReady && realCount >= 3 && hasAnnual && hasManagement;
  const label = investmentReady
    ? "Investment-use ready"
    : pilotReady
      ? "Pilot review ready"
      : "Prototype evidence only";
  const className = investmentReady ? "is-ready" : pilotReady ? "is-review" : "is-blocked";
  return {
    company,
    checklist,
    completeness,
    realCount,
    importedCount,
    syntheticCount,
    missingCount,
    next,
    investmentReady,
    pilotReady,
    label,
    className
  };
}

function renderStarterPackCard(row) {
  const nextLabel = row.next ? row.next.label : "Annual report";
  const question = `What are the most important source-backed risks for $${row.company.ticker}?`;
  return `
    <article class="starter-pack-card ${escapeAttr(row.className)}">
      <div class="starter-pack-head">
        <div>
          <span>${escapeHtml(row.label)}</span>
          <strong>${escapeHtml(row.company.ticker)} - ${escapeHtml(row.company.name)}</strong>
        </div>
        <em>${escapeHtml(row.completeness.percent)}%</em>
      </div>
      <p>${escapeHtml(row.realCount)}/${escapeHtml(row.checklist.length)} REAL source types. ${escapeHtml(row.syntheticCount)} SYN starter, ${escapeHtml(row.missingCount)} missing, ${escapeHtml(row.importedCount)} imported review.</p>
      <div class="starter-pack-slots">
        ${row.checklist.map((item) => `
          <button
            type="button"
            class="${escapeAttr(item.className)}"
            data-starter-ticker="${escapeAttr(row.company.ticker)}"
            data-starter-key="${escapeAttr(item.key)}"
            data-starter-label="${escapeAttr(item.label)}"
          >
            <strong>${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(item.status)}</span>
          </button>
        `).join("")}
      </div>
      <div class="starter-pack-actions">
        <button class="secondary-button" type="button" data-starter-ticker="${escapeAttr(row.company.ticker)}" data-starter-key="${escapeAttr(row.next ? row.next.key : "annual-report")}" data-starter-label="${escapeAttr(nextLabel)}">
          Replace ${escapeHtml(nextLabel)}
        </button>
        <button class="secondary-button" type="button" data-starter-question="${escapeAttr(question)}">Test answer</button>
      </div>
    </article>
  `;
}

function flashRealStarterResult(message, tone = "neutral") {
  if (!els.realStarterResult) return;
  els.realStarterResult.className = `builder-result is-${tone}`;
  els.realStarterResult.textContent = message;
}

function renderSourceQueueOptions() {
  if (!els.queueTickerFilter) return;
  const current = els.queueTickerFilter.value || "all";
  const companies = getCompanies();
  els.queueTickerFilter.innerHTML = [
    `<option value="all">All companies</option>`,
    ...companies.map((company) => `<option value="${escapeAttr(company.ticker)}">${escapeHtml(company.ticker)} - ${escapeHtml(company.name)}</option>`)
  ].join("");
  els.queueTickerFilter.value = companies.some((company) => company.ticker === current) ? current : "all";
}

function renderSourceQueue() {
  if (!els.sourceQueueList || !els.sourceQueueSummary) return;
  const items = buildSourceQueueItems();
  const tickerFilter = els.queueTickerFilter ? els.queueTickerFilter.value : "all";
  const statusFilter = els.queueStatusFilter ? els.queueStatusFilter.value : "priority";
  const filtered = items.filter((item) => {
    const tickerMatch = tickerFilter === "all" || item.company.ticker === tickerFilter;
    const statusMatch = statusFilter === "all"
      || item.statusKey === statusFilter
      || statusFilter === "priority" && (item.statusKey === "missing" || item.statusKey === "synthetic");
    return tickerMatch && statusMatch;
  });
  const counts = countSourceQueueStatuses(items);

  els.sourceQueueSummary.innerHTML = [
    makeSourceQueueStat("Missing", counts.missing),
    makeSourceQueueStat("SYN starter", counts.synthetic),
    makeSourceQueueStat("IMP review", counts.imported),
    makeSourceQueueStat("REAL ready", counts.real)
  ].join("");

  if (!filtered.length) {
    els.sourceQueueList.innerHTML = `<div class="empty-list">No source tasks match this filter.</div>`;
    return;
  }

  els.sourceQueueList.innerHTML = filtered.map((item) => `
    <article class="source-task-card ${escapeAttr(item.className)}">
      <div class="source-task-head">
        <div>
          <span>${escapeHtml(item.company.ticker)} - ${escapeHtml(item.company.name)}</span>
          <strong>${escapeHtml(item.requirement.label)}</strong>
        </div>
        <em>${escapeHtml(item.statusLabel)}</em>
      </div>
      <p>${escapeHtml(item.requirement.instruction)}</p>
      <div class="source-task-meta">
        <span>Current evidence</span>
        <strong>${escapeHtml(item.currentEvidence)}</strong>
      </div>
      <div class="source-task-linkbar">
        ${sourceLinksForTask(item).slice(0, 3).map((link) => `<a href="${escapeAttr(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`).join("")}
      </div>
      <div class="source-task-actions">
        <button class="secondary-button" type="button" data-hub-ticker="${escapeAttr(item.company.ticker)}" data-hub-key="${escapeAttr(item.requirement.key)}">Collect links</button>
        <button class="secondary-button" type="button" data-queue-ticker="${escapeAttr(item.company.ticker)}" data-queue-key="${escapeAttr(item.requirement.key)}">Open in studio</button>
      </div>
    </article>
  `).join("");

  els.sourceQueueList.querySelectorAll("button[data-queue-ticker]").forEach((button) => {
    button.addEventListener("click", () => {
      loadSourceTaskIntoBuilder(button.dataset.queueTicker, button.dataset.queueKey);
    });
  });
  els.sourceQueueList.querySelectorAll("button[data-hub-ticker]").forEach((button) => {
    button.addEventListener("click", () => {
      openSourceTaskInHub(button.dataset.hubTicker, button.dataset.hubKey);
    });
  });
}

function makeSourceQueueStat(label, value) {
  return `
    <div>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function countSourceQueueStatuses(items) {
  return items.reduce((counts, item) => {
    counts[item.statusKey] = (counts[item.statusKey] || 0) + 1;
    return counts;
  }, { missing: 0, synthetic: 0, imported: 0, real: 0 });
}

function buildSourceQueueItems() {
  return getCompanies().flatMap((company) => {
    const docs = getCompanyDocs(company.ticker);
    return REAL_SOURCE_REQUIREMENTS.map((requirement) => {
      const status = getRequirementStatus(docs, requirement);
      return {
        company,
        requirement,
        ...status,
        currentEvidence: status.doc
          ? `${shortSourceStatus(status.doc)} ${status.doc.type} (${status.doc.period || status.doc.date || "current"})`
          : "No matching source record"
      };
    });
  });
}

function getRequirementStatus(docs, requirement) {
  const matches = docs.filter((doc) => requirement.pattern.test(`${doc.type || ""} ${doc.period || ""} ${doc.title || ""}`));
  const real = matches.find((doc) => normalizeSourceStatus(doc.sourceStatus) === "real");
  const imported = matches.find((doc) => normalizeSourceStatus(doc.sourceStatus) === "imported");
  const synthetic = matches.find((doc) => normalizeSourceStatus(doc.sourceStatus) === "synthetic");
  if (real) return { statusKey: "real", statusLabel: "REAL ready", className: "is-real", doc: real };
  if (imported) return { statusKey: "imported", statusLabel: "IMP review", className: "is-imported", doc: imported };
  if (synthetic) return { statusKey: "synthetic", statusLabel: "SYN starter", className: "is-synthetic", doc: synthetic };
  return { statusKey: "missing", statusLabel: "Needed", className: "is-missing", doc: null };
}

function loadSourceTaskIntoBuilder(ticker, requirementKey) {
  if (!els.sourceBuilderTicker || !els.sourceBuilderType) return;
  const requirement = REAL_SOURCE_REQUIREMENTS.find((item) => item.key === requirementKey) || REAL_SOURCE_REQUIREMENTS[0];
  const company = getCompany(ticker);
  state.selectedTicker = normalizeTicker(ticker);
  renderSourceBuilderTickerOptions();
  els.sourceBuilderTicker.value = state.selectedTicker;
  els.sourceBuilderType.value = requirement.type;
  els.sourceBuilderStatus.value = "real";
  els.sourceBuilderPeriod.value = /quarter|results|concall/i.test(requirement.type) ? "Q4 FY2025" : "FY2025";
  els.sourceBuilderDate.value = new Date().toISOString().slice(0, 10);
  els.sourceBuilderUrl.value = "";
  els.sourceBuilderTitleInput.value = `${company ? company.name : state.selectedTicker} ${requirement.label} source`;
  resetSourceConfidenceChecks();
  renderSourceBuilderSections();
  renderSourceAssistantLinks();
  state.activeSourceTask = {
    ticker: state.selectedTicker,
    requirementKey: requirement.key,
    label: requirement.label,
    status: "Replacement task loaded",
    instruction: requirement.instruction
  };
  renderActiveSourceTask(state.activeSourceTask);
  renderGuidedSourceCollector();
  renderImportTickerOptions();
  renderValuationOptions();
  renderCompanyDossier();
  updateValuationFromCompany();
  updateValuation();
  drawSignalMap();
  flashBuilderResult(`${state.selectedTicker} ${requirement.label} task loaded. Paste the source text and add it as REAL evidence.`, "neutral");
  document.querySelector("#source-builder")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderActiveSourceTask(task = state.activeSourceTask) {
  if (!els.activeSourceTask) return;
  if (!task) {
    els.activeSourceTask.hidden = true;
    els.activeSourceTask.innerHTML = "";
    return;
  }
  const company = getCompany(task.ticker);
  const steps = makeSourceCollectionSteps(task);
  els.activeSourceTask.hidden = false;
  els.activeSourceTask.innerHTML = `
    <div class="active-source-head">
      <div>
        <span>Active replacement task</span>
        <strong>${escapeHtml(task.ticker)} ${escapeHtml(task.label)}</strong>
        <p>${escapeHtml(task.instruction || "Paste verified source sections, add the source URL, then add to live corpus.")}</p>
      </div>
      <button type="button" data-active-task-return="${escapeAttr(company ? company.ticker : task.ticker)}">Return to dossier</button>
    </div>
    <div class="source-collection-steps" aria-label="Source collection steps">
      ${steps.map((step, index) => `
        <div class="${step.done ? "is-done" : "is-next"}">
          <span>${index + 1}</span>
          <strong>${escapeHtml(step.label)}</strong>
          <p>${escapeHtml(step.help)}</p>
        </div>
      `).join("")}
    </div>
  `;
  const button = els.activeSourceTask.querySelector("button[data-active-task-return]");
  if (button) button.addEventListener("click", returnToDossier);
}

function makeSourceCollectionSteps(task) {
  const taskId = sourceTaskId(task.ticker, task.requirementKey);
  const progress = state.sourceProgress[taskId] || { stage: "queued" };
  const stageRank = { queued: 0, collected: 1, pasted: 2, verified: 3 };
  const rank = stageRank[progress.stage] || 0;
  const sourceUrl = normalizeExternalUrl(els.sourceBuilderUrl ? els.sourceBuilderUrl.value : "");
  const hasSections = els.sourceBuilderSections
    ? Array.from(els.sourceBuilderSections.querySelectorAll("textarea")).some((textarea) => textarea.value.replace(/\s+/g, "").length > 80)
    : false;
  return [
    {
      label: "Open source site",
      help: "Use the buttons below to open NSE, BSE, Company IR, or Screener.",
      done: rank >= 1
    },
    {
      label: "Fill source URL",
      help: "Click Fill URL after choosing the official source page.",
      done: Boolean(sourceUrl)
    },
    {
      label: "Paste source text",
      help: "Paste relevant results, concall, annual report, shareholding, or announcement text into the big box.",
      done: rank >= 2 || hasSections
    },
    {
      label: "Detect and review",
      help: "Click Detect and fill builder, then review the filled source sections.",
      done: hasSections
    },
    {
      label: "Add to live corpus",
      help: "Only add as REAL after the URL and pasted text match the official source.",
      done: rank >= 3
    }
  ];
}

function markActiveSourceTaskStage(stage) {
  if (!state.activeSourceTask) return;
  const taskId = sourceTaskId(state.activeSourceTask.ticker, state.activeSourceTask.requirementKey);
  const normalizedStage = SOURCE_PROGRESS_STAGES.some((item) => item.id === stage) ? stage : "queued";
  const current = state.sourceProgress[taskId];
  const rank = { queued: 0, collected: 1, pasted: 2, verified: 3 };
  if (current && (rank[current.stage] || 0) > (rank[normalizedStage] || 0)) return;
  state.sourceProgress[taskId] = {
    ...(current || {}),
    taskId,
    stage: normalizedStage,
    updatedAt: new Date().toISOString()
  };
  saveJson(STORAGE_KEYS.sourceProgress, state.sourceProgress);
  renderSourceWorkspace();
  renderGuidedSourceCollector();
}

function returnToDossier() {
  const ticker = state.activeSourceTask ? state.activeSourceTask.ticker : state.selectedTicker;
  if (ticker) {
    state.selectedTicker = ticker;
    renderCompanyDossier();
  }
  document.querySelector(".dossier-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function makeSourceChecklistCsv() {
  const headers = ["Ticker", "Company", "Source type", "Status", "Current evidence", "Collection note"];
  const rows = buildSourceQueueItems().map((item) => [
    item.company.ticker,
    item.company.name,
    item.requirement.label,
    item.statusLabel,
    item.currentEvidence,
    item.requirement.instruction
  ]);
  return [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}

function exportSourceChecklistCsv() {
  const filename = `niveshscope-real-data-checklist-${new Date().toISOString().slice(0, 10)}.csv`;
  downloadTextFile(filename, makeSourceChecklistCsv(), "text/csv;charset=utf-8");
  flashSourceQueueResult("Exported the full real-data checklist as CSV.", "success");
}

function copySourceChecklistCsv() {
  const csv = makeSourceChecklistCsv();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(csv).catch(() => fallbackCopy(csv));
  } else {
    fallbackCopy(csv);
  }
  flashSourceQueueResult("Copied the real-data checklist CSV.", "success");
}

function flashSourceQueueResult(message, tone = "neutral") {
  if (!els.sourceQueueResult) return;
  els.sourceQueueResult.className = `builder-result is-${tone}`;
  els.sourceQueueResult.textContent = message;
}

function renderSourceHubOptions() {
  if (!els.hubTickerSelect || !els.hubRequirementSelect) return;
  const currentTicker = els.hubTickerSelect.value || state.selectedTicker || getCompanies()[0]?.ticker || "";
  const currentRequirement = els.hubRequirementSelect.value || "annual-report";
  els.hubTickerSelect.innerHTML = getCompanies().map((company) => {
    return `<option value="${escapeAttr(company.ticker)}">${escapeHtml(company.ticker)} - ${escapeHtml(company.name)}</option>`;
  }).join("");
  els.hubRequirementSelect.innerHTML = REAL_SOURCE_REQUIREMENTS.map((requirement) => {
    return `<option value="${escapeAttr(requirement.key)}">${escapeHtml(requirement.label)}</option>`;
  }).join("");
  els.hubTickerSelect.value = getCompany(currentTicker) ? currentTicker : getCompanies()[0]?.ticker || "";
  els.hubRequirementSelect.value = REAL_SOURCE_REQUIREMENTS.some((item) => item.key === currentRequirement) ? currentRequirement : "annual-report";
}

function renderSourceWorkspace() {
  if (!els.sourceWorkspaceList || !els.sourceWorkspaceSummary) return;
  const items = buildSourceQueueItems().map((item) => ({ ...item, progress: getSourceTaskProgress(item) }));
  const counts = countWorkspaceStages(items);
  const filtered = filterWorkspaceItems(items);
  const limit = Number(els.workspaceBatchSize ? els.workspaceBatchSize.value : 6) || 6;
  const batch = filtered.slice(0, limit);

  els.sourceWorkspaceSummary.innerHTML = [
    makeWorkspaceStat("Queued", counts.queued),
    makeWorkspaceStat("Collected", counts.collected),
    makeWorkspaceStat("Pasted", counts.pasted),
    makeWorkspaceStat("Verified", counts.verified)
  ].join("");

  if (!batch.length) {
    els.sourceWorkspaceList.innerHTML = `<div class="empty-list">No workspace tasks match this view.</div>`;
    return;
  }

  els.sourceWorkspaceList.innerHTML = batch.map((item) => `
    <article class="workspace-task-card stage-${escapeAttr(item.progress.stage)} ${escapeAttr(item.className)}">
      <div class="workspace-task-top">
        <div>
          <span>${escapeHtml(item.company.ticker)} - ${escapeHtml(item.company.name)}</span>
          <strong>${escapeHtml(item.requirement.label)}</strong>
        </div>
        <em>${escapeHtml(progressStageLabel(item.progress.stage))}</em>
      </div>
      <p>${escapeHtml(item.requirement.instruction)}</p>
      <div class="source-task-meta">
        <span>Evidence status</span>
        <strong>${escapeHtml(item.statusLabel)} - ${escapeHtml(item.currentEvidence)}</strong>
      </div>
      <div class="workspace-stage-grid">
        ${SOURCE_PROGRESS_STAGES.map((stage) => `
          <button type="button" class="${item.progress.stage === stage.id ? "is-active" : ""}" data-progress-task="${escapeAttr(sourceTaskId(item.company.ticker, item.requirement.key))}" data-progress-stage="${escapeAttr(stage.id)}">${escapeHtml(stage.label)}</button>
        `).join("")}
      </div>
      <div class="source-task-actions">
        <button class="secondary-button" type="button" data-workspace-hub-ticker="${escapeAttr(item.company.ticker)}" data-workspace-hub-key="${escapeAttr(item.requirement.key)}">Collect links</button>
        <button class="secondary-button" type="button" data-workspace-studio-ticker="${escapeAttr(item.company.ticker)}" data-workspace-studio-key="${escapeAttr(item.requirement.key)}">Open in studio</button>
      </div>
    </article>
  `).join("");

  els.sourceWorkspaceList.querySelectorAll("button[data-progress-task]").forEach((button) => {
    button.addEventListener("click", () => {
      setSourceTaskProgress(button.dataset.progressTask, button.dataset.progressStage);
    });
  });
  els.sourceWorkspaceList.querySelectorAll("button[data-workspace-hub-ticker]").forEach((button) => {
    button.addEventListener("click", () => openSourceTaskInHub(button.dataset.workspaceHubTicker, button.dataset.workspaceHubKey));
  });
  els.sourceWorkspaceList.querySelectorAll("button[data-workspace-studio-ticker]").forEach((button) => {
    button.addEventListener("click", () => loadSourceTaskIntoBuilder(button.dataset.workspaceStudioTicker, button.dataset.workspaceStudioKey));
  });
}

function filterWorkspaceItems(items) {
  const view = els.workspaceFilter ? els.workspaceFilter.value : "pending";
  const priority = items
    .filter((item) => view === "all"
      || view === "verified" && item.progress.stage === "verified"
      || view === "active" && ["queued", "collected", "pasted"].includes(item.progress.stage)
      || view === "pending" && item.progress.stage !== "verified")
    .sort((a, b) => workspacePriority(a) - workspacePriority(b));
  return priority;
}

function workspacePriority(item) {
  const statusRank = { missing: 0, synthetic: 1, imported: 2, real: 3 };
  const stageRank = { queued: 0, collected: 1, pasted: 2, verified: 3 };
  return (stageRank[item.progress.stage] || 0) * 10 + (statusRank[item.statusKey] ?? 4);
}

function makeWorkspaceStat(label, value) {
  return `
    <div>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function countWorkspaceStages(items) {
  return items.reduce((counts, item) => {
    counts[item.progress.stage] = (counts[item.progress.stage] || 0) + 1;
    return counts;
  }, { queued: 0, collected: 0, pasted: 0, verified: 0 });
}

function getSourceTaskProgress(item) {
  const id = sourceTaskId(item.company.ticker, item.requirement.key);
  const saved = state.sourceProgress[id];
  if (saved) return saved;
  return {
    stage: item.statusKey === "real" ? "verified" : "queued",
    updatedAt: "",
    taskId: id
  };
}

function setSourceTaskProgress(taskId, stage) {
  const normalizedStage = SOURCE_PROGRESS_STAGES.some((item) => item.id === stage) ? stage : "queued";
  state.sourceProgress[taskId] = {
    ...(state.sourceProgress[taskId] || {}),
    taskId,
    stage: normalizedStage,
    updatedAt: new Date().toISOString()
  };
  saveJson(STORAGE_KEYS.sourceProgress, state.sourceProgress);
  renderSourceWorkspace();
  renderGuidedSourceCollector();
  if (state.activeSourceTask && sourceTaskId(state.activeSourceTask.ticker, state.activeSourceTask.requirementKey) === taskId) {
    renderActiveSourceTask();
  }
  flashSourceWorkspaceResult(`Task marked ${progressStageLabel(normalizedStage)}.`, "success");
}

function updateProgressFromSourceDoc(doc) {
  const requirement = REAL_SOURCE_REQUIREMENTS.find((item) => item.pattern.test(`${doc.type || ""} ${doc.period || ""} ${doc.title || ""}`));
  if (!requirement) return;
  const stage = normalizeSourceStatus(doc.sourceStatus) === "real" ? "verified" : "pasted";
  const taskId = sourceTaskId(doc.ticker, requirement.key);
  state.sourceProgress[taskId] = {
    ...(state.sourceProgress[taskId] || {}),
    taskId,
    stage,
    updatedAt: new Date().toISOString()
  };
  saveJson(STORAGE_KEYS.sourceProgress, state.sourceProgress);
  renderSourceWorkspace();
  renderGuidedSourceCollector();
  if (state.activeSourceTask && sourceTaskId(state.activeSourceTask.ticker, state.activeSourceTask.requirementKey) === taskId) {
    renderActiveSourceTask();
  }
}

function sourceTaskId(ticker, requirementKey) {
  return `${normalizeTicker(ticker)}:${requirementKey}`;
}

function progressStageLabel(stage) {
  return SOURCE_PROGRESS_STAGES.find((item) => item.id === stage)?.label || "Queued";
}

function normalizeSourceProgress(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return Object.fromEntries(Object.entries(raw).map(([taskId, value]) => {
    const stage = SOURCE_PROGRESS_STAGES.some((item) => item.id === value?.stage) ? value.stage : "queued";
    return [taskId, {
      taskId,
      stage,
      updatedAt: value?.updatedAt || ""
    }];
  }));
}

function makeWorkspaceProgressRows() {
  return buildSourceQueueItems().map((item) => {
    const progress = getSourceTaskProgress(item);
    return {
      ticker: item.company.ticker,
      company: item.company.name,
      sourceType: item.requirement.label,
      sourceStatus: item.statusLabel,
      progress: progressStageLabel(progress.stage),
      updatedAt: progress.updatedAt || "",
      currentEvidence: item.currentEvidence,
      collectionNote: item.requirement.instruction
    };
  });
}

function exportWorkspaceProgressReport() {
  const rows = makeWorkspaceProgressRows();
  const headers = ["Ticker", "Company", "Source type", "Evidence status", "Workspace progress", "Updated at", "Current evidence", "Collection note"];
  const csvRows = rows.map((row) => [
    row.ticker,
    row.company,
    row.sourceType,
    row.sourceStatus,
    row.progress,
    row.updatedAt,
    row.currentEvidence,
    row.collectionNote
  ]);
  const filename = `niveshscope-source-workspace-progress-${new Date().toISOString().slice(0, 10)}.csv`;
  downloadTextFile(filename, [headers, ...csvRows].map((row) => row.map(csvCell).join(",")).join("\n"), "text/csv;charset=utf-8");
  flashSourceWorkspaceResult("Exported workspace progress CSV.", "success");
}

function exportWorkspaceJsonPack() {
  const mergedDocs = dedupeDocuments([...SAMPLE_DOCS, ...state.sourcePackDocs, ...state.uploadedDocs]);
  const payload = {
    exportedAt: new Date().toISOString(),
    dataVersion: DATA_VERSION,
    documents: mergedDocs,
    sourceProgress: state.sourceProgress,
    progressReport: makeWorkspaceProgressRows()
  };
  const filename = `niveshscope-workspace-pack-${new Date().toISOString().slice(0, 10)}.json`;
  downloadTextFile(filename, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
  flashSourceWorkspaceResult("Exported workspace JSON with documents and progress.", "success");
}

function flashSourceWorkspaceResult(message, tone = "neutral") {
  if (!els.sourceWorkspaceResult) return;
  els.sourceWorkspaceResult.className = `builder-result is-${tone}`;
  els.sourceWorkspaceResult.textContent = message;
}

function renderSourceHub() {
  if (!els.sourceHubTask || !els.sourceLinkPanel) return;
  const item = getCurrentSourceHubItem();
  if (!item) {
    els.sourceHubTask.innerHTML = `<div class="empty-list">Select a company and source type.</div>`;
    els.sourceLinkPanel.innerHTML = "";
    return;
  }
  const links = sourceLinksForTask(item);
  els.sourceHubTask.innerHTML = `
    <span class="source-badge ${escapeAttr(item.className.replace("is-", "source-"))}">${escapeHtml(item.statusLabel)}</span>
    <h3>${escapeHtml(item.company.ticker)} ${escapeHtml(item.requirement.label)} collection task</h3>
    <p>${escapeHtml(item.requirement.instruction)}</p>
    <div class="source-task-meta">
      <span>Current evidence</span>
      <strong>${escapeHtml(item.currentEvidence)}</strong>
    </div>
  `;
  els.sourceLinkPanel.innerHTML = `
    <div class="panel-heading">
      <h2>Source Links</h2>
      <span>${escapeHtml(item.company.ticker)}</span>
    </div>
    <div class="source-link-list">
      ${links.map((link) => `
        <a href="${escapeAttr(link.url)}" target="_blank" rel="noopener noreferrer">
          <span>${escapeHtml(link.label)}</span>
          <strong>${escapeHtml(link.note)}</strong>
        </a>
      `).join("")}
    </div>
  `;
}

function getCurrentSourceHubItem() {
  const ticker = normalizeTicker(els.hubTickerSelect ? els.hubTickerSelect.value : state.selectedTicker);
  const requirementKey = els.hubRequirementSelect ? els.hubRequirementSelect.value : "annual-report";
  const company = getCompany(ticker);
  const requirement = REAL_SOURCE_REQUIREMENTS.find((item) => item.key === requirementKey);
  if (!company || !requirement) return null;
  const status = getRequirementStatus(getCompanyDocs(company.ticker), requirement);
  return {
    company,
    requirement,
    ...status,
    currentEvidence: status.doc
      ? `${shortSourceStatus(status.doc)} ${status.doc.type} (${status.doc.period || status.doc.date || "current"})`
      : "No matching source record"
  };
}

function openSourceTaskInHub(ticker, requirementKey) {
  if (!els.hubTickerSelect || !els.hubRequirementSelect) return;
  els.hubTickerSelect.value = normalizeTicker(ticker);
  els.hubRequirementSelect.value = requirementKey;
  renderSourceHub();
  flashSourceHubResult("Collection links loaded for the selected task.", "neutral");
  document.querySelector("#source-hub")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function sourceLinksForTask(item) {
  const ticker = item.company.ticker;
  const encodedTicker = encodeURIComponent(ticker);
  const companySearch = encodeURIComponent(`${ticker} ${item.company.name} ${item.requirement.label}`);
  const links = [
    {
      label: "Company IR",
      url: COMPANY_IR_LINKS[ticker] || `https://www.google.com/search?q=${companySearch}+investor+relations`,
      note: "Primary source for annual reports, presentations, concall transcripts, and investor updates."
    },
    ...((MARKET_SOURCE_LINKS[item.requirement.key] || []).map((link) => ({
      ...link,
      note: "Official market filing page. Search or filter by ticker, company name, period, and filing type."
    }))),
    {
      label: "Screener company page",
      url: `https://www.screener.in/company/${encodedTicker}/consolidated/`,
      note: "Fast cross-check for company documents, ratios, and notes before the source is pasted into NiveshScope."
    },
    {
      label: "Web source search",
      url: `https://www.google.com/search?q=${companySearch}+site%3A${encodeURIComponent(new URL(COMPANY_IR_LINKS[ticker] || "https://www.nseindia.com").hostname)}`,
      note: "Fallback search scoped to the likely official site."
    }
  ];
  return links
    .map((link) => ({ ...link, url: normalizeExternalUrl(link.url) }))
    .filter((link) => link.url);
}

function makeSourceHubTaskText(item = getCurrentSourceHubItem()) {
  if (!item) return "";
  const links = sourceLinksForTask(item).map((link) => `- ${link.label}: ${link.url}`).join("\n");
  return [
    `# NiveshScope Source Task: ${item.company.ticker} ${item.requirement.label}`,
    "",
    `Company: ${item.company.name}`,
    `Ticker: ${item.company.ticker}`,
    `Status: ${item.statusLabel}`,
    `Current evidence: ${item.currentEvidence}`,
    "",
    "Collection note:",
    item.requirement.instruction,
    "",
    "Open these sources:",
    links,
    "",
    "Paste into Source Pack Studio:",
    getSourceSectionTemplates(item.requirement.type).map((section) => `- ${section}`).join("\n"),
    "",
    "Mark as REAL only after the source URL, period, date, and pasted sections have been checked."
  ].join("\n");
}

function copySourceHubTask() {
  const task = makeSourceHubTaskText();
  if (!task) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(task).catch(() => fallbackCopy(task));
  } else {
    fallbackCopy(task);
  }
  flashSourceHubResult("Copied the selected acquisition task.", "success");
}

function exportAssistantTaskList() {
  const priorityTasks = buildSourceQueueItems().filter((item) => item.statusKey === "missing" || item.statusKey === "synthetic");
  const content = [
    "# NiveshScope Source Acquisition Task List",
    "",
    `Generated: ${new Date().toLocaleString()}`,
    "",
    ...priorityTasks.map((item) => makeSourceHubTaskText(item))
  ].join("\n\n---\n\n");
  const filename = `niveshscope-source-acquisition-tasks-${new Date().toISOString().slice(0, 10)}.md`;
  downloadTextFile(filename, content, "text/markdown;charset=utf-8");
  flashSourceHubResult(`Exported ${priorityTasks.length} priority source task${priorityTasks.length === 1 ? "" : "s"}.`, "success");
}

function flashSourceHubResult(message, tone = "neutral") {
  if (!els.sourceHubResult) return;
  els.sourceHubResult.className = `builder-result is-${tone}`;
  els.sourceHubResult.textContent = message;
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
      renderCompanyDossier();
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
        <span class="source-kind ${sourceStatusClass(doc)}">${escapeHtml(shortDocType(doc.type))} - ${escapeHtml(shortSourceStatus(doc))}</span>
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
      renderCompanyDossier();
    });
  });
}

function renderImportSummary(report = state.importReport) {
  if (!els.importSummary) return;
  if (!report) {
    els.importSummary.innerHTML = `
      <strong>Import status</strong>
      <span>Paste or upload source text to build a private browser corpus for this session.</span>
    `;
    return;
  }

  const skippedText = report.skipped.length
    ? `<em>${report.skipped.length} skipped: ${escapeHtml(report.skipped.map((item) => `${item.name}${item.reason ? ` (${item.reason})` : ""}`).join(", "))}</em>`
    : "";
  els.importSummary.innerHTML = `
    <strong>${report.added.length} source${report.added.length === 1 ? "" : "s"} imported</strong>
    <span>${escapeHtml(report.sections)} sections, ${escapeHtml(report.metrics)} metrics, ${escapeHtml(report.tickers.join(", ") || "CUSTOM")} coverage updated as imported evidence.</span>
    ${skippedText}
  `;
}

function renderCompanyDossier() {
  if (!els.companyDossier) return;
  const company = getCompany(state.selectedTicker);
  if (!company) {
    els.companyDossier.innerHTML = `<div class="empty-list">Select a company to open its dossier.</div>`;
    return;
  }

  const docs = getCompanyDocs(company.ticker);
  const enabledDocs = docs.filter((doc) => state.enabledDocIds.has(doc.id));
  const latestDocs = [...docs]
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 4);
  const riskFactors = (RISK_FACTOR_LIBRARY[company.ticker] || makeGenericRiskBlueprint(company)).slice(0, 3);
  const sourceMix = sourceMixForDocs(enabledDocs);
  const sourceQuality = sourceStatusSummary(enabledDocs);
  const checklist = makeRealDataChecklist(docs);
  const completeness = makeRealSourceCompleteness(checklist);
  const questions = [
    `What changed in $${company.ticker} disclosures and management tone?`,
    `What are the three most material risks for $${company.ticker}?`,
    `Which valuation assumptions should I flex first for $${company.ticker}?`
  ];

  els.companyDossier.innerHTML = `
    <div class="dossier-head">
      <span>${escapeHtml(company.sector)}</span>
      <strong>${escapeHtml(company.ticker)} - ${escapeHtml(company.name)}</strong>
      <p>${escapeHtml(company.thesis)}</p>
    </div>
    <div class="dossier-kpis">
      <div><span>Revenue</span><strong>${escapeHtml(formatMoney(company.revenue))}</strong></div>
      <div><span>Op margin</span><strong>${escapeHtml(company.opMargin)}%</strong></div>
      <div><span>FCF margin</span><strong>${escapeHtml(company.fcfMargin)}%</strong></div>
      <div><span>Risk</span><strong>${escapeHtml(company.risk)}</strong></div>
    </div>
    <div class="dossier-block">
      <span>Source coverage</span>
      <strong>${enabledDocs.length}/${docs.length} docs enabled</strong>
      <p>${escapeHtml(sourceMix || "Enable or import documents to build a richer source mix.")}</p>
      <p>${escapeHtml(sourceQuality || "No source quality labels yet.")}</p>
    </div>
    <div class="real-source-score">
      <div>
        <span>Real source completeness</span>
        <strong>${escapeHtml(completeness.percent)}%</strong>
      </div>
      <p>${escapeHtml(completeness.summary)}</p>
      <button class="checklist-action" type="button" data-checklist-ticker="${escapeAttr(company.ticker)}" data-checklist-key="${escapeAttr(completeness.nextKey)}">Upgrade next source</button>
    </div>
    <div class="real-data-checklist">
      <span>Real data checklist</span>
      ${checklist.map((item) => `
        <div class="${escapeAttr(item.className)}">
          <strong>${escapeHtml(item.label)}</strong>
          <em>${escapeHtml(item.status)}</em>
          <button class="checklist-action" type="button" data-checklist-ticker="${escapeAttr(company.ticker)}" data-checklist-key="${escapeAttr(item.key)}">${item.statusKey === "real" ? "Review" : "Replace with REAL"}</button>
        </div>
      `).join("")}
    </div>
    <div class="dossier-timeline">
      ${latestDocs.length ? latestDocs.map((doc) => `
        <article>
          <span class="${sourceStatusClass(doc)}">${escapeHtml(shortDocType(doc.type))} - ${escapeHtml(shortSourceStatus(doc))}</span>
          <strong>${escapeHtml(doc.period)}</strong>
          <em>${escapeHtml(doc.date)}</em>
        </article>
      `).join("") : `<div class="empty-list">No company documents yet.</div>`}
    </div>
    <div class="dossier-risk-list">
      ${riskFactors.map((factor) => `
        <div>
          <span>${escapeHtml(factor.severity)}</span>
          <strong>${escapeHtml(factor.title)}</strong>
        </div>
      `).join("")}
    </div>
    <div class="dossier-actions">
      ${questions.map((question) => `<button class="dossier-question" type="button" data-question="${escapeAttr(question)}">${escapeHtml(question)}</button>`).join("")}
    </div>
  `;

  els.companyDossier.querySelectorAll(".dossier-question").forEach((button) => {
    button.addEventListener("click", () => {
      els.queryInput.value = button.dataset.question;
      runAnalysis(button.dataset.question);
    });
  });
  els.companyDossier.querySelectorAll(".checklist-action").forEach((button) => {
    button.addEventListener("click", () => {
      loadSourceTaskIntoBuilder(button.dataset.checklistTicker, button.dataset.checklistKey);
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
    { label: "Enabled docs", value: enabledDocs.length, sub: sourceStatusSummary(enabledDocs) || `${state.uploadedDocs.length} uploaded` },
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

function makeMemoPrompt(kind) {
  const company = getCompany(state.selectedTicker);
  const ticker = company ? company.ticker : "RELIANCE";
  const peerTickers = getCompanies()
    .filter((item) => item.ticker !== ticker && state.activeTickers.has(item.ticker))
    .slice(0, 3)
    .map((item) => `$${item.ticker}`)
    .join(", ");
  const prompts = {
    risk: `Write a risk memo for $${ticker}. Identify the three most material risks, cite annual-report or announcement evidence, and state what would invalidate the base case.`,
    tone: `Compare concall tone and annual-report language for $${ticker}. Where does management sound more cautious or more confident than the written disclosure?`,
    valuation: `For $${ticker}, which valuation assumptions should I flex first: revenue growth, FCF margin, terminal multiple, discount rate, capex, leverage, or credit cost?`,
    peer: `Compare $${ticker}${peerTickers ? ` with ${peerTickers}` : ""} on growth quality, margin durability, cash conversion, leverage, and disclosure risk.`,
    committee: `Draft an investment committee brief for $${ticker}: bottom line, evidence stack, risk factors, valuation read-through, and what would change the answer.`
  };
  return prompts[kind] || prompts.risk;
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
  renderCompanyDossier();
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
  const explicitCompare = isExplicitCompareQuestion(question);
  const docs = getGuardedDocs(getEnabledDocs(), tickerFocus, explicitCompare);
  if (!docs.length) {
    renderNoDocs(question);
    return;
  }

  const chunks = buildChunks(docs);
  const ranked = rankChunks(retrievalQuestion, chunks, { tickerFocus, explicitCompare }).slice(0, 8);
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
  const guardMeta = makeEvidenceGuardMeta(question, citations, tickerFocus, explicitCompare);
  const answerModel = buildAnswerModel(question, citations, intent, tickerFocus, guardMeta);
  state.lastBrief = answerModel.plainText;
  state.lastAnswerMeta = answerModel.meta;
  renderAnswer(answerModel);
  renderEvidence(citations);
  renderContextBand();
  renderBriefWorkbench();
  renderInvestmentGate();
  renderMemoReviewRoom();
  renderDecisionJournal();
  renderReviewRadar();
  renderPortfolioWatchtower();
  renderCatalystCalendar();
  renderDailyBriefing();
  renderDeskTaskBoard();
  renderResearchSprintPlanner();
  renderIcMemoBuilder();
  renderClaimTraceInspector();
      renderAnswerQualityLab();
  renderLaunchControlRoom();
  drawSignalMap(citations);
}

function renderNoDocs(question) {
  state.currentCitations = [];
  state.lastBrief = `No enabled documents for: ${question}`;
  state.lastAnswerMeta = null;
  els.answerPanel.innerHTML = `
    <div class="empty-state">
      <div class="empty-kicker">No corpus</div>
      <h2>No enabled documents match the selected coverage.</h2>
      <p>Enable at least one source document or select another company, then run the analysis again.</p>
    </div>
  `;
  renderEvidence([]);
  renderBriefWorkbench();
  renderInvestmentGate();
  renderMemoReviewRoom();
  renderDecisionJournal();
  renderReviewRadar();
  renderPortfolioWatchtower();
  renderCatalystCalendar();
  renderDailyBriefing();
  renderDeskTaskBoard();
  renderResearchSprintPlanner();
  renderIcMemoBuilder();
  renderClaimTraceInspector();
      renderAnswerQualityLab();
  renderLaunchControlRoom();
  renderContextBand();
}

function renderNoHits(question) {
  state.currentCitations = [];
  state.lastBrief = `No high-confidence passages for: ${question}`;
  state.lastAnswerMeta = null;
  els.answerPanel.innerHTML = `
    <div class="empty-state">
      <div class="empty-kicker">Low recall</div>
      <h2>No strong source passages were retrieved.</h2>
      <p>Try a narrower question, enable more documents, or import an annual report, concall, exchange announcement, or shareholding section with the relevant disclosure.</p>
    </div>
  `;
  renderEvidence([]);
  renderBriefWorkbench();
  renderInvestmentGate();
  renderMemoReviewRoom();
  renderDecisionJournal();
  renderReviewRadar();
  renderPortfolioWatchtower();
  renderCatalystCalendar();
  renderDailyBriefing();
  renderDeskTaskBoard();
  renderResearchSprintPlanner();
  renderIcMemoBuilder();
  renderClaimTraceInspector();
      renderAnswerQualityLab();
  renderLaunchControlRoom();
  renderContextBand();
}

function buildAnswerModel(question, citations, intent, tickerFocus = null, guardMeta = null) {
  const compareMode = guardMeta ? guardMeta.compareMode : isExplicitCompareQuestion(question);
  const grouped = groupCitationsByTicker(citations);
  const rankedCompanies = rankCompaniesForQuestion(question, grouped, intent);
  const primaryCompany = tickerFocus && tickerFocus.company
    ? tickerFocus.company
    : rankedCompanies[0] || getCompany(state.selectedTicker);
  const readiness = makeStarterPackCompany(primaryCompany ? primaryCompany.ticker : state.selectedTicker);
  const confidence = computeConfidence(citations, rankedCompanies);
  const quality = guardMeta || makeEvidenceGuardMeta(question, citations, tickerFocus, compareMode);
  const headline = makeHeadline(question, compareMode, rankedCompanies, intent);
  const thesis = makeThesis(compareMode, rankedCompanies, citations, intent);
  const toneMeter = makeToneMeter(rankedCompanies, citations);
  const focusNotice = makeTickerFocusNotice(tickerFocus);
  const guardNotice = makeEvidenceGuardNotice(quality);
  const readinessNotice = makeInvestmentReadinessNotice(readiness);
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
      <div class="confidence-box evidence-quality-box ${escapeAttr(quality.qualityClass)}">
        <span>Evidence quality</span>
        <strong>${quality.score}%</strong>
      </div>
    </div>
    <div class="answer-body">
      ${readinessNotice}
      ${guardNotice}
      ${focusNotice}
      ${toneMeter.html}
      ${sections.join("")}
    </div>
  `;

  const plainParts = [
    `${intent.label} | ${confidence}% confidence`,
    readiness ? `Investment readiness: ${readiness.label} (${readiness.realCount}/${readiness.checklist.length} REAL source types)` : "",
    `Evidence quality: ${quality.score}% (${quality.label})`,
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
  const meta = {
    question,
    ticker: primaryCompany ? primaryCompany.ticker : "Desk",
    company: primaryCompany ? primaryCompany.name : "Research desk",
    intentLabel: intent.label,
    confidence,
    evidenceQuality: quality.score,
    qualityLabel: quality.label,
    qualityClass: quality.qualityClass,
    guarded: state.onlySelectedTicker && !quality.compareMode,
    compareMode: quality.compareMode,
    mismatchCount: quality.mismatches.length,
    syntheticCount: quality.syntheticCount,
    investmentReady: readiness ? readiness.investmentReady : false,
    investmentReadinessLabel: readiness ? readiness.label : "Unknown readiness",
    realSourceCount: readiness ? readiness.realCount : 0,
    requiredSourceCount: readiness ? readiness.checklist.length : REAL_SOURCE_REQUIREMENTS.length,
    nextRealSource: readiness && readiness.next ? readiness.next.label : "Annual report",
    citationCount: citations.length,
    citations: citations.map((citation) => ({
      citationId: citation.citationId,
      ticker: citation.ticker,
      company: citation.company,
      type: citation.type,
      section: citation.section,
      sourceStatus: normalizeSourceStatus(citation.sourceStatus)
    }))
  };

  return { html, plainText, citations, confidence, headline: stripHtml(headline), meta };
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

function makeInvestmentReadinessNotice(readiness) {
  if (!readiness) return "";
  const isReady = readiness.investmentReady;
  const nextText = readiness.next && !isReady
    ? ` Next replacement: ${readiness.next.label}.`
    : "";
  const message = isReady
    ? "All required source types are REAL. The report can be reviewed as investment-use ready, subject to human judgement."
    : `Prototype evidence only. ${readiness.realCount}/${readiness.checklist.length} required source types are REAL, so this report should not be used as investment-grade research yet.${nextText}`;
  return `
    <section class="investment-readiness-card ${escapeAttr(readiness.className)}">
      <div>
        <span>Investment-use readiness</span>
        <strong>${escapeHtml(readiness.label)} - ${escapeHtml(readiness.completeness.percent)}% real-source coverage</strong>
      </div>
      <p>${escapeHtml(message)}</p>
    </section>
  `;
}

function makeEvidenceGuardNotice(meta) {
  if (!meta) return "";
  const syntheticText = meta.syntheticCount
    ? `${meta.syntheticCount} SYN citation${meta.syntheticCount === 1 ? "" : "s"} are demo-only and should be replaced before investment use.`
    : "No SYN citations in the current answer.";
  const mismatchText = meta.mismatches.length
    ? `${meta.mismatches.length} off-ticker citation${meta.mismatches.length === 1 ? "" : "s"} detected: ${meta.mismatches.map((citation) => citation.citationId).join(", ")}.`
    : meta.compareMode
      ? "Comparative citations are allowed for this question."
      : "No off-ticker citations in the current answer.";
  return `
    <section class="evidence-guard-card ${escapeAttr(meta.qualityClass)}">
      <div>
        <span>Evidence guard</span>
        <strong>${escapeHtml(meta.label)} - ${meta.score}% quality</strong>
      </div>
      <p>${escapeHtml(meta.message)} ${escapeHtml(mismatchText)} ${escapeHtml(syntheticText)}</p>
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
    renderEvidenceVault();
    renderTrustCenter();
    return;
  }
  els.evidenceList.innerHTML = citations.map((citation) => `
    <article class="evidence-card ${normalizeSourceStatus(citation.sourceStatus) === "synthetic" ? "is-synthetic-evidence" : ""}" id="evidence-${escapeAttr(citation.citationId)}">
      <div class="evidence-meta">
        <span>${escapeHtml(citation.citationId)} - ${escapeHtml(citation.ticker)}</span>
        <span><i class="source-badge ${sourceStatusClass(citation)}">${escapeHtml(shortSourceStatus(citation))}</i>${citation.score.toFixed(1)}</span>
      </div>
      <strong>${escapeHtml(citation.type)} - ${escapeHtml(citation.period)} - ${escapeHtml(citation.section)}</strong>
      <p>${escapeHtml(snippet(citation.text, 280))}</p>
      ${normalizeSourceStatus(citation.sourceStatus) === "synthetic" ? `<em class="synthetic-warning">Demo-only SYN citation. Replace with REAL source before investment use.</em>` : ""}
    </article>
  `).join("");
  renderEvidenceVault();
  renderTrustCenter();
}

function renderEvidenceVault() {
  if (!els.evidenceVaultSummary || !els.evidenceVaultList) return;
  const items = state.evidenceVault || [];
  const currentCount = (state.currentCitations || []).length;
  const realCount = items.filter((item) => normalizeSourceStatus(item.sourceStatus) === "real").length;
  const syntheticCount = items.filter((item) => normalizeSourceStatus(item.sourceStatus) === "synthetic").length;
  const tickerCount = new Set(items.map((item) => item.ticker).filter(Boolean)).size;
  if (els.evidenceVaultStatus) {
    els.evidenceVaultStatus.textContent = `${items.length} saved`;
  }
  if (els.saveCurrentEvidence) els.saveCurrentEvidence.disabled = !currentCount;
  if (els.copyEvidenceVault) els.copyEvidenceVault.disabled = !items.length;
  if (els.exportEvidenceVault) els.exportEvidenceVault.disabled = !items.length;
  if (els.clearEvidenceVault) els.clearEvidenceVault.disabled = !items.length;

  els.evidenceVaultSummary.innerHTML = `
    <article class="evidence-vault-hero ${escapeAttr(items.length ? "is-review" : "is-empty")}">
      <div>
        <span>Research memory</span>
        <strong>${escapeHtml(items.length ? `${items.length} saved evidence items` : "No saved evidence yet")}</strong>
        <p>${escapeHtml(currentCount ? `${currentCount} current citation${currentCount === 1 ? "" : "s"} can be saved from the active answer.` : "Run an answer, then save its citations into the vault for review and handoff.")}</p>
      </div>
      <div class="evidence-vault-score">
        <span>REAL mix</span>
        <strong>${escapeHtml(items.length ? `${Math.round((realCount / items.length) * 100)}%` : "0%")}</strong>
      </div>
    </article>
    <div class="evidence-vault-metrics">
      <article><span>Tickers</span><strong>${escapeHtml(tickerCount)}</strong><em>Saved coverage</em></article>
      <article><span>REAL</span><strong>${escapeHtml(realCount)}</strong><em>Verified source items</em></article>
      <article><span>SYN</span><strong>${escapeHtml(syntheticCount)}</strong><em>Demo-only items</em></article>
    </div>
  `;

  if (!items.length) {
    els.evidenceVaultList.innerHTML = `<div class="empty-list">Saved citations will appear here with source labels, question context, and section snippets.</div>`;
    return;
  }

  els.evidenceVaultList.innerHTML = items.slice(0, 8).map((item) => `
    <article class="evidence-vault-item ${escapeAttr(sourceStatusClass(item))}">
      <div class="evidence-vault-item-head">
        <span>${escapeHtml(item.ticker)} - ${escapeHtml(shortSourceStatus(item))}</span>
        <em>${escapeHtml(formatShortDate(item.savedAt))}</em>
      </div>
      <strong>${escapeHtml(item.type)} - ${escapeHtml(item.period)} - ${escapeHtml(item.section)}</strong>
      <p>${escapeHtml(snippet(item.text, 260))}</p>
      <small>${escapeHtml(item.question || "No question captured")}</small>
      <div class="evidence-vault-item-actions">
        ${item.sourceUrl ? `<button type="button" data-vault-open="${escapeAttr(item.id)}">Open source</button>` : ""}
        <button type="button" data-vault-use="${escapeAttr(item.id)}">Use question</button>
        <button type="button" data-vault-delete="${escapeAttr(item.id)}">Delete</button>
      </div>
    </article>
  `).join("");

  els.evidenceVaultList.querySelectorAll("button[data-vault-open]").forEach((button) => {
    button.addEventListener("click", () => openVaultSource(button.dataset.vaultOpen));
  });
  els.evidenceVaultList.querySelectorAll("button[data-vault-use]").forEach((button) => {
    button.addEventListener("click", () => useVaultQuestion(button.dataset.vaultUse));
  });
  els.evidenceVaultList.querySelectorAll("button[data-vault-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteVaultItem(button.dataset.vaultDelete));
  });
}

function normalizeEvidenceVaultItem(item) {
  if (!item || !item.text) return null;
  return {
    id: String(item.id || `vault-${Date.now()}`),
    savedAt: item.savedAt || new Date().toISOString(),
    ticker: normalizeTicker(item.ticker || ""),
    company: item.company || getCompany(item.ticker)?.name || item.ticker || "",
    citationId: item.citationId || "",
    docId: item.docId || "",
    type: item.type || "Source",
    period: item.period || "",
    date: item.date || "",
    section: item.section || "",
    sourceStatus: normalizeSourceStatus(item.sourceStatus || "synthetic"),
    sourceLabel: item.sourceLabel || defaultSourceLabel(item.sourceStatus || "synthetic"),
    sourceUrl: normalizeExternalUrl(item.sourceUrl || ""),
    score: Number(item.score || 0),
    question: item.question || "",
    intentLabel: item.intentLabel || "",
    confidence: Number(item.confidence || 0),
    evidenceQuality: Number(item.evidenceQuality || 0),
    text: String(item.text || "").slice(0, 2200)
  };
}

function makeVaultKey(item) {
  return [item.docId, item.section, item.ticker, snippet(item.text, 120)].join("|").toLowerCase();
}

function makeVaultId(item) {
  return `vault-${makeVaultKey(item).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 96)}`;
}

function saveCurrentEvidenceToVault() {
  const citations = state.currentCitations || [];
  if (!citations.length) {
    flashEvidenceVaultResult("Run an answer before saving citations.", "error");
    return;
  }
  const meta = state.lastAnswerMeta || {};
  const existingKeys = new Set((state.evidenceVault || []).map(makeVaultKey));
  const created = citations.map((citation) => normalizeEvidenceVaultItem({
    ...citation,
    id: makeVaultId(citation),
    savedAt: new Date().toISOString(),
    question: meta.question || els.queryInput?.value || "",
    intentLabel: meta.intentLabel || "",
    confidence: meta.confidence || 0,
    evidenceQuality: meta.evidenceQuality || 0
  })).filter(Boolean).filter((item) => {
    const key = makeVaultKey(item);
    if (existingKeys.has(key)) return false;
    existingKeys.add(key);
    return true;
  });
  if (!created.length) {
    flashEvidenceVaultResult("Current citations are already in the vault.", "neutral");
    return;
  }
  state.evidenceVault = [...created, ...(state.evidenceVault || [])].slice(0, 80);
  saveJson(STORAGE_KEYS.evidenceVault, state.evidenceVault);
  renderEvidenceVault();
  renderTrustCenter();
  renderLaunchControlRoom();
  flashEvidenceVaultResult(`${created.length} citation${created.length === 1 ? "" : "s"} saved to Evidence Vault.`, "success");
}

async function copyEvidenceVault() {
  if (!state.evidenceVault.length) {
    flashEvidenceVaultResult("The Evidence Vault is empty.", "error");
    return;
  }
  const copied = await copyTextToClipboard(makeEvidenceVaultMarkdown());
  flashEvidenceVaultResult(copied ? "Evidence Vault copied." : "Clipboard blocked. Use Export vault instead.", copied ? "success" : "error");
}

function exportEvidenceVault() {
  if (!state.evidenceVault.length) {
    flashEvidenceVaultResult("The Evidence Vault is empty.", "error");
    return;
  }
  const date = new Date().toISOString().slice(0, 10);
  downloadTextFile(`niveshscope-evidence-vault-v47-${date}.json`, JSON.stringify(makeEvidenceVaultJson(), null, 2), "application/json;charset=utf-8");
  flashEvidenceVaultResult("Evidence Vault exported.", "success");
}

function clearEvidenceVault() {
  state.evidenceVault = [];
  saveJson(STORAGE_KEYS.evidenceVault, state.evidenceVault);
  renderEvidenceVault();
  renderTrustCenter();
  renderLaunchControlRoom();
  flashEvidenceVaultResult("Evidence Vault cleared.", "neutral");
}

function openVaultSource(id) {
  const item = (state.evidenceVault || []).find((candidate) => candidate.id === id);
  const url = normalizeExternalUrl(item?.sourceUrl || "");
  if (!url) {
    flashEvidenceVaultResult("This saved evidence item has no valid source URL.", "error");
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
  flashEvidenceVaultResult("Source opened in a new tab.", "neutral");
}

function useVaultQuestion(id) {
  const item = (state.evidenceVault || []).find((candidate) => candidate.id === id);
  if (!item) return;
  const question = item.question || `What does this saved evidence change for $${item.ticker}?`;
  els.queryInput.value = question;
  state.selectedTicker = item.ticker || state.selectedTicker;
  syncTickerFocus(question);
  document.querySelector("#desk")?.scrollIntoView({ behavior: "smooth", block: "start" });
  flashEvidenceVaultResult("Vault question loaded into the desk.", "success");
}

function deleteVaultItem(id) {
  const before = state.evidenceVault.length;
  state.evidenceVault = (state.evidenceVault || []).filter((item) => item.id !== id);
  if (state.evidenceVault.length === before) return;
  saveJson(STORAGE_KEYS.evidenceVault, state.evidenceVault);
  renderEvidenceVault();
  renderTrustCenter();
  renderLaunchControlRoom();
  flashEvidenceVaultResult("Evidence item removed.", "neutral");
}

function makeEvidenceVaultJson() {
  const items = state.evidenceVault || [];
  return {
    product: "NiveshScope",
    release: RELEASE_LABEL,
    generatedAt: new Date().toISOString(),
    itemCount: items.length,
    tickers: Array.from(new Set(items.map((item) => item.ticker).filter(Boolean))).sort(),
    sourceStatus: {
      real: items.filter((item) => normalizeSourceStatus(item.sourceStatus) === "real").length,
      imported: items.filter((item) => normalizeSourceStatus(item.sourceStatus) === "imported").length,
      synthetic: items.filter((item) => normalizeSourceStatus(item.sourceStatus) === "synthetic").length
    },
    items
  };
}

function makeEvidenceVaultMarkdown() {
  const vault = makeEvidenceVaultJson();
  const rows = vault.items.map((item, index) => [
    `${index + 1}. ${item.ticker} - ${item.type} - ${item.period}`,
    `   Section: ${item.section}`,
    `   Status: ${shortSourceStatus(item)} | Saved: ${formatShortDate(item.savedAt)}`,
    `   Question: ${item.question || "Not captured"}`,
    `   Evidence: ${snippet(item.text, 320)}`
  ].join("\n")).join("\n\n");
  return [
    `# NiveshScope ${RELEASE_LABEL} Evidence Vault`,
    "",
    `Generated: ${new Date().toLocaleString()}`,
    `Items: ${vault.itemCount}`,
    `Tickers: ${vault.tickers.join(", ") || "None"}`,
    `Source status: ${vault.sourceStatus.real} REAL | ${vault.sourceStatus.imported} IMP | ${vault.sourceStatus.synthetic} SYN`,
    "",
    "## Saved Evidence",
    "",
    rows || "No evidence saved."
  ].join("\n");
}

function formatShortDate(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value || "No date";
  return parsed.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function flashEvidenceVaultResult(message, tone = "neutral") {
  if (!els.evidenceVaultResult) return;
  els.evidenceVaultResult.className = `builder-result is-${tone}`;
  els.evidenceVaultResult.textContent = message;
}

function renderInvestmentGate(options = {}) {
  if (!els.investmentGateSummary || !els.investmentGateChecks) return;
  const audit = makeInvestmentGateAudit();
  if (els.investmentGateStatus) els.investmentGateStatus.textContent = audit.statusLabel;
  if (els.openInvestmentGateGap) els.openInvestmentGateGap.disabled = !audit.nextGap;
  if (els.copyInvestmentGateNote) els.copyInvestmentGateNote.disabled = !audit.hasBrief;

  els.investmentGateSummary.innerHTML = `
    <div class="investment-gate-hero ${escapeAttr(audit.statusClass)}">
      <div>
        <span>${escapeHtml(audit.exportLabel)}</span>
        <strong>${escapeHtml(audit.statusLabel)}</strong>
        <p>${escapeHtml(audit.summary)}</p>
      </div>
      <div class="investment-gate-score">
        <span>Gate score</span>
        <strong>${escapeHtml(audit.score)}%</strong>
      </div>
    </div>
    <div class="investment-gate-metrics">
      <article><span>Focus</span><strong>${escapeHtml(audit.meta.ticker)}</strong><em>${escapeHtml(audit.meta.company)}</em></article>
      <article><span>Confidence</span><strong>${escapeHtml(audit.meta.confidence)}%</strong><em>${escapeHtml(audit.confidenceLabel)}</em></article>
      <article><span>Evidence</span><strong>${escapeHtml(audit.meta.evidenceQuality)}%</strong><em>${escapeHtml(audit.evidenceLabel)}</em></article>
      <article><span>REAL coverage</span><strong>${escapeHtml(audit.meta.realSourceCount)}/${escapeHtml(audit.meta.requiredSourceCount)}</strong><em>${escapeHtml(audit.coverageLabel)}</em></article>
    </div>
  `;

  els.investmentGateChecks.innerHTML = audit.checks.map((check) => `
    <article class="investment-gate-check ${escapeAttr(check.severity)}">
      <span>${check.passed ? "Pass" : check.required ? "Blocker" : "Review"}</span>
      <strong>${escapeHtml(check.label)}</strong>
      <p>${escapeHtml(check.detail)}</p>
    </article>
  `).join("");

  if (options.focus && els.investmentGateSummary) {
    els.investmentGateSummary.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function makeInvestmentGateAudit() {
  const packet = makeBriefPacket();
  const meta = packet.meta || {};
  const latestReview = getLatestMemoReviewForTicker(meta.ticker);
  const syntheticCount = packet.citations.filter((citation) => normalizeSourceStatus(citation.sourceStatus) === "synthetic").length;
  const importedCount = packet.citations.filter((citation) => normalizeSourceStatus(citation.sourceStatus) === "imported").length;
  const realCitationCount = packet.citations.filter((citation) => normalizeSourceStatus(citation.sourceStatus) === "real").length;
  const sourceTypes = new Set(packet.citations.map((citation) => citation.type));
  const confidence = Number(meta.confidence || 0);
  const evidenceQuality = Number(meta.evidenceQuality || 0);
  const realSourceCount = Number(meta.realSourceCount || 0);
  const requiredSourceCount = Number(meta.requiredSourceCount || REAL_SOURCE_REQUIREMENTS.length);
  const sourceCoveragePercent = requiredSourceCount ? Math.round((realSourceCount / requiredSourceCount) * 100) : 0;

  const checks = [
    {
      label: "Active research answer",
      passed: packet.hasBrief,
      required: true,
      weight: 12,
      detail: packet.hasBrief ? "A current answer is loaded and can be reviewed." : "Run a desk question before this gate can certify anything."
    },
    {
      label: "Evidence depth",
      passed: packet.citations.length >= 3,
      required: true,
      weight: 12,
      detail: `${packet.citations.length} citation${packet.citations.length === 1 ? "" : "s"} retrieved. Target at least 3.`
    },
    {
      label: "Source spread",
      passed: sourceTypes.size >= 2,
      required: false,
      weight: 10,
      detail: `${sourceTypes.size} source type${sourceTypes.size === 1 ? "" : "s"} represented. Prefer annual report plus concall/results/announcement.`
    },
    {
      label: "Evidence quality",
      passed: evidenceQuality >= 80,
      required: true,
      weight: 16,
      detail: evidenceQuality ? `${evidenceQuality}% evidence quality. Investment review target is 80% or better.` : "Evidence quality appears after analysis."
    },
    {
      label: "Confidence discipline",
      passed: confidence >= 75,
      required: false,
      weight: 10,
      detail: confidence ? `${confidence}% model confidence. Treat lower confidence as analyst-review only.` : "Confidence appears after analysis."
    },
    {
      label: "No off-ticker drift",
      passed: Number(meta.mismatchCount || 0) === 0,
      required: true,
      weight: 12,
      detail: meta.mismatchCount ? `${meta.mismatchCount} off-ticker citation issue${meta.mismatchCount === 1 ? "" : "s"} detected.` : "Single-company guard found no off-ticker citation drift."
    },
    {
      label: "REAL citation mix",
      passed: realCitationCount > 0 && syntheticCount === 0,
      required: true,
      weight: 16,
      detail: syntheticCount
        ? `${syntheticCount} SYN citation${syntheticCount === 1 ? "" : "s"} must be replaced before investor use.`
        : `${realCitationCount} REAL and ${importedCount} imported citation${packet.citations.length === 1 ? "" : "s"} in the answer.`
    },
    {
      label: "Company source coverage",
      passed: realSourceCount >= requiredSourceCount,
      required: true,
      weight: 16,
      detail: `${realSourceCount}/${requiredSourceCount} required source types are REAL (${sourceCoveragePercent}%).`
    },
    {
      label: "Human memo review",
      passed: Boolean(latestReview && ["pilot-ready", "committee-ready"].includes(latestReview.decision)),
      required: false,
      weight: 6,
      detail: latestReview
        ? `${getMemoReviewDecisionLabel(latestReview.decision)} saved by ${latestReview.owner}.`
        : "Save a review-room decision before treating the memo as committee-ready."
    }
  ].map((check) => ({
    ...check,
    severity: check.passed ? "is-pass" : check.required ? "is-blocker" : "is-review"
  }));

  const maxScore = checks.reduce((sum, check) => sum + check.weight, 0) || 1;
  const score = Math.round((checks.reduce((sum, check) => sum + (check.passed ? check.weight : 0), 0) / maxScore) * 100);
  const requiredBlockers = checks.filter((check) => check.required && !check.passed);
  const nextGap = packet.nextGap || (packet.gaps || [])[0] || null;
  const hasBrief = packet.hasBrief;
  const statusLabel = !hasBrief
    ? "Run a question first"
    : requiredBlockers.length
      ? "Research review only"
      : score >= 88
        ? "Committee-ready candidate"
        : "Pilot review candidate";
  const statusClass = !hasBrief || requiredBlockers.length ? "is-blocked" : score >= 88 ? "is-ready" : "is-review";
  const exportLabel = !hasBrief
    ? "No export posture"
    : requiredBlockers.length
      ? "PDF/MD marked review-only"
      : score >= 88
        ? "Export posture: committee draft"
        : "Export posture: pilot draft";
  const summary = !hasBrief
    ? "The gate will score the current answer once a desk question has run."
    : requiredBlockers.length
      ? `Do not treat this as investment-use research yet. First blocker: ${requiredBlockers[0].label}.`
      : score >= 88
        ? "The answer has passed the required source, guard, and quality checks. Human judgement is still required."
        : "Required blockers are clear, but at least one review item remains before committee circulation.";

  return {
    hasBrief,
    packet,
    checks,
    requiredBlockers,
    nextGap,
    score,
    statusLabel,
    statusClass,
    exportLabel,
    summary,
    confidenceLabel: confidence >= 75 ? "meets review target" : "review carefully",
    evidenceLabel: evidenceQuality >= 80 ? "strong enough for review" : "needs evidence work",
    coverageLabel: realSourceCount >= requiredSourceCount ? "complete" : "incomplete",
    meta: {
      ticker: meta.ticker || state.selectedTicker || "Desk",
      company: meta.company || getCompany(meta.ticker)?.name || "Research desk",
      confidence,
      evidenceQuality,
      realSourceCount,
      requiredSourceCount,
      question: meta.question || "",
      syntheticCount,
      realCitationCount
    }
  };
}

function getLatestMemoReviewForTicker(ticker) {
  const normalized = normalizeTicker(ticker || "");
  return (state.memoReviews || []).find((review) => normalizeTicker(review.ticker) === normalized) || null;
}

function openInvestmentGateGap() {
  const audit = makeInvestmentGateAudit();
  if (!audit.nextGap) {
    flashInvestmentGateResult("No evidence gap is open for this memo.", "success");
    return;
  }
  loadSourceTaskIntoBuilder(audit.meta.ticker, audit.nextGap.key);
  flashInvestmentGateResult(`${audit.meta.ticker} ${audit.nextGap.label} opened in Source Studio.`, "success");
}

async function copyInvestmentGateNote() {
  const audit = makeInvestmentGateAudit();
  if (!audit.hasBrief) {
    flashInvestmentGateResult("Run a desk question before copying a readiness note.", "error");
    return;
  }
  const copied = await copyTextToClipboard(makeInvestmentGateMarkdown(audit));
  flashInvestmentGateResult(copied ? "Readiness note copied." : "Clipboard blocked. Use the MD export as fallback.", copied ? "success" : "error");
}

function makeInvestmentGateMarkdown(audit) {
  const checks = audit.checks.map((check) => `- ${check.passed ? "PASS" : check.required ? "BLOCKER" : "REVIEW"} | ${check.label}: ${check.detail}`).join("\n");
  return [
    "# NiveshScope Investment Readiness Gate",
    "",
    `Generated: ${new Date().toLocaleString()}`,
    `Focus: ${audit.meta.ticker} - ${audit.meta.company}`,
    `Gate status: ${audit.statusLabel}`,
    `Gate score: ${audit.score}%`,
    `Export posture: ${audit.exportLabel}`,
    "",
    "## Summary",
    "",
    audit.summary,
    "",
    "## Checks",
    "",
    checks,
    "",
    "_This gate is a product control, not investment advice. Human source review remains required._"
  ].join("\n");
}

function flashInvestmentGateResult(message, tone = "neutral") {
  if (!els.investmentGateResult) return;
  els.investmentGateResult.className = `builder-result is-${tone}`;
  els.investmentGateResult.textContent = message;
}

function renderBriefWorkbench() {
  if (!els.briefWorkbenchSummary || !els.briefReadinessGrid || !els.briefSourceMap) return;
  const packet = makeBriefPacket();
  if (els.briefWorkbenchStatus) {
    els.briefWorkbenchStatus.textContent = packet.statusLabel;
  }
  if (els.copyBriefPacket) els.copyBriefPacket.disabled = !packet.hasBrief;
  if (els.exportBriefPacketJson) els.exportBriefPacketJson.disabled = !packet.hasBrief;
  if (els.openBriefNextGap) els.openBriefNextGap.disabled = !packet.nextGap;

  if (!packet.hasBrief) {
    els.briefWorkbenchSummary.innerHTML = `
      <div class="brief-workbench-empty">
        <strong>Run a desk question to assemble a memo packet.</strong>
        <p>The workbench will convert the current answer into a committee-ready checklist with evidence quality, source gaps, and export actions.</p>
      </div>
    `;
  } else {
    els.briefWorkbenchSummary.innerHTML = `
      <div class="brief-workbench-hero ${escapeAttr(packet.statusClass)}">
        <div>
          <span>${escapeHtml(packet.statusLabel)}</span>
          <strong>${escapeHtml(packet.meta.ticker)} - ${escapeHtml(packet.meta.intentLabel || "Research memo")}</strong>
          <p>${escapeHtml(packet.headline)}</p>
        </div>
        <div class="brief-score">
          <span>Memo score</span>
          <strong>${escapeHtml(packet.score)}%</strong>
        </div>
      </div>
    `;
  }

  els.briefReadinessGrid.innerHTML = packet.checks.map((check) => `
    <article class="brief-check-card ${check.passed ? "is-pass" : "is-open"}">
      <span>${check.passed ? "Ready" : "Open"}</span>
      <strong>${escapeHtml(check.label)}</strong>
      <p>${escapeHtml(check.detail)}</p>
    </article>
  `).join("");

  const sourceRows = packet.citations.length
    ? packet.citations.slice(0, 6).map((citation) => `
        <div class="brief-source-row">
          <span>${escapeHtml(citation.citationId || "C")}</span>
          <strong>${escapeHtml(citation.ticker)} ${escapeHtml(citation.type)}</strong>
          <em>${escapeHtml(shortSourceStatus(citation))} | ${escapeHtml(citation.section || "Evidence")}</em>
        </div>
      `).join("")
    : `<div class="empty-list">No evidence stack yet. Run analysis first.</div>`;

  const gapRows = packet.gaps.length
    ? packet.gaps.slice(0, 4).map((gap) => `
        <div class="brief-gap-row ${escapeAttr(gap.className)}">
          <strong>${escapeHtml(gap.label)}</strong>
          <span>${escapeHtml(gap.status)}</span>
        </div>
      `).join("")
    : `<div class="brief-gap-row is-real"><strong>Required source gaps</strong><span>All REAL</span></div>`;

  els.briefSourceMap.innerHTML = `
    <div class="brief-source-column">
      <div class="brief-source-heading">
        <span>Evidence used</span>
        <strong>${escapeHtml(packet.citations.length)} citations</strong>
      </div>
      ${sourceRows}
    </div>
    <div class="brief-source-column">
      <div class="brief-source-heading">
        <span>Open source gaps</span>
        <strong>${escapeHtml(packet.gaps.length)} remaining</strong>
      </div>
      ${gapRows}
    </div>
  `;
}

function makeBriefPacket() {
  const hasBrief = Boolean(state.lastBrief && (state.lastAnswerMeta || state.currentCitations.length));
  const fallbackTicker = state.selectedTicker || getDefaultWatchlistTickers()[0] || "DESK";
  const inferred = hasBrief ? (state.lastAnswerMeta || inferBriefMetaFromText(state.lastBrief)) : {};
  const ticker = normalizeTicker(inferred.ticker || fallbackTicker);
  const company = getCompany(ticker);
  const readiness = makeStarterPackCompany(company ? company.ticker : fallbackTicker);
  const citations = state.currentCitations || [];
  const sourceTypes = new Set(citations.map((citation) => citation.type));
  const syntheticCount = citations.filter((citation) => normalizeSourceStatus(citation.sourceStatus) === "synthetic").length;
  const realCount = citations.filter((citation) => normalizeSourceStatus(citation.sourceStatus) === "real").length;
  const gaps = readiness ? readiness.checklist.filter((item) => item.statusKey !== "real") : [];
  const nextGap = readiness && readiness.next && readiness.next.statusKey !== "real" ? readiness.next : null;
  const evidenceQuality = Number(inferred.evidenceQuality || 0);
  const mismatchCount = Number(inferred.mismatchCount || 0);
  const checks = [
    {
      label: "Question and answer",
      passed: hasBrief,
      weight: 15,
      detail: hasBrief ? "A current research answer is loaded in the desk." : "Run a question before creating a memo packet."
    },
    {
      label: "Evidence stack",
      passed: citations.length >= 3,
      weight: 20,
      detail: `${citations.length} cited passage${citations.length === 1 ? "" : "s"} retrieved. Target at least 3.`
    },
    {
      label: "Source spread",
      passed: sourceTypes.size >= 2,
      weight: 15,
      detail: `${sourceTypes.size} source type${sourceTypes.size === 1 ? "" : "s"} represented in the answer.`
    },
    {
      label: "Evidence guard",
      passed: evidenceQuality >= 75 && mismatchCount === 0,
      weight: 20,
      detail: evidenceQuality ? `${evidenceQuality}% evidence quality with ${mismatchCount} off-ticker issue${mismatchCount === 1 ? "" : "s"}.` : "Evidence quality appears after analysis."
    },
    {
      label: "REAL citation mix",
      passed: realCount > 0 && syntheticCount === 0,
      weight: 15,
      detail: syntheticCount ? `${syntheticCount} SYN citation${syntheticCount === 1 ? "" : "s"} still need replacement.` : `${realCount} REAL citation${realCount === 1 ? "" : "s"} in the answer.`
    },
    {
      label: "Company source coverage",
      passed: Boolean(readiness && readiness.investmentReady),
      weight: 15,
      detail: readiness ? `${readiness.realCount}/${readiness.checklist.length} required source types are REAL.` : "Select a covered company to assess source readiness."
    }
  ];
  const maxScore = checks.reduce((sum, check) => sum + check.weight, 0) || 1;
  const score = Math.round((checks.reduce((sum, check) => sum + (check.passed ? check.weight : 0), 0) / maxScore) * 100);
  const statusLabel = !hasBrief
    ? "No brief yet"
    : score >= 85 && syntheticCount === 0
      ? "Committee review ready"
      : score >= 65
        ? "Pilot memo ready"
        : "Evidence work needed";
  const statusClass = score >= 85 && syntheticCount === 0 ? "is-ready" : score >= 65 ? "is-review" : "is-blocked";
  const meta = {
    ticker: company ? company.ticker : ticker,
    company: company ? company.name : inferred.company || ticker,
    intentLabel: inferred.intentLabel || "Research",
    confidence: Number(inferred.confidence || 0),
    evidenceQuality,
    mismatchCount,
    investmentReadinessLabel: readiness ? readiness.label : "Unknown readiness",
    realSourceCount: readiness ? readiness.realCount : 0,
    requiredSourceCount: readiness ? readiness.checklist.length : REAL_SOURCE_REQUIREMENTS.length,
    question: inferred.question || els.queryInput?.value || ""
  };
  return {
    hasBrief,
    meta,
    readiness,
    citations,
    gaps,
    nextGap,
    checks,
    score,
    statusLabel,
    statusClass,
    headline: hasBrief ? makeBriefPacketHeadline(state.lastBrief, meta) : "No current answer loaded."
  };
}

function makeBriefPacketHeadline(body, meta) {
  const candidate = String(body || "")
    .split(/\n/)
    .map((line) => line.trim())
    .find((line) => line && !/^(Evidence quality|Management tone|Ticker focus|Investment readiness):/i.test(line));
  return candidate || `${meta.ticker} research memo`;
}

async function copyBriefPacket() {
  const packet = makeBriefPacket();
  if (!packet.hasBrief) {
    flashBriefWorkbenchResult("Run a desk question before copying a memo packet.", "error");
    return;
  }
  const copied = await copyTextToClipboard(makeBriefPacketMarkdown(packet));
  flashBriefWorkbenchResult(copied ? "Memo packet copied." : "Clipboard blocked. Use MD export from the top bar as a fallback.", copied ? "success" : "error");
}

function exportBriefPacketJson() {
  const packet = makeBriefPacket();
  if (!packet.hasBrief) {
    flashBriefWorkbenchResult("Run a desk question before exporting a packet.", "error");
    return;
  }
  const date = new Date().toISOString().slice(0, 10);
  const filename = `niveshscope-${String(packet.meta.ticker || "desk").toLowerCase()}-memo-packet-${date}.json`;
  downloadTextFile(filename, JSON.stringify(makeBriefPacketJson(packet), null, 2), "application/json;charset=utf-8");
  flashBriefWorkbenchResult("Memo packet JSON exported.", "success");
}

function openBriefNextGap() {
  const packet = makeBriefPacket();
  if (!packet.nextGap) {
    flashBriefWorkbenchResult("No source gap is open for this company.", "success");
    return;
  }
  loadSourceTaskIntoBuilder(packet.meta.ticker, packet.nextGap.key);
  flashBriefWorkbenchResult(`${packet.meta.ticker} ${packet.nextGap.label} opened in Source Studio.`, "success");
}

function makeBriefPacketMarkdown(packet) {
  const citationText = packet.citations.length
    ? packet.citations.map((citation) => `- ${citation.citationId || "C"} | ${citation.ticker} | ${citation.type} | ${citation.section}: ${snippet(citation.text, 280)}`).join("\n")
    : "- No citations captured.";
  const checksText = packet.checks.map((check) => `- ${check.passed ? "READY" : "OPEN"} | ${check.label}: ${check.detail}`).join("\n");
  const gapsText = packet.gaps.length
    ? packet.gaps.map((gap) => `- ${gap.label}: ${gap.status}`).join("\n")
    : "- No required source gaps.";
  return [
    "# NiveshScope Memo Packet",
    "",
    `Generated: ${new Date().toLocaleString()}`,
    `Focus: ${packet.meta.ticker} - ${packet.meta.company}`,
    `Status: ${packet.statusLabel} (${packet.score}%)`,
    `Confidence: ${packet.meta.confidence}%`,
    `Evidence quality: ${packet.meta.evidenceQuality}%`,
    `Real-source coverage: ${packet.meta.realSourceCount}/${packet.meta.requiredSourceCount}`,
    "",
    "## Question",
    "",
    packet.meta.question || "No question captured.",
    "",
    "## Brief",
    "",
    state.lastBrief || "No brief available.",
    "",
    "## Memo Readiness",
    "",
    checksText,
    "",
    "## Evidence Used",
    "",
    citationText,
    "",
    "## Open Source Gaps",
    "",
    gapsText,
    "",
    "_NiveshScope is research software, not investment advice. Verify real sources before relying on any memo._"
  ].join("\n");
}

function makeBriefPacketJson(packet) {
  return {
    product: "NiveshScope",
    version: DATA_VERSION,
    generatedAt: new Date().toISOString(),
    status: packet.statusLabel,
    score: packet.score,
    meta: packet.meta,
    checks: packet.checks.map(({ label, passed, detail }) => ({ label, passed, detail })),
    openGaps: packet.gaps.map((gap) => ({
      key: gap.key,
      label: gap.label,
      status: gap.status
    })),
    citations: packet.citations.map((citation) => ({
      citationId: citation.citationId,
      ticker: citation.ticker,
      company: citation.company,
      type: citation.type,
      period: citation.period,
      section: citation.section,
      sourceStatus: normalizeSourceStatus(citation.sourceStatus),
      sourceUrl: citation.sourceUrl || "",
      text: snippet(citation.text, 600)
    })),
    brief: state.lastBrief
  };
}

function flashBriefWorkbenchResult(message, tone = "neutral") {
  if (!els.briefWorkbenchResult) return;
  els.briefWorkbenchResult.className = `builder-result is-${tone}`;
  els.briefWorkbenchResult.textContent = message;
}

function renderMemoReviewRoom() {
  if (!els.memoReviewContext || !els.memoReviewList) return;
  const packet = makeBriefPacket();
  if (els.saveMemoReview) els.saveMemoReview.disabled = !packet.hasBrief;
  if (els.exportMemoReviews) els.exportMemoReviews.disabled = !state.memoReviews.length;
  if (els.copyMemoReviews) els.copyMemoReviews.disabled = !state.memoReviews.length;
  if (els.clearMemoReviews) els.clearMemoReviews.disabled = !state.memoReviews.length;
  if (els.memoReviewCount) {
    els.memoReviewCount.textContent = `${state.memoReviews.length} review${state.memoReviews.length === 1 ? "" : "s"}`;
  }

  els.memoReviewContext.innerHTML = packet.hasBrief
    ? `
      <div class="memo-review-context-card ${escapeAttr(packet.statusClass)}">
        <div>
          <span>Current memo</span>
          <strong>${escapeHtml(packet.meta.ticker)} - ${escapeHtml(packet.statusLabel)}</strong>
          <p>${escapeHtml(packet.headline)}</p>
        </div>
        <div>
          <span>Score</span>
          <strong>${escapeHtml(packet.score)}%</strong>
          <p>${escapeHtml(packet.meta.realSourceCount)}/${escapeHtml(packet.meta.requiredSourceCount)} REAL source types</p>
        </div>
      </div>
    `
    : `
      <div class="memo-review-context-card is-blocked">
        <div>
          <span>No active memo</span>
          <strong>Run a question before saving a review.</strong>
          <p>The review room records human judgement after the desk creates a memo packet.</p>
        </div>
      </div>
    `;

  if (!state.memoReviews.length) {
    els.memoReviewList.innerHTML = `<div class="empty-list">Saved review decisions will appear here with decision, conviction, owner, and open risks.</div>`;
    return;
  }

  els.memoReviewList.innerHTML = state.memoReviews.map((review) => `
    <article class="memo-review-card ${escapeAttr(review.decision)}">
      <div class="memo-review-card-head">
        <div>
          <span>${escapeHtml(review.ticker)} - ${escapeHtml(review.company)}</span>
          <strong>${escapeHtml(getMemoReviewDecisionLabel(review.decision))}</strong>
        </div>
        <em>${escapeHtml(review.createdLabel)}</em>
      </div>
      <div class="memo-review-card-grid">
        <div><span>Memo score</span><strong>${escapeHtml(review.score)}%</strong></div>
        <div><span>Conviction</span><strong>${escapeHtml(review.conviction)}</strong></div>
        <div><span>Owner</span><strong>${escapeHtml(review.owner)}</strong></div>
      </div>
      <p>${escapeHtml(review.note || "No review note added.")}</p>
      <p class="memo-review-risk">${escapeHtml(review.openRisk || "No open risk recorded.")}</p>
      <div class="note-actions">
        <button type="button" data-review-delete="${escapeAttr(review.id)}">Delete</button>
      </div>
    </article>
  `).join("");

  els.memoReviewList.querySelectorAll("button[data-review-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteMemoReview(button.dataset.reviewDelete));
  });
}

function saveMemoReview() {
  const packet = makeBriefPacket();
  if (!packet.hasBrief) {
    flashMemoReviewResult("Run a desk question before saving a memo review.", "error");
    return;
  }
  const review = normalizeMemoReview({
    id: `review-${Date.now()}`,
    createdAt: new Date().toISOString(),
    createdLabel: new Date().toLocaleString(),
    decision: els.memoReviewDecision?.value || "needs-source-work",
    conviction: els.memoReviewConviction?.value || "Medium",
    owner: (els.memoReviewOwner?.value || "Research desk").trim().slice(0, 60),
    note: (els.memoReviewNote?.value || "").trim().slice(0, 1200),
    openRisk: (els.memoReviewRisk?.value || "").trim().slice(0, 900),
    ticker: packet.meta.ticker,
    company: packet.meta.company,
    status: packet.statusLabel,
    score: packet.score,
    confidence: packet.meta.confidence,
    evidenceQuality: packet.meta.evidenceQuality,
    realSourceCount: packet.meta.realSourceCount,
    requiredSourceCount: packet.meta.requiredSourceCount,
    question: packet.meta.question,
    headline: packet.headline,
    checks: packet.checks.map(({ label, passed, detail }) => ({ label, passed, detail })),
    openGaps: packet.gaps.map((gap) => ({ key: gap.key, label: gap.label, status: gap.status })),
    citations: packet.citations.map((citation) => ({
      citationId: citation.citationId,
      ticker: citation.ticker,
      type: citation.type,
      period: citation.period,
      section: citation.section,
      sourceStatus: normalizeSourceStatus(citation.sourceStatus)
    }))
  });
  state.memoReviews = [review, ...state.memoReviews].slice(0, 30);
  saveJson(STORAGE_KEYS.memoReviews, state.memoReviews);
  if (els.memoReviewNote) els.memoReviewNote.value = "";
  if (els.memoReviewRisk) els.memoReviewRisk.value = "";
  renderMemoReviewRoom();
  renderInvestmentGate();
  renderDecisionJournal();
  renderReviewRadar();
  renderPortfolioWatchtower();
  renderCatalystCalendar();
  renderDailyBriefing();
  renderDeskTaskBoard();
  renderResearchSprintPlanner();
  renderIcMemoBuilder();
  renderClaimTraceInspector();
      renderAnswerQualityLab();
  renderLaunchControlRoom();
  flashMemoReviewResult(`${getMemoReviewDecisionLabel(review.decision)} saved for ${review.ticker}.`, "success");
}

function normalizeMemoReview(review) {
  const decision = ["needs-source-work", "pilot-ready", "committee-ready", "watchlist-only", "reject-thesis"].includes(review.decision)
    ? review.decision
    : "needs-source-work";
  return {
    id: String(review.id || `review-${Date.now()}`),
    createdAt: review.createdAt || new Date().toISOString(),
    createdLabel: review.createdLabel || (review.createdAt ? new Date(review.createdAt).toLocaleString() : new Date().toLocaleString()),
    decision,
    conviction: ["Low", "Medium", "High"].includes(review.conviction) ? review.conviction : "Medium",
    owner: String(review.owner || "Research desk").slice(0, 60),
    note: String(review.note || "").slice(0, 1200),
    openRisk: String(review.openRisk || "").slice(0, 900),
    ticker: normalizeTicker(review.ticker || "DESK"),
    company: String(review.company || review.ticker || "Research desk").slice(0, 120),
    status: String(review.status || "Review saved").slice(0, 80),
    score: Number(review.score || 0),
    confidence: Number(review.confidence || 0),
    evidenceQuality: Number(review.evidenceQuality || 0),
    realSourceCount: Number(review.realSourceCount || 0),
    requiredSourceCount: Number(review.requiredSourceCount || REAL_SOURCE_REQUIREMENTS.length),
    question: String(review.question || "").slice(0, 500),
    headline: String(review.headline || "").slice(0, 500),
    checks: Array.isArray(review.checks) ? review.checks : [],
    openGaps: Array.isArray(review.openGaps) ? review.openGaps : [],
    citations: Array.isArray(review.citations) ? review.citations : []
  };
}

function getMemoReviewDecisionLabel(decision) {
  const labels = {
    "needs-source-work": "Needs source work",
    "pilot-ready": "Pilot memo ready",
    "committee-ready": "Committee review ready",
    "watchlist-only": "Watchlist only",
    "reject-thesis": "Reject thesis"
  };
  return labels[decision] || labels["needs-source-work"];
}

function exportMemoReviewLog() {
  if (!state.memoReviews.length) {
    flashMemoReviewResult("No review log to export yet.", "error");
    return;
  }
  const date = new Date().toISOString().slice(0, 10);
  const filename = `niveshscope-memo-review-log-${date}.json`;
  downloadTextFile(filename, JSON.stringify(makeMemoReviewLogJson(), null, 2), "application/json;charset=utf-8");
  flashMemoReviewResult("Review log JSON exported.", "success");
}

async function copyMemoReviewLog() {
  if (!state.memoReviews.length) {
    flashMemoReviewResult("No review log to copy yet.", "error");
    return;
  }
  const copied = await copyTextToClipboard(makeMemoReviewLogMarkdown());
  flashMemoReviewResult(copied ? "Review log copied." : "Clipboard blocked. Use export instead.", copied ? "success" : "error");
}

function clearMemoReviews() {
  state.memoReviews = [];
  saveJson(STORAGE_KEYS.memoReviews, state.memoReviews);
  renderMemoReviewRoom();
  renderInvestmentGate();
  renderDecisionJournal();
  renderReviewRadar();
  renderPortfolioWatchtower();
  renderCatalystCalendar();
  renderDailyBriefing();
  renderDeskTaskBoard();
  renderResearchSprintPlanner();
  renderIcMemoBuilder();
  renderClaimTraceInspector();
      renderAnswerQualityLab();
  renderLaunchControlRoom();
  flashMemoReviewResult("Review log cleared.", "neutral");
}

function deleteMemoReview(reviewId) {
  state.memoReviews = state.memoReviews.filter((review) => review.id !== reviewId);
  saveJson(STORAGE_KEYS.memoReviews, state.memoReviews);
  renderMemoReviewRoom();
  renderInvestmentGate();
  renderDecisionJournal();
  renderReviewRadar();
  renderPortfolioWatchtower();
  renderCatalystCalendar();
  renderDailyBriefing();
  renderDeskTaskBoard();
  renderResearchSprintPlanner();
  renderIcMemoBuilder();
  renderClaimTraceInspector();
      renderAnswerQualityLab();
  renderLaunchControlRoom();
}

function makeMemoReviewLogJson() {
  return {
    product: "NiveshScope",
    version: DATA_VERSION,
    generatedAt: new Date().toISOString(),
    reviewCount: state.memoReviews.length,
    reviews: state.memoReviews
  };
}

function makeMemoReviewLogMarkdown() {
  const reviews = state.memoReviews.map((review, index) => {
    const gaps = review.openGaps.length
      ? review.openGaps.map((gap) => `${gap.label}: ${gap.status}`).join("; ")
      : "No open source gaps recorded.";
    return [
      `## ${index + 1}. ${review.ticker} - ${getMemoReviewDecisionLabel(review.decision)}`,
      "",
      `Created: ${review.createdLabel}`,
      `Company: ${review.company}`,
      `Status: ${review.status} (${review.score}%)`,
      `Confidence: ${review.confidence}% | Evidence quality: ${review.evidenceQuality}%`,
      `Conviction: ${review.conviction} | Owner: ${review.owner}`,
      "",
      `Question: ${review.question || "No question captured."}`,
      `Headline: ${review.headline || "No headline captured."}`,
      "",
      `Review note: ${review.note || "No note."}`,
      `Open risk: ${review.openRisk || "No open risk."}`,
      `Source gaps: ${gaps}`
    ].join("\n");
  }).join("\n\n");
  return [
    "# NiveshScope Memo Review Log",
    "",
    `Generated: ${new Date().toLocaleString()}`,
    `Reviews: ${state.memoReviews.length}`,
    "",
    reviews,
    "",
    "_Review decisions are human workflow notes. They are not investment advice._"
  ].join("\n");
}

function flashMemoReviewResult(message, tone = "neutral") {
  if (!els.memoReviewResult) return;
  els.memoReviewResult.className = `builder-result is-${tone}`;
  els.memoReviewResult.textContent = message;
}

function renderDecisionJournal() {
  if (!els.decisionJournalContext || !els.decisionJournalList) return;
  const packet = makeBriefPacket();
  const gate = makeInvestmentGateAudit();
  if (els.saveDecisionJournalEntry) els.saveDecisionJournalEntry.disabled = !packet.hasBrief;
  if (els.exportDecisionJournal) els.exportDecisionJournal.disabled = !state.decisionJournal.length;
  if (els.copyDecisionJournal) els.copyDecisionJournal.disabled = !state.decisionJournal.length;
  if (els.clearDecisionJournal) els.clearDecisionJournal.disabled = !state.decisionJournal.length;
  if (els.decisionJournalCount) {
    els.decisionJournalCount.textContent = `${state.decisionJournal.length} decision${state.decisionJournal.length === 1 ? "" : "s"}`;
  }
  if (els.decisionJournalDate && !els.decisionJournalDate.value) {
    els.decisionJournalDate.value = makeDefaultReviewDate();
  }

  els.decisionJournalContext.innerHTML = packet.hasBrief
    ? `
      <div class="decision-journal-context-card ${escapeAttr(gate.statusClass)}">
        <div>
          <span>Current memo</span>
          <strong>${escapeHtml(packet.meta.ticker)} - ${escapeHtml(gate.statusLabel)}</strong>
          <p>${escapeHtml(packet.headline)}</p>
        </div>
        <div>
          <span>Gate score</span>
          <strong>${escapeHtml(gate.score)}%</strong>
          <p>${escapeHtml(gate.exportLabel)}</p>
        </div>
      </div>
    `
    : `
      <div class="decision-journal-context-card is-blocked">
        <div>
          <span>No active memo</span>
          <strong>Run a question before saving a research decision.</strong>
          <p>The journal attaches a decision to the current memo, readiness gate, and valuation context.</p>
        </div>
      </div>
    `;

  if (!state.decisionJournal.length) {
    els.decisionJournalList.innerHTML = `<div class="empty-list">Saved research decisions will appear here with thesis strength, gate score, next review, and open evidence task.</div>`;
    return;
  }

  els.decisionJournalList.innerHTML = state.decisionJournal.map((entry) => `
    <article class="decision-journal-card ${escapeAttr(entry.decision)}">
      <div class="decision-journal-card-head">
        <div>
          <span>${escapeHtml(entry.ticker)} - ${escapeHtml(entry.company)}</span>
          <strong>${escapeHtml(getDecisionJournalLabel(entry.decision))}</strong>
        </div>
        <em>${escapeHtml(entry.createdLabel)}</em>
      </div>
      <div class="decision-journal-grid">
        <div><span>Gate</span><strong>${escapeHtml(entry.gateScore)}%</strong><em>${escapeHtml(entry.gateStatus)}</em></div>
        <div><span>Thesis</span><strong>${escapeHtml(entry.thesisStrength)}</strong><em>${escapeHtml(entry.reviewHorizon)}</em></div>
        <div><span>Review date</span><strong>${escapeHtml(entry.nextReviewDate || "Open")}</strong><em>${escapeHtml(entry.owner)}</em></div>
      </div>
      <p>${escapeHtml(entry.note || "No decision note added.")}</p>
      <p class="decision-journal-risk">${escapeHtml(entry.triggerNote || "No trigger or kill criteria recorded.")}</p>
      <p class="decision-journal-task">${escapeHtml(entry.evidenceTask || "No next evidence task recorded.")}</p>
      <div class="note-actions">
        <button type="button" data-decision-delete="${escapeAttr(entry.id)}">Delete</button>
      </div>
    </article>
  `).join("");

  els.decisionJournalList.querySelectorAll("button[data-decision-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteDecisionJournalEntry(button.dataset.decisionDelete));
  });
}

function saveDecisionJournalEntry() {
  const packet = makeBriefPacket();
  if (!packet.hasBrief) {
    flashDecisionJournalResult("Run a desk question before saving a research decision.", "error");
    return;
  }
  const gate = makeInvestmentGateAudit();
  const latestReview = getLatestMemoReviewForTicker(packet.meta.ticker);
  const entry = normalizeDecisionEntry({
    id: `decision-${Date.now()}`,
    createdAt: new Date().toISOString(),
    createdLabel: new Date().toLocaleString(),
    decision: els.decisionJournalDecision?.value || "needs-source-work",
    thesisStrength: els.decisionJournalStrength?.value || "Medium",
    reviewHorizon: els.decisionJournalHorizon?.value || "Quarterly review",
    nextReviewDate: els.decisionJournalDate?.value || "",
    owner: (els.decisionJournalOwner?.value || "Research desk").trim().slice(0, 60),
    note: (els.decisionJournalNote?.value || "").trim().slice(0, 1400),
    triggerNote: (els.decisionJournalTrigger?.value || "").trim().slice(0, 1000),
    evidenceTask: (els.decisionJournalEvidenceTask?.value || "").trim().slice(0, 1000),
    ticker: packet.meta.ticker,
    company: packet.meta.company,
    question: packet.meta.question,
    headline: packet.headline,
    memoStatus: packet.statusLabel,
    memoScore: packet.score,
    gateStatus: gate.statusLabel,
    gateScore: gate.score,
    exportPosture: gate.exportLabel,
    gateBlocker: gate.requiredBlockers[0]?.label || "",
    confidence: packet.meta.confidence,
    evidenceQuality: packet.meta.evidenceQuality,
    realSourceCount: packet.meta.realSourceCount,
    requiredSourceCount: packet.meta.requiredSourceCount,
    reviewDecision: latestReview ? getMemoReviewDecisionLabel(latestReview.decision) : "",
    valuation: getCurrentValuationSnapshot(packet.meta.ticker),
    citations: packet.citations.map((citation) => ({
      citationId: citation.citationId,
      ticker: citation.ticker,
      type: citation.type,
      period: citation.period,
      section: citation.section,
      sourceStatus: normalizeSourceStatus(citation.sourceStatus)
    }))
  });
  state.decisionJournal = [entry, ...state.decisionJournal].slice(0, 50);
  saveJson(STORAGE_KEYS.decisionJournal, state.decisionJournal);
  if (els.decisionJournalNote) els.decisionJournalNote.value = "";
  if (els.decisionJournalTrigger) els.decisionJournalTrigger.value = "";
  if (els.decisionJournalEvidenceTask) els.decisionJournalEvidenceTask.value = "";
  renderDecisionJournal();
  renderReviewRadar();
  renderPortfolioWatchtower();
  renderCatalystCalendar();
  renderDailyBriefing();
  renderDeskTaskBoard();
  renderResearchSprintPlanner();
  renderIcMemoBuilder();
  renderClaimTraceInspector();
      renderAnswerQualityLab();
  renderLaunchControlRoom();
  flashDecisionJournalResult(`${getDecisionJournalLabel(entry.decision)} saved for ${entry.ticker}.`, "success");
}

function normalizeDecisionEntry(entry) {
  const decisions = ["needs-source-work", "watchlist-candidate", "committee-candidate", "monitor-only", "reject-thesis"];
  const decision = decisions.includes(entry.decision) ? entry.decision : "needs-source-work";
  return {
    id: String(entry.id || `decision-${Date.now()}`),
    createdAt: entry.createdAt || new Date().toISOString(),
    createdLabel: entry.createdLabel || (entry.createdAt ? new Date(entry.createdAt).toLocaleString() : new Date().toLocaleString()),
    decision,
    thesisStrength: ["Low", "Medium", "High"].includes(entry.thesisStrength) ? entry.thesisStrength : "Medium",
    reviewHorizon: String(entry.reviewHorizon || "Quarterly review").slice(0, 60),
    nextReviewDate: String(entry.nextReviewDate || "").slice(0, 20),
    owner: String(entry.owner || "Research desk").slice(0, 60),
    note: String(entry.note || "").slice(0, 1400),
    triggerNote: String(entry.triggerNote || "").slice(0, 1000),
    evidenceTask: String(entry.evidenceTask || "").slice(0, 1000),
    ticker: normalizeTicker(entry.ticker || "DESK"),
    company: String(entry.company || entry.ticker || "Research desk").slice(0, 120),
    question: String(entry.question || "").slice(0, 500),
    headline: String(entry.headline || "").slice(0, 500),
    memoStatus: String(entry.memoStatus || "No memo status").slice(0, 80),
    memoScore: Number(entry.memoScore || 0),
    gateStatus: String(entry.gateStatus || "Not checked").slice(0, 80),
    gateScore: Number(entry.gateScore || 0),
    exportPosture: String(entry.exportPosture || "").slice(0, 120),
    gateBlocker: String(entry.gateBlocker || "").slice(0, 120),
    confidence: Number(entry.confidence || 0),
    evidenceQuality: Number(entry.evidenceQuality || 0),
    realSourceCount: Number(entry.realSourceCount || 0),
    requiredSourceCount: Number(entry.requiredSourceCount || REAL_SOURCE_REQUIREMENTS.length),
    reviewDecision: String(entry.reviewDecision || "").slice(0, 80),
    valuation: entry.valuation && typeof entry.valuation === "object" ? entry.valuation : {},
    citations: Array.isArray(entry.citations) ? entry.citations : []
  };
}

function getDecisionJournalLabel(decision) {
  const labels = {
    "needs-source-work": "Needs source work",
    "watchlist-candidate": "Watchlist candidate",
    "committee-candidate": "Committee candidate",
    "monitor-only": "Monitor only",
    "reject-thesis": "Reject thesis"
  };
  return labels[decision] || labels["needs-source-work"];
}

function getCurrentValuationSnapshot(ticker) {
  return {
    ticker: normalizeTicker(ticker || state.selectedTicker || ""),
    valuePerShare: els.valuePerShare?.textContent || "",
    equityValue: els.equityValue?.textContent || "",
    revenueCagr: Number(els.growthSlider?.value || 0),
    fcfMargin: Number(els.marginSlider?.value || 0),
    terminalMultiple: Number(els.multipleSlider?.value || 0),
    discountRate: Number(els.discountSlider?.value || 0)
  };
}

function makeDefaultReviewDate() {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().slice(0, 10);
}

function exportDecisionJournal() {
  if (!state.decisionJournal.length) {
    flashDecisionJournalResult("No decision journal to export yet.", "error");
    return;
  }
  const date = new Date().toISOString().slice(0, 10);
  const filename = `niveshscope-decision-journal-${date}.json`;
  downloadTextFile(filename, JSON.stringify(makeDecisionJournalJson(), null, 2), "application/json;charset=utf-8");
  flashDecisionJournalResult("Decision journal JSON exported.", "success");
}

async function copyDecisionJournal() {
  if (!state.decisionJournal.length) {
    flashDecisionJournalResult("No decision journal to copy yet.", "error");
    return;
  }
  const copied = await copyTextToClipboard(makeDecisionJournalMarkdown());
  flashDecisionJournalResult(copied ? "Decision journal copied." : "Clipboard blocked. Use export instead.", copied ? "success" : "error");
}

function clearDecisionJournal() {
  state.decisionJournal = [];
  saveJson(STORAGE_KEYS.decisionJournal, state.decisionJournal);
  renderDecisionJournal();
  renderReviewRadar();
  renderPortfolioWatchtower();
  renderCatalystCalendar();
  renderDailyBriefing();
  renderDeskTaskBoard();
  renderResearchSprintPlanner();
  renderIcMemoBuilder();
  renderClaimTraceInspector();
      renderAnswerQualityLab();
  renderLaunchControlRoom();
  flashDecisionJournalResult("Decision journal cleared.", "neutral");
}

function deleteDecisionJournalEntry(entryId) {
  state.decisionJournal = state.decisionJournal.filter((entry) => entry.id !== entryId);
  saveJson(STORAGE_KEYS.decisionJournal, state.decisionJournal);
  renderDecisionJournal();
  renderReviewRadar();
  renderPortfolioWatchtower();
  renderCatalystCalendar();
  renderDailyBriefing();
  renderDeskTaskBoard();
  renderResearchSprintPlanner();
  renderIcMemoBuilder();
  renderClaimTraceInspector();
      renderAnswerQualityLab();
  renderLaunchControlRoom();
}

function makeDecisionJournalJson() {
  return {
    product: "NiveshScope",
    version: DATA_VERSION,
    generatedAt: new Date().toISOString(),
    count: state.decisionJournal.length,
    decisions: state.decisionJournal
  };
}

function makeDecisionJournalMarkdown() {
  const decisions = state.decisionJournal.map((entry, index) => [
    `## ${index + 1}. ${entry.ticker} - ${getDecisionJournalLabel(entry.decision)}`,
    "",
    `Created: ${entry.createdLabel}`,
    `Company: ${entry.company}`,
    `Gate: ${entry.gateStatus} (${entry.gateScore}%)`,
    `Memo: ${entry.memoStatus} (${entry.memoScore}%)`,
    `Thesis strength: ${entry.thesisStrength}`,
    `Review horizon: ${entry.reviewHorizon}`,
    `Next review: ${entry.nextReviewDate || "Open"}`,
    `Owner: ${entry.owner}`,
    `REAL coverage: ${entry.realSourceCount}/${entry.requiredSourceCount}`,
    "",
    "Decision note:",
    entry.note || "No decision note.",
    "",
    "Trigger or kill criteria:",
    entry.triggerNote || "No trigger criteria.",
    "",
    "Next evidence task:",
    entry.evidenceTask || "No next evidence task."
  ].join("\n")).join("\n\n");
  return [
    "# NiveshScope Decision Journal",
    "",
    `Generated: ${new Date().toLocaleString()}`,
    `Decisions: ${state.decisionJournal.length}`,
    "",
    decisions,
    "",
    "_Decision journal entries are research workflow notes, not investment advice._"
  ].join("\n");
}

function flashDecisionJournalResult(message, tone = "neutral") {
  if (!els.decisionJournalResult) return;
  els.decisionJournalResult.className = `builder-result is-${tone}`;
  els.decisionJournalResult.textContent = message;
}

function renderReviewRadar() {
  if (!els.reviewRadarSummary || !els.reviewRadarList) return;
  const radar = makeReviewRadar();
  const filter = els.reviewRadarFilter ? els.reviewRadarFilter.value : state.reviewRadarFilter || "all";
  state.reviewRadarFilter = filter;
  const visibleItems = filterReviewRadarItems(radar.items, filter);
  if (els.reviewRadarStatus) {
    els.reviewRadarStatus.textContent = radar.items.length
      ? `${radar.dueCount} due`
      : "No decisions";
  }
  if (els.openNextReview) els.openNextReview.disabled = !radar.nextItem;
  if (els.copyReviewRadar) els.copyReviewRadar.disabled = !radar.items.length;
  if (els.exportReviewRadar) els.exportReviewRadar.disabled = !radar.items.length;

  els.reviewRadarSummary.innerHTML = `
    <div class="review-radar-hero ${escapeAttr(radar.statusClass)}">
      <div>
        <span>${escapeHtml(radar.statusLabel)}</span>
        <strong>${escapeHtml(radar.summaryTitle)}</strong>
        <p>${escapeHtml(radar.summary)}</p>
      </div>
      <div class="review-radar-score">
        <span>Follow-up score</span>
        <strong>${escapeHtml(radar.score)}%</strong>
      </div>
    </div>
    <div class="review-radar-stats">
      <article><span>Due now</span><strong>${escapeHtml(radar.dueCount)}</strong><em>${escapeHtml(radar.overdueCount)} overdue</em></article>
      <article><span>Upcoming</span><strong>${escapeHtml(radar.upcomingCount)}</strong><em>Next 30 days</em></article>
      <article><span>Evidence tasks</span><strong>${escapeHtml(radar.openTaskCount)}</strong><em>From decisions</em></article>
      <article><span>No date</span><strong>${escapeHtml(radar.noDateCount)}</strong><em>Needs schedule</em></article>
    </div>
  `;

  els.reviewRadarList.innerHTML = visibleItems.length
    ? visibleItems.map(renderReviewRadarItem).join("")
    : `<div class="empty-list">${radar.items.length ? "No entries match this radar view." : "Decision Journal entries will appear here as review follow-ups."}</div>`;

  els.reviewRadarList.querySelectorAll("button[data-radar-open]").forEach((button) => {
    button.addEventListener("click", () => openReviewRadarItem(button.dataset.radarOpen));
  });
}

function makeReviewRadar() {
  const items = (state.decisionJournal || [])
    .map(makeReviewRadarItem)
    .sort((a, b) => a.sortRank - b.sortRank || a.dateSort - b.dateSort);
  const dueCount = items.filter((item) => item.statusKey === "due" || item.statusKey === "overdue").length;
  const overdueCount = items.filter((item) => item.statusKey === "overdue").length;
  const upcomingCount = items.filter((item) => item.statusKey === "upcoming").length;
  const openTaskCount = items.filter((item) => item.hasTask).length;
  const noDateCount = items.filter((item) => item.statusKey === "unscheduled").length;
  const nextItem = items.find((item) => item.statusKey === "overdue")
    || items.find((item) => item.statusKey === "due")
    || items.find((item) => item.hasTask)
    || items.find((item) => item.statusKey === "upcoming")
    || items[0]
    || null;
  const total = items.length || 1;
  const score = items.length
    ? Math.max(0, Math.min(100, Math.round(100 - ((overdueCount * 22 + dueCount * 12 + noDateCount * 8) / total))))
    : 0;
  const statusClass = !items.length ? "is-blocked" : overdueCount ? "is-blocked" : dueCount || openTaskCount ? "is-review" : "is-ready";
  const statusLabel = !items.length ? "No decisions logged" : overdueCount ? "Overdue reviews" : dueCount ? "Reviews due" : openTaskCount ? "Evidence tasks open" : "Reviews scheduled";
  const summaryTitle = !items.length
    ? "Decision Journal is empty."
    : nextItem
      ? `${nextItem.ticker} - ${nextItem.statusLabel}`
      : "No follow-up needed.";
  const summary = !items.length
    ? "Save a Decision Journal entry to create a follow-up radar."
    : nextItem
      ? nextItem.summary
      : "All saved decisions have review dates and no open task pressure.";
  return { items, dueCount, overdueCount, upcomingCount, openTaskCount, noDateCount, nextItem, score, statusClass, statusLabel, summaryTitle, summary };
}

function makeReviewRadarItem(entry) {
  const dateInfo = getReviewDateStatus(entry.nextReviewDate);
  const hasTask = Boolean(String(entry.evidenceTask || "").trim());
  const statusKey = dateInfo.statusKey;
  const statusLabel = dateInfo.statusLabel;
  const taskText = hasTask ? entry.evidenceTask : "No evidence task recorded.";
  const dayCount = Math.abs(dateInfo.days);
  const summary = statusKey === "overdue"
    ? `${entry.ticker} review is ${dayCount} day${dayCount === 1 ? "" : "s"} overdue.`
    : statusKey === "due"
      ? `${entry.ticker} review is due now.`
      : statusKey === "upcoming"
        ? `${entry.ticker} review is due in ${dateInfo.days} day${dateInfo.days === 1 ? "" : "s"}.`
        : statusKey === "scheduled"
          ? `${entry.ticker} review is scheduled beyond the next 30 days.`
          : `${entry.ticker} has no dated review scheduled.`;
  const sortRank = statusKey === "overdue" ? 0 : statusKey === "due" ? 1 : hasTask ? 2 : statusKey === "upcoming" ? 3 : statusKey === "scheduled" ? 4 : 5;
  return { ...entry, statusKey, statusLabel, dateText: dateInfo.dateText, daysToReview: dateInfo.days, hasTask, taskText, summary, sortRank, dateSort: dateInfo.dateSort };
}

function getReviewDateStatus(value) {
  const text = String(value || "").trim();
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!text) return { statusKey: "unscheduled", statusLabel: "Unscheduled", dateText: "No review date", days: 9999, dateSort: Number.MAX_SAFE_INTEGER };
  const parsed = new Date(`${text}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return { statusKey: "unscheduled", statusLabel: "Unscheduled", dateText: text, days: 9999, dateSort: Number.MAX_SAFE_INTEGER };
  const days = Math.ceil((parsed.getTime() - todayMidnight.getTime()) / 86400000);
  if (days < 0) return { statusKey: "overdue", statusLabel: "Overdue", dateText: text, days, dateSort: parsed.getTime() };
  if (days <= 7) return { statusKey: "due", statusLabel: "Due now", dateText: text, days, dateSort: parsed.getTime() };
  if (days <= 30) return { statusKey: "upcoming", statusLabel: "Upcoming", dateText: text, days, dateSort: parsed.getTime() };
  return { statusKey: "scheduled", statusLabel: "Scheduled", dateText: text, days, dateSort: parsed.getTime() };
}

function filterReviewRadarItems(items, filter) {
  if (filter === "due") return items.filter((item) => item.statusKey === "due" || item.statusKey === "overdue");
  if (filter === "upcoming") return items.filter((item) => item.statusKey === "upcoming" || item.statusKey === "scheduled");
  if (filter === "tasks") return items.filter((item) => item.hasTask);
  return items;
}

function renderReviewRadarItem(item) {
  return `
    <article class="review-radar-card ${escapeAttr(item.statusKey)}">
      <div class="review-radar-card-head">
        <div>
          <span>${escapeHtml(item.ticker)} - ${escapeHtml(getDecisionJournalLabel(item.decision))}</span>
          <strong>${escapeHtml(item.statusLabel)}</strong>
        </div>
        <em>${escapeHtml(item.dateText)}</em>
      </div>
      <div class="review-radar-grid">
        <div><span>Gate</span><strong>${escapeHtml(item.gateScore)}%</strong><em>${escapeHtml(item.gateStatus)}</em></div>
        <div><span>Thesis</span><strong>${escapeHtml(item.thesisStrength)}</strong><em>${escapeHtml(item.reviewHorizon)}</em></div>
        <div><span>Owner</span><strong>${escapeHtml(item.owner)}</strong><em>${escapeHtml(item.company)}</em></div>
      </div>
      <p>${escapeHtml(item.summary)}</p>
      <p class="review-radar-task">${escapeHtml(item.taskText)}</p>
      <div class="note-actions">
        <button type="button" data-radar-open="${escapeAttr(item.id)}">Open follow-up</button>
      </div>
    </article>
  `;
}

function openNextReview() {
  const radar = makeReviewRadar();
  if (!radar.nextItem) {
    flashReviewRadarResult("No review follow-up is open.", "success");
    return;
  }
  openReviewRadarItem(radar.nextItem.id);
}

function openReviewRadarItem(entryId) {
  const entry = state.decisionJournal.find((item) => item.id === entryId);
  if (!entry) {
    flashReviewRadarResult("That review item is no longer available.", "error");
    return;
  }
  state.selectedTicker = entry.ticker;
  renderValuationOptions();
  renderCompanyDossier();
  updateValuationFromCompany();
  updateValuation();
  const starter = makeStarterPackCompany(entry.ticker);
  const nextGap = starter && starter.next && starter.next.statusKey !== "real" ? starter.next : null;
  if (nextGap) {
    loadSourceTaskIntoBuilder(entry.ticker, nextGap.key);
    flashReviewRadarResult(`${entry.ticker} opened in Source Studio for ${nextGap.label}.`, "success");
    return;
  }
  document.querySelector("#decision-journal")?.scrollIntoView({ behavior: "smooth", block: "start" });
  flashReviewRadarResult(`${entry.ticker} decision opened. Review trigger: ${entry.triggerNote || "No trigger recorded."}`, "neutral");
}

async function copyReviewRadar() {
  const radar = makeReviewRadar();
  if (!radar.items.length) {
    flashReviewRadarResult("No review radar to copy yet.", "error");
    return;
  }
  const copied = await copyTextToClipboard(makeReviewRadarMarkdown(radar));
  flashReviewRadarResult(copied ? "Review radar copied." : "Clipboard blocked. Use export instead.", copied ? "success" : "error");
}

function exportReviewRadar() {
  const radar = makeReviewRadar();
  if (!radar.items.length) {
    flashReviewRadarResult("No review radar to export yet.", "error");
    return;
  }
  const date = new Date().toISOString().slice(0, 10);
  const filename = `niveshscope-review-radar-${date}.json`;
  downloadTextFile(filename, JSON.stringify(makeReviewRadarJson(radar), null, 2), "application/json;charset=utf-8");
  flashReviewRadarResult("Review radar JSON exported.", "success");
}

function makeReviewRadarJson(radar = makeReviewRadar()) {
  return {
    product: "NiveshScope",
    version: DATA_VERSION,
    generatedAt: new Date().toISOString(),
    status: radar.statusLabel,
    score: radar.score,
    dueCount: radar.dueCount,
    overdueCount: radar.overdueCount,
    upcomingCount: radar.upcomingCount,
    openTaskCount: radar.openTaskCount,
    noDateCount: radar.noDateCount,
    items: radar.items
  };
}

function makeReviewRadarMarkdown(radar = makeReviewRadar()) {
  const rows = radar.items.map((item, index) => [
    `## ${index + 1}. ${item.ticker} - ${item.statusLabel}`,
    "",
    `Company: ${item.company}`,
    `Decision: ${getDecisionJournalLabel(item.decision)}`,
    `Review date: ${item.dateText}`,
    `Gate: ${item.gateStatus} (${item.gateScore}%)`,
    `Owner: ${item.owner}`,
    "",
    "Trigger:",
    item.triggerNote || "No trigger recorded.",
    "",
    "Evidence task:",
    item.taskText
  ].join("\n")).join("\n\n");
  return [
    "# NiveshScope Review Radar",
    "",
    `Generated: ${new Date().toLocaleString()}`,
    `Status: ${radar.statusLabel} (${radar.score}%)`,
    `Due: ${radar.dueCount} | Overdue: ${radar.overdueCount} | Upcoming: ${radar.upcomingCount} | Tasks: ${radar.openTaskCount}`,
    "",
    rows,
    "",
    "_Review Radar is a follow-up workflow, not investment advice._"
  ].join("\n");
}

function flashReviewRadarResult(message, tone = "neutral") {
  if (!els.reviewRadarResult) return;
  els.reviewRadarResult.className = `builder-result is-${tone}`;
  els.reviewRadarResult.textContent = message;
}

function renderPortfolioWatchtower() {
  if (!els.portfolioWatchtowerSummary || !els.portfolioWatchtowerList) return;
  const watchtower = makePortfolioWatchtower();
  const filter = els.portfolioWatchtowerFilter ? els.portfolioWatchtowerFilter.value : state.portfolioWatchtowerFilter || "all";
  const sort = els.portfolioWatchtowerSort ? els.portfolioWatchtowerSort.value : state.portfolioWatchtowerSort || "priority";
  state.portfolioWatchtowerFilter = filter;
  state.portfolioWatchtowerSort = sort;
  const visibleRows = sortPortfolioWatchtowerRows(filterPortfolioWatchtowerRows(watchtower.rows, filter), sort);
  if (els.portfolioWatchtowerStatus) {
    els.portfolioWatchtowerStatus.textContent = watchtower.nextRow ? `${watchtower.nextRow.company.ticker} next` : "No companies";
  }
  if (els.openPortfolioAction) els.openPortfolioAction.disabled = !watchtower.nextRow;
  if (els.copyPortfolioWatchtower) els.copyPortfolioWatchtower.disabled = !watchtower.rows.length;
  if (els.exportPortfolioWatchtower) els.exportPortfolioWatchtower.disabled = !watchtower.rows.length;

  els.portfolioWatchtowerSummary.innerHTML = `
    <div class="portfolio-watchtower-hero ${escapeAttr(watchtower.statusClass)}">
      <div>
        <span>${escapeHtml(watchtower.statusLabel)}</span>
        <strong>${escapeHtml(watchtower.summaryTitle)}</strong>
        <p>${escapeHtml(watchtower.summary)}</p>
      </div>
      <div class="portfolio-watchtower-score">
        <span>Desk score</span>
        <strong>${escapeHtml(watchtower.score)}%</strong>
      </div>
    </div>
    <div class="portfolio-watchtower-stats">
      <article><span>Companies</span><strong>${escapeHtml(watchtower.companyCount)}</strong><em>${escapeHtml(watchtower.readyCount)} pilot-ready</em></article>
      <article><span>Source gaps</span><strong>${escapeHtml(watchtower.sourceGapCount)}</strong><em>Next collection tasks</em></article>
      <article><span>Reviews</span><strong>${escapeHtml(watchtower.reviewDueCount)}</strong><em>${escapeHtml(watchtower.overdueCount)} overdue</em></article>
      <article><span>High risk</span><strong>${escapeHtml(watchtower.highRiskCount)}</strong><em>Risk index above 60</em></article>
    </div>
  `;

  els.portfolioWatchtowerList.innerHTML = visibleRows.length
    ? visibleRows.map(renderPortfolioWatchtowerRow).join("")
    : `<div class="empty-list">No companies match this watchtower view.</div>`;

  els.portfolioWatchtowerList.querySelectorAll("button[data-watchtower-ticker]").forEach((button) => {
    button.addEventListener("click", () => openPortfolioAction(button.dataset.watchtowerTicker));
  });
}

function makePortfolioWatchtower() {
  const launchRows = new Map(getCompanies().map((company) => [company.ticker, makeLaunchCompanyRow(company)]));
  const radar = makeReviewRadar();
  const rows = getCompanies().map((company) => makePortfolioWatchtowerRow(company, launchRows.get(company.ticker), radar)).filter(Boolean);
  const sortedRows = sortPortfolioWatchtowerRows(rows, "priority");
  const nextRow = sortedRows[0] || null;
  const companyCount = rows.length;
  const readyCount = rows.filter((row) => row.statusKey === "ready").length;
  const sourceGapCount = rows.filter((row) => row.hasSourceGap).length;
  const reviewDueCount = rows.filter((row) => row.hasReviewDue).length;
  const overdueCount = rows.filter((row) => row.radarItem && row.radarItem.statusKey === "overdue").length;
  const highRiskCount = rows.filter((row) => row.company.risk >= 60).length;
  const score = companyCount
    ? Math.round(rows.reduce((sum, row) => sum + row.score, 0) / companyCount)
    : 0;
  const statusClass = overdueCount || sourceGapCount >= 8 ? "is-blocked" : reviewDueCount || sourceGapCount ? "is-review" : "is-ready";
  const statusLabel = overdueCount
    ? "Overdue follow-ups"
    : sourceGapCount
      ? "Source work active"
      : "Watchtower clear";
  const summaryTitle = nextRow
    ? `${nextRow.company.ticker} - ${nextRow.action.label}`
    : "No portfolio actions open.";
  const summary = nextRow
    ? nextRow.action.detail
    : "All tracked companies are clear across source gaps, review due dates, and immediate evidence tasks.";
  return { rows: sortedRows, nextRow, companyCount, readyCount, sourceGapCount, reviewDueCount, overdueCount, highRiskCount, score, statusClass, statusLabel, summaryTitle, summary };
}

function makePortfolioWatchtowerRow(company, launchRow, radar) {
  if (!launchRow) return null;
  const radarItem = (radar.items || []).find((item) => item.ticker === company.ticker) || null;
  const decision = getLatestDecisionForTicker(company.ticker);
  const memoReview = getLatestMemoReviewForTicker(company.ticker);
  const sourcePercent = Math.round((launchRow.realCount / (launchRow.total || 1)) * 100);
  const hasReviewDue = radarItem && (radarItem.statusKey === "overdue" || radarItem.statusKey === "due");
  const hasSourceGap = Boolean(launchRow.next && launchRow.next.statusKey !== "real");
  const hasOpenTask = Boolean(radarItem && radarItem.hasTask);
  const riskPenalty = Math.max(0, company.risk - 45) * 0.25;
  const followUpPenalty = radarItem && radarItem.statusKey === "overdue" ? 16 : hasReviewDue ? 10 : hasOpenTask ? 5 : 0;
  const workflowBonus = (decision ? 10 : 0) + (memoReview ? 8 : 0);
  const score = Math.max(0, Math.min(100, Math.round(sourcePercent * 0.72 + workflowBonus + (hasSourceGap ? 0 : 12) - riskPenalty - followUpPenalty)));
  let statusKey = "monitor";
  let statusLabel = "Monitor";
  let className = "is-review";
  if (hasReviewDue) {
    statusKey = "review";
    statusLabel = radarItem.statusLabel;
    className = radarItem.statusKey === "overdue" ? "is-blocked" : "is-review";
  } else if (hasSourceGap) {
    statusKey = "source";
    statusLabel = "Source gap";
    className = launchRow.realCount >= 3 ? "is-review" : "is-blocked";
  } else if (decision && decision.decision === "committee-candidate") {
    statusKey = "ready";
    statusLabel = "Committee candidate";
    className = "is-ready";
  } else if (!hasSourceGap && score >= 65) {
    statusKey = "ready";
    statusLabel = "Pilot candidate";
    className = "is-ready";
  } else if (company.risk >= 60) {
    statusKey = "risk";
    statusLabel = "Risk watch";
    className = "is-review";
  }
  const action = makePortfolioWatchtowerAction({ company, launchRow, radarItem, decision, statusKey });
  const priorityRank = statusKey === "review" ? 0 : statusKey === "source" ? 1 : statusKey === "risk" ? 2 : statusKey === "ready" ? 3 : 4;
  return { company, launchRow, radarItem, decision, memoReview, sourcePercent, hasReviewDue, hasSourceGap, hasOpenTask, score, statusKey, statusLabel, className, action, priorityRank };
}

function makePortfolioWatchtowerAction({ company, launchRow, radarItem, decision, statusKey }) {
  if (radarItem && (radarItem.statusKey === "overdue" || radarItem.statusKey === "due" || radarItem.hasTask)) {
    return {
      type: "review",
      label: "Open review",
      detail: `${company.ticker} has a review follow-up: ${radarItem.summary}`,
      radarId: radarItem.id
    };
  }
  if (launchRow.next && launchRow.next.statusKey !== "real") {
    return {
      type: "source",
      label: `Replace ${launchRow.next.label}`,
      detail: `${company.ticker} needs ${launchRow.next.label} evidence before stronger research use.`,
      requirementKey: launchRow.next.key
    };
  }
  if (!decision) {
    return {
      type: "question",
      label: "Create decision",
      detail: `${company.ticker} has no saved research decision yet. Run a memo and log the thesis outcome.`,
      question: `What are the risks for $${company.ticker}?`
    };
  }
  if (statusKey === "risk") {
    return {
      type: "question",
      label: "Refresh risk memo",
      detail: `${company.ticker} has an elevated risk index. Refresh the risk memo before moving it forward.`,
      question: `What are the three most material risks hidden behind revenue growth for $${company.ticker}?`
    };
  }
  return {
    type: "question",
    label: "Refresh memo",
    detail: `${company.ticker} is in monitor mode. Refresh the latest disclosure question when new source text arrives.`,
    question: `What changed in $${company.ticker} disclosures and management tone?`
  };
}

function filterPortfolioWatchtowerRows(rows, filter) {
  if (filter === "source") return rows.filter((row) => row.hasSourceGap);
  if (filter === "review") return rows.filter((row) => row.hasReviewDue);
  if (filter === "ready") return rows.filter((row) => row.statusKey === "ready");
  if (filter === "risk") return rows.filter((row) => row.company.risk >= 60);
  return rows;
}

function sortPortfolioWatchtowerRows(rows, sort) {
  return [...rows].sort((a, b) => {
    if (sort === "readiness") return b.score - a.score || b.sourcePercent - a.sourcePercent;
    if (sort === "risk") return b.company.risk - a.company.risk || a.priorityRank - b.priorityRank;
    return a.priorityRank - b.priorityRank || b.company.risk - a.company.risk || a.company.ticker.localeCompare(b.company.ticker);
  });
}

function renderPortfolioWatchtowerRow(row) {
  const sourceSlots = row.launchRow.checklist.map((item) => `<span class="${escapeAttr(item.className)}">${escapeHtml(item.label)} ${escapeHtml(item.status)}</span>`).join("");
  return `
    <article class="portfolio-watchtower-card ${escapeAttr(row.className)}">
      <div class="portfolio-watchtower-card-head">
        <div>
          <span>${escapeHtml(row.statusLabel)}</span>
          <strong>${escapeHtml(row.company.ticker)} - ${escapeHtml(row.company.name)}</strong>
        </div>
        <em>${escapeHtml(row.score)}%</em>
      </div>
      <p>${escapeHtml(row.action.detail)}</p>
      <div class="portfolio-watchtower-metrics">
        <div><span>REAL coverage</span><strong>${escapeHtml(row.launchRow.realCount)}/${escapeHtml(row.launchRow.total)}</strong><em>${escapeHtml(row.sourcePercent)}%</em></div>
        <div><span>Risk index</span><strong>${escapeHtml(row.company.risk)}</strong><em>${escapeHtml(row.company.sector)}</em></div>
        <div><span>Decision</span><strong>${escapeHtml(row.decision ? getDecisionJournalLabel(row.decision.decision) : "None")}</strong><em>${escapeHtml(row.radarItem ? row.radarItem.statusLabel : "No review date")}</em></div>
      </div>
      <div class="portfolio-watchtower-slots">${sourceSlots}</div>
      <div class="note-actions">
        <button type="button" data-watchtower-ticker="${escapeAttr(row.company.ticker)}">${escapeHtml(row.action.label)}</button>
      </div>
    </article>
  `;
}

function openNextPortfolioAction() {
  const watchtower = makePortfolioWatchtower();
  if (!watchtower.nextRow) {
    flashPortfolioWatchtowerResult("No portfolio action is open.", "success");
    return;
  }
  executePortfolioWatchtowerAction(watchtower.nextRow);
}

function openPortfolioAction(ticker) {
  const watchtower = makePortfolioWatchtower();
  const row = watchtower.rows.find((item) => item.company.ticker === ticker);
  if (!row) {
    flashPortfolioWatchtowerResult("That company is no longer in the watchtower.", "error");
    return;
  }
  executePortfolioWatchtowerAction(row);
}

function executePortfolioWatchtowerAction(row) {
  state.selectedTicker = row.company.ticker;
  renderValuationOptions();
  renderCompanyDossier();
  updateValuationFromCompany();
  updateValuation();
  if (row.action.type === "review" && row.action.radarId) {
    openReviewRadarItem(row.action.radarId);
    flashPortfolioWatchtowerResult(`${row.company.ticker} review opened.`, "success");
    return;
  }
  if (row.action.type === "source" && row.action.requirementKey) {
    loadSourceTaskIntoBuilder(row.company.ticker, row.action.requirementKey);
    flashPortfolioWatchtowerResult(`${row.company.ticker} source task opened.`, "success");
    return;
  }
  els.queryInput.value = row.action.question || `What are the risks for $${row.company.ticker}?`;
  document.querySelector("#desk")?.scrollIntoView({ behavior: "smooth", block: "start" });
  flashPortfolioWatchtowerResult(`${row.company.ticker} desk question loaded. Run analysis when ready.`, "neutral");
}

async function copyPortfolioWatchtower() {
  const watchtower = makePortfolioWatchtower();
  if (!watchtower.rows.length) {
    flashPortfolioWatchtowerResult("No watchtower rows to copy yet.", "error");
    return;
  }
  const copied = await copyTextToClipboard(makePortfolioWatchtowerMarkdown(watchtower));
  flashPortfolioWatchtowerResult(copied ? "Portfolio Watchtower copied." : "Clipboard blocked. Use export instead.", copied ? "success" : "error");
}

function exportPortfolioWatchtower() {
  const watchtower = makePortfolioWatchtower();
  if (!watchtower.rows.length) {
    flashPortfolioWatchtowerResult("No watchtower rows to export yet.", "error");
    return;
  }
  const date = new Date().toISOString().slice(0, 10);
  const filename = `niveshscope-portfolio-watchtower-${date}.json`;
  downloadTextFile(filename, JSON.stringify(makePortfolioWatchtowerJson(watchtower), null, 2), "application/json;charset=utf-8");
  flashPortfolioWatchtowerResult("Portfolio Watchtower JSON exported.", "success");
}

function makePortfolioWatchtowerJson(watchtower = makePortfolioWatchtower()) {
  return {
    product: "NiveshScope",
    version: DATA_VERSION,
    generatedAt: new Date().toISOString(),
    status: watchtower.statusLabel,
    score: watchtower.score,
    companyCount: watchtower.companyCount,
    readyCount: watchtower.readyCount,
    sourceGapCount: watchtower.sourceGapCount,
    reviewDueCount: watchtower.reviewDueCount,
    overdueCount: watchtower.overdueCount,
    highRiskCount: watchtower.highRiskCount,
    rows: watchtower.rows.map((row) => ({
      ticker: row.company.ticker,
      company: row.company.name,
      sector: row.company.sector,
      score: row.score,
      status: row.statusLabel,
      risk: row.company.risk,
      realCount: row.launchRow.realCount,
      requiredCount: row.launchRow.total,
      decision: row.decision ? getDecisionJournalLabel(row.decision.decision) : "",
      reviewStatus: row.radarItem ? row.radarItem.statusLabel : "",
      nextAction: row.action
    }))
  };
}

function makePortfolioWatchtowerMarkdown(watchtower = makePortfolioWatchtower()) {
  const rows = watchtower.rows.map((row, index) => [
    `## ${index + 1}. ${row.company.ticker} - ${row.statusLabel}`,
    "",
    `Company: ${row.company.name}`,
    `Score: ${row.score}%`,
    `REAL coverage: ${row.launchRow.realCount}/${row.launchRow.total}`,
    `Risk index: ${row.company.risk}`,
    `Decision: ${row.decision ? getDecisionJournalLabel(row.decision.decision) : "None"}`,
    `Review: ${row.radarItem ? row.radarItem.statusLabel : "No review date"}`,
    `Next action: ${row.action.label}`,
    row.action.detail
  ].join("\n")).join("\n\n");
  return [
    "# NiveshScope Portfolio Watchtower",
    "",
    `Generated: ${new Date().toLocaleString()}`,
    `Status: ${watchtower.statusLabel} (${watchtower.score}%)`,
    `Companies: ${watchtower.companyCount} | Ready: ${watchtower.readyCount} | Source gaps: ${watchtower.sourceGapCount} | Reviews due: ${watchtower.reviewDueCount}`,
    "",
    rows,
    "",
    "_Portfolio Watchtower is a research operations view, not investment advice._"
  ].join("\n");
}

function getLatestDecisionForTicker(ticker) {
  const normalized = normalizeTicker(ticker || "");
  return (state.decisionJournal || []).find((entry) => normalizeTicker(entry.ticker) === normalized) || null;
}

function flashPortfolioWatchtowerResult(message, tone = "neutral") {
  if (!els.portfolioWatchtowerResult) return;
  els.portfolioWatchtowerResult.className = `builder-result is-${tone}`;
  els.portfolioWatchtowerResult.textContent = message;
}

function renderCatalystCalendar() {
  if (!els.catalystCalendarSummary || !els.catalystCalendarList) return;
  const calendar = makeCatalystCalendar();
  const filter = els.catalystCalendarFilter ? els.catalystCalendarFilter.value : state.catalystCalendarFilter || "all";
  const horizon = els.catalystCalendarHorizon ? els.catalystCalendarHorizon.value : state.catalystCalendarHorizon || "30";
  state.catalystCalendarFilter = filter;
  state.catalystCalendarHorizon = horizon;
  const visibleEvents = filterCatalystEvents(calendar.events, filter, horizon);
  if (els.catalystCalendarStatus) {
    els.catalystCalendarStatus.textContent = calendar.nextEvent ? `${calendar.nextEvent.ticker} next` : "No catalysts";
  }
  if (els.openCatalystAction) els.openCatalystAction.disabled = !calendar.nextEvent;
  if (els.copyCatalystCalendar) els.copyCatalystCalendar.disabled = !calendar.events.length;
  if (els.exportCatalystCalendar) els.exportCatalystCalendar.disabled = !calendar.events.length;

  els.catalystCalendarSummary.innerHTML = `
    <div class="catalyst-calendar-hero ${escapeAttr(calendar.statusClass)}">
      <div>
        <span>${escapeHtml(calendar.statusLabel)}</span>
        <strong>${escapeHtml(calendar.summaryTitle)}</strong>
        <p>${escapeHtml(calendar.summary)}</p>
      </div>
      <div class="catalyst-calendar-score">
        <span>Cadence score</span>
        <strong>${escapeHtml(calendar.score)}%</strong>
      </div>
    </div>
    <div class="catalyst-calendar-stats">
      <article><span>Open catalysts</span><strong>${escapeHtml(calendar.eventCount)}</strong><em>${escapeHtml(calendar.overdueCount)} overdue</em></article>
      <article><span>Source work</span><strong>${escapeHtml(calendar.sourceCount)}</strong><em>Official evidence tasks</em></article>
      <article><span>Review events</span><strong>${escapeHtml(calendar.reviewCount)}</strong><em>Decision follow-ups</em></article>
      <article><span>Risk refresh</span><strong>${escapeHtml(calendar.riskCount)}</strong><em>High-risk names</em></article>
    </div>
  `;

  els.catalystCalendarList.innerHTML = visibleEvents.length
    ? visibleEvents.map(renderCatalystEvent).join("")
    : `<div class="empty-list">No catalyst events match this calendar view.</div>`;

  els.catalystCalendarList.querySelectorAll("button[data-catalyst-id]").forEach((button) => {
    button.addEventListener("click", () => openCatalystAction(button.dataset.catalystId));
  });
}

function makeCatalystCalendar() {
  const portfolio = makePortfolioWatchtower();
  const radar = makeReviewRadar();
  const events = [
    ...makeReviewCatalystEvents(radar),
    ...makeSourceCatalystEvents(portfolio),
    ...makeRiskCatalystEvents(portfolio),
    ...makeReadyCatalystEvents(portfolio)
  ].sort((a, b) => a.dateSort - b.dateSort || a.priorityRank - b.priorityRank || a.ticker.localeCompare(b.ticker));
  const nextEvent = events[0] || null;
  const eventCount = events.length;
  const overdueCount = events.filter((item) => item.daysFromToday < 0).length;
  const dueCount = events.filter((item) => item.daysFromToday <= 7).length;
  const sourceCount = events.filter((item) => item.type === "source").length;
  const reviewCount = events.filter((item) => item.type === "review").length;
  const riskCount = events.filter((item) => item.type === "risk").length;
  const readyCount = events.filter((item) => item.type === "ready").length;
  const score = eventCount
    ? Math.max(0, Math.min(100, Math.round(100 - ((overdueCount * 18 + dueCount * 6 + sourceCount * 2) / eventCount))))
    : 100;
  const statusClass = overdueCount ? "is-blocked" : dueCount || sourceCount ? "is-review" : "is-ready";
  const statusLabel = overdueCount ? "Overdue catalysts" : dueCount ? "Near-term work" : "Calendar planned";
  const summaryTitle = nextEvent ? `${nextEvent.ticker} - ${nextEvent.title}` : "No calendar actions open.";
  const summary = nextEvent ? nextEvent.detail : "The research desk has no current calendar pressure.";
  return { events, nextEvent, eventCount, overdueCount, dueCount, sourceCount, reviewCount, riskCount, readyCount, score, statusClass, statusLabel, summaryTitle, summary };
}

function makeReviewCatalystEvents(radar) {
  return (radar.items || []).map((item) => {
    const hasDate = /^\d{4}-\d{2}-\d{2}$/.test(item.nextReviewDate || "");
    const targetDate = hasDate ? item.nextReviewDate : catalystDateFromToday(30);
    const daysFromToday = getDaysFromToday(targetDate);
    const title = hasDate ? item.statusLabel : "Schedule review";
    return makeCatalystEvent({
      id: `review-${item.id}`,
      type: "review",
      ticker: item.ticker,
      company: item.company,
      title,
      date: targetDate,
      detail: item.hasTask ? item.taskText : item.summary,
      actionLabel: "Open review",
      actionType: "review",
      radarId: item.id,
      priorityRank: item.statusKey === "overdue" ? 0 : item.statusKey === "due" ? 1 : item.hasTask ? 2 : 4,
      daysFromToday
    });
  });
}

function makeSourceCatalystEvents(portfolio) {
  return (portfolio.rows || [])
    .filter((row) => row.hasSourceGap && row.launchRow.next)
    .map((row, index) => {
      const targetDate = catalystDateFromToday(Math.min(21, 2 + index * 2));
      return makeCatalystEvent({
        id: `source-${row.company.ticker}-${row.launchRow.next.key}`,
        type: "source",
        ticker: row.company.ticker,
        company: row.company.name,
        title: `Replace ${row.launchRow.next.label}`,
        date: targetDate,
        detail: `${row.company.ticker} still needs ${row.launchRow.next.label} marked REAL before stronger research use.`,
        actionLabel: "Open source task",
        actionType: "source",
        requirementKey: row.launchRow.next.key,
        priorityRank: row.launchRow.realCount < 2 ? 1 : 3,
        daysFromToday: getDaysFromToday(targetDate)
      });
    });
}

function makeRiskCatalystEvents(portfolio) {
  return (portfolio.rows || [])
    .filter((row) => row.company.risk >= 60)
    .slice(0, 6)
    .map((row, index) => {
      const targetDate = catalystDateFromToday(7 + index * 3);
      return makeCatalystEvent({
        id: `risk-${row.company.ticker}`,
        type: "risk",
        ticker: row.company.ticker,
        company: row.company.name,
        title: "Refresh risk memo",
        date: targetDate,
        detail: `${row.company.ticker} has a ${row.company.risk} risk index. Refresh risk factors before advancing the thesis.`,
        actionLabel: "Load risk question",
        actionType: "question",
        question: `What are the three most material risks hidden behind revenue growth for $${row.company.ticker}?`,
        priorityRank: 4,
        daysFromToday: getDaysFromToday(targetDate)
      });
    });
}

function makeReadyCatalystEvents(portfolio) {
  return (portfolio.rows || [])
    .filter((row) => row.statusKey === "ready")
    .slice(0, 5)
    .map((row, index) => {
      const targetDate = catalystDateFromToday(14 + index * 4);
      return makeCatalystEvent({
        id: `ready-${row.company.ticker}`,
        type: "ready",
        ticker: row.company.ticker,
        company: row.company.name,
        title: "Pilot candidate check-in",
        date: targetDate,
        detail: `${row.company.ticker} is closest to pilot-readiness. Refresh the committee brief after source checks.`,
        actionLabel: "Load committee brief",
        actionType: "question",
        question: `Prepare an investment committee brief for $${row.company.ticker}.`,
        priorityRank: 5,
        daysFromToday: getDaysFromToday(targetDate)
      });
    });
}

function makeCatalystEvent(event) {
  const daysFromToday = typeof event.daysFromToday === "number" ? event.daysFromToday : getDaysFromToday(event.date);
  const urgency = daysFromToday < 0 ? "Overdue" : daysFromToday === 0 ? "Today" : daysFromToday <= 7 ? "This week" : daysFromToday <= 30 ? "Next 30 days" : "Later";
  const className = daysFromToday < 0 ? "is-blocked" : daysFromToday <= 7 ? "is-review" : event.type === "ready" ? "is-ready" : "is-neutral";
  return {
    ...event,
    daysFromToday,
    urgency,
    className,
    dateSort: new Date(`${event.date}T00:00:00`).getTime()
  };
}

function filterCatalystEvents(events, filter, horizon) {
  const maxDays = horizon === "all" ? Number.POSITIVE_INFINITY : Number(horizon || 30);
  return events.filter((event) => {
    const typeMatch = filter === "all" || event.type === filter;
    const horizonMatch = event.daysFromToday <= maxDays;
    return typeMatch && horizonMatch;
  });
}

function renderCatalystEvent(event) {
  return `
    <article class="catalyst-calendar-card ${escapeAttr(event.className)}">
      <div class="catalyst-calendar-card-head">
        <div>
          <span>${escapeHtml(event.urgency)} - ${escapeHtml(event.type)}</span>
          <strong>${escapeHtml(event.ticker)} - ${escapeHtml(event.title)}</strong>
        </div>
        <em>${escapeHtml(formatCatalystDate(event.date))}</em>
      </div>
      <p>${escapeHtml(event.detail)}</p>
      <div class="catalyst-calendar-meta">
        <div><span>Company</span><strong>${escapeHtml(event.company)}</strong></div>
        <div><span>Due in</span><strong>${escapeHtml(formatCatalystDays(event.daysFromToday))}</strong></div>
        <div><span>Action</span><strong>${escapeHtml(event.actionLabel)}</strong></div>
      </div>
      <div class="note-actions">
        <button type="button" data-catalyst-id="${escapeAttr(event.id)}">${escapeHtml(event.actionLabel)}</button>
      </div>
    </article>
  `;
}

function openNextCatalystAction() {
  const calendar = makeCatalystCalendar();
  if (!calendar.nextEvent) {
    flashCatalystCalendarResult("No catalyst action is open.", "success");
    return;
  }
  executeCatalystAction(calendar.nextEvent);
}

function openCatalystAction(eventId) {
  const calendar = makeCatalystCalendar();
  const event = calendar.events.find((item) => item.id === eventId);
  if (!event) {
    flashCatalystCalendarResult("That catalyst is no longer available.", "error");
    return;
  }
  executeCatalystAction(event);
}

function executeCatalystAction(event) {
  state.selectedTicker = event.ticker;
  renderValuationOptions();
  renderCompanyDossier();
  updateValuationFromCompany();
  updateValuation();
  if (event.actionType === "review" && event.radarId) {
    openReviewRadarItem(event.radarId);
    flashCatalystCalendarResult(`${event.ticker} review catalyst opened.`, "success");
    return;
  }
  if (event.actionType === "source" && event.requirementKey) {
    loadSourceTaskIntoBuilder(event.ticker, event.requirementKey);
    flashCatalystCalendarResult(`${event.ticker} source catalyst opened.`, "success");
    return;
  }
  els.queryInput.value = event.question || `What changed in $${event.ticker} disclosures and management tone?`;
  document.querySelector("#desk")?.scrollIntoView({ behavior: "smooth", block: "start" });
  flashCatalystCalendarResult(`${event.ticker} catalyst question loaded. Run analysis when ready.`, "neutral");
}

async function copyCatalystCalendar() {
  const calendar = makeCatalystCalendar();
  if (!calendar.events.length) {
    flashCatalystCalendarResult("No catalyst calendar to copy yet.", "error");
    return;
  }
  const copied = await copyTextToClipboard(makeCatalystCalendarMarkdown(calendar));
  flashCatalystCalendarResult(copied ? "Catalyst calendar copied." : "Clipboard blocked. Use export instead.", copied ? "success" : "error");
}

function exportCatalystCalendar() {
  const calendar = makeCatalystCalendar();
  if (!calendar.events.length) {
    flashCatalystCalendarResult("No catalyst calendar to export yet.", "error");
    return;
  }
  const date = new Date().toISOString().slice(0, 10);
  const filename = `niveshscope-catalyst-calendar-${date}.json`;
  downloadTextFile(filename, JSON.stringify(makeCatalystCalendarJson(calendar), null, 2), "application/json;charset=utf-8");
  flashCatalystCalendarResult("Catalyst calendar JSON exported.", "success");
}

function makeCatalystCalendarJson(calendar = makeCatalystCalendar()) {
  return {
    product: "NiveshScope",
    version: DATA_VERSION,
    generatedAt: new Date().toISOString(),
    status: calendar.statusLabel,
    score: calendar.score,
    eventCount: calendar.eventCount,
    overdueCount: calendar.overdueCount,
    sourceCount: calendar.sourceCount,
    reviewCount: calendar.reviewCount,
    riskCount: calendar.riskCount,
    readyCount: calendar.readyCount,
    events: calendar.events
  };
}

function makeCatalystCalendarMarkdown(calendar = makeCatalystCalendar()) {
  const rows = calendar.events.map((event, index) => [
    `## ${index + 1}. ${event.ticker} - ${event.title}`,
    "",
    `Date: ${formatCatalystDate(event.date)} (${formatCatalystDays(event.daysFromToday)})`,
    `Company: ${event.company}`,
    `Type: ${event.type}`,
    `Action: ${event.actionLabel}`,
    "",
    event.detail
  ].join("\n")).join("\n\n");
  return [
    "# NiveshScope Catalyst Calendar",
    "",
    `Generated: ${new Date().toLocaleString()}`,
    `Status: ${calendar.statusLabel} (${calendar.score}%)`,
    `Events: ${calendar.eventCount} | Overdue: ${calendar.overdueCount} | Source: ${calendar.sourceCount} | Reviews: ${calendar.reviewCount}`,
    "",
    rows,
    "",
    "_Catalyst Calendar is a research workflow calendar, not investment advice._"
  ].join("\n");
}

function catalystDateFromToday(days) {
  const date = new Date();
  date.setDate(date.getDate() + Number(days || 0));
  return date.toISOString().slice(0, 10);
}

function getDaysFromToday(dateText) {
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const parsed = new Date(`${dateText}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return 9999;
  return Math.ceil((parsed.getTime() - todayMidnight.getTime()) / 86400000);
}

function formatCatalystDate(dateText) {
  const parsed = new Date(`${dateText}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateText || "Unscheduled";
  return parsed.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function formatCatalystDays(days) {
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} overdue`;
  if (days === 0) return "today";
  return `${days} day${days === 1 ? "" : "s"}`;
}

function flashCatalystCalendarResult(message, tone = "neutral") {
  if (!els.catalystCalendarResult) return;
  els.catalystCalendarResult.className = `builder-result is-${tone}`;
  els.catalystCalendarResult.textContent = message;
}

function renderDailyBriefing() {
  if (!els.dailyBriefingSummary || !els.dailyBriefingList) return;
  const mode = els.dailyBriefingMode ? els.dailyBriefingMode.value : state.dailyBriefingMode || "morning";
  state.dailyBriefingMode = mode;
  const briefing = makeDailyBriefing(mode);
  if (els.dailyBriefingStatus) {
    els.dailyBriefingStatus.textContent = briefing.firstAction ? `${briefing.firstAction.ticker} first` : "Clear";
  }
  if (els.openDailyBriefingAction) els.openDailyBriefingAction.disabled = !briefing.firstAction;
  if (els.captureDailyBriefingTask) els.captureDailyBriefingTask.disabled = !briefing.firstAction;
  if (els.copyDailyBriefing) els.copyDailyBriefing.disabled = !briefing.actions.length;
  if (els.exportDailyBriefing) els.exportDailyBriefing.disabled = !briefing.actions.length;

  els.dailyBriefingSummary.innerHTML = `
    <div class="daily-briefing-hero ${escapeAttr(briefing.statusClass)}">
      <div>
        <span>${escapeHtml(briefing.modeLabel)}</span>
        <strong>${escapeHtml(briefing.headline)}</strong>
        <p>${escapeHtml(briefing.summary)}</p>
      </div>
      <div class="daily-briefing-score">
        <span>Focus score</span>
        <strong>${escapeHtml(briefing.focusScore)}%</strong>
      </div>
    </div>
    <div class="daily-briefing-stats">
      <article><span>Actions</span><strong>${escapeHtml(briefing.actions.length)}</strong><em>${escapeHtml(briefing.urgentCount)} urgent</em></article>
      <article><span>Source work</span><strong>${escapeHtml(briefing.sourceCount)}</strong><em>Evidence tasks</em></article>
      <article><span>Reviews</span><strong>${escapeHtml(briefing.reviewCount)}</strong><em>Follow-ups</em></article>
      <article><span>Launch posture</span><strong>${escapeHtml(briefing.launchLabel)}</strong><em>${escapeHtml(briefing.launchDetail)}</em></article>
    </div>
  `;

  els.dailyBriefingList.innerHTML = briefing.actions.length
    ? briefing.actions.map(renderDailyBriefingAction).join("")
    : `<div class="empty-list">No briefing actions are open for this mode.</div>`;

  els.dailyBriefingList.querySelectorAll("button[data-briefing-action]").forEach((button) => {
    button.addEventListener("click", () => openDailyBriefingAction(button.dataset.briefingAction));
  });
  els.dailyBriefingList.querySelectorAll("button[data-capture-briefing-task]").forEach((button) => {
    button.addEventListener("click", () => captureDailyBriefingTask(button.dataset.captureBriefingTask));
  });
}

function makeDailyBriefing(mode = "morning") {
  const calendar = makeCatalystCalendar();
  const portfolio = makePortfolioWatchtower();
  const radar = makeReviewRadar();
  const actions = buildDailyBriefingActions({ calendar, portfolio, radar })
    .filter((action) => actionMatchesDailyMode(action, mode))
    .sort((a, b) => a.rank - b.rank || a.daysFromToday - b.daysFromToday || a.ticker.localeCompare(b.ticker))
    .slice(0, mode === "morning" ? 8 : 10);
  const firstAction = actions[0] || null;
  const urgentCount = actions.filter((action) => action.urgencyRank <= 1).length;
  const sourceCount = actions.filter((action) => action.type === "source").length;
  const reviewCount = actions.filter((action) => action.type === "review").length;
  const focusScore = actions.length
    ? Math.max(0, Math.min(100, Math.round(100 - urgentCount * 11 - sourceCount * 3 + Math.min(20, portfolio.score * 0.2))))
    : 100;
  const statusClass = urgentCount ? "is-blocked" : actions.length ? "is-review" : "is-ready";
  const modeLabel = getDailyBriefingModeLabel(mode);
  const headline = firstAction
    ? `${firstAction.ticker} - ${firstAction.title}`
    : "No urgent desk action open.";
  const summary = firstAction
    ? firstAction.detail
    : "The current desk state has no immediate source, review, catalyst, or launch action in this mode.";
  const launchLabel = portfolio.score >= 70 && !radar.overdueCount ? "Steady" : portfolio.score >= 45 ? "Active" : "Needs work";
  const launchDetail = `${portfolio.score}% watchtower | ${calendar.overdueCount} overdue`;
  return { mode, modeLabel, actions, firstAction, urgentCount, sourceCount, reviewCount, focusScore, statusClass, headline, summary, launchLabel, launchDetail, calendar, portfolio, radar };
}

function buildDailyBriefingActions({ calendar, portfolio, radar }) {
  const catalystActions = calendar.events.map((event) => ({
    id: `cal-${event.id}`,
    sourceId: event.id,
    type: event.type,
    ticker: event.ticker,
    company: event.company,
    title: event.title,
    detail: event.detail,
    actionLabel: event.actionLabel,
    actionKind: "calendar",
    daysFromToday: event.daysFromToday,
    urgencyRank: event.daysFromToday < 0 ? 0 : event.daysFromToday <= 7 ? 1 : 3,
    rank: (event.daysFromToday < 0 ? 0 : event.daysFromToday <= 7 ? 15 : 45) + event.priorityRank
  }));
  const watchtowerActions = portfolio.rows.slice(0, 8).map((row, index) => ({
    id: `watch-${row.company.ticker}`,
    sourceId: row.company.ticker,
    type: row.action.type === "source" ? "source" : row.action.type === "review" ? "review" : row.statusKey === "risk" ? "risk" : "portfolio",
    ticker: row.company.ticker,
    company: row.company.name,
    title: row.action.label,
    detail: row.action.detail,
    actionLabel: row.action.label,
    actionKind: "portfolio",
    daysFromToday: index + 1,
    urgencyRank: row.priorityRank <= 1 ? 1 : 3,
    rank: 20 + row.priorityRank * 8 + index
  }));
  const radarActions = radar.items.filter((item) => item.statusKey === "overdue" || item.statusKey === "due").map((item, index) => ({
    id: `radar-${item.id}`,
    sourceId: item.id,
    type: "review",
    ticker: item.ticker,
    company: item.company,
    title: item.statusLabel,
    detail: item.hasTask ? item.taskText : item.summary,
    actionLabel: "Open review",
    actionKind: "review",
    daysFromToday: item.daysToReview,
    urgencyRank: item.statusKey === "overdue" ? 0 : 1,
    rank: item.statusKey === "overdue" ? index : 10 + index
  }));
  return dedupeDailyBriefingActions([...radarActions, ...catalystActions, ...watchtowerActions]);
}

function dedupeDailyBriefingActions(actions) {
  const seen = new Set();
  return actions.filter((action) => {
    const key = `${action.type}-${action.ticker}-${action.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function actionMatchesDailyMode(action, mode) {
  if (mode === "source") return action.type === "source";
  if (mode === "review") return action.type === "review";
  if (mode === "launch") return ["source", "review", "risk", "ready", "portfolio"].includes(action.type);
  return true;
}

function renderDailyBriefingAction(action) {
  const className = action.urgencyRank === 0 ? "is-blocked" : action.urgencyRank === 1 ? "is-review" : action.type === "ready" ? "is-ready" : "is-neutral";
  return `
    <article class="daily-briefing-card ${escapeAttr(className)}">
      <div class="daily-briefing-card-head">
        <div>
          <span>${escapeHtml(action.type)} - ${escapeHtml(formatCatalystDays(action.daysFromToday))}</span>
          <strong>${escapeHtml(action.ticker)} - ${escapeHtml(action.title)}</strong>
        </div>
        <em>${escapeHtml(action.actionLabel)}</em>
      </div>
      <p>${escapeHtml(action.detail)}</p>
      <div class="daily-briefing-meta">
        <div><span>Company</span><strong>${escapeHtml(action.company)}</strong></div>
        <div><span>Route</span><strong>${escapeHtml(action.actionKind)}</strong></div>
        <div><span>Priority</span><strong>${escapeHtml(action.urgencyRank <= 1 ? "High" : "Normal")}</strong></div>
      </div>
      <div class="note-actions">
        <button type="button" data-capture-briefing-task="${escapeAttr(action.id)}">Add to tasks</button>
        <button type="button" data-briefing-action="${escapeAttr(action.id)}">${escapeHtml(action.actionLabel)}</button>
      </div>
    </article>
  `;
}

function openDailyBriefingAction(actionId = "") {
  if (actionId && typeof actionId !== "string") actionId = "";
  const briefing = makeDailyBriefing(state.dailyBriefingMode || "morning");
  const action = actionId ? briefing.actions.find((item) => item.id === actionId) : briefing.firstAction;
  if (!action) {
    flashDailyBriefingResult("No briefing action is open.", "success");
    return;
  }
  if (action.actionKind === "calendar") {
    openCatalystAction(action.sourceId);
    flashDailyBriefingResult(`${action.ticker} catalyst opened.`, "success");
    return;
  }
  if (action.actionKind === "portfolio") {
    openPortfolioAction(action.sourceId);
    flashDailyBriefingResult(`${action.ticker} watchtower action opened.`, "success");
    return;
  }
  if (action.actionKind === "review") {
    openReviewRadarItem(action.sourceId);
    flashDailyBriefingResult(`${action.ticker} review opened.`, "success");
    return;
  }
  flashDailyBriefingResult(`${action.ticker} action selected.`, "neutral");
}

async function copyDailyBriefing() {
  const briefing = makeDailyBriefing(state.dailyBriefingMode || "morning");
  if (!briefing.actions.length) {
    flashDailyBriefingResult("No briefing actions to copy yet.", "error");
    return;
  }
  const copied = await copyTextToClipboard(makeDailyBriefingMarkdown(briefing));
  flashDailyBriefingResult(copied ? "Daily briefing copied." : "Clipboard blocked. Use export instead.", copied ? "success" : "error");
}

function exportDailyBriefing() {
  const briefing = makeDailyBriefing(state.dailyBriefingMode || "morning");
  if (!briefing.actions.length) {
    flashDailyBriefingResult("No briefing actions to export yet.", "error");
    return;
  }
  const date = new Date().toISOString().slice(0, 10);
  const filename = `niveshscope-daily-briefing-${date}.json`;
  downloadTextFile(filename, JSON.stringify(makeDailyBriefingJson(briefing), null, 2), "application/json;charset=utf-8");
  flashDailyBriefingResult("Daily briefing JSON exported.", "success");
}

function makeDailyBriefingJson(briefing = makeDailyBriefing(state.dailyBriefingMode || "morning")) {
  return {
    product: "NiveshScope",
    version: DATA_VERSION,
    generatedAt: new Date().toISOString(),
    mode: briefing.mode,
    focusScore: briefing.focusScore,
    headline: briefing.headline,
    urgentCount: briefing.urgentCount,
    sourceCount: briefing.sourceCount,
    reviewCount: briefing.reviewCount,
    launchLabel: briefing.launchLabel,
    actions: briefing.actions
  };
}

function makeDailyBriefingMarkdown(briefing = makeDailyBriefing(state.dailyBriefingMode || "morning")) {
  const rows = briefing.actions.map((action, index) => [
    `## ${index + 1}. ${action.ticker} - ${action.title}`,
    "",
    `Type: ${action.type}`,
    `Company: ${action.company}`,
    `Timing: ${formatCatalystDays(action.daysFromToday)}`,
    `Action: ${action.actionLabel}`,
    "",
    action.detail
  ].join("\n")).join("\n\n");
  return [
    "# NiveshScope Daily Briefing",
    "",
    `Generated: ${new Date().toLocaleString()}`,
    `Mode: ${briefing.modeLabel}`,
    `Focus score: ${briefing.focusScore}%`,
    `Headline: ${briefing.headline}`,
    "",
    rows,
    "",
    "_Daily Briefing is a research workflow summary, not investment advice._"
  ].join("\n");
}

function getDailyBriefingModeLabel(mode) {
  const labels = {
    morning: "Morning desk",
    source: "Source sprint",
    review: "Review sprint",
    launch: "Launch prep"
  };
  return labels[mode] || labels.morning;
}

function flashDailyBriefingResult(message, tone = "neutral") {
  if (!els.dailyBriefingResult) return;
  els.dailyBriefingResult.className = `builder-result is-${tone}`;
  els.dailyBriefingResult.textContent = message;
}

function renderDeskTaskBoard() {
  if (!els.deskTaskSummary || !els.deskTaskList) return;
  const filter = els.deskTaskFilter ? els.deskTaskFilter.value : state.deskTaskFilter || "open";
  state.deskTaskFilter = filter;
  const board = makeDeskTaskBoard(filter);
  if (els.deskTaskBoardStatus) {
    els.deskTaskBoardStatus.textContent = board.openCount ? `${board.openCount} open` : "Clear";
  }
  if (els.captureFirstTask) els.captureFirstTask.disabled = !makeDailyBriefing(state.dailyBriefingMode || "morning").firstAction;
  if (els.copyDeskTasks) els.copyDeskTasks.disabled = !state.deskTasks.length;
  if (els.exportDeskTasks) els.exportDeskTasks.disabled = !state.deskTasks.length;
  if (els.clearCompletedTasks) els.clearCompletedTasks.disabled = !board.doneCount;

  els.deskTaskSummary.innerHTML = `
    <div class="desk-task-hero ${escapeAttr(board.statusClass)}">
      <div>
        <span>${escapeHtml(board.statusLabel)}</span>
        <strong>${escapeHtml(board.headline)}</strong>
        <p>${escapeHtml(board.summary)}</p>
      </div>
      <div class="desk-task-score">
        <span>Execution score</span>
        <strong>${escapeHtml(board.score)}%</strong>
      </div>
    </div>
    <div class="desk-task-stats">
      <article><span>Open</span><strong>${escapeHtml(board.openCount)}</strong><em>${escapeHtml(board.highOpenCount)} high priority</em></article>
      <article><span>In progress</span><strong>${escapeHtml(board.inProgressCount)}</strong><em>Being worked</em></article>
      <article><span>Source tasks</span><strong>${escapeHtml(board.sourceOpenCount)}</strong><em>Evidence work</em></article>
      <article><span>Completed</span><strong>${escapeHtml(board.doneCount)}</strong><em>Local browser log</em></article>
    </div>
  `;

  els.deskTaskList.innerHTML = board.visibleTasks.length
    ? board.visibleTasks.map(renderDeskTaskCard).join("")
    : `<div class="empty-list">No desk tasks match this view. Capture one from Daily Briefing to start a trackable workflow.</div>`;

  els.deskTaskList.querySelectorAll("button[data-route-task]").forEach((button) => {
    button.addEventListener("click", () => routeDeskTask(button.dataset.routeTask));
  });
  els.deskTaskList.querySelectorAll("button[data-progress-task]").forEach((button) => {
    button.addEventListener("click", () => progressDeskTask(button.dataset.progressTask));
  });
  els.deskTaskList.querySelectorAll("button[data-complete-task]").forEach((button) => {
    button.addEventListener("click", () => completeDeskTask(button.dataset.completeTask));
  });
  els.deskTaskList.querySelectorAll("button[data-delete-task]").forEach((button) => {
    button.addEventListener("click", () => deleteDeskTask(button.dataset.deleteTask));
  });
}

function makeDeskTaskBoard(filter = "open") {
  const tasks = state.deskTasks.map(normalizeDeskTask);
  const openTasks = tasks.filter((task) => task.status !== "done");
  const doneTasks = tasks.filter((task) => task.status === "done");
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
  const highOpenTasks = openTasks.filter((task) => task.priority === "high");
  const sourceOpenTasks = openTasks.filter((task) => task.actionType === "source");
  const reviewOpenTasks = openTasks.filter((task) => task.actionType === "review" || task.routeKind === "review");
  const visibleTasks = tasks
    .filter((task) => taskMatchesDeskFilter(task, filter))
    .sort(sortDeskTasks)
    .slice(0, 16);
  const score = tasks.length
    ? Math.max(0, Math.min(100, Math.round(100 - highOpenTasks.length * 9 - openTasks.length * 4 - inProgressTasks.length * 2 + doneTasks.length * 3)))
    : 100;
  const nextTask = openTasks.sort(sortDeskTasks)[0] || null;
  const statusClass = highOpenTasks.length >= 3 ? "is-blocked" : openTasks.length ? "is-review" : "is-ready";
  const statusLabel = highOpenTasks.length >= 3 ? "Execution pressure" : openTasks.length ? "Tasks active" : "Task board clear";
  const headline = nextTask
    ? `${nextTask.ticker} - ${nextTask.title}`
    : "No open research tasks.";
  const summary = nextTask
    ? nextTask.detail
    : "Daily Briefing actions can be captured here as persistent research tasks with status, routing, and export history.";
  return {
    tasks,
    visibleTasks,
    openTasks,
    nextTask,
    score,
    statusClass,
    statusLabel,
    headline,
    summary,
    openCount: openTasks.length,
    doneCount: doneTasks.length,
    inProgressCount: inProgressTasks.length,
    highOpenCount: highOpenTasks.length,
    sourceOpenCount: sourceOpenTasks.length,
    reviewOpenCount: reviewOpenTasks.length
  };
}

function taskMatchesDeskFilter(task, filter) {
  if (filter === "all") return true;
  if (filter === "done") return task.status === "done";
  if (filter === "high") return task.priority === "high" && task.status !== "done";
  if (filter === "source") return task.actionType === "source" && task.status !== "done";
  if (filter === "review") return (task.actionType === "review" || task.routeKind === "review") && task.status !== "done";
  return task.status !== "done";
}

function sortDeskTasks(a, b) {
  const doneDelta = Number(a.status === "done") - Number(b.status === "done");
  if (doneDelta) return doneDelta;
  const priorityDelta = Number(b.priority === "high") - Number(a.priority === "high");
  if (priorityDelta) return priorityDelta;
  const statusDelta = DESK_TASK_STATUS_FLOW.indexOf(b.status) - DESK_TASK_STATUS_FLOW.indexOf(a.status);
  if (statusDelta) return statusDelta;
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

function renderDeskTaskCard(task) {
  const className = task.status === "done" ? "is-ready" : task.priority === "high" ? "is-blocked" : task.status === "in-progress" ? "is-review" : "is-neutral";
  return `
    <article class="desk-task-card ${escapeAttr(className)}">
      <div class="desk-task-card-head">
        <div>
          <span>${escapeHtml(task.actionType)} - ${escapeHtml(getDeskTaskStatusLabel(task.status))}</span>
          <strong>${escapeHtml(task.ticker)} - ${escapeHtml(task.title)}</strong>
        </div>
        <em>${escapeHtml(getDeskTaskPriorityLabel(task.priority))}</em>
      </div>
      <p>${escapeHtml(task.detail)}</p>
      <div class="desk-task-meta">
        <div><span>Company</span><strong>${escapeHtml(task.company)}</strong></div>
        <div><span>Due</span><strong>${escapeHtml(task.dueLabel || "Open")}</strong></div>
        <div><span>Route</span><strong>${escapeHtml(task.routeKind)}</strong></div>
        <div><span>Owner</span><strong>${escapeHtml(task.owner)}</strong></div>
      </div>
      <div class="note-actions">
        <button type="button" data-route-task="${escapeAttr(task.id)}">${escapeHtml(task.routeLabel)}</button>
        <button type="button" data-progress-task="${escapeAttr(task.id)}">${escapeHtml(task.status === "done" ? "Reopen" : "Progress")}</button>
        <button type="button" data-complete-task="${escapeAttr(task.id)}">Done</button>
        <button type="button" data-delete-task="${escapeAttr(task.id)}">Delete</button>
      </div>
    </article>
  `;
}

function normalizeDeskTask(task) {
  const status = DESK_TASK_STATUS_FLOW.includes(task.status) ? task.status : "queued";
  const priority = task.priority === "high" ? "high" : "normal";
  return {
    id: String(task.id || `task-${Date.now()}`),
    createdAt: task.createdAt || new Date().toISOString(),
    updatedAt: task.updatedAt || task.createdAt || new Date().toISOString(),
    status,
    priority,
    ticker: normalizeTicker(task.ticker || state.selectedTicker || "DESK"),
    company: String(task.company || task.ticker || "Research desk").slice(0, 120),
    title: String(task.title || "Research task").slice(0, 140),
    detail: String(task.detail || "Track and complete this research action.").slice(0, 900),
    actionType: String(task.actionType || "task").slice(0, 40),
    routeKind: String(task.routeKind || "desk").slice(0, 40),
    routeId: String(task.routeId || "").slice(0, 160),
    routeLabel: String(task.routeLabel || "Open task").slice(0, 80),
    sourceKey: String(task.sourceKey || task.id || "").slice(0, 220),
    dueLabel: String(task.dueLabel || "").slice(0, 80),
    dueDate: String(task.dueDate || "").slice(0, 20),
    owner: String(task.owner || "Research desk").slice(0, 60),
    note: String(task.note || "").slice(0, 1000)
  };
}

function findDailyBriefingAction(actionId = "", preferredMode = state.dailyBriefingMode || "morning") {
  const modes = Array.from(new Set([preferredMode, "morning", "source", "review", "launch"]));
  for (const mode of modes) {
    const action = makeDailyBriefing(mode).actions.find((item) => item.id === actionId);
    if (action) return action;
  }
  return null;
}

function makeDeskTaskFromBriefingAction(action) {
  return normalizeDeskTask({
    id: `task-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "queued",
    priority: action.urgencyRank <= 1 ? "high" : "normal",
    ticker: action.ticker,
    company: action.company,
    title: action.title,
    detail: action.detail,
    actionType: action.type,
    routeKind: action.actionKind,
    routeId: action.sourceId,
    routeLabel: action.actionLabel,
    sourceKey: `${action.actionKind}:${action.sourceId}:${action.title}`,
    dueLabel: formatCatalystDays(action.daysFromToday),
    dueDate: Number.isFinite(action.daysFromToday) && action.daysFromToday !== 9999 ? catalystDateFromToday(Math.max(0, action.daysFromToday)) : "",
    owner: "Research desk"
  });
}

function addBriefingActionToDeskTasks(action) {
  const task = makeDeskTaskFromBriefingAction(action);
  const existing = state.deskTasks.find((item) => item.sourceKey === task.sourceKey && item.status !== "done");
  if (existing) return { task: existing, added: false };
  state.deskTasks = [task, ...state.deskTasks].slice(0, 80);
  saveDeskTasks();
  return { task, added: true };
}

function captureDailyBriefingTask(actionId = "") {
  if (actionId && typeof actionId !== "string") actionId = "";
  const briefing = makeDailyBriefing(state.dailyBriefingMode || "morning");
  const action = actionId ? findDailyBriefingAction(actionId) : briefing.firstAction;
  if (!action) {
    flashDailyBriefingResult("No briefing action is available to capture.", "error");
    flashDeskTaskResult("No briefing action is available to capture.", "error");
    return;
  }
  const { task, added } = addBriefingActionToDeskTasks(action);
  state.deskTaskFilter = "open";
  if (els.deskTaskFilter) els.deskTaskFilter.value = "open";
  renderDeskTaskBoard();
  renderResearchSprintPlanner();
  renderIcMemoBuilder();
  renderClaimTraceInspector();
      renderAnswerQualityLab();
  renderLaunchControlRoom();
  document.querySelector("#desk-task-board")?.scrollIntoView({ behavior: "smooth", block: "start" });
  flashDailyBriefingResult(added ? `${task.ticker} added to Desk Task Board.` : `${task.ticker} is already on the task board.`, added ? "success" : "neutral");
  flashDeskTaskResult(added ? `${task.ticker} task captured from Daily Briefing.` : "Existing task highlighted in the open task view.", added ? "success" : "neutral");
}

function routeDeskTask(taskId) {
  const task = state.deskTasks.find((item) => item.id === taskId);
  if (!task) {
    flashDeskTaskResult("Task no longer exists.", "error");
    return;
  }
  if (task.status === "queued") {
    updateDeskTask(task.id, { status: "in-progress" });
  }
  if (task.routeKind === "calendar") {
    openCatalystAction(task.routeId);
    flashDeskTaskResult(`${task.ticker} catalyst task opened.`, "success");
    return;
  }
  if (task.routeKind === "portfolio") {
    openPortfolioAction(task.routeId || task.ticker);
    flashDeskTaskResult(`${task.ticker} portfolio task opened.`, "success");
    return;
  }
  if (task.routeKind === "review") {
    openReviewRadarItem(task.routeId);
    flashDeskTaskResult(`${task.ticker} review task opened.`, "success");
    return;
  }
  els.queryInput.value = `What should I check next for $${task.ticker}?`;
  document.querySelector("#desk")?.scrollIntoView({ behavior: "smooth", block: "start" });
  flashDeskTaskResult(`${task.ticker} desk question loaded.`, "neutral");
}

function progressDeskTask(taskId) {
  const task = state.deskTasks.find((item) => item.id === taskId);
  if (!task) return;
  const nextStatus = task.status === "queued" ? "in-progress" : task.status === "in-progress" ? "done" : "queued";
  updateDeskTask(task.id, { status: nextStatus });
  flashDeskTaskResult(`${task.ticker} moved to ${getDeskTaskStatusLabel(nextStatus)}.`, "success");
}

function completeDeskTask(taskId) {
  const task = state.deskTasks.find((item) => item.id === taskId);
  if (!task) return;
  updateDeskTask(task.id, { status: "done" });
  flashDeskTaskResult(`${task.ticker} task marked done.`, "success");
}

function deleteDeskTask(taskId) {
  const task = state.deskTasks.find((item) => item.id === taskId);
  state.deskTasks = state.deskTasks.filter((item) => item.id !== taskId);
  saveDeskTasks();
  renderDeskTaskBoard();
  renderResearchSprintPlanner();
  renderIcMemoBuilder();
  renderClaimTraceInspector();
      renderAnswerQualityLab();
  renderLaunchControlRoom();
  flashDeskTaskResult(task ? `${task.ticker} task deleted.` : "Task deleted.", "neutral");
}

function clearCompletedTasks() {
  const completed = state.deskTasks.filter((task) => task.status === "done").length;
  state.deskTasks = state.deskTasks.filter((task) => task.status !== "done");
  saveDeskTasks();
  renderDeskTaskBoard();
  renderResearchSprintPlanner();
  renderIcMemoBuilder();
  renderClaimTraceInspector();
      renderAnswerQualityLab();
  renderLaunchControlRoom();
  flashDeskTaskResult(completed ? `${completed} completed task${completed === 1 ? "" : "s"} cleared.` : "No completed tasks to clear.", completed ? "success" : "neutral");
}

function updateDeskTask(taskId, patch) {
  state.deskTasks = state.deskTasks.map((task) => task.id === taskId
    ? normalizeDeskTask({ ...task, ...patch, updatedAt: new Date().toISOString() })
    : task);
  saveDeskTasks();
  renderDeskTaskBoard();
  renderResearchSprintPlanner();
  renderIcMemoBuilder();
  renderClaimTraceInspector();
      renderAnswerQualityLab();
  renderLaunchControlRoom();
}

function saveDeskTasks() {
  saveJson(STORAGE_KEYS.deskTasks, state.deskTasks.map(normalizeDeskTask));
}

async function copyDeskTasks() {
  if (!state.deskTasks.length) {
    flashDeskTaskResult("No desk tasks to copy yet.", "error");
    return;
  }
  const copied = await copyTextToClipboard(makeDeskTaskBoardMarkdown());
  flashDeskTaskResult(copied ? "Desk task board copied." : "Clipboard blocked. Use export instead.", copied ? "success" : "error");
}

function exportDeskTasks() {
  if (!state.deskTasks.length) {
    flashDeskTaskResult("No desk tasks to export yet.", "error");
    return;
  }
  const date = new Date().toISOString().slice(0, 10);
  const filename = `niveshscope-desk-task-board-${date}.json`;
  downloadTextFile(filename, JSON.stringify(makeDeskTaskBoardJson(), null, 2), "application/json;charset=utf-8");
  flashDeskTaskResult("Desk task board JSON exported.", "success");
}

function makeDeskTaskBoardJson(board = makeDeskTaskBoard("all")) {
  return {
    product: "NiveshScope",
    version: DATA_VERSION,
    generatedAt: new Date().toISOString(),
    score: board.score,
    openCount: board.openCount,
    highOpenCount: board.highOpenCount,
    inProgressCount: board.inProgressCount,
    doneCount: board.doneCount,
    nextTask: board.nextTask,
    tasks: board.tasks
  };
}

function makeDeskTaskBoardMarkdown(board = makeDeskTaskBoard("all")) {
  const rows = board.tasks.length
    ? board.tasks.sort(sortDeskTasks).map((task, index) => [
      `## ${index + 1}. ${task.ticker} - ${task.title}`,
      "",
      `Status: ${getDeskTaskStatusLabel(task.status)}`,
      `Priority: ${getDeskTaskPriorityLabel(task.priority)}`,
      `Company: ${task.company}`,
      `Due: ${task.dueLabel || "Open"}`,
      `Route: ${task.routeKind}`,
      "",
      task.detail
    ].join("\n")).join("\n\n")
    : "No desk tasks captured.";
  return [
    "# NiveshScope Desk Task Board",
    "",
    `Generated: ${new Date().toLocaleString()}`,
    `Execution score: ${board.score}%`,
    `Open: ${board.openCount} | High: ${board.highOpenCount} | Done: ${board.doneCount}`,
    "",
    rows,
    "",
    "_Desk Task Board is an execution workflow log, not investment advice._"
  ].join("\n");
}

function getDeskTaskStatusLabel(status) {
  const labels = {
    queued: "Queued",
    "in-progress": "In progress",
    done: "Done"
  };
  return labels[status] || labels.queued;
}

function getDeskTaskPriorityLabel(priority) {
  return priority === "high" ? "High priority" : "Normal";
}

function flashDeskTaskResult(message, tone = "neutral") {
  if (!els.deskTaskResult) return;
  els.deskTaskResult.className = `builder-result is-${tone}`;
  els.deskTaskResult.textContent = message;
}

function renderResearchSprintPlanner() {
  if (!els.researchSprintSummary || !els.researchSprintList) return;
  const mode = els.researchSprintMode ? els.researchSprintMode.value : state.sprintMode || "focus";
  const capacity = Number(els.researchSprintCapacity ? els.researchSprintCapacity.value : state.sprintCapacity || 5);
  state.sprintMode = mode;
  state.sprintCapacity = String(capacity);
  const sprint = makeResearchSprintPlan(mode, capacity);
  if (els.researchSprintStatus) {
    els.researchSprintStatus.textContent = sprint.items.length ? `${sprint.items.length} actions` : "Clear";
  }
  if (els.startResearchSprint) els.startResearchSprint.disabled = !sprint.firstItem;
  if (els.captureSprintTasks) els.captureSprintTasks.disabled = !sprint.items.some((item) => item.source === "briefing");
  if (els.copyResearchSprint) els.copyResearchSprint.disabled = !sprint.items.length;
  if (els.exportResearchSprint) els.exportResearchSprint.disabled = !sprint.items.length;

  els.researchSprintSummary.innerHTML = `
    <div class="research-sprint-hero ${escapeAttr(sprint.statusClass)}">
      <div>
        <span>${escapeHtml(sprint.modeLabel)}</span>
        <strong>${escapeHtml(sprint.headline)}</strong>
        <p>${escapeHtml(sprint.summary)}</p>
      </div>
      <div class="research-sprint-score">
        <span>Sprint score</span>
        <strong>${escapeHtml(sprint.score)}%</strong>
      </div>
    </div>
    <div class="research-sprint-stats">
      <article><span>Planned</span><strong>${escapeHtml(sprint.items.length)}</strong><em>${escapeHtml(sprint.capacity)} capacity</em></article>
      <article><span>Captured</span><strong>${escapeHtml(sprint.capturedCount)}</strong><em>Already on board</em></article>
      <article><span>Source</span><strong>${escapeHtml(sprint.sourceCount)}</strong><em>Evidence actions</em></article>
      <article><span>Review</span><strong>${escapeHtml(sprint.reviewCount)}</strong><em>Decision actions</em></article>
    </div>
  `;

  els.researchSprintList.innerHTML = sprint.items.length
    ? sprint.items.map(renderResearchSprintItem).join("")
    : `<div class="empty-list">No sprint actions available for this mode. Capture or create tasks, then rebuild the sprint.</div>`;

  els.researchSprintList.querySelectorAll("button[data-route-sprint-item]").forEach((button) => {
    button.addEventListener("click", () => routeResearchSprintItem(button.dataset.routeSprintItem));
  });
  els.researchSprintList.querySelectorAll("button[data-capture-sprint-item]").forEach((button) => {
    button.addEventListener("click", () => captureResearchSprintItem(button.dataset.captureSprintItem));
  });
}

function makeResearchSprintPlan(mode = "focus", capacity = 5) {
  const safeCapacity = Math.max(1, Math.min(12, Number(capacity || 5)));
  const briefingMode = mode === "source" ? "source" : mode === "review" ? "review" : mode === "launch" ? "launch" : "morning";
  const board = makeDeskTaskBoard("all");
  const briefing = makeDailyBriefing(briefingMode);
  const taskItems = board.openTasks.map((task, index) => makeSprintItemFromTask(task, index));
  const openTaskKeys = new Set(board.openTasks.map((task) => task.sourceKey));
  const briefingItems = briefing.actions
    .map((action, index) => makeSprintItemFromBriefingAction(action, index))
    .filter((item) => !openTaskKeys.has(item.sourceKey));
  const allItems = [...taskItems, ...briefingItems]
    .filter((item) => itemMatchesSprintMode(item, mode))
    .sort(sortSprintItems);
  const items = allItems.slice(0, safeCapacity);
  const capturedCount = items.filter((item) => item.source === "task").length;
  const sourceCount = items.filter((item) => item.actionType === "source").length;
  const reviewCount = items.filter((item) => item.actionType === "review" || item.routeKind === "review").length;
  const highCount = items.filter((item) => item.priority === "high").length;
  const score = items.length
    ? Math.max(0, Math.min(100, Math.round(100 - highCount * 7 - Math.max(0, items.length - safeCapacity) * 3 + capturedCount * 5)))
    : 100;
  const firstItem = items[0] || null;
  const statusClass = highCount >= 3 ? "is-blocked" : items.length ? "is-review" : "is-ready";
  const modeLabel = getResearchSprintModeLabel(mode);
  const headline = firstItem
    ? `${firstItem.ticker} - ${firstItem.title}`
    : "No sprint work queued.";
  const summary = firstItem
    ? firstItem.detail
    : "The sprint planner will pull open task-board work first, then fill remaining capacity from Daily Briefing.";
  return {
    mode,
    modeLabel,
    capacity: safeCapacity,
    score,
    statusClass,
    headline,
    summary,
    firstItem,
    items,
    candidateCount: allItems.length,
    capturedCount,
    sourceCount,
    reviewCount,
    highCount,
    board,
    briefing
  };
}

function makeSprintItemFromTask(task, index) {
  return {
    id: `task-${task.id}`,
    source: "task",
    taskId: task.id,
    sourceKey: task.sourceKey,
    ticker: task.ticker,
    company: task.company,
    title: task.title,
    detail: task.detail,
    actionType: task.actionType,
    routeKind: task.routeKind,
    routeId: task.routeId,
    routeLabel: task.routeLabel,
    dueLabel: task.dueLabel || "Open",
    priority: task.priority,
    status: task.status,
    rank: (task.priority === "high" ? 0 : 20) + (task.status === "in-progress" ? 0 : 6) + index
  };
}

function makeSprintItemFromBriefingAction(action, index) {
  return {
    id: `briefing-${action.id}`,
    source: "briefing",
    actionId: action.id,
    sourceKey: `${action.actionKind}:${action.sourceId}:${action.title}`,
    ticker: action.ticker,
    company: action.company,
    title: action.title,
    detail: action.detail,
    actionType: action.type,
    routeKind: action.actionKind,
    routeId: action.sourceId,
    routeLabel: action.actionLabel,
    dueLabel: formatCatalystDays(action.daysFromToday),
    priority: action.urgencyRank <= 1 ? "high" : "normal",
    status: "uncaptured",
    rank: (action.urgencyRank <= 1 ? 10 : 32) + index
  };
}

function itemMatchesSprintMode(item, mode) {
  if (mode === "source") return item.actionType === "source";
  if (mode === "review") return item.actionType === "review" || item.routeKind === "review";
  if (mode === "launch") return item.priority === "high" || ["source", "review", "risk", "portfolio"].includes(item.actionType);
  return true;
}

function sortSprintItems(a, b) {
  return a.rank - b.rank || a.ticker.localeCompare(b.ticker) || a.title.localeCompare(b.title);
}

function renderResearchSprintItem(item) {
  const className = item.priority === "high" ? "is-blocked" : item.source === "task" ? "is-review" : "is-neutral";
  return `
    <article class="research-sprint-card ${escapeAttr(className)}">
      <div class="research-sprint-card-head">
        <div>
          <span>${escapeHtml(item.source)} - ${escapeHtml(item.actionType)}</span>
          <strong>${escapeHtml(item.ticker)} - ${escapeHtml(item.title)}</strong>
        </div>
        <em>${escapeHtml(item.priority === "high" ? "High" : "Normal")}</em>
      </div>
      <p>${escapeHtml(item.detail)}</p>
      <div class="research-sprint-meta">
        <div><span>Status</span><strong>${escapeHtml(item.source === "task" ? getDeskTaskStatusLabel(item.status) : "Uncaptured")}</strong></div>
        <div><span>Due</span><strong>${escapeHtml(item.dueLabel || "Open")}</strong></div>
        <div><span>Route</span><strong>${escapeHtml(item.routeKind)}</strong></div>
      </div>
      <div class="note-actions">
        ${item.source === "briefing" ? `<button type="button" data-capture-sprint-item="${escapeAttr(item.id)}">Capture</button>` : ""}
        <button type="button" data-route-sprint-item="${escapeAttr(item.id)}">${escapeHtml(item.routeLabel || "Open")}</button>
      </div>
    </article>
  `;
}

function startResearchSprint() {
  const sprint = makeResearchSprintPlan(state.sprintMode || "focus", Number(state.sprintCapacity || 5));
  if (!sprint.firstItem) {
    flashResearchSprintResult("No sprint action is available.", "error");
    return;
  }
  routeResearchSprintItem(sprint.firstItem.id);
}

function routeResearchSprintItem(itemId) {
  const sprint = makeResearchSprintPlan(state.sprintMode || "focus", Number(state.sprintCapacity || 5));
  const item = sprint.items.find((candidate) => candidate.id === itemId);
  if (!item) {
    flashResearchSprintResult("Sprint item is no longer available.", "error");
    return;
  }
  if (item.source === "task") {
    routeDeskTask(item.taskId);
    flashResearchSprintResult(`${item.ticker} task opened from sprint.`, "success");
    return;
  }
  routeBriefingLikeAction(item);
}

function routeBriefingLikeAction(item) {
  if (item.routeKind === "calendar") {
    openCatalystAction(item.routeId);
    flashResearchSprintResult(`${item.ticker} catalyst opened from sprint.`, "success");
    return;
  }
  if (item.routeKind === "portfolio") {
    openPortfolioAction(item.routeId || item.ticker);
    flashResearchSprintResult(`${item.ticker} portfolio action opened from sprint.`, "success");
    return;
  }
  if (item.routeKind === "review") {
    openReviewRadarItem(item.routeId);
    flashResearchSprintResult(`${item.ticker} review opened from sprint.`, "success");
    return;
  }
  els.queryInput.value = `What should I check next for $${item.ticker}?`;
  document.querySelector("#desk")?.scrollIntoView({ behavior: "smooth", block: "start" });
  flashResearchSprintResult(`${item.ticker} desk question loaded from sprint.`, "neutral");
}

function captureResearchSprintItem(itemId) {
  const sprint = makeResearchSprintPlan(state.sprintMode || "focus", Number(state.sprintCapacity || 5));
  const item = sprint.items.find((candidate) => candidate.id === itemId);
  if (!item || item.source !== "briefing") {
    flashResearchSprintResult("Only uncaptured briefing items can be captured from here.", "error");
    return;
  }
  const action = findDailyBriefingAction(item.actionId, getBriefingModeForSprint(state.sprintMode || "focus"));
  if (!action) {
    flashResearchSprintResult("Briefing action is no longer available.", "error");
    return;
  }
  const { task, added } = addBriefingActionToDeskTasks(action);
  renderDeskTaskBoard();
  renderResearchSprintPlanner();
  renderIcMemoBuilder();
  renderClaimTraceInspector();
      renderAnswerQualityLab();
  renderLaunchControlRoom();
  flashResearchSprintResult(added ? `${task.ticker} captured into Desk Task Board.` : `${task.ticker} was already captured.`, added ? "success" : "neutral");
}

function captureResearchSprintTasks() {
  const sprint = makeResearchSprintPlan(state.sprintMode || "focus", Number(state.sprintCapacity || 5));
  let addedCount = 0;
  for (const item of sprint.items) {
    if (item.source !== "briefing") continue;
    const action = findDailyBriefingAction(item.actionId, getBriefingModeForSprint(state.sprintMode || "focus"));
    if (!action) continue;
    const result = addBriefingActionToDeskTasks(action);
    if (result.added) addedCount += 1;
  }
  renderDeskTaskBoard();
  renderResearchSprintPlanner();
  renderIcMemoBuilder();
  renderClaimTraceInspector();
      renderAnswerQualityLab();
  renderLaunchControlRoom();
  flashResearchSprintResult(addedCount ? `${addedCount} sprint action${addedCount === 1 ? "" : "s"} captured into tasks.` : "No new sprint actions needed capture.", addedCount ? "success" : "neutral");
}

async function copyResearchSprint() {
  const sprint = makeResearchSprintPlan(state.sprintMode || "focus", Number(state.sprintCapacity || 5));
  if (!sprint.items.length) {
    flashResearchSprintResult("No sprint actions to copy yet.", "error");
    return;
  }
  const copied = await copyTextToClipboard(makeResearchSprintMarkdown(sprint));
  flashResearchSprintResult(copied ? "Research sprint copied." : "Clipboard blocked. Use export instead.", copied ? "success" : "error");
}

function exportResearchSprint() {
  const sprint = makeResearchSprintPlan(state.sprintMode || "focus", Number(state.sprintCapacity || 5));
  if (!sprint.items.length) {
    flashResearchSprintResult("No sprint actions to export yet.", "error");
    return;
  }
  const date = new Date().toISOString().slice(0, 10);
  const filename = `niveshscope-research-sprint-${date}.json`;
  downloadTextFile(filename, JSON.stringify(makeResearchSprintJson(sprint), null, 2), "application/json;charset=utf-8");
  flashResearchSprintResult("Research sprint JSON exported.", "success");
}

function makeResearchSprintJson(sprint = makeResearchSprintPlan(state.sprintMode || "focus", Number(state.sprintCapacity || 5))) {
  return {
    product: "NiveshScope",
    version: DATA_VERSION,
    generatedAt: new Date().toISOString(),
    mode: sprint.mode,
    capacity: sprint.capacity,
    score: sprint.score,
    headline: sprint.headline,
    plannedCount: sprint.items.length,
    capturedCount: sprint.capturedCount,
    sourceCount: sprint.sourceCount,
    reviewCount: sprint.reviewCount,
    highCount: sprint.highCount,
    items: sprint.items
  };
}

function makeResearchSprintMarkdown(sprint = makeResearchSprintPlan(state.sprintMode || "focus", Number(state.sprintCapacity || 5))) {
  const rows = sprint.items.map((item, index) => [
    `## ${index + 1}. ${item.ticker} - ${item.title}`,
    "",
    `Source: ${item.source}`,
    `Priority: ${item.priority}`,
    `Status: ${item.source === "task" ? getDeskTaskStatusLabel(item.status) : "Uncaptured"}`,
    `Route: ${item.routeKind}`,
    `Due: ${item.dueLabel || "Open"}`,
    "",
    item.detail
  ].join("\n")).join("\n\n");
  return [
    "# NiveshScope Research Sprint",
    "",
    `Generated: ${new Date().toLocaleString()}`,
    `Mode: ${sprint.modeLabel}`,
    `Capacity: ${sprint.capacity}`,
    `Sprint score: ${sprint.score}%`,
    "",
    rows,
    "",
    "_Research Sprint Planner is an execution workflow, not investment advice._"
  ].join("\n");
}

function getResearchSprintModeLabel(mode) {
  const labels = {
    focus: "90-minute focus",
    source: "Source sprint",
    review: "Review sprint",
    launch: "Launch prep",
    full: "Full-day queue"
  };
  return labels[mode] || labels.focus;
}

function getBriefingModeForSprint(mode) {
  if (mode === "source") return "source";
  if (mode === "review") return "review";
  if (mode === "launch") return "launch";
  return "morning";
}

function flashResearchSprintResult(message, tone = "neutral") {
  if (!els.researchSprintResult) return;
  els.researchSprintResult.className = `builder-result is-${tone}`;
  els.researchSprintResult.textContent = message;
}

function renderIcMemoBuilder() {
  if (!els.icMemoSummary || !els.icMemoSections) return;
  const mode = els.icMemoMode ? els.icMemoMode.value : state.icMemoMode || "committee";
  state.icMemoMode = mode;
  const memo = makeIcMemoPlan(mode);
  if (els.icMemoStatus) els.icMemoStatus.textContent = memo.statusLabel;
  if (els.copyIcMemo) els.copyIcMemo.disabled = !memo.hasBrief;
  if (els.exportIcMemoPdf) els.exportIcMemoPdf.disabled = !memo.hasBrief;
  if (els.exportIcMemoJson) els.exportIcMemoJson.disabled = !memo.hasBrief;
  if (els.openIcMemoBlocker) els.openIcMemoBlocker.disabled = !memo.nextBlocker;

  els.icMemoSummary.innerHTML = `
    <div class="ic-memo-hero ${escapeAttr(memo.statusClass)}">
      <div>
        <span>${escapeHtml(memo.modeLabel)}</span>
        <strong>${escapeHtml(memo.headline)}</strong>
        <p>${escapeHtml(memo.summary)}</p>
      </div>
      <div class="ic-memo-score">
        <span>Memo score</span>
        <strong>${escapeHtml(memo.score)}%</strong>
      </div>
    </div>
    <div class="ic-memo-stats">
      <article><span>Focus</span><strong>${escapeHtml(memo.ticker)}</strong><em>${escapeHtml(memo.companyName)}</em></article>
      <article><span>Gate</span><strong>${escapeHtml(memo.gate.score)}%</strong><em>${escapeHtml(memo.gate.statusLabel)}</em></article>
      <article><span>Sources</span><strong>${escapeHtml(memo.packet.meta.realSourceCount)}/${escapeHtml(memo.packet.meta.requiredSourceCount)}</strong><em>REAL source types</em></article>
      <article><span>Sprint</span><strong>${escapeHtml(memo.sprint.items.length)}/${escapeHtml(memo.sprint.capacity)}</strong><em>${memo.sprint.firstItem ? escapeHtml(`${memo.sprint.firstItem.ticker} next`) : "No sprint actions"}</em></article>
    </div>
  `;

  els.icMemoSections.innerHTML = memo.sections.map((section) => `
    <article class="ic-memo-card ${escapeAttr(section.className)}">
      <div class="ic-memo-card-head">
        <div>
          <span>${escapeHtml(section.kicker)}</span>
          <strong>${escapeHtml(section.title)}</strong>
        </div>
        <em>${escapeHtml(section.status)}</em>
      </div>
      <p>${escapeHtml(section.body)}</p>
      ${section.items.length ? `
        <ul>
          ${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      ` : ""}
    </article>
  `).join("");
}

function makeIcMemoPlan(mode = state.icMemoMode || "committee") {
  const packet = makeBriefPacket();
  const gate = makeInvestmentGateAudit();
  const ticker = normalizeTicker(packet.meta?.ticker || state.selectedTicker || getDefaultWatchlistTickers()[0] || "DESK");
  const company = getCompany(ticker);
  const latestReview = getLatestMemoReviewForTicker(ticker);
  const latestDecision = getLatestDecisionForTicker(ticker);
  const sprint = makeResearchSprintPlan("focus", 5);
  const board = makeDeskTaskBoard("all");
  const valuation = getCurrentValuationSnapshot(ticker);
  const nextGap = packet.nextGap || gate.nextGap || null;
  const sourceTypes = Array.from(new Set(packet.citations.map((citation) => citation.type))).slice(0, 4);
  const syntheticCount = packet.citations.filter((citation) => normalizeSourceStatus(citation.sourceStatus) === "synthetic").length;
  const claimTrace = makeClaimTraceAudit("answer", { skipIcMemo: true });
  const blockers = makeIcMemoBlockers({ packet, gate, latestReview, latestDecision, sprint, nextGap });
  const hasBrief = packet.hasBrief;
  const score = hasBrief ? Math.round(
    packet.score * 0.26
    + gate.score * 0.22
    + claimTrace.traceQuality * 0.12
    + (latestReview ? 15 : 0)
    + (latestDecision ? 10 : 0)
    + Math.min(10, packet.citations.length * 2)
    + Math.min(10, sprint.items.length * 2)
    - syntheticCount * 5
    - claimTrace.blockedCount * 4
  ) : 0;
  const safeScore = Math.max(0, Math.min(100, score));
  const modeLabel = getIcMemoModeLabel(mode);
  const statusLabel = !hasBrief
    ? "Run a memo first"
    : blockers.some((blocker) => blocker.severity === "High")
      ? "IC blocked"
      : safeScore >= 82
        ? "IC packet ready"
        : safeScore >= 62
          ? "IC pre-read draft"
          : "Source review draft";
  const statusClass = !hasBrief || blockers.some((blocker) => blocker.severity === "High")
    ? "is-blocked"
    : safeScore >= 82
      ? "is-ready"
      : "is-review";
  const headline = hasBrief
    ? `${ticker} committee memo packet is ${statusLabel.toLowerCase()}.`
    : "Build the IC memo after running a cited desk answer.";
  const summary = hasBrief
    ? `Combines the answer, gate, ${packet.citations.length} citations, ${packet.gaps.length} source gaps, review trail, decision trail, valuation snapshot, and current sprint handoff.`
    : "Run a question, then the builder will assemble a committee packet with evidence, blockers, valuation context, and next actions.";
  const sections = makeIcMemoSections({
    mode,
    packet,
    gate,
    latestReview,
    latestDecision,
    sprint,
    board,
    valuation,
    nextGap,
    sourceTypes,
    syntheticCount,
    claimTrace
  });
  return {
    mode,
    modeLabel,
    hasBrief,
    ticker,
    companyName: company ? company.name : packet.meta?.company || ticker,
    statusLabel,
    statusClass,
    score: safeScore,
    headline,
    summary,
    packet,
    gate,
    latestReview,
    latestDecision,
    sprint,
    board,
    valuation,
    sourceTypes,
    syntheticCount,
    claimTrace,
    nextBlocker: blockers[0] || null,
    blockers,
    sections
  };
}

function makeIcMemoBlockers({ packet, gate, latestReview, latestDecision, sprint, nextGap }) {
  const blockers = [];
  if (!packet.hasBrief) {
    blockers.push({
      severity: "High",
      action: "run-question",
      title: "No active research answer",
      detail: "Run a cited desk answer before building an IC memo."
    });
  }
  if (packet.hasBrief && gate.requiredBlockers.length) {
    blockers.push({
      severity: "High",
      action: nextGap ? "source" : "gate",
      ticker: packet.meta.ticker,
      requirementKey: nextGap?.key || "",
      title: gate.requiredBlockers[0].label,
      detail: gate.requiredBlockers[0].detail
    });
  }
  if (packet.hasBrief && !latestReview) {
    blockers.push({
      severity: "Medium",
      action: "review",
      title: "No human review saved",
      detail: "Save a Memo Review Room decision before circulating a committee packet."
    });
  }
  if (packet.hasBrief && !latestDecision) {
    blockers.push({
      severity: "Medium",
      action: "decision",
      title: "No decision journal entry",
      detail: "Record the thesis status, review horizon, and next evidence task."
    });
  }
  if (packet.hasBrief && sprint.items.length) {
    const highSprint = sprint.items.find((item) => item.priority === "high");
    if (highSprint) {
      blockers.push({
        severity: "Low",
        action: "sprint",
        title: "Sprint action still open",
        detail: `${highSprint.ticker} ${highSprint.title} is still in the active sprint.`
      });
    }
  }
  return blockers;
}

function makeIcMemoSections({ mode, packet, gate, latestReview, latestDecision, sprint, board, valuation, nextGap, sourceTypes, syntheticCount, claimTrace }) {
  const answerLine = packet.hasBrief ? packet.headline : "No current answer has been generated yet.";
  const evidenceItems = packet.citations.slice(0, 4).map((citation) => {
    return `${citation.citationId || "C"} ${citation.ticker} ${citation.type} ${citation.section}: ${snippet(citation.text, 110)}`;
  });
  const gapItems = packet.gaps.slice(0, 4).map((gap) => `${gap.label}: ${gap.status}`);
  const sprintItems = sprint.items.slice(0, 4).map((item) => `${item.ticker} ${item.title} - ${item.detail}`);
  const highTasks = board.openTasks.filter((task) => task.priority === "high").slice(0, 3).map((task) => `${task.ticker} ${task.title}`);
  const weakClaims = claimTrace.claims
    .filter((claim) => claim.statusKey !== "supported")
    .slice(0, 3)
    .map((claim) => `${claim.statusLabel} (${claim.supportScore}%): ${claim.text}`);
  return [
    {
      kicker: "Decision ask",
      title: packet.hasBrief ? `${packet.meta.ticker} - ${getIcMemoDecisionAsk(mode, gate, latestReview)}` : "Run a cited answer first",
      status: packet.hasBrief ? gate.statusLabel : "No memo",
      className: gate.statusClass || "is-blocked",
      body: packet.hasBrief ? answerLine : "Use the desk question box or a memo shortcut, then return here for a full IC packet.",
      items: [
        packet.meta.question ? `Question: ${packet.meta.question}` : "",
        latestReview ? `Latest review: ${getMemoReviewDecisionLabel(latestReview.decision)} by ${latestReview.owner}` : "Review trail: not saved",
        latestDecision ? `Decision trail: ${getDecisionJournalLabel(latestDecision.decision)} (${latestDecision.reviewHorizon})` : "Decision trail: not logged"
      ].filter(Boolean)
    },
    {
      kicker: "Evidence package",
      title: `${packet.citations.length} citations | ${sourceTypes.length || 0} source types`,
      status: syntheticCount ? `${syntheticCount} SYN` : "Clean",
      className: syntheticCount ? "is-blocked" : packet.citations.length >= 3 ? "is-ready" : "is-review",
      body: sourceTypes.length ? `Source spread: ${sourceTypes.join(", ")}.` : "Evidence stack appears after analysis.",
      items: evidenceItems.length ? evidenceItems : ["No citations captured yet."]
    },
    {
      kicker: "Readiness controls",
      title: `${gate.score}% gate score | ${packet.score}% packet score`,
      status: gate.requiredBlockers.length ? "Blockers" : "Pass",
      className: gate.requiredBlockers.length ? "is-blocked" : "is-ready",
      body: gate.summary,
      items: gate.requiredBlockers.length
        ? gate.requiredBlockers.slice(0, 3).map((blocker) => `${blocker.label}: ${blocker.detail}`)
        : ["Required source, guard, and evidence checks are clear for review."]
    },
    {
      kicker: "Valuation and gaps",
      title: valuation.valuePerShare ? `${valuation.valuePerShare} | ${valuation.equityValue}` : "Valuation lens snapshot",
      status: nextGap ? "Gap open" : "No gap",
      className: nextGap ? "is-review" : "is-ready",
      body: `Current assumptions: ${valuation.revenueCagr}% revenue CAGR, ${valuation.fcfMargin}% FCF margin, ${valuation.terminalMultiple}x terminal multiple, ${valuation.discountRate}% discount rate.`,
      items: gapItems.length ? gapItems : ["No required source gaps for the selected company."]
    },
    {
      kicker: "Claim trace",
      title: `${claimTrace.supportedCount}/${claimTrace.claims.length} claims supported`,
      status: claimTrace.statusLabel,
      className: claimTrace.statusClass,
      body: claimTrace.summary,
      items: weakClaims.length ? weakClaims : ["No weak claims visible in the current answer scope."]
    },
    {
      kicker: "Execution handoff",
      title: `${sprint.items.length} sprint actions | ${board.highOpenCount} high tasks`,
      status: sprint.items.length ? "Active" : "Clear",
      className: board.highOpenCount ? "is-review" : "is-ready",
      body: "Committee packets stay useful only when source tasks and review actions have clear owners.",
      items: sprintItems.length ? sprintItems : (highTasks.length ? highTasks : ["No open sprint handoff."])
    }
  ];
}

function getIcMemoDecisionAsk(mode, gate, latestReview) {
  if (mode === "source-review") return "source remediation review";
  if (mode === "watchlist") return "watchlist monitoring note";
  if (mode === "pilot") return "pilot pre-read";
  if (gate.requiredBlockers.length) return "blocker review";
  if (latestReview && latestReview.decision === "committee-ready") return "committee decision";
  return "committee pre-read";
}

async function copyIcMemo() {
  const memo = makeIcMemoPlan();
  if (!memo.hasBrief) {
    flashIcMemoResult("Run a desk answer before copying an IC memo.", "error");
    return;
  }
  const copied = await copyTextToClipboard(makeIcMemoMarkdown(memo));
  flashIcMemoResult(copied ? "IC memo copied." : "Clipboard blocked. Use PDF or JSON export.", copied ? "success" : "error");
}

function exportIcMemoJson() {
  const memo = makeIcMemoPlan();
  if (!memo.hasBrief) {
    flashIcMemoResult("Run a desk answer before exporting an IC memo.", "error");
    return;
  }
  const date = new Date().toISOString().slice(0, 10);
  const filename = `niveshscope-${String(memo.ticker || "desk").toLowerCase()}-ic-memo-${date}.json`;
  downloadTextFile(filename, JSON.stringify(makeIcMemoJson(memo), null, 2), "application/json;charset=utf-8");
  flashIcMemoResult("IC memo JSON exported.", "success");
}

function exportIcMemoPdf() {
  const memo = makeIcMemoPlan();
  if (!memo.hasBrief) {
    flashIcMemoResult("Run a desk answer before exporting an IC memo PDF.", "error");
    return;
  }
  const date = new Date().toISOString().slice(0, 10);
  const filename = `niveshscope-${String(memo.ticker || "desk").toLowerCase()}-ic-memo-${date}.pdf`;
  const pdfBytes = buildNiveshPdfBrief({
    body: makeIcMemoMarkdown(memo),
    meta: {
      ...memo.packet.meta,
      confidence: memo.packet.meta.confidence,
      evidenceQuality: memo.packet.meta.evidenceQuality,
      investmentGateStatus: memo.gate.statusLabel,
      investmentGateScore: memo.gate.score,
      exportPosture: memo.statusLabel,
      readinessBlocker: memo.nextBlocker?.title || "",
      citationCount: memo.packet.citations.length
    },
    citations: memo.packet.citations,
    title: `${memo.ticker} IC Memo - ${memo.statusLabel}`
  });
  downloadBinaryFile(filename, pdfBytes, "application/pdf");
  flashIcMemoResult("IC memo PDF exported.", "success");
}

function openIcMemoBlocker() {
  const memo = makeIcMemoPlan();
  const blocker = memo.nextBlocker;
  if (!blocker) {
    flashIcMemoResult("No IC memo blocker is open.", "success");
    return;
  }
  if (blocker.action === "run-question") {
    const ticker = state.selectedTicker || STARTER_PACK_TICKERS[0];
    els.queryInput.value = `Draft an investment committee brief for $${ticker}: bottom line, evidence stack, risk factors, valuation read-through, and what would change the answer.`;
    document.querySelector("#desk")?.scrollIntoView({ behavior: "smooth", block: "start" });
    flashIcMemoResult("IC memo starter question loaded in the desk.", "neutral");
    return;
  }
  if (blocker.action === "source" && blocker.ticker && blocker.requirementKey) {
    loadSourceTaskIntoBuilder(blocker.ticker, blocker.requirementKey);
    flashIcMemoResult(`${blocker.ticker} source blocker opened in Source Studio.`, "success");
    return;
  }
  if (blocker.action === "review") {
    document.querySelector("#memo-review-room")?.scrollIntoView({ behavior: "smooth", block: "start" });
    flashIcMemoResult("Memo Review Room opened for the human review decision.", "neutral");
    return;
  }
  if (blocker.action === "decision") {
    document.querySelector("#decision-journal")?.scrollIntoView({ behavior: "smooth", block: "start" });
    flashIcMemoResult("Decision Journal opened for the committee trail.", "neutral");
    return;
  }
  if (blocker.action === "sprint") {
    document.querySelector("#research-sprint-planner")?.scrollIntoView({ behavior: "smooth", block: "start" });
    flashIcMemoResult("Research Sprint Planner opened for the execution handoff.", "neutral");
    return;
  }
  document.querySelector("#investment-gate")?.scrollIntoView({ behavior: "smooth", block: "start" });
  flashIcMemoResult("Investment Readiness Gate opened.", "neutral");
}

function makeIcMemoJson(memo = makeIcMemoPlan()) {
  return {
    product: "NiveshScope",
    version: DATA_VERSION,
    generatedAt: new Date().toISOString(),
    mode: memo.mode,
    status: memo.statusLabel,
    score: memo.score,
    focus: {
      ticker: memo.ticker,
      company: memo.companyName
    },
    packet: makeBriefPacketJson(memo.packet),
    gate: {
      status: memo.gate.statusLabel,
      score: memo.gate.score,
      summary: memo.gate.summary,
      blockers: memo.gate.requiredBlockers.map((blocker) => ({ label: blocker.label, detail: blocker.detail }))
    },
    review: memo.latestReview || null,
    decision: memo.latestDecision || null,
    valuation: memo.valuation,
    sprint: makeResearchSprintJson(memo.sprint),
    claimTrace: makeClaimTraceJson(memo.claimTrace || makeClaimTraceAudit("answer", { skipIcMemo: true })),
    sections: memo.sections.map(({ kicker, title, status, body, items }) => ({ kicker, title, status, body, items })),
    blockers: memo.blockers
  };
}

function makeIcMemoMarkdown(memo = makeIcMemoPlan()) {
  const citationText = memo.packet.citations.length
    ? memo.packet.citations.map((citation) => `- ${citation.citationId || "C"} | ${citation.ticker} | ${citation.type} | ${citation.section}: ${snippet(citation.text, 240)}`).join("\n")
    : "- No citations captured.";
  const gapText = memo.packet.gaps.length
    ? memo.packet.gaps.map((gap) => `- ${gap.label}: ${gap.status}`).join("\n")
    : "- No required source gaps.";
  const blockerText = memo.blockers.length
    ? memo.blockers.map((blocker) => `- ${blocker.severity}: ${blocker.title} - ${blocker.detail}`).join("\n")
    : "- No IC memo blockers detected.";
  const sprintText = memo.sprint.items.length
    ? memo.sprint.items.map((item, index) => `${index + 1}. ${item.ticker} - ${item.title}: ${item.detail}`).join("\n")
    : "No sprint handoff actions.";
  const claimTrace = memo.claimTrace || makeClaimTraceAudit("answer", { skipIcMemo: true });
  const claimTraceText = claimTrace.claims.length
    ? claimTrace.claims.slice(0, 8).map((claim, index) => [
        `${index + 1}. ${claim.statusLabel} | ${claim.supportScore}% | ${claim.critical ? "Critical" : "Standard"}`,
        `   Claim: ${claim.text}`,
        `   Citation: ${claim.citationId || "None"} | Source: ${claim.sourceStatus}`
      ].join("\n")).join("\n")
    : "No claims traced in the current scope.";
  return [
    "# NiveshScope IC Memo",
    "",
    `Generated: ${new Date().toLocaleString()}`,
    `Format: ${memo.modeLabel}`,
    `Focus: ${memo.ticker} - ${memo.companyName}`,
    `Status: ${memo.statusLabel} (${memo.score}%)`,
    `Gate: ${memo.gate.statusLabel} (${memo.gate.score}%)`,
    `Memo packet: ${memo.packet.statusLabel} (${memo.packet.score}%)`,
    "",
    "## Decision Ask",
    "",
    memo.sections[0]?.title || "Review current memo.",
    "",
    "## Current Answer",
    "",
    state.lastBrief || "No answer loaded.",
    "",
    "## Evidence Package",
    "",
    citationText,
    "",
    "## Source Gaps",
    "",
    gapText,
    "",
    "## Claim Trace",
    "",
    `Status: ${claimTrace.statusLabel} | Trace quality: ${claimTrace.traceQuality}% | Unsupported: ${claimTrace.unsupportedCount} | SYN: ${claimTrace.synCount}`,
    "",
    claimTraceText,
    "",
    "## Valuation Snapshot",
    "",
    `${memo.valuation.valuePerShare || "No value"} | ${memo.valuation.equityValue || "No equity value"} | ${memo.valuation.revenueCagr}% revenue CAGR | ${memo.valuation.fcfMargin}% FCF margin | ${memo.valuation.terminalMultiple}x terminal multiple | ${memo.valuation.discountRate}% discount rate`,
    "",
    "## Review And Decision Trail",
    "",
    `Review: ${memo.latestReview ? `${getMemoReviewDecisionLabel(memo.latestReview.decision)} by ${memo.latestReview.owner}` : "Not saved"}`,
    `Decision: ${memo.latestDecision ? `${getDecisionJournalLabel(memo.latestDecision.decision)} | ${memo.latestDecision.reviewHorizon}` : "Not logged"}`,
    "",
    "## Open Blockers",
    "",
    blockerText,
    "",
    "## Sprint Handoff",
    "",
    sprintText,
    "",
    "_NiveshScope IC Memo Builder prepares a research packet. It is not investment advice, and REAL source verification plus human judgement remain required._"
  ].join("\n");
}

function getIcMemoModeLabel(mode) {
  const labels = {
    committee: "Committee packet",
    pilot: "Pilot pre-read",
    "source-review": "Source review",
    watchlist: "Watchlist note"
  };
  return labels[mode] || labels.committee;
}

function flashIcMemoResult(message, tone = "neutral") {
  if (!els.icMemoResult) return;
  els.icMemoResult.className = `builder-result is-${tone}`;
  els.icMemoResult.textContent = message;
}

function renderClaimTraceInspector() {
  if (!els.claimTraceSummary || !els.claimTraceList) return;
  const mode = els.claimTraceMode ? els.claimTraceMode.value : state.claimTraceMode || "answer";
  state.claimTraceMode = mode;
  const audit = makeClaimTraceAudit(mode);
  if (els.claimTraceStatus) els.claimTraceStatus.textContent = audit.statusLabel;
  if (els.openWeakClaim) els.openWeakClaim.disabled = !audit.weakestClaim;
  if (els.copyClaimTrace) els.copyClaimTrace.disabled = !audit.hasBrief || !audit.claims.length;
  if (els.exportClaimTrace) els.exportClaimTrace.disabled = !audit.hasBrief || !audit.claims.length;

  els.claimTraceSummary.innerHTML = `
    <div class="claim-trace-hero ${escapeAttr(audit.statusClass)}">
      <div>
        <span>${escapeHtml(audit.modeLabel)}</span>
        <strong>${escapeHtml(audit.headline)}</strong>
        <p>${escapeHtml(audit.summary)}</p>
      </div>
      <div class="claim-trace-score">
        <span>Trace quality</span>
        <strong>${escapeHtml(audit.traceQuality)}%</strong>
      </div>
    </div>
    <div class="claim-trace-stats">
      <article><span>Claims</span><strong>${escapeHtml(audit.claims.length)}</strong><em>${escapeHtml(audit.criticalCount)} critical</em></article>
      <article><span>Supported</span><strong>${escapeHtml(audit.supportedCount)}</strong><em>source-linked</em></article>
      <article><span>Review</span><strong>${escapeHtml(audit.reviewCount)}</strong><em>${escapeHtml(audit.synCount)} SYN</em></article>
      <article><span>Unsupported</span><strong>${escapeHtml(audit.unsupportedCount)}</strong><em>${escapeHtml(audit.blockedCount)} blocking</em></article>
    </div>
  `;

  els.claimTraceList.innerHTML = audit.claims.length
    ? audit.claims.map(renderClaimTraceCard).join("")
    : `<div class="empty-list">${audit.hasBrief ? "No claims matched this trace scope." : "Run a desk answer, then the trace inspector will map claims to citations."}</div>`;

  els.claimTraceList.querySelectorAll("button[data-open-claim]").forEach((button) => {
    button.addEventListener("click", () => openClaimTraceItem(button.dataset.openClaim));
  });
}

function makeClaimTraceAudit(mode = state.claimTraceMode || "answer", options = {}) {
  const packet = makeBriefPacket();
  const hasBrief = packet.hasBrief;
  const sourceText = makeClaimTraceSourceText(mode, packet, options);
  const extracted = hasBrief ? extractTraceClaims(sourceText, mode) : [];
  const traced = extracted.map((claim, index) => scoreTraceClaim(claim, index, packet));
  const visibleClaims = filterTraceClaims(traced, mode);
  const supportedCount = visibleClaims.filter((claim) => claim.statusKey === "supported").length;
  const reviewCount = visibleClaims.filter((claim) => claim.statusKey === "review").length;
  const unsupportedCount = visibleClaims.filter((claim) => claim.statusKey === "unsupported").length;
  const criticalCount = visibleClaims.filter((claim) => claim.critical).length;
  const synCount = visibleClaims.filter((claim) => claim.sourceStatus === "synthetic").length;
  const blockedCount = visibleClaims.filter((claim) => claim.statusKey === "unsupported" && claim.critical).length;
  const averageSupport = visibleClaims.length
    ? Math.round(visibleClaims.reduce((sum, claim) => sum + claim.supportScore, 0) / visibleClaims.length)
    : hasBrief ? 100 : 0;
  const traceQuality = hasBrief
    ? Math.max(0, Math.min(100, Math.round(averageSupport - unsupportedCount * 9 - synCount * 5 - blockedCount * 8)))
    : 0;
  const weakestClaim = visibleClaims
    .slice()
    .sort((a, b) => a.supportScore - b.supportScore || Number(b.critical) - Number(a.critical))[0] || null;
  const statusLabel = !hasBrief
    ? "Run an answer"
    : blockedCount
      ? "Trace blocked"
      : unsupportedCount || synCount
        ? "Trace review"
        : "Trace clean";
  const statusClass = !hasBrief || blockedCount ? "is-blocked" : unsupportedCount || synCount ? "is-review" : "is-ready";
  const modeLabel = getClaimTraceModeLabel(mode);
  const headline = !hasBrief
    ? "No answer available for claim tracing."
    : weakestClaim
      ? `${visibleClaims.length} claim${visibleClaims.length === 1 ? "" : "s"} inspected; weakest support is ${weakestClaim.supportScore}%.`
      : "No claims in this scope need review.";
  const summary = !hasBrief
    ? "Run a desk question or open a saved brief. The inspector will check whether each claim is backed by the current evidence stack."
    : blockedCount
      ? `${blockedCount} critical claim${blockedCount === 1 ? "" : "s"} lack enough citation support. Open the weakest claim before circulating the memo.`
      : unsupportedCount || synCount
        ? `${unsupportedCount} unsupported and ${synCount} SYN-backed claim${unsupportedCount + synCount === 1 ? "" : "s"} should be reviewed.`
        : "Every visible claim has a citation trail strong enough for review.";
  return {
    mode,
    modeLabel,
    hasBrief,
    packet,
    sourceText,
    statusLabel,
    statusClass,
    headline,
    summary,
    traceQuality,
    supportedCount,
    reviewCount,
    unsupportedCount,
    criticalCount,
    synCount,
    blockedCount,
    weakestClaim,
    nextGap: packet.nextGap || (packet.gaps || [])[0] || null,
    claims: visibleClaims
  };
}

function makeClaimTraceSourceText(mode, packet, options = {}) {
  if (!packet.hasBrief) return "";
  if (mode === "ic" && !options.skipIcMemo) {
    return makeIcMemoMarkdown(makeIcMemoPlan("committee"));
  }
  return [
    state.lastBrief || "",
    packet.headline || "",
    packet.checks.map((check) => check.detail).join(". ")
  ].filter(Boolean).join("\n\n");
}

function extractTraceClaims(text, mode) {
  const clean = stripHtml(text)
    .replace(/\r/g, "")
    .replace(/\[[^\]]+\]\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const raw = clean
    .split(/(?<=[.!?])\s+|(?:\s+-\s+)/)
    .map((item) => item.trim())
    .filter(Boolean);
  const seen = new Set();
  const claims = [];
  for (const item of raw) {
    const claim = item
      .replace(/^#+\s*/, "")
      .replace(/^(Generated|Format|Focus|Status|Gate|Memo packet|Source|Priority|Route|Due):\s*/i, "")
      .trim();
    if (claim.length < 45 || claim.length > 420) continue;
    if (/^(NiveshScope|Research software|This gate is|Synthetic demo|No citations|No required source gaps)/i.test(claim)) continue;
    const key = claim.toLowerCase().slice(0, 120);
    if (seen.has(key)) continue;
    seen.add(key);
    claims.push({
      text: claim,
      critical: isCriticalClaim(claim)
    });
    if (claims.length >= (mode === "ic" ? 16 : 12)) break;
  }
  return claims;
}

function scoreTraceClaim(claim, index, packet) {
  const claimTokens = uniqueSignalTokens(claim.text);
  let best = null;
  for (const citation of packet.citations) {
    const citationTokens = uniqueSignalTokens(`${citation.ticker} ${citation.company} ${citation.type} ${citation.section} ${citation.text}`);
    const overlap = claimTokens.filter((token) => citationTokens.includes(token));
    const overlapRatio = claimTokens.length ? overlap.length / Math.max(4, Math.min(claimTokens.length, 18)) : 0;
    const status = normalizeSourceStatus(citation.sourceStatus);
    const sourceBonus = status === "real" ? 14 : status === "imported" ? 8 : 0;
    const tickerBonus = claim.text.toUpperCase().includes(citation.ticker) ? 8 : 0;
    const supportScore = Math.max(0, Math.min(100, Math.round(overlapRatio * 82 + sourceBonus + tickerBonus)));
    if (!best || supportScore > best.supportScore) {
      best = {
        citation,
        overlap,
        supportScore,
        sourceStatus: status
      };
    }
  }
  const supportScore = best ? best.supportScore : 0;
  const sourceStatus = best ? best.sourceStatus : "missing";
  const isSynthetic = sourceStatus === "synthetic";
  const statusKey = !best || supportScore < (claim.critical ? 42 : 32)
    ? "unsupported"
    : isSynthetic || supportScore < 58
      ? "review"
      : "supported";
  const statusLabel = statusKey === "supported"
    ? "Supported"
    : statusKey === "review"
      ? isSynthetic ? "SYN review" : "Review"
      : "Unsupported";
  const className = statusKey === "supported" ? "is-ready" : statusKey === "review" ? "is-review" : "is-blocked";
  return {
    id: `claim-${index + 1}`,
    text: claim.text,
    critical: claim.critical,
    statusKey,
    statusLabel,
    className,
    supportScore,
    sourceStatus,
    citationId: best?.citation?.citationId || "",
    ticker: best?.citation?.ticker || packet.meta.ticker || state.selectedTicker || "DESK",
    sourceLabel: best?.citation ? `${best.citation.type} | ${best.citation.section}` : "No matching citation",
    sourceUrl: best?.citation?.sourceUrl || "",
    overlap: best?.overlap || []
  };
}

function filterTraceClaims(claims, mode) {
  if (mode === "critical") return claims.filter((claim) => claim.critical);
  if (mode === "weak") return claims.filter((claim) => claim.statusKey !== "supported");
  return claims;
}

function renderClaimTraceCard(claim) {
  return `
    <article class="claim-trace-card ${escapeAttr(claim.className)}">
      <div class="claim-trace-card-head">
        <div>
          <span>${escapeHtml(claim.critical ? "Critical claim" : "Claim")}</span>
          <strong>${escapeHtml(claim.text)}</strong>
        </div>
        <em>${escapeHtml(claim.supportScore)}%</em>
      </div>
      <div class="claim-trace-meta">
        <div><span>Status</span><strong>${escapeHtml(claim.statusLabel)}</strong></div>
        <div><span>Citation</span><strong>${escapeHtml(claim.citationId || "None")}</strong></div>
        <div><span>Source</span><strong>${escapeHtml(claim.sourceStatus)}</strong></div>
      </div>
      <p>${escapeHtml(claim.sourceLabel)}${claim.overlap.length ? ` | Matching terms: ${escapeHtml(claim.overlap.slice(0, 6).join(", "))}` : ""}</p>
      <div class="note-actions">
        <button type="button" data-open-claim="${escapeAttr(claim.id)}">${claim.citationId ? "Open evidence" : "Open source gap"}</button>
      </div>
    </article>
  `;
}

function openWeakestClaim() {
  const audit = makeClaimTraceAudit(state.claimTraceMode || "answer");
  if (!audit.hasBrief) {
    const ticker = state.selectedTicker || STARTER_PACK_TICKERS[0];
    els.queryInput.value = `Draft a cited risk memo for $${ticker} and make every material claim source-backed.`;
    document.querySelector("#desk")?.scrollIntoView({ behavior: "smooth", block: "start" });
    flashClaimTraceResult("Starter trace question loaded in the desk.", "neutral");
    return;
  }
  if (!audit.weakestClaim) {
    flashClaimTraceResult("No weak claim is visible in this scope.", "success");
    return;
  }
  routeClaimTraceItem(audit.weakestClaim, audit);
}

function openClaimTraceItem(claimId) {
  const audit = makeClaimTraceAudit(state.claimTraceMode || "answer");
  const claim = audit.claims.find((item) => item.id === claimId);
  if (!claim) {
    flashClaimTraceResult("Claim is no longer visible in this scope.", "error");
    return;
  }
  routeClaimTraceItem(claim, audit);
}

function routeClaimTraceItem(claim, audit) {
  if (claim.citationId) {
    const target = document.querySelector(`#evidence-${CSS.escape(claim.citationId)}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      document.querySelectorAll(".evidence-card").forEach((card) => card.classList.remove("is-active"));
      target.classList.add("is-active");
      flashClaimTraceResult(`${claim.citationId} opened for claim review.`, "success");
      return;
    }
  }
  if (audit.nextGap) {
    loadSourceTaskIntoBuilder(audit.packet.meta.ticker, audit.nextGap.key);
    flashClaimTraceResult(`${audit.packet.meta.ticker} ${audit.nextGap.label} opened to improve claim support.`, "success");
    return;
  }
  document.querySelector("#brief-workbench")?.scrollIntoView({ behavior: "smooth", block: "start" });
  flashClaimTraceResult("Brief Workbench opened for claim support review.", "neutral");
}

async function copyClaimTrace() {
  const audit = makeClaimTraceAudit(state.claimTraceMode || "answer");
  if (!audit.hasBrief || !audit.claims.length) {
    flashClaimTraceResult("Run an answer before copying claim trace.", "error");
    return;
  }
  const copied = await copyTextToClipboard(makeClaimTraceMarkdown(audit));
  flashClaimTraceResult(copied ? "Claim trace copied." : "Clipboard blocked. Use export instead.", copied ? "success" : "error");
}

function exportClaimTrace() {
  const audit = makeClaimTraceAudit(state.claimTraceMode || "answer");
  if (!audit.hasBrief || !audit.claims.length) {
    flashClaimTraceResult("Run an answer before exporting claim trace.", "error");
    return;
  }
  const date = new Date().toISOString().slice(0, 10);
  const filename = `niveshscope-${String(audit.packet.meta.ticker || "desk").toLowerCase()}-claim-trace-${date}.json`;
  downloadTextFile(filename, JSON.stringify(makeClaimTraceJson(audit), null, 2), "application/json;charset=utf-8");
  flashClaimTraceResult("Claim trace JSON exported.", "success");
}

function makeClaimTraceJson(audit = makeClaimTraceAudit(state.claimTraceMode || "answer")) {
  return {
    product: "NiveshScope",
    version: DATA_VERSION,
    generatedAt: new Date().toISOString(),
    mode: audit.mode,
    status: audit.statusLabel,
    traceQuality: audit.traceQuality,
    summary: audit.summary,
    focus: {
      ticker: audit.packet.meta.ticker,
      company: audit.packet.meta.company
    },
    counts: {
      claims: audit.claims.length,
      supported: audit.supportedCount,
      review: audit.reviewCount,
      unsupported: audit.unsupportedCount,
      critical: audit.criticalCount,
      synthetic: audit.synCount,
      blocked: audit.blockedCount
    },
    claims: audit.claims.map(({ id, text, critical, statusLabel, supportScore, citationId, ticker, sourceStatus, sourceLabel, overlap }) => ({
      id,
      text,
      critical,
      status: statusLabel,
      supportScore,
      citationId,
      ticker,
      sourceStatus,
      sourceLabel,
      overlap
    }))
  };
}

function makeClaimTraceMarkdown(audit = makeClaimTraceAudit(state.claimTraceMode || "answer")) {
  const rows = audit.claims.map((claim, index) => [
    `## ${index + 1}. ${claim.statusLabel} | ${claim.supportScore}%`,
    "",
    claim.text,
    "",
    `Critical: ${claim.critical ? "Yes" : "No"}`,
    `Citation: ${claim.citationId || "None"}`,
    `Source: ${claim.sourceStatus}`,
    `Matched terms: ${claim.overlap.length ? claim.overlap.slice(0, 8).join(", ") : "None"}`
  ].join("\n")).join("\n\n");
  return [
    "# NiveshScope Claim Trace",
    "",
    `Generated: ${new Date().toLocaleString()}`,
    `Mode: ${audit.modeLabel}`,
    `Status: ${audit.statusLabel}`,
    `Trace quality: ${audit.traceQuality}%`,
    `Focus: ${audit.packet.meta.ticker} - ${audit.packet.meta.company}`,
    "",
    "## Summary",
    "",
    audit.summary,
    "",
    rows,
    "",
    "_Claim Trace Inspector checks support against the currently retrieved evidence stack. It is a review aid, not investment advice._"
  ].join("\n");
}

function uniqueSignalTokens(text) {
  const stop = new Set(["the", "and", "for", "with", "that", "this", "from", "into", "than", "are", "was", "were", "has", "have", "will", "can", "could", "should", "because", "current", "source", "memo", "answer", "company", "management"]);
  return Array.from(new Set(tokenize(text).filter((token) => token.length > 2 && !stop.has(token))));
}

function isCriticalClaim(text) {
  return /\b(risk|revenue|growth|margin|cash|free cash|debt|capex|credit|deposit|valuation|multiple|profit|loss|order book|working capital|management|guidance|rate|cost|commodity|execution)\b/i.test(text)
    || /\bRs\b|\d+(\.\d+)?%|\d+(\.\d+)?x/i.test(text);
}

function getClaimTraceModeLabel(mode) {
  const labels = {
    answer: "Current answer",
    ic: "IC memo packet",
    critical: "Critical claims",
    weak: "Weak claims only"
  };
  return labels[mode] || labels.answer;
}

function flashClaimTraceResult(message, tone = "neutral") {
  if (!els.claimTraceResult) return;
  els.claimTraceResult.className = `builder-result is-${tone}`;
  els.claimTraceResult.textContent = message;
}

function renderAnswerQualityLab() {
  if (!els.answerQualitySummary || !els.answerQualityGrid || !els.answerQualityTests) return;
  const mode = els.answerQualityMode ? els.answerQualityMode.value : state.answerQualityMode || "release";
  state.answerQualityMode = mode;
  const audit = makeAnswerQualityAudit(mode);
  if (els.answerQualityStatus) els.answerQualityStatus.textContent = audit.statusLabel;
  if (els.openQualityFix) els.openQualityFix.disabled = !audit.topFix;
  if (els.copyQualityReport) els.copyQualityReport.disabled = !audit.hasBrief;
  if (els.exportQualityReport) els.exportQualityReport.disabled = !audit.hasBrief;

  els.answerQualitySummary.innerHTML = `
    <div class="answer-quality-hero ${escapeAttr(audit.statusClass)}">
      <div>
        <span>${escapeHtml(audit.modeLabel)}</span>
        <strong>${escapeHtml(audit.headline)}</strong>
        <p>${escapeHtml(audit.summary)}</p>
      </div>
      <div class="answer-quality-score">
        <span>QA score</span>
        <strong>${escapeHtml(audit.score)}%</strong>
      </div>
    </div>
    <div class="answer-quality-stats">
      <article><span>Tests</span><strong>${escapeHtml(audit.dimensions.length)}</strong><em>${escapeHtml(audit.passedCount)} passed</em></article>
      <article><span>Blockers</span><strong>${escapeHtml(audit.blockingCount)}</strong><em>must fix</em></article>
      <article><span>Review</span><strong>${escapeHtml(audit.reviewCount)}</strong><em>analyst judgement</em></article>
      <article><span>Exports</span><strong>${escapeHtml(audit.exportLabel)}</strong><em>${escapeHtml(audit.packet.statusLabel)}</em></article>
    </div>
  `;

  els.answerQualityGrid.innerHTML = audit.dimensions.length
    ? audit.dimensions.map(renderAnswerQualityCard).join("")
    : `<div class="empty-list">Run a desk question and the lab will score the answer before export.</div>`;

  els.answerQualityTests.innerHTML = `
    <div class="answer-quality-test-head">
      <span>Failure checklist</span>
      <strong>${escapeHtml(audit.testPlan.length)} checks</strong>
    </div>
    <ol>
      ${audit.testPlan.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ol>
  `;

  els.answerQualityGrid.querySelectorAll("button[data-open-quality]").forEach((button) => {
    button.addEventListener("click", () => openAnswerQualityDimension(button.dataset.openQuality));
  });
}

function makeAnswerQualityAudit(mode = state.answerQualityMode || "release") {
  const packet = makeBriefPacket();
  const gate = makeInvestmentGateAudit();
  const claimTrace = makeClaimTraceAudit(mode === "committee" ? "ic" : mode === "citation" ? "weak" : "answer");
  const icMemo = makeIcMemoPlan("committee");
  const ticker = packet.meta.ticker || state.selectedTicker || STARTER_PACK_TICKERS[0] || "DESK";
  const latestReview = getLatestMemoReviewForTicker(ticker);
  const latestDecision = getLatestDecisionForTicker(ticker);
  const dimensions = filterAnswerQualityDimensions([
    makeAnswerQualityDimension({
      key: "active-answer",
      label: "Active answer",
      score: packet.hasBrief ? 100 : 0,
      required: true,
      action: "run-question",
      detail: packet.hasBrief ? "A current answer is available for QA." : "Run a desk question before scoring answer quality."
    }),
    makeAnswerQualityDimension({
      key: "citation-depth",
      label: "Citation depth",
      score: Math.min(100, Math.round((packet.citations.length / 4) * 100)),
      required: true,
      action: packet.nextGap ? "source" : "brief",
      detail: `${packet.citations.length} citation${packet.citations.length === 1 ? "" : "s"} in the answer. Target four source-backed passages for stronger review.`
    }),
    makeAnswerQualityDimension({
      key: "evidence-quality",
      label: "Evidence quality",
      score: Number(packet.meta.evidenceQuality || 0),
      required: true,
      action: packet.nextGap ? "source" : "gate",
      detail: `${Number(packet.meta.evidenceQuality || 0)}% evidence quality from the current run. Target 80% or better.`
    }),
    makeAnswerQualityDimension({
      key: "real-source-mix",
      label: "REAL source mix",
      score: makeAnswerSourceMixScore(packet),
      required: true,
      action: packet.nextGap ? "source" : "claim-trace",
      detail: makeAnswerSourceMixDetail(packet)
    }),
    makeAnswerQualityDimension({
      key: "claim-support",
      label: "Claim support",
      score: claimTrace.hasBrief ? claimTrace.traceQuality : 0,
      required: true,
      action: "claim-trace",
      detail: claimTrace.hasBrief
        ? `${claimTrace.supportedCount}/${claimTrace.claims.length} traced claims are supported; ${claimTrace.unsupportedCount} unsupported and ${claimTrace.synCount} SYN-backed.`
        : "Claim Trace Inspector needs a current answer."
    }),
    makeAnswerQualityDimension({
      key: "ticker-discipline",
      label: "Ticker discipline",
      score: Number(packet.meta.mismatchCount || 0) ? 20 : packet.hasBrief ? 100 : 0,
      required: true,
      action: "brief",
      detail: Number(packet.meta.mismatchCount || 0)
        ? `${packet.meta.mismatchCount} off-ticker citation issue${packet.meta.mismatchCount === 1 ? "" : "s"} detected.`
        : "Single-company guard found no off-ticker citation drift."
    }),
    makeAnswerQualityDimension({
      key: "readiness-gate",
      label: "Readiness gate",
      score: gate.score,
      required: true,
      action: "gate",
      detail: `${gate.statusLabel}. ${gate.summary}`
    }),
    makeAnswerQualityDimension({
      key: "review-trail",
      label: "Review trail",
      score: latestReview && latestDecision ? 100 : latestReview || latestDecision ? 62 : 18,
      required: false,
      action: latestReview ? "decision" : "review",
      detail: latestReview && latestDecision
        ? `Review and decision are both logged for ${ticker}.`
        : latestReview
          ? "Human review exists, but the research decision has not been logged."
          : latestDecision
            ? "Decision exists, but the latest memo review should be saved."
            : "Save a review-room decision and decision-journal entry before committee use."
    }),
    makeAnswerQualityDimension({
      key: "committee-packet",
      label: "Committee packet",
      score: icMemo.hasBrief ? icMemo.score : 0,
      required: mode === "committee",
      action: "ic-memo",
      detail: icMemo.hasBrief ? `${icMemo.statusLabel} at ${icMemo.score}%.` : "IC Memo Builder needs a current answer."
    }),
    makeAnswerQualityDimension({
      key: "export-hygiene",
      label: "Export hygiene",
      score: makeAnswerExportScore(packet, gate, claimTrace),
      required: true,
      action: claimTrace.blockedCount ? "claim-trace" : gate.nextGap ? "gate" : "ic-memo",
      detail: makeAnswerExportDetail(packet, gate, claimTrace)
    })
  ], mode);

  const score = dimensions.length
    ? Math.round(dimensions.reduce((sum, item) => sum + item.score * item.weight, 0) / dimensions.reduce((sum, item) => sum + item.weight, 0))
    : 0;
  const blockingCount = dimensions.filter((item) => item.required && item.score < 70).length;
  const reviewCount = dimensions.filter((item) => !item.required && item.score < 70).length
    + dimensions.filter((item) => item.required && item.score >= 70 && item.score < 88).length;
  const passedCount = dimensions.filter((item) => item.score >= 88).length;
  const topFix = dimensions
    .slice()
    .filter((item) => item.score < 88)
    .sort((a, b) => Number(b.required) - Number(a.required) || a.score - b.score || b.weight - a.weight)[0] || null;
  const statusLabel = !packet.hasBrief
    ? "Run an answer"
    : blockingCount
      ? "QA blocked"
      : reviewCount
        ? "QA review"
        : "QA passed";
  const statusClass = !packet.hasBrief || blockingCount ? "is-blocked" : reviewCount ? "is-review" : "is-ready";
  const modeLabel = getAnswerQualityModeLabel(mode);
  const exportLabel = !packet.hasBrief ? "None" : blockingCount ? "Review only" : score >= 88 ? "Committee draft" : "Pilot draft";
  const headline = !packet.hasBrief
    ? "Run a desk answer before grading quality."
    : topFix
      ? `${topFix.label} is the first quality fix.`
      : "The current answer clears the visible QA gates.";
  const summary = !packet.hasBrief
    ? "The lab will combine citation depth, source mix, claim trace, readiness gate, review trail, and export hygiene after a question runs."
    : blockingCount
      ? `${blockingCount} blocking QA issue${blockingCount === 1 ? "" : "s"} should be resolved before the answer is circulated.`
      : reviewCount
        ? `${reviewCount} review item${reviewCount === 1 ? "" : "s"} remain. The answer can be discussed, but should not be treated as final.`
        : "Answer quality, citation trace, and export posture are aligned for review.";
  return {
    mode,
    modeLabel,
    hasBrief: packet.hasBrief,
    packet,
    gate,
    claimTrace,
    icMemo,
    dimensions,
    score,
    statusLabel,
    statusClass,
    headline,
    summary,
    exportLabel,
    blockingCount,
    reviewCount,
    passedCount,
    topFix,
    testPlan: makeAnswerQualityTestPlan(dimensions, mode)
  };
}

function makeAnswerQualityDimension({ key, label, score, required, action, detail }) {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(Number(score || 0))));
  return {
    key,
    label,
    score: normalizedScore,
    required: Boolean(required),
    action,
    detail,
    statusLabel: normalizedScore >= 88 ? "Pass" : normalizedScore >= 70 ? "Review" : required ? "Blocker" : "Watch",
    className: normalizedScore >= 88 ? "is-ready" : normalizedScore >= 70 ? "is-review" : required ? "is-blocked" : "is-review",
    weight: required ? 1.15 : 0.85
  };
}

function filterAnswerQualityDimensions(dimensions, mode) {
  if (mode === "citation") return dimensions.filter((item) => ["citation-depth", "evidence-quality", "real-source-mix", "claim-support", "ticker-discipline"].includes(item.key));
  if (mode === "committee") return dimensions.filter((item) => ["active-answer", "claim-support", "readiness-gate", "review-trail", "committee-packet", "export-hygiene"].includes(item.key));
  if (mode === "export") return dimensions.filter((item) => ["active-answer", "readiness-gate", "claim-support", "export-hygiene", "committee-packet"].includes(item.key));
  return dimensions;
}

function renderAnswerQualityCard(item) {
  return `
    <article class="answer-quality-card ${escapeAttr(item.className)}">
      <div class="answer-quality-card-head">
        <div>
          <span>${escapeHtml(item.required ? "Required" : "Review")}</span>
          <strong>${escapeHtml(item.label)}</strong>
        </div>
        <em>${escapeHtml(item.score)}%</em>
      </div>
      <p>${escapeHtml(item.detail)}</p>
      <div class="answer-quality-card-foot">
        <strong>${escapeHtml(item.statusLabel)}</strong>
        <button type="button" data-open-quality="${escapeAttr(item.key)}">${escapeHtml(getAnswerQualityActionLabel(item.action))}</button>
      </div>
    </article>
  `;
}

function makeAnswerSourceMixScore(packet) {
  if (!packet.hasBrief || !packet.citations.length) return 0;
  const realCount = packet.citations.filter((citation) => normalizeSourceStatus(citation.sourceStatus) === "real").length;
  const importedCount = packet.citations.filter((citation) => normalizeSourceStatus(citation.sourceStatus) === "imported").length;
  const syntheticCount = packet.citations.filter((citation) => normalizeSourceStatus(citation.sourceStatus) === "synthetic").length;
  return Math.max(0, Math.min(100, Math.round((realCount * 100 + importedCount * 72 + syntheticCount * 28) / packet.citations.length)));
}

function makeAnswerSourceMixDetail(packet) {
  const realCount = packet.citations.filter((citation) => normalizeSourceStatus(citation.sourceStatus) === "real").length;
  const importedCount = packet.citations.filter((citation) => normalizeSourceStatus(citation.sourceStatus) === "imported").length;
  const syntheticCount = packet.citations.filter((citation) => normalizeSourceStatus(citation.sourceStatus) === "synthetic").length;
  return `${realCount} REAL, ${importedCount} imported, and ${syntheticCount} SYN citation${packet.citations.length === 1 ? "" : "s"} in the current answer.`;
}

function makeAnswerExportScore(packet, gate, claimTrace) {
  if (!packet.hasBrief) return 0;
  return Math.max(0, Math.min(100, Math.round(
    gate.score * 0.42
    + (claimTrace.hasBrief ? claimTrace.traceQuality : 0) * 0.38
    + (packet.citations.length >= 3 ? 20 : packet.citations.length * 6)
    - claimTrace.blockedCount * 10
  )));
}

function makeAnswerExportDetail(packet, gate, claimTrace) {
  if (!packet.hasBrief) return "PDF and Markdown exports need a current answer.";
  if (claimTrace.blockedCount) return `${claimTrace.blockedCount} unsupported critical claim${claimTrace.blockedCount === 1 ? "" : "s"} should be fixed before exporting.`;
  if (gate.requiredBlockers.length) return `${gate.requiredBlockers.length} readiness blocker${gate.requiredBlockers.length === 1 ? "" : "s"} keep exports in review-only posture.`;
  return "PDF, Markdown, IC memo, and trace exports carry current QA metadata.";
}

function makeAnswerQualityTestPlan(dimensions, mode) {
  const weak = dimensions.filter((item) => item.score < 88).slice(0, 5);
  const base = [
    `Review mode: ${getAnswerQualityModeLabel(mode)}.`,
    "Run one fresh desk question and confirm the lab score changes.",
    "Open top fix and confirm it routes to the exact workflow that can improve the answer.",
    "Copy QA report and export QA JSON for the release file."
  ];
  if (!weak.length) return [...base, "No weak dimensions remain in this view."];
  return [
    ...base,
    ...weak.map((item) => `${item.label}: ${item.statusLabel} at ${item.score}%. ${item.detail}`)
  ];
}

function openAnswerQualityFix() {
  const audit = makeAnswerQualityAudit(state.answerQualityMode || "release");
  if (!audit.topFix) {
    flashAnswerQualityResult("No quality fix is open in this view.", "success");
    return;
  }
  routeAnswerQualityAction(audit.topFix, audit);
}

function openAnswerQualityDimension(key) {
  const audit = makeAnswerQualityAudit(state.answerQualityMode || "release");
  const item = audit.dimensions.find((dimension) => dimension.key === key);
  if (!item) {
    flashAnswerQualityResult("That quality check is no longer visible.", "error");
    return;
  }
  routeAnswerQualityAction(item, audit);
}

function routeAnswerQualityAction(item, audit) {
  if (item.action === "run-question") {
    const ticker = audit.packet.meta.ticker || state.selectedTicker || STARTER_PACK_TICKERS[0];
    els.queryInput.value = `Draft a source-backed risk and valuation quality check for $${ticker}.`;
    document.querySelector("#desk")?.scrollIntoView({ behavior: "smooth", block: "start" });
    flashAnswerQualityResult("Starter quality-test question loaded in the desk.", "neutral");
    return;
  }
  if (item.action === "source" && audit.packet.nextGap) {
    loadSourceTaskIntoBuilder(audit.packet.meta.ticker, audit.packet.nextGap.key);
    flashAnswerQualityResult(`${audit.packet.meta.ticker} ${audit.packet.nextGap.label} opened in Source Studio.`, "success");
    return;
  }
  const targets = {
    brief: ["#brief-workbench", "Brief Workbench opened for answer packet review."],
    gate: ["#investment-gate", "Investment Readiness Gate opened."],
    "claim-trace": ["#claim-trace-inspector", "Claim Trace Inspector opened."],
    review: ["#memo-review-room", "Memo Review Room opened."],
    decision: ["#decision-journal", "Decision Journal opened."],
    "ic-memo": ["#ic-memo-builder", "IC Memo Builder opened."]
  };
  const target = targets[item.action] || targets.brief;
  document.querySelector(target[0])?.scrollIntoView({ behavior: "smooth", block: "start" });
  flashAnswerQualityResult(target[1], "neutral");
}

async function copyAnswerQualityReport() {
  const audit = makeAnswerQualityAudit(state.answerQualityMode || "release");
  if (!audit.hasBrief) {
    flashAnswerQualityResult("Run an answer before copying QA.", "error");
    return;
  }
  const copied = await copyTextToClipboard(makeAnswerQualityMarkdown(audit));
  flashAnswerQualityResult(copied ? "Answer QA report copied." : "Clipboard blocked. Use export instead.", copied ? "success" : "error");
}

function exportAnswerQualityReport() {
  const audit = makeAnswerQualityAudit(state.answerQualityMode || "release");
  if (!audit.hasBrief) {
    flashAnswerQualityResult("Run an answer before exporting QA.", "error");
    return;
  }
  const date = new Date().toISOString().slice(0, 10);
  const filename = `niveshscope-${String(audit.packet.meta.ticker || "desk").toLowerCase()}-answer-quality-${date}.json`;
  downloadTextFile(filename, JSON.stringify(makeAnswerQualityJson(audit), null, 2), "application/json;charset=utf-8");
  flashAnswerQualityResult("Answer QA JSON exported.", "success");
}

function makeAnswerQualityJson(audit = makeAnswerQualityAudit(state.answerQualityMode || "release")) {
  return {
    product: "NiveshScope",
    version: DATA_VERSION,
    generatedAt: new Date().toISOString(),
    mode: audit.mode,
    status: audit.statusLabel,
    score: audit.score,
    exportLabel: audit.exportLabel,
    summary: audit.summary,
    focus: {
      ticker: audit.packet.meta.ticker,
      company: audit.packet.meta.company
    },
    counts: {
      blockers: audit.blockingCount,
      review: audit.reviewCount,
      passed: audit.passedCount
    },
    dimensions: audit.dimensions.map(({ key, label, score, required, statusLabel, action, detail }) => ({
      key,
      label,
      score,
      required,
      status: statusLabel,
      action,
      detail
    })),
    claimTrace: makeClaimTraceJson(audit.claimTrace),
    testPlan: audit.testPlan
  };
}

function makeAnswerQualityMarkdown(audit = makeAnswerQualityAudit(state.answerQualityMode || "release")) {
  const checks = audit.dimensions.map((item) => `- ${item.statusLabel} | ${item.label} (${item.score}%): ${item.detail}`).join("\n");
  const tests = audit.testPlan.map((item, index) => `${index + 1}. ${item}`).join("\n");
  return [
    "# NiveshScope Answer Quality Lab",
    "",
    `Generated: ${new Date().toLocaleString()}`,
    `Mode: ${audit.modeLabel}`,
    `Focus: ${audit.packet.meta.ticker} - ${audit.packet.meta.company}`,
    `Status: ${audit.statusLabel}`,
    `QA score: ${audit.score}%`,
    `Export posture: ${audit.exportLabel}`,
    "",
    "## Summary",
    "",
    audit.summary,
    "",
    "## Checks",
    "",
    checks,
    "",
    "## Test Plan",
    "",
    tests,
    "",
    "_Answer Quality Lab is a deterministic review aid. Human source verification remains required._"
  ].join("\n");
}

function getAnswerQualityModeLabel(mode) {
  const labels = {
    release: "Release readiness",
    citation: "Citation quality",
    committee: "Committee memo",
    export: "Export hygiene"
  };
  return labels[mode] || labels.release;
}

function getAnswerQualityActionLabel(action) {
  const labels = {
    "run-question": "Load question",
    source: "Open source gap",
    brief: "Open packet",
    gate: "Open gate",
    "claim-trace": "Open claim trace",
    review: "Open review",
    decision: "Open decision",
    "ic-memo": "Open IC memo"
  };
  return labels[action] || "Open workflow";
}

function flashAnswerQualityResult(message, tone = "neutral") {
  if (!els.answerQualityResult) return;
  els.answerQualityResult.className = `builder-result is-${tone}`;
  els.answerQualityResult.textContent = message;
}

function renderTrustCenter() {
  if (!els.trustCenterSummary || !els.trustCenterGrid || !els.trustCenterChecks) return;
  const audit = makeTrustCenterAudit();
  if (els.trustCenterStatus) els.trustCenterStatus.textContent = audit.statusLabel;
  if (els.openTrustAction) {
    els.openTrustAction.disabled = !audit.topAction;
    els.openTrustAction.textContent = audit.topAction ? "Open top hardening action" : "No hardening action";
  }
  if (els.copyTrustReport) els.copyTrustReport.disabled = false;
  if (els.exportTrustReport) els.exportTrustReport.disabled = false;

  els.trustCenterSummary.innerHTML = `
    <div class="trust-center-hero ${escapeAttr(audit.statusClass)}">
      <div>
        <span>${escapeHtml(audit.stageLabel)}</span>
        <strong>${escapeHtml(audit.headline)}</strong>
        <p>${escapeHtml(audit.summary)}</p>
      </div>
      <div class="trust-center-score">
        <span>Trust score</span>
        <strong>${escapeHtml(audit.score)}%</strong>
      </div>
    </div>
  `;

  els.trustCenterGrid.innerHTML = audit.metrics.map((metric) => `
    <article>
      <span>${escapeHtml(metric.label)}</span>
      <strong>${escapeHtml(metric.value)}</strong>
      <em>${escapeHtml(metric.detail)}</em>
    </article>
  `).join("");

  els.trustCenterChecks.innerHTML = audit.checks.map((check) => `
    <article class="trust-center-check ${escapeAttr(check.className)}">
      <div>
        <span>${escapeHtml(check.required ? "Required" : "Review")}</span>
        <strong>${escapeHtml(check.label)}</strong>
      </div>
      <em>${escapeHtml(check.score)}%</em>
      <p>${escapeHtml(check.detail)}</p>
      <button type="button" data-open-trust="${escapeAttr(check.action)}">${escapeHtml(getTrustActionLabel(check.action))}</button>
    </article>
  `).join("");

  els.trustCenterChecks.querySelectorAll("button[data-open-trust]").forEach((button) => {
    button.addEventListener("click", () => routeTrustCenterAction(button.dataset.openTrust));
  });
}

function makeTrustCenterAudit(options = {}) {
  const releaseDoctor = options.releaseDoctor || makeReleaseDoctorAudit();
  const packet = options.packet || makeBriefPacket();
  const coverageRows = buildCoverageMatrixRows();
  const totalSlots = coverageRows.length * REAL_SOURCE_REQUIREMENTS.length || 1;
  const realSlots = coverageRows.reduce((sum, row) => sum + row.realCount, 0);
  const realCoverage = Number.isFinite(options.realCoverage) ? options.realCoverage : Math.round((realSlots / totalSlots) * 100);
  const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.getAttribute("content") || "";
  const cspOk = csp.includes("default-src 'self'")
    && csp.includes("script-src 'self'")
    && csp.includes("object-src 'none'")
    && csp.includes("base-uri 'self'");
  const inlineHandlerCount = countInlineHandlers();
  const urls = state.documents.map((doc) => normalizeExternalUrl(doc.sourceUrl || "")).filter(Boolean);
  const trustedUrlCount = urls.filter(isTrustedSourceUrl).length;
  const untrustedUrlCount = urls.length - trustedUrlCount;
  const currentSynthetic = packet.citations.filter((citation) => normalizeSourceStatus(citation.sourceStatus) === "synthetic").length;
  const currentImported = packet.citations.filter((citation) => normalizeSourceStatus(citation.sourceStatus) === "imported").length;
  const vaultCount = (state.evidenceVault || []).length;
  const vaultRealCount = (state.evidenceVault || []).filter((item) => normalizeSourceStatus(item.sourceStatus) === "real").length;
  const storage = getLocalStorageFootprint();
  const checks = [
    makeTrustCheck({
      key: "csp",
      label: "Static Content Security Policy",
      score: cspOk ? 100 : 35,
      required: true,
      action: "release-doctor",
      detail: cspOk ? "CSP restricts scripts to same-origin, blocks objects, pins base URI, and limits form targets." : "CSP is missing one of the required static-site protections."
    }),
    makeTrustCheck({
      key: "inline-handlers",
      label: "No inline event handlers",
      score: inlineHandlerCount ? 20 : 100,
      required: true,
      action: "release-doctor",
      detail: inlineHandlerCount ? `${inlineHandlerCount} inline event handler attribute${inlineHandlerCount === 1 ? "" : "s"} detected in the loaded DOM.` : "No inline event handler attributes are present in the loaded DOM."
    }),
    makeTrustCheck({
      key: "source-url-trust",
      label: "Source URL trust",
      score: !urls.length ? 72 : untrustedUrlCount ? Math.max(40, 100 - untrustedUrlCount * 18) : 100,
      required: false,
      action: untrustedUrlCount ? "source-intake" : "source-studio",
      detail: urls.length
        ? `${trustedUrlCount}/${urls.length} captured source URL${urls.length === 1 ? "" : "s"} are on trusted hosts.`
        : "No source URLs are captured yet; use Source Studio before treating evidence as REAL."
    }),
    makeTrustCheck({
      key: "import-limits",
      label: "Import limits",
      score: MAX_IMPORT_FILE_BYTES <= 2 * 1024 * 1024 && MAX_IMPORT_TOTAL_BYTES <= 8 * 1024 * 1024 && MAX_SOURCE_TEXT_CHARS <= 120000 ? 100 : 58,
      required: true,
      action: "source-studio",
      detail: `Browser imports are capped at ${formatBytes(MAX_IMPORT_FILE_BYTES)} per file, ${formatBytes(MAX_IMPORT_TOTAL_BYTES)} total, and ${MAX_SOURCE_TEXT_CHARS.toLocaleString()} text characters.`
    }),
    makeTrustCheck({
      key: "real-source-coverage",
      label: "REAL source coverage",
      score: Math.max(15, realCoverage),
      required: false,
      action: "coverage",
      detail: `${realCoverage}% REAL coverage across ${totalSlots} required source slots. This is a product-readiness signal, not a compliance certificate.`
    }),
    makeTrustCheck({
      key: "answer-citation-safety",
      label: "Current answer citation safety",
      score: !packet.hasBrief ? 62 : currentSynthetic ? Math.max(35, 84 - currentSynthetic * 12) : currentImported ? 86 : 100,
      required: Boolean(packet.hasBrief),
      action: packet.hasBrief && currentSynthetic && packet.nextGap ? "source-gap" : packet.hasBrief ? "answer-quality" : "desk",
      detail: packet.hasBrief
        ? `${currentSynthetic} SYN and ${currentImported} imported citation${packet.citations.length === 1 ? "" : "s"} in the active answer.`
        : "Run an answer so Trust Center can score citation safety."
    }),
    makeTrustCheck({
      key: "evidence-vault",
      label: "Evidence Vault traceability",
      score: vaultCount ? Math.min(100, 58 + vaultCount * 6 + vaultRealCount * 8) : 50,
      required: false,
      action: "evidence-vault",
      detail: vaultCount
        ? `${vaultCount} saved evidence item${vaultCount === 1 ? "" : "s"} in the vault, including ${vaultRealCount} REAL item${vaultRealCount === 1 ? "" : "s"}.`
        : "No saved evidence trail yet. Save current citations after running a desk answer."
    }),
    makeTrustCheck({
      key: "local-storage",
      label: "Local browser storage",
      score: storage.bytes < 1024 * 1024 ? 100 : storage.bytes < 4 * 1024 * 1024 ? 76 : 45,
      required: false,
      action: "trust-center",
      detail: `${storage.keys} local product store${storage.keys === 1 ? "" : "s"} use about ${formatBytes(storage.bytes)} in this browser. Production should move sensitive audit data server-side.`
    }),
    makeTrustCheck({
      key: "export-controls",
      label: "Export controls",
      score: els.exportPdfBrief && els.exportBrief && els.copyBrief ? 100 : 55,
      required: true,
      action: "answer-quality",
      detail: els.exportPdfBrief && els.exportBrief && els.copyBrief ? "PDF, Markdown, and copy controls are mounted in the top bar." : "One or more export controls are missing from the loaded page."
    }),
    makeTrustCheck({
      key: "release-shape",
      label: "Release shape",
      score: releaseDoctor.score,
      required: true,
      action: "release-doctor",
      detail: releaseDoctor.summary
    })
  ];
  const score = checks.length
    ? Math.round(checks.reduce((sum, item) => sum + item.score * item.weight, 0) / checks.reduce((sum, item) => sum + item.weight, 0))
    : 0;
  const blockers = checks.filter((item) => item.required && item.score < 70);
  const review = checks.filter((item) => item.score >= 70 && item.score < 88 || !item.required && item.score < 70);
  const topAction = checks.slice()
    .filter((item) => item.score < 88)
    .sort((a, b) => Number(b.required) - Number(a.required) || a.score - b.score || b.weight - a.weight)[0] || null;
  const statusLabel = blockers.length ? "Trust blocked" : review.length ? "Trust review" : "Trust ready";
  const statusClass = blockers.length ? "is-blocked" : review.length ? "is-review" : "is-ready";
  const headline = topAction ? `${topAction.label} is the first hardening action.` : "The visible static controls are aligned.";
  const summary = blockers.length
    ? `${blockers.length} required trust check${blockers.length === 1 ? "" : "s"} should be fixed before broader pilot use.`
    : review.length
      ? `${review.length} review item${review.length === 1 ? "" : "s"} remain. The prototype is usable, but security posture should keep improving.`
      : "CSP, release shape, import limits, source hygiene, exports, and evidence traceability are passing visible checks.";
  return {
    releaseLabel: RELEASE_LABEL,
    generatedAt: new Date().toISOString(),
    statusLabel,
    statusClass,
    stageLabel: blockers.length ? "Security hardening" : review.length ? "Trust review" : "Trust ready",
    headline,
    summary,
    score,
    topAction,
    checks,
    metrics: [
      { label: "Required checks", value: `${checks.filter((item) => item.required && item.score >= 70).length}/${checks.filter((item) => item.required).length}`, detail: blockers.length ? `${blockers.length} blocked` : "No required blockers" },
      { label: "REAL coverage", value: `${realCoverage}%`, detail: `${realSlots}/${totalSlots} source slots` },
      { label: "Source URLs", value: urls.length, detail: untrustedUrlCount ? `${untrustedUrlCount} host review` : "Trusted or none" },
      { label: "Vault", value: vaultCount, detail: `${vaultRealCount} REAL saved` },
      { label: "Storage", value: formatBytes(storage.bytes), detail: `${storage.keys} browser stores` },
      { label: "Release", value: `${releaseDoctor.score}%`, detail: releaseDoctor.statusLabel }
    ],
    counts: {
      blockers: blockers.length,
      review: review.length,
      inlineHandlerCount,
      sourceUrls: urls.length,
      untrustedUrlCount,
      storageBytes: storage.bytes
    }
  };
}

function makeTrustCheck({ key, label, score, required, action, detail }) {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(Number(score || 0))));
  return {
    key,
    label,
    score: normalizedScore,
    required: Boolean(required),
    action,
    detail,
    className: normalizedScore >= 88 ? "is-ready" : normalizedScore >= 70 ? "is-review" : required ? "is-blocked" : "is-review",
    statusLabel: normalizedScore >= 88 ? "Pass" : normalizedScore >= 70 ? "Review" : required ? "Blocker" : "Watch",
    weight: required ? 1.2 : 0.85
  };
}

function countInlineHandlers() {
  return Array.from(document.querySelectorAll("*")).reduce((count, node) => {
    if (!node.getAttributeNames) return count;
    return count + node.getAttributeNames().filter((name) => /^on/i.test(name)).length;
  }, 0);
}

function getLocalStorageFootprint() {
  try {
    const keys = Object.values(STORAGE_KEYS);
    const bytes = keys.reduce((sum, key) => sum + String(localStorage.getItem(key) || "").length, 0);
    return { keys: keys.filter((key) => localStorage.getItem(key) !== null).length, bytes };
  } catch (error) {
    return { keys: 0, bytes: 0 };
  }
}

function routeTrustCenterAction(action) {
  if (action === "source-gap") {
    const packet = makeBriefPacket();
    if (packet.nextGap) {
      loadSourceTaskIntoBuilder(packet.meta.ticker, packet.nextGap.key);
      flashTrustCenterResult(`${packet.meta.ticker} ${packet.nextGap.label} opened in Source Studio.`, "success");
      return;
    }
  }
  if (action === "desk") {
    const ticker = state.selectedTicker || STARTER_PACK_TICKERS[0] || "RELIANCE";
    els.queryInput.value = `What are the risks for $${ticker}?`;
    document.querySelector("#desk")?.scrollIntoView({ behavior: "smooth", block: "start" });
    flashTrustCenterResult("Starter question loaded so citation safety can be scored.", "neutral");
    return;
  }
  const targets = {
    "release-doctor": ["#release-doctor", "Release Doctor opened."],
    "source-intake": ["#source-intake-doctor", "Source Intake Doctor opened."],
    "source-studio": ["#source-builder", "Source Studio opened."],
    coverage: ["#coverage-command", "Coverage Command Center opened."],
    "evidence-vault": ["#evidence-vault", "Evidence Vault opened."],
    "answer-quality": ["#answer-quality-lab", "Answer Quality Lab opened."],
    "trust-center": ["#trust-center", "Trust Center is already open."]
  };
  const target = targets[action] || targets["trust-center"];
  document.querySelector(target[0])?.scrollIntoView({ behavior: "smooth", block: "start" });
  flashTrustCenterResult(target[1], "neutral");
}

function openTrustCenterAction() {
  const audit = makeTrustCenterAudit();
  if (!audit.topAction) {
    flashTrustCenterResult("No hardening action is open.", "success");
    return;
  }
  routeTrustCenterAction(audit.topAction.action);
}

async function copyTrustReport() {
  const copied = await copyTextToClipboard(makeTrustReportMarkdown(makeTrustCenterAudit()));
  flashTrustCenterResult(copied ? "Trust report copied." : "Clipboard blocked. Use export instead.", copied ? "success" : "error");
}

function exportTrustReport() {
  const date = new Date().toISOString().slice(0, 10);
  downloadTextFile(`niveshscope-trust-center-v47-${date}.json`, JSON.stringify(makeTrustReportJson(makeTrustCenterAudit()), null, 2), "application/json;charset=utf-8");
  flashTrustCenterResult("Trust report JSON exported.", "success");
}

function makeTrustReportJson(audit = makeTrustCenterAudit()) {
  return {
    product: "NiveshScope",
    release: audit.releaseLabel,
    dataVersion: DATA_VERSION,
    generatedAt: audit.generatedAt,
    status: audit.statusLabel,
    score: audit.score,
    summary: audit.summary,
    counts: audit.counts,
    checks: audit.checks.map(({ key, label, score, required, statusLabel, action, detail }) => ({
      key,
      label,
      score,
      required,
      status: statusLabel,
      action,
      detail
    })),
    metrics: audit.metrics
  };
}

function makeTrustReportMarkdown(audit = makeTrustCenterAudit()) {
  const checks = audit.checks.map((item) => `- ${item.statusLabel} | ${item.label} (${item.score}%): ${item.detail}`).join("\n");
  return [
    "# NiveshScope Trust Center",
    "",
    `Release: ${audit.releaseLabel}`,
    `Generated: ${new Date().toLocaleString()}`,
    `Status: ${audit.statusLabel}`,
    `Trust score: ${audit.score}%`,
    "",
    "## Summary",
    "",
    audit.summary,
    "",
    "## Checks",
    "",
    checks,
    "",
    "_Trust Center checks the visible static app. Production should add server-side auth, source hashing, malware scanning, dependency scanning, and immutable audit logs._"
  ].join("\n");
}

function getTrustActionLabel(action) {
  const labels = {
    "release-doctor": "Open release doctor",
    "source-intake": "Open intake doctor",
    "source-studio": "Open source studio",
    coverage: "Open coverage map",
    "source-gap": "Open source gap",
    "evidence-vault": "Open vault",
    "answer-quality": "Open answer QA",
    desk: "Load question",
    "trust-center": "Review note"
  };
  return labels[action] || "Open workflow";
}

function flashTrustCenterResult(message, tone = "neutral") {
  if (!els.trustCenterResult) return;
  els.trustCenterResult.className = `builder-result is-${tone}`;
  els.trustCenterResult.textContent = message;
}

function renderOperatorCoach(audit = makeLaunchAudit()) {
  if (!els.operatorCoachSummary || !els.operatorCoachQueue) return;
  const coach = makeOperatorCoach(audit);
  if (els.operatorCoachStatus) els.operatorCoachStatus.textContent = coach.statusLabel;
  if (els.operatorCoachDo) {
    els.operatorCoachDo.disabled = !coach.primaryAction;
    els.operatorCoachDo.textContent = coach.primaryAction ? coach.primaryAction.buttonLabel : "No action open";
  }
  els.operatorCoachSummary.innerHTML = `
    <div class="operator-coach-hero ${escapeAttr(coach.statusClass)}">
      <div>
        <span>${escapeHtml(coach.stageLabel)}</span>
        <strong>${escapeHtml(coach.headline)}</strong>
        <p>${escapeHtml(coach.summary)}</p>
      </div>
      <div class="operator-coach-score">
        <span>Desk score</span>
        <strong>${escapeHtml(coach.score)}%</strong>
      </div>
    </div>
    <div class="operator-coach-metrics">
      ${coach.metrics.map((metric) => `
        <article>
          <span>${escapeHtml(metric.label)}</span>
          <strong>${escapeHtml(metric.value)}</strong>
          <em>${escapeHtml(metric.detail)}</em>
        </article>
      `).join("")}
    </div>
  `;
  els.operatorCoachQueue.innerHTML = coach.queue.map((item, index) => `
    <article class="${escapeAttr(item.className)}">
      <span>${index === 0 ? "Next" : item.status}</span>
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.detail)}</p>
    </article>
  `).join("");
  renderEvidenceVault();
}

function makeOperatorCoach(audit = makeLaunchAudit()) {
  const packet = audit.packet || makeBriefPacket();
  const gate = makeInvestmentGateAudit();
  const quality = audit.answerQuality || makeAnswerQualityAudit("release");
  const releaseDoctor = audit.releaseDoctor || makeReleaseDoctorAudit();
  const trustCenter = audit.trustCenter || makeTrustCenterAudit({ releaseDoctor, packet, realCoverage: audit.realCoverage || 0 });
  const focusTicker = normalizeTicker(packet.meta?.ticker || state.selectedTicker || STARTER_PACK_TICKERS[0] || "");
  const focusCompany = getCompany(focusTicker);
  const starter = makeStarterPackCompany(focusTicker);
  const latestReview = getLatestMemoReviewForTicker(focusTicker);
  const latestDecision = getLatestDecisionForTicker(focusTicker);
  const vaultCount = (state.evidenceVault || []).length;
  const queue = [];

  function push({ status, title, detail, action, className = "is-review", buttonLabel = "Do next action", ticker = focusTicker, requirementKey = "" }) {
    queue.push({ status, title, detail, action, className, buttonLabel, ticker, requirementKey });
  }

  if (!packet.hasBrief) {
    push({
      status: "Start",
      title: `Run a ${focusTicker || "starter"} risk question`,
      detail: `Load a clean starter question so the gate, QA, brief packet, and launch score have a live answer to inspect.`,
      action: "run-question",
      className: "is-blocked",
      buttonLabel: "Run starter question"
    });
  } else if (gate.nextGap && gate.requiredBlockers.length) {
    push({
      status: "Evidence",
      title: `Replace ${gate.nextGap.label} for ${gate.meta.ticker}`,
      detail: gate.requiredBlockers[0]?.detail || "The active answer has an evidence blocker that should be handled before review.",
      action: "source-gap",
      className: "is-blocked",
      buttonLabel: "Open source gap",
      ticker: gate.meta.ticker,
      requirementKey: gate.nextGap.key
    });
  } else if (quality.topFix && quality.topFix.score < 88) {
    push({
      status: quality.topFix.required ? "Blocker" : "Review",
      title: `Fix ${quality.topFix.label}`,
      detail: quality.topFix.detail,
      action: "answer-quality",
      className: quality.topFix.required ? "is-blocked" : "is-review",
      buttonLabel: "Open QA fix"
    });
  } else if (!latestReview) {
    push({
      status: "Review",
      title: `Save a human review for ${focusTicker}`,
      detail: "The answer has cleared the first automated checks; add a memo-review decision before treating it as a pilot artifact.",
      action: "review",
      className: "is-review",
      buttonLabel: "Open review room"
    });
  } else if (!latestDecision) {
    push({
      status: "Decision",
      title: `Log the research decision for ${focusTicker}`,
      detail: "A review exists, but the decision journal still needs thesis strength, triggers, and next review timing.",
      action: "decision",
      className: "is-review",
      buttonLabel: "Open decision journal"
    });
  } else if (releaseDoctor.score < 100) {
    push({
      status: "Ship",
      title: "Confirm the Release Doctor manifest",
      detail: releaseDoctor.summary,
      action: "release-doctor",
      className: "is-review",
      buttonLabel: "Open release doctor"
    });
  } else if (trustCenter.topAction && trustCenter.score < 78) {
    push({
      status: "Trust",
      title: trustCenter.topAction.label,
      detail: trustCenter.topAction.detail,
      action: "trust-center",
      className: trustCenter.topAction.className || "is-review",
      buttonLabel: "Open trust center"
    });
  } else if (audit.nextBlocker) {
    push({
      status: audit.nextBlocker.severity,
      title: audit.nextBlocker.title,
      detail: audit.nextBlocker.detail,
      action: "launch-control",
      className: audit.nextBlocker.className || "is-review",
      buttonLabel: "Open launch blocker"
    });
  } else {
    push({
      status: "Ready",
      title: "Export the release audit",
      detail: "The visible workflow is clear. Export the audit pack and run the post-upload smoke test rhythm.",
      action: "export-launch-audit",
      className: "is-ready",
      buttonLabel: "Export audit pack"
    });
  }

  if (starter && starter.next && starter.next.statusKey !== "real" && !queue.some((item) => item.action === "source-gap")) {
    push({
      status: "Source",
      title: `${focusTicker} source gap: ${starter.next.label}`,
      detail: `${starter.realCount}/${starter.checklist.length} REAL source types. ${starter.next.status} is the next collection slot.`,
      action: "source-gap",
      className: starter.realCount ? "is-review" : "is-blocked",
      buttonLabel: "Open source gap",
      ticker: focusTicker,
      requirementKey: starter.next.key
    });
  }
  if (packet.hasBrief && !latestReview && !queue.some((item) => item.action === "review")) {
    push({
      status: "Review",
      title: "Add memo-review trail",
      detail: "Saved human review decisions feed Launch Control, Review Radar, IC Memo, and Answer Quality.",
      action: "review",
      className: "is-review",
      buttonLabel: "Open review room"
    });
  }
  if (releaseDoctor.score === 100 && !queue.some((item) => item.action === "release-doctor")) {
    push({
      status: "Ship",
      title: "Copy the v47 root manifest",
      detail: "Use it during GitHub upload so the public page stays styled and hydrated.",
      action: "release-doctor",
      className: "is-ready",
      buttonLabel: "Open release doctor"
    });
  }
  if (trustCenter.topAction && trustCenter.score < 88 && !queue.some((item) => item.action === "trust-center")) {
    push({
      status: "Trust",
      title: `Trust review: ${trustCenter.topAction.label}`,
      detail: trustCenter.topAction.detail,
      action: "trust-center",
      className: trustCenter.topAction.className || "is-review",
      buttonLabel: "Open trust center"
    });
  }

  const primaryAction = queue[0] || null;
  const score = Math.round(
    (packet.hasBrief ? 18 : 0)
    + Math.min(24, gate.score * 0.24)
    + Math.min(24, quality.score * 0.24)
    + Math.min(14, audit.realCoverage * 0.14)
    + (latestReview ? 8 : 0)
    + (latestDecision ? 6 : 0)
    + Math.min(4, trustCenter.score * 0.04)
    + Math.min(4, vaultCount)
    + Math.min(2, releaseDoctor.score * 0.02)
  );
  const statusLabel = primaryAction ? primaryAction.status : "Ready";
  const statusClass = primaryAction?.className || "is-ready";
  const stageLabel = !packet.hasBrief
    ? "Start"
    : gate.requiredBlockers.length
      ? "Evidence work"
      : !latestReview || !latestDecision
        ? "Review trail"
        : audit.nextBlocker
          ? "Launch review"
          : "Ship";
  const headline = primaryAction ? primaryAction.title : "Desk is ready for release review.";
  const summary = primaryAction
    ? primaryAction.detail
    : "No obvious next blocker is open. Export the release audit and run public-site smoke tests.";
  return {
    generatedAt: new Date().toISOString(),
    releaseLabel: RELEASE_LABEL,
    statusLabel,
    statusClass,
    stageLabel,
    headline,
    summary,
    score: Math.max(0, Math.min(100, score)),
    primaryAction,
    focus: {
      ticker: focusTicker,
      company: focusCompany ? focusCompany.name : focusTicker
    },
    metrics: [
      { label: "Answer", value: packet.hasBrief ? packet.statusLabel : "None", detail: packet.hasBrief ? `${packet.score}% packet score` : "Run a starter question" },
      { label: "Gate", value: `${gate.score}%`, detail: gate.statusLabel },
      { label: "QA", value: quality.hasBrief ? `${quality.score}%` : "None", detail: quality.statusLabel },
      { label: "Sources", value: starter ? `${starter.realCount}/${starter.checklist.length}` : "0/5", detail: starter ? starter.label : "Select a company" },
      { label: "Trust", value: `${trustCenter.score}%`, detail: trustCenter.statusLabel },
      { label: "Vault", value: vaultCount, detail: vaultCount ? "Saved evidence trail" : "No saved evidence" },
      { label: "Review", value: latestReview ? "Saved" : "Open", detail: latestReview ? getMemoReviewDecisionLabel(latestReview.decision) : "No memo review" },
      { label: "Release", value: `${releaseDoctor.score}%`, detail: releaseDoctor.statusLabel }
    ],
    queue: queue.slice(0, 4)
  };
}

function renderLaunchControlRoom() {
  if (!els.launchControlSummary || !els.launchControlStats || !els.launchBlockerList || !els.launchCompanyList) return;
  const audit = makeLaunchAudit();
  if (els.launchControlStatus) els.launchControlStatus.textContent = audit.statusLabel;
  if (els.launchBlockerCount) {
    els.launchBlockerCount.textContent = `${audit.blockers.length} open`;
  }
  if (els.openLaunchBlocker) els.openLaunchBlocker.disabled = !audit.nextBlocker;

  els.launchControlSummary.innerHTML = `
    <div class="launch-control-hero ${escapeAttr(audit.statusClass)}">
      <div>
        <span>${escapeHtml(audit.statusLabel)}</span>
        <strong>NiveshScope ${escapeHtml(audit.releaseLabel)}</strong>
        <p>${escapeHtml(audit.summary)}</p>
      </div>
      <div class="launch-score">
        <span>Launch score</span>
        <strong>${escapeHtml(audit.score)}%</strong>
      </div>
    </div>
  `;

  els.launchControlStats.innerHTML = audit.stats.map((stat) => `
    <article>
      <span>${escapeHtml(stat.label)}</span>
      <strong>${escapeHtml(stat.value)}</strong>
      <em>${escapeHtml(stat.detail)}</em>
    </article>
  `).join("");

  els.launchBlockerList.innerHTML = audit.blockers.length
    ? audit.blockers.map((blocker) => `
      <article class="launch-blocker ${escapeAttr(blocker.className)}">
        <span>${escapeHtml(blocker.severity)}</span>
        <strong>${escapeHtml(blocker.title)}</strong>
        <p>${escapeHtml(blocker.detail)}</p>
      </article>
    `).join("")
    : `<article class="launch-blocker is-clear"><span>Clear</span><strong>No launch blockers detected.</strong><p>Run the final upload checklist and keep evidence provenance attached.</p></article>`;

  els.launchCompanyList.innerHTML = audit.companyRows.slice(0, 5).map((row) => `
    <article class="launch-company-row ${escapeAttr(row.className)}">
      <div>
        <span>${escapeHtml(row.company.ticker)}</span>
        <strong>${escapeHtml(row.company.name)}</strong>
      </div>
      <em>${escapeHtml(row.realCount)}/${escapeHtml(row.total)} REAL</em>
      <p>${escapeHtml(row.nextText)}</p>
    </article>
  `).join("");

  if (els.launchTestPlan) {
    els.launchTestPlan.innerHTML = `
      <div class="launch-control-card-head">
        <span>Post-upload test plan</span>
        <strong>${escapeHtml(audit.tests.length)} checks</strong>
      </div>
      <ol>
        ${audit.tests.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ol>
    `;
  }
  renderTrustCenter();
  renderReleaseDoctor(audit);
  renderOperatorCoach(audit);
}

function renderReleaseDoctor(audit = makeLaunchAudit()) {
  const doctor = audit.releaseDoctor || makeReleaseDoctorAudit();
  if (els.releaseDoctorStatus) els.releaseDoctorStatus.textContent = doctor.statusLabel;
  if (els.releaseDoctorSummary) {
    els.releaseDoctorSummary.innerHTML = `
      <article class="release-doctor-hero ${escapeAttr(doctor.statusClass)}">
        <div>
          <span>Root Upload Guard</span>
          <strong>${escapeHtml(doctor.statusLabel)}</strong>
          <p>${escapeHtml(doctor.summary)}</p>
        </div>
        <div class="launch-score">
          <span>Doctor score</span>
          <strong>${escapeHtml(doctor.score)}%</strong>
        </div>
      </article>
      <div class="release-doctor-checks">
        ${doctor.runtimeChecks.map((check) => `
          <article class="${escapeAttr(check.ok ? "is-ready" : "is-review")}">
            <span>${escapeHtml(check.ok ? "OK" : "Review")}</span>
            <strong>${escapeHtml(check.label)}</strong>
            <p>${escapeHtml(check.detail)}</p>
          </article>
        `).join("")}
      </div>
    `;
  }
  if (els.releaseDoctorFiles) {
    els.releaseDoctorFiles.innerHTML = `
      <div class="launch-control-card-head">
        <span>Required root contents</span>
        <strong>${escapeHtml(doctor.manifest.length)} items</strong>
      </div>
      <div class="release-doctor-file-grid">
        ${doctor.manifest.map((item) => `
          <article>
            <span>${escapeHtml(item.kind)}</span>
            <strong>${escapeHtml(item.path)}</strong>
            <p>${escapeHtml(item.role)}</p>
          </article>
        `).join("")}
      </div>
    `;
  }
}

function makeReleaseDoctorAudit() {
  const runtimeChecks = [
    {
      label: "Visible release marker",
      ok: Boolean(document.querySelector(".status-strip")?.textContent.includes("Source review v47")),
      detail: "The top status pill should show Source review v47 after a hard refresh."
    },
    {
      label: "Main stylesheet linked",
      ok: Boolean(document.querySelector('link[href^="styles.css"]')),
      detail: "GitHub Pages must serve styles.css from the repository root."
    },
    {
      label: "Launch stylesheet linked",
      ok: Boolean(document.querySelector('link[href^="launch.css"]')),
      detail: "launch.css keeps the hero and launch sections styled after upload."
    },
    {
      label: "App script linked",
      ok: Boolean(document.querySelector('script[src^="app.js"]')),
      detail: "app.js must be at the root so the desk hydrates instead of rendering plain text."
    },
    {
      label: "Security policy present",
      ok: Boolean(document.querySelector('meta[http-equiv="Content-Security-Policy"]')),
      detail: "The static CSP should travel with every release."
    },
    {
      label: "Data root configured",
      ok: Object.values(DATA_FILES).every((path) => path.startsWith("data/")),
      detail: "Research data should load from the root data folder."
    }
  ];
  const okCount = runtimeChecks.filter((check) => check.ok).length;
  const score = Math.round((okCount / runtimeChecks.length) * 100);
  const statusLabel = score === 100 ? "Root manifest ready" : "Root manifest needs review";
  const statusClass = score === 100 ? "is-ready" : "is-review";
  const summary = score === 100
    ? `Runtime markers look correct. Upload the contents of ${RELEASE_PACKAGE_NAME} to the GitHub repository root.`
    : "One or more runtime markers are missing. Re-check that you uploaded files from inside the release folder, not the folder as one nested item.";
  return {
    releaseLabel: RELEASE_LABEL,
    packageName: RELEASE_PACKAGE_NAME,
    dataVersion: DATA_VERSION,
    generatedAt: new Date().toISOString(),
    statusLabel,
    statusClass,
    score,
    okCount,
    checkCount: runtimeChecks.length,
    summary,
    uploadRule: "Upload the contents of the release folder to the repository root.",
    manifest: RELEASE_ROOT_MANIFEST,
    runtimeChecks,
    smokeTests: makeReleaseDoctorSmokeTests()
  };
}

function makeLaunchAudit() {
  const companies = getCompanies();
  const companyRows = companies.map(makeLaunchCompanyRow).filter(Boolean);
  const totalSlots = companyRows.reduce((sum, row) => sum + row.total, 0) || 1;
  const realSlots = companyRows.reduce((sum, row) => sum + row.realCount, 0);
  const importedSlots = companyRows.reduce((sum, row) => sum + row.importedCount, 0);
  const syntheticSlots = companyRows.reduce((sum, row) => sum + row.syntheticCount, 0);
  const missingSlots = companyRows.reduce((sum, row) => sum + row.missingCount, 0);
  const realCoverage = Math.round((realSlots / totalSlots) * 100);
  const starterRows = STARTER_PACK_TICKERS.map(makeStarterPackCompany).filter(Boolean);
  const starterReady = starterRows.filter((row) => row.investmentReady).length;
  const packet = makeBriefPacket();
  const radar = makeReviewRadar();
  const portfolio = makePortfolioWatchtower();
  const calendar = makeCatalystCalendar();
  const briefing = makeDailyBriefing("morning");
  const taskBoard = makeDeskTaskBoard("all");
  const sprintPlan = makeResearchSprintPlan("focus", 5);
  const icMemo = makeIcMemoPlan("committee");
  const claimTrace = makeClaimTraceAudit("answer");
  const answerQuality = makeAnswerQualityAudit("release");
  const releaseDoctor = makeReleaseDoctorAudit();
  const trustCenter = makeTrustCenterAudit({ releaseDoctor, packet, realCoverage });
  const blockers = makeLaunchBlockers({ companyRows, starterRows, packet, realCoverage, realSlots, totalSlots, radar, portfolio, calendar, briefing, taskBoard, sprintPlan, icMemo, claimTrace, answerQuality, releaseDoctor, trustCenter });
  const highBlockers = blockers.filter((item) => item.severity === "High").length;
  const reviewScore = Math.min(100, state.memoReviews.length * 34);
  const decisionScore = Math.min(100, state.decisionJournal.length * 34);
  const radarScore = radar.items.length ? radar.score : 0;
  const portfolioScore = portfolio.rows.length ? portfolio.score : 0;
  const calendarScore = calendar.events.length ? calendar.score : 100;
  const briefingScore = briefing.actions.length ? briefing.focusScore : 100;
  const taskBoardScore = taskBoard.tasks.length ? taskBoard.score : 100;
  const sprintScore = sprintPlan.items.length ? sprintPlan.score : 100;
  const icMemoScore = icMemo.hasBrief ? icMemo.score : 0;
  const claimTraceScore = claimTrace.hasBrief ? claimTrace.traceQuality : 0;
  const answerQualityScore = answerQuality.hasBrief ? answerQuality.score : 0;
  const vaultCount = (state.evidenceVault || []).length;
  const vaultScore = Math.min(100, vaultCount * 12);
  const starterScore = starterRows.length ? Math.round((starterReady / starterRows.length) * 100) : 0;
  const score = Math.round(
    realCoverage * 0.14
    + starterScore * 0.09
    + reviewScore * 0.08
    + decisionScore * 0.07
    + radarScore * 0.06
    + portfolioScore * 0.06
    + calendarScore * 0.05
    + briefingScore * 0.05
    + taskBoardScore * 0.05
    + sprintScore * 0.04
    + (packet.hasBrief ? packet.score : 0) * 0.04
    + icMemoScore * 0.08
    + claimTraceScore * 0.06
    + answerQualityScore * 0.06
    + trustCenter.score * 0.03
    + vaultScore * 0.02
    + releaseDoctor.score * 0.02
    + Math.max(0, 100 - blockers.length * 12) * 0.00
  );
  const statusLabel = highBlockers
    ? "Launch blocked"
    : score >= 75
      ? "Pilot publish ready"
      : "Prototype publish ready";
  const statusClass = highBlockers ? "is-blocked" : score >= 75 ? "is-ready" : "is-review";
  const summary = highBlockers
    ? `${highBlockers} high-priority blocker${highBlockers === 1 ? "" : "s"} should be resolved before positioning this as launch-ready.`
    : "No high-priority blockers detected. Publish as a prototype and run the upload checklist.";
  return {
    releaseLabel: RELEASE_LABEL,
    generatedAt: new Date().toISOString(),
    statusLabel,
    statusClass,
    score,
    summary,
    realCoverage,
    realSlots,
    importedSlots,
    syntheticSlots,
    missingSlots,
    totalSlots,
    starterReady,
    starterTotal: starterRows.length,
    reviewCount: state.memoReviews.length,
    decisionCount: state.decisionJournal.length,
    reviewRadar: radar,
    portfolioWatchtower: portfolio,
    catalystCalendar: calendar,
    dailyBriefing: briefing,
    deskTaskBoard: taskBoard,
    researchSprint: sprintPlan,
    icMemo,
    claimTrace,
    answerQuality,
    trustCenter,
    releaseDoctor,
    evidenceVault: makeEvidenceVaultJson(),
    packet,
    blockers,
    nextBlocker: blockers[0] || null,
    companyRows: companyRows.sort((a, b) => b.realCount - a.realCount || a.missingCount - b.missingCount),
    stats: [
      { label: "REAL coverage", value: `${realCoverage}%`, detail: `${realSlots}/${totalSlots} required source slots` },
      { label: "Starter companies", value: `${starterReady}/${starterRows.length}`, detail: "RELIANCE, TCS, HDFCBANK ready count" },
      { label: "Review log", value: state.memoReviews.length, detail: "Saved human review decisions" },
      { label: "Decision journal", value: state.decisionJournal.length, detail: "Saved research decisions" },
      { label: "Review radar", value: `${radar.dueCount} due`, detail: `${radar.openTaskCount} evidence tasks` },
      { label: "Watchtower", value: `${portfolio.score}%`, detail: portfolio.nextRow ? `${portfolio.nextRow.company.ticker} next action` : "No actions open" },
      { label: "Catalysts", value: calendar.eventCount, detail: `${calendar.overdueCount} overdue | ${calendar.sourceCount} source` },
      { label: "Daily brief", value: `${briefing.focusScore}%`, detail: briefing.firstAction ? `${briefing.firstAction.ticker} first` : "No actions open" },
      { label: "Task board", value: `${taskBoard.openCount} open`, detail: `${taskBoard.highOpenCount} high | ${taskBoard.doneCount} done` },
      { label: "Sprint plan", value: `${sprintPlan.items.length}/${sprintPlan.capacity}`, detail: sprintPlan.firstItem ? `${sprintPlan.firstItem.ticker} first` : "No actions planned" },
      { label: "IC memo", value: icMemo.hasBrief ? `${icMemo.score}%` : "None", detail: icMemo.statusLabel },
      { label: "Claim trace", value: claimTrace.hasBrief ? `${claimTrace.traceQuality}%` : "None", detail: claimTrace.statusLabel },
      { label: "Answer QA", value: answerQuality.hasBrief ? `${answerQuality.score}%` : "None", detail: answerQuality.statusLabel },
      { label: "Trust center", value: `${trustCenter.score}%`, detail: trustCenter.statusLabel },
      { label: "Evidence vault", value: vaultCount, detail: vaultCount ? "Saved citation trail" : "No saved evidence" },
      { label: "Release doctor", value: `${releaseDoctor.score}%`, detail: releaseDoctor.statusLabel },
      { label: "Current memo", value: packet.hasBrief ? `${packet.score}%` : "None", detail: packet.statusLabel }
    ],
    tests: makeLaunchTestPlan()
  };
}

function makeLaunchCompanyRow(company) {
  const docs = getCompanyDocs(company.ticker);
  const checklist = makeRealDataChecklist(docs);
  const realCount = checklist.filter((item) => item.statusKey === "real").length;
  const importedCount = checklist.filter((item) => item.statusKey === "imported").length;
  const syntheticCount = checklist.filter((item) => item.statusKey === "synthetic").length;
  const missingCount = checklist.filter((item) => item.statusKey === "missing").length;
  const next = checklist.find((item) => item.statusKey === "missing")
    || checklist.find((item) => item.statusKey === "synthetic")
    || checklist.find((item) => item.statusKey === "imported")
    || null;
  const className = realCount === checklist.length ? "is-ready" : realCount >= 3 ? "is-review" : "is-blocked";
  return {
    company,
    checklist,
    realCount,
    importedCount,
    syntheticCount,
    missingCount,
    total: checklist.length,
    next,
    className,
    nextText: next ? `Next: replace ${next.label} (${next.status}).` : "All required source types are REAL."
  };
}

function makeLaunchBlockers({ companyRows, starterRows, packet, realCoverage, realSlots, radar, portfolio, calendar, briefing, taskBoard, sprintPlan, icMemo, claimTrace, answerQuality, releaseDoctor, trustCenter }) {
  const blockers = [];
  if (releaseDoctor && releaseDoctor.score < 100) {
    blockers.push({
      severity: "Medium",
      className: "is-medium",
      action: "release-doctor",
      title: "Release Doctor marker review",
      detail: "Confirm the root manifest, release marker, CSS, app script, CSP, and data references before uploading."
    });
  }
  if (trustCenter && trustCenter.counts.blockers) {
    blockers.push({
      severity: "High",
      className: "is-high",
      action: "trust-center",
      title: "Trust Center has required hardening blockers",
      detail: `${trustCenter.counts.blockers} required trust check${trustCenter.counts.blockers === 1 ? "" : "s"} need attention before broader pilot use.`
    });
  } else if (trustCenter && trustCenter.score < 78) {
    blockers.push({
      severity: "Medium",
      className: "is-medium",
      action: "trust-center",
      title: "Trust Center score is below pilot threshold",
      detail: `${trustCenter.score}% trust score. Open the Trust Center and resolve the first review action.`
    });
  }
  if (!packet.hasBrief) {
    blockers.push({
      severity: "High",
      className: "is-high",
      action: "run-question",
      title: "No current memo packet",
      detail: "Run a desk question, then review the Brief Workbench before calling the site launch-ready."
    });
  }
  if (!state.memoReviews.length) {
    blockers.push({
      severity: "High",
      className: "is-high",
      action: "review",
      title: "No human review decision",
      detail: "Save at least one Memo Review Room decision so the launch has a human judgement trail."
    });
  }
  if (!state.decisionJournal.length) {
    blockers.push({
      severity: "Medium",
      className: "is-medium",
      action: "decision",
      title: "No research decision logged",
      detail: "Save at least one Decision Journal entry so the launch has a thesis, review horizon, and next evidence task."
    });
  }
  if (radar && radar.overdueCount) {
    blockers.push({
      severity: "Medium",
      className: "is-medium",
      action: "radar",
      title: "Review Radar has overdue decisions",
      detail: `${radar.overdueCount} review${radar.overdueCount === 1 ? "" : "s"} should be opened before using older conclusions.`
    });
  }
  if (radar && !radar.overdueCount && radar.openTaskCount >= 3) {
    blockers.push({
      severity: "Medium",
      className: "is-medium",
      action: "radar",
      title: "Review Radar has open evidence tasks",
      detail: `${radar.openTaskCount} decision evidence task${radar.openTaskCount === 1 ? "" : "s"} remain open.`
    });
  }
  if (portfolio && portfolio.rows.length && portfolio.score < 35) {
    blockers.push({
      severity: "Medium",
      className: "is-medium",
      action: "portfolio",
      title: "Portfolio Watchtower score is weak",
      detail: `${portfolio.score}% desk score. Open the watchtower and work the top company action before calling the release operationally ready.`
    });
  }
  if (calendar && calendar.overdueCount) {
    blockers.push({
      severity: "Medium",
      className: "is-medium",
      action: "calendar",
      title: "Catalyst Calendar has overdue events",
      detail: `${calendar.overdueCount} catalyst${calendar.overdueCount === 1 ? "" : "s"} are overdue. Work the calendar before using stale research.`
    });
  }
  if (briefing && briefing.urgentCount >= 3) {
    blockers.push({
      severity: "Medium",
      className: "is-medium",
      action: "briefing",
      title: "Daily Briefing has urgent actions",
      detail: `${briefing.urgentCount} urgent desk action${briefing.urgentCount === 1 ? "" : "s"} are open. Start the briefing before calling the release operationally ready.`
    });
  }
  if (taskBoard && taskBoard.highOpenCount >= 3) {
    blockers.push({
      severity: "Medium",
      className: "is-medium",
      action: "task-board",
      title: "Desk Task Board has high-priority work",
      detail: `${taskBoard.highOpenCount} high-priority task${taskBoard.highOpenCount === 1 ? "" : "s"} are open. Move the board before launch review.`
    });
  }
  if (sprintPlan && taskBoard && taskBoard.openCount && !sprintPlan.items.length) {
    blockers.push({
      severity: "Medium",
      className: "is-medium",
      action: "sprint",
      title: "No active research sprint",
      detail: "Open tasks exist, but the current focus sprint has no planned actions. Build or adjust the sprint before launch review."
    });
  }
  if (icMemo && packet.hasBrief && icMemo.blockers.some((blocker) => blocker.severity === "High")) {
    blockers.push({
      severity: "High",
      className: "is-high",
      action: "ic-memo",
      title: "IC memo has a blocking control",
      detail: `${icMemo.nextBlocker.title}: ${icMemo.nextBlocker.detail}`
    });
  }
  if (icMemo && packet.hasBrief && !icMemo.blockers.some((blocker) => blocker.severity === "High") && icMemo.score < 70) {
    blockers.push({
      severity: "Medium",
      className: "is-medium",
      action: "ic-memo",
      title: "IC memo is not pre-read ready",
      detail: `${icMemo.score}% IC memo score. Open the IC Memo Builder and resolve the next packet gap before launch review.`
    });
  }
  if (claimTrace && packet.hasBrief && claimTrace.blockedCount) {
    blockers.push({
      severity: "High",
      className: "is-high",
      action: "claim-trace",
      title: "Claim trace has unsupported critical claims",
      detail: `${claimTrace.blockedCount} critical claim${claimTrace.blockedCount === 1 ? "" : "s"} need citation support before committee circulation.`
    });
  }
  if (claimTrace && packet.hasBrief && !claimTrace.blockedCount && (claimTrace.unsupportedCount || claimTrace.synCount)) {
    blockers.push({
      severity: "Medium",
      className: "is-medium",
      action: "claim-trace",
      title: "Claim trace needs review",
      detail: `${claimTrace.unsupportedCount} unsupported and ${claimTrace.synCount} SYN-backed claim${claimTrace.unsupportedCount + claimTrace.synCount === 1 ? "" : "s"} remain in the current answer.`
    });
  }
  if (answerQuality && packet.hasBrief && answerQuality.blockingCount) {
    blockers.push({
      severity: "High",
      className: "is-high",
      action: "answer-quality",
      title: "Answer QA has blocking checks",
      detail: `${answerQuality.blockingCount} answer-quality blocker${answerQuality.blockingCount === 1 ? "" : "s"} remain. Top fix: ${answerQuality.topFix?.label || "quality review"}.`
    });
  }
  if (answerQuality && packet.hasBrief && !answerQuality.blockingCount && answerQuality.score < 78) {
    blockers.push({
      severity: "Medium",
      className: "is-medium",
      action: "answer-quality",
      title: "Answer QA is below release target",
      detail: `${answerQuality.score}% answer-quality score. Open the lab and resolve the first weak dimension before launch review.`
    });
  }
  if (!realSlots) {
    const firstStarter = starterRows[0]?.next;
    blockers.push({
      severity: "High",
      className: "is-high",
      action: "source",
      ticker: starterRows[0]?.company.ticker || STARTER_PACK_TICKERS[0],
      requirementKey: firstStarter?.key || "annual-report",
      title: "No REAL source record yet",
      detail: "The public corpus is still SYN/IMP only. Replace at least one official source before stronger launch positioning."
    });
  }
  const starterGap = starterRows.find((row) => !row.investmentReady);
  if (starterGap && starterGap.next) {
    blockers.push({
      severity: "High",
      className: "is-high",
      action: "source",
      ticker: starterGap.company.ticker,
      requirementKey: starterGap.next.key,
      title: `${starterGap.company.ticker} is not source-complete`,
      detail: `Next required source: ${starterGap.next.label} (${starterGap.next.status}).`
    });
  }
  const syntheticCitations = packet.citations.filter((citation) => normalizeSourceStatus(citation.sourceStatus) === "synthetic").length;
  if (packet.hasBrief && syntheticCitations) {
    blockers.push({
      severity: "Medium",
      className: "is-medium",
      action: packet.nextGap ? "source" : "brief",
      ticker: packet.meta.ticker,
      requirementKey: packet.nextGap?.key || "annual-report",
      title: "Current memo cites SYN evidence",
      detail: `${syntheticCitations} citation${syntheticCitations === 1 ? "" : "s"} in the current memo are demo-only.`
    });
  }
  if (realCoverage < 20) {
    const nextCompany = companyRows.find((row) => row.next);
    blockers.push({
      severity: "Medium",
      className: "is-medium",
      action: nextCompany ? "source" : "coverage",
      ticker: nextCompany?.company.ticker,
      requirementKey: nextCompany?.next?.key,
      title: "REAL source coverage is below pilot threshold",
      detail: `${realCoverage}% of required company-source slots are REAL. Target 20% for a credible pilot.`
    });
  }
  return blockers;
}

function makeLaunchTestPlan() {
  return [
    "After uploading the ZIP contents to GitHub, confirm the top status pill says Source review v47.",
    "Open Operator Coach and confirm it shows one next action with desk metrics.",
    "Open Launch Control and confirm Release Doctor says Root manifest ready.",
    "Copy the Release Doctor root manifest and compare it against the GitHub repository root before committing.",
    "Run a question and confirm the Investment Readiness Gate shows demo, review, or committee export posture.",
    "Open Evidence Vault, save the current citations, copy the vault, export the vault JSON, and confirm the saved question can reload into the desk.",
    "Run one RELIANCE risk question and confirm the Brief Workbench updates.",
    "Save one Memo Review Room decision and confirm the Launch Control review count changes.",
    "Save one Decision Journal entry and confirm the Launch Control decision count changes.",
    "Open Review Radar and confirm the saved decision appears with due status, evidence task, and follow-up action.",
    "Open Portfolio Watchtower and confirm Open next action routes to source work, review work, or a desk question.",
    "Open Catalyst Calendar and confirm Open next catalyst routes to a review, source task, or desk question.",
    "Open Daily Briefing and confirm Start first action routes into the highest-priority source, review, portfolio, or catalyst task.",
    "Capture a Daily Briefing item into Desk Task Board, progress it to In progress, mark it done, and confirm Launch Control task stats update.",
    "Open Research Sprint Planner, change capacity, capture sprint tasks, and confirm the task board plus Launch Control update.",
    "Open IC Memo Builder, change memo format, copy the memo, export PDF, export JSON, and confirm Launch Control IC memo score updates.",
    "Open Claim Trace Inspector, switch trace scope, open the weakest claim, copy trace, export trace JSON, and confirm Launch Control claim trace score updates.",
    "Open Answer Quality Lab, change quality view, open the top fix, copy the QA report, export QA JSON, and confirm Launch Control answer QA score updates.",
    "Open Trust Center, copy the trust report, export the JSON report, and confirm the top hardening action routes to the right workflow.",
    "Open Launch Control and use Open next blocker to confirm it jumps to the correct workflow.",
    "Click PDF and MD after a generated answer to verify exports still download.",
    "Use Source Studio with a sample filing and confirm REAL records still require the three confidence checks."
  ];
}

function makeReleaseDoctorSmokeTests() {
  return [
    "Open the GitHub Pages URL with a cache-busting query such as ?v=47.",
    "Confirm the page is styled, not plain HTML text.",
    "Confirm the top status pill says Source review v47.",
    "Open Operator Coach and confirm the next-action card renders.",
    "Open Trust Center and confirm the score, checks, copy, and export controls render.",
    "Open Evidence Vault and confirm the empty research-memory state renders.",
    "Open Launch Control and confirm Release Doctor says Root manifest ready.",
    "Run one RELIANCE risk question and confirm the answer panel appears.",
    "Click PDF and MD after a generated answer and confirm both downloads start."
  ];
}

function openLaunchBlocker() {
  const audit = makeLaunchAudit();
  const blocker = audit.nextBlocker;
  if (!blocker) {
    flashLaunchControlResult("No launch blocker is open.", "success");
    return;
  }
  if (blocker.action === "source" && blocker.ticker && blocker.requirementKey) {
    loadSourceTaskIntoBuilder(blocker.ticker, blocker.requirementKey);
    flashLaunchControlResult(`${blocker.ticker} source blocker opened in Source Studio.`, "success");
    return;
  }
  if (blocker.action === "review") {
    document.querySelector("#memo-review-room")?.scrollIntoView({ behavior: "smooth", block: "start" });
    flashLaunchControlResult("Memo Review Room opened. Save a review after running a memo.", "neutral");
    return;
  }
  if (blocker.action === "decision") {
    document.querySelector("#decision-journal")?.scrollIntoView({ behavior: "smooth", block: "start" });
    flashLaunchControlResult("Decision Journal opened. Save the research decision after reviewing the gate.", "neutral");
    return;
  }
  if (blocker.action === "radar") {
    document.querySelector("#review-radar")?.scrollIntoView({ behavior: "smooth", block: "start" });
    flashLaunchControlResult("Review Radar opened. Work the oldest due item or evidence task.", "neutral");
    return;
  }
  if (blocker.action === "portfolio") {
    document.querySelector("#portfolio-watchtower")?.scrollIntoView({ behavior: "smooth", block: "start" });
    flashLaunchControlResult("Portfolio Watchtower opened. Work the top company action first.", "neutral");
    return;
  }
  if (blocker.action === "calendar") {
    document.querySelector("#catalyst-calendar")?.scrollIntoView({ behavior: "smooth", block: "start" });
    flashLaunchControlResult("Catalyst Calendar opened. Work the oldest dated event first.", "neutral");
    return;
  }
  if (blocker.action === "briefing") {
    document.querySelector("#daily-briefing")?.scrollIntoView({ behavior: "smooth", block: "start" });
    flashLaunchControlResult("Daily Briefing opened. Start the first action before launch review.", "neutral");
    return;
  }
  if (blocker.action === "task-board") {
    document.querySelector("#desk-task-board")?.scrollIntoView({ behavior: "smooth", block: "start" });
    flashLaunchControlResult("Desk Task Board opened. Move high-priority tasks before launch review.", "neutral");
    return;
  }
  if (blocker.action === "sprint") {
    document.querySelector("#research-sprint-planner")?.scrollIntoView({ behavior: "smooth", block: "start" });
    flashLaunchControlResult("Research Sprint Planner opened. Build the next focused work batch.", "neutral");
    return;
  }
  if (blocker.action === "ic-memo") {
    document.querySelector("#ic-memo-builder")?.scrollIntoView({ behavior: "smooth", block: "start" });
    flashLaunchControlResult("IC Memo Builder opened. Resolve the top packet blocker before launch review.", "neutral");
    return;
  }
  if (blocker.action === "claim-trace") {
    document.querySelector("#claim-trace-inspector")?.scrollIntoView({ behavior: "smooth", block: "start" });
    flashLaunchControlResult("Claim Trace Inspector opened. Start with the weakest unsupported claim.", "neutral");
    return;
  }
  if (blocker.action === "answer-quality") {
    document.querySelector("#answer-quality-lab")?.scrollIntoView({ behavior: "smooth", block: "start" });
    flashLaunchControlResult("Answer Quality Lab opened. Work the top fix before release review.", "neutral");
    return;
  }
  if (blocker.action === "trust-center") {
    document.querySelector("#trust-center")?.scrollIntoView({ behavior: "smooth", block: "start" });
    flashLaunchControlResult("Trust Center opened. Work the first hardening action before launch review.", "neutral");
    return;
  }
  if (blocker.action === "release-doctor") {
    document.querySelector("#release-doctor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    flashLaunchControlResult("Release Doctor opened. Copy the root manifest before uploading.", "neutral");
    return;
  }
  if (blocker.action === "run-question") {
    const ticker = state.selectedTicker || STARTER_PACK_TICKERS[0];
    els.queryInput.value = `What are the risks for $${ticker}?`;
    document.querySelector("#desk")?.scrollIntoView({ behavior: "smooth", block: "start" });
    flashLaunchControlResult("A starter launch-test question is loaded in the desk.", "neutral");
    return;
  }
  document.querySelector("#brief-workbench")?.scrollIntoView({ behavior: "smooth", block: "start" });
  flashLaunchControlResult("Brief Workbench opened for the current memo.", "neutral");
}

function exportLaunchAuditPack() {
  const audit = makeLaunchAudit();
  const date = new Date().toISOString().slice(0, 10);
  const filename = `niveshscope-launch-audit-v47-${date}.json`;
  downloadTextFile(filename, JSON.stringify(makeLaunchAuditJson(audit), null, 2), "application/json;charset=utf-8");
  flashLaunchControlResult("Launch audit pack exported.", "success");
}

async function copyLaunchUploadChecklist() {
  const copied = await copyTextToClipboard(makeLaunchUploadChecklistMarkdown(makeLaunchAudit()));
  flashLaunchControlResult(copied ? "Upload checklist copied." : "Clipboard blocked. Use export audit pack instead.", copied ? "success" : "error");
}

function makeLaunchAuditJson(audit) {
  return {
    product: "NiveshScope",
    release: audit.releaseLabel,
    dataVersion: DATA_VERSION,
    generatedAt: audit.generatedAt,
    status: audit.statusLabel,
    score: audit.score,
    summary: audit.summary,
    stats: audit.stats,
    blockers: audit.blockers.map(({ severity, title, detail, action, ticker, requirementKey }) => ({
      severity,
      title,
      detail,
      action,
      ticker: ticker || "",
      requirementKey: requirementKey || ""
    })),
    companyReadiness: audit.companyRows.map((row) => ({
      ticker: row.company.ticker,
      company: row.company.name,
      realCount: row.realCount,
      requiredCount: row.total,
      missingCount: row.missingCount,
      syntheticCount: row.syntheticCount,
      importedCount: row.importedCount,
      next: row.next ? { key: row.next.key, label: row.next.label, status: row.next.status } : null
    })),
    memoPacket: audit.packet.hasBrief ? makeBriefPacketJson(audit.packet) : null,
    reviewLog: makeMemoReviewLogJson(),
    decisionJournal: makeDecisionJournalJson(),
    reviewRadar: makeReviewRadarJson(audit.reviewRadar || makeReviewRadar()),
    portfolioWatchtower: makePortfolioWatchtowerJson(audit.portfolioWatchtower || makePortfolioWatchtower()),
    catalystCalendar: makeCatalystCalendarJson(audit.catalystCalendar || makeCatalystCalendar()),
    dailyBriefing: makeDailyBriefingJson(audit.dailyBriefing || makeDailyBriefing("morning")),
    deskTaskBoard: makeDeskTaskBoardJson(audit.deskTaskBoard || makeDeskTaskBoard("all")),
    researchSprint: makeResearchSprintJson(audit.researchSprint || makeResearchSprintPlan("focus", 5)),
    icMemo: makeIcMemoJson(audit.icMemo || makeIcMemoPlan("committee")),
    claimTrace: makeClaimTraceJson(audit.claimTrace || makeClaimTraceAudit("answer")),
    answerQuality: makeAnswerQualityJson(audit.answerQuality || makeAnswerQualityAudit("release")),
    trustCenter: makeTrustReportJson(audit.trustCenter || makeTrustCenterAudit()),
    evidenceVault: audit.evidenceVault || makeEvidenceVaultJson(),
    releaseDoctor: makeReleaseManifestJson(audit.releaseDoctor || makeReleaseDoctorAudit()),
    postUploadTests: audit.tests
  };
}

function makeLaunchUploadChecklistMarkdown(audit) {
  const blockers = audit.blockers.length
    ? audit.blockers.map((blocker) => `- ${blocker.severity}: ${blocker.title} - ${blocker.detail}`).join("\n")
    : "- No blockers detected.";
  const tests = audit.tests.map((test, index) => `${index + 1}. ${test}`).join("\n");
  return [
    "# NiveshScope v47 Upload Checklist",
    "",
    `Status: ${audit.statusLabel} (${audit.score}%)`,
    `Generated: ${new Date().toLocaleString()}`,
    "",
    "## Before Upload",
    "",
    `- Upload the contents of \`${RELEASE_PACKAGE_NAME}\` to the GitHub repository root.`,
    "- Do not upload the release folder itself as a nested folder.",
    "- Confirm `index.html`, `app.js`, `styles.css`, `launch.css`, `data/`, `assets/`, `docs/`, `scripts/`, `.github/`, and `.nojekyll` are at the root.",
    "- After upload, refresh with `?v=47` and confirm the status pill says `Source review v47`.",
    "- Commit through GitHub's upload screen.",
    "",
    "## Current Blockers",
    "",
    blockers,
    "",
    "## Post-Upload Tests",
    "",
    tests,
    "",
    "_Launch Control is a readiness workflow. It does not replace human source verification._"
  ].join("\n");
}

function openOperatorCoachAction() {
  const coach = makeOperatorCoach(makeLaunchAudit());
  const action = coach.primaryAction;
  if (!action) {
    flashOperatorCoachResult("No operator action is open.", "success");
    return;
  }
  if (action.action === "run-question") {
    const ticker = action.ticker || state.selectedTicker || STARTER_PACK_TICKERS[0] || "RELIANCE";
    const question = `What are the risks for $${ticker}?`;
    els.queryInput.value = question;
    document.querySelector("#desk")?.scrollIntoView({ behavior: "smooth", block: "start" });
    runAnalysis(question);
    flashOperatorCoachResult(`${ticker} starter question is running.`, "success");
    return;
  }
  if (action.action === "source-gap") {
    loadSourceTaskIntoBuilder(action.ticker || state.selectedTicker, action.requirementKey || "annual-report");
    flashOperatorCoachResult(`${action.ticker || state.selectedTicker} source gap opened in Source Studio.`, "success");
    return;
  }
  if (action.action === "answer-quality") {
    openAnswerQualityFix();
    flashOperatorCoachResult("Answer Quality top fix opened.", "neutral");
    return;
  }
  if (action.action === "review") {
    document.querySelector("#memo-review-room")?.scrollIntoView({ behavior: "smooth", block: "start" });
    flashOperatorCoachResult("Memo Review Room opened.", "neutral");
    return;
  }
  if (action.action === "decision") {
    document.querySelector("#decision-journal")?.scrollIntoView({ behavior: "smooth", block: "start" });
    flashOperatorCoachResult("Decision Journal opened.", "neutral");
    return;
  }
  if (action.action === "release-doctor") {
    document.querySelector("#release-doctor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    flashOperatorCoachResult("Release Doctor opened.", "neutral");
    return;
  }
  if (action.action === "trust-center") {
    openTrustCenterAction();
    flashOperatorCoachResult("Trust Center routed the top hardening action.", "neutral");
    return;
  }
  if (action.action === "launch-control") {
    openLaunchBlocker();
    flashOperatorCoachResult("Launch Control routed the next blocker.", "neutral");
    return;
  }
  if (action.action === "export-launch-audit") {
    exportLaunchAuditPack();
    flashOperatorCoachResult("Launch audit exported.", "success");
    return;
  }
  document.querySelector("#desk")?.scrollIntoView({ behavior: "smooth", block: "start" });
  flashOperatorCoachResult("Desk opened.", "neutral");
}

async function copyOperatorCoachPlan() {
  const copied = await copyTextToClipboard(makeOperatorCoachMarkdown(makeOperatorCoach(makeLaunchAudit())));
  flashOperatorCoachResult(copied ? "Operator plan copied." : "Clipboard blocked. Use Export plan instead.", copied ? "success" : "error");
}

function exportOperatorCoachPlan() {
  const coach = makeOperatorCoach(makeLaunchAudit());
  const date = new Date().toISOString().slice(0, 10);
  downloadTextFile(`niveshscope-operator-plan-v47-${date}.json`, JSON.stringify(makeOperatorCoachJson(coach), null, 2), "application/json;charset=utf-8");
  flashOperatorCoachResult("Operator plan exported.", "success");
}

function makeOperatorCoachJson(coach) {
  return {
    product: "NiveshScope",
    release: coach.releaseLabel,
    generatedAt: coach.generatedAt,
    status: coach.statusLabel,
    stage: coach.stageLabel,
    score: coach.score,
    headline: coach.headline,
    summary: coach.summary,
    focus: coach.focus,
    primaryAction: coach.primaryAction,
    metrics: coach.metrics,
    queue: coach.queue
  };
}

function makeOperatorCoachMarkdown(coach) {
  const metrics = coach.metrics.map((metric) => `- ${metric.label}: ${metric.value} - ${metric.detail}`).join("\n");
  const queue = coach.queue.map((item, index) => `${index + 1}. ${item.title} (${item.status}) - ${item.detail}`).join("\n");
  return [
    `# NiveshScope ${coach.releaseLabel} Operator Plan`,
    "",
    `Generated: ${new Date().toLocaleString()}`,
    `Focus: ${coach.focus.ticker} - ${coach.focus.company}`,
    `Stage: ${coach.stageLabel}`,
    `Desk score: ${coach.score}%`,
    "",
    "## Next Move",
    "",
    `${coach.headline}: ${coach.summary}`,
    "",
    "## Metrics",
    "",
    metrics,
    "",
    "## Queue",
    "",
    queue || "No open queue items."
  ].join("\n");
}

function flashOperatorCoachResult(message, tone = "neutral") {
  if (!els.operatorCoachResult) return;
  els.operatorCoachResult.className = `builder-result is-${tone}`;
  els.operatorCoachResult.textContent = message;
}

async function copyReleaseManifest() {
  const copied = await copyTextToClipboard(makeReleaseManifestMarkdown(makeReleaseDoctorAudit()));
  flashLaunchControlResult(copied ? "Release root manifest copied." : "Clipboard blocked. Use Export manifest instead.", copied ? "success" : "error");
}

function exportReleaseManifest() {
  const doctor = makeReleaseDoctorAudit();
  const date = new Date().toISOString().slice(0, 10);
  downloadTextFile(`niveshscope-release-manifest-v47-${date}.json`, JSON.stringify(makeReleaseManifestJson(doctor), null, 2), "application/json;charset=utf-8");
  flashLaunchControlResult("Release manifest exported.", "success");
}

function makeReleaseManifestJson(doctor) {
  return {
    product: "NiveshScope",
    release: doctor.releaseLabel,
    packageName: doctor.packageName,
    dataVersion: doctor.dataVersion,
    generatedAt: doctor.generatedAt,
    uploadRule: doctor.uploadRule,
    score: doctor.score,
    status: doctor.statusLabel,
    rootManifest: doctor.manifest,
    runtimeChecks: doctor.runtimeChecks.map((check) => ({
      label: check.label,
      ok: check.ok,
      detail: check.detail
    })),
    smokeTests: doctor.smokeTests
  };
}

function makeReleaseManifestMarkdown(doctor) {
  const rootItems = doctor.manifest.map((item) => `- [ ] \`${item.path}\` - ${item.role}`).join("\n");
  const checks = doctor.runtimeChecks.map((check) => `- [${check.ok ? "x" : " "}] ${check.label}: ${check.detail}`).join("\n");
  const smokeTests = doctor.smokeTests.map((test, index) => `${index + 1}. ${test}`).join("\n");
  return [
    `# NiveshScope ${doctor.releaseLabel} Root Manifest`,
    "",
    `Package: \`${doctor.packageName}\``,
    `Data version: \`${doctor.dataVersion}\``,
    `Doctor status: ${doctor.statusLabel} (${doctor.score}%)`,
    "",
    "## Upload Rule",
    "",
    "- Upload the contents of the release folder to the GitHub repository root.",
    "- Do not upload the folder as one nested directory.",
    "- If the public site appears as plain text, re-upload the root contents shown below.",
    "",
    "## Required Root Files And Folders",
    "",
    rootItems,
    "",
    "## Runtime Checks",
    "",
    checks,
    "",
    "## Post-Upload Smoke Tests",
    "",
    smokeTests
  ].join("\n");
}

function flashLaunchControlResult(message, tone = "neutral") {
  if (!els.launchControlResult) return;
  els.launchControlResult.className = `builder-result is-${tone}`;
  els.launchControlResult.textContent = message;
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
          sourceStatus: doc.sourceStatus,
          sourceLabel: doc.sourceLabel,
          sourceUrl: doc.sourceUrl,
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

function getGuardedDocs(docs, tickerFocus, explicitCompare) {
  if (!state.onlySelectedTicker || explicitCompare) return docs;
  const focusTicker = tickerFocus ? tickerFocus.ticker : state.selectedTicker;
  if (!focusTicker) return docs;
  const focusedDocs = docs.filter((doc) => doc.ticker === focusTicker);
  return focusedDocs.length ? focusedDocs : docs;
}

function rankChunks(question, chunks, options = {}) {
  const queryTokens = expandTokens(question);
  const intent = detectIntent(question);
  const lowerQuestion = question.toLowerCase();
  const focusTicker = options.tickerFocus ? options.tickerFocus.ticker : "";
  const strictFocus = state.onlySelectedTicker && focusTicker && !options.explicitCompare;
  const tickersInQuestion = Array.from(getMentionedTickers(question));

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
      if (strictFocus && chunk.ticker === focusTicker) score += 8;
      if (strictFocus && chunk.ticker !== focusTicker) score -= 14;
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

function makeEvidenceGuardMeta(question, citations, tickerFocus, explicitCompare) {
  const compareMode = explicitCompare;
  const focusTicker = tickerFocus ? tickerFocus.ticker : state.selectedTicker;
  const focusCitations = focusTicker ? citations.filter((citation) => citation.ticker === focusTicker) : citations;
  const mismatches = focusTicker && !compareMode
    ? citations.filter((citation) => citation.ticker !== focusTicker)
    : [];
  const syntheticCount = citations.filter((citation) => normalizeSourceStatus(citation.sourceStatus) === "synthetic").length;
  const docs = new Set(citations.map((citation) => citation.docId)).size;
  const types = new Set(citations.map((citation) => citation.type)).size;
  const sourceQuality = citations.reduce((sum, citation) => {
    const status = normalizeSourceStatus(citation.sourceStatus);
    if (status === "real") return sum + 12;
    if (status === "imported") return sum + 8;
    return sum + 4;
  }, 0);
  const focusRatio = citations.length ? focusCitations.length / citations.length : 1;
  let score = 45 + docs * 5 + types * 6 + sourceQuality / Math.max(citations.length, 1) + Math.round(focusRatio * 24) - mismatches.length * 18;
  if (state.onlySelectedTicker && focusTicker && !compareMode && mismatches.length === 0) score += 8;
  if (compareMode) score += Math.min(new Set(citations.map((citation) => citation.ticker)).size * 4, 12);
  score = Math.max(18, Math.min(98, Math.round(score)));
  const qualityClass = mismatches.length ? "is-warning" : syntheticCount ? "is-mixed" : score >= 78 ? "is-strong" : "is-mixed";
  const label = mismatches.length ? "Check citations" : syntheticCount ? "SYN review needed" : score >= 78 ? "Strong guard" : "Adequate guard";
  const message = compareMode
    ? "The question is explicitly comparative, so multiple tickers are allowed in the evidence stack."
    : state.onlySelectedTicker && focusTicker
      ? `Single-company guard is active for ${focusTicker}.`
      : "Single-company guard is relaxed, so the answer can draw from the enabled coverage universe.";
  return {
    compareMode,
    focusTicker,
    mismatches,
    syntheticCount,
    score,
    label,
    qualityClass,
    message
  };
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
  const status = normalizeSourceStatus(citation.sourceStatus);
  const statusText = status === "synthetic"
    ? "SYN demo evidence"
    : status === "imported"
      ? "Imported evidence"
      : "REAL evidence";
  return `${escapeHtml(statusText)} from ${escapeHtml(citation.company)} ${escapeHtml(citation.type)} links ${escapeHtml(intent.label.toLowerCase())} to ${escapeHtml(snippet(citation.text, 170))}.${metricPhrase}`;
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

function isExplicitCompareQuestion(question) {
  const lower = question.toLowerCase();
  const mentionedTickers = getMentionedTickers(question);
  return mentionedTickers.size > 1 || /compare|versus|\bvs\b|which company|which bank|better|best|rank|peer/i.test(lower);
}

function getMentionedTickers(question) {
  const text = String(question || "");
  const lower = text.toLowerCase();
  const mentioned = new Set(getCompanies()
    .filter((company) => lower.includes(company.ticker.toLowerCase()) || lower.includes(company.name.toLowerCase()))
    .map((company) => company.ticker));
  const cashTags = text.match(/\$([A-Z][A-Z0-9.]{0,11})\b/gi) || [];
  cashTags.forEach((tag) => {
    const rawTicker = normalizeTicker(tag.slice(1));
    const company = getCompany(rawTicker) || getCompany(PUBLIC_TICKER_ALIASES[rawTicker]?.ticker);
    if (company) mentioned.add(company.ticker);
  });
  return mentioned;
}

function getEnabledDocs() {
  return state.documents.filter((doc) => state.enabledDocIds.has(doc.id) && state.activeTickers.has(doc.ticker));
}

function rebuildDocumentCorpus() {
  state.documents = [...SAMPLE_DOCS, ...state.sourcePackDocs, ...state.uploadedDocs];
  state.enabledDocIds = new Set(state.documents.map((doc) => doc.id));
  if (!getCompanies().some((company) => company.ticker === state.selectedTicker)) {
    state.selectedTicker = getCompanies()[0]?.ticker || "";
  }
  renderCoverage();
  renderLibrary();
  renderImportTickerOptions();
  renderSourceBuilderTickerOptions();
  renderSourceMatrixOptions();
  renderSourceMatrix();
  renderRealSourceStarterPack();
  renderSourceQueueOptions();
  renderSourceQueue();
  renderSourceHubOptions();
  renderSourceHub();
  renderSourceWorkspace();
  renderContextBand();
  renderValuationOptions();
  renderCompanyDossier();
  updateValuationFromCompany();
  updateValuation();
  drawSignalMap();
}

function getCompanyDocs(ticker) {
  return state.documents.filter((doc) => doc.ticker === ticker);
}

function sourceMixForDocs(docs) {
  if (!docs.length) return "";
  const counts = docs.reduce((groups, doc) => {
    const label = shortDocType(doc.type);
    groups[label] = (groups[label] || 0) + 1;
    return groups;
  }, {});
  return Object.entries(counts)
    .map(([label, count]) => `${label} ${count}`)
    .join(" | ");
}

function sourceStatusSummary(docs) {
  if (!docs.length) return "";
  const counts = docs.reduce((groups, doc) => {
    const label = shortSourceStatus(doc);
    groups[label] = (groups[label] || 0) + 1;
    return groups;
  }, {});
  return Object.entries(counts)
    .map(([label, count]) => `${label} ${count}`)
    .join(" | ");
}

function makeRealDataChecklist(docs) {
  return REAL_SOURCE_REQUIREMENTS.map((requirement) => {
    const status = getRequirementStatus(docs, requirement);
    return { ...requirement, status: status.statusLabel, statusKey: status.statusKey, className: status.className, doc: status.doc };
  });
}

function makeRealSourceCompleteness(checklist) {
  const total = checklist.length || 1;
  const realCount = checklist.filter((item) => item.statusKey === "real").length;
  const reviewCount = checklist.filter((item) => item.statusKey === "imported").length;
  const starterCount = checklist.filter((item) => item.statusKey === "synthetic").length;
  const missingCount = checklist.filter((item) => item.statusKey === "missing").length;
  const percent = Math.round((realCount / total) * 100);
  const next = checklist.find((item) => item.statusKey === "missing")
    || checklist.find((item) => item.statusKey === "synthetic")
    || checklist.find((item) => item.statusKey === "imported")
    || checklist[0];
  const summary = [
    `${realCount}/${total} REAL`,
    reviewCount ? `${reviewCount} imported review` : "",
    starterCount ? `${starterCount} SYN starter` : "",
    missingCount ? `${missingCount} missing` : ""
  ].filter(Boolean).join(" | ");
  return {
    percent,
    nextKey: next ? next.key : "annual-report",
    summary: summary || "All required source types are marked REAL."
  };
}

function normalizeSourceStatus(value) {
  const status = String(value || "").toLowerCase();
  if (status === "real" || status === "verified") return "real";
  if (status === "imported" || status === "user") return "imported";
  return "synthetic";
}

function sourceStatusClass(doc) {
  return `source-${normalizeSourceStatus(doc && doc.sourceStatus)}`;
}

function shortSourceStatus(doc) {
  const status = normalizeSourceStatus(doc && doc.sourceStatus);
  if (status === "real") return "REAL";
  if (status === "imported") return "IMP";
  return "SYN";
}

function sourceStatusLabel(doc) {
  const status = normalizeSourceStatus(doc && doc.sourceStatus);
  if (status === "real") return doc.sourceLabel || "Real source";
  if (status === "imported") return doc.sourceLabel || "Imported source";
  return doc.sourceLabel || "Synthetic starter evidence";
}

function defaultSourceLabel(status) {
  const normalized = normalizeSourceStatus(status);
  if (normalized === "real") return "Real source";
  if (normalized === "imported") return "Imported source";
  return "Synthetic starter evidence";
}

function getCompanies() {
  const byTicker = new Map(SAMPLE_COMPANIES.map((company) => [company.ticker, { ...company }]));
  for (const doc of [...state.sourcePackDocs, ...state.uploadedDocs]) {
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
  return {
    ticker: company.ticker,
    company: company.name,
    revenueGrowth: Math.round(revenueGrowth * 100),
    fcfMargin: Math.round(fcfMargin * 100),
    terminalMultiple,
    discountRate: Math.round(discountRate * 100),
    equityValue: Math.max(equityValue, 0),
    perShare: Math.max(perShare, 0)
  };
}

function saveValuationCase() {
  const snapshot = updateValuation();
  if (!snapshot) return;
  const valuationCase = {
    id: `case-${Date.now()}`,
    ...snapshot,
    date: new Date().toLocaleString()
  };
  state.valuationCases = [valuationCase, ...state.valuationCases].slice(0, 8);
  saveJson(STORAGE_KEYS.valuationCases, state.valuationCases);
  renderValuationCases();
  flashButtonLabel(els.saveValuationCase, "Saved");
}

function renderValuationCases() {
  if (!els.valuationCaseList) return;
  if (!state.valuationCases.length) {
    els.valuationCaseList.innerHTML = `<div class="empty-list">Saved valuation cases will appear here.</div>`;
    return;
  }
  els.valuationCaseList.innerHTML = state.valuationCases.map((valuationCase) => `
    <button class="case-card" type="button" data-case-id="${escapeAttr(valuationCase.id)}">
      <span>${escapeHtml(valuationCase.ticker)} case</span>
      <strong>Rs ${escapeHtml(valuationCase.perShare.toFixed(0))}</strong>
      <em>${escapeHtml(valuationCase.revenueGrowth)}% growth, ${escapeHtml(valuationCase.fcfMargin)}% FCF, ${escapeHtml(valuationCase.terminalMultiple)}x</em>
    </button>
  `).join("");

  els.valuationCaseList.querySelectorAll(".case-card").forEach((button) => {
    button.addEventListener("click", () => {
      const valuationCase = state.valuationCases.find((item) => item.id === button.dataset.caseId);
      if (!valuationCase) return;
      state.selectedTicker = valuationCase.ticker;
      renderValuationOptions();
      els.growthSlider.value = String(valuationCase.revenueGrowth);
      els.marginSlider.value = String(valuationCase.fcfMargin);
      els.multipleSlider.value = String(valuationCase.terminalMultiple);
      els.discountSlider.value = String(valuationCase.discountRate);
      updateValuation();
      renderCompanyDossier();
      drawSignalMap();
    });
  });
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

  const activeCompanies = getCompanies().filter((company) => state.activeTickers.has(company.ticker));
  const selectedCompany = activeCompanies.find((company) => company.ticker === state.selectedTicker);
  const companies = activeCompanies.slice(0, 6);
  if (selectedCompany && !companies.some((company) => company.ticker === selectedCompany.ticker)) {
    companies.splice(Math.max(companies.length - 1, 0), 1, selectedCompany);
  }
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
  els.notebookList.innerHTML = state.notes.map((note) => {
    const meta = noteMeta(note);
    return `
    <article class="note-card ${meta.mismatchCount ? "is-warning" : ""}">
      <span><b>${escapeHtml(meta.ticker)}</b><b>${escapeHtml(meta.date)}</b></span>
      <strong>${escapeHtml(note.title)}</strong>
      <div class="note-quality-row">
        <em>${escapeHtml(meta.intentLabel)}</em>
        <em>${escapeHtml(meta.confidenceText)}</em>
        <em>${escapeHtml(meta.qualityText)}</em>
        ${meta.guarded ? `<em>Guarded</em>` : ""}
      </div>
      <p>${escapeHtml(snippet(note.body, 220))}</p>
      <div class="note-actions">
        <button type="button" data-note-open="${escapeAttr(note.id)}">Open</button>
        <button type="button" data-note-pdf="${escapeAttr(note.id)}">PDF</button>
        <button type="button" data-note-delete="${escapeAttr(note.id)}">Delete</button>
      </div>
    </article>
  `;
  }).join("");

  els.notebookList.querySelectorAll("button[data-note-open]").forEach((button) => {
    button.addEventListener("click", () => openSavedBrief(button.dataset.noteOpen));
  });
  els.notebookList.querySelectorAll("button[data-note-pdf]").forEach((button) => {
    button.addEventListener("click", () => exportSavedBriefPdf(button.dataset.notePdf));
  });
  els.notebookList.querySelectorAll("button[data-note-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteSavedBrief(button.dataset.noteDelete));
  });
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
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);
  return copied;
}

async function copyTextToClipboard(text) {
  const safeText = String(text || "");
  if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
    try {
      await Promise.race([
        navigator.clipboard.writeText(safeText),
        new Promise((_, reject) => {
          window.setTimeout(() => reject(new Error("Clipboard write timed out.")), 900);
        })
      ]);
      return true;
    } catch (error) {
      return fallbackCopy(safeText);
    }
  }
  return fallbackCopy(safeText);
}

function saveCurrentBrief() {
  if (!state.lastBrief) return;
  if (!state.lastAnswerMeta && !state.currentCitations.length) {
    flashButtonLabel(els.saveBrief, "No brief");
    return;
  }
  const meta = state.lastAnswerMeta || inferBriefMetaFromText(state.lastBrief);
  if (meta.guarded && meta.mismatchCount > 0) {
    flashButtonLabel(els.saveBrief, "Guard blocked");
    return;
  }
  const title = `${meta.ticker} ${meta.intentLabel || "Research brief"} | ${meta.confidence || "NA"}% confidence`;
  const note = {
    id: `note-${Date.now()}`,
    title: stripHtml(title).slice(0, 120),
    body: state.lastBrief,
    intent: meta.ticker,
    ticker: meta.ticker,
    company: meta.company,
    confidence: meta.confidence || 0,
    evidenceQuality: meta.evidenceQuality || 0,
    qualityLabel: meta.qualityLabel || "",
    guarded: Boolean(meta.guarded),
    compareMode: Boolean(meta.compareMode),
    mismatchCount: meta.mismatchCount || 0,
    investmentReady: Boolean(meta.investmentReady),
    investmentReadinessLabel: meta.investmentReadinessLabel || "Unknown readiness",
    realSourceCount: meta.realSourceCount || 0,
    requiredSourceCount: meta.requiredSourceCount || REAL_SOURCE_REQUIREMENTS.length,
    nextRealSource: meta.nextRealSource || "Annual report",
    intentLabel: meta.intentLabel || "Research",
    citationCount: meta.citationCount || state.currentCitations.length,
    citations: meta.citations || [],
    date: new Date().toLocaleDateString(),
    createdAt: new Date().toISOString()
  };
  state.notes = [note, ...state.notes].slice(0, 10);
  saveJson(STORAGE_KEYS.notes, state.notes);
  renderNotebook();
  flashButtonLabel(els.saveBrief, "Saved");
}

function noteMeta(note) {
  const inferred = inferBriefMetaFromText(note.body || "");
  const ticker = note.ticker || inferred.ticker || note.intent || "Desk";
  const confidence = Number(note.confidence || inferred.confidence || 0);
  const evidenceQuality = Number(note.evidenceQuality || inferred.evidenceQuality || 0);
  return {
    ticker,
    company: note.company || inferred.company || ticker,
    date: note.date || (note.createdAt ? new Date(note.createdAt).toLocaleDateString() : ""),
    intentLabel: note.intentLabel || inferred.intentLabel || "Research",
    confidence,
    evidenceQuality,
    confidenceText: confidence ? `${confidence}% conf` : "No conf",
    qualityText: evidenceQuality ? `${evidenceQuality}% evidence` : "No quality",
    guarded: Boolean(note.guarded || inferred.guarded),
    mismatchCount: Number(note.mismatchCount || inferred.mismatchCount || 0),
    investmentReady: Boolean(note.investmentReady),
    investmentReadinessLabel: note.investmentReadinessLabel || "Unknown readiness",
    realSourceCount: Number(note.realSourceCount || 0),
    requiredSourceCount: Number(note.requiredSourceCount || REAL_SOURCE_REQUIREMENTS.length),
    nextRealSource: note.nextRealSource || "Annual report"
  };
}

function inferBriefMetaFromText(text) {
  const clean = String(text || "");
  const tickerLine = clean.match(/Ticker focus:\s*([A-Z][A-Z0-9.]*)/i);
  const qualityLine = clean.match(/Evidence quality:\s*(\d+)%\s*\(([^)]+)\)/i);
  const confidenceLine = clean.match(/\|\s*(\d+)%\s*confidence/i);
  const firstLine = clean.split("\n").find(Boolean) || "Research";
  const intentLabel = firstLine.split("|")[0]?.trim() || "Research";
  const ticker = tickerLine ? normalizeTicker(tickerLine[1]) : state.selectedTicker || "Desk";
  const company = getCompany(ticker);
  return {
    ticker,
    company: company ? company.name : ticker,
    intentLabel,
    confidence: confidenceLine ? Number(confidenceLine[1]) : 0,
    evidenceQuality: qualityLine ? Number(qualityLine[1]) : 0,
    qualityLabel: qualityLine ? qualityLine[2] : "",
    guarded: clean.includes("Single-company guard is active") || clean.includes("Evidence quality"),
    compareMode: clean.includes("explicitly comparative"),
    mismatchCount: clean.match(/off-ticker citation/) ? 1 : 0,
    citationCount: state.currentCitations.length
  };
}

function openSavedBrief(noteId) {
  const note = state.notes.find((item) => item.id === noteId);
  if (!note) return;
  const meta = noteMeta(note);
  state.lastBrief = note.body;
  state.lastAnswerMeta = {
    ...meta,
    question: note.title,
    ticker: meta.ticker,
    company: meta.company,
    qualityLabel: note.qualityLabel || "",
    qualityClass: meta.mismatchCount ? "is-warning" : "is-strong",
    citationCount: note.citationCount || 0,
    citations: note.citations || []
  };
  state.currentCitations = hydrateSavedBriefCitations(note);
  els.answerPanel.innerHTML = `
    <div class="answer-header saved-brief-header">
      <div>
        <div class="answer-kicker">Saved brief</div>
        <h2>${escapeHtml(note.title)}</h2>
      </div>
      <div class="confidence-box">
        <span>Confidence</span>
        <strong>${meta.confidence || 0}%</strong>
      </div>
      <div class="confidence-box evidence-quality-box ${meta.mismatchCount ? "is-warning" : "is-strong"}">
        <span>Evidence quality</span>
        <strong>${meta.evidenceQuality || 0}%</strong>
      </div>
    </div>
    <div class="answer-body">
      <section class="ticker-focus-card">
        <span>${meta.guarded ? "Guarded saved note" : "Saved note"}</span>
        <strong>${escapeHtml(meta.ticker)} - ${escapeHtml(meta.company)}</strong>
        <p>${escapeHtml(meta.mismatchCount ? "This saved brief was flagged for a citation mismatch." : "This saved brief is stored locally in this browser.")}</p>
      </section>
      <section class="answer-section saved-brief-detail">
        <h3>Brief text</h3>
        <pre>${escapeHtml(note.body)}</pre>
      </section>
    </div>
  `;
  renderEvidence(state.currentCitations);
  renderBriefWorkbench();
  renderInvestmentGate();
  renderMemoReviewRoom();
  renderDecisionJournal();
  renderReviewRadar();
  renderPortfolioWatchtower();
  renderCatalystCalendar();
  renderDailyBriefing();
  renderDeskTaskBoard();
  renderResearchSprintPlanner();
  renderIcMemoBuilder();
  renderClaimTraceInspector();
      renderAnswerQualityLab();
  renderLaunchControlRoom();
  els.answerPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function deleteSavedBrief(noteId) {
  state.notes = state.notes.filter((note) => note.id !== noteId);
  saveJson(STORAGE_KEYS.notes, state.notes);
  renderNotebook();
}

function hydrateSavedBriefCitations(note) {
  const saved = Array.isArray(note.citations) ? note.citations : [];
  return saved.map((citation, index) => ({
    citationId: citation.citationId || `C${index + 1}`,
    ticker: normalizeTicker(citation.ticker || note.ticker || note.intent || "DESK"),
    company: citation.company || note.company || note.ticker || "Saved brief",
    type: citation.type || "Saved source",
    period: citation.period || "",
    section: citation.section || "Saved evidence",
    text: citation.text || snippet(note.body || "", 260),
    sourceStatus: citation.sourceStatus || "imported",
    score: Number(citation.score || 0)
  }));
}

function exportSavedBriefPdf(noteId) {
  const note = state.notes.find((item) => item.id === noteId);
  if (!note) return;
  const meta = noteMeta(note);
  const citations = hydrateSavedBriefCitations(note);
  const date = new Date().toISOString().slice(0, 10);
  const filename = `niveshscope-${String(meta.ticker || "desk").toLowerCase()}-saved-brief-${date}.pdf`;
  const pdfBytes = buildNiveshPdfBrief({
    body: note.body,
    meta: {
      ...meta,
      question: note.title,
      ticker: meta.ticker,
      company: meta.company,
      qualityLabel: note.qualityLabel || "",
      citationCount: note.citationCount || citations.length
    },
    citations,
    title: note.title,
    saved: true
  });
  downloadBinaryFile(filename, pdfBytes, "application/pdf");
}

function exportCurrentBrief() {
  if (!state.lastBrief) return;
  const meta = state.lastAnswerMeta || inferBriefMetaFromText(state.lastBrief);
  const gate = makeInvestmentGateAudit();
  const ticker = meta.ticker || state.selectedTicker;
  const date = new Date().toISOString().slice(0, 10);
  const filename = `niveshscope-${String(ticker || "desk").toLowerCase()}-brief-${date}.md`;
  const evidence = state.currentCitations.length
    ? state.currentCitations.map((citation) => {
        return `### ${citation.citationId} - ${citation.company} ${citation.type} (${citation.period})\n\nSource quality: ${sourceStatusLabel(citation)}\n\n${citation.section}: ${citation.text}`;
      }).join("\n\n")
    : "No evidence stack available. Run an analysis first.";
  const content = [
    "# NiveshScope Research Brief",
    "",
    state.lastBrief,
    "",
    "## Investment Readiness Gate",
    "",
    makeInvestmentGateMarkdown(gate),
    "",
    "## Evidence Stack",
    "",
    evidence,
    "",
    "_Synthetic demo corpus for product prototyping. Import source documents before using the workflow for live investment research._"
  ].join("\n");

  downloadTextFile(filename, content, "text/markdown;charset=utf-8");
  flashButtonLabel(els.exportBrief, "Saved");
}

function exportPdfBrief() {
  if (!state.lastBrief) {
    flashButtonLabel(els.exportPdfBrief, "Run first");
    return;
  }
  const meta = state.lastAnswerMeta || inferBriefMetaFromText(state.lastBrief);
  const gate = makeInvestmentGateAudit();
  const ticker = meta.ticker || state.selectedTicker || "desk";
  const date = new Date().toISOString().slice(0, 10);
  const filename = `niveshscope-${String(ticker || "desk").toLowerCase()}-brief-${date}.pdf`;
  const pdfBytes = buildNiveshPdfBrief({
    body: state.lastBrief,
    meta: {
      ...meta,
      investmentGateStatus: gate.statusLabel,
      investmentGateScore: gate.score,
      exportPosture: gate.exportLabel,
      readinessBlocker: gate.requiredBlockers[0]?.label || ""
    },
    citations: state.currentCitations,
    title: makePdfReportTitle(meta, state.lastBrief)
  });
  downloadBinaryFile(filename, pdfBytes, "application/pdf");
  flashButtonLabel(els.exportPdfBrief, "Saved");
}

function downloadTextFile(filename, content, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function downloadBinaryFile(filename, bytes, type = "application/octet-stream") {
  const blob = new Blob([bytes], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function buildNiveshPdfBrief({ body, meta, citations, title, saved = false }) {
  return createNiveshPdf(buildNiveshPdfBlocks({ body, meta, citations, title, saved }));
}

function buildNiveshPdfBlocks({ body, meta, citations, title, saved }) {
  const safeMeta = meta || inferBriefMetaFromText(body);
  const sourceRows = (citations || []).slice(0, 6).map((citation) => ({
    id: citation.citationId || "C",
    source: `${sourceStatusLabel(citation)} | ${citation.company || citation.ticker || "Source"} | ${citation.type || "Evidence"} ${citation.period ? `| ${citation.period}` : ""}`,
    section: citation.section || "Evidence",
    score: Number(citation.score || 0).toFixed(1),
    text: citation.text || ""
  }));
  const blocks = [
    {
      type: "cover",
      eyebrow: saved ? "NiveshScope saved memo" : "NiveshScope research memo",
      title: title || makePdfReportTitle(safeMeta, body),
      subtitle: "Evidence-backed Indian equity research across disclosures, concalls, exchange filings, and valuation read-through.",
      generatedAt: new Date().toLocaleString()
    },
    {
      type: "snapshot",
      items: [
        { label: "Focus", value: `${safeMeta.ticker || "Desk"} - ${safeMeta.company || "Research desk"}` },
        { label: "Confidence", value: `${safeMeta.confidence || 0}%` },
        { label: "Evidence", value: `${safeMeta.evidenceQuality || 0}% ${safeMeta.qualityLabel || "quality"}` },
        { label: "Sources", value: `${safeMeta.citationCount || sourceRows.length || 0} citations | ${safeMeta.investmentReadinessLabel || "Prototype evidence only"}` },
        { label: "Gate", value: `${safeMeta.investmentGateStatus || "Not checked"}${safeMeta.investmentGateScore ? ` | ${safeMeta.investmentGateScore}%` : ""}` }
      ]
    },
    { type: "audit", text: makeNiveshPdfAuditLine(safeMeta) },
    { type: "heading", text: "Research brief" }
  ];

  splitPdfBriefBody(body).forEach((paragraph, index) => {
    blocks.push({
      type: index === 0 ? "callout" : "paragraph",
      text: paragraph
    });
  });

  if (sourceRows.length) {
    blocks.push({ type: "heading", text: "Evidence pack" });
    blocks.push({ type: "sourceTable", rows: sourceRows });
  }

  blocks.push({
    type: "footnote",
    text: "NiveshScope is research software, not investment advice. Starter SYN sources are demo evidence until replaced with verified company, exchange, or investor-relations documents."
  });
  return blocks;
}

function makePdfReportTitle(meta, body) {
  const firstBriefLine = String(body || "")
    .split(/\n/)
    .map((line) => line.trim())
    .find((line) => line && !/^(Evidence quality|Management tone|Ticker focus):/i.test(line));
  if (meta && meta.question) return meta.question;
  if (meta && meta.ticker && meta.intentLabel) return `${meta.ticker} ${meta.intentLabel}`;
  return firstBriefLine || "NiveshScope research brief";
}

function makeNiveshPdfAuditLine(meta) {
  const pieces = [
    `${meta.evidenceQuality || 0}/100 evidence quality`,
    `${meta.confidence || 0}% confidence`,
    meta.guarded ? "single-company guard active" : "multi-company or saved mode",
    meta.investmentReady ? "investment-use ready" : `${meta.realSourceCount || 0}/${meta.requiredSourceCount || REAL_SOURCE_REQUIREMENTS.length} REAL source types`,
    meta.investmentGateStatus ? `gate ${meta.investmentGateStatus}${meta.readinessBlocker ? `, blocker ${meta.readinessBlocker}` : ""}` : "",
    meta.syntheticCount ? `${meta.syntheticCount} SYN citations` : "",
    meta.mismatchCount ? `${meta.mismatchCount} off-ticker citation warning` : ""
  ].filter(Boolean);
  return `Source guard: ${pieces.join(" | ")}.`;
}

function splitPdfBriefBody(body) {
  const text = String(body || "")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (!text) return ["No report text is available. Run an analysis before exporting a PDF."];
  const paragraphs = text.split(/\n{2,}/)
    .map((part) => part.replace(/\n/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 14);
  return paragraphs.length ? paragraphs : [text];
}

function createNiveshPdf(blocks) {
  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 54;
  const bottom = 54;
  const maxWidth = pageWidth - margin * 2;
  const pages = [[]];
  let y = pageHeight - margin;

  const currentPage = () => pages[pages.length - 1];
  const newPage = () => {
    pages.push([]);
    y = pageHeight - margin;
  };
  const ensureSpace = (height) => {
    if (y - height < bottom) newPage();
  };
  const addFillRect = (x, rectY, width, height, color = "0.98 0.99 0.98") => {
    currentPage().push(`q ${color} rg ${x} ${rectY} ${width} ${height} re f Q`);
  };
  const addStrokeRect = (x, rectY, width, height, color = "0.83 0.87 0.84", lineWidth = 0.6) => {
    currentPage().push(`q ${color} RG ${lineWidth} w ${x} ${rectY} ${width} ${height} re S Q`);
  };
  const addTextLine = (text, x, textY, options = {}) => {
    const size = options.size || 10;
    const font = options.font || "F1";
    const color = options.color || "0.06 0.09 0.08";
    currentPage().push(`q ${color} rg BT /${font} ${size} Tf 0 Tw ${x} ${textY} Td (${pdfEscape(text)}) Tj ET Q`);
  };
  const addWrappedAt = (text, x, startY, width, options = {}) => {
    const size = options.size || 10;
    const font = options.font || "F1";
    const leading = options.leading || Math.ceil(size * 1.35);
    const color = options.color || "0.16 0.21 0.19";
    const chars = Math.max(18, Math.floor(width / (size * 0.52)));
    const lines = wrapPdfText(text, chars).slice(0, options.maxLines || 30);
    let localY = startY;
    lines.forEach((line, index) => {
      const justify = Boolean(options.justify && index < lines.length - 1 && line.split(" ").length > 4);
      const wordSpacing = justify ? computePdfWordSpacing(line, size, width) : 0;
      currentPage().push(`q ${color} rg BT /${font} ${size} Tf ${wordSpacing.toFixed(3)} Tw ${x} ${localY} Td (${pdfEscape(line)}) Tj ET Q`);
      localY -= leading;
    });
    return localY;
  };
  const addText = (text, options = {}) => {
    const size = options.size || 10.5;
    const font = options.font || "F1";
    const leading = options.leading || Math.ceil(size * 1.35);
    const indent = options.indent || 0;
    const gapBefore = options.gapBefore || 0;
    const gapAfter = options.gapAfter || 0;
    const chars = Math.max(24, Math.floor((maxWidth - indent) / (size * 0.52)));
    const lines = wrapPdfText(text, chars);
    ensureSpace(gapBefore + lines.length * leading + gapAfter + 4);
    y -= gapBefore;
    lines.forEach((line, lineIndex) => {
      const justify = Boolean(options.justify && lineIndex < lines.length - 1 && line.split(" ").length > 4);
      const wordSpacing = justify ? computePdfWordSpacing(line, size, maxWidth - indent) : 0;
      currentPage().push(`BT /${font} ${size} Tf ${wordSpacing.toFixed(3)} Tw ${margin + indent} ${y} Td (${pdfEscape(line)}) Tj ET`);
      y -= leading;
    });
    y -= gapAfter;
  };
  const addCover = (block) => {
    ensureSpace(112);
    addFillRect(margin, y - 84, maxWidth, 88, "0.91 0.97 0.95");
    addStrokeRect(margin, y - 84, maxWidth, 88, "0.32 0.63 0.55", 0.8);
    addFillRect(margin + 16, y - 50, 34, 34, "0.06 0.09 0.08");
    addTextLine("NS", margin + 23, y - 37, { size: 11, font: "F2", color: "0.95 0.62 0.24" });
    addTextLine(block.eyebrow, margin + 62, y - 18, { size: 9, font: "F2", color: "0.03 0.39 0.34" });
    const afterTitle = addWrappedAt(block.title, margin + 62, y - 36, maxWidth - 84, { size: 18, font: "F2", leading: 21, color: "0.06 0.09 0.08", maxLines: 2 });
    addWrappedAt(block.subtitle, margin + 62, afterTitle - 3, maxWidth - 84, { size: 9.5, leading: 12, color: "0.39 0.45 0.42", maxLines: 2 });
    addTextLine(`Generated ${block.generatedAt}`, pageWidth - margin - 154, y - 70, { size: 8, color: "0.39 0.45 0.42" });
    y -= 104;
  };
  const addSnapshot = (block) => {
    ensureSpace(76);
    const gap = 8;
    const cardWidth = (maxWidth - gap * 3) / 4;
    const cardHeight = 56;
    block.items.forEach((item, index) => {
      const x = margin + index * (cardWidth + gap);
      addFillRect(x, y - cardHeight, cardWidth, cardHeight, "0.98 0.99 0.98");
      addStrokeRect(x, y - cardHeight, cardWidth, cardHeight, "0.83 0.87 0.84", 0.6);
      addTextLine(item.label, x + 9, y - 16, { size: 7.5, font: "F2", color: "0.39 0.45 0.42" });
      addWrappedAt(item.value, x + 9, y - 31, cardWidth - 18, { size: 10.5, font: "F2", leading: 12, maxLines: 2, color: "0.06 0.09 0.08" });
    });
    y -= cardHeight + 12;
  };
  const addAuditBand = (text) => {
    ensureSpace(38);
    addFillRect(margin, y - 28, maxWidth, 30, "0.89 0.96 0.94");
    addStrokeRect(margin, y - 28, maxWidth, 30, "0.49 0.74 0.67", 0.6);
    addTextLine("SOURCE GUARD", margin + 10, y - 11, { size: 7.5, font: "F2", color: "0.03 0.39 0.34" });
    addWrappedAt(text.replace(/^Source guard:\s*/i, ""), margin + 92, y - 11, maxWidth - 104, { size: 9, font: "F2", leading: 11, maxLines: 2, color: "0.06 0.09 0.08" });
    y -= 42;
  };
  const addCallout = (text) => {
    const size = 10.25;
    const chars = Math.max(24, Math.floor((maxWidth - 24) / (size * 0.52)));
    const lines = wrapPdfText(text, chars);
    const height = Math.max(48, 22 + lines.length * 14);
    ensureSpace(height + 4);
    addFillRect(margin, y - height, maxWidth, height, "0.98 0.99 0.98");
    addStrokeRect(margin, y - height, maxWidth, height, "0.83 0.87 0.84", 0.6);
    addWrappedAt(text, margin + 12, y - 18, maxWidth - 24, { size, leading: 14, justify: true, maxLines: 16 });
    y -= height + 6;
  };
  const addSourceTable = (block) => {
    if (!block.rows.length) return;
    const rows = block.rows.slice(0, 6);
    const gap = 8;
    const cardWidth = (maxWidth - gap) / 2;
    const cardHeight = 62;
    const rowCount = Math.ceil(rows.length / 2);
    ensureSpace(30 + rowCount * cardHeight + Math.max(0, rowCount - 1) * gap + 8);
    addFillRect(margin, y - 22, maxWidth, 22, "0.06 0.09 0.08");
    addTextLine("SOURCE STACK", margin + 9, y - 14, { size: 7.5, font: "F2", color: "1 1 1" });
    addTextLine(`${rows.length} passages`, pageWidth - margin - 82, y - 14, { size: 7.2, font: "F2", color: "1 1 1" });
    y -= 30;
    rows.forEach((row, index) => {
      const column = index % 2;
      const rowIndex = Math.floor(index / 2);
      const x = margin + column * (cardWidth + gap);
      const top = y - rowIndex * (cardHeight + gap);
      addFillRect(x, top - cardHeight, cardWidth, cardHeight, "1 1 1");
      addStrokeRect(x, top - cardHeight, cardWidth, cardHeight, "0.83 0.87 0.84", 0.45);
      addFillRect(x + 8, top - 22, 26, 15, "0.89 0.96 0.94");
      addTextLine(row.id, x + 14, top - 17, { size: 7.5, font: "F2", color: "0.03 0.39 0.34" });
      addWrappedAt(`${row.score} | ${snippet(row.source, 38)}`, x + 42, top - 14, cardWidth - 52, { size: 7.4, font: "F2", leading: 9, maxLines: 1 });
      addWrappedAt(snippet(row.section, 58), x + 9, top - 34, cardWidth - 18, { size: 7.8, leading: 9, maxLines: 1, color: "0.16 0.21 0.19" });
      addWrappedAt(snippet(row.text, 112), x + 9, top - 48, cardWidth - 18, { size: 7.1, leading: 8.3, maxLines: 1, color: "0.39 0.45 0.42" });
    });
    y -= rowCount * cardHeight + Math.max(0, rowCount - 1) * gap + 8;
  };

  blocks.forEach((block, index) => {
    if (block.type === "cover") addCover(block);
    else if (block.type === "snapshot") addSnapshot(block);
    else if (block.type === "audit") addAuditBand(block.text);
    else if (block.type === "callout") addCallout(block.text);
    else if (block.type === "sourceTable") addSourceTable(block);
    else if (block.type === "heading") {
      addText(block.text, { size: 13, font: "F2", leading: 16, gapBefore: index ? 9 : 0, gapAfter: 2 });
      currentPage().push(`0.83 0.87 0.84 RG 0.5 w ${margin} ${y + 4} m ${pageWidth - margin} ${y + 4} l S`);
    } else if (block.type === "footnote") addText(block.text, { size: 8.1, font: "F1", leading: 10, gapBefore: 6, justify: true });
    else addText(block.text, { size: 10.25, font: "F1", leading: 14, gapAfter: 4, justify: true });
  });

  decorateNiveshPdfPages(pages, pageWidth, pageHeight, margin);
  return encodePdf(pages, pageWidth, pageHeight);
}

function decorateNiveshPdfPages(pages, pageWidth, pageHeight, margin) {
  pages.forEach((commands, index) => {
    commands.unshift(
      `0.03 0.39 0.34 RG 0.8 w ${margin} ${pageHeight - 36} m ${pageWidth - margin} ${pageHeight - 36} l S`,
      `BT /F2 8 Tf 0 Tw ${margin} ${pageHeight - 27} Td (NiveshScope Research Memo) Tj ET`
    );
    commands.push(
      `0.83 0.87 0.84 RG 0.5 w ${margin} 36 m ${pageWidth - margin} 36 l S`,
      `BT /F1 8 Tf 0 Tw ${margin} 24 Td (Research software - not investment advice) Tj ET`,
      `BT /F1 8 Tf 0 Tw ${pageWidth - margin - 42} 24 Td (Page ${index + 1}/${pages.length}) Tj ET`
    );
  });
}

function encodePdf(pages, pageWidth, pageHeight) {
  const objects = [];
  const pageObjectNumbers = [];
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push("");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

  pages.forEach((commands) => {
    const pageNumber = objects.length + 1;
    const contentNumber = pageNumber + 1;
    pageObjectNumbers.push(pageNumber);
    const content = commands.join("\n");
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentNumber} 0 R >>`);
    objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  });

  objects[1] = `<< /Type /Pages /Kids [${pageObjectNumbers.map((number) => `${number} 0 R`).join(" ")}] /Count ${pageObjectNumbers.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const bytes = new Uint8Array(pdf.length);
  for (let index = 0; index < pdf.length; index += 1) {
    bytes[index] = pdf.charCodeAt(index);
  }
  return bytes;
}

function wrapPdfText(text, maxChars) {
  const words = pdfPlainText(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  words.forEach((word) => {
    if (word.length > maxChars) {
      if (line) {
        lines.push(line);
        line = "";
      }
      for (let index = 0; index < word.length; index += maxChars) {
        lines.push(word.slice(index, index + maxChars));
      }
      return;
    }
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function computePdfWordSpacing(line, size, width) {
  const spaces = (line.match(/ /g) || []).length;
  if (!spaces) return 0;
  const estimatedWidth = estimatePdfTextWidth(line, size);
  const extra = width - estimatedWidth;
  if (extra <= 0 || extra > 48) return 0;
  return Math.min(5.5, extra / spaces);
}

function estimatePdfTextWidth(text, size) {
  return pdfPlainText(text).split("").reduce((sum, char) => {
    if (char === " ") return sum + size * 0.27;
    if (/[il.,:;|'`]/.test(char)) return sum + size * 0.23;
    if (/[mwMW]/.test(char)) return sum + size * 0.78;
    if (/[A-Z]/.test(char)) return sum + size * 0.58;
    if (/[0-9$%]/.test(char)) return sum + size * 0.52;
    return sum + size * 0.48;
  }, 0);
}

function pdfPlainText(value) {
  return String(value || "")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pdfEscape(value) {
  return pdfPlainText(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
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
  if (!files.length) return;
  const fallbackTicker = normalizeTicker(els.pasteTicker.value || els.importTickerSelect.value || state.selectedTicker);
  const fallbackType = els.pasteType.value || "Research note";
  const fileList = Array.from(files);
  const totalBytes = fileList.reduce((sum, file) => sum + Number(file.size || 0), 0);
  if (totalBytes > MAX_IMPORT_TOTAL_BYTES) {
    state.importReport = makeImportReport([], [{
      name: "Upload batch",
      reason: `Total upload size exceeds ${formatBytes(MAX_IMPORT_TOTAL_BYTES)}`
    }]);
    renderImportSummary();
    return;
  }
  const oversized = fileList
    .filter((file) => Number(file.size || 0) > MAX_IMPORT_FILE_BYTES)
    .map((file) => ({
      name: file.name,
      reason: `File exceeds ${formatBytes(MAX_IMPORT_FILE_BYTES)} limit`
    }));
  const eligibleFiles = fileList.filter((file) => Number(file.size || 0) <= MAX_IMPORT_FILE_BYTES);
  const results = await Promise.all(eligibleFiles.map((file) => readUploadedFile(file, fallbackTicker, fallbackType)));
  const docs = results.filter((result) => result.doc).map((result) => result.doc);
  const skipped = [
    ...oversized,
    ...results.filter((result) => result.error).map((result) => result.error)
  ];
  const added = addUploadedDocs(docs);
  state.importReport = makeImportReport(added, skipped);
  renderImportSummary();
}

function readUploadedFile(file, fallbackTicker = "CUSTOM", fallbackType = "Research note") {
  if (Number(file.size || 0) > MAX_IMPORT_FILE_BYTES) {
    return Promise.resolve({
      error: { name: file.name, reason: `File exceeds ${formatBytes(MAX_IMPORT_FILE_BYTES)} limit` }
    });
  }
  if (!isSupportedImport(file.name)) {
    return Promise.resolve({
      error: { name: file.name, reason: "Unsupported file type" }
    });
  }
  return /\.pdf$/i.test(file.name) ? readPdfFile(file, fallbackTicker, fallbackType) : readTextFile(file, fallbackTicker, fallbackType);
}

function readTextFile(file, fallbackTicker, fallbackType) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "").slice(0, MAX_SOURCE_TEXT_CHARS);
      if (text.replace(/\s+/g, "").length < 80) {
        resolve({ error: { name: file.name, reason: "No readable text found" } });
        return;
      }
      resolve({
        doc: makeUploadedDoc({
          ticker: inferTickerFromName(file.name) || fallbackTicker || "CUSTOM",
          title: file.name.replace(/\.[^.]+$/, ""),
          type: inferTypeFromName(file.name) || fallbackType,
          text
        })
      });
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

function readPdfFile(file, fallbackTicker, fallbackType) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = extractPdfText(reader.result).slice(0, MAX_SOURCE_TEXT_CHARS);
      if (text.replace(/\s+/g, "").length < 120) {
        resolve({
          error: {
            name: file.name,
            reason: "PDF text could not be extracted in-browser"
          }
        });
        return;
      }
      resolve({
        doc: makeUploadedDoc({
          ticker: inferTickerFromName(file.name) || fallbackTicker || "CUSTOM",
          title: file.name.replace(/\.[^.]+$/, ""),
          type: inferTypeFromName(file.name) || fallbackType,
          text
        })
      });
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

function isSupportedImport(name) {
  return /\.(txt|md|csv|html|json|pdf)$/i.test(name);
}

function formatBytes(bytes) {
  const value = Number(bytes || 0);
  if (value >= 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1).replace(/\.0$/, "")} MB`;
  if (value >= 1024) return `${(value / 1024).toFixed(1).replace(/\.0$/, "")} KB`;
  return `${value} bytes`;
}

function makeUploadedDoc({ ticker, title, type, text }) {
  const safeTicker = normalizeTicker(ticker);
  const cleanTitle = String(title || "Imported document").trim().slice(0, 90);
  const cleanText = String(text || "")
    .slice(0, MAX_SOURCE_TEXT_CHARS)
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return {
    id: `upload-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    ticker: safeTicker,
    company: inferCompanyName(safeTicker, cleanTitle, cleanText),
    type: String(type || "Research note"),
    period: cleanTitle,
    date: new Date().toISOString().slice(0, 10),
    sourceStatus: "imported",
    sourceLabel: "Imported by user",
    sourceUrl: "",
    sections: splitImportedText(cleanText)
  };
}

function addUploadedDocs(docs) {
  const filtered = docs.filter((doc) => doc.sections.some((section) => section.text.length > 30));
  if (!filtered.length) return [];
  state.uploadedDocs = [...filtered, ...state.uploadedDocs].slice(0, 18);
  rebuildDocumentCorpus();
  filtered.forEach((doc) => {
    state.enabledDocIds.add(doc.id);
    state.activeTickers.add(doc.ticker);
    updateProgressFromSourceDoc(doc);
  });
  if (!state.selectedTicker || state.selectedTicker === "RELIANCE" && filtered[0].ticker !== "RELIANCE") {
    state.selectedTicker = filtered[0].ticker;
  }
  saveJson(STORAGE_KEYS.uploads, state.uploadedDocs);
  renderCoverage();
  renderLibrary();
  renderImportTickerOptions();
  renderRealSourceStarterPack();
  renderContextBand();
  renderValuationOptions();
  renderCompanyDossier();
  updateValuationFromCompany();
  updateValuation();
  drawSignalMap();
  return filtered;
}

function splitImportedText(text) {
  if (!text) return [];
  const headingSections = sectionizeImportedText(text);
  if (headingSections.length > 1) {
    return headingSections.flatMap((section, sectionIndex) => {
      return splitIntoChunks(section.text, 950).map((chunk, chunkIndex) => ({
        title: chunkIndex ? `${section.title} ${chunkIndex + 1}` : section.title,
        text: chunk
      }));
    });
  }
  const normalized = text.replace(/\n+/g, " ");
  const sentences = normalized.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [normalized];
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

function sectionizeImportedText(text) {
  const lines = String(text || "")
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 8) return [];

  const sections = [];
  let current = { title: "Imported overview", text: "" };
  const headingPattern = /^(business overview|management discussion|management discussion and analysis|financial results|results review|risk factors?|liquidity|capital resources|shareholding|promoter|pledge|outlook|prepared remarks|analyst q&a|questions? and answers?|segment|valuation|cash flow|debt|notes to accounts)\b/i;

  for (const line of lines) {
    const isShortHeading = line.length <= 72 && (
      headingPattern.test(line) ||
      (/^[A-Z0-9 &/,-]{8,72}$/.test(line) && !/\d{4,}/.test(line))
    );
    if (isShortHeading && current.text.length > 180) {
      sections.push({ title: current.title, text: current.text.trim() });
      current = { title: titleCase(line), text: "" };
    } else if (isShortHeading && current.title === "Imported overview" && current.text.length < 40) {
      current.title = titleCase(line);
    } else {
      current.text = `${current.text} ${line}`.trim();
    }
  }
  if (current.text.length > 80) sections.push({ title: current.title, text: current.text.trim() });
  return sections;
}

function makeImportReport(addedDocs = [], skipped = []) {
  const sections = addedDocs.reduce((sum, doc) => sum + doc.sections.length, 0);
  const metrics = addedDocs.reduce((sum, doc) => {
    return sum + extractMetrics(doc.sections.map((section) => section.text).join(" ")).length;
  }, 0);
  const tickers = Array.from(new Set(addedDocs.map((doc) => doc.ticker)));
  return {
    added: addedDocs,
    skipped,
    sections: String(sections),
    metrics: String(metrics),
    tickers
  };
}

function extractPdfText(buffer) {
  const bytes = new Uint8Array(buffer || []);
  if (!bytes.length) return "";
  const decoder = new TextDecoder("latin1");
  const raw = decoder.decode(bytes);
  const literalMatches = raw.match(/\((?:\\.|[^\\)]){3,}\)/g) || [];
  const literalText = literalMatches
    .map((item) => decodePdfLiteral(item.slice(1, -1)))
    .join(" ");
  const fallbackText = raw
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ")
    .replace(/\b(obj|endobj|stream|endstream|xref|trailer|startxref|Length|Filter|FlateDecode)\b/g, " ");
  const best = literalText.replace(/\s+/g, " ").trim().length > 200 ? literalText : fallbackText;
  return best
    .replace(/\\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodePdfLiteral(value) {
  return String(value || "")
    .replace(/\\n/g, " ")
    .replace(/\\r/g, " ")
    .replace(/\\t/g, " ")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\");
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
  const upperName = String(name || "").toUpperCase();
  const knownMatch = getCompanies().find((company) => {
    const nameParts = company.name.toUpperCase().replace(/[^A-Z0-9]+/g, " ").trim().split(/\s+/).filter((part) => part.length > 2);
    const nameScore = nameParts.filter((part) => upperName.includes(part)).length;
    return upperName.includes(company.ticker) || nameScore >= Math.min(2, nameParts.length);
  });
  if (knownMatch) return knownMatch.ticker;

  const ignored = new Set([
    "ANNUAL",
    "REPORT",
    "RESULTS",
    "QUARTERLY",
    "CONCALL",
    "TRANSCRIPT",
    "INVESTOR",
    "PRESENTATION",
    "SHAREHOLDING",
    "PATTERN",
    "EXCHANGE",
    "ANNOUNCEMENT",
    "LIMITED",
    "INDIA"
  ]);
  const tokens = String(name).toUpperCase().match(/\b[A-Z][A-Z0-9.]{1,11}\b/g) || [];
  return tokens.find((token) => !ignored.has(token) && !/^FY\d/i.test(token) && !/^Q[1-4]$/i.test(token)) || "";
}

function inferCompanyName(ticker, title, text) {
  const known = SAMPLE_COMPANIES.find((company) => company.ticker === ticker);
  if (known) return known.name;
  const firstLine = String(text || "").split(/\n/).map((line) => line.trim()).find((line) => line.length > 8 && line.length < 90);
  const fromTitle = String(title || "")
    .replace(/\.[^.]+$/, "")
    .replace(new RegExp(`\\b${ticker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i"), "")
    .replace(/\b(annual|report|concall|transcript|quarterly|results|shareholding|pattern|exchange|announcement|fy\d{2,4}|q[1-4])\b/gi, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const label = fromTitle || firstLine || "imported corpus";
  return `${ticker} ${label}`.trim().slice(0, 72);
}

function inferTypeFromName(name) {
  const lower = String(name).toLowerCase();
  if (lower.includes("annual") || lower.includes("ar-") || lower.includes("10-k") || lower.includes("10k")) return "Annual report";
  if (lower.includes("quarter") || lower.includes("results") || lower.includes("10-q") || lower.includes("10q")) return "Quarterly results";
  if (lower.includes("concall") || lower.includes("call") || lower.includes("transcript")) return "Concall transcript";
  if (lower.includes("shareholding") || lower.includes("pledge") || lower.includes("promoter")) return "Shareholding pattern";
  if (lower.includes("exchange") || lower.includes("announcement")) return "Exchange announcement";
  if (lower.includes("model")) return "Valuation model";
  return "";
}

function titleCase(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
    .replace(/\bQ&a\b/g, "Q&A")
    .replace(/\bMd&a\b/g, "MD&A");
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

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
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

"use strict";

const STORAGE_KEYS = {
  uploads: "niveshscope-uploads-v1",
  notes: "niveshscope-notes-v1",
  waitlist: "niveshscope-waitlist-v1",
  valuationCases: "niveshscope-valuation-cases-v1",
  sourcePack: "niveshscope-source-pack-v1",
  sourceProgress: "niveshscope-source-progress-v1"
};

const WAITLIST_ENDPOINT = "https://formsubmit.co/ajax/dhirajnyse@gmail.com";
const DATA_VERSION = "20260508-16";
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
  notes: [],
  waitlistLeads: [],
  valuationCases: [],
  importReport: null,
  lastBrief: null,
  lastAnswerMeta: null,
  activeSourceTask: null,
  currentCitations: [],
  onlySelectedTicker: true,
  isRunning: false
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
  state.notes = loadJson(STORAGE_KEYS.notes, []);
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
  renderSourcePackList();
  renderSourceMatrixOptions();
  renderSourceMatrix();
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
  els.clearSourceAssistant = document.querySelector("#clearSourceAssistant");
  els.sourceAssistantResult = document.querySelector("#sourceAssistantResult");
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
    const text = els.pasteText.value.trim();
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
  if (els.exportPdfBrief) {
    els.exportPdfBrief.addEventListener("click", exportPdfBrief);
  }
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

  els.sourceBuilderTicker.addEventListener("change", () => {
    state.selectedTicker = els.sourceBuilderTicker.value;
    renderValuationOptions();
    renderImportTickerOptions();
    renderCompanyDossier();
    updateValuationFromCompany();
    updateValuation();
    drawSignalMap();
  });

  els.sourceBuilderType.addEventListener("change", renderSourceBuilderSections);

  if (els.applySourceAssistant) {
    els.applySourceAssistant.addEventListener("click", applySourceAssistant);
  }

  if (els.clearSourceAssistant) {
    els.clearSourceAssistant.addEventListener("click", () => {
      els.sourceAssistantText.value = "";
      flashSourceAssistantResult("Paste cleared.", "neutral");
    });
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
    renderSourceMatrixOptions();
    renderSourceMatrix();
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
  const rawText = els.sourceAssistantText.value.trim();
  if (rawText.replace(/\s+/g, "").length < 120) {
    els.sourceAssistantText.focus();
    flashSourceAssistantResult("Paste at least a few paragraphs from the source before detecting sections.", "error");
    return;
  }
  const draft = makeSourceAssistantDraft(rawText);
  const company = getCompany(draft.ticker);
  state.selectedTicker = draft.ticker;
  renderSourceBuilderTickerOptions();
  els.sourceBuilderTicker.value = draft.ticker;
  els.sourceBuilderType.value = draft.type;
  els.sourceBuilderStatus.value = "real";
  els.sourceBuilderPeriod.value = draft.period;
  els.sourceBuilderDate.value = new Date().toISOString().slice(0, 10);
  els.sourceBuilderTitleInput.value = draft.title;
  renderSourceBuilderSections();
  fillSourceBuilderSections(draft.sections);
  renderImportTickerOptions();
  renderValuationOptions();
  renderCompanyDossier();
  updateValuationFromCompany();
  updateValuation();
  drawSignalMap();
  const urlWarning = els.sourceBuilderUrl.value.trim() ? "" : " Add the source URL before shipping as REAL.";
  flashSourceAssistantResult(`${company ? company.ticker : draft.ticker} ${draft.type} detected with ${draft.sections.length} citation section${draft.sections.length === 1 ? "" : "s"}.${urlWarning}`, urlWarning ? "neutral" : "success");
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
  const sourceUrl = (els.sourceBuilderUrl.value || "").trim();
  const sections = Array.from(els.sourceBuilderSections.querySelectorAll("textarea"))
    .map((textarea) => ({
      title: textarea.dataset.sectionTitle || "Source section",
      text: textarea.value.replace(/\s+/g, " ").trim()
    }))
    .filter((section) => section.text.length > 30);

  if (!sections.length) {
    const firstTextarea = els.sourceBuilderSections.querySelector("textarea");
    if (firstTextarea) firstTextarea.focus();
    flashBuilderResult("Paste at least one source section with enough text before adding it.", "error");
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
    renderSourceMatrixOptions();
    renderSourceMatrix();
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
  renderSourceBuilderSections();
  state.activeSourceTask = {
    ticker: state.selectedTicker,
    requirementKey: requirement.key,
    label: requirement.label,
    status: "Replacement task loaded",
    instruction: requirement.instruction
  };
  renderActiveSourceTask(state.activeSourceTask);
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
  els.activeSourceTask.hidden = false;
  els.activeSourceTask.innerHTML = `
    <div>
      <span>Active replacement task</span>
      <strong>${escapeHtml(task.ticker)} ${escapeHtml(task.label)}</strong>
      <p>${escapeHtml(task.instruction || "Paste verified source sections, add the source URL, then add to live corpus.")}</p>
    </div>
    <button type="button" data-active-task-return="${escapeAttr(company ? company.ticker : task.ticker)}">Return to dossier</button>
  `;
  const button = els.activeSourceTask.querySelector("button[data-active-task-return]");
  if (button) button.addEventListener("click", returnToDossier);
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
  return links.filter((link) => link.url);
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
    ? `<em>${report.skipped.length} skipped: ${escapeHtml(report.skipped.map((item) => item.name).join(", "))}</em>`
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
  renderContextBand();
}

function buildAnswerModel(question, citations, intent, tickerFocus = null, guardMeta = null) {
  const compareMode = guardMeta ? guardMeta.compareMode : isExplicitCompareQuestion(question);
  const grouped = groupCitationsByTicker(citations);
  const rankedCompanies = rankCompaniesForQuestion(question, grouped, intent);
  const confidence = computeConfidence(citations, rankedCompanies);
  const quality = guardMeta || makeEvidenceGuardMeta(question, citations, tickerFocus, compareMode);
  const headline = makeHeadline(question, compareMode, rankedCompanies, intent);
  const thesis = makeThesis(compareMode, rankedCompanies, citations, intent);
  const toneMeter = makeToneMeter(rankedCompanies, citations);
  const focusNotice = makeTickerFocusNotice(tickerFocus);
  const guardNotice = makeEvidenceGuardNotice(quality);
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
      ${guardNotice}
      ${focusNotice}
      ${toneMeter.html}
      ${sections.join("")}
    </div>
  `;

  const plainParts = [
    `${intent.label} | ${confidence}% confidence`,
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
  const primaryCompany = tickerFocus && tickerFocus.company
    ? tickerFocus.company
    : rankedCompanies[0] || getCompany(state.selectedTicker);
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
  if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      return fallbackCopy(text);
    }
  }
  return fallbackCopy(text);
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
    mismatchCount: Number(note.mismatchCount || inferred.mismatchCount || 0)
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
  const ticker = meta.ticker || state.selectedTicker || "desk";
  const date = new Date().toISOString().slice(0, 10);
  const filename = `niveshscope-${String(ticker || "desk").toLowerCase()}-brief-${date}.pdf`;
  const pdfBytes = buildNiveshPdfBrief({
    body: state.lastBrief,
    meta,
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
        { label: "Sources", value: `${safeMeta.citationCount || sourceRows.length || 0} citations` }
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
  const results = await Promise.all(files.map((file) => readUploadedFile(file, fallbackTicker, fallbackType)));
  const docs = results.filter((result) => result.doc).map((result) => result.doc);
  const skipped = results.filter((result) => result.error).map((result) => result.error);
  const added = addUploadedDocs(docs);
  state.importReport = makeImportReport(added, skipped);
  renderImportSummary();
}

function readUploadedFile(file, fallbackTicker = "CUSTOM", fallbackType = "Research note") {
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
      const text = String(reader.result || "");
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
      const text = extractPdfText(reader.result);
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

function makeUploadedDoc({ ticker, title, type, text }) {
  const safeTicker = normalizeTicker(ticker);
  const cleanTitle = String(title || "Imported document").trim().slice(0, 90);
  const cleanText = String(text || "")
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

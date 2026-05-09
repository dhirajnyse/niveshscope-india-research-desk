import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const failures = [];

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function listFiles(dir) {
  return readdirSync(join(root, dir)).flatMap((entry) => {
    const path = join(dir, entry);
    const fullPath = join(root, path);
    return statSync(fullPath).isDirectory() ? listFiles(path) : [path];
  });
}

const index = read("index.html");
const app = read("app.js");

assert(index.includes("Content-Security-Policy"), "index.html is missing the CSP meta tag.");
assert(index.includes("Source review v47"), "index.html does not show the v47 status marker.");
assert(!/\son[a-z]+\s*=/i.test(index), "index.html contains an inline event handler.");
assert(app.includes('const DATA_VERSION = "20260509-22";'), "app.js DATA_VERSION is not aligned with v47.");
assert(app.includes('const RELEASE_LABEL = "v47 Source Review Gate";'), "app.js is missing the v47 release label.");
assert(app.includes("normalizeExternalUrl"), "app.js is missing source URL normalization.");
assert(app.includes("MAX_IMPORT_FILE_BYTES"), "app.js is missing import size limits.");
assert(app.includes("STARTER_PACK_TICKERS"), "app.js is missing the real-source starter pack list.");
assert(app.includes("makeInvestmentReadinessNotice"), "app.js is missing investment-use readiness warnings.");
assert(app.includes("makeSourceCollectionSteps"), "app.js is missing source collection assistant steps.");
assert(index.includes("guided-source-collector") && app.includes("renderGuidedSourceCollector"), "app.js or index.html is missing the guided source collector.");
assert(app.includes("makeGuidedSourceBrief") && app.includes("loadGuidedSourceTask"), "app.js is missing guided source collector actions.");
assert(index.includes("source-citation-extractor") && app.includes("renderSourceCitationExtractor"), "app.js or index.html is missing the source citation extractor.");
assert(app.includes("makeSourceCitationPackMarkdown") && app.includes("applyBestSourceCitations"), "app.js is missing source citation extractor actions.");
assert(index.includes("source-review-gate") && app.includes("renderSourceReviewGate"), "app.js or index.html is missing the source review gate.");
assert(app.includes("makeSourceReviewSheetMarkdown") && app.includes("openSourceReviewFix"), "app.js is missing source review gate actions.");
assert(app.includes("Open source site"), "app.js is missing explicit source-opening labels.");
assert(app.includes("Fill URL"), "app.js is missing explicit URL-fill labels.");
assert(app.includes("renderFilingCapturePreview"), "app.js is missing filing capture preview.");
assert(index.includes("Load sample filing") && app.includes("loadSampleFilingText"), "app.js or index.html is missing sample filing workflow.");
assert(app.includes("isSourceConfidenceReady"), "app.js is missing the REAL-source confidence gate.");
assert(index.includes("brief-workbench") && app.includes("renderBriefWorkbench"), "app.js or index.html is missing the evidence-to-brief workbench.");
assert(app.includes("makeBriefPacketMarkdown") && app.includes("exportBriefPacketJson"), "app.js is missing memo packet export support.");
assert(index.includes("memo-review-room") && app.includes("renderMemoReviewRoom"), "app.js or index.html is missing the memo review room.");
assert(app.includes("saveMemoReview") && app.includes("exportMemoReviewLog"), "app.js is missing memo review save/export support.");
assert(index.includes("launch-control-room") && app.includes("renderLaunchControlRoom"), "app.js or index.html is missing the launch control room.");
assert(app.includes("makeLaunchAudit") && app.includes("exportLaunchAuditPack"), "app.js is missing launch audit support.");
assert(index.includes("release-doctor") && app.includes("renderReleaseDoctor"), "app.js or index.html is missing the release doctor.");
assert(app.includes("makeReleaseManifestJson") && app.includes("copyReleaseManifest"), "app.js is missing release manifest copy/export support.");
assert(index.includes("source-intake-doctor") && app.includes("renderSourceIntakeDoctor"), "app.js or index.html is missing the source intake doctor.");
assert(app.includes("makeSourceIntakeAudit") && app.includes("copySourceCitationNote"), "app.js is missing source intake audit/citation support.");
assert(index.includes("investment-gate") && app.includes("renderInvestmentGate"), "app.js or index.html is missing the investment readiness gate.");
assert(app.includes("makeInvestmentGateAudit") && app.includes("copyInvestmentGateNote"), "app.js is missing investment gate audit/copy support.");
assert(index.includes("decision-journal") && app.includes("renderDecisionJournal"), "app.js or index.html is missing the decision journal.");
assert(app.includes("saveDecisionJournalEntry") && app.includes("makeDecisionJournalJson"), "app.js is missing decision journal save/export support.");
assert(index.includes("review-radar") && app.includes("renderReviewRadar"), "app.js or index.html is missing the review radar.");
assert(app.includes("makeReviewRadarJson") && app.includes("copyReviewRadar"), "app.js is missing review radar copy/export support.");
assert(index.includes("portfolio-watchtower") && app.includes("renderPortfolioWatchtower"), "app.js or index.html is missing the portfolio watchtower.");
assert(app.includes("makePortfolioWatchtowerJson") && app.includes("copyPortfolioWatchtower"), "app.js is missing portfolio watchtower copy/export support.");
assert(index.includes("catalyst-calendar") && app.includes("renderCatalystCalendar"), "app.js or index.html is missing the catalyst calendar.");
assert(app.includes("makeCatalystCalendarJson") && app.includes("copyCatalystCalendar"), "app.js is missing catalyst calendar copy/export support.");
assert(index.includes("daily-briefing") && app.includes("renderDailyBriefing"), "app.js or index.html is missing the daily briefing.");
assert(app.includes("makeDailyBriefingJson") && app.includes("copyDailyBriefing"), "app.js is missing daily briefing copy/export support.");
assert(index.includes("desk-task-board") && app.includes("renderDeskTaskBoard"), "app.js or index.html is missing the desk task board.");
assert(app.includes("makeDeskTaskBoardJson") && app.includes("captureDailyBriefingTask"), "app.js is missing desk task board capture/export support.");
assert(index.includes("research-sprint-planner") && app.includes("renderResearchSprintPlanner"), "app.js or index.html is missing the research sprint planner.");
assert(app.includes("makeResearchSprintJson") && app.includes("captureResearchSprintTasks"), "app.js is missing research sprint planner copy/export support.");
assert(index.includes("ic-memo-builder") && app.includes("renderIcMemoBuilder"), "app.js or index.html is missing the IC memo builder.");
assert(app.includes("makeIcMemoJson") && app.includes("exportIcMemoPdf"), "app.js is missing IC memo copy/export support.");
assert(index.includes("claim-trace-inspector") && app.includes("renderClaimTraceInspector"), "app.js or index.html is missing the claim trace inspector.");
assert(app.includes("makeClaimTraceJson") && app.includes("openWeakestClaim"), "app.js is missing claim trace copy/export support.");
assert(index.includes("answer-quality-lab") && app.includes("renderAnswerQualityLab"), "app.js or index.html is missing the answer quality lab.");
assert(app.includes("makeAnswerQualityJson") && app.includes("openAnswerQualityFix"), "app.js is missing answer quality copy/export support.");
assert(index.includes("operator-coach") && app.includes("renderOperatorCoach"), "app.js or index.html is missing the operator coach.");
assert(app.includes("makeOperatorCoachJson") && app.includes("copyOperatorCoachPlan"), "app.js is missing operator coach copy/export support.");
assert(index.includes("evidence-vault") && app.includes("renderEvidenceVault"), "app.js or index.html is missing the evidence vault.");
assert(app.includes("makeEvidenceVaultJson") && app.includes("saveCurrentEvidenceToVault"), "app.js is missing evidence vault save/export support.");
assert(index.includes("trust-center") && app.includes("renderTrustCenter"), "app.js or index.html is missing the trust center.");
assert(app.includes("makeTrustCenterAudit") && app.includes("makeTrustReportJson"), "app.js is missing trust center audit/export support.");

for (const file of listFiles("data").filter((name) => name.endsWith(".json"))) {
  try {
    JSON.parse(read(file));
  } catch (error) {
    failures.push(`${file} is not valid JSON: ${error.message}`);
  }
}

for (const required of [
  "README.md",
  "SECURITY.md",
  "docs/ARCHITECTURE.md",
  "docs/DATA_PROVENANCE.md",
  "docs/REAL_SOURCE_STARTER_PACK.md",
  "docs/SOURCE_COLLECTION_ASSISTANT.md",
  "docs/GUIDED_SOURCE_COLLECTOR.md",
  "docs/SOURCE_CITATION_EXTRACTOR.md",
  "docs/SOURCE_REVIEW_GATE.md",
  "docs/REAL_FILING_CAPTURE_MODE.md",
  "docs/BRIEF_WORKBENCH.md",
  "docs/MEMO_REVIEW_ROOM.md",
  "docs/LAUNCH_CONTROL_ROOM.md",
  "docs/SOURCE_INTAKE_DOCTOR.md",
  "docs/INVESTMENT_READINESS_GATE.md",
  "docs/DECISION_JOURNAL.md",
  "docs/REVIEW_RADAR.md",
  "docs/PORTFOLIO_WATCHTOWER.md",
  "docs/CATALYST_CALENDAR.md",
  "docs/DAILY_BRIEFING.md",
  "docs/DESK_TASK_BOARD.md",
  "docs/RESEARCH_SPRINT_PLANNER.md",
  "docs/IC_MEMO_BUILDER.md",
  "docs/CLAIM_TRACE_INSPECTOR.md",
  "docs/ANSWER_QUALITY_LAB.md",
  "docs/OPERATOR_COACH.md",
  "docs/EVIDENCE_VAULT.md",
  "docs/TRUST_CENTER.md",
  "docs/RELEASE_DOCTOR.md",
  "docs/LAUNCH_ROADMAP.md",
  "docs/REPO_OPERATIONS.md"
]) {
  assert(read(required).trim().length > 200, `${required} is missing or too short.`);
}

if (failures.length) {
  console.error("NiveshScope static checks failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("NiveshScope static checks passed.");

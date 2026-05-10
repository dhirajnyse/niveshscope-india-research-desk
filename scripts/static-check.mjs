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
assert(index.includes("Pilot feedback v61"), "index.html does not show the v61 status marker.");
assert(index.includes("scrollTopButton"), "index.html is missing the back-to-top button.");
assert(index.includes("quickNavToggle") && index.includes("quickNavPanel"), "index.html is missing the quick navigator shell.");
assert(index.includes("commandPaletteOpen") && index.includes("commandPaletteSearch"), "index.html is missing the command palette shell.");
assert(index.includes("productTourOpen") && index.includes("productTourNext"), "index.html is missing the guided product tour shell.");
assert(index.includes("session-coach") && index.includes("sessionCoachChecklist"), "index.html is missing the first-session coach shell.");
assert(index.includes("research-handoff") && index.includes("researchHandoffSummary"), "index.html is missing the research handoff shell.");
assert(index.includes("session-timeline") && index.includes("sessionTimelineList"), "index.html is missing the session timeline shell.");
assert(index.includes("workspace-snapshot") && index.includes("workspaceSnapshotSummary"), "index.html is missing the workspace snapshot shell.");
assert(index.includes("recovery-vault") && index.includes("recoveryVaultSummary"), "index.html is missing the recovery vault shell.");
assert(index.includes("pages-upload-wizard") && index.includes("pagesUploadWizardSummary"), "index.html is missing the Pages upload wizard shell.");
assert(index.includes("live-site-doctor") && index.includes("liveSiteDoctorSummary"), "index.html is missing the Live Site Doctor shell.");
assert(index.includes("github-release-handoff") && index.includes("githubReleaseSummary"), "index.html is missing the GitHub Release Handoff shell.");
assert(index.includes("pilot-demo-room") && index.includes("pilotDemoSummary"), "index.html is missing the Pilot Demo Room shell.");
assert(index.includes("pilot-feedback-room") && index.includes("pilotFeedbackSummary"), "index.html is missing the Pilot Feedback Room shell.");
assert(!/\son[a-z]+\s*=/i.test(index), "index.html contains an inline event handler.");
assert(app.includes('const DATA_VERSION = "20260510-14";'), "app.js DATA_VERSION is not aligned with v61.");
assert(app.includes('const RELEASE_LABEL = "v61 Pilot Feedback Room";'), "app.js is missing the v61 release label.");
assert(app.includes("bindScrollTopButton") && app.includes("scrollTopButton"), "app.js is missing back-to-top button behavior.");
assert(app.includes("QUICK_NAV_SECTIONS") && app.includes("bindQuickNavigator"), "app.js is missing quick navigator behavior.");
assert(app.includes("COMMAND_ACTIONS") && app.includes("bindCommandPalette"), "app.js is missing command palette behavior.");
assert(app.includes("PRODUCT_TOUR_STEPS") && app.includes("bindProductTour"), "app.js is missing guided product tour behavior.");
assert(app.includes("renderSessionCoach") && app.includes("bindSessionCoach"), "app.js is missing first-session coach behavior.");
assert(app.includes("renderResearchHandoff") && app.includes("makeResearchHandoffMarkdown"), "app.js is missing research handoff behavior.");
assert(app.includes("renderSessionTimeline") && app.includes("addSessionTimelineEvent"), "app.js is missing session timeline behavior.");
assert(app.includes("renderWorkspaceSnapshot") && app.includes("exportWorkspaceSnapshot") && app.includes("importWorkspaceSnapshotFile"), "app.js is missing workspace snapshot behavior.");
assert(app.includes("renderRecoveryVault") && app.includes("createRecoveryPoint") && app.includes("restoreRecoveryPoint"), "app.js is missing recovery vault behavior.");
assert(app.includes("renderPagesUploadWizard") && app.includes("makePagesUploadWizardAudit") && app.includes("copyPagesUploadSteps"), "app.js is missing Pages upload wizard behavior.");
assert(app.includes("renderLiveSiteDoctor") && app.includes("makeLiveSiteDoctorAudit") && app.includes("copyLiveSiteVerification"), "app.js is missing Live Site Doctor behavior.");
assert(app.includes("renderGithubReleaseHandoff") && app.includes("makeGithubReleaseHandoffAudit") && app.includes("copyGithubCommitMessage"), "app.js is missing GitHub Release Handoff behavior.");
assert(app.includes("renderPilotDemoRoom") && app.includes("makePilotDemoRoomAudit") && app.includes("copyPilotDemoScript"), "app.js is missing Pilot Demo Room behavior.");
assert(app.includes("renderPilotFeedbackRoom") && app.includes("makePilotFeedbackAudit") && app.includes("copyPilotFeedbackReport"), "app.js is missing Pilot Feedback Room behavior.");
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
  "docs/QUICK_NAVIGATOR.md",
  "docs/COMMAND_PALETTE.md",
  "docs/GUIDED_PRODUCT_TOUR.md",
  "docs/FIRST_RESEARCH_SESSION_COACH.md",
  "docs/RESEARCH_HANDOFF_ROOM.md",
  "docs/SESSION_TIMELINE.md",
  "docs/WORKSPACE_SNAPSHOT.md",
  "docs/WORKSPACE_RECOVERY_VAULT.md",
  "docs/PAGES_UPLOAD_WIZARD.md",
  "docs/LIVE_SITE_DOCTOR.md",
  "docs/GITHUB_RELEASE_HANDOFF.md",
  "docs/PILOT_DEMO_ROOM.md",
  "docs/PILOT_FEEDBACK_ROOM.md",
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



"use client";

import { useState } from "react";
import CollectionPanel from "@/components/CollectionPanel";
import FeaturePanel from "@/components/FeaturePanel";
import Hero from "@/components/Hero";
import InsightPanel from "@/components/InsightPanel";
import ReferenceShelf from "@/components/ReferenceShelf";
import StatePanel from "@/components/StatePanel";
import StatsStrip from "@/components/StatsStrip";
import WorkspacePanel from "@/components/WorkspacePanel";
import { createInsights, createPlan } from "@/lib/api";

const APP_NAME = "StageSignal";
const TAGLINE = "The broadcast\u2011room console for indie live shows\u2014run cues, risks, and comms from a single browser.";
const FEATURE_CHIPS = ["Dynamic Cue Board - A horizontally scrolling, ticker\u2011style board that displays upcoming, live, and completed cues. The playhead follows the current cue, and hotkeys (Enter / Shift\u2011Enter) advance or rewind instantly with sub\u201150\u202fms UI latency.", "Incident & Fallback Engine - Pre\u2011defined incident chips appear automatically when a risk lane triggers. Amber\u2011flashing chips can be resolved with a single **F** hotkey, injecting the fallback cue into the live stream without pausing the board.", "Risk\u2011Lane Timeline - Top\u2011spanning timeline markers tied to sponsor breaks, technical windows, or any custom risk. When the playhead reaches a marker the lane glows blue; if a failure is detected the lane turns amber and queues the contingency cue.", "Comms Rail - Bottom\u2011center neon\u2011blue rail for one\u2011click broadcast messages to talent or crew. Operators can choose from saved templates or type ad\u2011hoc alerts; messages animate across the screen while the cue board continues scrolling."];
const PROOF_POINTS = ["Open\u2011source repository with 120+ stars and active community contributions", "Case study: 3\u2011hour demo\u2011day run with zero missed sponsor slots and a 98\u202f% incident\u2011resolution rate", "Performance benchmark: UI updates under 50\u202fms on a standard 2019\u2011era laptop", "Endorsements carousel featuring indie event collectives and theatre tech blogs"];
const SURFACE_LABELS = {"hero": "Broadcast control\u2011room wall", "workspace": "Central Cue Board with live playhead, scrolling ticker and cue cards", "result": "Left\u2011aligned Incident Panel displaying active risk chips", "support": "GitHub \u2605 badge (100+ stars)", "collection": "Full\u2011screen Setup Wizard (first view) that imports the show script and previews the board"};
const PLACEHOLDERS = {"query": "Show Script (JSON)", "preferences": "Setup Options"};
const DEFAULT_STATS = [{"label": "CueBoardState", "value": "7"}, {"label": "GitHub \u2605 badge (100+ stars)", "value": "0"}, {"label": "Readiness score", "value": "88"}];
const READY_TITLE = "Loading a saved show script instantly fills the cue board, the playhead lights up and the timeline begins scrolling in real time.";
const READY_DETAIL = "Show a loaded show script, start the sequence, trigger a simulated failure, and watch an incident chip pop up with an automatic fallback cue, all while the cue board continues scrolling seamlessly. / Loading a saved show script instantly fills the cue board, the playhead lights up and the timeline begins scrolling in real time. / A simulated equipment failure is triggered; an amber incident chip flashes, the operator hits **F** and the predefined fallback cue slides into the live position without any pause.";
const COLLECTION_TITLE = "Broadcast Control\u2011Room Wall stays visible after each run.";
const SUPPORT_TITLE = "Github \u2605 Badge (100+ Stars)";
const REFERENCE_TITLE = "Bottom\u2011Center Comms Rail For Instant Broadcast Messages";
const BUTTON_LABEL = "Launch Show";
const LAYOUT = "operations_console";
const UI_COPY_TONE = "Command\u2011center brevity";
const SAMPLE_ITEMS = ["{'showTitle': 'Startup Demo Day \u2013 Day\\u202f1', 'scenes': ['Opening Intro', 'Pitch\\u202f1 \u2013 AI Startup', 'Sponsor Break \u2013 CloudCo (30\\u202fs)', 'Pitch\\u202f2 \u2013 HealthTech', 'Technical Glitch Backup (Play pre\u2011recorded intro video)', 'Pitch\\u202f3 \u2013 FinTech', 'Closing Remarks'], 'incidents': [{'id': 'audio-drop', 'description': 'Audio dropout on Mic\\u202f2', 'fallbackCue': 'Play backup music loop'}, {'id': 'video-freeze', 'description': 'Video freeze on Pitch\\u202f2 screen', 'fallbackCue': 'Show static brand screen'}], 'riskLanes': [{'marker': 'Sponsor Break \u2013 CloudCo', 'triggerTime': '02:15', 'fallbackCue': 'Play sponsor pre\u2011recorded ad'}], 'commsPrompts': ['Cue lights on for Pitch\\u202f1', 'Reset mic levels', 'All hands \u2013 standby for sponsor break']}", "{'showTitle': 'Pop\u2011Up Music Festival \u2013 Evening Set', 'scenes': ['Stage Warm\u2011up', 'Band\\u202fA', 'Sponsor Break \u2013 BeatsCo (45\\u202fs)', 'Band\\u202fB', 'Emergency Power Cut Backup (Redirect to acoustic set)', 'Band\\u202fC', 'Finale Fireworks'], 'incidents': [{'id': 'power-fail', 'description': 'Main power loss during Band\\u202fB', 'fallbackCue': 'Switch to acoustic backup track'}], 'riskLanes': [{'marker': 'Sponsor Break \u2013 BeatsCo', 'triggerTime': '01:05', 'fallbackCue': 'Play sponsor video loop'}], 'commsPrompts': ['Lights cue for Band\\u202fC', 'Safety crew \u2013 check cables']}"];
const REFERENCE_OBJECTS = ["cue card", "incident chip", "risk marker", "comms badge", "sponsor slot strip"];

type PlanItem = { title: string; detail: string; score: number };
type InsightPayload = { insights: string[]; next_actions: string[]; highlights: string[] };
type PlanPayload = { summary: string; score: number; items: PlanItem[]; insights?: InsightPayload };

export default function Page() {
  const [query, setQuery] = useState("");
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<PlanPayload | null>(null);
  const [saved, setSaved] = useState<PlanPayload[]>([]);
  const layoutClass = LAYOUT.replace(/_/g, "-");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      const nextPlan = await createPlan({ query, preferences });
      const insightPayload = await createInsights({
        selection: nextPlan.items?.[0]?.title ?? query,
        context: preferences || query,
      });
      const composed = { ...nextPlan, insights: insightPayload };
      setPlan(composed);
      setSaved((previous) => [composed, ...previous].slice(0, 4));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  const stats = DEFAULT_STATS.map((stat, index) => {
    if (index === 0) return { ...stat, value: String(FEATURE_CHIPS.length) };
    if (index === 1) return { ...stat, value: String(saved.length) };
    if (index === 2) return { ...stat, value: plan ? String(plan.score) : stat.value };
    return stat;
  });

  const heroNode = (
    <Hero
      appName={APP_NAME}
      tagline={TAGLINE}
      proofPoints={PROOF_POINTS}
      eyebrow={SURFACE_LABELS.hero}
    />
  );
  const statsNode = <StatsStrip stats={stats} />;
  const workspaceNode = (
    <WorkspacePanel
      query={query}
      preferences={preferences}
      onQueryChange={setQuery}
      onPreferencesChange={setPreferences}
      onGenerate={handleGenerate}
      loading={loading}
      features={FEATURE_CHIPS}
      eyebrow={SURFACE_LABELS.workspace}
      queryPlaceholder={PLACEHOLDERS.query}
      preferencesPlaceholder={PLACEHOLDERS.preferences}
      actionLabel={BUTTON_LABEL}
    />
  );
  const primaryNode = error ? (
    <StatePanel eyebrow="Request blocked" title="Request blocked" tone="error" detail={error} />
  ) : plan ? (
    <InsightPanel plan={plan} eyebrow={SURFACE_LABELS.result} />
  ) : (
    <StatePanel eyebrow={SURFACE_LABELS.result} title={READY_TITLE} tone="neutral" detail={READY_DETAIL} />
  );
  const featureNode = (
    <FeaturePanel eyebrow={SURFACE_LABELS.support} title={SUPPORT_TITLE} features={FEATURE_CHIPS} proofPoints={PROOF_POINTS} />
  );
  const collectionNode = <CollectionPanel eyebrow={SURFACE_LABELS.collection} title={COLLECTION_TITLE} saved={saved} />;
  const referenceNode = (
    <ReferenceShelf
      eyebrow={SURFACE_LABELS.support}
      title={REFERENCE_TITLE}
      items={SAMPLE_ITEMS}
      objects={REFERENCE_OBJECTS}
      tone={UI_COPY_TONE}
    />
  );

  function renderLayout() {
    if (LAYOUT === "storyboard") {
      return (
        <>
          {heroNode}
          {statsNode}
          <section className="storyboard-stage">
            <div className="storyboard-main">
              {workspaceNode}
              {primaryNode}
            </div>
            <div className="storyboard-side">
              {referenceNode}
              {featureNode}
            </div>
          </section>
          {collectionNode}
        </>
      );
    }

    if (LAYOUT === "operations_console") {
      return (
        <section className="console-shell">
          <div className="console-top">
            {heroNode}
            {statsNode}
          </div>
          <div className="console-grid">
            <div className="console-operator-lane">
              {workspaceNode}
              {referenceNode}
            </div>
            <div className="console-timeline-lane">{primaryNode}</div>
            <div className="console-support-lane">
              {featureNode}
              {collectionNode}
            </div>
          </div>
        </section>
      );
    }

    if (LAYOUT === "studio") {
      return (
        <section className="studio-shell">
          <div className="studio-top">
            {heroNode}
            {primaryNode}
          </div>
          {statsNode}
          <div className="studio-bottom">
            <div className="studio-left">
              {workspaceNode}
              {collectionNode}
            </div>
            <div className="studio-right">
              {referenceNode}
              {featureNode}
            </div>
          </div>
        </section>
      );
    }

    if (LAYOUT === "atlas") {
      return (
        <section className="atlas-shell">
          <div className="atlas-hero-row">
            {heroNode}
            <div className="atlas-side-stack">
              {statsNode}
              {referenceNode}
            </div>
          </div>
          <div className="atlas-main-row">
            <div className="atlas-primary-stack">
              {primaryNode}
              {collectionNode}
            </div>
            <div className="atlas-secondary-stack">
              {workspaceNode}
              {featureNode}
            </div>
          </div>
        </section>
      );
    }

    if (LAYOUT === "notebook") {
      return (
        <section className="notebook-shell">
          {heroNode}
          <div className="notebook-top">
            <div className="notebook-left">
              {primaryNode}
              {referenceNode}
            </div>
            <div className="notebook-right">
              {workspaceNode}
              {featureNode}
            </div>
          </div>
          <div className="notebook-bottom">
            {collectionNode}
            {statsNode}
          </div>
        </section>
      );
    }

    return (
      <>
        {heroNode}
        {statsNode}
        <section className="content-grid">
          {workspaceNode}
          <div className="stack">
            {primaryNode}
            {referenceNode}
            {featureNode}
          </div>
        </section>
        {collectionNode}
      </>
    );
  }

  return (
    <main className={`page-shell layout-${layoutClass}`}>
      {renderLayout()}
    </main>
  );
}

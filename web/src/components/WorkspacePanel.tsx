"use client";

type WorkspacePanelProps = {
  query: string;
  preferences: string;
  onQueryChange: (value: string) => void;
  onPreferencesChange: (value: string) => void;
  onGenerate: () => void;
  loading: boolean;
  features: string[];
  eyebrow: string;
  queryPlaceholder: string;
  preferencesPlaceholder: string;
  actionLabel: string;
};

export default function WorkspacePanel({
  query,
  preferences,
  onQueryChange,
  onPreferencesChange,
  onGenerate,
  loading,
  features,
  eyebrow,
  queryPlaceholder,
  preferencesPlaceholder,
  actionLabel,
}: WorkspacePanelProps) {
  return (
    <section className="workspace-panel">
      <span className="eyebrow">{eyebrow}</span>
      <div className="controls">
        <textarea value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder={queryPlaceholder} />
        <textarea value={preferences} onChange={(event) => onPreferencesChange(event.target.value)} placeholder={preferencesPlaceholder} />
        <div className="button-row">
          <button className="primary-button" onClick={onGenerate} disabled={loading}>
            {loading ? "Generating..." : actionLabel}
          </button>
        </div>
      </div>
      <div className="feature-chips">
        {features.map((feature) => (
          <span className="feature-chip" key={feature}>{feature}</span>
        ))}
      </div>
    </section>
  );
}

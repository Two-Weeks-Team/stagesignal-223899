type FeaturePanelProps = {
  eyebrow: string;
  title: string;
  features: string[];
  proofPoints: string[];
};

export default function FeaturePanel({ eyebrow, title, features, proofPoints }: FeaturePanelProps) {
  return (
    <section className="feature-panel">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <ul className="feature-list">
        {features.concat(proofPoints).map((entry) => (
          <li key={entry}>{entry}</li>
        ))}
      </ul>
    </section>
  );
}

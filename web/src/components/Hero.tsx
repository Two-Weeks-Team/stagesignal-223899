type HeroProps = {
  appName: string;
  tagline: string;
  proofPoints: string[];
  eyebrow: string;
};

export default function Hero({ appName, tagline, proofPoints, eyebrow }: HeroProps) {
  return (
    <section className="hero">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{appName}</h1>
      <p>{tagline}</p>
      <ul className="hero-proof-list">
        {proofPoints.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </section>
  );
}

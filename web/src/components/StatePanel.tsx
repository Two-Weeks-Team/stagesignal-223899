export default function StatePanel({
  eyebrow,
  title,
  detail,
  tone,
}: {
  eyebrow: string;
  title: string;
  detail: string;
  tone: "neutral" | "error";
}) {
  return (
    <section className="status-panel">
      <span className="eyebrow">{eyebrow || (tone === "error" ? "Attention" : "Ready")}</span>
      <h2>{title}</h2>
      <p>{detail}</p>
    </section>
  );
}

type ReferenceShelfProps = {
  eyebrow: string;
  title: string;
  items: string[];
  objects: string[];
  tone: string;
};

export default function ReferenceShelf({ eyebrow, title, items, objects, tone }: ReferenceShelfProps) {
  return (
    <section className="reference-shelf">
      <div className="section-heading">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{tone}</p>
      </div>
      <div className="reference-grid">
        {items.map((item, index) => (
          <article className="reference-card" key={`${item}-${index}`}>
            <strong>{item}</strong>
            <span>{objects[index % Math.max(objects.length, 1)] || title}</span>
          </article>
        ))}
      </div>
      <div className="object-strip">
        {objects.map((objectName) => (
          <span className="object-pill" key={objectName}>{objectName}</span>
        ))}
      </div>
    </section>
  );
}

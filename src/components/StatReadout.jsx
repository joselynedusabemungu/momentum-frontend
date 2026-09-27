export default function StatReadout({ label, value, suffix, accent, detail }) {
  return (
    <article className="stat-card">
      <div className="eyebrow">{label}</div>
      <div
        className="stat-value"
        style={accent ? { color: accent } : undefined}
      >
        {value}
        <small>{suffix}</small>
      </div>
      {detail && <div className="stat-detail">{detail}</div>}
    </article>
  );
}

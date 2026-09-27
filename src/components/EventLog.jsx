const meta = {
  created: ["ADDED", "positive"],
  completed: ["DONE", "positive"],
  uncompleted: ["REOPEN", "attention"],
  title_updated: ["EDIT", "attention"],
  deleted: ["REMOVED", "critical"],
};
function describe(e) {
  const t = e.payload?.title || e.payload?.to || "task";
  if (e.event_type === "created") return `Added “${t}”`;
  if (e.event_type === "completed") return `Completed “${t}”`;
  if (e.event_type === "uncompleted") return `Reopened “${t}”`;
  if (e.event_type === "title_updated") return `Renamed “${e.payload?.from}”`;
  return `Removed “${t}”`;
}
export default function EventLog({ events }) {
  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <div className="eyebrow">PAPER TRAIL</div>
          <h2>Activity</h2>
        </div>
        <span className="soft-pill">{events.length} recent</span>
      </div>
      <div>
        {events.length ? (
          events.map((e) => {
            const m = meta[e.event_type] || [e.event_type, "muted"];
            return (
              <div className="event-row" key={e.id}>
                <time>
                  {new Date(e.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
                <span className={`event-tag ${m[1]}`}>{m[0]}</span>
                <span>{describe(e)}</span>
              </div>
            );
          })
        ) : (
          <div className="empty-state compact">
            <span>Task changes will appear here.</span>
          </div>
        )}
      </div>
    </div>
  );
}

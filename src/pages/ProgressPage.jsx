import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import StatReadout from "../components/StatReadout";
import EventLog from "../components/EventLog";

export default function ProgressPage() {
  const statsQ = useQuery({ queryKey: ["stats"], queryFn: api.getStats });
  const eventsQ = useQuery({
    queryKey: ["events"],
    queryFn: () => api.listEvents(50, 0),
  });
  const stats = statsQ.data;
  const percent = Math.round((stats?.completion_ratio || 0) * 100);
  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <div className="eyebrow">YOUR PATTERN</div>
          <h1>Progress</h1>
          <p>See the rhythm behind your work, not just the task count.</p>
        </div>
      </section>
      <section className="stats-grid">
        <StatReadout label="TOTAL TASKS" value={stats?.total_tasks ?? 0} />
        <StatReadout
          label="COMPLETED"
          value={stats?.completed_tasks ?? 0}
          accent="var(--purple)"
        />
        <StatReadout
          label="COMPLETION"
          value={percent}
          suffix="%"
          accent="var(--pink-deep)"
        />
      </section>
      <section className="progress-spotlight">
        <div>
          <div className="eyebrow">MOMENTUM SCORE</div>
          <div className="score-ring" style={{ "--progress": `${percent}%` }}>
            <strong>{percent}</strong>
            <span>%</span>
          </div>
        </div>
        <div className="progress-copy">
          <h2>Consistency beats intensity.</h2>
          <p>
            Every completed task gives Momentum a clearer picture of how you
            work. Use the activity trail to spot what helps you keep moving.
          </p>
          <div className="progress-track">
            <div style={{ width: `${percent}%` }} />
          </div>
        </div>
      </section>
      <section className="panel">
        <EventLog events={eventsQ.data?.items || []} />
      </section>
    </div>
  );
}

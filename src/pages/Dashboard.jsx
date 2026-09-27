import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import StatReadout from "../components/StatReadout";
import EventLog from "../components/EventLog";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const tasksQ = useQuery({
    queryKey: ["tasks"],
    queryFn: () => api.listTasks(100, 0),
  });
  const statsQ = useQuery({ queryKey: ["stats"], queryFn: api.getStats });
  const goalsQ = useQuery({ queryKey: ["goals"], queryFn: api.listGoals });
  const eventsQ = useQuery({
    queryKey: ["events"],
    queryFn: () => api.listEvents(8, 0),
  });

  const tasks = tasksQ.data?.items || [];
  const active = tasks.filter((t) => !t.is_complete);
  const upcoming = useMemo(
    () =>
      active
        .filter((t) => t.due_date)
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
        .slice(0, 3),
    [active],
  );
  const focus = upcoming[0] || active[0];
  const stats = statsQ.data;
  const goals = goalsQ.data || [];
  const goal = goals.find((g) => g.status === "active");
  const percent = Math.round((stats?.completion_ratio || 0) * 100);
  const firstName = (user?.full_name || "there").split(" ")[0];
  const currentDay = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
  })
    .format(new Date())
    .toUpperCase();

  return (
    <div className="page-stack">
      <section className="page-hero dashboard-hero">
        <div>
          <div className="eyebrow">{currentDay} · YOUR MOMENTUM</div>
          <h1>Good to see you, {firstName}.</h1>
          <p>
            Keep the important things moving. Momentum turns today's work into
            visible progress.
          </p>
        </div>
        <Link className="hero-action" to="/ai">
          <span>✦</span> Ask your coach
        </Link>
      </section>

      <section className="stats-grid">
        <StatReadout
          label="OPEN TASKS"
          value={active.length}
          detail="Things still in motion"
        />
        <StatReadout
          label="COMPLETED"
          value={stats?.completed_tasks ?? 0}
          detail="Across your workspace"
          accent="var(--purple)"
        />
        <StatReadout
          label="STREAK"
          value={stats?.current_streak_days ?? 0}
          suffix="d"
          detail="Keep the rhythm going"
          accent="var(--pink-deep)"
        />
      </section>

      <section className="dashboard-focus-grid">
        <article className="focus-card">
          <div className="card-kicker">
            <span className="priority-dot" /> TODAY'S FOCUS
          </div>
          {focus ? (
            <>
              <h2>{focus.title}</h2>
              <p>
                {focus.due_date
                  ? `Due ${new Date(focus.due_date).toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}`
                  : "No deadline yet — choose a small next step."}
              </p>
              <div className="focus-actions">
                <Link to="/tasks" className="primary-button">
                  Open tasks
                </Link>
                <Link to="/ai" className="secondary-button">
                  Break it down
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2>You're clear.</h2>
              <p>
                No active tasks need your attention. This is a great moment to
                choose the next useful thing.
              </p>
              <Link to="/tasks" className="primary-button">
                Add a task
              </Link>
            </>
          )}
        </article>

        <article className="momentum-card">
          <div className="card-kicker">WEEKLY MOMENTUM</div>
          <div className="big-percent">
            {percent}
            <span>%</span>
          </div>
          <div className="progress-track">
            <div style={{ width: `${percent}%` }} />
          </div>
          <p>
            {stats?.completed_tasks ?? 0} completed of {stats?.total_tasks ?? 0}{" "}
            total tasks.
          </p>
          <Link to="/progress" className="text-link">
            View full progress →
          </Link>
        </article>
      </section>

      <section className="dashboard-two-column">
        <article className="panel upcoming-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">COMING UP</div>
              <h2>Upcoming</h2>
            </div>
            <Link className="text-link" to="/tasks">
              View all
            </Link>
          </div>
          {upcoming.length ? (
            upcoming.map((task) => (
              <Link to="/tasks" className="upcoming-row" key={task.id}>
                <span className="task-mini-dot" />
                <span>{task.title}</span>
                <time>
                  {new Date(task.due_date).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </Link>
            ))
          ) : (
            <div className="empty-state compact">
              <span>No upcoming deadlines.</span>
            </div>
          )}
        </article>
        <article className="panel goal-snapshot">
          <div className="panel-head">
            <div>
              <div className="eyebrow">DIRECTION</div>
              <h2>Active goal</h2>
            </div>
            <Link className="text-link" to="/goals">
              Goals
            </Link>
          </div>
          {goal ? (
            <div className="goal-highlight">
              <span className="goal-orb">◎</span>
              <div>
                <strong>{goal.title}</strong>
                <p>
                  {goal.description || "Keep moving one useful step at a time."}
                </p>
              </div>
            </div>
          ) : (
            <div className="empty-state compact">
              <span>Create a goal to give your work direction.</span>
              <Link to="/goals" className="text-link">
                Create goal →
              </Link>
            </div>
          )}
        </article>
      </section>

      <section className="panel activity-preview">
        <div className="panel-head">
          <div>
            <div className="eyebrow">PAPER TRAIL</div>
            <h2>Recent activity</h2>
          </div>
          <Link className="text-link" to="/progress">
            See history
          </Link>
        </div>
        <EventLog events={eventsQ.data?.items || []} />
      </section>
    </div>
  );
}

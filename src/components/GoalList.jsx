import { useForm } from "@tanstack/react-form";
export default function GoalList({ goals, onCreate, onUpdate, isPending }) {
  const form = useForm({
    defaultValues: { title: "", description: "" },
    onSubmit: async ({ value }) => {
      if (!value.title.trim()) return;
      await onCreate({
        title: value.title.trim(),
        description: value.description.trim() || null,
      });
      form.reset();
    },
  });
  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <div className="eyebrow">DIRECTION</div>
          <h2>Goals</h2>
        </div>
        <span className="soft-pill">{goals.length}</span>
      </div>
      <form
        className="goal-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field name="title">
          {(f) => (
            <input
              value={f.state.value}
              onChange={(e) => f.handleChange(e.target.value)}
              placeholder="A goal worth moving toward"
            />
          )}
        </form.Field>
        <form.Field name="description">
          {(f) => (
            <input
              value={f.state.value}
              onChange={(e) => f.handleChange(e.target.value)}
              placeholder="Optional context"
            />
          )}
        </form.Field>
        <button className="secondary-button" disabled={isPending}>
          Add goal
        </button>
      </form>
      <div className="goal-list">
        {goals.length ? (
          goals.map((g) => (
            <div className="goal-row" key={g.id}>
              <div>
                <strong>{g.title}</strong>
                {g.description && <span>{g.description}</span>}
              </div>
              <button
                className={`status-pill ${g.status}`}
                onClick={() =>
                  onUpdate(g.id, {
                    status: g.status === "active" ? "completed" : "active",
                  })
                }
              >
                {g.status === "active" ? "Active" : "Completed"}
              </button>
            </div>
          ))
        ) : (
          <div className="empty-state compact">
            <span>
              Create one goal so the agent knows what progress means to you.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

import { useForm } from "@tanstack/react-form";
export default function AddTaskForm({ onAdd, isPending }) {
  const form = useForm({
    defaultValues: { title: "", due_date: "" },
    onSubmit: async ({ value }) => {
      const title = value.title.trim();
      if (!title) return;
      const due_date = value.due_date
        ? new Date(value.due_date).toISOString()
        : null;
      await onAdd({ title, due_date });
      form.reset();
    },
  });
  return (
    <form
      className="add-task"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <span className="plus">+</span>
      <form.Field
        name="title"
        validators={{
          onChange: ({ value }) => (!value.trim() ? "Enter a task" : undefined),
        }}
      >
        {(field) => (
          <input
            autoComplete="off"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="What will move you forward today?"
            aria-label="New task"
          />
        )}
      </form.Field>
      <form.Field name="due_date">
        {(field) => (
          <label className="due-field">
            <span className="due-label">Deadline</span>
            <input
              className="due-input"
              type="datetime-local"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              aria-label="Optional deadline"
              title="Optional deadline"
            />
          </label>
        )}
      </form.Field>
      <button className="primary-button" type="submit" disabled={isPending}>
        {isPending ? "Adding…" : "Add task"}
      </button>
    </form>
  );
}

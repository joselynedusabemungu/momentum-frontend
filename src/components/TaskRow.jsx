import { useState } from "react";
export default function TaskRow({ task, onToggle, onRename, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const save = async () => {
    const value = draft.trim();
    if (value && value !== task.title) await onRename(value);
    else setDraft(task.title);
    setEditing(false);
  };
  return (
    <div className={`task-row ${task.is_complete ? "done" : ""}`}>
      <button
        className={`check ${task.is_complete ? "checked" : ""}`}
        onClick={() => onToggle(!task.is_complete)}
        aria-label={task.is_complete ? "Reopen task" : "Complete task"}
      >
        {task.is_complete ? "✓" : ""}
      </button>
      {editing ? (
        <input
          className="edit-task"
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") {
              setDraft(task.title);
              setEditing(false);
            }
          }}
        />
      ) : (
        <button className="task-title" onClick={() => setEditing(true)}>
          {task.title}
        </button>
      )}
      <div className="task-meta">
        {task.due_date && (
          <span
            className={
              new Date(task.due_date) < new Date() && !task.is_complete
                ? "overdue"
                : ""
            }
          >
            {task.is_complete
              ? "Done"
              : `Due ${new Date(task.due_date).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}`}
          </span>
        )}
      </div>
      <button
        className="icon-button"
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
      >
        ×
      </button>
    </div>
  );
}

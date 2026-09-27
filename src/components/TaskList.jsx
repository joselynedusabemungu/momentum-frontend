import TaskRow from "./TaskRow";
export default function TaskList({ tasks, onToggle, onRename, onDelete }) {
  if (!tasks.length)
    return (
      <div className="empty-state">
        <div className="empty-icon">○</div>
        <strong>No tasks here yet.</strong>
        <span>
          Add something small and useful. Momentum starts with one clear action.
        </span>
      </div>
    );
  return (
    <div>
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          onToggle={(v) => onToggle(task.id, v)}
          onRename={(v) => onRename(task.id, v)}
          onDelete={() => onDelete(task.id)}
        />
      ))}
    </div>
  );
}

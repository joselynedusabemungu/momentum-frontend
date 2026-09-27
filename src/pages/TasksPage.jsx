import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AddTaskForm from "../components/AddTaskForm";
import TaskList from "../components/TaskList";
import { api } from "../api/client";

export default function TasksPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const q = useQuery({
    queryKey: ["tasks"],
    queryFn: () => api.listTasks(100, 0),
  });
  const refresh = () =>
    ["tasks", "stats", "events"].forEach((key) =>
      qc.invalidateQueries({ queryKey: [key] }),
    );
  const add = useMutation({ mutationFn: api.createTask, onSuccess: refresh });
  const toggle = useMutation({
    mutationFn: ({ id, value }) => api.updateTask(id, { is_complete: value }),
    onSuccess: refresh,
  });
  const rename = useMutation({
    mutationFn: ({ id, title }) => api.updateTask(id, { title }),
    onSuccess: refresh,
  });
  const del = useMutation({ mutationFn: api.deleteTask, onSuccess: refresh });
  const tasks = q.data?.items || [];
  const filtered = useMemo(
    () =>
      tasks.filter(
        (t) =>
          (filter === "all" ||
            (filter === "active" && !t.is_complete) ||
            (filter === "completed" && t.is_complete)) &&
          t.title.toLowerCase().includes(search.toLowerCase()),
      ),
    [tasks, filter, search],
  );

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <div className="eyebrow">WORK IN MOTION</div>
          <h1>Tasks</h1>
          <p>
            Capture the work, give it a deadline when it matters, and keep
            moving.
          </p>
        </div>
        <div className="heading-count">
          <strong>{tasks.filter((t) => !t.is_complete).length}</strong>
          <span>open</span>
        </div>
      </section>
      <AddTaskForm
        onAdd={(payload) => add.mutateAsync(payload)}
        isPending={add.isPending}
      />
      <section className="panel large-list">
        <div className="list-toolbar">
          <div className="filters">
            {["all", "active", "completed"].map((v) => (
              <button
                type="button"
                key={v}
                className={filter === v ? "active" : ""}
                onClick={() => setFilter(v)}
              >
                {v[0].toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your tasks…"
          />
        </div>
        <TaskList
          tasks={filtered}
          onToggle={(id, value) => toggle.mutate({ id, value })}
          onRename={(id, title) => rename.mutate({ id, title })}
          onDelete={(id) =>
            window.confirm("Delete this task?") && del.mutate(id)
          }
        />
      </section>
    </div>
  );
}

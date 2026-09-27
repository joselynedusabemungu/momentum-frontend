import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import GoalList from "../components/GoalList";
import { api } from "../api/client";

export default function GoalsPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["goals"], queryFn: api.listGoals });
  const refresh = () => qc.invalidateQueries({ queryKey: ["goals"] });
  const create = useMutation({
    mutationFn: api.createGoal,
    onSuccess: refresh,
  });
  const update = useMutation({
    mutationFn: ({ id, payload }) => api.updateGoal(id, payload),
    onSuccess: refresh,
  });
  const goals = q.data || [];
  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <div className="eyebrow">LONG-TERM DIRECTION</div>
          <h1>Goals</h1>
          <p>Give your tasks somewhere meaningful to go.</p>
        </div>
        <div className="heading-count">
          <strong>{goals.filter((g) => g.status === "active").length}</strong>
          <span>active</span>
        </div>
      </section>
      <GoalList
        goals={goals}
        onCreate={(payload) => create.mutateAsync(payload)}
        onUpdate={(id, payload) => update.mutate({ id, payload })}
        isPending={create.isPending}
      />
    </div>
  );
}

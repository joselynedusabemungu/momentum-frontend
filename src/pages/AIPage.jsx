import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AIAssistant from "../components/AIAssistant";
import GmailInbox from "../components/Gmailinbox";
import { api } from "../api/client";

export default function AIPage() {
  const [conversationId, setConversationId] = useState(null);
  const qc = useQueryClient();
  const gmailQ = useQuery({
    queryKey: ["gmail-status"],
    queryFn: api.gmailStatus,
  });
  const chat = useMutation({
    mutationFn: ({ message, conversationId }) =>
      api.chat(message, conversationId),
    onSuccess: () => {
      ["tasks", "goals", "stats", "events"].forEach((k) =>
        qc.invalidateQueries({ queryKey: [k] }),
      );
    },
  });
  const onChat = (message, cid) =>
    chat.mutateAsync({ message, conversationId: cid });
  return (
    <div className="page-stack ai-page">
      <section className="page-heading">
        <div>
          <div className="eyebrow">YOUR INTELLIGENCE LAYER</div>
          <h1>AI Coach</h1>
          <p>
            Plan, prioritize, break down work, and turn good intentions into the
            next concrete action.
          </p>
        </div>
      </section>
      <div className="ai-layout">
        <AIAssistant
          onChat={onChat}
          conversationId={conversationId}
          setConversationId={setConversationId}
          actions={[]}
        />
        <aside className="ai-side-panel">
          <div className="eyebrow">WHAT I CAN DO</div>
          <div className="ai-capability">
            <span>01</span>
            <div>
              <strong>Prioritize</strong>
              <p>
                Look at deadlines, goals and workload to find your best next
                move.
              </p>
            </div>
          </div>
          <div className="ai-capability">
            <span>02</span>
            <div>
              <strong>Act</strong>
              <p>
                Create tasks, complete tasks, reopen work and create goals
                through controlled tools.
              </p>
            </div>
          </div>
          <div className="ai-capability">
            <span>03</span>
            <div>
              <strong>Follow through</strong>
              <p>
                Connect your reminders so Momentum can keep you accountable
                outside the app.
              </p>
            </div>
          </div>
        </aside>
      </div>
      <GmailInbox connected={Boolean(gmailQ.data?.connected)} onChat={onChat} />
    </div>
  );
}

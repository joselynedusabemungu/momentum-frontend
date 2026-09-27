import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";

export default function GmailInbox({ connected, onChat }) {
  const qc = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [body, setBody] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const messagesQ = useQuery({
    queryKey: ["gmail-messages"],
    queryFn: () => api.gmailMessages(10),
    enabled: connected,
  });
  const draft = useMutation({
    mutationFn: () =>
      onChat(
        `Draft a concise, professional email reply to this message. Return only the reply body, without a subject or greeting explanation.\n\nFrom: ${selected.sender}\nSubject: ${selected.subject}\nMessage:\n${selected.body || selected.snippet}`,
        null,
      ),
    onSuccess: (result) => {
      setBody(result.message || "");
      setReviewed(false);
    },
  });
  const send = useMutation({
    mutationFn: () =>
      api.gmailReplySend({
        message_id: selected.id,
        thread_id: selected.thread_id,
        to: selected.sender,
        subject: selected.subject,
        body,
      }),
    onSuccess: () => {
      setReviewed(false);
      qc.invalidateQueries({ queryKey: ["gmail-messages"] });
    },
  });

  if (!connected) return null;
  return (
    <section className="panel gmail-inbox">
      <div className="panel-head">
        <div>
          <div className="eyebrow">AI-ASSISTED EMAIL</div>
          <h2>Recent Gmail messages</h2>
        </div>
        <button
          className="secondary-button"
          onClick={() => messagesQ.refetch()}
          disabled={messagesQ.isFetching}
        >
          {messagesQ.isFetching ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <div className="gmail-grid">
        <div className="gmail-list">
          {messagesQ.data?.length ? (
            messagesQ.data.map((message) => (
              <button
                className={`gmail-message ${selected?.id === message.id ? "selected" : ""}`}
                key={message.id}
                onClick={() => {
                  setSelected(message);
                  setBody("");
                  setReviewed(false);
                }}
              >
                <strong>{message.subject}</strong>
                <small>{message.sender}</small>
                <span>{message.snippet}</span>
              </button>
            ))
          ) : (
            <div className="empty-state compact">No recent inbox messages.</div>
          )}
        </div>
        <div className="gmail-reply">
          {selected ? (
            <>
              <div className="email-context">
                <strong>{selected.subject}</strong>
                <small>{selected.sender}</small>
                <p>{selected.body || selected.snippet}</p>
              </div>
              <div className="reply-actions">
                <button
                  className="secondary-button"
                  onClick={() => draft.mutate()}
                  disabled={draft.isPending}
                >
                  {draft.isPending ? "Drafting…" : "Draft with Momentum AI"}
                </button>
              </div>
              <textarea
                value={body}
                onChange={(event) => {
                  setBody(event.target.value);
                  setReviewed(false);
                }}
                placeholder="Review or write your reply…"
                rows={7}
              />
              <label className="review-check">
                <input
                  type="checkbox"
                  checked={reviewed}
                  onChange={(event) => setReviewed(event.target.checked)}
                />{" "}
                I reviewed the recipient, subject, and exact message.
              </label>
              <button
                className="primary-button"
                onClick={() => send.mutate()}
                disabled={!body.trim() || !reviewed || send.isPending}
              >
                {send.isPending ? "Sending…" : "Send reply"}
              </button>
            </>
          ) : (
            <div className="empty-state compact">
              Select a message to read and reply.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

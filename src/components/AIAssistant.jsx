import { useEffect, useRef, useState } from "react";
export default function AIAssistant({
  onChat,
  conversationId,
  setConversationId,
  actions,
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const end = useRef(null);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const send = async (text = input) => {
    const value = text.trim();
    if (!value || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: value }]);
    setBusy(true);
    try {
      const res = await onChat(value, conversationId);
      setConversationId(res.conversation_id);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: res.message, actions: res.actions },
      ]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `I couldn't complete that request: ${e.message}`,
        },
      ]);
    } finally {
      setBusy(false);
    }
  };
  const quick = [
    "What should I focus on today?",
    "Plan my day",
    "Review my progress",
    "Break down my next task",
  ];
  return (
    <div className="ai-card">
      <div className="ai-head">
        <div>
          <div className="eyebrow">MOMENTUM AI</div>
          <h2>Your progress copilot</h2>
        </div>
        <span className="ai-status">
          <i />{" "}
          {actions?.length
            ? `${actions.length} action${actions.length > 1 ? "s" : ""}`
            : "Ready"}
        </span>
      </div>
      <div className="chat">
        <div className="assistant-intro">
          <div className="ai-orb">✦</div>
          <strong>What would make today feel successful?</strong>
          <span>
            I can read your tasks, goals and progress — and help you turn them
            into a clear next step.
          </span>
        </div>
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            {m.content}
            {m.actions?.length > 0 && (
              <div className="action-note">
                ✓ {m.actions.length} workspace action
                {m.actions.length > 1 ? "s" : ""} completed
              </div>
            )}
          </div>
        ))}
        {busy && (
          <div className="bubble assistant thinking">
            Thinking<span> · · ·</span>
          </div>
        )}
        <div ref={end} />
      </div>
      <div className="quick-actions">
        {quick.map((q) => (
          <button key={q} onClick={() => send(q)}>
            {q}
          </button>
        ))}
      </div>
      <form
        className="chat-input"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Momentum anything about your progress…"
        />
        <button className="primary-button" disabled={busy || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

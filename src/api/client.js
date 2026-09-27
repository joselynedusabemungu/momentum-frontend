const API_URL = process.env.REACT_APP_API_URL || "";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

function csrfToken() {
  const row = document.cookie
    .split("; ")
    .find((item) => item.startsWith("progress_csrf_token="));
  return row ? decodeURIComponent(row.split("=").slice(1).join("=")) : null;
}

async function request(
  path,
  { method = "GET", body, auth = true, retry = true } = {},
) {
  const headers = {};
  if (body instanceof URLSearchParams)
    headers["Content-Type"] = "application/x-www-form-urlencoded";
  else if (body !== undefined) headers["Content-Type"] = "application/json";
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const token = csrfToken();
    if (token) headers["X-CSRF-Token"] = token;
  }
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    credentials: "include",
    body:
      body instanceof URLSearchParams
        ? body
        : body !== undefined
          ? JSON.stringify(body)
          : undefined,
  });
  if (
    response.status === 403 &&
    retry &&
    ["POST", "PUT", "PATCH", "DELETE"].includes(method)
  ) {
    try {
      await request("/auth/csrf", { auth: false, retry: false });
      return request(path, { method, body, auth, retry: false });
    } catch {}
  }
  if (response.status === 204) return null;
  let data = null;
  try {
    data = await response.json();
  } catch {}
  if (!response.ok)
    throw new ApiError(
      typeof data?.detail === "string"
        ? data.detail
        : `Request failed (${response.status})`,
      response.status,
    );
  return data;
}

export const api = {
  register: (payload) =>
    request("/auth/register", { method: "POST", body: payload, auth: false }),
  login: (email, password) =>
    request("/auth/session", {
      method: "POST",
      body: { email, password },
      auth: false,
    }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request("/auth/me"),
  csrf: () => request("/auth/csrf", { auth: false, retry: false }),
  listTasks: (limit = 100, offset = 0) =>
    request(`/tasks?limit=${limit}&offset=${offset}`),
  createTask: (payload) => request("/tasks", { method: "POST", body: payload }),
  updateTask: (id, payload) =>
    request(`/tasks/${id}`, { method: "PATCH", body: payload }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
  getStats: () => request("/stats"),
  listEvents: (limit = 20, offset = 0) =>
    request(`/events?limit=${limit}&offset=${offset}`),
  listGoals: () => request("/goals"),
  createGoal: (payload) => request("/goals", { method: "POST", body: payload }),
  updateGoal: (id, payload) =>
    request(`/goals/${id}`, { method: "PATCH", body: payload }),
  chat: (message, conversation_id = null) =>
    request("/agent/chat", {
      method: "POST",
      body: { message, conversation_id },
    }),
  conversations: () => request("/agent/conversations"),
  conversation: (id) => request(`/agent/conversations/${id}`),
  agentActions: () => request("/agent/actions"),
  notificationSettings: () => request("/notifications/settings"),
  updateNotificationSettings: (payload) =>
    request("/notifications/settings", { method: "PATCH", body: payload }),
  gmailStatus: () => request("/notifications/gmail/status"),
  gmailConnect: () => request("/notifications/gmail/connect"),
  gmailDisconnect: () => request("/notifications/gmail", { method: "DELETE" }),
  gmailTest: () => request("/notifications/gmail/test", { method: "POST" }),
  gmailMessages: (limit = 10) =>
    request(`/notifications/gmail/messages?limit=${limit}`),
  gmailReplyDraft: (payload) =>
    request("/notifications/gmail/reply/draft", {
      method: "POST",
      body: payload,
    }),
  gmailReplySend: (payload) =>
    request("/notifications/gmail/reply/send", {
      method: "POST",
      body: { ...payload, confirm: true },
    }),
  notificationHistory: () => request("/notifications/history"),
};

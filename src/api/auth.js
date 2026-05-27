const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "요청에 실패했습니다.");
  return data;
}

export function login({ userId, password }) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ userId, password }),
  });
}

export function checkDuplicateId(userId) {
  return request(`/api/auth/check-id?userId=${encodeURIComponent(userId)}`);
}

export function requestPhoneVerification(phone) {
  return request("/api/auth/phone/request", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });
}

export function register(formData) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

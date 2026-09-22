const WELLNESS_API_BASE_URL = "http://localhost:5000/api";

async function wellnessApiRequest(path, options = {}) {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${WELLNESS_API_BASE_URL}${path}`, {
        ...options,
        headers
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Wellness API request failed");
    }

    return payload.data;
}
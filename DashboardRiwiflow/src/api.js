// --- REST API COMMUNICATION LAYER ---

export const BASE_URL = "http://localhost:3000";

// --- SESSION STORAGE MANAGEMENT ---
export const saveSession = (user) =>
  localStorage.setItem("riwiflow_user", JSON.stringify(user));

export const getSession = () =>
  JSON.parse(localStorage.getItem("riwiflow_user"));

export const clearSession = () =>
  localStorage.removeItem("riwiflow_user");

// --- API FETCH WRAPPER ---
async function request(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.statusText}`);
  }

  return response.status !== 204
    ? await response.json()
    : null;
}

// --- COMBINED FETCH: retrieves users and tasks in parallel ---
export const getAllData = async () => {
  const [users, tasks] = await Promise.all([
    request(`${BASE_URL}/users`),
    getTasks(),
  ]);

  return { users, tasks };
};

// --- SERVICES ---
export const loginUser = async (email, password) => {
  const users = await request(
    `${BASE_URL}/users?email=${encodeURIComponent(email)}`
  );

  return (
    users.find(
      u => u.email === email && u.password === password
    ) || null
  );
};

export const getTasks = async () => {
  try {
    const res = await request(`${BASE_URL}/tasks?_expand=user`);
    if (Array.isArray(res) && res.length > 0) {
      return res;
    }
  } catch (err) {}

  try {
    const res = await request(`${BASE_URL}/tasks?_embed=user`);
    if (Array.isArray(res) && res.length > 0) {
      return res;
    }
  } catch (err) {}

  return await request(`${BASE_URL}/tasks`);
};

export const getTaskById = async (id) => {
  try {
    const res = await request(`${BASE_URL}/tasks/${id}?_expand=user`);
    if (res && (res.id || res.userId)) {
      return res;
    }
  } catch (err) {}

  try {
    const res = await request(`${BASE_URL}/tasks/${id}?_embed=user`);
    if (res && (res.id || res.userId)) {
      return res;
    }
  } catch (err) {}

  return await request(`${BASE_URL}/tasks/${id}`);
};

export const deleteTask = (id) =>
  request(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE"
  });

export const createTask = (task) =>
  request(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(task)
  });

export const updateTask = (id, data) =>
  request(`${BASE_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

export const getUsers = () =>
  request(`${BASE_URL}/users`);

export const getUserById = (id) =>
  request(`${BASE_URL}/users/${id}`);

export const deleteUser = (id) =>
  request(`${BASE_URL}/users/${id}`, {
    method: "DELETE"
  });

export const createUser = (userData) =>
  request(`${BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

export const updateUser = (id, data) =>
  request(`${BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
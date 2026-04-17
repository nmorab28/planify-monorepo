const API_URL = process.env.REACT_APP_API_URL;

export const getTeachers = async () => {
  const res = await fetch(`${API_URL}/api/teachers`);
  const data = await res.json();
  return data.data;
};

export const createTeacher = async (teacher) => {
  const res = await fetch(`${API_URL}/api/teachers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: teacher,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(JSON.stringify(data));
  }
  return data;
  };

export const updateTeacher = async (documentId, teacher) => {
  const res = await fetch(`${API_URL}/api/teachers/${documentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: teacher,
    }),
  });

  return res.json();
};

export const deleteTeacher = async (documentId) => {
  const res = await fetch(`${API_URL}/api/teachers/${documentId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    let errorMsg = "Error eliminando";
    try {
      const err = await res.json();
      errorMsg = err.error?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  return res;
};

export const getTeacherById = async (documentId) => {
  const res = await fetch(`${API_URL}/api/teachers/${documentId}`);
  const data = await res.json();
  return data.data;
};

import api from "./axios";

export interface Category {
  _id: string;
  name: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const res = await api.get("/api/categories");
  return res.data;
};

export const createCategory = async (name: string) => {
  const res = await api.post("/api/categories", { name });
  return res.data;
};

export const deleteCategory = async (id: string) => {
  const res = await api.delete(`/api/categories/${id}`);
  return res.data;
};

// Sửa category
export const updateCategory = async (id: string, name: string) => {
  const res = await api.put(`/api/categories/${id}`, { name });
  return res.data;
};
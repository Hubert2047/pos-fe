import api from "./axios";

export interface Item {
  _id: string;
  name: string;
  base_price: number;
}

export const getItems = async (): Promise<Item[]> => {
  const res = await api.get("/items");
  return res.data.data;
};
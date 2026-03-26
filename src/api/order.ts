import api from "./axios";
export interface OrderItem {
  item_id: string;
  name: string;
  quantity: number;
  basePrice: number;
  modifiers: { name: string; priceExtra: number }[];
  noteOptions: string[];
}

export interface Order {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  status: "pending" | "paid" | "cancelled";
  paymentMethod: string,
  createdAt: string;
  updatedAt: string;
}

export const fetchOrders = async (): Promise<Order[]> => {
  const res = await api.get("orders");
  return res.data.data;
};

export const fetchOrderById = async (id: string): Promise<Order> => {
  const res = await api.get(`orders/${id}`);
  return res.data.data;
};

export const createOrder = async (items: OrderItem[]): Promise<Order> => {
  const res = await api.post("orders", { items });
  return res.data.data;
};

export const updateOrder = async (
  id: string,
  data: Partial<Order>
): Promise<Order> => {
  const res = await api.put(`orders/${id}`, data);
  return res.data.data;
};

export const deleteOrder = async (id: string) => {
  const res = await api.delete(`orders/${id}`);
  return res.data;
};
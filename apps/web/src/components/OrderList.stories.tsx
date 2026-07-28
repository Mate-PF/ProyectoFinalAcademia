import type { Meta, StoryObj } from "@storybook/react";
import { OrderList } from "./OrderList";
import type { OrderDTO } from "../api/client";

const orders: OrderDTO[] = [
  { id: "a1b2c3d4e5", customerId: "c", restaurantId: "r", status: "PENDIENTE", delivererId: null, total: { amount: 3000, currency: "ARS" }, items: [{ menuItemId: "m", name: "Muzza", unitPrice: { amount: 1500, currency: "ARS" }, quantity: 2 }] },
  { id: "f6g7h8i9j0", customerId: "c", restaurantId: "r", status: "EN_CAMINO", delivererId: "rep1", total: { amount: 1800, currency: "ARS" }, items: [{ menuItemId: "n", name: "Napo", unitPrice: { amount: 1800, currency: "ARS" }, quantity: 1 }] },
];

const meta: Meta<typeof OrderList> = { title: "Componentes/OrderList", component: OrderList };
export default meta;
type Story = StoryObj<typeof OrderList>;
export const ConPedidos: Story = { args: { orders } };
export const ConAcciones: Story = {
  args: { orders, renderActions: () => <button type="button" className="rounded-lg bg-brand px-3 py-1 text-sm font-semibold text-white">Confirmar</button> },
};
export const Vacio: Story = { args: { orders: [] } };
